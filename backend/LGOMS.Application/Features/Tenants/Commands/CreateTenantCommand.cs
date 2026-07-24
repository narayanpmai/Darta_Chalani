using LGOMS.Application.Interfaces;
using LGOMS.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
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
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            throw new InvalidOperationException("Municipality को नाम (Name) आवश्यक छ।");
        }

        var subdomainRaw = (request.Subdomain ?? string.Empty).Trim().ToLower();
        if (string.IsNullOrWhiteSpace(subdomainRaw))
        {
            subdomainRaw = request.Name.ToLower().Replace(" ", "");
        }
        var domain = subdomainRaw + ".lgoms.gov.np";

        // Check if tenant domain or name already exists
        var tenantExists = await _context.Tenants
            .IgnoreQueryFilters()
            .AnyAsync(t => t.Domain.ToLower() == domain.ToLower() || t.Name.ToLower() == request.Name.ToLower(), cancellationToken);

        if (tenantExists)
        {
            throw new InvalidOperationException($"Municipality '{request.Name}' वा Subdomain '{subdomainRaw}' पहिले नै दर्ता भइसकेको छ।");
        }

        var adminUsername = (request.AdminUsername ?? string.Empty).Trim();
        if (string.IsNullOrWhiteSpace(adminUsername) && !string.IsNullOrWhiteSpace(request.AdminEmail))
        {
            adminUsername = request.AdminEmail.Split('@')[0].Trim();
        }
        if (string.IsNullOrWhiteSpace(adminUsername))
        {
            throw new InvalidOperationException("Admin Username आवश्यक छ।");
        }

        var userExists = await _context.Users
            .IgnoreQueryFilters()
            .AnyAsync(u => u.Username.ToLower() == adminUsername.ToLower(), cancellationToken);

        if (userExists)
        {
            throw new InvalidOperationException($"Admin Username '{adminUsername}' पहिले नै प्रयोग भइसकेको छ।");
        }

        // 1. Create Tenant
        var tenant = new Tenant
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Domain = domain,
            ConnectionString = "Shared",
            IsActive = true
        };

        _context.Tenants.Add(tenant);

        // 2. Create Wards
        int wardCount = request.WardCount > 0 ? request.WardCount : 9;
        for (int i = 1; i <= wardCount; i++)
        {
            var ward = new Ward
            {
                Id = Guid.NewGuid(),
                TenantId = tenant.Id,
                WardNumber = i
            };
            _context.Wards.Add(ward);
        }

        // 3. Seed Default Fiscal Year for New Tenant
        var defaultFiscalYear = new FiscalYear
        {
            Id = Guid.NewGuid(),
            TenantId = tenant.Id,
            Name = "२०८२/०८३",
            StartDate = DateTime.SpecifyKind(new DateTime(2025, 7, 16), DateTimeKind.Utc),
            EndDate = DateTime.SpecifyKind(new DateTime(2026, 7, 15), DateTimeKind.Utc),
            IsActive = true
        };
        _context.FiscalYears.Add(defaultFiscalYear);

        // 4. Seed Sequence Trackers for Darta and Chalani
        _context.SequenceTrackers.Add(new SequenceTracker
        {
            Id = Guid.NewGuid(),
            TenantId = tenant.Id,
            FiscalYearId = defaultFiscalYear.Id,
            EntityType = "Darta",
            CurrentSequence = 0
        });

        _context.SequenceTrackers.Add(new SequenceTracker
        {
            Id = Guid.NewGuid(),
            TenantId = tenant.Id,
            FiscalYearId = defaultFiscalYear.Id,
            EntityType = "Chalani",
            CurrentSequence = 0
        });

        // 5. Create Admin User (BCrypt Hashed)
        var adminPassword = string.IsNullOrWhiteSpace(request.AdminPassword) ? "Admin@123" : request.AdminPassword;
        var adminUser = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            TenantId = tenant.Id,
            WardId = null, // Palika level
            FullName = string.IsNullOrWhiteSpace(request.AdminName) ? "Municipality Admin" : request.AdminName,
            Username = adminUsername,
            Email = request.AdminEmail ?? string.Empty,
            EmployeeCode = $"EMP-ADM-{Random.Shared.Next(100, 999)}",
            Role = "MunicipalityAdmin",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(adminPassword),
            IsActive = true
        };
        _context.Users.Add(adminUser);

        await _context.SaveChangesAsync(cancellationToken);

        return tenant.Id;
    }
}

