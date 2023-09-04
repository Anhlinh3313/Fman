using Core.Infrastructure.ViewModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Business.Services.Abstract
{
    public interface IListCustomerPaymentService
    {
        ResponseViewModel GetByType(int customerId, int type, DateTime? fromDate = null, DateTime? toDate = null, int? pageSize = null, int? pageNumber = null, string cols = null);
        ResponseViewModel GetAllList(int customerId, DateTime? fromDate = null, DateTime? toDate = null, int? pageSize = null, int? pageNumber = null, string cols = null);
    }
}
