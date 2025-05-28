using iOmniEYE.Data;
using iOmniEYE.Models;
using iOmniEYE.Services;
using Microsoft.EntityFrameworkCore;
public class ClientRequestService : IClientRequestService
{

    private readonly ApplicationDbContext _context;

    public ClientRequestService(ApplicationDbContext context)
    {
        _context = context;
    }
    public async Task<CrmUser?> GetUserByIdAsync(int userId)
    {
        return await _context.CrmUsers.FirstOrDefaultAsync(u => u.Id == userId);
    }

    public async Task<List<ClientRequest>> GetRequestsByUserIdAsync(int userId)
    {
        return await _context.ClientRequests
            .Where(r => r.AssignedUserId == userId)
            .ToListAsync();
    }

    public async Task<bool> CloseRequestAsync(int requestId)
    {
        return await UpdateRequestStatusAsync(requestId, "Closed");
    }
   
    public async Task<bool> UpdateRequestStatusAsync(int requestId, string newStatus)
    {
        var request = await _context.ClientRequests.FindAsync(requestId);
        if (request == null) return false;

        request.Status = newStatus;
        await _context.SaveChangesAsync();
        return true;
    }
}
