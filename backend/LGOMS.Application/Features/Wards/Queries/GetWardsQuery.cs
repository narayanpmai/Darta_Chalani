using LGOMS.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LGOMS.Application.Features.Wards.Queries
{
    public class WardDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string NameEn { get; set; } = string.Empty;
        public int WardNumber { get; set; }
    }

    public class GetWardsQuery : IRequest<List<WardDto>>
    {
    }

    public class GetWardsQueryHandler : IRequestHandler<GetWardsQuery, List<WardDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetWardsQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<WardDto>> Handle(GetWardsQuery request, CancellationToken cancellationToken)
        {
            var wards = await _context.Wards
                .OrderBy(w => w.WardNumber)
                .Select(w => new WardDto
                {
                    Id = w.Id,
                    Name = "वडा नं. " + w.WardNumber,
                    NameEn = "Ward No. " + w.WardNumber,
                    WardNumber = w.WardNumber
                })
                .ToListAsync(cancellationToken);

            return wards;
        }
    }
}
