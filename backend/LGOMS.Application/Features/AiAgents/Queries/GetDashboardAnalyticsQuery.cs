using LGOMS.Application.Interfaces.AI;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace LGOMS.Application.Features.AiAgents.Queries
{
    public class GetDashboardAnalyticsQuery : IRequest<string>
    {
        // In a real application, you might pass specific timeframes or filters here
        public string RawDataContext { get; set; } = string.Empty;
    }

    public class GetDashboardAnalyticsQueryHandler : IRequestHandler<GetDashboardAnalyticsQuery, string>
    {
        private readonly IAgenticOrchestrator _orchestrator;

        public GetDashboardAnalyticsQueryHandler(IAgenticOrchestrator orchestrator)
        {
            _orchestrator = orchestrator;
        }

        public async Task<string> Handle(GetDashboardAnalyticsQuery request, CancellationToken cancellationToken)
        {
            var prompt = $@"
You are an Executive Analytics AI for a Local Government in Nepal.
Your task is to analyze the following raw statistical data of the office's daily operations and provide a brief, actionable 'Executive Summary' in Nepali language.
Focus on bottlenecks (e.g. too many pending files in a certain department) and suggest immediate actions.

Raw Data:
{request.RawDataContext}

Respond in a professional, formal Nepali tone. Provide the summary as plain text (or markdown).
";
            return await _orchestrator.ProcessPromptAsync(prompt, cancellationToken);
        }
    }
}
