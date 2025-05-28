using iOmniEYE.Data;
using iOmniEYE.Models;
using iOmniEYE.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace iOmniEYE.Services
{
    public class CrmUserService : ICrmUserService
    {
        private readonly ApplicationDbContext _context;
        private readonly ApplicationDbContext _dbContext;

        public CrmUserService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<CrmUser?> GetUserByIdAsync(int userId)
        {
            return await _dbContext.CrmUsers.FirstOrDefaultAsync(u => u.Id == userId);
        }


        public async Task<CrmUser?> GetUserByTelegramIdAsync(long telegramId)
        {
            return await _context.CrmUsers
                .FirstOrDefaultAsync(u => u.TelegramId == telegramId);
        }
    }

}
