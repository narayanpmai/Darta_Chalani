using LGOMS.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LGOMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AiController : ControllerBase
{
    private readonly IAiService _aiService;

    public AiController(IAiService aiService)
    {
        _aiService = aiService;
    }

    [HttpPost("chat")]
    public async Task<IActionResult> Chat([FromBody] ChatRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Prompt))
            return BadRequest("Prompt cannot be empty");

        var response = await _aiService.GetChatResponseAsync(request.Prompt, request.Context);
        return Ok(new { response });
    }

    [HttpPost("generate-template")]
    public async Task<IActionResult> GenerateTemplate([FromBody] GenerateTemplateRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.SifarisType))
            return BadRequest("SifarisType cannot be empty");

        string prompt = $@"
You are a GovAI Assistant for Nepal Local Government.
Generate a formal HTML template for '{request.SifarisType}'.
Use standard official Nepali format.
Include placeholders inside double curly braces, e.g., {{{{ApplicantName}}}}, {{{{CitizenshipNo}}}}, {{{{Date}}}}.
The template should be wrapped in a <div class='sifaris-template'> tag.
Do not use markdown blocks, output ONLY raw HTML.";

        var htmlContent = await _aiService.GetChatResponseAsync(prompt, "Sifaris Template Generation");
        // Remove markdown formatting if the AI still adds it
        htmlContent = htmlContent.Replace("```html", "").Replace("```", "").Trim();

        return Ok(new { htmlContent });
    }
}

public class GenerateTemplateRequest
{
    public string SifarisType { get; set; } = string.Empty;
}

public class ChatRequest
{
    public string Prompt { get; set; } = string.Empty;
    public string Context { get; set; } = string.Empty;
}
