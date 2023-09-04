using System;
using Core.Business.ViewModels.General;
using Core.Entity.Abstract;

namespace Core.Entity.Entities
{
    public class UserInfoViewModel
    {
        public UserInfoViewModel()
        {
        }

        public virtual int Id { get; set; }
        public virtual string ConcurrencyStamp { get; set; }
        public virtual bool IsEnabled { get; set; } = true;
        public int? RoleId { get; set; }
        public int? DepartmentId { get; set; }
        public int? HubId { get; set; }
        public string UserName { get; set; }
        public string Code { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string AvatarBase64 { get; set; }
        public string FullName { get; set; }
        public string IdentityCard { get; set; }
        public string NormalizedEmail { get; set; }
        public string NormalizedUserName { get; set; }
        public bool IsGlobalAdministrator { get; set; }
        public bool IsHidden { get; set; }

        public DepartmentViewModel Department { get; set; }
        public HubViewModel Hub { get; set; }
        public Role Role { get; set; }
    }
}
