using Microsoft.AspNetCore.Mvc;
using Savings.Api.Models;

namespace Savings.Api.Controllers
{
    [ApiController]
    [Route("api/snapshots")]
    public class SnapshotsController : ControllerBase
    {
        private static readonly List<MonthlySnapshot> _snapshots = new();

        // GET /api/snapshots
        [HttpGet]
        public ActionResult<List<MonthlySnapshot>> GetAll()
        {
            return Ok(_snapshots);
        }

        // GET /api/snapshots/{id}
        [HttpGet("{id}")]
        public ActionResult<MonthlySnapshot> GetById(int id)
        {
            var snapshot = _snapshots.FirstOrDefault(x => x.Id == id);
            if (snapshot == null) return NotFound();
            return Ok(snapshot);
        }

        // POST /api/snapshots
        [HttpPost]
        public IActionResult Save(MonthlySnapshot snapshot)
        {
            if (snapshot.Id == 0)
            {
                // Novo registo: gerar Id automático
                snapshot.Id = _snapshots.Count > 0 ? _snapshots.Max(x => x.Id) + 1 : 1;
                _snapshots.Add(snapshot);
            }
            else
            {
                // Edição: procurar pelo Id existente
                var existing = _snapshots.FirstOrDefault(x => x.Id == snapshot.Id);
                if (existing == null) return NotFound();

                existing.Year = snapshot.Year;
                existing.Month = snapshot.Month;
                existing.TechEtf = snapshot.TechEtf;
                existing.TechEtfInv = snapshot.TechEtfInv;
                existing.Sp500 = snapshot.Sp500;
                existing.Sp500Inv = snapshot.Sp500Inv;
                existing.SafetyFund = snapshot.SafetyFund;
                existing.CheckingAccount = snapshot.CheckingAccount;
            }

            return Ok(snapshot);
        }

        // DELETE /api/snapshots/{id}  (opcional, mas útil)
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var existing = _snapshots.FirstOrDefault(x => x.Id == id);
            if (existing == null) return NotFound();

            _snapshots.Remove(existing);
            return NoContent();
        }
    }
}
