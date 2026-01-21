using Microsoft.EntityFrameworkCore;
using Savings.Api.Models; // Ajusta para o namespace onde está o teu MonthlySnapshot

namespace Savings.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<MonthlySnapshot> Snapshots { get; set; }
    }
}