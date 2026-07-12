using MediatR;
using LGOMS.Domain.Entities;
using LGOMS.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LGOMS.Application.Features.Tippani.Queries;

public class GetTippaniByIdQuery : IRequest<LGOMS.Domain.Entities.Tippani?>
{
    public Guid Id { get; set; }
}

public class GetTippaniByIdQueryHandler : IRequestHandler<GetTippaniByIdQuery, LGOMS.Domain.Entities.Tippani?>
{
    private readonly IApplicationDbContext _context;

    public GetTippaniByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<LGOMS.Domain.Entities.Tippani?> Handle(GetTippaniByIdQuery request, CancellationToken cancellationToken)
    {
        return await _context.Tippanis
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == request.Id, cancellationToken);
    }
}
