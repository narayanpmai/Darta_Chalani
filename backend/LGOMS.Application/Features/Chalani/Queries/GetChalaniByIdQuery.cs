using MediatR;
using LGOMS.Domain.Entities;
using LGOMS.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LGOMS.Application.Features.Chalani.Queries;

public class GetChalaniByIdQuery : IRequest<LGOMS.Domain.Entities.Chalani?>
{
    public Guid Id { get; set; }
}

public class GetChalaniByIdQueryHandler : IRequestHandler<GetChalaniByIdQuery, LGOMS.Domain.Entities.Chalani?>
{
    private readonly IApplicationDbContext _context;

    public GetChalaniByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<LGOMS.Domain.Entities.Chalani?> Handle(GetChalaniByIdQuery request, CancellationToken cancellationToken)
    {
        return await _context.Chalanis
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);
    }
}
