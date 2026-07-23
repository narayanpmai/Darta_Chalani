using LGOMS.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using System;

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
        var httpContext = _httpContextAccessor.HttpContext;

        // 1. Check HTTP Header first (e.g. for API/SuperAdmin tenant context header)
        if (httpContext != null && httpContext.Request.Headers.TryGetValue("X-Tenant-Id", out var headerTenantId))
        {
            if (Guid.TryParse(headerTenantId, out var tenantIdFromHeader) && tenantIdFromHeader != Guid.Empty)
            {
                return tenantIdFromHeader;
            }
        }

        // 2. Check User Claim in JWT Token
        var tenantIdClaim = httpContext?.User?.FindFirst("TenantId")?.Value;
        if (Guid.TryParse(tenantIdClaim, out var tenantIdFromClaim) && tenantIdFromClaim != Guid.Empty)
        {
            return tenantIdFromClaim;
        }

        // 3. Fallback for unauthenticated requests or local development
        return Guid.Parse("00000000-0000-0000-0000-000000000001");
    }
}

