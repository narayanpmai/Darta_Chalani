using LGOMS.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;

namespace LGOMS.Application.Features.Reports.Queries;

public class DashboardStatsDto
{
    public int TotalDarta { get; set; }
    public int TotalChalani { get; set; }
    public int TotalTippani { get; set; }
    public int TotalSifaris { get; set; }
}

public class GetDashboardStatsQuery : IRequest<DashboardStatsDto>
{
}

public class GetDashboardStatsQueryHandler : IRequestHandler<GetDashboardStatsQuery, DashboardStatsDto>
{
    private readonly IApplicationDbContext _context;

    public GetDashboardStatsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardStatsDto> Handle(GetDashboardStatsQuery request, CancellationToken cancellationToken)
    {
        // Global Query Filters automatically apply Tenant isolation
        var dartaCount = await _context.Dartas.CountAsync(cancellationToken);
        var chalaniCount = await _context.Chalanis.CountAsync(cancellationToken);
        var tippaniCount = await _context.Tippanis.CountAsync(cancellationToken);
        var sifarisCount = await _context.Sifaris.CountAsync(cancellationToken);

        return new DashboardStatsDto
        {
            TotalDarta = dartaCount,
            TotalChalani = chalaniCount,
            TotalTippani = tippaniCount,
            TotalSifaris = sifarisCount
        };
    }
}
