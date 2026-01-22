using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Savings.Api.Data;
using Savings.Api.Models;
using BC = BCrypt.Net.BCrypt;

namespace Savings.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserDto request)
        {
            // Encriptar a password antes de guardar
            string passwordHash = BC.HashPassword(request.Password);

            var user = new User
            {
                Username = request.Username,
                PasswordHash = passwordHash
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok("Utilizador criado com sucesso!");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserDto request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);

            if (user == null || !BC.Verify(request.Password, user.PasswordHash))
            {
                return BadRequest("Utilizador ou password incorretos.");
            }

            return Ok("Login efetuado! (Próximo passo: Gerar o Token JWT)");
        }
    }

    // Objeto auxiliar para receber os dados do JSON
    public class UserDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}