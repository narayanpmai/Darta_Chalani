using LGOMS.Domain.Entities;
using LGOMS.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace LGOMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ArchiveController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ArchiveController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetArchives([FromQuery] string? query, [FromQuery] string? documentType)
    {
        var archivesQuery = _context.ArchiveDocuments.AsQueryable();

        if (!string.IsNullOrWhiteSpace(query))
        {
            var q = query.ToLower();
            archivesQuery = archivesQuery.Where(a => 
                a.Title.ToLower().Contains(q) || 
                a.ExtractedText.ToLower().Contains(q) ||
                a.DocumentNumber.ToLower().Contains(q) ||
                a.Tags.ToLower().Contains(q));
        }

        if (!string.IsNullOrWhiteSpace(documentType) && documentType != "All")
        {
            archivesQuery = archivesQuery.Where(a => a.DocumentType == documentType);
        }

        var results = await archivesQuery
            .OrderByDescending(a => a.UploadDate)
            .ToListAsync();

        return Ok(results);
    }

    [HttpPost]
    public async Task<IActionResult> UploadArchive([FromBody] ArchiveDocument request)
    {
        // Setup default server-side fields if they are missing
        request.UploadDate = DateTime.UtcNow;
        if (string.IsNullOrWhiteSpace(request.Uploader)) 
        {
            request.Uploader = User.Identity?.Name ?? "Unknown";
        }

        _context.ArchiveDocuments.Add(request);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Document archived successfully", id = request.Id });
    }
}
