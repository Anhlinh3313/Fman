using Core.Entity.Abstract;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.SqlClient;
using System.Text;

namespace Core.Entity.Procedures
{
    public class Proc_FindShipmentParent : IEntityProcView
    {
        public const string ProcName = "Proc_FindShipmentParent";
        [Key]
        public int Id { get; set; }
        public int? ShipmentId { get; set; }
        public string ShipmentNumber { get; set; }
        public int? SenderId { get; set; }
        public string PickingAddress { get; set; }
        public string ShippingAddress { get; set; }
        public int ServiceId { get; set; }
        public bool IsBox { get; set; }
        public DateTime CreatedWhen { get; set; }
        public int GHour { get; set; }
        public int GMinute { get; set; }
        public DateTime MergeDate { get; set; }
        public static IEntityProc GetEntityProc(int senderId, string pickingAddress, string receiverName, string shippingAddress, int serviceId, DateTime? createdWhen = null)
        {
            SqlParameter sqlParameter1 = new SqlParameter("@SenderId", senderId);
            SqlParameter sqlParameter2 = new SqlParameter("@PickingAddress", pickingAddress);
            if (string.IsNullOrWhiteSpace(pickingAddress)) sqlParameter2.Value = DBNull.Value;
            SqlParameter paramReceiverName = new SqlParameter("@REceiverName", receiverName);
            if (string.IsNullOrWhiteSpace(receiverName)) paramReceiverName.Value = DBNull.Value;
            SqlParameter sqlParameter3 = new SqlParameter("@ShippingAddress", shippingAddress);
            if (string.IsNullOrWhiteSpace(shippingAddress)) sqlParameter3.Value = DBNull.Value;
            SqlParameter sqlParameter4 = new SqlParameter("@ServiceId", serviceId);
            SqlParameter sqlParameter5 = new SqlParameter("@CreatedWhen", createdWhen);
            if (!createdWhen.HasValue) sqlParameter5.Value = DBNull.Value;
            return new EntityProc(
                $"{ProcName} @SenderId,@PickingAddress,@ReceiverName,@ShippingAddress,@ServiceId,@CreatedWhen",
                new SqlParameter[] {
                    sqlParameter1,
                    sqlParameter2,
                    paramReceiverName,
                    sqlParameter3,
                    sqlParameter4,
                    sqlParameter5
                }
            );
        }
    }
}
