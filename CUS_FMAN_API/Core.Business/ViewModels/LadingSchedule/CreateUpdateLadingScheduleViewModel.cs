using System;
using Core.Entity.Abstract;

namespace Core.Business.ViewModels
{
    public class CreateUpdateLadingScheduleViewModel : IEntityBase
    {
        public CreateUpdateLadingScheduleViewModel()
        {
        }

        public CreateUpdateLadingScheduleViewModel(int shipmentId, int? hubId, int? userId, int? shipmentStatusId, double lat, double lng, string location, string note, int id, int? reasonId = null)
        {
            ShipmentId = shipmentId;
            HubId = hubId;
            UserId = userId;
            ShipmentStatusId = shipmentStatusId;
            Lat = lat;
            Lng = lng;
            Location = location;
            Note = note;
            Id = id;
            ReasonId = reasonId;
        }

        public int ShipmentId { get; set; }
        public int? HubId { get; set; }
        public int? UserId { get; set; }
        public int? ShipmentStatusId { get; set; }
        public double Lat { get; set; } = 0;
        public double Lng { get; set; } = 0;
        public string Location { get; set; }
        public string Note { get; set; }
        public int Id { get; set; }
        public bool IsEnabled { get; set; }
        public int? ReasonId { get; set; }
    }
}
