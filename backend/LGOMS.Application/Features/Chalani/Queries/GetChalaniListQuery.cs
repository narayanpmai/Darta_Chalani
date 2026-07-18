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

    public GetChalaniListQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<LGOMS.Domain.Entities.Chalani>> Handle(GetChalaniListQuery request, CancellationToken cancellationToken)
    {
        return await _context.Chalanis
            .OrderByDescending(c => c.DispatchDate)
            .ToListAsync(cancellationToken);
    }
}
