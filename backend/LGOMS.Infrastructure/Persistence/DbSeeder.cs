using LGOMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace LGOMS.Infrastructure.Persistence;

public static class DbSeeder
{
    public static readonly Guid MasterTenantId = Guid.Parse("00000000-0000-0000-0000-000000000001");

    /// <summary>
    /// Safe seed method called on application startup.
    /// Ensures Master Tenant and SuperAdmin user exist WITHOUT deleting any existing data.
    /// </summary>
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // ── 1. ENSURE MASTER TENANT (MUNICIPALITY) ──────────────────────────────────
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

        // ── 2. ENSURE SUPERADMIN USER ───────────────────────────────────────────────
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
            if (superAdmin.TenantId != MasterTenantId || superAdmin.Role != "SuperAdmin" || !superAdmin.IsActive)
            {
                superAdmin.Role = "SuperAdmin";
                superAdmin.TenantId = MasterTenantId;
                superAdmin.IsActive = true;
                await context.SaveChangesAsync();
            }
        }
    }

    /// <summary>
    /// Optional manual purge method — ONLY called when explicitly requested via API for resetting dev test data.
    /// </summary>
    public static async Task PurgeNonMasterTenantsAsync(ApplicationDbContext context)
    {
        await SeedAsync(context);

        var superAdmin = await context.Users
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(u => u.Role == "SuperAdmin" || u.Username == "superadmin");

        // ── 1. PURGE NON-SUPERADMIN USERS FIRST (TO PREVENT FK CONSTRAINTS) ─────────
        var nonSuperAdminUsers = await context.Users
            .IgnoreQueryFilters()
            .Where(u => u.Role != "SuperAdmin" && u.Username != "superadmin" && (superAdmin == null || u.Id != superAdmin.Id))
            .ToListAsync();

        if (nonSuperAdminUsers.Count > 0)
        {
            context.Users.RemoveRange(nonSuperAdminUsers);
            await context.SaveChangesAsync();
        }

        if (superAdmin != null && superAdmin.WardId.HasValue)
        {
            superAdmin.WardId = null;
            await context.SaveChangesAsync();
        }

        // ── 2. PURGE OTHER TENANTS & RELATED ENTITIES ────────────────────────────────
        var otherTenants = await context.Tenants
            .IgnoreQueryFilters()
            .Where(t => t.Id != MasterTenantId)
            .ToListAsync();

        if (otherTenants.Count > 0)
        {
            var nonMasterTenantIds = otherTenants.Select(t => t.Id).ToList();

            var otherDartas = await context.Dartas
                .IgnoreQueryFilters()
                .Where(d => nonMasterTenantIds.Contains(d.TenantId))
                .ToListAsync();
            if (otherDartas.Count > 0) context.Dartas.RemoveRange(otherDartas);

            var otherChalanis = await context.Chalanis
                .IgnoreQueryFilters()
                .Where(c => nonMasterTenantIds.Contains(c.TenantId))
                .ToListAsync();
            if (otherChalanis.Count > 0) context.Chalanis.RemoveRange(otherChalanis);

            var otherTippanis = await context.Tippanis
                .IgnoreQueryFilters()
                .Where(tp => nonMasterTenantIds.Contains(tp.TenantId))
                .ToListAsync();
            if (otherTippanis.Count > 0) context.Tippanis.RemoveRange(otherTippanis);

            var otherSifaris = await context.Sifaris
                .IgnoreQueryFilters()
                .Where(s => nonMasterTenantIds.Contains(s.TenantId))
                .ToListAsync();
            if (otherSifaris.Count > 0) context.Sifaris.RemoveRange(otherSifaris);

            var otherSequences = await context.SequenceTrackers
                .IgnoreQueryFilters()
                .Where(st => nonMasterTenantIds.Contains(st.TenantId))
                .ToListAsync();
            if (otherSequences.Count > 0) context.SequenceTrackers.RemoveRange(otherSequences);

            var otherFiscalYears = await context.FiscalYears
                .IgnoreQueryFilters()
                .Where(f => nonMasterTenantIds.Contains(f.TenantId))
                .ToListAsync();
            if (otherFiscalYears.Count > 0) context.FiscalYears.RemoveRange(otherFiscalYears);

            var otherWards = await context.Wards
                .IgnoreQueryFilters()
                .Where(w => nonMasterTenantIds.Contains(w.TenantId))
                .ToListAsync();
            if (otherWards.Count > 0) context.Wards.RemoveRange(otherWards);

            context.Tenants.RemoveRange(otherTenants);
            await context.SaveChangesAsync();
        }
    }
}
