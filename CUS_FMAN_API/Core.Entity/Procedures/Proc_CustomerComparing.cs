using System;
using System.ComponentModel.DataAnnotations;
using System.Data.SqlClient;
using Core.Entity.Abstract;

namespace Core.Entity.Procedures
{
    public class Proc_CustomerComparing : IEntityProcView
    {
        public const string ProcName = "Proc_CustomerComparing";


        [Key]
        public int Id { get; set; }
        public string Code { get; set; }
        public DateTime? CreatedWhen { get; set; }
        public bool? Paid { get; set; }
        public bool? Locked { get; set; }
        public string Note { get; set; }
        public int? HubCreatedId { get; set; }
        public string HubCreatedName { get; set; }
        public int? ListCustomerPaymentTypeId { get; set; }
        public string ListCustomerPaymentTypeName { get; set; }
        public int? CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string StatusName { get; set; }

        public double? TotalCOD { get; set; }
        public double? TotalPrice { get; set; }
        public double? GrandTotal { get; set; }
        public double? TotalCompar { get; set; }
        public int? TotalShipment { get; set; }
        public Int64? RowNum { get; set; }
        public int? TotalCount { get; set; }


        public Proc_CustomerComparing()
        {
        }

        public static IEntityProc GetEntityProc(int? pageNumber, int? pageSize, DateTime? dateFrom, DateTime? dateTo, int? senderId)
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

            return new EntityProc(
                $"{ProcName} @PageNumber, @PageSize, @DateFrom, @DateTo, @SenderId",
                new SqlParameter[] {
                    PageNumber, PageSize, DateFrom, DateTo, SenderId
                }
            );
        }
    }
}
