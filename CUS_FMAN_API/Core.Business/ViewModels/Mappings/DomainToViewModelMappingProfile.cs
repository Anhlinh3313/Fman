using System;
using AutoMapper;
using Core.Business.ViewModels.General;
using Core.Business.ViewModels.UploadImages;
using Core.Entity.Entities;
using Core.Infrastructure.ViewModels;

namespace Core.Business.ViewModels.Mappings
{
    public class DomainToViewModelMappingProfile : Profile
    {
        public DomainToViewModelMappingProfile()
        {
            CreateMap<Customer, CustomerViewModel>().ReverseMap();
            CreateMap<Customer, CustomerInfoViewModel>().ReverseMap();
            CreateMap<Shipment, ShipmentInfoViewModel>().ReverseMap();
            CreateMap<Shipment, ShipmentTrackingViewModel>().ReverseMap();
            CreateMap<RequestShipment, ShipmentInfoViewModel>().ReverseMap();
            CreateMap<RequestShipment, RequestShipmentTrackingViewModel>().ReverseMap();
            CreateMap<User, UserInfoViewModel>().ReverseMap();
            CreateMap<Country, CountryViewModel>().ReverseMap();
            CreateMap<Department, DepartmentViewModel>().ReverseMap();
            CreateMap<Hub, HubInfoViewModel>().ReverseMap();
            CreateMap<Hub, HubViewModel>().ReverseMap();
            CreateMap<HubRouting, HubRoutingInfoViewModel>().ReverseMap();
            CreateMap<Province, ProvinceInfoViewModel>().ReverseMap();
            CreateMap<Province, ProvinceViewModel>().ReverseMap();
            CreateMap<District, DistrictViewModel>().ReverseMap();
            CreateMap<District, DistrictInfoViewModel>().ReverseMap();
            CreateMap<Ward, WardViewModel>().ReverseMap();
            CreateMap<Ward, WardInfoViewModel>().ReverseMap();
            CreateMap<Reason, ReasonViewModel>().ReverseMap();
            CreateMap<Area, AreaViewModel>().ReverseMap();
            CreateMap<Area, AreaInfoViewModel>().ReverseMap();
            CreateMap<AreaGroup, AreaGroupViewModel>().ReverseMap();
            CreateMap<AreaGroup, AreaGroupInfoViewModel>().ReverseMap();
            CreateMap<Weight, WeightViewModel>().ReverseMap();
            CreateMap<Weight, WeightInfoViewModel>().ReverseMap();
            CreateMap<PriceList, PriceListViewModel>().ReverseMap();
            CreateMap<PriceList, PriceListInfoViewModel>().ReverseMap();
            CreateMap<PriceService, PriceServiceInfoViewModel>().ReverseMap();
            CreateMap<ServiceDVGTPrice, ServiceDVGTPriceInfoViewModel>().ReverseMap();
            CreateMap<CustomerPriceList, CustomerPriceListInfoViewModel>().ReverseMap();
            CreateMap<Package, PackageViewModel>().ReverseMap();
            CreateMap<Size, SizeViewModel>().ReverseMap();
            CreateMap<PriceServiceDetail, PriceServiceDetailInfoViewModel>().ReverseMap();
            CreateMap<Package, PackageInfoViewModel>().ReverseMap();
            CreateMap<Box, BoxInfoViewModel>().ReverseMap();
            CreateMap<RequestShipment, RequestShipmentInfoViewModel>().ReverseMap();
            CreateMap<ListCustomerPayment, ListCustomerPaymentViewModel>().ReverseMap();
            CreateMap<ListCustomerPayment, ListCustomerPaymentInfoViewModel>().ReverseMap();
            CreateMap<ShipmentImageCus, ImagesViewModel>().ReverseMap();
            CreateMap<ShipmentImageCus, UploadImagesViewModel>().ReverseMap();
            CreateMap<Complain, ComplainInfoViewModel>().ReverseMap();
            CreateMap<ComplainHandle, ComplainHandleInfoView>().ReverseMap();
            CreateMap<Customer, CustomerViewModel>().ReverseMap();
        }
    }
}
