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
    private readonly IWardService _wardService;

    public GetDartaListQueryHandler(IApplicationDbContext context, IWardService wardService)
    {
        _context = context;
        _wardService = wardService;
    }

    public async Task<List<LGOMS.Domain.Entities.Darta>> Handle(GetDartaListQuery request, CancellationToken cancellationToken)
    {
        var wardId = _wardService.GetWardId();
        var query = _context.Dartas.AsQueryable();

        if (wardId.HasValue)
        {
            query = query.Where(d => d.WardId == wardId.Value);
        }

        return await query
            .OrderByDescending(d => d.RegistrationDate)
            .ToListAsync(cancellationToken);
    }
}
