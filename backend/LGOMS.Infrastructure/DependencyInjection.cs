using LGOMS.Application.Interfaces;
using LGOMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.SemanticKernel;
#pragma warning disable SKEXP0001
using Microsoft.SemanticKernel.Embeddings;
using Microsoft.SemanticKernel.Connectors.OpenAI;
#pragma warning restore SKEXP0001
using LGOMS.Application.Interfaces.AI;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"),
                b => {
                    b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName);
                    b.UseVector(); // Enable pgvector extension support
                }));

        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());
        services.AddScoped<IAiService, LGOMS.Infrastructure.Services.GovAiService>();
        services.AddScoped<ISequenceGeneratorService, LGOMS.Infrastructure.Services.SequenceGeneratorService>();
        services.AddScoped<IFileService, LGOMS.Infrastructure.Services.FileService>();
        // Semantic Kernel Setup
        services.AddScoped<Kernel>(provider => 
        {
            var builder = Kernel.CreateBuilder();
            var apiKey = configuration["AI:OpenAI:ApiKey"] ?? "mock-key";
            var modelId = configuration["AI:OpenAI:ModelId"] ?? "gpt-4o-mini";
            builder.AddOpenAIChatCompletion(modelId, apiKey);
            return builder.Build();
        });

#pragma warning disable SKEXP0001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
        services.AddScoped<ITextEmbeddingGenerationService>(provider => 
        {
            var apiKey = configuration["AI:OpenAI:ApiKey"] ?? "mock-key";
            var modelId = configuration["AI:OpenAI:EmbeddingModelId"] ?? "text-embedding-3-small";
            
            // Temporary manual instantiation for DI
            var builder = Kernel.CreateBuilder();
            builder.AddOpenAITextEmbeddingGeneration(modelId, apiKey);
            return builder.Build().GetRequiredService<ITextEmbeddingGenerationService>();
        });
#pragma warning restore SKEXP0001

        services.AddScoped<IAgenticOrchestrator, LGOMS.Infrastructure.Services.AI.SemanticKernelOrchestrator>();
        services.AddScoped<IDocumentIngestionService, LGOMS.Infrastructure.Services.AI.DocumentIngestionService>();

        return services;
    }
}
