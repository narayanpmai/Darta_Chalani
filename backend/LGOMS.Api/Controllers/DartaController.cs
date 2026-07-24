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
        try
        {
            var result = await _mediator.Send(command);
            return Ok(new { id = result });
        }
        catch (FluentValidation.ValidationException valEx)
        {
            var errorMessages = string.Join(", ", valEx.Errors.Select(e => e.ErrorMessage));
            return BadRequest(new { message = errorMessages });
        }
        catch (Exception ex)
        {
            var current = ex;
            while (current.InnerException != null)
            {
                current = current.InnerException;
            }
            return StatusCode(500, new { message = current.Message });
        }
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

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateDartaCommand command)
    {
        command.Id = id;
        try
        {
            await _mediator.Send(command);
            return Ok(new { message = "दर्ता विवरण सफलतापूर्वक अपडेट भयो।" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            await _mediator.Send(new DeleteDartaCommand { Id = id });
            return Ok(new { message = "दर्ता विवरण सफलतापूर्वक हटाइयो।" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}

