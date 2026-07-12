using LGOMS.Application.Features.AiAgents.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LGOMS.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize] // Uncomment when authentication is strictly enforced from frontend
    public class AiAgentController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AiAgentController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("analyze-registration")]
        public async Task<IActionResult> AnalyzeRegistration([FromBody] AnalyzeRegistrationQuery query)
        {
            var result = await _mediator.Send(query);
            // Result is expected to be a JSON string from the AI
            return Content(result, "application/json");
        }

        [HttpPost("draft-tippani")]
        public async Task<IActionResult> DraftTippani([FromBody] DraftTippaniQuery query)
        {
            var result = await _mediator.Send(query);
            return Ok(new { draft = result });
        }

        [HttpPost("draft-sifaris")]
        public async Task<IActionResult> DraftSifaris([FromBody] DraftSifarisQuery query)
        {
            var result = await _mediator.Send(query);
            return Content(result, "application/json");
        }

        [HttpPost("analytics")]
        public async Task<IActionResult> GetAnalytics([FromBody] GetDashboardAnalyticsQuery query)
        {
            var result = await _mediator.Send(query);
            return Ok(new { summary = result });
        }

        [HttpPost("draft-meeting-minutes")]
        public async Task<IActionResult> DraftMeetingMinutes([FromBody] DraftMeetingMinutesQuery query)
        {
            var result = await _mediator.Send(query);
            return Ok(new { draft = result });
        }
    }
}
