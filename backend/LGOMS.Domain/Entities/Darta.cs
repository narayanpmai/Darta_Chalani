using LGOMS.Domain.Common;

namespace LGOMS.Domain.Entities;

public class Darta : BaseEntity, IMustHaveTenant, IFiscalYearAware
{
    public Guid FiscalYearId { get; set; }
    public Guid TenantId { get; set; }
    
    public string DartaNumber { get; set; } = string.Empty;
    public DateTime RegistrationDate { get; set; }
    public string Miti { get; set; } = string.Empty;
    public string SenderName { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string? AttachmentUrl { get; set; }
    public string? ForwardedToDepartment { get; set; }
    public string Priority { get; set; } = "Normal";
    public string Status { get; set; } = "Pending";
}
