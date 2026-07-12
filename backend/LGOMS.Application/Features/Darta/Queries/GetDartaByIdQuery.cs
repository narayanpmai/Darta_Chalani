using MediatR;
using LGOMS.Domain.Entities;
using LGOMS.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LGOMS.Application.Features.Darta.Queries;

public class GetDartaByIdQuery : IRequest<LGOMS.Domain.Entities.Darta?>
{
    public Guid Id { get; set; }
}

public class GetDartaByIdQueryHandler : IRequestHandler<GetDartaByIdQuery, LGOMS.Domain.Entities.Darta?>
{
    private readonly IApplicationDbContext _context;

    public GetDartaByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<LGOMS.Domain.Entities.Darta?> Handle(GetDartaByIdQuery request, CancellationToken cancellationToken)
    {
        // Global query filter automatically ensures this Darta belongs to the current tenant
        return await _context.Dartas
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.Id == request.Id, cancellationToken);
    }
}
