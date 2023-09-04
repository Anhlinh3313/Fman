using System;
namespace Core.Business.ViewModels.General
{
    public class HubRoutingInfoViewModel : SimpleViewModel
    {
        public HubRoutingInfoViewModel()
        {
        }

        public int HubId { get; set; }
        public virtual HubInfoViewModel Hub { get; set; }
    }
}
