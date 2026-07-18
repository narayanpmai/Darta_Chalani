using FluentValidation;

namespace LGOMS.Application.Features.Darta.Commands;

public class CreateDartaCommandValidator : AbstractValidator<CreateDartaCommand>
{
    public CreateDartaCommandValidator()
    {
        RuleFor(v => v.SenderName)
            .MaximumLength(200)
            .NotEmpty().WithMessage("Sender Name is required.");

        RuleFor(v => v.Subject)
            .MaximumLength(500)
            .NotEmpty().WithMessage("Subject is required.");

        RuleFor(v => v.ReceivedLetterNumber)
            .NotEmpty().WithMessage("Dispatch Number is required.");

        RuleFor(v => v.Miti)
            .NotEmpty().WithMessage("Miti (Nepali Date) is required.");
    }
}
