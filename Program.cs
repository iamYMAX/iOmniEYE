using iOmniEYE.Data;
using iOmniEYE.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ? ����������� ApplicationDbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddSingleton<ITelegramBotService, TelegramBotService>();
builder.Services.AddHostedService<BotBackgroundService>();


// ? ����������� TelegramBotService
builder.Services.AddScoped<ITelegramBotService, TelegramBotService>();

// ? ����������� ����������� Razor Pages
builder.Services.AddRazorPages();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapRazorPages();

app.Run();
