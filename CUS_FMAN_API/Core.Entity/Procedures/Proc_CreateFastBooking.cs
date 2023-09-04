using Core.Entity.Abstract;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.SqlClient;
using System.Text;

namespace Core.Entity.Procedures
{
    public class Proc_CreateFastBooking : IEntityProcView
    {
        public const string ProcName = "Proc_CreateFastBooking";
        [Key]
        public Boolean IsSuccess { get; set; }
        public string Message { get; set; }
        public string ShipmentNumber { get; set; }

        public Proc_CreateFastBooking() { }
        public static IEntityProc GetEntityProc(int shipmentId, string prefix = null)
        {
            SqlParameter ShipmentId = new SqlParameter("@ShipmentId", shipmentId);
            SqlParameter Prefix = new SqlParameter("@Prefix", prefix);
            if (string.IsNullOrWhiteSpace(prefix)) Prefix.Value = DBNull.Value;

            return new EntityProc(
                $"{ProcName} @ShipmentId,@Prefix",
                new SqlParameter[] {
                    ShipmentId,
                    Prefix
                }
            );
        }
    }
}
