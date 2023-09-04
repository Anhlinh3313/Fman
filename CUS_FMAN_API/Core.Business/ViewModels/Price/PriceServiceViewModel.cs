using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Business.ViewModels
{
    public class PriceServiceViewModel : SimpleViewModel
    {
        public PriceServiceViewModel() { }

        public int ServiceId { set; get; }
        public int WeightGroupId { get; set; }
        public int AreaGroupId { get; set; }
        public int PriceListId { get; set; }
        public bool IsAuto { get; set; }
        public double VATPercent { get; set; }
        public double FuelPercent { get; set; }
        public double DIM { get; set; }
        public double RemoteAreasPricePercent { get; set; }
        public DateTime? PublicDateFrom { set; get; }
        public DateTime? PublicDateTo { set; get; }
    }
}
