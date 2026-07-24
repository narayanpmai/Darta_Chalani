using MediatR;
using LGOMS.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace LGOMS.Application.Features.Chalani.Commands;

public class UpdateChalaniCommand : IRequest
{
    public Guid Id { get; set; }
    public string? ChalaniNumber { get; set; }
    public string Miti { get; set; } = string.Empty;
    public DateTime DispatchDate { get; set; }
    public string? LetterNumber { get; set; }
    public string ReceiverName { get; set; } = string.Empty;
    public string ReceiverAddress { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string OriginatingDepartment { get; set; } = string.Empty;
    public string DeliveryMethod { get; set; } = "Physical";
    public string? PeonBookNumber { get; set; }
    public string? DispatchTime { get; set; }
    public string? ReferenceDartaNumber { get; set; }
    public string? OrderOrDecision { get; set; }
    public string Status { get; set; } = "Dispatched";
    public string? Remarks { get; set; }
    public string? AttachmentUrl { get; set; }
}

public class UpdateChalaniCommandHandler : IRequestHandler<UpdateChalaniCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateChalaniCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateChalaniCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Chalanis
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

        if (entity == null)
        {
            throw new KeyNotFoundException($"चलानी नं. {request.Id} फेला परेन।");
        }

        if (!string.IsNullOrWhiteSpace(request.ChalaniNumber))
            entity.ChalaniNumber = request.ChalaniNumber;

        if (!string.IsNullOrWhiteSpace(request.Miti))
            entity.Miti = request.Miti;

        if (request.DispatchDate != default)
            entity.DispatchDate = DateTime.SpecifyKind(request.DispatchDate, DateTimeKind.Utc);

        entity.LetterNumber = request.LetterNumber ?? entity.LetterNumber;
        entity.ReceiverName = request.ReceiverName ?? entity.ReceiverName;
        entity.ReceiverAddress = request.ReceiverAddress ?? entity.ReceiverAddress;
        entity.Subject = request.Subject ?? entity.Subject;
        entity.OriginatingDepartment = request.OriginatingDepartment ?? entity.OriginatingDepartment;
        entity.DeliveryMethod = request.DeliveryMethod ?? entity.DeliveryMethod;
        entity.PeonBookNumber = request.PeonBookNumber ?? entity.PeonBookNumber;
        entity.DispatchTime = request.DispatchTime ?? entity.DispatchTime;
        entity.ReferenceDartaNumber = request.ReferenceDartaNumber ?? entity.ReferenceDartaNumber;
        entity.OrderOrDecision = request.OrderOrDecision ?? entity.OrderOrDecision;
        entity.Status = request.Status ?? entity.Status;
        entity.Remarks = request.Remarks ?? entity.Remarks;
        entity.AttachmentUrl = request.AttachmentUrl ?? entity.AttachmentUrl;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
