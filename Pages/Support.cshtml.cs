using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using iOmniEYE.Models;
using iOmniEYE.Data;
using iOmniEYE.Services;
using System;
using System.Threading.Tasks;


namespace iOmniEYE.Pages
{
    public class RequestModel : PageModel
    {
        [BindProperty]
        public ClientRequest ClientRequest { get; set; }

        public int CaptchaNum1 { get; set; }
        public int CaptchaNum2 { get; set; }
        [BindProperty]
        public int CaptchaAnswer { get; set; }

        private readonly ApplicationDbContext _context;
        private readonly ITelegramBotService _telegramBotService;

        //public RequestModel(ApplicationDbContext context, ITelegramBotService telegramBotService)
        //{
        //    _context = context;
        //    _telegramBotService = telegramBotService;
        //}

        public void OnGet()
        {
            var rnd = new Random();
            CaptchaNum1 = rnd.Next(1, 10);
            CaptchaNum2 = rnd.Next(1, 10);
        }
        private readonly ILogger<RequestModel> _logger;

        public RequestModel(ApplicationDbContext context, ITelegramBotService telegramBotService, ILogger<RequestModel> logger)
        {
            _context = context;
            _telegramBotService = telegramBotService;
            _logger = logger;
        }
        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            try
            {
                ClientRequest.AssignedUserId = null;
                _context.ClientRequests.Add(ClientRequest);
                await _context.SaveChangesAsync();

                // Отправляем уведомление админу
                await _telegramBotService.SendRequestToAdminAsync(ClientRequest);

                return RedirectToPage("/Success");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при сохранении ClientRequest");
                Console.WriteLine($"Ошибка при сохранении: {ex.Message}");
                ModelState.AddModelError(string.Empty, "Ошибка при сохранении данных");
                return Page();
            }
        }
    }
}
