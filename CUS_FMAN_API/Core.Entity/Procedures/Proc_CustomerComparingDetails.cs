using System;
using System.ComponentModel.DataAnnotations;
using System.Data.SqlClient;
using Core.Entity.Abstract;

namespace Core.Entity.Procedures
{
    public class Proc_CustomerComparingDetails : IEntityProcView
    {
        public const string ProcName = "Proc_CustomerComparingDetails";


        [Key]
        public int Id { get; set; }
        public string ListCustomerPaymentCode { get; set; }
        public int? ListCustomerPaymentId { get; set; }
        public DateTime? CreatedWhen { get; set; }
        public string ShipmentNumber { get; set; }
        public int? ShipmentStatusId { get; set; }
        public string ShipmentStatusName { get; set; }
        public string PickingAddress { get; set; }
        public string SenderName { get; set; }
        public string SenderPhone { get; set; }
        public string AddressNoteFrom { get; set; }
        public string ReceiverName { get; set; }
        public string ReceiverPhone { get; set; }
        public string ShippingAddress { get; set; }
        public string AddressNoteTo { get; set; }
        public double? TotalPrice { get; set; }
        public double? COD { get; set; }
        public int? CustomerId { get; set; }
        public string CustomerName { get; set; }

        public Int64? RowNum { get; set; }
        public int? TotalCount { get; set; }


        public Proc_CustomerComparingDetails()
        {
        }

        public static IEntityProc GetEntityProc(int? pageNumber, int? pageSize, DateTime? dateFrom, DateTime? dateTo, int? listCustomerPaymentId, int? senderId)
        {
            SqlParameter PageNumber = new SqlParameter("@PageNumber", pageNumber);
            if (!pageNumber.HasValue) PageNumber.Value = DBNull.Value;

            SqlParameter PageSize = new SqlParameter("@PageSize", pageSize);
            if (!pageSize.HasValue) PageSize.Value = DBNull.Value;

            SqlParameter DateFrom = new SqlParameter("@DateFrom", dateFrom);
            if (!dateFrom.HasValue) DateFrom.Value = DBNull.Value;

            SqlParameter DateTo = new SqlParameter("@DateTo", dateTo);
            if (!dateTo.HasValue) DateTo.Value = DBNull.Value;

            SqlParameter SenderId = new SqlParameter("@SenderId", senderId);
            if (!senderId.HasValue || senderId == 0) SenderId.Value = DBNull.Value;

            SqlParameter ListCustomerPaymentId = new SqlParameter("@ListCustomerPaymentId", listCustomerPaymentId);
            if (!listCustomerPaymentId.HasValue || listCustomerPaymentId == 0) ListCustomerPaymentId.Value = DBNull.Value;

            return new EntityProc(
                $"{ProcName} @PageNumber, @PageSize, @DateFrom, @DateTo, @ListCustomerPaymentId, @SenderId",
                new SqlParameter[] {
                    PageNumber, PageSize, DateFrom, DateTo, ListCustomerPaymentId, SenderId
                }
            );
        }
    }
}
