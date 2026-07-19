using LGOMS.Application.Interfaces;

using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace LGOMS.Api.Services;

public class CurrentTenantService : ITenantService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentTenantService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid GetTenantId()
    {
        var tenantIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst("TenantId")?.Value;
        
        if (Guid.TryParse(tenantIdClaim, out var tenantId))
        {
            return tenantId;
        }

        // Fallback for unauthenticated requests or local development
        return Guid.Parse("00000000-0000-0000-0000-000000000001");
    }
}
