using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using AutoMapper;
using Core.Business.Core.Extensions;
using Core.Business.ViewModels;
using Core.Business.ViewModels.Shipments;
using Core.Data;
using Core.Data.Core;
using Core.Entity.Abstract;
using Core.Entity.Entities;
using Core.Infrastructure.Extensions;
using Core.Infrastructure.Helper;
using Core.Infrastructure.Http;
using Core.Infrastructure.Security;
using Core.Infrastructure.Utils;
using Microsoft.EntityFrameworkCore;

namespace Core.Business.ViewModels.Mappings
{
    public class ViewModelToDomainMappingProfile : Profile
    {
        public ViewModelToDomainMappingProfile()
        {
            CreateMap<CreateUpdateShipmentViewModel, Shipment>().AfterMap((src, dest) =>
                {
                    if (src.Id > 0) SetGeneralColsUpdate(dest);
                    else
                    {
                        SetGeneralColsCreate(dest);
                        if (!src.ShipmentStatusId.HasValue)
                        {
                            if (dest.FromHub == dest.ToHub)
                            {
                                dest.ShipmentStatusId = StatusHelper.ShipmentStatusId.ReadyToDelivery;
                            }
                            else
                            {
                                dest.ShipmentStatusId = StatusHelper.ShipmentStatusId.WaitingToTransfer;
                            }
                        }
                    }
                }).ReverseMap();
            CreateMap<CreateUpdateRequestShipmentViewModel, RequestShipment>().AfterMap((src, dest) =>
                {
                    if (src.Id > 0) SetGeneralColsUpdate(dest);
                    else
                    {
                        dest.ShipmentStatusId = StatusHelper.ShipmentStatusId.NewRequest;
                        SetGeneralColsCreate(dest);
                    }

                    if (!dest.OrderDate.HasValue)
                    {
                        dest.OrderDate = DateTime.Now;
                    }
                }).ReverseMap();

            CreateMap<UpdateStatusViewModel, Shipment>()
                .ForMember(dest => dest.Note, opts => opts.Ignore())
                .AfterMap((src, dest) =>
                {
                    DateTime date = DateTime.Now;

                    if (StatusHelper.GetPickupListId().Contains(dest.ShipmentStatusId))
                    {
                        if (dest.ShipmentStatusId == (int)StatusHelper.ShipmentStatusId.PickupComplete ||
                           dest.ShipmentStatusId == (int)StatusHelper.ShipmentStatusId.PickupCancel ||
                           dest.ShipmentStatusId == (int)StatusHelper.ShipmentStatusId.PickupLostPackage)
                        {
                            dest.EndPickTime = date;
                        }

                        if (dest.ShipmentStatusId == (int)StatusHelper.ShipmentStatusId.PickupComplete &&
                            dest.PaymentTypeId == PaymentTypeHelper.NGUOI_GUI_THANH_TOAN)
                        {
                            dest.KeepingTotalPriceEmpId = GetCurrentUserId();
                        }
                    }
                    else if (StatusHelper.GetDeliveryListId().Contains(dest.ShipmentStatusId))
                    {
                        if (dest.ShipmentStatusId == (int)StatusHelper.ShipmentStatusId.DeliveryComplete ||
                            dest.ShipmentStatusId == (int)StatusHelper.ShipmentStatusId.DeliveryLostPackage)
                        {
                            dest.EndDeliveryTime = date;
                        }

                        if (dest.ShipmentStatusId == (int)StatusHelper.ShipmentStatusId.DeliveryComplete)
                        {
                            if (dest.PaymentTypeId == PaymentTypeHelper.NGUOI_NHAN_THANH_TOAN)
                            {
                                dest.KeepingTotalPriceEmpId = GetCurrentUserId();
                            }

                            dest.KeepingCODEmpId = GetCurrentUserId();
                        }

                        if (dest.ShipmentStatusId == (int)StatusHelper.ShipmentStatusId.DeliveryFail)
                        {
                            dest.NumDeliver += 1;
                        }

                        dest.DeliveryNote = !string.IsNullOrEmpty(dest.DeliveryNote) ? $"{dest.DeliveryNote}, {src.Note}" : src.Note;
                    }
                    else if (StatusHelper.GetReturnListId().Contains(dest.ShipmentStatusId))
                    {

                        if (dest.ShipmentStatusId == (int)StatusHelper.ShipmentStatusId.ReturnComplete ||
                            dest.ShipmentStatusId == (int)StatusHelper.ShipmentStatusId.ReturnLostPackage)
                        {
                            dest.EndReturnTime = date;
                        }
                        dest.ReturnNote = src.Note;
                    }

                    dest.Note = !string.IsNullOrEmpty(dest.Note) ? $"{dest.Note}, {src.Note}" : src.Note;
                    SetGeneralColsUpdate(dest);
                }).ReverseMap();
            CreateMap<UpdateStatusViewModel, RequestShipment>()
                .ForMember(dest => dest.Note, opts => opts.Ignore())
                .AfterMap((src, dest) =>
                {
                    if (StatusHelper.GetPickupListId().Contains(dest.ShipmentStatusId.Value))
                    {
                        if (dest.ShipmentStatusId == (int)StatusHelper.ShipmentStatusId.PickupFail)
                        {
                            dest.NumPick += 1;
                            dest.PickupAppointmentTime = src.appointmentTime.HasValue ? src.appointmentTime : dest.PickupAppointmentTime;
                        }

                        dest.PickupNote = !string.IsNullOrEmpty(dest.PickupNote) ? $"{dest.PickupNote}, {src.Note}" : src.Note;
                    }

                    dest.Note = !string.IsNullOrEmpty(dest.Note) ? $"{dest.Note}, {src.Note}" : src.Note;
                    SetGeneralColsUpdate(dest);
                }).ReverseMap();
            CreateMap<ChangePassWordViewModel, Customer>()
                .AfterMap((src, dest) =>
                {
                    SetGeneralColsUpdate(dest);
                    if (!Util.IsNull(src.NewPassWord))
                    {
                        dest.SecurityStamp = Guid.NewGuid().ToString();
                        dest.PasswordHash = new Encryption().EncryptPassword(src.NewPassWord, dest.SecurityStamp);
                    }
                }).ReverseMap();
            CreateMap<ResetPassWordViewModel, Customer>()
                .AfterMap((src, dest) =>
                {
                    SetGeneralColsUpdate(dest);
                    if (!Util.IsNull(src.NewPassWord))
                    {
                        dest.SecurityStamp = Guid.NewGuid().ToString();
                        dest.PasswordHash = new Encryption().EncryptPassword(src.NewPassWord, dest.SecurityStamp);
                    }
                }).ReverseMap();
            CreateMap<CustomerViewModel, Customer>()
                .BeforeMap((src, dest) =>
                {
                    if (src.Id == 0)
                    {
                        src.UserName = dest.UserName;
                    }
                })
               .AfterMap((src, dest) =>
               {
                   if (src.Id == 0)
                   {
                       dest.SecurityStamp = Guid.NewGuid().ToString();
                       dest.PasswordHash = new Encryption().EncryptPassword(src.PassWord, dest.SecurityStamp);
                   }
                   else if (src.Id == 0 && !string.IsNullOrWhiteSpace(src.PassWord))
                   {
                       dest.SecurityStamp = Guid.NewGuid().ToString();
                       dest.PasswordHash = new Encryption().EncryptPassword(src.PassWord, dest.SecurityStamp);
                   }
               });
            CreateMap<CreateUpdateLadingScheduleViewModel, LadingSchedule>().ReverseMap();
            CreateMap<CreateUpdateLadingScheduleViewModel, RequestLadingSchedule>().ReverseMap();
            CreateMap<ReasonViewModel, Reason>().ReverseMap();
            CreateMap<ShipmentStatusViewModel, ShipmentStatus>().ReverseMap();
            CreateMap<RequestShipment, Shipment>().ReverseMap();
            CreateMap<AreaGroupViewModel, AreaGroup>().ReverseMap();
            CreateMap<AreaViewModel, Area>().ReverseMap();
            CreateMap<FormulaViewModel, Formula>().ReverseMap();
            CreateMap<WeightViewModel, Weight>().ReverseMap();
            CreateMap<PriceListViewModel, PriceList>().ReverseMap();
            CreateMap<PriceServiceViewModel, PriceService>().ReverseMap();
            CreateMap<CustomerPriceListViewModel, CustomerPriceList>().ReverseMap();
            CreateMap<WeightGroupViewModel, WeightGroup>().ReverseMap();
            CreateMap<PriceServiceDetailViewModel, PriceServiceDetail>().ReverseMap();
            CreateMap<ServiceViewModel, Service>().ReverseMap();
            CreateMap<ServiceDVGTViewModel, ServiceDVGT>().ReverseMap();
            CreateMap<PackTypeViewModel, PackType>().ReverseMap();
            CreateMap<PaymentTypeViewModel, PaymentType>().ReverseMap();
            CreateMap<StructureViewModel, Structure>().ReverseMap();
            CreateMap<ServiceDVGTPriceViewModel, ServiceDVGTPrice>().ReverseMap();
            CreateMap<BoxViewModel, Box>().ReverseMap();
            CreateMap<LadingSchedule, LadingScheduleViewModel>().ReverseMap();
            CreateMap<RequestLadingSchedule, LadingScheduleViewModel>().ReverseMap();
            CreateMap<RequestLadingSchedule, LadingSchedule>().ReverseMap();
            CreateMap<PackageViewModel, Package>().ReverseMap();
            CreateMap<OpenPackageViewModel, Package>().ReverseMap();
            CreateMap<ListCustomerPaymentViewModel, ListCustomerPayment>().ReverseMap();
            //CreateMap<ListCustomerPaymentInfoViewModel, ListCustomerPayment>().ReverseMap();
            CreateMap<ComplainTypeViewModel, ComplainType>().ReverseMap();
            CreateMap<ComplainViewModel, Complain>().ReverseMap();
            CreateMap<CustomerInfoLogViewModel, CustomerInfoLog>().ReverseMap();
        }

