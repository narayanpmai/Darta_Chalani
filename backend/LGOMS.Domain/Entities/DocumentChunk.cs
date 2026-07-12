using Pgvector;
using System.ComponentModel.DataAnnotations.Schema;

namespace LGOMS.Domain.Entities
{
    public class DocumentChunk
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        public string SourceDocumentId { get; set; } = string.Empty;
        
        public string TextContent { get; set; } = string.Empty;
        
        [Column(TypeName = "vector(1536)")]
        public Vector? Embedding { get; set; }
        
        public Guid TenantId { get; set; }
    }
}
