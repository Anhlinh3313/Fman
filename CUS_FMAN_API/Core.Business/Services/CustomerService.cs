using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;
using Core.Infrastructure.Helper;
using Core.Business.Services.Models;
using Core.Data.Abstract;
using Microsoft.Extensions.Options;
using Core.Infrastructure.Utils;
using Core.Entity.Entities;
using Core.Business.ViewModels;
using AutoMapper;
using Core.Business.Services.Abstract;
using System.Net.Mail;
using System.Text;

namespace Core.Business.Services
{
    public partial class CustomerService : BaseService, ICustomerService
    {
        private readonly JwtIssuerOptions _jwtOptions;
        private readonly IEncryptionService _iEncryptionService;

        public CustomerService(
            Microsoft.Extensions.Logging.ILogger<dynamic> logger,
            IOptions<AppSettings> optionsAccessor,
            IUnitOfWork unitOfWork,
            IOptions<JwtIssuerOptions> jwtOptions,
            IEncryptionService iEncryptionService) : base(logger, optionsAccessor, unitOfWork)
        {
            _jwtOptions = jwtOptions.Value;
            ThrowIfInvalidOptions(_jwtOptions);
            _iEncryptionService = iEncryptionService;
        }

        public async Task<dynamic> ChangePassWord(ChangePassWordViewModel model)
        {
            var customer = GetCustomer(model.Id);
            customer = Mapper.Map(model, customer);
            _unitOfWork.RepositoryCRUD<Customer>().Update(customer);
            await _unitOfWork.CommitAsync();
            return JsonUtil.Success(ConvertCustomerToUserInfoViewModel(customer));
        }

        public async Task<dynamic> ResetPassWord(ResetPassWordViewModel model)
        {
            var customer = GetCustomer(model.Id);
            customer = Mapper.Map(model, customer);
            if (Util.IsNull(customer.CodeResetPassWord) || !model.Code.Equals(customer.CodeResetPassWord))
            {
                return JsonUtil.Error("Đã có lỗi xảy ra");
            }
            customer.CodeResetPassWord = null;
            customer.ResetPassWordSentat = null;
            _unitOfWork.RepositoryCRUD<Customer>().Update(customer);
            await _unitOfWork.CommitAsync();
            return JsonUtil.Success(ConvertCustomerToUserInfoViewModel(customer));
        }

        public dynamic GetAccountInfo(int id)
        {
            var customer = GetCustomer(id);

            if (customer != null)
            {
                return JsonUtil.Success(ConvertCustomerToUserInfoViewModel(customer));
            }

            return JsonUtil.Error(ValidatorMessage.Account.NotExist);
        }

        public async Task<dynamic> SignIn(SignInViewModel model)
        {
            var user = _unitOfWork.RepositoryCRUD<Customer>().GetSingle(x => x.UserName == model.UserName || x.Email==model.UserName || x.PhoneNumber == model.UserName);
            if (user == null)
            {
                return JsonUtil.Error("Tài khoản đăng nhập không chính xác!");
            }
            if(user.IsAccept!= true)
            {
                return JsonUtil.Error("Thông tin khách hàng đang duyệt, lòng liên hệ CSKH để biết thêm chi tiết!");
            }
            var checkPass = _iEncryptionService.EncryptPassword(model.PassWord, user.SecurityStamp);
            if (user.PasswordHash != checkPass)
            {
                return JsonUtil.Error("Mật khẩu đăng nhập không chính xác!");
            }
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.CHash, _iEncryptionService.HashSHA256(user.SecurityStamp)),
                new Claim(JwtRegisteredClaimNames.Jti, await _jwtOptions.JtiGenerator()),
                new Claim(JwtRegisteredClaimNames.Iat, ToUnixEpochDate(_jwtOptions.IssuedAt).ToString(), ClaimValueTypes.Integer64),
            };

            // Create the JWT security token and encode it.
            var jwt = new JwtSecurityToken(
                issuer: _jwtOptions.Issuer,
                audience: _jwtOptions.Audience,
                claims: claims,
                notBefore: _jwtOptions.NotBefore,
                expires: _jwtOptions.Expiration,
                signingCredentials: _jwtOptions.SigningCredentials);

            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            // Serialize and return the response
            return JsonUtil.Success(new
            {
                userId = user.Id.ToString(),
                userName = user.UserName,
                userFullName = user.Name,
                token = encodedJwt,
                expires = (int)_jwtOptions.ValidFor.TotalSeconds,
                expiresDate = DateTime.Now.AddDays(_jwtOptions.ValidFor.Days)
            });
        }

        private Customer GetCustomer(int id)
        {
            return _unitOfWork.RepositoryR<Customer>().GetSingle(x => x.Id == id);
        }

        private CustomerInfoViewModel ConvertCustomerToUserInfoViewModel(Customer user)
        {
            return Mapper.Map<CustomerInfoViewModel>(user);
        }

        public object SendEmail(SendMail sendEmailOptions, EmailRecipient emailRecipient)
        {
            SmtpClient client = new SmtpClient();
            client.DeliveryMethod = SmtpDeliveryMethod.Network;
            client.EnableSsl = sendEmailOptions.EnableSsl;
            client.Host = sendEmailOptions.Host;
            var credentials = new System.Net.NetworkCredential(sendEmailOptions.MailFrom, sendEmailOptions.PassWordMailFrom);
            client.UseDefaultCredentials = false;
            client.Credentials = credentials;
            MailMessage mess = new MailMessage();
            mess.From = new MailAddress(sendEmailOptions.MailFrom, sendEmailOptions.MailFromDisplayName + " [Reset PassWord]");
            mess.To.Add(emailRecipient.Email);
            mess.Subject = "Đổi mật khẩu " + sendEmailOptions.Website;
            mess.IsBodyHtml = true;
            mess.BodyEncoding = UTF8Encoding.UTF8;
            var urlConfirmResetPassWord = sendEmailOptions.Website + "/xac-nhan-mat-khau.html?id=" + emailRecipient.Id + "&code=" + emailRecipient.CodeResetPassWord;
            //mess.Body = "Click vào link bên dưới để xác nhận đổi mật khẩu cho tài khoản " + "<br/>" + "Email: " + emailRecipient.Email + "<br/>" + "Tên: " + emailRecipient.Name + "<br/>" + urlConfirmResetPassWord;
            string content = System.IO.File.ReadAllText(sendEmailOptions.Path);
            content = content.Replace("{{Email}}", emailRecipient.Email);
            content = content.Replace("{{Name}}", emailRecipient.Name);
            content = content.Replace("{{Link}}", urlConfirmResetPassWord);
            mess.Body = content;
            try
            {
                client.Send(mess);
                return true;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
    }
}
