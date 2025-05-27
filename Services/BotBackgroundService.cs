using iOmniEYE.Services;
using Microsoft.Extensions.Hosting;
using System.Threading;
using System.Threading.Tasks;

public class BotBackgroundService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;

    public BotBackgroundService(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var botService = scope.ServiceProvider.GetRequiredService<ITelegramBotService>();

        await botService.ListenUpdates(stoppingToken);
    }
}
