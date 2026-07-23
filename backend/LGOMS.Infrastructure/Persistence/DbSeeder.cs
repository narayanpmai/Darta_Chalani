using LGOMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace LGOMS.Infrastructure.Persistence;

public static class DbSeeder
{
    public static readonly Guid MasterTenantId = Guid.Parse("00000000-0000-0000-0000-000000000001");

    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // ── 1. MASTER TENANT (MUNICIPALITY) SEEDING & CLEANUP ───────────────────────
        var masterTenant = await context.Tenants
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(t => t.Id == MasterTenantId);

        if (masterTenant == null)
        {
            masterTenant = new Tenant
            {
                Id = MasterTenantId,
                Name = "Master Municipality",
                Domain = "master.lgoms.gov.np",
                ConnectionString = "Shared",
                IsActive = true
            };
            context.Tenants.Add(masterTenant);
            await context.SaveChangesAsync();
        }

        // Purge all other Municipalities (Tenants) except Master Municipality
        var otherTenants = await context.Tenants
            .IgnoreQueryFilters()
            .Where(t => t.Id != MasterTenantId)
            .ToListAsync();

        if (otherTenants.Count > 0)
        {
            context.Tenants.RemoveRange(otherTenants);

            // Clean up related entities for non-master tenants
            var nonMasterTenantIds = otherTenants.Select(t => t.Id).ToList();

            var otherWards = await context.Wards
                .IgnoreQueryFilters()
                .Where(w => nonMasterTenantIds.Contains(w.TenantId))
                .ToListAsync();
            context.Wards.RemoveRange(otherWards);

            var otherFiscalYears = await context.FiscalYears
                .IgnoreQueryFilters()
                .Where(f => nonMasterTenantIds.Contains(f.TenantId))
                .ToListAsync();
            context.FiscalYears.RemoveRange(otherFiscalYears);

            var otherSequences = await context.SequenceTrackers
                .IgnoreQueryFilters()
                .Where(s => nonMasterTenantIds.Contains(s.TenantId))
                .ToListAsync();
            context.SequenceTrackers.RemoveRange(otherSequences);

            var otherDartas = await context.Dartas
                .IgnoreQueryFilters()
                .Where(d => nonMasterTenantIds.Contains(d.TenantId))
                .ToListAsync();
            context.Dartas.RemoveRange(otherDartas);

            var otherChalanis = await context.Chalanis
                .IgnoreQueryFilters()
                .Where(c => nonMasterTenantIds.Contains(c.TenantId))
                .ToListAsync();
            context.Chalanis.RemoveRange(otherChalanis);

            await context.SaveChangesAsync();
        }

        // ── 2. PRIMARY SUPERADMIN USER SEEDING & CLEANUP ───────────────────────────
        var superAdmin = await context.Users
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(u => u.Role == "SuperAdmin" || u.Username == "superadmin");

        if (superAdmin == null)
        {
            superAdmin = new ApplicationUser
            {
                Id = Guid.NewGuid(),
                TenantId = MasterTenantId,
                Username = "superadmin",
                FullName = "System Super Admin",
                Email = "admin@lgoms.gov.np",
                EmployeeCode = "SA-001",
                Role = "SuperAdmin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                IsActive = true
            };
            context.Users.Add(superAdmin);
            await context.SaveChangesAsync();
        }
        else
        {
            // Ensure superadmin has correct role, tenant and is active
            superAdmin.Role = "SuperAdmin";
            superAdmin.TenantId = MasterTenantId;
            superAdmin.IsActive = true;
            await context.SaveChangesAsync();
        }

        // Purge all non-SuperAdmin users from Database
        var nonSuperAdminUsers = await context.Users
            .IgnoreQueryFilters()
            .Where(u => u.Role != "SuperAdmin" && u.Username != "superadmin" && u.Id != superAdmin.Id)
            .ToListAsync();

        if (nonSuperAdminUsers.Count > 0)
        {
            context.Users.RemoveRange(nonSuperAdminUsers);
            await context.SaveChangesAsync();
        }
    }
}
