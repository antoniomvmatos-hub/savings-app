using Microsoft.EntityFrameworkCore;
using Savings.Api.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// --- 1. CONFIGURAÇÃO DA CHAVE JWT ---
// Usei a mesma string que tinhas, mas garanti que o código a processe bem
var key = Encoding.ASCII.GetBytes("Esta_Eh_Uma_Chave_Super_Secreta_Com_Pelo_Menos_32_Caracteres!'");

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,
        // IMPORTANTE: ClockSkew em Zero evita problemas de sincronização de horas entre PC e Servidor
        ClockSkew = TimeSpan.Zero
    };
});

// --- 2. CONFIGURAÇÃO DO CORS ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173", "http://localhost:5175")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// --- 3. CONFIGURAÇÃO DA BASE DE DADOS ---
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddOpenApi();

var app = builder.Build();

// --- 4. CONFIGURAÇÃO DO PIPELINE (A ORDEM IMPORTA!) ---
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapOpenApi();
}

// O CORS deve vir SEMPRE antes da Autenticação
app.UseCors("AllowReactApp");

app.UseHttpsRedirection();

// Primeiro o sistema verifica QUEM és
app.UseAuthentication();

// Depois verifica o que PODES fazer
app.UseAuthorization();

app.MapControllers();

app.Run();