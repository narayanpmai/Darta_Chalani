using LGOMS.Domain.Entities;
using LGOMS.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LGOMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    /// <summary>
    /// Login — JWT Token प्राप्त गर्नुहोस्
    /// </summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { message = "Username र Password आवश्यक छ।" });

        var inputUsername = request.Username.Trim().ToLower();

        // Find user — supports login by Username or Email (case-insensitive), ignoring tenant filter
        var user = await _context.Users
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(u => 
                (u.Username.ToLower() == inputUsername || u.Email.ToLower() == inputUsername) 
                && u.IsActive);

        if (user == null)
            return Unauthorized(new { message = "Invalid username or password" });

        // Verify password (BCrypt or plain-text fallback for migration)
        bool passwordValid = VerifyPassword(request.Password, user.PasswordHash);
        if (!passwordValid)
            return Unauthorized(new { message = "Invalid username or password" });

        // Update last login timestamp
        user.LastLoginAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        var token = GenerateJwtToken(user);

        return Ok(new
        {
            token,
            user = new
            {
                id = user.Id,
                username = user.Username,
                fullName = user.FullName,
                email = user.Email,
                role = user.Role,
                tenantId = user.TenantId,
                wardId = user.WardId,
                employeeCode = user.EmployeeCode
            }
        });
    }

    /// <summary>
    /// Register — नयाँ user थप्नुहोस् (Admin only — Tenants use /api/users)
    /// </summary>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (await _context.Users.IgnoreQueryFilters().AnyAsync(u => u.Username == request.Username))
            return BadRequest(new { message = "यो Username पहिले नै दर्ता भइसकेको छ।" });

        var user = new ApplicationUser
        {
            Username = request.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            FullName = request.FullName,
            Email = request.Email ?? string.Empty,
            EmployeeCode = request.EmployeeCode ?? string.Empty,
            Role = request.Role,
            TenantId = request.TenantId,
            IsActive = true
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "User सफलतापूर्वक दर्ता भयो।" });
    }

    /// <summary>
    /// Change Password — आफ्नो password परिवर्तन गर्नुहोस्
    /// </summary>
    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var userId = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (userId == null) return Unauthorized();

        var user = await _context.Users.IgnoreQueryFilters()
            .FirstOrDefaultAsync(u => u.Id == Guid.Parse(userId));
        if (user == null) return NotFound();

        if (!VerifyPassword(request.CurrentPassword, user.PasswordHash))
            return BadRequest(new { message = "हालको password गलत छ।" });

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Password सफलतापूर्वक परिवर्तन भयो।" });
    }

    // ─── Private Helpers ───────────────────────────────────────────────────────

    private bool VerifyPassword(string password, string storedHash)
    {
        // BCrypt hash detection (starts with $2a$ or $2b$)
        if (storedHash.StartsWith("$2a$") || storedHash.StartsWith("$2b$") || storedHash.StartsWith("$2y$"))
        {
            return BCrypt.Net.BCrypt.Verify(password, storedHash);
        }
        // Plain-text fallback for existing users (migration period)
        return storedHash == password;
    }

    private string GenerateJwtToken(ApplicationUser user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_configuration["JwtSettings:Secret"]!);
        var expiryMinutes = double.Parse(_configuration["JwtSettings:ExpiryInMinutes"] ?? "480");

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Name, user.Username),
            new Claim(JwtRegisteredClaimNames.Email, user.Email ?? ""),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim("TenantId", user.TenantId.ToString()),
            new Claim("FullName", user.FullName),
        };

        if (user.WardId.HasValue)
            claims.Add(new Claim("WardId", user.WardId.Value.ToString()));

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(expiryMinutes),
            Issuer = _configuration["JwtSettings:Issuer"],
            Audience = _configuration["JwtSettings:Audience"],
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}

// ─── Request DTOs ──────────────────────────────────────────────────────────────

public class LoginRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class RegisterRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? EmployeeCode { get; set; }
    public string Role { get; set; } = "Operator";
    public Guid TenantId { get; set; }
}

public class ChangePasswordRequest
{
    public string CurrentPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}
