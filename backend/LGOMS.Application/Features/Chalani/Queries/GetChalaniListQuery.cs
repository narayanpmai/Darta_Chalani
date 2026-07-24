using MediatR;
using LGOMS.Domain.Entities;
using LGOMS.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LGOMS.Application.Features.Chalani.Queries;

public class GetChalaniListQuery : IRequest<List<LGOMS.Domain.Entities.Chalani>>
{
}

public class GetChalaniListQueryHandler : IRequestHandler<GetChalaniListQuery, List<LGOMS.Domain.Entities.Chalani>>
{
    private readonly IApplicationDbContext _context;
    private readonly IWardService _wardService;

    public GetChalaniListQueryHandler(IApplicationDbContext context, IWardService wardService)
    {
        _context = context;
        _wardService = wardService;
    }

    public async Task<List<LGOMS.Domain.Entities.Chalani>> Handle(GetChalaniListQuery request, CancellationToken cancellationToken)
    {
        var wardId = _wardService.GetWardId();
        var query = _context.Chalanis.AsQueryable();

        if (wardId.HasValue)
        {
            query = query.Where(c => c.WardId == wardId.Value);
        }

        return await query
            .OrderByDescending(c => c.DispatchDate)
            .ToListAsync(cancellationToken);
    }
}
