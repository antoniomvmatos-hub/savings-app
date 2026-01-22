using Microsoft.EntityFrameworkCore;
using Savings.Api.Models;

namespace Savings.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<MonthlySnapshot> Snapshots { get; set; }

        // ADICIONA ESTA LINHA ABAIXO:
        public DbSet<User> Users { get; set; }
    }
}