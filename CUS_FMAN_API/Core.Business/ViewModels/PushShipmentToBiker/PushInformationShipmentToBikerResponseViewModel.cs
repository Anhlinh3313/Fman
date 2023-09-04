using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Business.ViewModels.PushShipmentToBiker
{
    public class PushInformationShipmentToBikerResponseViewModel
    {
        public string TempCode { get; set; }
        public string SenderName { get; set; }
        public string SenderPhone { get; set; }
        public string PickingAddress { get; set; }
        public string ReceiverName { get; set; }
        public string ReceiverPhone { get; set; }
        public string ReceiverAddress { get; set; }
        public int SenderId { get; set; }
        public decimal TotalPrice { get; set; }
        public int? WaitTime { get; set; }
        public int? ShipmentStatusId { get; set; }
        public int? LogId { get; set; }
    }
}
