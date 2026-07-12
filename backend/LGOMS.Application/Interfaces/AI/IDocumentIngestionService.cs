using System.Threading;
using System.Threading.Tasks;

namespace LGOMS.Application.Interfaces.AI
{
    public interface IDocumentIngestionService
    {
        /// <summary>
        /// Chunks the given text, generates embeddings, and saves them to the Vector Database.
        /// </summary>
        Task IngestDocumentAsync(string documentId, string textContent, CancellationToken cancellationToken = default);
        
        /// <summary>
        /// Searches the Vector Database for chunks similar to the query.
        /// </summary>
        Task<string> SearchRelevantContextAsync(string query, int maxResults = 3, CancellationToken cancellationToken = default);
    }
}
