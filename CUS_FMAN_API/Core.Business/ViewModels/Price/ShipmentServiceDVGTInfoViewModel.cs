using Core.Entity.Abstract;
using Core.Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Business.ViewModels
{
    public class ShipmentServiceDVGTInfoViewModel : IEntityBase
    {
        public ShipmentServiceDVGTInfoViewModel() { }

        public int Id { get; set; }
        public bool IsEnabled { get; set; }
        public int ShipmentId { set; get; }
        public int ServiceDVGTId { get; set; }

        public ServiceDVGT ServiceDVGT { get; set; }
    }
}
