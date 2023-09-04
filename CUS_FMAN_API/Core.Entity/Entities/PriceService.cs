using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Entity.Entities
{
    public class PriceService : EntitySimple
    {
        public PriceService() { }

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

        public Service Service { set; get; }
        public WeightGroup WeightGroup { get; set; }
        public AreaGroup AreaGroup { get; set; }
        public PriceList PriceList { get; set; }
    }
}
