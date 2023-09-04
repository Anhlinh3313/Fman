using Core.Entity.Abstract;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.SqlClient;
using System.Text;

namespace Core.Entity.Procedures
{
    public class Proc_FindingBiker : IEntityProcView
    {
        public const string ProcName = "Proc_FindingBiker";
        [Key]
        public int Id { get; set; }
        public string FireBaseToken { get; set; }
        public int AwaitTime { get; set; }

        public Proc_FindingBiker() { }
        public static IEntityProc GetEntityProc(double lat, double lng, int wardId, int radius/*số mét*/)
        {
            SqlParameter Lat = new SqlParameter("@Lat", lat);
            SqlParameter Lng = new SqlParameter("@Lng", lng);
            SqlParameter WardId = new SqlParameter("@WardId", wardId);
            SqlParameter Radius = new SqlParameter("@Radius", radius);

            return new EntityProc(
                $"{ProcName} @Lat,@Lng,@WardId,@Radius",
                new SqlParameter[] {
                    Lat,
                    Lng,
                    WardId,
                    Radius
                }
            );
        }
    }
}
