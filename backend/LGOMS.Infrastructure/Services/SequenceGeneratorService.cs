using LGOMS.Application.Interfaces;
using LGOMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using LGOMS.Infrastructure.Persistence;

namespace LGOMS.Infrastructure.Services;

public class SequenceGeneratorService : ISequenceGeneratorService
{
    private readonly ApplicationDbContext _context;

    public SequenceGeneratorService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<string> GenerateNextSequenceAsync(Guid tenantId, Guid? wardId, Guid fiscalYearId, string entityType)
    {
        var tracker = await _context.SequenceTrackers
            .FirstOrDefaultAsync(x => x.TenantId == tenantId 
                                   && x.WardId == wardId 
                                   && x.FiscalYearId == fiscalYearId 
                                   && x.EntityType == entityType);

        if (tracker == null)
        {
            tracker = new SequenceTracker
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                WardId = wardId,
                FiscalYearId = fiscalYearId,
                EntityType = entityType,
                CurrentSequence = 0
            };
            _context.SequenceTrackers.Add(tracker);
        }

        tracker.CurrentSequence++;
        
        await _context.SaveChangesAsync();

        return tracker.CurrentSequence.ToString();
    }
}
