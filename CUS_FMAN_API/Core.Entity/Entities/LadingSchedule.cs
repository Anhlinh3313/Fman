using System;
namespace Core.Entity.Entities
{
    public class LadingSchedule : EntityBasic
    {
        public LadingSchedule()
        {
        }

        public LadingSchedule(int shipmentId, int? hubId, int userId, int shipmentStatusId, double lat, double lng, string location, string note, int? reasonId)
        {
            ShipmentId = shipmentId;
            HubId = hubId;
            UserId = userId;
            ShipmentStatusId = shipmentStatusId;
            Lat = lat;
            Lng = lng;
            Location = location;
            Note = note;
            ReasonId = reasonId;
        }

        public int ShipmentId { get; set; }
        public int? HubId { get; set; }
        public int? UserId { get; set; }
        public int ShipmentStatusId { get; set; }
        public double Lat { get; set; } = 0;
        public double Lng { get; set; } = 0;
        public string Location { get; set; }
        public string Note { get; set; }
        public int? ReasonId { get; set; }

        public Shipment Shipment { get; set; }
        public Hub Hub { get; set; }
        public User User { get; set; }
        public ShipmentStatus ShipmentStatus { get; set; }
    }
}
