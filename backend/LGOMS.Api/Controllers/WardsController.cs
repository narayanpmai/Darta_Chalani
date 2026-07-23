using LGOMS.Application.Features.Wards.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LGOMS.Api.Controllers;

/// <summary>
/// Wards API — वडा कार्यालय व्यवस्थापन
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WardsController : ControllerBase
{
    private readonly IMediator _mediator;

    public WardsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>GET /api/wards — सबै Wards को सूची</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var wards = await _mediator.Send(new GetWardsQuery());
        return Ok(wards);
    }
}
