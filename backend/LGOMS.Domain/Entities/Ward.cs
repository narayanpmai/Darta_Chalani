using LGOMS.Domain.Common;
using System;

namespace LGOMS.Domain.Entities;

public class Ward : BaseEntity, IMustHaveTenant
{
    public Guid TenantId { get; set; }
    public int WardNumber { get; set; }
    public string? ContactEmail { get; set; }
    public string? ContactPhone { get; set; }

    // Navigation properties
    public Tenant? Tenant { get; set; }
}
