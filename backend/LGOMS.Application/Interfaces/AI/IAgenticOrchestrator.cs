using Microsoft.SemanticKernel;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace LGOMS.Application.Interfaces.AI
{
    public interface IAgenticOrchestrator
    {
        /// <summary>
        /// Processes a natural language prompt and returns the AI's string response.
        /// </summary>
        Task<string> ProcessPromptAsync(string prompt, CancellationToken cancellationToken = default);

        /// <summary>
        /// Processes a prompt using Retrieval-Augmented Generation (RAG) with provided context.
        /// </summary>
        Task<string> ProcessPromptWithContextAsync(string prompt, string context, CancellationToken cancellationToken = default);
    }
}
