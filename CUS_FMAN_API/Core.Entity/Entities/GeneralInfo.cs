using System;
using Core.Entity.Abstract;

namespace Core.Entity.Entities
{
    public class GeneralInfo : IEntityBase
    {
        public GeneralInfo()
        {
        }

        public int Id { get; set; }
        public string CompanyName { get; set; }
        public string LogoUrl { get; set; }
        public string HotLine { get; set; }
        public string AddressMain { get; set; }
        public string Website { get; set; }
        public string Fax { get; set; }
        public double DefaultWeight { get; set; }
        public string Policy { get; set; }
        public bool IsEnabled { get; set; }
        public string EmailReset { get; set; }
        public string PasswordReset { get; set; }
    }
}
