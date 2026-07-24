using MediatR;
using LGOMS.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace LGOMS.Application.Features.Darta.Commands;

public class UpdateDartaCommand : IRequest
{
    public Guid Id { get; set; }
    public string? DartaNumber { get; set; }
    public string Miti { get; set; } = string.Empty;
    public DateTime RegistrationDate { get; set; }
    public string? ReceivedLetterDate { get; set; }
    public string? ReceivedLetterNumber { get; set; }
    public string SenderName { get; set; } = string.Empty;
    public string SenderAddress { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string LetterType { get; set; } = "General";
    public string? ForwardedToDepartment { get; set; }
    public string? HandledBy { get; set; }
    public string Priority { get; set; } = "Normal";
    public string Status { get; set; } = "Pending";
    public string? Remarks { get; set; }
    public string? AttachmentUrl { get; set; }
    public string? EntryTime { get; set; }
}

public class UpdateDartaCommandHandler : IRequestHandler<UpdateDartaCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateDartaCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateDartaCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Dartas
            .FirstOrDefaultAsync(d => d.Id == request.Id, cancellationToken);

        if (entity == null)
        {
            throw new KeyNotFoundException($"दर्ता नं. {request.Id} फेला परेन।");
        }

        if (!string.IsNullOrWhiteSpace(request.DartaNumber))
            entity.DartaNumber = request.DartaNumber;

        if (!string.IsNullOrWhiteSpace(request.Miti))
            entity.Miti = request.Miti;

        if (request.RegistrationDate != default)
            entity.RegistrationDate = DateTime.SpecifyKind(request.RegistrationDate, DateTimeKind.Utc);

        entity.ReceivedLetterDate = request.ReceivedLetterDate ?? entity.ReceivedLetterDate;
        entity.ReceivedLetterNumber = request.ReceivedLetterNumber ?? entity.ReceivedLetterNumber;
        entity.SenderName = request.SenderName ?? entity.SenderName;
        entity.SenderAddress = request.SenderAddress ?? entity.SenderAddress;
        entity.Subject = request.Subject ?? entity.Subject;
        entity.LetterType = request.LetterType ?? entity.LetterType;
        entity.ForwardedToDepartment = request.ForwardedToDepartment ?? entity.ForwardedToDepartment;
        entity.HandledBy = request.HandledBy ?? entity.HandledBy;
        entity.Priority = request.Priority ?? entity.Priority;
        entity.Status = request.Status ?? entity.Status;
        entity.Remarks = request.Remarks ?? entity.Remarks;
        entity.AttachmentUrl = request.AttachmentUrl ?? entity.AttachmentUrl;
        entity.EntryTime = request.EntryTime ?? entity.EntryTime;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
