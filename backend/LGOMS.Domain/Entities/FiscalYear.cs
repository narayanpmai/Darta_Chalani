using System;
using LGOMS.Domain.Common;

namespace LGOMS.Domain.Entities
{
    public class FiscalYear : BaseEntity, IMustHaveTenant
    {
        public string Name { get; set; } // e.g. "२०८०/०८१"
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsActive { get; set; }
        public Guid TenantId { get; set; }
    }
}
