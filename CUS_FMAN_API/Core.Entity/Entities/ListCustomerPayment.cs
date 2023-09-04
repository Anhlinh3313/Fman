using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Core.Entity.Entities
{
    public class ListCustomerPayment : EntitySimple
    {
        public int? CustomerId { get; set; }
        public int? TotalShipment { get; set; }
        public double? GrandTotal { get; set; }
        public int? AttachmentId { get; set; }
        public int? ListCustomerPaymentTypeId { get; set; }
        public bool Paid { get; set; }
        public bool Locked { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public string Note { get; set; }
        public double AdjustPrice { get; set; }
        public int? HubCreatedId { get; set; }
        public string StatusName { get { return (this.Paid ? "Đã thanh toán" : (this.Locked ? "Đã khóa" : "Chưa khóa")); } }
        [ForeignKey("CreatedBy")]
        public virtual User UserCreated { get; set; }
        [ForeignKey("ModifiedBy")]
        public virtual User UserModified { get; set; }
        [ForeignKey("ListCustomerPaymentTypeId")]
        public virtual ListCustomerPaymentType ListCustomerPaymentType { get; set; }
        [ForeignKey("HubCreatedId")]
        public virtual Hub HubCreated { get; set; }
        //[ForeignKey("CustomerId")]
        //public virtual Customer Customer { get; set; }
        public ListCustomerPayment()
        {
        }

    }
}