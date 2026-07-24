using LGOMS.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using System;

namespace LGOMS.Api.Services;

public class CurrentWardService : IWardService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentWardService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid? GetWardId()
    {
        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext == null) return null;

        // 1. Check HTTP Header "X-Ward-Id" if explicitly passed by client
        if (httpContext.Request.Headers.TryGetValue("X-Ward-Id", out var headerWardId))
        {
            if (Guid.TryParse(headerWardId, out var wardIdFromHeader) && wardIdFromHeader != Guid.Empty)
            {
                return wardIdFromHeader;
            }
        }

        // 2. Check JWT Claim "WardId" from authenticated user token
        var wardClaim = httpContext.User.FindFirst("WardId")?.Value;
        if (Guid.TryParse(wardClaim, out var wardIdFromClaim) && wardIdFromClaim != Guid.Empty)
        {
            return wardIdFromClaim;
        }

        return null;
    }
}
