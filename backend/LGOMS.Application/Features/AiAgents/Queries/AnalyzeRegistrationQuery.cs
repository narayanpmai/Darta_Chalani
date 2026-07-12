using LGOMS.Application.Interfaces.AI;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace LGOMS.Application.Features.AiAgents.Queries
{
    public class AnalyzeRegistrationQuery : IRequest<string>
    {
        public string DocumentText { get; set; } = string.Empty;
    }

    public class AnalyzeRegistrationQueryHandler : IRequestHandler<AnalyzeRegistrationQuery, string>
    {
        private readonly IAgenticOrchestrator _orchestrator;

        public AnalyzeRegistrationQueryHandler(IAgenticOrchestrator orchestrator)
        {
            _orchestrator = orchestrator;
        }

        public async Task<string> Handle(AnalyzeRegistrationQuery request, CancellationToken cancellationToken)
        {
            var prompt = $@"
You are a highly efficient Digital Government Officer in Nepal.
Your task is to analyze the following scanned document text and extract the key information for 'Darta' (Registration).
Extract the information in valid JSON format ONLY, without any markdown formatting or extra text.
Required fields in JSON:
- SenderName (string)
- Subject (string)
- DocumentDate (string, try to find the date mentioned in the letter, format YYYY-MM-DD or Nepali Date if mentioned)
- SuggestedDepartment (string, suggest which department should handle this)

Document Text:
{request.DocumentText}
";
            // Return raw JSON response from AI
            return await _orchestrator.ProcessPromptAsync(prompt, cancellationToken);
        }
    }
}
