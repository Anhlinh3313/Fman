using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Core.Data.Core.Utils;
using Core.Entity.Abstract;
using Core.Entity.Entities;

namespace Core.Business.ViewModels.Shipments
{
    public class CreateUpdateShipmentViewModel : IEntityBase, IValidatableObject
    {
        public CreateUpdateShipmentViewModel()
        {
        }
        public CreateUpdateShipmentViewModel Copy()
        {
            return (CreateUpdateShipmentViewModel)this.MemberwiseClone();
        }
        public double? PriceCOD { get; set; }
        public bool IsPickupWH { get; set; }
        public string SenderEmail { get; set; }
        public double Distance { get; set; }
        public int? ToHubRoutingId { get; set; }
        public int? FromHubRoutingId { get; set; }
        public bool IsTruckDelivery { get; set; }

        public string ReceiverCodeLog { get; set; }
        public double DefaultPriceS { get; set; }
        public double DefaultPriceP { get; set; }
        public bool IsBox { get; set; }
        public string ShipmentNumberRef { get; set; }
        public string ShopCodeRef { get; set; }
        public int? ShipmentId { get; set; }
        public int? PaymentCODTypeId { get; set; }
        public int Id { get; set; }
        public bool IsEnabled { get; set; }
        public string ConcurrencyStamp { get; set; }
        public string ShipmentNumber { get; set; }
        public string ShopCode { get; set; }
        public bool IsPushCustomer { get; set; }
        public DateTime OrderDate { get; set; }
        //public int? SellerId { get; set; }
        //public string SellerName { get; set; }
        //public string SellerPhone { get; set; }
        public int? SenderId { get; set; }
        public string SenderName { get; set; }
        public string SenderPhone { get; set; }
        public string PickingAddress { get; set; }
        public int? FromWardId { get; set; }
        public int? ReceiverId { get; set; }
        public string ReceiverName { get; set; }
        public string ReceiverPhone { get; set; }
        public string ShippingAddress { get; set; }
        public int? ToWardId { get; set; }
        public int ServiceId { get; set; }
        public int PaymentTypeId { get; set; }
        public string CusNote { get; set; }
        public string Content { get; set; }
        public string Note { get; set; }
        public double Weight { get; set; }
        public double CusWeight { get; set; }
        public double Length { get; set; }
        public double Height { get; set; }
        public double Width { get; set; }
        public double CalWeight { get; set; }
        public double? LatFrom { get; set; }
        public double? LngFrom { get; set; }
        public double? LatTo { get; set; }
        public double? LngTo { get; set; }
        public int? CurrentEmpId { get; set; }
        public int? CurrentHubId { get; set; }
        public int? RequestShipmentId { get; set; }
        public double COD { get; set; }
        public double Insured { get; set; }
        public bool IsAgreementPrice { get; set; }
        public double DefaultPrice { get; set; }
        public double RemoteAreasPrice { get; set; }
        public double FuelPrice { get; set; }
        public double TotalDVGT { get; set; }
        public double OtherPrice { get; set; }
        public double VATPrice { get; set; }
        public double TotalPrice { get; set; }
        public double? TotalPriceSYS { get; set; }
        //public int? PriceListId { get; set; }
        public int? FromDistrictId { get; set; }
        public int? FromProvinceId { get; set; }
        public int? ToDistrictId { get; set; }
        public int? ToProvinceId { get; set; }
        public string CompanyFrom { get; set; }
        public string CompanyTo { get; set; }
        public string AddressNoteFrom { get; set; }
        public string AddressNoteTo { get; set; }
        public int TotalBox { get; set; }
        public int? StructureId { get; set; }
        //public DateTime? FirstPickupTime { get; set; }
        //public DateTime? FirstDeliveredTime { get; set; }
        //public DateTime? FirstReturnTime { get; set; }
        //public DateTime? FirstTransferTime { get; set; }
        //public DateTime? FirstReturnTransferTime { get; set; }
        public bool IsPaidPrice { get; set; }
        public int? FromHubId { get; set; }
        public int? ToHubId { get; set; }
        public int? ShipmentStatusId { get; set; }
        public int? PickUserId { get; set; }
        public DateTime? DeliveryDate { get; set; }
        //public DateTime? ExpectedDeliveryTime { get; set; }
        //public DateTime? ExpectedDeliveryTimeSystem { get; set; }
        public List<int> serviceDVGTIds { get; set; }
        public PriceDVGTViewModel[] PriceDVGTs { get; set; }
        public List<BoxViewModel> Boxes { get; set; }
        //
        public string ToProvinceName { get; set; }
        public string ToDistrictName { get; set; }
        public string ToWardName { get; set; }
        //

        public string FromProvinceName { get; set; }
        public string FromDistrictName { get; set; }
        public string FromWardName { get; set; }
        public int? TotalItem { get; set; }
        public bool? IsAuto { get; set; }
        public int? CusDepartmentId { get; set; }

        //Lading Schedule
        public double CurrentLat { get; set; }
        public double CurrentLng { get; set; }
        public string Location { get; set; }
        //public CreateUpdateRequestShipmentViewModel RequestShipment { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            var validator = new CreateUpdateShipmentViewModelValidator(EntityUtil.GetUnitOfWork(validationContext));
            var result = validator.Validate(this);
            return result.Errors.Select(item => new ValidationResult(item.ErrorMessage, new[] { item.PropertyName }));
        }
    }
}
