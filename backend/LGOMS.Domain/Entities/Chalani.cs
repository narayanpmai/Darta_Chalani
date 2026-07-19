using LGOMS.Domain.Common;

namespace LGOMS.Domain.Entities;

/// <summary>
/// चलानी — जाने पत्रको अभिलेख (Outgoing Letter Dispatch)
/// Nepal Government Chalani Kitab Standard Format
/// कार्यालय कार्यविधि निर्देशिका अनुसार
/// </summary>
public class Chalani : BaseEntity, IMustHaveTenant, IFiscalYearAware
{
    public Guid FiscalYearId { get; set; }
    public Guid TenantId { get; set; }
    public Guid? WardId { get; set; }

    // ── चलानी नम्बर र मिति ─────────────────────────────────────────────────
    /// <summary>चलानी नं. — Auto-generated dispatch number</summary>
    public string ChalaniNumber { get; set; } = string.Empty;
    /// <summary>चलानी मिति (BS) — Dispatch date in Nepali calendar</summary>
    public string Miti { get; set; } = string.Empty;
    /// <summary>चलानी मिति (AD) — Dispatch date in Gregorian calendar</summary>
    public DateTime DispatchDate { get; set; }

    // ── कार्यालयको पत्र संख्या ─────────────────────────────────────────────
    /// <summary>पत्र संख्या — This office's outgoing letter number</summary>
    public string? LetterNumber { get; set; }

    // ── पाउनेको विवरण ─────────────────────────────────────────────────────
    /// <summary>पाउनेको नाम — Recipient name (office or person)</summary>
    public string ReceiverName { get; set; } = string.Empty;
    /// <summary>पाउनेको ठेगाना — Recipient address</summary>
    public string ReceiverAddress { get; set; } = string.Empty;

    // ── पत्रको विवरण ──────────────────────────────────────────────────────
    /// <summary>विषय — Subject of the letter</summary>
    public string Subject { get; set; } = string.Empty;

    // ── पठाउने शाखा र माध्यम ─────────────────────────────────────────────
    /// <summary>पठाउने शाखा — Originating department/section</summary>
    public string OriginatingDepartment { get; set; } = string.Empty;
    /// <summary>पठाउने माध्यम — Delivery method: Physical | Post | Fax | Email | Hand</summary>
    public string DeliveryMethod { get; set; } = "Physical";

    // ── हुलाक/पियन बुक ────────────────────────────────────────────────────
    /// <summary>हुलाक/पियन बुक नं. — Post/peon book number</summary>
    public string? PeonBookNumber { get; set; }
    /// <summary>पठाउने समय — Dispatch time</summary>
    public string? DispatchTime { get; set; }

    // ── सन्दर्भ दर्ता ─────────────────────────────────────────────────────
    /// <summary>सन्दर्भ दर्ता नं. — Reference Darta number (links Chalani to incoming Darta)</summary>
    public string? ReferenceDartaNumber { get; set; }
    /// <summary>आदेश/निर्णय — Order or decision number if applicable</summary>
    public string? OrderOrDecision { get; set; }

    // ── स्थिति र कैफियत ────────────────────────────────────────────────────
    /// <summary>स्थिति — Dispatched | Pending | Cancelled</summary>
    public string Status { get; set; } = "Dispatched";
    /// <summary>कैफियत — Remarks</summary>
    public string? Remarks { get; set; }
    /// <summary>संलग्न फाइल — Scanned/attached document URL</summary>
    public string? AttachmentUrl { get; set; }
}
