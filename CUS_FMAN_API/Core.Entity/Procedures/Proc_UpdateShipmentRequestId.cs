using Core.Entity.Abstract;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.SqlClient;
using System.Text;


namespace Core.Entity.Procedures
{
    public class Proc_UpdateShipmentRequestId : IEntityProcView
    {
        public const string ProcName = "Proc_UpdateShipmentRequestId";

        [Key]
        public bool IsSuccess { get; set; }

        public Proc_UpdateShipmentRequestId()
        {
        }

        public static IEntityProc GetEntityProc(int shipmentId, int requestShipmentId)
        {
            return new EntityProc(
                $"{ProcName} @ShipmentId, @RequestShipmentId",
                new SqlParameter[] {
                    new SqlParameter("@ShipmentId", shipmentId),
                    new SqlParameter("@RequestShipmentId", requestShipmentId)
                }
            );
        }
    }
}
