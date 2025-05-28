using iOmniEYE.Models;

namespace iOmniEYE.Services
{
    public interface IClientRequestService
    {

        Task<List<ClientRequest>> GetRequestsByUserIdAsync(int userId);
        Task<bool> CloseRequestAsync(int requestId);
        Task<bool> UpdateRequestStatusAsync(int requestId, string newStatus);
        Task<CrmUser?> GetUserByIdAsync(int userId);

        public interface IClientRequestService
        {
            Task<IEnumerable<ClientRequest>> GetRequestsByTelegramIdAsync(long telegramId);
        }
    }
}
