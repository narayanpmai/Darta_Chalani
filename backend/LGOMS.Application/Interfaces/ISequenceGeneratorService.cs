using System;
using System.Threading.Tasks;

namespace LGOMS.Application.Interfaces;

public interface ISequenceGeneratorService
{
    Task<string> GenerateNextSequenceAsync(Guid tenantId, Guid? wardId, Guid fiscalYearId, string entityType);
}
