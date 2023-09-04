using Core.Entity.Abstract;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.SqlClient;
using System.Text;

namespace Core.Entity.Procedures
{
    public class Proc_GetGroupListShipments : IEntityProcView
    {
        public const string ProcName = "Proc_GetGroupListShipments";
        [Key]
        public int GroupId { get; set; }
        public string GroupName { get; set; }
        public int TotalShipment { get; set; }

        public static IEntityProc GetEntityProc(DateTime? orderDateFrom , DateTime? orderDateTo)
        {
            SqlParameter OrderDateFrom = new SqlParameter("@OrderDateFrom", orderDateFrom);
            if (!orderDateFrom.HasValue) OrderDateFrom.Value = DBNull.Value;

            SqlParameter OrderDateTo = new SqlParameter("@OrderDateTo", orderDateTo);
            if (!orderDateTo.HasValue) OrderDateTo.Value = DBNull.Value;

            return new EntityProc(
                $"{ProcName} @OrderDateFrom,@OrderDateTo",
                new SqlParameter[] {
                    OrderDateFrom,OrderDateTo
                }
            );
        }
    }
}
