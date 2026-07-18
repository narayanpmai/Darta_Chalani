using MediatR;
using Microsoft.AspNetCore.Mvc;
using LGOMS.Application.Features.Darta.Commands;
using LGOMS.Application.Features.Darta.Queries;
using Microsoft.AspNetCore.Authorization;

namespace LGOMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DartaController : ControllerBase
{
    private readonly IMediator _mediator;

    public DartaController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateDartaCommand command)
    {
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id = result }, result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var query = new GetDartaByIdQuery { Id = id };
        var result = await _mediator.Send(query);

        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetList()
    {
        var query = new GetDartaListQuery();
        var result = await _mediator.Send(query);
        return Ok(result);
    }
}
