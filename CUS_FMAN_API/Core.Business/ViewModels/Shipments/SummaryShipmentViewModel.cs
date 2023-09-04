using Core.Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Business.ViewModels.Shipments
{
    public class SummaryShipmentViewModel
    {
        public string Name { get; set; }
        public IEnumerable<Shipment> Shipment { get; set; }
    }
}
