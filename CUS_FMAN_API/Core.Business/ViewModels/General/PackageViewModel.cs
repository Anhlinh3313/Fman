using System;
using System.Collections.Generic;

namespace Core.Business.ViewModels
{
    public class PackageViewModel : SimpleViewModel
    {
        public PackageViewModel()
        {
        }

        public string Content { get; set; }
        public double Weight { get; set; }
        public double CalWeight { get; set; }
        public double Length { get; set; }
        public double Width { get; set; }
        public double Height { get; set; }
        public bool IsOpen { get; set; }
        public List<int> ShipmentIds { get; set; }
    }
}
