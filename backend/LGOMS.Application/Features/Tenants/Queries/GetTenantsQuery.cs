using LGOMS.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LGOMS.Application.Features.Tenants.Queries;

public class TenantDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Domain { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public int Wards { get; set; }
    public int Users { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class GetTenantsQuery : IRequest<List<TenantDto>>
{
}

public class GetTenantsQueryHandler : IRequestHandler<GetTenantsQuery, List<TenantDto>>
{
    private readonly IApplicationDbContext _context;

    public GetTenantsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<TenantDto>> Handle(GetTenantsQuery request, CancellationToken cancellationToken)
    {
        var tenants = await _context.Tenants
            .IgnoreQueryFilters()
            .ToListAsync(cancellationToken);

        var wardsGrouped = await _context.Wards
            .IgnoreQueryFilters()
            .GroupBy(w => w.TenantId)
            .Select(g => new { TenantId = g.Key, Count = g.Count() })
            .ToListAsync(cancellationToken);

        var usersGrouped = await _context.Users
            .IgnoreQueryFilters()
            .GroupBy(u => u.TenantId)
            .Select(g => new { TenantId = g.Key, Count = g.Count() })
            .ToListAsync(cancellationToken);

        var wardsLookup = wardsGrouped.ToDictionary(x => x.TenantId, x => x.Count);
        var usersLookup = usersGrouped.ToDictionary(x => x.TenantId, x => x.Count);

        return tenants.Select(t => new TenantDto
        {
            Id = t.Id,
            Name = t.Name,
            Domain = t.Domain,
            IsActive = t.IsActive,
            Wards = wardsLookup.GetValueOrDefault(t.Id, 0),
            Users = usersLookup.GetValueOrDefault(t.Id, 0),
            CreatedAt = t.CreatedAt
        })
        .OrderByDescending(t => t.CreatedAt)
        .ToList();
    }
}
