using FluentValidation;

namespace LGOMS.Application.Features.Chalani.Commands;

public class CreateChalaniCommandValidator : AbstractValidator<CreateChalaniCommand>
{
    public CreateChalaniCommandValidator()
    {
        RuleFor(v => v.ReceiverName)
            .MaximumLength(200)
            .NotEmpty().WithMessage("पाउनेको नाम (Receiver Name) आवश्यक छ।");

        RuleFor(v => v.Subject)
            .MaximumLength(500)
            .NotEmpty().WithMessage("विषय (Subject) आवश्यक छ।");

        RuleFor(v => v.Miti)
            .NotEmpty().WithMessage("मिति (Miti) आवश्यक छ।");
    }
}
