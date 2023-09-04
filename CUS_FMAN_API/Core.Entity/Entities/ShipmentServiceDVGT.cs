using Core.Entity.Abstract;
using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Entity.Entities
{
    public class ShipmentServiceDVGT : IEntityBase
    {
        public ShipmentServiceDVGT() { }

        public int Id { get; set; }
        public bool IsEnabled { get; set; }
        public int ShipmentId { set; get; }
        public int? ServiceId { get; set; }
        public double Price { get; set; }
        public bool IsAgree { get; set; }

        [ForeignKey("ServiceId")]
        public Service Service { get; set; }
    }
}
