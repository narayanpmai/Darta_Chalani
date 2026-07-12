using LGOMS.Application.Interfaces;
using LGOMS.Application.Interfaces.AI;
using LGOMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.SemanticKernel.Embeddings;
using Pgvector;
using Pgvector.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LGOMS.Infrastructure.Services.AI
{
    public class DocumentIngestionService : IDocumentIngestionService
    {
        private readonly IApplicationDbContext _context;
#pragma warning disable SKEXP0001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
        private readonly ITextEmbeddingGenerationService _embeddingService;
#pragma warning restore SKEXP0001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
        private readonly ITenantService _tenantService;

#pragma warning disable SKEXP0001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
        public DocumentIngestionService(IApplicationDbContext context, ITextEmbeddingGenerationService embeddingService, ITenantService tenantService)
#pragma warning restore SKEXP0001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
        {
            _context = context;
            _embeddingService = embeddingService;
            _tenantService = tenantService;
        }

        public async Task IngestDocumentAsync(string documentId, string textContent, CancellationToken cancellationToken = default)
        {
            // Simple chunking (in a real app, use SemanticTextChunker)
            var chunks = textContent.Split("\n\n").Where(x => !string.IsNullOrWhiteSpace(x)).ToList();

            foreach (var chunk in chunks)
            {
#pragma warning disable SKEXP0001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
                var embeddingResult = await _embeddingService.GenerateEmbeddingAsync(chunk, cancellationToken: cancellationToken);
#pragma warning restore SKEXP0001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
                
                var documentChunk = new DocumentChunk
                {
                    SourceDocumentId = documentId,
                    TextContent = chunk,
                    Embedding = new Vector(embeddingResult.ToArray()),
                    TenantId = _tenantService.GetTenantId()
                };

                _context.DocumentChunks.Add(documentChunk);
            }

            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task<string> SearchRelevantContextAsync(string query, int maxResults = 3, CancellationToken cancellationToken = default)
        {
#pragma warning disable SKEXP0001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
            var queryEmbeddingResult = await _embeddingService.GenerateEmbeddingAsync(query, cancellationToken: cancellationToken);
#pragma warning restore SKEXP0001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
            var queryVector = new Vector(queryEmbeddingResult.ToArray());
            var tenantId = _tenantService.GetTenantId();

            var relevantChunks = await _context.DocumentChunks
                .Where(c => c.TenantId == tenantId)
                .OrderBy(c => c.Embedding!.L2Distance(queryVector))
                .Take(maxResults)
                .Select(c => c.TextContent)
                .ToListAsync(cancellationToken);

            return string.Join("\n\n", relevantChunks);
        }
    }
}
