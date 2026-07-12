using LGOMS.Application.Interfaces;
using LGOMS.Domain.Common;
using LGOMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace LGOMS.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    private readonly ITenantService _tenantService;
    private readonly IFiscalYearService _fiscalYearService;

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, ITenantService tenantService, IFiscalYearService fiscalYearService)
        : base(options)
    {
        _tenantService = tenantService;
        _fiscalYearService = fiscalYearService;
    }

    public DbSet<Tenant> Tenants { get; set; }
    public DbSet<FiscalYear> FiscalYears { get; set; }
    public DbSet<Darta> Dartas { get; set; }
    public DbSet<Chalani> Chalanis { get; set; }
    public DbSet<Tippani> Tippanis { get; set; }
    public DbSet<Sifaris> Sifaris { get; set; }
    public DbSet<SifarisTemplate> SifarisTemplates { get; set; }
    public DbSet<ArchiveDocument> ArchiveDocuments { get; set; }
    public DbSet<ApplicationUser> Users { get; set; }
    public DbSet<DocumentChunk> DocumentChunks { get; set; }

    public Guid CurrentTenantId => _tenantService.GetTenantId();
    public Guid CurrentFiscalYearId => _fiscalYearService.GetFiscalYearId();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasPostgresExtension("vector");
        
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Darta>().HasQueryFilter(x => x.TenantId == CurrentTenantId && x.FiscalYearId == CurrentFiscalYearId);
        modelBuilder.Entity<Chalani>().HasQueryFilter(x => x.TenantId == CurrentTenantId && x.FiscalYearId == CurrentFiscalYearId);
        modelBuilder.Entity<Tippani>().HasQueryFilter(x => x.TenantId == CurrentTenantId && x.FiscalYearId == CurrentFiscalYearId);
        modelBuilder.Entity<Sifaris>().HasQueryFilter(x => x.TenantId == CurrentTenantId && x.FiscalYearId == CurrentFiscalYearId);
        modelBuilder.Entity<SifarisTemplate>().HasQueryFilter(x => x.TenantId == CurrentTenantId);
        modelBuilder.Entity<ArchiveDocument>().HasQueryFilter(x => x.TenantId == CurrentTenantId && x.FiscalYearId == CurrentFiscalYearId);
        modelBuilder.Entity<ApplicationUser>().HasQueryFilter(x => x.TenantId == CurrentTenantId);
        modelBuilder.Entity<FiscalYear>().HasQueryFilter(x => x.TenantId == CurrentTenantId);
        modelBuilder.Entity<DocumentChunk>().HasQueryFilter(x => x.TenantId == CurrentTenantId);

        // Add additional configurations/indexes here...
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = DateTime.UtcNow;
                    break;
                case EntityState.Modified:
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                    break;
            }
        }

        foreach (var entry in ChangeTracker.Entries<IMustHaveTenant>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                case EntityState.Modified:
                    // Ensure the TenantId is always set securely from the service
                    entry.Entity.TenantId = _tenantService.GetTenantId();
                    break;
            }
        }

        foreach (var entry in ChangeTracker.Entries<IFiscalYearAware>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    // Ensure the FiscalYearId is always set securely from the service if not explicitly set
                    if (entry.Entity.FiscalYearId == Guid.Empty)
                    {
                        entry.Entity.FiscalYearId = _fiscalYearService.GetFiscalYearId();
                    }
                    break;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}
