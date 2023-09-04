using Core.Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Business.ViewModels.Shipments
{
    public class SummaryDataShipmentViewModel
    {
        public string Name { get; set; }
        public double? Total { get; set; }
        public double? TotalCOD { get; set; }
        public int Count { get; set; }
        public double? TotalFreight { get; set; } // Tổng cước
        public double? TotalCharges { get; set; } // Tổng phí
    }
}