        public void SetGeneralColsCreate(IEntityBasic data)
        {
            //var currentDate = DateTime.Now;
            //var currentUserId = HttpContext.CurrentUserId;

            //data.Id = 0;
            //data.ConcurrencyStamp = Guid.NewGuid().ToString();
            //data.CreatedWhen = currentDate;
            //data.CreatedBy = currentUserId;
            //data.ModifiedWhen = currentDate;
            //data.ModifiedBy = currentUserId;
        }

        public void SetGeneralColsUpdate(IEntityBasic data)
        {
            //data.ConcurrencyStamp = Guid.NewGuid().ToString();
            //data.ModifiedWhen = DateTime.Now;
            //data.ModifiedBy = HttpContext.CurrentUserId;
        }

        public IEnumerable<HubRoutingWard> GetHubFromWard(UnitOfWork unitOfWork, int fromWardId, int? toWardId)
        {
            return unitOfWork.RepositoryR<HubRoutingWard>()
                             .FindBy(x => x.WardId == fromWardId || x.WardId == toWardId)
                             .Include("HubRouting");
        }

        public int GetCurrentUserId()
        {
            System.Security.Claims.ClaimsPrincipal currentUser = HttpContext.Current.User;
            var nameIdentifier = currentUser.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier);
            return nameIdentifier.Value.ToSafeInt();
        }

        public Customer GetCurrentCustomer()
        {
            using (var context = new ApplicationContext())
            {
                UnitOfWork unitOfWork = new UnitOfWork(context);
                return unitOfWork.RepositoryR<Customer>().GetSingle(GetCurrentUserId());
            }
        }
    }
}
