using MediatR;
using LGOMS.Domain.Entities;
using LGOMS.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LGOMS.Application.Features.Darta.Queries;

public class GetDartaListQuery : IRequest<List<LGOMS.Domain.Entities.Darta>>
{
}

public class GetDartaListQueryHandler : IRequestHandler<GetDartaListQuery, List<LGOMS.Domain.Entities.Darta>>
{
    private readonly IApplicationDbContext _context;

    public GetDartaListQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<LGOMS.Domain.Entities.Darta>> Handle(GetDartaListQuery request, CancellationToken cancellationToken)
    {
        return await _context.Dartas
            .OrderByDescending(d => d.RegistrationDate)
            .ToListAsync(cancellationToken);
    }
}
