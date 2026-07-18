using LGOMS.Application.Interfaces;
using LGOMS.Domain.Entities;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace LGOMS.Application.Features.Tenants.Commands;

public class CreateTenantCommand : IRequest<Guid>
{
    public string Name { get; set; } = string.Empty;
    public string Subdomain { get; set; } = string.Empty;
    public int WardCount { get; set; }
    
    public string AdminName { get; set; } = string.Empty;
    public string AdminUsername { get; set; } = string.Empty;
    public string AdminEmail { get; set; } = string.Empty;
    public string AdminPassword { get; set; } = string.Empty;
}

public class CreateTenantCommandHandler : IRequestHandler<CreateTenantCommand, Guid>
{
    private readonly IApplicationDbContext _context;
    
    public CreateTenantCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateTenantCommand request, CancellationToken cancellationToken)
    {
        // 1. Create Tenant
        var tenant = new Tenant
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Domain = request.Subdomain + ".lgoms.gov.np",
            ConnectionString = "Shared", // Or generate based on request
            IsActive = true
        };

        _context.Tenants.Add(tenant);

        // 2. Create Wards
        for (int i = 1; i <= request.WardCount; i++)
        {
            var ward = new Ward
            {
                Id = Guid.NewGuid(),
                TenantId = tenant.Id,
                WardNumber = i
            };
            _context.Wards.Add(ward);
        }

        // 3. Create Admin User
        var adminUser = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            TenantId = tenant.Id,
            WardId = null, // Null means Palika level
            FullName = request.AdminName,
            Username = request.AdminUsername,
            Role = "MunicipalityAdmin",
            PasswordHash = request.AdminPassword // In a real system, hash this properly e.g. using BCrypt
        };
        _context.Users.Add(adminUser);

        await _context.SaveChangesAsync(cancellationToken);

        return tenant.Id;
    }
}
