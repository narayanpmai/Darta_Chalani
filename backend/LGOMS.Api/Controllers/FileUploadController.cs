using System;
using System.Threading.Tasks;
using LGOMS.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LGOMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FileUploadController : ControllerBase
{
    private readonly IFileService _fileService;

    public FileUploadController(IFileService fileService)
    {
        _fileService = fileService;
    }

    [HttpPost]
    public async Task<IActionResult> Upload(IFormFile file, [FromForm] string type = "general")
    {
        try
        {
            using var stream = file.OpenReadStream();
            var url = await _fileService.UploadFileAsync(stream, file.FileName, type);
            return Ok(new { url });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
