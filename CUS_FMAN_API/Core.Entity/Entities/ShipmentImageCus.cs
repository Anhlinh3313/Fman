using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Entity.Entities
{
    public class ShipmentImageCus : EntityBasic
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public int ShipmentId { get; set; }
        public string PathImage { get; set; }
    }
}
