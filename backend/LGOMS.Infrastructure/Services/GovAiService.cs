using LGOMS.Application.Interfaces;

namespace LGOMS.Infrastructure.Services;

public class GovAiService : IAiService
{
    public async Task<string> GetChatResponseAsync(string prompt, string context = "")
    {
        // Mock implementation for development phase
        // In production, this would call OpenAI API or a local LLM (Ollama)
        await Task.Delay(1500); // Simulate network latency

        if (prompt.Contains("leave", StringComparison.OrdinalIgnoreCase) || prompt.Contains("बिदा", StringComparison.OrdinalIgnoreCase))
        {
            return "Based on the Local Government Operation Act, to approve a leave request, you must verify the available balance and forward it to the Chief Administrative Officer. Would you like me to draft an approval Tippani for this?";
        }

        if (prompt.Contains("budget", StringComparison.OrdinalIgnoreCase) || prompt.Contains("बजेट", StringComparison.OrdinalIgnoreCase))
        {
            return "The municipal budget allocation process requires approval from the Ward Committee before submission to the Municipal Assembly. I can help you find specific templates for budget proposals.";
        }

        return $"This is an AI-generated response from GovAI Assistant. (Simulated response for prompt: '{prompt}')";
    }
}
