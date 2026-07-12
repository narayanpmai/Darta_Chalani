using LGOMS.Domain.Common;

namespace LGOMS.Domain.Entities;

public class SifarisTemplate : BaseEntity, IMustHaveTenant
{
    public Guid TenantId { get; set; }
    
    public string Title { get; set; } = string.Empty; // e.g., "नागरिकता सिफारिस"
    public string Category { get; set; } = string.Empty; // e.g., "Citizenship", "Tax", "Land"
    
    // HTML Content containing placeholders like {{ApplicantName}}, {{CitizenshipNo}}
    public string HtmlContent { get; set; } = string.Empty;
    
    public bool IsActive { get; set; } = true;
}
