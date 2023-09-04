using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Entity.Abstract;

namespace Core.Data.Abstract
{
    public interface IEntityVPRepository<T> : IEntityBaseRepository<T> where T : class, new()
    {
        T ExecProcedureSingle(IEntityProc entityProc);
        T ExecProcedureSingle(string query, params object[] parameters);
        IEnumerable<T> ExecProcedure(IEntityProc entityProc);
		IEnumerable<T> ExecProcedure(string query, params object[] parameters);
        int ExecProcedureCMD(IEntityProc entityProc);
        Task<int> ExecProcedureCMDAsync(IEntityProc entityProc);
        int ExecProcedureCMD(string query, params object[] parameters);
    }
}
