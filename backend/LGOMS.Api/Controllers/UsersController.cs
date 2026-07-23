using LGOMS.Application.Features.Users.Commands;
using LGOMS.Application.Features.Users.Queries;
using LGOMS.Infrastructure.Persistence;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LGOMS.Api.Controllers;

/// <summary>
/// User Management API — कर्मचारी व्यवस्थापन
/// Tenant-scoped: Users can only see/manage users within their own tenant
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ApplicationDbContext _context;

    public UsersController(IMediator mediator, ApplicationDbContext context)
    {
        _mediator = mediator;
        _context = context;
    }

    /// <summary>GET /api/users — सबै users को सूची</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] bool includeInactive = false)
    {
        var users = await _mediator.Send(new GetUsersQuery { IncludeInactive = includeInactive });
        return Ok(users);
    }

    /// <summary>POST /api/users — नयाँ user थप्नुहोस्</summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUserCommand command)
    {
        try
        {
            var userId = await _mediator.Send(command);
            return Ok(new { id = userId, message = "User सफलतापूर्वक थपियो।" });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>PUT /api/users/{id} — user विवरण अपडेट गर्नुहोस्</summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateUserCommand command)
    {
        command.Id = id;
        try
        {
            await _mediator.Send(command);
            return Ok(new { message = "User विवरण सफलतापूर्वक अपडेट भयो।" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>PUT /api/users/{id}/toggle-status — user सक्रिय/निष्क्रिय गर्नुहोस्</summary>
    [HttpPut("{id}/toggle-status")]
    public async Task<IActionResult> ToggleStatus(Guid id)
    {
        try
        {
            var isActive = await _mediator.Send(new ToggleUserStatusCommand { Id = id });
            return Ok(new
            {
                isActive,
                message = isActive ? "User सक्रिय गरियो।" : "User निष्क्रिय गरियो।"
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>DELETE /api/users/{id} — user हटाउनुहोस् (soft delete)</summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            await _mediator.Send(new DeleteUserCommand { Id = id });
            return Ok(new { message = "User सफलतापूर्वक हटाइयो।" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>POST /api/users/purge-non-superadmins — SuperAdmin बाहेक अरू सबै users Database बाटै हटाउनुहोस्</summary>
    [HttpPost("purge-non-superadmins")]
    public async Task<IActionResult> PurgeNonSuperAdmins()
    {
        await DbSeeder.SeedAsync(_context);
        return Ok(new { message = "SuperAdmin बाहेक अरू सबै Users सफलतापुर्वक Database बाट हटाइयो।" });
    }
}

