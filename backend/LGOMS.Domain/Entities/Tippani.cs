using LGOMS.Domain.Common;

namespace LGOMS.Domain.Entities;

public class Tippani : BaseEntity, IMustHaveTenant, IFiscalYearAware
{
    public Guid FiscalYearId { get; set; }
    public Guid TenantId { get; set; }
    
    public string ReferenceNumber { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty; // Rich text or HTML content
    
    // Workflow tracking
    public string InitiatedBy { get; set; } = string.Empty;
    public DateTime InitiatedDate { get; set; }
    public string CurrentReviewer { get; set; } = string.Empty;
    
    public string Status { get; set; } = "Draft"; // Draft, InReview, Approved, Rejected
    
    public string? AttachmentUrl { get; set; }
}
