using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Entity.Entities
{
    public class PriceServiceDetail : EntitySimple
    {
        public PriceServiceDetail() { }

        public int PriceServiceId { set; get; }
        public int WeightId { get; set; }
        public int AreaId { get; set; }
        public double Price { get; set; }

        public PriceService PriceService { set; get; }
        public Weight Weight { get; set; }
        public Area Area { get; set; }
    }
}
