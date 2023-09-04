using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Business.ViewModels.PushShipmentToBiker
{
    public class PushShipmentToBikerViewModel
    {
        public double Lat { get; set; }
        public double Lng { get; set; }
        public int WardId { get; set; }
        public string TempCode { get; set; }
        public int SenderId { get; set; }
        public decimal TotalPrice { get; set; }
        public string SenderName { get; set; }
        public string SenderPhone { get; set; }
        public string PickingAddress { get; set; }
        public string ReceiverName { get; set; }
        public string ReceiverPhone { get; set; }
        public string ReceiverAddress { get; set; }
    }
}
