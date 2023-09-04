using System;
namespace Core.Entity.Entities
{
    public class Customer : EntitySimple
    {
        public Customer()
        {
        }

        public string NameEn { get; set; }
        public string Address { get; set; }
        public string AddressNote { get; set; }
        public string BusinessLicenseNumber { get; set; }
        public string Email { get; set; }
        public string Fax { get; set; }
        public string LegalRepresentative { get; set; }
        public string Notes { get; set; }
        public int? ParentCustomerId { get; set; }
        public string PhoneNumber { get; set; }
        public int? SalesOrganizationId { get; set; }
        public int? SalesUserId { get; set; }
        public int? CustomerStatusId { get; set; }
        public int? StopServiceAlertDuration { get; set; }
        public int? SupportOrganizationId { get; set; }
        public int? SupportUserId { get; set; }
        public string TaxCode { get; set; }
        public string TradingName { get; set; }
        public int? CustomerTypeId { get; set; }
        public int? ProvinceId { get; set; }
        public int? DistrictId { get; set; }
        public int? WardId { get; set; }
        public int? HubId { get; set; }
        public string Website { get; set; }
        public int? WorkTimeId { get; set; }
        public double Lat { get; set; }
        public double Lng { get; set; }
        public string UserName { get; set; }
        public string PasswordHash { get; set; }
        public string PasswordHashLevelTwo { get; set; }
        public string FireBaseToken { get; set; }
        public string SecurityStamp { get; set; }
        public bool PhoneNumberConfirmed { get; set; }
        public string AvatarPath { get; set; }
        public double VAT { get; set; }
        public int? PaymentTypeId { get; set; }
        public string CodeResetPassWord { get; set; }
        public DateTime? ResetPassWordSentat { get; set; }
        public string AccountBank { get; set; }
        public string Accountname { get; set; }
        public int? BranchId { get; set; }
        public bool IsAccept { get; set; }
        public int? PaymentScheduleID { get; set; }

        public virtual Branch Branch { get; set;}
}
}
