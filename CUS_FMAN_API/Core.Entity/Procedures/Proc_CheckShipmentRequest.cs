using Core.Entity.Abstract;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.SqlClient;
using System.Text;

namespace Core.Entity.Procedures
{
    public class Proc_CheckShipmentRequest : IEntityProcView
    {
        public const string ProcName = "Proc_CheckShipmentRequest";

        [Key]
        public int Id { get; set; }

        public Proc_CheckShipmentRequest() { }

        public static IEntityProc GetEntityProc(int? senderId = null, string pickingAddress = null, int? provinceId = null, int? districtId = null, int? wardId = null)
        {
            SqlParameter SenderId = new SqlParameter("@SenderId", senderId);
            if (!senderId.HasValue) SenderId.Value = DBNull.Value;

            SqlParameter PickingAddress = new SqlParameter("@PickingAddress", pickingAddress);
            if (string.IsNullOrWhiteSpace(pickingAddress))
                PickingAddress.Value = DBNull.Value;

            SqlParameter ProvinceId = new SqlParameter("@ProvinceId", provinceId);
            if (!provinceId.HasValue) ProvinceId.Value = DBNull.Value;

            SqlParameter DistrictId = new SqlParameter("@DistrictId", districtId);
            if (!districtId.HasValue) DistrictId.Value = DBNull.Value;

            SqlParameter WardId = new SqlParameter("@WardId", wardId);
            if (!wardId.HasValue) WardId.Value = DBNull.Value;
            //
            return new EntityProc(
                $"{ProcName} @SenderId, @PickingAddress, @ProvinceId, @DistrictId, @WardId",
                new SqlParameter[] {
                SenderId,
                PickingAddress,
                ProvinceId,
                DistrictId,
                WardId,
                }
            );
        }
    }
}
