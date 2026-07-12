using LGOMS.Application.Interfaces.AI;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace LGOMS.Application.Features.AiAgents.Queries
{
    public class DraftSifarisQuery : IRequest<string>
    {
        public string SifarisType { get; set; } = string.Empty;
        public string ApplicantName { get; set; } = string.Empty;
        public string SubmittedDocuments { get; set; } = string.Empty;
    }

    public class DraftSifarisQueryHandler : IRequestHandler<DraftSifarisQuery, string>
    {
        private readonly IAgenticOrchestrator _orchestrator;
        private readonly IDocumentIngestionService _ingestionService;

        public DraftSifarisQueryHandler(IAgenticOrchestrator orchestrator, IDocumentIngestionService ingestionService)
        {
            _orchestrator = orchestrator;
            _ingestionService = ingestionService;
        }

        public async Task<string> Handle(DraftSifarisQuery request, CancellationToken cancellationToken)
        {
            // Search vector db for requirements of this specific sifaris type
            var relevantLaws = await _ingestionService.SearchRelevantContextAsync($"Requirements for {request.SifarisType}", maxResults: 2, cancellationToken);

            var prompt = $@"
You are a Local Government Officer in Nepal analyzing a Recommendation (Sifaris) request.
Sifaris Type: {request.SifarisType}
Applicant: {request.ApplicantName}
Submitted Documents: {request.SubmittedDocuments}

Based on the legal context provided, perform two tasks:
1. Identify if any required documents are missing.
2. If all documents seem present, draft a short formal Sifaris letter in Nepali. If documents are missing, list them in Nepali.

Return a JSON with two fields:
- Status (string: 'Ready' or 'Missing Documents')
- Message (string: The drafted letter or the list of missing documents)
Respond ONLY with valid JSON.
";
            return await _orchestrator.ProcessPromptWithContextAsync(prompt, relevantLaws, cancellationToken);
        }
    }
}
