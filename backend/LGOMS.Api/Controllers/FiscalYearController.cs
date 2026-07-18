using LGOMS.Application.Interfaces;
using LGOMS.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LGOMS.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FiscalYearController : ControllerBase
    {
        private readonly IApplicationDbContext _context;
        private readonly ITenantService _tenantService;

        public FiscalYearController(IApplicationDbContext context, ITenantService tenantService)
        {
            _context = context;
            _tenantService = tenantService;
        }

        [HttpGet]
        public async Task<IActionResult> GetFiscalYears()
        {
            var tenantId = _tenantService.GetTenantId();
            var fiscalYears = await _context.FiscalYears
                .Where(f => f.TenantId == tenantId)
                .OrderByDescending(f => f.StartDate)
                .ToListAsync();

            if (fiscalYears.Count == 0)
            {
                var fy1 = new FiscalYear
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Name = "२०८१/०८२",
                    StartDate = new DateTime(2024, 7, 16),
                    EndDate = new DateTime(2025, 7, 15),
                    IsActive = true
                };
                var fy2 = new FiscalYear
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    Name = "२०८२/०८३",
                    StartDate = new DateTime(2025, 7, 16),
                    EndDate = new DateTime(2026, 7, 15),
                    IsActive = false
                };

                _context.FiscalYears.AddRange(fy1, fy2);
                await _context.SaveChangesAsync();

                fiscalYears = new List<FiscalYear> { fy2, fy1 };
            }

            return Ok(fiscalYears);
        }

        [HttpPost]
        public async Task<IActionResult> CreateFiscalYear([FromBody] FiscalYear fiscalYear)
        {
            fiscalYear.TenantId = _tenantService.GetTenantId();
            
            // If it's the first one, make it active
            var existingCount = await _context.FiscalYears.CountAsync(f => f.TenantId == fiscalYear.TenantId);
            if (existingCount == 0)
            {
                fiscalYear.IsActive = true;
            }
            
            if (fiscalYear.IsActive)
            {
                // Deactivate others
                var others = await _context.FiscalYears.Where(f => f.TenantId == fiscalYear.TenantId).ToListAsync();
                foreach (var other in others)
                {
                    other.IsActive = false;
                }
            }

            _context.FiscalYears.Add(fiscalYear);
            await _context.SaveChangesAsync();

            return Ok(fiscalYear);
        }

        [HttpPost("{id}/set-active")]
        public async Task<IActionResult> SetActiveFiscalYear(Guid id)
        {
            var tenantId = _tenantService.GetTenantId();
            var allFiscalYears = await _context.FiscalYears.Where(f => f.TenantId == tenantId).ToListAsync();
            
            var target = allFiscalYears.FirstOrDefault(f => f.Id == id);
            if (target == null) return NotFound();

            foreach (var fy in allFiscalYears)
            {
                fy.IsActive = (fy.Id == id);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Active fiscal year updated successfully." });
        }
    }
}
