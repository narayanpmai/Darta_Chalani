using MediatR;
using LGOMS.Domain.Entities;
using LGOMS.Application.Interfaces;

namespace LGOMS.Application.Features.Chalani.Commands;

/// <summary>
/// नयाँ चलानी गर्ने Command — NAMS Standard Fields
/// </summary>
public class CreateChalaniCommand : IRequest<Guid>
{
    // ── मिति ──────────────────────────────────────────────────────────────────
    public string? ChalaniNumber { get; set; }                     // Форमेट गरिएको चलानी नम्बर
    public DateTime DispatchDate { get; set; }
    public string Miti { get; set; } = string.Empty;               // चलानी मिति (BS)

    // ── कार्यालयको पत्र संख्या ──────────────────────────────────────────────
    public string? LetterNumber { get; set; }                      // पत्र संख्या (NAMS)

    // ── पाउनेको विवरण ─────────────────────────────────────────────────────
    public string ReceiverName { get; set; } = string.Empty;       // पाउनेको नाम
    public string ReceiverAddress { get; set; } = string.Empty;    // पाउनेको ठेगाना

    // ── पत्रको विवरण ──────────────────────────────────────────────────────
    public string Subject { get; set; } = string.Empty;            // विषय

    // ── पठाउने शाखा र माध्यम ─────────────────────────────────────────────
    public string OriginatingDepartment { get; set; } = string.Empty;
    public string DeliveryMethod { get; set; } = "Physical";       // पठाउने माध्यम

    // ── हुलाक/पियन बुक ────────────────────────────────────────────────────
    public string? PeonBookNumber { get; set; }
    public string? DispatchTime { get; set; }

    // ── सन्दर्भ दर्ता ─────────────────────────────────────────────────────
    public string? ReferenceDartaNumber { get; set; }              // सन्दर्भ दर्ता नं. (NAMS)
    public string? OrderOrDecision { get; set; }                   // आदेश/निर्णय

    // ── कैफियत र संलग्न ────────────────────────────────────────────────────
    public string? Remarks { get; set; }
    public string? AttachmentUrl { get; set; }
}

public class CreateChalaniCommandHandler : IRequestHandler<CreateChalaniCommand, Guid>
{
    private readonly IApplicationDbContext _context;
    private readonly ISequenceGeneratorService _sequenceGenerator;
    private readonly ITenantService _tenantService;
    private readonly IFiscalYearService _fiscalYearService;

    public CreateChalaniCommandHandler(
        IApplicationDbContext context,
        ISequenceGeneratorService sequenceGenerator,
        ITenantService tenantService,
        IFiscalYearService fiscalYearService)
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

        string generatedNumber = string.IsNullOrWhiteSpace(request.ChalaniNumber)
            ? await _sequenceGenerator.GenerateNextSequenceAsync(tenantId, null, fiscalYearId, "Chalani")
            : request.ChalaniNumber;

        var entity = new LGOMS.Domain.Entities.Chalani
        {
            ChalaniNumber = generatedNumber,
            DispatchDate = request.DispatchDate,
            Miti = request.Miti,
            LetterNumber = request.LetterNumber,
            ReceiverName = request.ReceiverName,
            ReceiverAddress = request.ReceiverAddress,
            Subject = request.Subject,
            OriginatingDepartment = request.OriginatingDepartment,
            DeliveryMethod = request.DeliveryMethod,
            Status = "Dispatched",
            ReferenceDartaNumber = request.ReferenceDartaNumber,
            PeonBookNumber = request.PeonBookNumber,
            DispatchTime = request.DispatchTime,
            OrderOrDecision = request.OrderOrDecision,
            Remarks = request.Remarks,
            AttachmentUrl = request.AttachmentUrl,
            FiscalYearId = fiscalYearId
        };

        _context.Chalanis.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
