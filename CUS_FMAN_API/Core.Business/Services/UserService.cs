using System;
using System.Collections.Generic;
using System.Linq;
using Core.Business.Services.Abstract;
using Core.Business.Services.Models;
using Core.Data.Abstract;
using Core.Entity.Entities;
using Core.Infrastructure.ViewModels;
using Microsoft.Extensions.Options;

namespace Core.Business.Services
{
    public class UserService : BaseService, IUserService
    {
        public UserService(Microsoft.Extensions.Logging.ILogger<dynamic> logger, IOptions<AppSettings> optionsAccessor, IUnitOfWork unitOfWork) : base(logger, optionsAccessor, unitOfWork)
        {
        }

        public List<int> GetListHubFromUser(User user)
        {
            var listHub = new List<int>();

            if (user.Hub.CenterHubId.HasValue && !user.Hub.PoHubId.HasValue)
            {
                listHub = _unitOfWork.RepositoryR<Hub>().FindBy(x => x.PoHubId == user.HubId).Select(x => x.Id).ToList();
            }
            else if (!user.Hub.CenterHubId.HasValue && !user.Hub.PoHubId.HasValue)
            {
                listHub = _unitOfWork.RepositoryR<Hub>().FindBy(x => x.CenterHubId == user.HubId).Select(x => x.Id).ToList();
            }

            //if (user.Hub.PoHubId.HasValue)
            //{

            //}
            //else 

            listHub.Add((int)user.HubId);

            return listHub;
        }

        public HubRouting GetHubRoutingBy(int wardId)
        {
            var hrw = _unitOfWork.RepositoryR<HubRoutingWard>().GetSingle(x => x.WardId == wardId);
            if (hrw != null)
            {
                var hr = _unitOfWork.RepositoryR<HubRouting>().GetSingle(x => x.Id == hrw.HubRoutingId, new[] { "User" });
                if (hr != null) return hr;
            }
            return null;
        }

        public HubRouting GetHubRoutingById(int id)
        {
            var hr = _unitOfWork.RepositoryR<HubRouting>().GetSingle(id, new[] { "User" });
            if (hr != null) return hr;
            return null;
        }
    }
}
