using MediatR;
using LGOMS.Domain.Entities;
using LGOMS.Application.Interfaces;

namespace LGOMS.Application.Features.Chalani.Commands;

public class CreateChalaniCommand : IRequest<Guid>
{
    public string ChalaniNumber { get; set; } = string.Empty;
    public DateTime DispatchDate { get; set; }
    public string Miti { get; set; } = string.Empty;
    public string ReceiverName { get; set; } = string.Empty;
    public string ReceiverAddress { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string? AttachmentUrl { get; set; }
    public string OriginatingDepartment { get; set; } = string.Empty;
    public string DeliveryMethod { get; set; } = "Physical";
}

public class CreateChalaniCommandHandler : IRequestHandler<CreateChalaniCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateChalaniCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateChalaniCommand request, CancellationToken cancellationToken)
    {
        var entity = new LGOMS.Domain.Entities.Chalani
        {
            ChalaniNumber = request.ChalaniNumber,
            DispatchDate = request.DispatchDate,
            Miti = request.Miti,
            ReceiverName = request.ReceiverName,
            ReceiverAddress = request.ReceiverAddress,
            Subject = request.Subject,
            AttachmentUrl = request.AttachmentUrl,
            OriginatingDepartment = request.OriginatingDepartment,
            DeliveryMethod = request.DeliveryMethod,
            Status = "Dispatched"
        };

        _context.Chalanis.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
