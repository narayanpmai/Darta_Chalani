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
    public string? Miti { get; set; }
    public DateTime? RegistrationDate { get; set; }
    public string? ReceivedLetterDate { get; set; }
    public string? ReceivedLetterNumber { get; set; }
    public string? SenderName { get; set; }
    public string? SenderAddress { get; set; }
    public string? Subject { get; set; }
    public string? LetterType { get; set; }
    public string? ForwardedToDepartment { get; set; }
    public string? HandledBy { get; set; }
    public string? Priority { get; set; }
    public string? Status { get; set; }
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

        if (request.RegistrationDate.HasValue && request.RegistrationDate.Value != default)
            entity.RegistrationDate = DateTime.SpecifyKind(request.RegistrationDate.Value, DateTimeKind.Utc);

        if (!string.IsNullOrWhiteSpace(request.ReceivedLetterDate))
            entity.ReceivedLetterDate = request.ReceivedLetterDate;

        if (!string.IsNullOrWhiteSpace(request.ReceivedLetterNumber))
            entity.ReceivedLetterNumber = request.ReceivedLetterNumber;

        if (!string.IsNullOrWhiteSpace(request.SenderName))
            entity.SenderName = request.SenderName;

        if (!string.IsNullOrWhiteSpace(request.SenderAddress))
            entity.SenderAddress = request.SenderAddress;

        if (!string.IsNullOrWhiteSpace(request.Subject))
            entity.Subject = request.Subject;

        if (!string.IsNullOrWhiteSpace(request.LetterType))
            entity.LetterType = request.LetterType;

        if (!string.IsNullOrWhiteSpace(request.ForwardedToDepartment))
            entity.ForwardedToDepartment = request.ForwardedToDepartment;

        if (!string.IsNullOrWhiteSpace(request.HandledBy))
            entity.HandledBy = request.HandledBy;

        if (!string.IsNullOrWhiteSpace(request.Priority))
            entity.Priority = request.Priority;

        if (!string.IsNullOrWhiteSpace(request.Status))
            entity.Status = request.Status;

        if (request.Remarks != null)
            entity.Remarks = request.Remarks;

        if (!string.IsNullOrWhiteSpace(request.AttachmentUrl))
            entity.AttachmentUrl = request.AttachmentUrl;

        if (!string.IsNullOrWhiteSpace(request.EntryTime))
            entity.EntryTime = request.EntryTime;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
