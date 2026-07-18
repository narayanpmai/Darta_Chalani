using LGOMS.Application.Features.Tenants.Commands;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace LGOMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TenantsController : ControllerBase
{
    private readonly IMediator _mediator;

    public TenantsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateTenantCommand command)
    {
        var tenantId = await _mediator.Send(command);
        return Ok(new { TenantId = tenantId });
    }
}
