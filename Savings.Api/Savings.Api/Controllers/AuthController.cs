using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Savings.Api.Data;
using Savings.Api.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
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
            // Verifica se o utilizador já existe
            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            {
                return BadRequest("Este utilizador já existe.");
            }

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
                // Usamos Unauthorized (401) para falhas de credenciais no login
                return Unauthorized("Utilizador ou password incorretos.");
            }

            var token = GenerateJwtToken(user);
            return Ok(new { token });
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            // ATENÇÃO: Esta chave foi sincronizada exatamente com a do teu Program.cs
            // Contém o !' no final para bater certo com a validação do middleware.
            var key = Encoding.ASCII.GetBytes("Esta_Eh_Uma_Chave_Super_Secreta_Com_Pelo_Menos_32_Caracteres!'");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Username)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }

    public class UserDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}