using Core.Entity.Abstract;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.SqlClient;
using System.Text;
namespace Core.Entity.Procedures
{
    public class Proc_CustomerDashboardDetail : IEntityProcView
    {
        public const string ProcName = "Proc_CustomerDashboardDetail";


        [Key]
        public int Id { get; set; }
        public string ShipmentNumber { get; set; }
        public string ReShipmentNumber { get; set; }
        public string ShopCode { get; set; }
        public DateTime? OrderDate { get; set; }
        public string SenderName { get; set; }
        public string AddressNoteFrom { get; set; }
        public string PickingAddress { get; set; }
        public string ReceiverCode2 { get; set; }
        public string ReceiverName { get; set; }
        public string ReceiverPhone { get; set; }
        public string AddressNoteTo { get; set; }
        public string ShippingAddress { get; set; }
        public double? COD { get; set; }
        public double? Insured { get; set; }
        public double? Weight { get; set; }
        public double? CalWeight { get; set; }
        public double? CusWeight { get; set; }
        public string ServiceName { get; set; }
        public int TotalBox { get; set; }
        public int TotalItem { get; set; }
        public string StructureName { get; set; }
        public double? DefaultPrice { get; set; }
        public double? RemoteAreasPrice { get; set; }
        public double? PriceReturn { get; set; }
        public double? TotalDVGT { get; set; }
        public double? TotalPrice { get; set; }
        public double? TotalPriceSYS { get; set; }
        public string PaymentTypeName { get; set; }
        public double? PriceCOD { get; set; }
        public string Content { get; set; }
        public string CusNote { get; set; }
        public string Note { get; set; }
        public bool? IsReturn { get; set; }
        public string ShipmentStatusName { get; set; }
        public string RealRecipientName { get; set; }
        public DateTime? EndDeliveryTime { get; set; }
        public string DeliveryNote { get; set; }
        public bool? ISPrioritize { get; set; }
        public bool? IsIncidents { get; set; }
        public int? SenderId { get; set; }
        public string ReasonName { get; set; }
        public double VATPrice { get; set; }
        public double FuelPrice { get; set; }
        public DateTime? EndReturnTime { get; set; }
        public DateTime? EndPickTime { get; set; }
        public double? Distance { get; set; }
        public int? TotalCount { get; set; }
        public int? TotalBoxs { get; set; }
        public int? ShipmentStatusId { get; set; }
        public string ToProvinceName { get; set; }
        public string ToDistrictName { get; set; }
        public string ToWardName { get; set; }
        public string FromProvinceName { get; set; }
        public string FromDistrictName { get; set; }
        public string FromWardName { get; set; }

        public Proc_CustomerDashboardDetail()
        {
        }

        public static IEntityProc GetEntityProc(
            DateTime? fromDate = null,
            DateTime? toDate = null,
            int? senderId = null,
            int? fromProvinceId = null,
            int? toProvinceId = null,
            int? serviceId = null,
            string shipmentNumber = null,
            string shopCode = null,
            string referencesCode = null,
            string reShipmentNumber = null,
            string searchText = null,
            int? shipmentStatusId = null,
            int? groupStatusId = null,
            int? pageNumber = null,
            int? pageSize = null,
            bool? isSuccess = null
        )
        {

            SqlParameter DateFrom = new SqlParameter("@DateFrom", fromDate);
            if (!fromDate.HasValue)
                DateFrom.Value = DBNull.Value;

            SqlParameter DateTo = new SqlParameter("@DateTo", toDate);
            if (!toDate.HasValue)
                DateTo.Value = DBNull.Value;

            SqlParameter SenderId = new SqlParameter("@SenderId", senderId);
            if (!senderId.HasValue)
                SenderId.Value = DBNull.Value;

            SqlParameter FromProvinceId = new SqlParameter("@FromProvinceId", fromProvinceId);
            if (!fromProvinceId.HasValue)
                FromProvinceId.Value = DBNull.Value;

            SqlParameter ToProvinceId = new SqlParameter("@ToProvinceId", toProvinceId);
            if (!toProvinceId.HasValue)
                ToProvinceId.Value = DBNull.Value;

            SqlParameter ServiceId = new SqlParameter("@ServiceId", serviceId);
            if (!serviceId.HasValue)
                ServiceId.Value = DBNull.Value;

            if (!string.IsNullOrWhiteSpace(shipmentNumber))
            {
                shipmentNumber = shipmentNumber.Replace("/r/n", " ");
                shipmentNumber = shipmentNumber.Trim().Replace(" ", ",");
            }
            SqlParameter ShipmentNumber = new SqlParameter("@ShipmentNumber", shipmentNumber);
            if (string.IsNullOrWhiteSpace(shipmentNumber)) ShipmentNumber.Value = DBNull.Value;


            SqlParameter ShopCode = new SqlParameter("@ShopCode", shopCode);
            if (string.IsNullOrWhiteSpace(shopCode))
                ShopCode.Value = DBNull.Value;

            SqlParameter ReferencesCode = new SqlParameter("@ReferencesCode", referencesCode);
            if (string.IsNullOrWhiteSpace(referencesCode))
                ReferencesCode.Value = DBNull.Value;

            SqlParameter ReShipmentNumber = new SqlParameter("@ReShipmentNumber", reShipmentNumber);
            if (string.IsNullOrWhiteSpace(reShipmentNumber))
                ReShipmentNumber.Value = DBNull.Value;

            SqlParameter SearchText = new SqlParameter("@SearchText", searchText);
            if (string.IsNullOrWhiteSpace(searchText))
                SearchText.Value = DBNull.Value;

            SqlParameter ShipmentStatusId = new SqlParameter("@ShipmentStatusId", shipmentStatusId);
            if (!shipmentStatusId.HasValue)
                ShipmentStatusId.Value = DBNull.Value;

            SqlParameter GroupStatusId = new SqlParameter("@GroupStatusId", groupStatusId);
            if (!groupStatusId.HasValue)
                GroupStatusId.Value = DBNull.Value;

            SqlParameter PageNumber = new SqlParameter("@PageNumber", pageNumber);
            if (!pageNumber.HasValue)
                PageNumber.Value = DBNull.Value;

            SqlParameter PageSize = new SqlParameter("@PageSize", pageSize);
            if (!pageSize.HasValue)
                PageSize.Value = DBNull.Value;

            SqlParameter IsSuccess = new SqlParameter("@IsSuccess", isSuccess);
            if (!isSuccess.HasValue)
                IsSuccess.Value = DBNull.Value;

            return new EntityProc(
                $"{ProcName} @DateFrom, @DateTo, @SenderId, @FromProvinceId, " +
                $"@ToProvinceId, @ServiceId, " +
                $"@ShipmentNumber, @ShopCode, @ReferencesCode, @ReShipmentNumber, @SearchText, " +
                $"@ShipmentStatusId, @GroupStatusId, " +
                $"@PageNumber, @PageSize, " +
                $"@IsSuccess ",
                new SqlParameter[] {
                DateFrom, DateTo, SenderId, FromProvinceId,
                ToProvinceId, ServiceId,
                ShipmentNumber, ShopCode, ReferencesCode, ReShipmentNumber, SearchText,
                ShipmentStatusId, GroupStatusId,
                PageNumber, PageSize, IsSuccess
                }
            );
        }
    }
}
