using LGOMS.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace LGOMS.Application.Features.Tenants.Commands;

public class UpdateTenantCommand : IRequest<Unit>
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Domain { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}

public class UpdateTenantCommandHandler : IRequestHandler<UpdateTenantCommand, Unit>
{
    private readonly IApplicationDbContext _context;

    public UpdateTenantCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(UpdateTenantCommand request, CancellationToken cancellationToken)
    {
        var tenant = await _context.Tenants
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(t => t.Id == request.Id, cancellationToken);

        if (tenant == null)
        {
            throw new Exception($"Tenant with ID {request.Id} not found.");
        }

        tenant.Name = request.Name;
        tenant.Domain = request.Domain;
        tenant.IsActive = request.IsActive;

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
