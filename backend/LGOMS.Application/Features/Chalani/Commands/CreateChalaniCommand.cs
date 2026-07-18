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
    public string? ReferenceLetterNumber { get; set; }
    public string? Remarks { get; set; }
    public string? PeonBookNumber { get; set; }
    public string? DispatchTime { get; set; }
    public string? OrderOrDecision { get; set; }
}

public class CreateChalaniCommandHandler : IRequestHandler<CreateChalaniCommand, Guid>
{
    private readonly IApplicationDbContext _context;
    private readonly ISequenceGeneratorService _sequenceGenerator;
    private readonly ITenantService _tenantService;
    private readonly IFiscalYearService _fiscalYearService;

    public CreateChalaniCommandHandler(IApplicationDbContext context, ISequenceGeneratorService sequenceGenerator, ITenantService tenantService, IFiscalYearService fiscalYearService)
    {
        _context = context;
        _sequenceGenerator = sequenceGenerator;
        _tenantService = tenantService;
        _fiscalYearService = fiscalYearService;
    }

    public async Task<Guid> Handle(CreateChalaniCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _tenantService.GetTenantId();
        var fiscalYearId = _fiscalYearService.GetFiscalYearId();
        Guid? wardId = null; // Extract from CurrentUserService in the future

        var generatedNumber = await _sequenceGenerator.GenerateNextSequenceAsync(tenantId, wardId, fiscalYearId, "Chalani");

        var entity = new LGOMS.Domain.Entities.Chalani
        {
            ChalaniNumber = generatedNumber,
            DispatchDate = request.DispatchDate,
            Miti = request.Miti,
            ReceiverName = request.ReceiverName,
            ReceiverAddress = request.ReceiverAddress,
            Subject = request.Subject,
            AttachmentUrl = request.AttachmentUrl,
            OriginatingDepartment = request.OriginatingDepartment,
            DeliveryMethod = request.DeliveryMethod,
            Status = "Dispatched",
            ReferenceLetterNumber = request.ReferenceLetterNumber,
            Remarks = request.Remarks,
            PeonBookNumber = request.PeonBookNumber,
            DispatchTime = request.DispatchTime,
            OrderOrDecision = request.OrderOrDecision
        };

        _context.Chalanis.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
