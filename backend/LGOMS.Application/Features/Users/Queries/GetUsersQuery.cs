using LGOMS.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LGOMS.Application.Features.Users.Queries;

// ─── DTOs ──────────────────────────────────────────────────────────────────────

public class UserDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string EmployeeCode { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public Guid TenantId { get; set; }
    public Guid? WardId { get; set; }
    public string? WardNumber { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public DateTime CreatedAt { get; set; }
}

// ─── Query ────────────────────────────────────────────────────────────────────

public class GetUsersQuery : IRequest<List<UserDto>>
{
    public bool IncludeInactive { get; set; } = false;
}

// ─── Handler ──────────────────────────────────────────────────────────────────

public class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, List<UserDto>>
{
    private readonly IApplicationDbContext _context;

    public GetUsersQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<UserDto>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Users.AsQueryable();

        if (!request.IncludeInactive)
            query = query.Where(u => u.IsActive);

        var users = await query
            .Include(u => u.Ward)
            .OrderBy(u => u.FullName)
            .ToListAsync(cancellationToken);

        return users.Select(u => new UserDto
        {
            Id = u.Id,
            Username = u.Username,
            FullName = u.FullName,
            Email = u.Email,
            EmployeeCode = u.EmployeeCode,
            Role = u.Role,
            IsActive = u.IsActive,
            TenantId = u.TenantId,
            WardId = u.WardId,
            WardNumber = u.Ward?.WardNumber.ToString(),
            LastLoginAt = u.LastLoginAt,
            CreatedAt = u.CreatedAt
        }).ToList();
    }
}
