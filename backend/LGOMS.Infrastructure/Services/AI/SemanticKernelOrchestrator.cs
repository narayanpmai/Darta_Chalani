using LGOMS.Application.Interfaces.AI;
using Microsoft.SemanticKernel;
using System.Threading;
using System.Threading.Tasks;

namespace LGOMS.Infrastructure.Services.AI
{
    public class SemanticKernelOrchestrator : IAgenticOrchestrator
    {
        private readonly Kernel _kernel;

        public SemanticKernelOrchestrator(Kernel kernel)
        {
            _kernel = kernel;
        }

        public async Task<string> ProcessPromptAsync(string prompt, CancellationToken cancellationToken = default)
        {
            var result = await _kernel.InvokePromptAsync(prompt, cancellationToken: cancellationToken);
            return result.GetValue<string>() ?? string.Empty;
        }

        public async Task<string> ProcessPromptWithContextAsync(string prompt, string context, CancellationToken cancellationToken = default)
        {
            string systemPrompt = $@"You are an AI Digital Government Officer for a Nepalese Local Government.
Here is the retrieved context to base your response on:
---
{context}
---
Answer the user's prompt based ONLY on the context above. If the context does not contain the answer, say you don't know.";

            var combinedPrompt = $"{systemPrompt}\n\nUser: {prompt}\nAI:";
            var result = await _kernel.InvokePromptAsync(combinedPrompt, cancellationToken: cancellationToken);
            return result.GetValue<string>() ?? string.Empty;
        }
    }
}
