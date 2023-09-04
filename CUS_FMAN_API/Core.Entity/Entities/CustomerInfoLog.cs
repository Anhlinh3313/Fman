using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Entity.Entities
{
    public class CustomerInfoLog : EntityBasic
    {
        public CustomerInfoLog()
        {
        }

        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string CompanyName { get; set; }
        public string Address { get; set; }
        public string AddressNote { get; set; }
        public int? ProvinceId { get; set; }
        public int? DistrictId { get; set; }
        public int? WardId { get; set; }

        public double? Lat { get; set; }
        public double? Lng { get; set; }
        public int? SenderId { get; set; }
    }
}
