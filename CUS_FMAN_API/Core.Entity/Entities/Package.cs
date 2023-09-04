using System;
namespace Core.Entity.Entities
{
    public class Package : EntitySimple
    {
        public Package()
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
    }
}
