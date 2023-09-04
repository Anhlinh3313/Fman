using Core.Business.Services.Abstract;
using Core.Business.Services.Models;
using Core.Business.ViewModels;
using Core.Data.Abstract;
using Core.Entity.Entities;
using Core.Infrastructure.ViewModels;
using LinqKit;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace Core.Business.Services
{
    public class ListCustomerPaymentService : GeneralService<ListCustomerPaymentViewModel, ListCustomerPaymentInfoViewModel, ListCustomerPayment>, IListCustomerPaymentService
    {
        public ListCustomerPaymentService
            (
            Microsoft.Extensions.Logging.ILogger<dynamic> logger, 
            IOptions<AppSettings> optionsAccessor, 
            IUnitOfWork unitOfWork
            ) : base(logger, optionsAccessor, unitOfWork)
        {

        }

        ResponseViewModel IListCustomerPaymentService.GetByType(int customerId,int type, DateTime? fromDate, DateTime? toDate, int? pageSize, int? pageNumber, string cols)
        {
            try
            {
                Expression<Func<ListCustomerPayment, bool>> predicate = x => x.CreatedWhen.HasValue && x.CustomerId== customerId && x.ListCustomerPaymentTypeId == type && x.IsEnabled == true;
                if (fromDate.HasValue)
                {
                    predicate = predicate.And(x => fromDate.Value.Date <= x.CreatedWhen.Value.Date);
                }
                if (toDate.HasValue)
                {
                    predicate = predicate.And(x => toDate.Value.Date >= x.CreatedWhen.Value.Date);
                }
                return FindBy(predicate, pageSize, pageNumber, cols);
            }
            catch (Exception ex)
            {
                return ResponseViewModel.CreateError(ex.Message);
            }
        }
        ResponseViewModel IListCustomerPaymentService.GetAllList(int customerId, DateTime? fromDate, DateTime? toDate, int? pageSize, int? pageNumber, string cols)
        {
            try
            {
                Expression<Func<ListCustomerPayment, bool>> predicate = x => x.CreatedWhen.HasValue && x.CustomerId== customerId && x.IsEnabled == true;
                if (fromDate.HasValue)
                {
                    predicate = predicate.And(x => fromDate.Value.Date <= x.CreatedWhen.Value.Date);
                }
                if (toDate.HasValue)
                {
                    predicate = predicate.And(x => toDate.Value.Date >= x.CreatedWhen.Value.Date);
                }
                return FindBy(predicate, pageSize, pageNumber, cols);
            }
            catch (Exception ex)
            {
                return ResponseViewModel.CreateError(ex.Message);
            }
        }
    }
}
