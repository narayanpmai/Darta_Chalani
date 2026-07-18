using LGOMS.Application.Features.Tenants.Commands;
using LGOMS.Application.Features.Tenants.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
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

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var tenants = await _mediator.Send(new GetTenantsQuery());
        return Ok(tenants);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, UpdateTenantCommand command)
    {
        command.Id = id;
        await _mediator.Send(command);
        return Ok();
    }
}
