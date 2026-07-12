using MediatR;
using LGOMS.Domain.Entities;
using LGOMS.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LGOMS.Application.Features.Sifaris.Queries;

public class GetSifarisByIdQuery : IRequest<LGOMS.Domain.Entities.Sifaris?>
{
    public Guid Id { get; set; }
}

public class GetSifarisByIdQueryHandler : IRequestHandler<GetSifarisByIdQuery, LGOMS.Domain.Entities.Sifaris?>
{
    private readonly IApplicationDbContext _context;

    public GetSifarisByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<LGOMS.Domain.Entities.Sifaris?> Handle(GetSifarisByIdQuery request, CancellationToken cancellationToken)
    {
        return await _context.Sifaris
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);
    }
}
