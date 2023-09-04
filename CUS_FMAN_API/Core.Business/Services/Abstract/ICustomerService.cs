using System;
using System.Threading.Tasks;
using Core.Business.Services.Models;
using Core.Business.ViewModels;
using Core.Entity.Entities;
using Core.Infrastructure.ViewModels;

namespace Core.Business.Services.Abstract
{
    public interface ICustomerService
    {
        Task<dynamic> ChangePassWord(ChangePassWordViewModel model);
        Task<dynamic> ResetPassWord(ResetPassWordViewModel model);
        dynamic GetAccountInfo(int id);
        Task<dynamic> SignIn(SignInViewModel model);
        object SendEmail(SendMail sendEmailOptions, EmailRecipient emailRecipient);
    }
}
