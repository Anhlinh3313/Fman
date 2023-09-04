﻿using System;
using Core.Entity.Entities;

namespace Core.Business.ViewModels
{
    public class CustomerViewModel : EntitySimple
    {
        public CustomerViewModel()
        {
        }
        public string UserName { get; set; }
        public string PassWord { get; set; }
        public string NameEn { get; set; }
        public string Address { get; set; }
        public string BusinessLicenseNumber { get; set; }
        public string Email { get; set; }
        public string Fax { get; set; }
        public string LegalRepresentative { get; set; }
        public string Notes { get; set; }
        public string AddressNote { get; set; }
        public int? ParentCustomerId { get; set; }
        public string PhoneNumber { get; set; }
        public int? SalesOrganizationId { get; set; }
        public int? SalesUserId { get; set; }
        public int CustomerStatusId { get; set; }
        public int? StopServiceAlertDuration { get; set; }
        public int? SupportOrganizationId { get; set; }
        public int? SupportUserId { get; set; }
        public string TaxCode { get; set; }
        public string TradingName { get; set; }
        public int? CustomerTypeId { get; set; }
        public int? ProvinceId { get; set; }
        public int? DistrictId { get; set; }
        public int? WardId { get; set; }
        public string Website { get; set; }
        public int? WorkTimeId { get; set; }
        public double Lat { get; set; }
        public double Lng { get; set; }
        public string CompanyName { get; set; }
        public double VAT { get; set; }
        public string AccountBank { get; set; }
        public string Accountname { get; set; }
        public int? BranchId { get; set; }
        public bool IsAccept { get; set; }
        public int? PaymentScheduleID { get; set; }
        
    }
}
