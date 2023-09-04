using Core.Entity.Abstract;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.SqlClient;
using System.Text;

namespace Core.Entity.Procedures
{
    public class Proc_UpdateShipmentStatus : IEntityProcView
    {
        public const string ProcName = "Proc_UpdateShipmentStatus";

        [Key]
        public int IsSuccess { get; set; }

        public static IEntityProc GetEntityProc(string shipmentIds, int statusId, int userId, int hubId)
        {
            SqlParameter ShipmentIds = new SqlParameter("@ShipmentIds", shipmentIds);
            SqlParameter UserId = new SqlParameter("@UserId", userId);
            SqlParameter StatusId = new SqlParameter("@UserId", statusId);
            SqlParameter HubId = new SqlParameter("@HubId", hubId);

            return new EntityProc(
                $"{ProcName} @ShipmentIds,@StatusId,@UserId,@HubId",
                new SqlParameter[] {
                    ShipmentIds,
                    StatusId,
                    UserId,
                    HubId
                }
            );
        }
    }
}

