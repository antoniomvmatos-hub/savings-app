var builder = WebApplication.CreateBuilder(args);

// --- 1. ADICIONA O SERVIÇO DE CORS AQUI ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // A porta do teu Vite/React
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});
// ------------------------------------------

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapOpenApi();
}

// --- 2. ATIVA O CORS AQUI (Antes do Authorization e MapControllers) ---
app.UseCors("AllowReactApp");
// ----------------------------------------------------------------------

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();