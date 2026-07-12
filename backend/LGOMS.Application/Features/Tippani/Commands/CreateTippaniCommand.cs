using MediatR;
using LGOMS.Domain.Entities;
using LGOMS.Application.Interfaces;

namespace LGOMS.Application.Features.Tippani.Commands;

public class CreateTippaniCommand : IRequest<Guid>
{
    public string ReferenceNumber { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string InitiatedBy { get; set; } = string.Empty;
    public string CurrentReviewer { get; set; } = string.Empty;
    public string? AttachmentUrl { get; set; }
}

public class CreateTippaniCommandHandler : IRequestHandler<CreateTippaniCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateTippaniCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateTippaniCommand request, CancellationToken cancellationToken)
    {
        var entity = new LGOMS.Domain.Entities.Tippani
        {
            ReferenceNumber = request.ReferenceNumber,
            Subject = request.Subject,
            Content = request.Content,
            InitiatedBy = request.InitiatedBy,
            InitiatedDate = DateTime.UtcNow,
            CurrentReviewer = request.CurrentReviewer,
            Status = "Draft",
            AttachmentUrl = request.AttachmentUrl
        };

        _context.Tippanis.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
