using MediatR;
using LGOMS.Domain.Entities;
using LGOMS.Application.Interfaces;

namespace LGOMS.Application.Features.Darta.Commands;

/// <summary>
/// नयाँ दर्ता गर्ने Command — NAMS Standard Fields
/// </summary>
public class CreateDartaCommand : IRequest<Guid>
{
    // ── मिति ──────────────────────────────────────────────────────────────────
    public DateTime RegistrationDate { get; set; }
    public string Miti { get; set; } = string.Empty;           // दर्ता मिति (BS)

    // ── प्राप्त पत्रको विवरण ─────────────────────────────────────────────────
    public string? ReceivedLetterDate { get; set; }            // प्राप्त पत्रको मिति
    public string? ReceivedLetterNumber { get; set; }          // पत्र संख्या / च.नं.

    // ── पठाउनेको विवरण ────────────────────────────────────────────────────
    public string SenderName { get; set; } = string.Empty;     // पठाउनेको नाम
    public string SenderAddress { get; set; } = string.Empty;  // पठाउनेको ठेगाना (NAMS)

    // ── पत्रको विवरण ──────────────────────────────────────────────────────
    public string Subject { get; set; } = string.Empty;        // विषय
    public string LetterType { get; set; } = "General";        // पत्रको किसिम (NAMS)

    // ── बुझ्ने फाँट ───────────────────────────────────────────────────────
    public string? ForwardedToDepartment { get; set; }         // बुझ्ने फाँट/शाखा
    public string? HandledBy { get; set; }                     // बुझिलिनेको नाम (NAMS)

    // ── प्राथमिकता र कैफियत ──────────────────────────────────────────────
    public string Priority { get; set; } = "Normal";
    public string? Remarks { get; set; }                       // कैफियत
    public string? AttachmentUrl { get; set; }                 // संलग्न फाइल
    public string? EntryTime { get; set; }
}

public class CreateDartaCommandHandler : IRequestHandler<CreateDartaCommand, Guid>
{
    private readonly IApplicationDbContext _context;
    private readonly ISequenceGeneratorService _sequenceGenerator;
    private readonly ITenantService _tenantService;
    private readonly IFiscalYearService _fiscalYearService;

    public CreateDartaCommandHandler(
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

    public async Task<Guid> Handle(CreateDartaCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _tenantService.GetTenantId();
        var fiscalYearId = _fiscalYearService.GetFiscalYearId();

        var generatedNumber = await _sequenceGenerator.GenerateNextSequenceAsync(
            tenantId, null, fiscalYearId, "Darta");

        var entity = new LGOMS.Domain.Entities.Darta
        {
            DartaNumber = generatedNumber,
            RegistrationDate = request.RegistrationDate,
            Miti = request.Miti,
            ReceivedLetterDate = request.ReceivedLetterDate,
            ReceivedLetterNumber = request.ReceivedLetterNumber,
            SenderName = request.SenderName,
            SenderAddress = request.SenderAddress,
            Subject = request.Subject,
            LetterType = request.LetterType,
            ForwardedToDepartment = request.ForwardedToDepartment,
            HandledBy = request.HandledBy,
            Priority = request.Priority,
            Status = "Pending",
            Remarks = request.Remarks,
            AttachmentUrl = request.AttachmentUrl,
            EntryTime = request.EntryTime,
            FiscalYearId = fiscalYearId
        };

        _context.Dartas.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
