using LGOMS.Application.Interfaces.AI;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace LGOMS.Application.Features.AiAgents.Queries
{
    public class DraftTippaniQuery : IRequest<string>
    {
        public string Subject { get; set; } = string.Empty;
        public string ContextDescription { get; set; } = string.Empty;
    }

    public class DraftTippaniQueryHandler : IRequestHandler<DraftTippaniQuery, string>
    {
        private readonly IAgenticOrchestrator _orchestrator;
        private readonly IDocumentIngestionService _ingestionService;

        public DraftTippaniQueryHandler(IAgenticOrchestrator orchestrator, IDocumentIngestionService ingestionService)
        {
            _orchestrator = orchestrator;
            _ingestionService = ingestionService;
        }

        public async Task<string> Handle(DraftTippaniQuery request, CancellationToken cancellationToken)
        {
            // 1. Search Vector DB for related laws, guidelines, or previous decisions based on the subject.
            var relevantContext = await _ingestionService.SearchRelevantContextAsync(request.Subject, maxResults: 3, cancellationToken);

            // 2. Draft the Tippani using the orchestrator with context (RAG)
            var prompt = $@"
Draft a formal government 'Tippani' (टिप्पणी - Comment/Order draft) in Nepali language for the following subject.
Use the provided context to ensure it aligns with existing laws/guidelines.
Format it formally as standard Nepali government Tippani.

Subject: {request.Subject}
Context/Background from User: {request.ContextDescription}
";
            
            return await _orchestrator.ProcessPromptWithContextAsync(prompt, relevantContext, cancellationToken);
        }
    }
}
