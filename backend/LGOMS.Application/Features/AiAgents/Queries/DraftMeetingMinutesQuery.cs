using LGOMS.Application.Interfaces.AI;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace LGOMS.Application.Features.AiAgents.Queries
{
    public class DraftMeetingMinutesQuery : IRequest<string>
    {
        public string MeetingTitle { get; set; } = string.Empty;
        public string Agendas { get; set; } = string.Empty;
        public string DiscussionNotes { get; set; } = string.Empty;
    }

    public class DraftMeetingMinutesQueryHandler : IRequestHandler<DraftMeetingMinutesQuery, string>
    {
        private readonly IAgenticOrchestrator _orchestrator;
        private readonly IDocumentIngestionService _ingestionService;

        public DraftMeetingMinutesQueryHandler(IAgenticOrchestrator orchestrator, IDocumentIngestionService ingestionService)
        {
            _orchestrator = orchestrator;
            _ingestionService = ingestionService;
        }

        public async Task<string> Handle(DraftMeetingMinutesQuery request, CancellationToken cancellationToken)
        {
            // Search vector db for related past meeting decisions or policies
            var relevantContext = await _ingestionService.SearchRelevantContextAsync($"Meeting minutes about {request.MeetingTitle} {request.Agendas}", maxResults: 2, cancellationToken);

            var prompt = $@"
You are a formal Meeting Agent (बैठक एजेन्ट) for a local government office in Nepal.
Your task is to write official meeting minutes (निर्णय पुस्तिका मस्यौदा) in Nepali based on the provided agendas and rough discussion notes.
Ensure the tone is highly formal and authoritative, matching Nepali government standards. Use provided context if it helps align with past decisions.

Meeting Title: {request.MeetingTitle}
Agendas: {request.Agendas}
Rough Discussion Notes: {request.DiscussionNotes}

Format the output clearly with:
1. विषय (Subject)
2. प्रस्तावहरू (Agendas)
3. निर्णयहरू (Decisions)
";
            return await _orchestrator.ProcessPromptWithContextAsync(prompt, relevantContext, cancellationToken);
        }
    }
}
