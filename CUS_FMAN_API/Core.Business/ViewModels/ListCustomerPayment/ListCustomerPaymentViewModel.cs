using Core.Business.ViewModels.General;
using Core.Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Business.ViewModels
{
    public class ListCustomerPaymentViewModel : SimpleViewModel
    {
        public int? CustomerId { get; set; }
        public double? GrandTotal { get; set; }
        public int? TotalShipment { get; set; }
        public int? ListCustomerPaymentTypeId { get; set; }
        public int? AttachmentId { get; set; }
        public List<int> ShipmentIds { get; set; }
        public int? HubCreatedId { get; set; }
        public string Note { get; set; }
        public double AdjustPrice { get; set; }
        public bool Paid { get; set; }
        public bool Locked { get; set; }
        public string StatusName { get { return (this.Paid ? "Đã thanh toán" : (this.Locked ? "Đã khóa" : "Chưa khóa")); } }
        public virtual DateTime? CreatedWhen { get; set; }
        public HubViewModel HubCreated { get; set; }
        public CustomerViewModel Customer { get; set; }
        public UserInfoViewModel UserCreated { get; set; }
        public UserInfoViewModel UserModified { get; set; }
        public ListCustomerPaymentTypeInfoViewModel ListCustomerPaymentType { get; set; }
        public ListCustomerPaymentViewModel()
        {
        }
    }
}
