using System;
using Core.Business.ViewModels.Validators;
using Core.Business.ViewModels.Validators.Properties;
using Core.Data.Abstract;
using Core.Entity.Entities;
using FluentValidation;

namespace Core.Business.ViewModels
{
    public class SignInViewModelValidator : BaseAbstractValidator<SignInViewModel, Customer>
    {
        public SignInViewModelValidator(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
            RuleFor(x => x.UserName).NotEmpty().WithMessage(ValidatorMessage.Account.UserNameNotEmpty);
            RuleFor(x => x.PassWord).NotEmpty().WithMessage(ValidatorMessage.Account.PassWordNotEmpty);
            RuleFor(x => x).SetValidator(new AccountValidator(_unitOfWork));
        }
    }
}
