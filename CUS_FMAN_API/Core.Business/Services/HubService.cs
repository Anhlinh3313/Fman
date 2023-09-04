using System;
using Core.Business.Services.Abstract;
using Core.Business.Services.Models;
using Core.Data.Abstract;
using Core.Entity.Entities;
using Core.Infrastructure.Utils;
using Microsoft.Extensions.Options;

namespace Core.Business.Services
{
    public class HubService : GeneralService, IHubService
    {
        private IUnitOfWork _unitOfWork;

        public HubService(Microsoft.Extensions.Logging.ILogger<dynamic> logger, IOptions<AppSettings> optionsAccessor, IUnitOfWork unitOfWork) : base(logger, optionsAccessor, unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public User GetByHubWardId(int wardId)
        {
            var hrw = _unitOfWork.RepositoryR<HubRoutingWard>().GetSingle(x => x.WardId == wardId);

            if (!Util.IsNull(hrw))
            {
                var hr = _unitOfWork.RepositoryR<HubRouting>().GetSingle(x => x.Id == hrw.HubRoutingId);

                if (hr != null && hr.UserId.HasValue)
                {
                    return _unitOfWork.RepositoryR<User>().GetSingle(hr.UserId.Value);
                }
            }

            return null;
        }
    }
}
