using System;
using Core.Data.Abstract;
using Core.Entity.Entities;
using Core.Infrastructure.Extensions;
using Core.Infrastructure.Security;
using Core.Infrastructure.Utils;
using FluentValidation.Validators;

namespace Core.Business.ViewModels.Validators.Properties
{
    public class CustomerValidator : BaseValidator<Customer>
    {
        public CustomerValidator(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        protected override bool IsValid(PropertyValidatorContext context)
        {
            bool result = true;

            if (context.PropertyValue is SignInViewModel)
            {
                result = SignInViewModelProcess(context);
            }

            return result;
        }

        private bool SignInViewModelProcess(PropertyValidatorContext context)
        {
            var encryption = new Encryption();
            var model = context.PropertyValue as SignInViewModel;

            var user = _unitOfWork.RepositoryCRUD<Customer>().GetSingle(
                x => x.UserName.Equals(model.UserName) &&
                x.PasswordHash.Equals(encryption.EncryptPassword(model.PassWord, x.SecurityStamp))
            );

            if (user == null)
            {
                return SetErrorMessage(context, ValidatorMessage.Account.InvalidUserNamePassWord);
            }
            else if (!user.IsEnabled)
            {
                return SetErrorMessage(context, ValidatorMessage.Account.AccountHasBeenBlock);
            }

            return base.IsValid(context);
        }

        public bool IdentityCard(string value)
        {
            return value.Length <= 12 ? true : false;
        }

        public bool UniqueName(string userName)
        {
            return !_unitOfWork.RepositoryR<Customer>().Any(x => x.UserName==(userName));
        }

        public bool UniqueCode(string code)
        {
            return !_unitOfWork.RepositoryR<Customer>().Any(x => x.Code==(code));
        }

        public bool PassWordValid(ChangePassWordViewModel model)
        {
            return _unitOfWork.RepositoryCRUD<Customer>().Any(
                x => x.Id == model.Id &&
                x.PasswordHash.Equals(new Encryption().EncryptPassword(model.CurrentPassWord, x.SecurityStamp))
            );
        }

        public bool UserEnabled(int id)
        {
            return _unitOfWork.RepositoryR<Customer>().Any(x => x.Id.Equals(id) && x.IsEnabled);
        }

        public bool UserEnabled(string userName)
        {
            return _unitOfWork.RepositoryR<Customer>().Any(x => x.UserName.Equals(userName) && x.IsEnabled);
        }

        public bool SecurityStampValid(int userId, string securityStampHash)
        {
            return _unitOfWork.RepositoryR<Customer>().Any(x => new Encryption().HashSHA256(x.SecurityStamp).Equals(securityStampHash));
        }
    }
}
