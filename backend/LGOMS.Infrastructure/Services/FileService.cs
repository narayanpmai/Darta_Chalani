using System;
using System.IO;
using System.Threading.Tasks;
using LGOMS.Application.Interfaces;

namespace LGOMS.Infrastructure.Services;

public class FileService : IFileService
{
    public FileService()
    {
    }

    public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string subDirectory)
    {
        if (fileStream == null || fileStream.Length == 0)
            throw new ArgumentException("File is empty or null");

        string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", subDirectory);
        
        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        string uniqueFileName = Guid.NewGuid().ToString() + "_" + fileName;
        string filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var outputStream = new FileStream(filePath, FileMode.Create))
        {
            await fileStream.CopyToAsync(outputStream);
        }

        // Return relative path for URL access
        return $"/uploads/{subDirectory}/{uniqueFileName}";
    }
}
