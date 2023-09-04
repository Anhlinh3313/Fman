using System;
using System.Collections.Generic;
using Core.Entity.Entities;

namespace Core.Business.Services.Abstract
{
    public interface IUserService
    {
        List<int> GetListHubFromUser(User user);

        HubRouting GetHubRoutingBy(int wardId);
        HubRouting GetHubRoutingById(int id);
    }
}
