using Microsoft.EntityFrameworkCore;
using iOmniEYE.Models;
using System.Collections.Generic;

namespace iOmniEYE.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<ClientRequest> ClientRequests { get; set; }
        public DbSet<CrmUser> CrmUsers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ClientRequest>()
                .HasOne(r => r.AssignedUser)
                .WithMany(u => u.AssignedRequests)
                .HasForeignKey(r => r.AssignedUserId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }

}