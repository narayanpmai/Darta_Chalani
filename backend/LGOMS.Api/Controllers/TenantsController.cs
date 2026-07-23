using LGOMS.Application.Features.Tenants.Commands;
using LGOMS.Application.Features.Tenants.Queries;
using LGOMS.Infrastructure.Persistence;
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
    private readonly ApplicationDbContext _context;

    public TenantsController(IMediator mediator, ApplicationDbContext context)
    {
        _mediator = mediator;
        _context = context;
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

    /// <summary>POST /api/tenants/purge-non-master — Master Municipality बाहेक अरू सबै सिर्जित Municipalities हटाउनुहोस्</summary>
    [HttpPost("purge-non-master")]
    public async Task<IActionResult> PurgeNonMasterTenants()
    {
        await DbSeeder.SeedAsync(_context);
        return Ok(new { message = "Master Municipality बाहेक अरू सबै सिर्जित Municipalities सफलतापुर्वक हटाइयो।" });
    }
}

