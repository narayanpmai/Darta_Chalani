using FluentValidation;

namespace LGOMS.Application.Features.Darta.Commands;

public class CreateDartaCommandValidator : AbstractValidator<CreateDartaCommand>
{
    public CreateDartaCommandValidator()
    {
        RuleFor(v => v.SenderName)
            .MaximumLength(200)
            .NotEmpty().WithMessage("पठाउनेको नाम (Sender Name) आवश्यक छ।");

        RuleFor(v => v.Subject)
            .MaximumLength(500)
            .NotEmpty().WithMessage("विषय (Subject) आवश्यक छ।");

        RuleFor(v => v.ReceivedLetterNumber)
            .NotEmpty().WithMessage("पत्रको चलानी नम्बर (Dispatch Number) आवश्यक छ।");

        RuleFor(v => v.Miti)
            .NotEmpty().WithMessage("मिति (Miti) आवश्यक छ।");
    }
}
