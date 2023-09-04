using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Business.ViewModels.Shipments;
using Core.Entity.Entities;
using Core.Entity.Procedures;
using Core.Infrastructure.ViewModels;

namespace Core.Business.Services.Abstract
{
    public interface IShipmentService
    {
        ResponseViewModel GetByType(User user, string type, int? pageSize = null, int? pageNumber = null, string cols = null);
        ResponseViewModel GetLadingHistory(User user, string type, DateTime fromDate, DateTime toDate);
        String GetCodeByType(int type, string prefixCode, int shipmentId, int countIdentity, int? fromProvinceId);
        string GetBoxCode(int shipmentId, string shipmentIdRef);
        Task<Shipment> CreateShipment(CreateUpdateShipmentViewModel viewModel, int currentUserId);
        Task<Shipment> ReCalculatePrice(int shipmentId);
        Proc_GetInfoHubRouting GetInfoRouting(bool? isTruckDelivery, int? districtId, int? wardId, double? weight);
        Proc_UpdateShipmentStatus UpdateShipmentStatus(string shipmentIds, int statusId, int userId, int hubId);
    }
}
