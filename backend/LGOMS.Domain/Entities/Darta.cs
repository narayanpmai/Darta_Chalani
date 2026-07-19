using LGOMS.Domain.Common;

namespace LGOMS.Domain.Entities;

/// <summary>
/// दर्ता — आउने पत्रको अभिलेख (Incoming Letter Registration)
/// Nepal Government Darta Kitab Standard Format
/// कार्यालय कार्यविधि निर्देशिका अनुसार
/// </summary>
public class Darta : BaseEntity, IMustHaveTenant, IFiscalYearAware
{
    public Guid FiscalYearId { get; set; }
    public Guid TenantId { get; set; }
    public Guid? WardId { get; set; }

    // ── दर्ता नम्बर र मिति ──────────────────────────────────────────────────
    /// <summary>दर्ता नं. — Auto-generated sequence number</summary>
    public string DartaNumber { get; set; } = string.Empty;
    /// <summary>दर्ता मिति (BS) — Registration date in Nepali calendar</summary>
    public string Miti { get; set; } = string.Empty;
    /// <summary>दर्ता मिति (AD) — Registration date in Gregorian calendar</summary>
    public DateTime RegistrationDate { get; set; }

    // ── प्राप्त पत्रको विवरण ───────────────────────────────────────────────
    /// <summary>प्राप्त पत्रको मिति — Date of received letter (BS)</summary>
    public string? ReceivedLetterDate { get; set; }
    /// <summary>पत्र संख्या / च.नं. — Reference/dispatch number from sender</summary>
    public string? ReceivedLetterNumber { get; set; }

    // ── पठाउनेको विवरण ────────────────────────────────────────────────────
    /// <summary>पठाउनेको नाम — Sender name (office or person)</summary>
    public string SenderName { get; set; } = string.Empty;
    /// <summary>पठाउनेको ठेगाना — Sender address</summary>
    public string SenderAddress { get; set; } = string.Empty;

    // ── पत्रको विवरण ──────────────────────────────────────────────────────
    /// <summary>विषय — Subject of the letter</summary>
    public string Subject { get; set; } = string.Empty;
    /// <summary>पत्रको किसिम — Letter type: General/Circular/Confidential/Urgent/VeryUrgent</summary>
    public string LetterType { get; set; } = "General";   // General | Circular | Confidential | Urgent | VeryUrgent

    // ── बुझ्ने फाँट ───────────────────────────────────────────────────────
    /// <summary>बुझ्ने फाँट/शाखा — Department/section receiving the letter</summary>
    public string? ForwardedToDepartment { get; set; }
    /// <summary>बुझिलिनेको नाम — Name of person who received/signed</summary>
    public string? HandledBy { get; set; }

    // ── प्राथमिकता र स्थिति ────────────────────────────────────────────────
    /// <summary>प्राथमिकता — Normal | Urgent | VeryUrgent</summary>
    public string Priority { get; set; } = "Normal";
    /// <summary>स्थिति — Pending | InProcess | Forwarded | Completed | Archived</summary>
    public string Status { get; set; } = "Pending";

    // ── अतिरिक्त जानकारी ──────────────────────────────────────────────────
    /// <summary>कैफियत — Remarks</summary>
    public string? Remarks { get; set; }
    /// <summary>संलग्न फाइल — Scanned document URL</summary>
    public string? AttachmentUrl { get; set; }
    /// <summary>प्रविष्टि समय — Entry time</summary>
    public string? EntryTime { get; set; }
}
