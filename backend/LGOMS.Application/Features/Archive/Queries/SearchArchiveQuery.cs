using MediatR;
using LGOMS.Domain.Entities;
using LGOMS.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LGOMS.Application.Features.Archive.Queries;

public class SearchArchiveQuery : IRequest<List<ArchiveDocument>>
{
    public string Keyword { get; set; } = string.Empty;
}

public class SearchArchiveQueryHandler : IRequestHandler<SearchArchiveQuery, List<ArchiveDocument>>
{
    private readonly IApplicationDbContext _context;

    public SearchArchiveQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ArchiveDocument>> Handle(SearchArchiveQuery request, CancellationToken cancellationToken)
    {
        // Simple text search for the mock implementation.
        // In a real scenario, this would use EF.Functions.ToTsVector for PostgreSQL full-text search 
        // or integrate with Elasticsearch.
        var keyword = request.Keyword.ToLower();
        
        return await _context.ArchiveDocuments
            .AsNoTracking()
            .Where(a => 
                a.Title.ToLower().Contains(keyword) || 
                a.DocumentNumber.ToLower().Contains(keyword) ||
                a.ExtractedText.ToLower().Contains(keyword))
            .ToListAsync(cancellationToken);
    }
}
