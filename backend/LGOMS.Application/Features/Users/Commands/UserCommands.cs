using LGOMS.Application.Interfaces;
using LGOMS.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LGOMS.Application.Features.Users.Commands;

// ═══════════════════════════════════════════════════════════════════════════════
// CREATE USER
// ═══════════════════════════════════════════════════════════════════════════════

public class CreateUserCommand : IRequest<Guid>
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;       // Will be BCrypt hashed
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string EmployeeCode { get; set; } = string.Empty;
    public string Role { get; set; } = "Operator";
    public Guid? WardId { get; set; }
}

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateUserCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        // Check username uniqueness within tenant
        var exists = await _context.Users
            .AnyAsync(u => u.Username == request.Username, cancellationToken);
        if (exists)
            throw new InvalidOperationException("यो Username पहिले नै दर्ता भइसकेको छ।");

        var user = new ApplicationUser
        {
            Username = request.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            FullName = request.FullName,
            Email = request.Email,
            EmployeeCode = request.EmployeeCode,
            Role = request.Role,
            WardId = request.WardId,
            IsActive = true
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);

        return user.Id;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// UPDATE USER
// ═══════════════════════════════════════════════════════════════════════════════

public class UpdateUserCommand : IRequest
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string EmployeeCode { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public Guid? WardId { get; set; }
    public bool IsActive { get; set; }
    public string? NewPassword { get; set; }                   // Optional — only if resetting
}

public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateUserCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == request.Id, cancellationToken)
            ?? throw new KeyNotFoundException($"User {request.Id} फेला परेन।");

        user.FullName = request.FullName;
        user.Email = request.Email;
        user.EmployeeCode = request.EmployeeCode;
        user.Role = request.Role;
        user.WardId = request.WardId;
        user.IsActive = request.IsActive;

        if (!string.IsNullOrWhiteSpace(request.NewPassword))
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

        await _context.SaveChangesAsync(cancellationToken);
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOGGLE USER STATUS
// ═══════════════════════════════════════════════════════════════════════════════

public class ToggleUserStatusCommand : IRequest<bool>
{
    public Guid Id { get; set; }
}

public class ToggleUserStatusCommandHandler : IRequestHandler<ToggleUserStatusCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public ToggleUserStatusCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(ToggleUserStatusCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == request.Id, cancellationToken)
            ?? throw new KeyNotFoundException($"User {request.Id} फेला परेन।");

        user.IsActive = !user.IsActive;
        await _context.SaveChangesAsync(cancellationToken);
        return user.IsActive;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// DELETE USER
// ═══════════════════════════════════════════════════════════════════════════════

public class DeleteUserCommand : IRequest
{
    public Guid Id { get; set; }
}

public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteUserCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == request.Id, cancellationToken)
            ?? throw new KeyNotFoundException($"User {request.Id} फेला परेन।");

        // Soft delete
        user.IsDeleted = true;
        user.IsActive = false;
        await _context.SaveChangesAsync(cancellationToken);
    }
}
