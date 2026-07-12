using LGOMS.Application.Interfaces;
using LGOMS.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LGOMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SifarisTemplateController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public SifarisTemplateController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetTemplates([FromQuery] string? category)
    {
        var query = _context.SifarisTemplates.Where(t => t.IsActive);
        
        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(t => t.Category == category);
        }

        var templates = await query.ToListAsync();
        return Ok(templates);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTemplate(Guid id)
    {
        var template = await _context.SifarisTemplates.FindAsync(id);
        if (template == null) return NotFound();
        return Ok(template);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTemplate([FromBody] SifarisTemplate request)
    {
        // For simplicity in this implementation, tenantId is set to empty Guid (in a real app it comes from current user context)
        request.TenantId = Guid.Empty;
        
        _context.SifarisTemplates.Add(request);
        await _context.SaveChangesAsync(default);
        
        return CreatedAtAction(nameof(GetTemplate), new { id = request.Id }, request);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTemplate(Guid id, [FromBody] SifarisTemplate request)
    {
        var template = await _context.SifarisTemplates.FindAsync(id);
        if (template == null) return NotFound();

        template.Title = request.Title;
        template.Category = request.Category;
        template.HtmlContent = request.HtmlContent;
        template.IsActive = request.IsActive;

        await _context.SaveChangesAsync(default);
        return NoContent();
    }
}
