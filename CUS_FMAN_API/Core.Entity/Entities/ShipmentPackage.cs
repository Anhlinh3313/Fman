using System;
using Core.Entity.Abstract;

namespace Core.Entity.Entities
{
    public class ShipmentPackage : IEntityBase
    {
        public ShipmentPackage()
        {
        }

        public int Id { get; set; }
        public bool IsEnabled { get; set; }
        public int ShipmentId { get; set; }
        public int PackageId { get; set; }
    }
}
