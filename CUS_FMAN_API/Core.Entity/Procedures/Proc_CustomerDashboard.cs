using System;
using System.ComponentModel.DataAnnotations;
using System.Data.SqlClient;
using Core.Entity.Abstract;

namespace Core.Entity.Procedures
{
    public class Proc_CustomerDashboard : IEntityProcView
    {
        public const string ProcName = "Proc_CustomerDashboard";


        [Key]
        public int OrderNum { get; set; }
        public string StatusCode { get; set; }
        public string NameEng { get; set; }
        public string NameVN { get; set; }
        public int TotalCount { get; set; }
        public double? TotalCharges { get; set; }
        public double? TotalFreight { get; set; }
        public double? TotalCOD { get; set; }


        public Proc_CustomerDashboard()
        {
        }

        public static IEntityProc GetEntityProc(DateTime? dateFrom, DateTime? dateTo, int? senderId)
        {
            SqlParameter DateFrom = new SqlParameter("@DateFrom", dateFrom);
            if (!dateFrom.HasValue) DateFrom.Value = DBNull.Value;
            SqlParameter DateTo = new SqlParameter("@DateTo", dateTo);
            if (!dateTo.HasValue) DateTo.Value = DBNull.Value;
            SqlParameter SenderId = new SqlParameter("@SenderId", senderId);
            if (!senderId.HasValue || senderId == 0) SenderId.Value = DBNull.Value;
            return new EntityProc(
                $"{ProcName} @DateFrom, @DateTo, @SenderId",
                new SqlParameter[] {
                    DateFrom, DateTo, SenderId
                }
            );
        }
    }
}
