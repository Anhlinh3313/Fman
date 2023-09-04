using System;
using Core.Business.ViewModels.General;
using Core.Entity.Entities;

namespace Core.Business.ViewModels
{
    public class PackageInfoViewModel : SimpleViewModel
    {
        public PackageInfoViewModel()
        {
        }

        public string Content { get; set; }
        public double Weight { get; set; }
        public double CalWeight { get; set; }
        public double Length { get; set; }
        public double Width { get; set; }
        public double Height { get; set; }
        public bool IsOpen { get; set; }
        public int? CreatedHubId { get; set; }
        public int? OpenPackageHubId { get; set; }

        public HubViewModel CreatedHub { get; set; }
        public HubViewModel OpenPackageHub { get; set; }
    }
}
