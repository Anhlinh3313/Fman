using Core.Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Business.ViewModels
{
    public class PriceServiceDetailInfoViewModel : SimpleViewModel
    {
        public PriceServiceDetailInfoViewModel() { }

        public int PriceServiceId { set; get; }
        public int WeightId { get; set; }
        public int AreaId { get; set; }
        public double Price { get; set; }

        public PriceService PriceService { set; get; }
        public Weight Weight { get; set; }
        public Area Area { get; set; }
    }
}
