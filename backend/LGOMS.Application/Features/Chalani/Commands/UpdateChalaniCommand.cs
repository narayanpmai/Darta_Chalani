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
    public string? Miti { get; set; }
    public DateTime? DispatchDate { get; set; }
    public string? LetterNumber { get; set; }
    public string? ReceiverName { get; set; }
    public string? ReceiverAddress { get; set; }
    public string? Subject { get; set; }
    public string? OriginatingDepartment { get; set; }
    public string? DeliveryMethod { get; set; }
    public string? PeonBookNumber { get; set; }
    public string? DispatchTime { get; set; }
    public string? ReferenceDartaNumber { get; set; }
    public string? OrderOrDecision { get; set; }
    public string? Status { get; set; }
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

        if (request.DispatchDate.HasValue && request.DispatchDate.Value != default)
            entity.DispatchDate = DateTime.SpecifyKind(request.DispatchDate.Value, DateTimeKind.Utc);

        if (!string.IsNullOrWhiteSpace(request.LetterNumber))
            entity.LetterNumber = request.LetterNumber;

        if (!string.IsNullOrWhiteSpace(request.ReceiverName))
            entity.ReceiverName = request.ReceiverName;

        if (!string.IsNullOrWhiteSpace(request.ReceiverAddress))
            entity.ReceiverAddress = request.ReceiverAddress;

        if (!string.IsNullOrWhiteSpace(request.Subject))
            entity.Subject = request.Subject;

        if (!string.IsNullOrWhiteSpace(request.OriginatingDepartment))
            entity.OriginatingDepartment = request.OriginatingDepartment;

        if (!string.IsNullOrWhiteSpace(request.DeliveryMethod))
            entity.DeliveryMethod = request.DeliveryMethod;

        if (!string.IsNullOrWhiteSpace(request.PeonBookNumber))
            entity.PeonBookNumber = request.PeonBookNumber;

        if (!string.IsNullOrWhiteSpace(request.DispatchTime))
            entity.DispatchTime = request.DispatchTime;

        if (!string.IsNullOrWhiteSpace(request.ReferenceDartaNumber))
            entity.ReferenceDartaNumber = request.ReferenceDartaNumber;

        if (!string.IsNullOrWhiteSpace(request.OrderOrDecision))
            entity.OrderOrDecision = request.OrderOrDecision;

        if (!string.IsNullOrWhiteSpace(request.Status))
            entity.Status = request.Status;

        if (request.Remarks != null)
            entity.Remarks = request.Remarks;

        if (!string.IsNullOrWhiteSpace(request.AttachmentUrl))
            entity.AttachmentUrl = request.AttachmentUrl;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
