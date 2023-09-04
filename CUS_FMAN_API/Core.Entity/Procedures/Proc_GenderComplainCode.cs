using Core.Entity.Abstract;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.SqlClient;
using System.Text;

namespace Core.Entity.Procedures
{
    public class Proc_GenderComplainCode : IEntityProcView
    {
        public const string ProcName = "Proc_GenderComplainCode";
        [Key]
        public string Code { get; set; }
        public static IEntityProc GetEntityProc(int id)
        {
            SqlParameter sqlParameter1 = new SqlParameter("@Id", id);
            return new EntityProc(
                $"{ProcName} @Id",
                new SqlParameter[] {
                    sqlParameter1
                }
            );
        }
    }
}
