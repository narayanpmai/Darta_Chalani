using LGOMS.Domain.Common;

namespace LGOMS.Domain.Entities;

public class Sifaris : BaseEntity, IMustHaveTenant, IFiscalYearAware
{
    public Guid FiscalYearId { get; set; }
    public Guid TenantId { get; set; }
    
    public string SifarisNumber { get; set; } = string.Empty;
    public string SifarisType { get; set; } = string.Empty; // e.g. Citizenship, Relationship, Marriage
    public Guid? SifarisTemplateId { get; set; }
    public string FiscalYear { get; set; } = string.Empty;
    
    // Applicant Details
    public string ApplicantName { get; set; } = string.Empty;
    public string ApplicantCitizenshipNumber { get; set; } = string.Empty;
    public string ApplicantAddress { get; set; } = string.Empty;
    
    public string Remarks { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending"; // Pending, Verified, Approved, Rejected
    
    public string? AttachmentUrl { get; set; }
    public string? ApprovedBy { get; set; }
    public DateTime? ApprovedDate { get; set; }
    
    // Dynamic e-Recommendation specific fields
    public string GeneratedContent { get; set; } = string.Empty; // Final HTML with replaced placeholders
    public string VerificationCode { get; set; } = string.Empty; // Unique code for QR
    public bool HasDigitalSignature { get; set; } = false;
}
