using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Savings.Api.Data;
using Savings.Api.Models;

namespace Savings.Api.Controllers
{
    [ApiController]
    [Route("api/snapshots")]
    public class SnapshotsController : ControllerBase
    {
        private readonly AppDbContext _context;

        // O ASP.NET injeta o contexto da base de dados aqui automaticamente
        public SnapshotsController(AppDbContext context)
        {
            _context = context;
        }

        // GET /api/snapshots
        [HttpGet]
        public async Task<ActionResult<List<MonthlySnapshot>>> GetAll()
        {
            return await _context.Snapshots.ToListAsync();
        }

        // POST /api/snapshots (Cria ou Atualiza)
        [HttpPost]
        public async Task<IActionResult> Save(MonthlySnapshot snapshot)
        {
            if (snapshot.Id == 0)
            {
                _context.Snapshots.Add(snapshot);
            }
            else
            {
                var existing = await _context.Snapshots.FindAsync(snapshot.Id);
                if (existing == null) return NotFound();

                // Atualiza os valores
                _context.Entry(existing).CurrentValues.SetValues(snapshot);
            }

            await _context.SaveChangesAsync();
            return Ok(snapshot);
        }

        // DELETE /api/snapshots/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var snapshot = await _context.Snapshots.FindAsync(id);
            if (snapshot == null) return NotFound();

            _context.Snapshots.Remove(snapshot);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}