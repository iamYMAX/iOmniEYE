using Telegram.Bot;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using Telegram.Bot.Types.ReplyMarkups;
using iOmniEYE.Data;
using iOmniEYE.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace iOmniEYE.Services
{
    public interface ITelegramBotService
    {
        Task SendRequestAsync(ClientRequest request);
        Task SendRequestToAdminAsync(ClientRequest request);
        Task SendRequestToAssignedAndGeneralAsync(ClientRequest request);
        Task HandleCallbackQueryAsync(string callbackData, long telegramId);
        Task HandleMyTicketsCommand(long telegramId);
        Task ListenUpdates(CancellationToken stoppingToken);
    }
    public class TelegramBotService : ITelegramBotService
    {
        private readonly ITelegramBotClient _botClient;
        private readonly IServiceScopeFactory _scopeFactory;

        private const long AdminChatId = 907191168;    // id чата администратора
        private const long GeneralChatId = -1002609364075;  // id общего чата

        public TelegramBotService(IConfiguration configuration, IServiceScopeFactory scopeFactory)
        {
            var token = configuration["TelegramBot:Token"];
            _botClient = new TelegramBotClient(token);
            _scopeFactory = scopeFactory;
        }

        public async Task SendRequestAsync(ClientRequest request)
        {
            await SendNewRequestNotification(request);
        }

        private async Task SendNewRequestNotification(ClientRequest request)
        {
            var message = $"📥 Новая заявка от {request.ClientName}:\n" +
                          $"🏢 Компания: {request.CompanyName}\n" +
                          $"📞 Телефон: {request.PhoneNumber}\n" +
                          $"📧 Email: {request.Email}\n" +
                          $"📝 Сообщение: {request.Message}";

            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            var recipients = await context.CrmUsers.ToListAsync();

            foreach (var user in recipients)
            {
                try
                {
                    await _botClient.SendTextMessageAsync(
                        chatId: user.TelegramId,
                        text: message
                    );
                    Console.WriteLine($"Сообщение отправлено пользователю {user.TelegramUsername} ({user.TelegramId})");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Ошибка при отправке сообщения пользователю {user.TelegramUsername}: {ex.Message}");
                }
            }
        }

        public async Task SendRequestToAdminAsync(ClientRequest request)
        {
            var message = $"📥 Новая заявка от {request.ClientName}:\n" +
                          $"🏢 Компания: {request.CompanyName}\n" +
                          $"📞 Телефон: {request.PhoneNumber}\n" +
                          $"📝 Сообщение: {request.Message}";

            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            var users = await context.CrmUsers.ToListAsync();

            var buttons = new InlineKeyboardMarkup(
                users.Select(u => InlineKeyboardButton.WithCallbackData(u.DisplayName, $"assign_{request.Id}_{u.Id}"))
                     .ToArray()
            );

            await _botClient.SendTextMessageAsync(
                chatId: AdminChatId,
                text: message,
                replyMarkup: buttons
            );
        }

        public async Task SendRequestToAssignedAndGeneralAsync(ClientRequest request)
        {
            if (!request.AssignedUserId.HasValue)
                return;

            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            var assignedUser = await context.CrmUsers.FindAsync(request.AssignedUserId.Value);
            if (assignedUser == null)
                return;

            var message = $"📥 Заявка #{request.Id} назначена пользователю {assignedUser.DisplayName}:\n" +
                          $"От: {request.ClientName}\n" +
                          $"Компания: {request.CompanyName}\n" +
                          $"Телефон: {request.PhoneNumber}\n" +
                          $"Сообщение: {request.Message}";

            var buttons = new InlineKeyboardMarkup(new[]
            {
                new[] { InlineKeyboardButton.WithCallbackData("Принять", $"accept_{request.Id}") },
                new[] { InlineKeyboardButton.WithCallbackData("Отклонить", $"reject_{request.Id}") },
                new[] { InlineKeyboardButton.WithCallbackData("В работе", $"inprogress_{request.Id}") },
                new[] { InlineKeyboardButton.WithCallbackData("Завершена", $"done_{request.Id}") }
            });

            await _botClient.SendTextMessageAsync(
                chatId: assignedUser.TelegramId,
                text: message,
                replyMarkup: buttons
            );

            await _botClient.SendTextMessageAsync(
                chatId: GeneralChatId,
                text: message,
                replyMarkup: buttons
            );
        }

        public async Task HandleCallbackQueryAsync(string callbackData, long telegramId)
        {
            var parts = callbackData.Split('_');
            if (parts.Length < 2)
                return;

            var command = parts[0];

            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            if (command == "assign" && parts.Length == 3)
            {
                if (telegramId != AdminChatId)
                    return;

                if (!int.TryParse(parts[1], out int requestId) ||
                    !int.TryParse(parts[2], out int userId))
                    return;

                var request = await context.ClientRequests.FindAsync(requestId);
                if (request == null)
                    return;

                request.AssignedUserId = userId;
                request.Status = "Assigned";

                await context.SaveChangesAsync();

                await SendRequestToAssignedAndGeneralAsync(request);

                await _botClient.SendTextMessageAsync(
                    chatId: AdminChatId,
                    text: $"Заявка #{request.Id} назначена пользователю с ID {userId}"
                );

                return;
            }

            if (!int.TryParse(parts[1], out int reqId))
                return;

            var req = await context.ClientRequests.Include(r => r.AssignedUser).FirstOrDefaultAsync(r => r.Id == reqId);
            if (req == null)
                return;

            if (req.AssignedUser == null)
                return;

            if (telegramId != req.AssignedUser.TelegramId)
                return;

            switch (command)
            {
                case "accept":
                    req.Status = "In Progress";
                    break;

                case "reject":
                    req.Status = "Rejected";
                    req.AssignedUserId = null;
                    await context.SaveChangesAsync();

                    await SendRequestToAdminAsync(req);

                    await _botClient.SendTextMessageAsync(
                        chatId: telegramId,
                        text: $"Вы отклонили заявку #{req.Id}. Она возвращена админу для повторного назначения."
                    );
                    return;

                case "inprogress":
                    req.Status = "In Progress";
                    break;

                case "done":
                    req.Status = "Done";
                    break;

                default:
                    return;
            }

            await context.SaveChangesAsync();

            await _botClient.SendTextMessageAsync(
                chatId: telegramId,
                text: $"Статус заявки #{req.Id} обновлен на: {req.Status}"
            );
        }

        public async Task HandleMyTicketsCommand(long telegramId)
        {
            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            var user = await context.CrmUsers
                .Include(u => u.AssignedRequests)
                .FirstOrDefaultAsync(u => u.TelegramId == telegramId);

            if (user == null)
            {
                await _botClient.SendTextMessageAsync(telegramId, "Вы не зарегистрированы в системе.");
                return;
            }

            if (user.AssignedRequests == null || !user.AssignedRequests.Any())
            {
                await _botClient.SendTextMessageAsync(telegramId, "У вас нет назначенных заявок.");
                return;
            }

            foreach (var req in user.AssignedRequests)
            {
                var msg = $"Заявка #{req.Id}\n" +
                          $"От: {req.ClientName}\n" +
                          $"Сообщение: {req.Message}\n" +
                          $"Статус: {req.Status}";

                var buttons = new InlineKeyboardMarkup(new[]
                {
                    new[] { InlineKeyboardButton.WithCallbackData("В работе", $"inprogress_{req.Id}") },
                    new[] { InlineKeyboardButton.WithCallbackData("Закрыта", $"closed_{req.Id}") },
                    new[] { InlineKeyboardButton.WithCallbackData("Отменена", $"cancelled_{req.Id}") }
                });

                await _botClient.SendTextMessageAsync(
                    chatId: telegramId,
                    text: msg,
                    replyMarkup: buttons
                );
            }
        }

        public async Task ListenUpdates(CancellationToken stoppingToken)
        {
            int offset = 0;

            while (!stoppingToken.IsCancellationRequested)
            {
                var updates = await _botClient.GetUpdatesAsync(
                    offset: offset,
                    timeout: 10,
                    cancellationToken: stoppingToken
                );

                foreach (var update in updates)
                {
                    offset = update.Id + 1;

                    if (update.Type == Telegram.Bot.Types.Enums.UpdateType.Message && update.Message is not null)
                    {
                        await HandleMessage(update.Message);
                    }
                    else if (update.Type == Telegram.Bot.Types.Enums.UpdateType.CallbackQuery && update.CallbackQuery is not null)
                    {
                        await HandleCallbackQueryAsync(update.CallbackQuery.Data, update.CallbackQuery.From.Id);
                    }
                }

                await Task.Delay(1000, stoppingToken);
            }
        }

        private async Task HandleMessage(Message message)
        {
            if (string.IsNullOrEmpty(message.Text)) return;

            switch (message.Text.ToLower())
            {
                case "/start":
                    await _botClient.SendTextMessageAsync(message.Chat.Id, "Привет! Используйте команду /mytickets для просмотра ваших заявок.");
                    break;

                case "/mytickets":
                    await HandleMyTicketsCommand(message.Chat.Id);
                    break;

                default:
                    await _botClient.SendTextMessageAsync(message.Chat.Id, "Неизвестная команда. Попробуйте /mytickets.");
                    break;
            }
        }
    }
}
