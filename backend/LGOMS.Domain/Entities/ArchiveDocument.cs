using LGOMS.Domain.Common;

namespace LGOMS.Domain.Entities;

public class ArchiveDocument : BaseEntity, IMustHaveTenant, IFiscalYearAware
{
    public Guid FiscalYearId { get; set; }
    public Guid TenantId { get; set; }
    
    public string DocumentNumber { get; set; } = string.Empty; // e.g. Darta No, Chalani No, Tippani Ref
    public string DocumentType { get; set; } = string.Empty; // Darta, Chalani, Tippani, Sifaris, Other
    public string Title { get; set; } = string.Empty;
    public string ExtractedText { get; set; } = string.Empty; // OCR Text for Full Text Search
    public string FileUrl { get; set; } = string.Empty;
    public string Uploader { get; set; } = string.Empty;
    public DateTime UploadDate { get; set; }
    
    // Metadata tags
    public string Tags { get; set; } = string.Empty; // JSON array or comma separated
}
