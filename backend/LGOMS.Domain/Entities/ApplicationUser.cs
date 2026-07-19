using LGOMS.Domain.Common;
using System;

namespace LGOMS.Domain.Entities;

/// <summary>
/// प्रणाली प्रयोगकर्ता — कर्मचारी जानकारी
/// Nepal Government Office Management Standard User Entity
/// </summary>
public class ApplicationUser : BaseEntity, IMustHaveTenant
{
    // ── Core Identity
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;   // BCrypt hashed
    public string FullName { get; set; } = string.Empty;       // पूरा नाम
    public string Email { get; set; } = string.Empty;          // इमेल ठेगाना
    public string EmployeeCode { get; set; } = string.Empty;   // कर्मचारी कोड (EMP-001)

    // ── Role & Access
    /// <summary>Role: SuperAdmin | MunicipalityAdmin | WardChair | Operator</summary>
    public string Role { get; set; } = "Operator";

    // ── Status
    public bool IsActive { get; set; } = true;                 // सक्रिय/निष्क्रिय
    public DateTime? LastLoginAt { get; set; }                  // अन्तिम Login मिति

    // ── Tenant & Ward
    public Guid TenantId { get; set; }
    public Guid? WardId { get; set; }

    // ── Navigation properties
    public Tenant? Tenant { get; set; }
    public Ward? Ward { get; set; }
}
