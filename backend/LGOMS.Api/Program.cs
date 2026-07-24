using LGOMS.Application;
using LGOMS.Infrastructure;
using LGOMS.Application.Interfaces;
using LGOMS.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Register Clean Architecture Layers
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

// Register Tenant, Ward, and FiscalYear Service
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ITenantService, CurrentTenantService>();
builder.Services.AddScoped<IWardService, CurrentWardService>();
builder.Services.AddScoped<IFiscalYearService, CurrentFiscalYearService>();

// Configure JWT Authentication
var jwtSecret = builder.Configuration["JwtSettings:Secret"]!;
var jwtIssuer = builder.Configuration["JwtSettings:Issuer"]!;
var jwtAudience = builder.Configuration["JwtSettings:Audience"]!;

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
    });
builder.Services.AddAuthorization();

// CORS — allow all origins for public network access
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Only redirect to HTTPS if not running inside Docker (where no cert is available)
// ASPNETCORE_URLS=http://+:8080 means we're in Docker
var aspnetUrls = Environment.GetEnvironmentVariable("ASPNETCORE_URLS") ?? "";
if (!aspnetUrls.StartsWith("http://+"))
{
    app.UseHttpsRedirection();
}

app.UseStaticFiles();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Run database migrations and seed SuperAdmin (purging non-SuperAdmin users) on startup
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<LGOMS.Infrastructure.Persistence.ApplicationDbContext>();
    dbContext.Database.Migrate();
    await LGOMS.Infrastructure.Persistence.DbSeeder.SeedAsync(dbContext);
}

app.Run();
