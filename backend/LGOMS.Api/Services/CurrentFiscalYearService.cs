using System;
using System.Linq;
using LGOMS.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using LGOMS.Domain.Entities;

namespace LGOMS.Api.Services;

public class CurrentFiscalYearService : IFiscalYearService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IServiceProvider _serviceProvider;

    public CurrentFiscalYearService(IHttpContextAccessor httpContextAccessor, IServiceProvider serviceProvider)
    {
        _httpContextAccessor = httpContextAccessor;
        _serviceProvider = serviceProvider;
    }

    public Guid GetFiscalYearId()
    {
        var context = _httpContextAccessor.HttpContext;
        if (context != null && context.Request.Headers.TryGetValue("X-Fiscal-Year-Id", out var values))
        {
            if (Guid.TryParse(values.FirstOrDefault(), out var fiscalYearId))
            {
                return fiscalYearId;
            }
        }
        
        return Guid.Empty;
    }
}
