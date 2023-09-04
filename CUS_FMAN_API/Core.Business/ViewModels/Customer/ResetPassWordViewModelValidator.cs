using System;
using Core.Business.ViewModels.Validators;
using Core.Business.ViewModels.Validators.Properties;
using Core.Data.Abstract;
using Core.Entity.Entities;
using FluentValidation;
using Microsoft.AspNetCore.Identity;

namespace Core.Business.ViewModels
{
    public class ResetPassWordViewModelValidator : BaseCRUDAbstractValidator<ResetPassWordViewModel, Customer>
    {
        public ResetPassWordViewModelValidator(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
            var av = new CustomerValidator(_unitOfWork);

            RuleFor(x => x.Id).Must(EntityExist).WithMessage(ValidatorMessage.Account.NotExist);

            When(x => EntityExist(x.Id), () =>
            {
                RuleFor(x => x.NewPassWord).NotEmpty().WithMessage(ValidatorMessage.Account.NewPassWordNotEmpty);
            });
        }
    }
}
