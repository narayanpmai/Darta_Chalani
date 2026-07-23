using MediatR;
using LGOMS.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace LGOMS.Application.Features.Chalani.Commands;

public class DeleteChalaniCommand : IRequest
{
    public Guid Id { get; set; }
}

public class DeleteChalaniCommandHandler : IRequestHandler<DeleteChalaniCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteChalaniCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteChalaniCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Chalanis
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

        if (entity == null)
        {
            throw new KeyNotFoundException($"चलानी नं. {request.Id} फेला परेन।");
        }

        // Soft delete
        entity.IsDeleted = true;
        await _context.SaveChangesAsync(cancellationToken);
    }
}
