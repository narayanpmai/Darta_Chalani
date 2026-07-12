using MediatR;
using LGOMS.Domain.Entities;
using LGOMS.Application.Interfaces;

namespace LGOMS.Application.Features.Sifaris.Commands;

public class CreateSifarisCommand : IRequest<Guid>
{
    public string SifarisNumber { get; set; } = string.Empty;
    public string SifarisType { get; set; } = string.Empty;
    public string ApplicantName { get; set; } = string.Empty;
    public string ApplicantCitizenshipNumber { get; set; } = string.Empty;
    public string ApplicantAddress { get; set; } = string.Empty;
    public string Remarks { get; set; } = string.Empty;
    public string? AttachmentUrl { get; set; }
}

public class CreateSifarisCommandHandler : IRequestHandler<CreateSifarisCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateSifarisCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateSifarisCommand request, CancellationToken cancellationToken)
    {
        var entity = new LGOMS.Domain.Entities.Sifaris
        {
            SifarisNumber = request.SifarisNumber,
            SifarisType = request.SifarisType,
            ApplicantName = request.ApplicantName,
            ApplicantCitizenshipNumber = request.ApplicantCitizenshipNumber,
            ApplicantAddress = request.ApplicantAddress,
            Remarks = request.Remarks,
            Status = "Pending",
            AttachmentUrl = request.AttachmentUrl
        };

        _context.Sifaris.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
