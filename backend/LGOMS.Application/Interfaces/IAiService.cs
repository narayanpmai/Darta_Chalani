namespace LGOMS.Application.Interfaces;

public interface IAiService
{
    Task<string> GetChatResponseAsync(string prompt, string context = "");
}
