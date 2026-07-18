using LGOMS.Domain.Common;
using System;

namespace LGOMS.Domain.Entities;

public class ApplicationUser : BaseEntity
{
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty; // "Mayor", "WardChair", "Operator"
    public Guid TenantId { get; set; }
    public Guid? WardId { get; set; }
    
    // Navigation property
    public Tenant? Tenant { get; set; }
    public Ward? Ward { get; set; }
}
