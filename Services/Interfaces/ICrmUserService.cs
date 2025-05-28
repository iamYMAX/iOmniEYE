using iOmniEYE.Models;

namespace iOmniEYE.Services.Interfaces
{
    public interface ICrmUserService
    {
        Task<CrmUser?> GetUserByTelegramIdAsync(long telegramId);
        Task<CrmUser?> GetUserByIdAsync(int userId);

    }


}
