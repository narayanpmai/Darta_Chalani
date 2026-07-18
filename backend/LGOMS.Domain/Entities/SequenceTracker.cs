using LGOMS.Domain.Common;
using System;

namespace LGOMS.Domain.Entities;

public class SequenceTracker : BaseEntity, IMustHaveTenant, IFiscalYearAware
{
    public Guid TenantId { get; set; }
    public Guid? WardId { get; set; } // Null implies Palika level
    public Guid FiscalYearId { get; set; }
    
    // e.g., "Darta", "Chalani", "Tippani"
    public string EntityType { get; set; } = string.Empty;
    
    public int CurrentSequence { get; set; } = 0;
}
