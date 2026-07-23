using MediatR;
using LGOMS.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace LGOMS.Application.Features.Darta.Commands;

public class DeleteDartaCommand : IRequest
{
    public Guid Id { get; set; }
}

public class DeleteDartaCommandHandler : IRequestHandler<DeleteDartaCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteDartaCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteDartaCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Dartas
            .FirstOrDefaultAsync(d => d.Id == request.Id, cancellationToken);

        if (entity == null)
        {
            throw new KeyNotFoundException($"दर्ता नं. {request.Id} फेला परेन।");
        }

        // Soft delete
        entity.IsDeleted = true;
        await _context.SaveChangesAsync(cancellationToken);
    }
}
