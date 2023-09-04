﻿using System;
using Core.Entity.Entities;

namespace Core.Business.ViewModels
{
    public class BoxInfoViewModel : SimpleViewModel
    {
        public BoxInfoViewModel()
        {
        }

        public string Content { get; set; }
        public double Weight { get; set; }
        public double CalWeight { get; set; }
        public double Length { get; set; }
        public double Width { get; set; }
        public double Height { get; set; }
        public int ShipmentId { get; set; }
        public int PackTypeId { get; set; }

        public ShipmentInfoViewModel Shipment { get; set; }
        public PackTypeViewModel PackType { get; set; }
    }
}
