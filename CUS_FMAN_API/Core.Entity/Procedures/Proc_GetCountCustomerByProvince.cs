using Core.Entity.Abstract;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.SqlClient;
using System.Text;

namespace Core.Entity.Procedures
{
    public class Proc_GetCountCustomerByProvince : IEntityProcView
    {
        public const string ProcName = "Proc_GetCountCustomerByProvince";

        [Key]
        public int CountCus { get; set; }
        public static IEntityProc GetEntityProc(int? provinceId)
        {
            SqlParameter sqlParameter1 = new SqlParameter("@ProvinceId", provinceId);
            if (!provinceId.HasValue) sqlParameter1.Value = DBNull.Value;
            return new EntityProc(
                $"{ProcName} @ProvinceId",
                new SqlParameter[] {
                    sqlParameter1
                }
            );
        }
    }
}
