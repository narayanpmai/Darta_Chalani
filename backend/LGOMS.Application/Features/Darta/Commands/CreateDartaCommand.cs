using MediatR;
using LGOMS.Domain.Entities;
using LGOMS.Application.Interfaces;

namespace LGOMS.Application.Features.Darta.Commands;

public class CreateDartaCommand : IRequest<Guid>
{
    public string DartaNumber { get; set; } = string.Empty;
    public DateTime RegistrationDate { get; set; }
    public string Miti { get; set; } = string.Empty;
    public string SenderName { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string? AttachmentUrl { get; set; }
    public string? ForwardedToDepartment { get; set; }
    public string Priority { get; set; } = "Normal";
    public string? ReceivedLetterDate { get; set; }
    public string? ReceivedLetterNumber { get; set; }
    public string? Remarks { get; set; }
    public string? EntryTime { get; set; }
}

public class CreateDartaCommandHandler : IRequestHandler<CreateDartaCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateDartaCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateDartaCommand request, CancellationToken cancellationToken)
    {
        var entity = new LGOMS.Domain.Entities.Darta
        {
            DartaNumber = request.DartaNumber,
            RegistrationDate = request.RegistrationDate,
            Miti = request.Miti,
            SenderName = request.SenderName,
            Subject = request.Subject,
            AttachmentUrl = request.AttachmentUrl,
            ForwardedToDepartment = request.ForwardedToDepartment,
            Priority = request.Priority,
            Status = "Pending",
            ReceivedLetterDate = request.ReceivedLetterDate,
            ReceivedLetterNumber = request.ReceivedLetterNumber,
            Remarks = request.Remarks,
            EntryTime = request.EntryTime
        };

        _context.Dartas.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
