using LGOMS.Application.Interfaces;

namespace LGOMS.Api.Services;

public class CurrentTenantService : ITenantService
{
    // Mock implementation for development. In production, this reads the Tenant ID from the JWT token.
    public Guid GetTenantId()
    {
        return Guid.Parse("00000000-0000-0000-0000-000000000001");
    }
}
