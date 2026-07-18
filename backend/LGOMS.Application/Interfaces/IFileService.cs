using System.IO;
using System.Threading.Tasks;

namespace LGOMS.Application.Interfaces;

public interface IFileService
{
    Task<string> UploadFileAsync(Stream fileStream, string fileName, string subDirectory);
}
