using FluentValidation;

namespace LGOMS.Application.Features.Chalani.Commands;

public class CreateChalaniCommandValidator : AbstractValidator<CreateChalaniCommand>
{
    public CreateChalaniCommandValidator()
    {
        RuleFor(v => v.ReceiverName)
            .MaximumLength(200)
            .NotEmpty().WithMessage("Receiver Name is required.");

        RuleFor(v => v.Subject)
            .MaximumLength(500)
            .NotEmpty().WithMessage("Subject is required.");

        RuleFor(v => v.OriginatingDepartment)
            .NotEmpty().WithMessage("Originating Branch/Department is required.");

        RuleFor(v => v.Miti)
            .NotEmpty().WithMessage("Miti (Nepali Date) is required.");
    }
}
