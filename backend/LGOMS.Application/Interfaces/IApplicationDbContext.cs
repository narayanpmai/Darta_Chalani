using LGOMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace LGOMS.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Tenant> Tenants { get; set; }
    DbSet<FiscalYear> FiscalYears { get; set; }
    DbSet<Darta> Dartas { get; set; }
    DbSet<Chalani> Chalanis { get; set; }
    DbSet<Tippani> Tippanis { get; set; }
    DbSet<Sifaris> Sifaris { get; set; }
    DbSet<SifarisTemplate> SifarisTemplates { get; set; }
    DbSet<ArchiveDocument> ArchiveDocuments { get; set; }
    DbSet<ApplicationUser> Users { get; set; }
    DbSet<DocumentChunk> DocumentChunks { get; set; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
