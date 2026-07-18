using LGOMS.Domain.Common;

namespace LGOMS.Domain.Entities;

public class Chalani : BaseEntity, IMustHaveTenant, IFiscalYearAware
{
    public Guid FiscalYearId { get; set; }
    public Guid TenantId { get; set; }
    
    public string ChalaniNumber { get; set; } = string.Empty;
    public DateTime DispatchDate { get; set; }
    public string Miti { get; set; } = string.Empty;
    public string ReceiverName { get; set; } = string.Empty;
    public string ReceiverAddress { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string? AttachmentUrl { get; set; }
    public string OriginatingDepartment { get; set; } = string.Empty;
    public string DeliveryMethod { get; set; } = "Physical";
    public string Status { get; set; } = "Dispatched";
    
    public string? ReferenceLetterNumber { get; set; }
    public string? Remarks { get; set; }
    
    public string? PeonBookNumber { get; set; }
    public string? DispatchTime { get; set; }
    public string? OrderOrDecision { get; set; }
}
