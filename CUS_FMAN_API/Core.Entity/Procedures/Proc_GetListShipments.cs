using Core.Entity.Abstract;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.SqlClient;
using System.Text;

namespace Core.Entity.Procedures
{
    public class Proc_GetListShipments : IEntityProcView
    {
        public const string ProcName = "Proc_GetListShipments";
        [Key]
        public int Id { get; set; }
        public string ShipmentNumber { get; set; }
        public string SenderName { get; set; }
        public string PickingAddress { get; set; }
        public string ReceiverName { get; set; }
        public string ReceiverPhone { get; set; }
        public string ShippingAddress { get; set; }
        public string ServiceName { get; set; }
        public int TotalCount { get; set; }

        public static IEntityProc GetEntityProc(DateTime? orderDateFrom , DateTime? orderDateTo,int? groupId,int? pageNumber,int? pageSize)
        {
            SqlParameter OrderDateFrom = new SqlParameter("@OrderDateFrom", orderDateFrom);
            if (!orderDateFrom.HasValue) OrderDateFrom.Value = DBNull.Value;

            SqlParameter OrderDateTo = new SqlParameter("@OrderDateTo", orderDateTo);
            if (!orderDateTo.HasValue) OrderDateTo.Value = DBNull.Value;

            SqlParameter PageNumber = new SqlParameter("@PageNumber", pageNumber);
            if (!pageNumber.HasValue) PageNumber.Value = DBNull.Value;

            SqlParameter PageSize = new SqlParameter("@PageSize", pageSize);
            if (!pageSize.HasValue) PageSize.Value = DBNull.Value;

            SqlParameter GroupId = new SqlParameter("@GroupStatusId", groupId);

            return new EntityProc(
                $"{ProcName} @OrderDateFrom,@OrderDateTo,@GroupStatusId,@PageNumber,@PageSize",
                new SqlParameter[] {
                    OrderDateFrom,OrderDateTo,GroupId,PageNumber,PageSize
                }
            );
        }
    }
}
