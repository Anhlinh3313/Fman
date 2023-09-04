using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Core.Business.Core.Utils;
using Core.Business.Services.Abstract;
using Core.Business.Services.Models;
using Core.Business.ViewModels;
using Core.Business.ViewModels.Shipments;
using Core.Data;
using Core.Data.Abstract;
using Core.Data.Core;
using Core.Entity.Entities;
using Core.Entity.Procedures;
using Core.Infrastructure.Helper;
using Core.Infrastructure.Helper.ExceptionHelper;
using Core.Infrastructure.Utils;
using Core.Infrastructure.ViewModels;
using LinqKit;
using Microsoft.Extensions.Options;

namespace Core.Business.Services
{
    public class ShipmentService : GeneralService<CreateUpdateShipmentViewModel, ShipmentInfoViewModel, Shipment>, IShipmentService
    {
        private readonly IUserService _iuserService;
        private readonly IGeneralService _iGeneralServiceRaw;
        private readonly IGeneralService<CreateUpdateLadingScheduleViewModel, LadingSchedule> _iLadingScheduleService;
        private readonly CompanyInformation _icompanyInformation;

        public ShipmentService(
            Microsoft.Extensions.Logging.ILogger<dynamic> logger,
            IOptions<AppSettings> optionsAccessor,
            IUnitOfWork unitOfWork,
            IUserService iuserService,
            IOptions<CompanyInformation> companyInformation,
            IGeneralService<CreateUpdateLadingScheduleViewModel, LadingSchedule> iLadingScheduleService,
            IGeneralService iGeneralServiceRaw) : base(logger, optionsAccessor, unitOfWork)
        {
            _iuserService = iuserService;
            _iGeneralServiceRaw = iGeneralServiceRaw;
            _iLadingScheduleService = iLadingScheduleService;
            _icompanyInformation = companyInformation.Value;
        }

        public ResponseViewModel GetByType(User user, string type, int? pageSize = null, int? pageNumber = null, string cols = null)
        {
            try
            {
                var listHub = _iuserService.GetListHubFromUser(user);
                Expression<Func<Shipment, bool>> predicate = x => x.Id > 0;

                switch (type.ToLower())
                {
                    case ShipmentTypeHelper.Delivery:
                        {
                            int[] statusIds = { StatusHelper.ShipmentStatusId.ReadyToDelivery, StatusHelper.ShipmentStatusId.StoreInWarehouseDelivery, StatusHelper.ShipmentStatusId.AssignEmployeeDelivery };
                            predicate = predicate.And(x => listHub.Contains(x.ToHubId.Value));
                            predicate = predicate.And(x => statusIds.Contains(x.ShipmentStatusId));
                            break;
                        }
                    case ShipmentTypeHelper.UpdateDelivery:
                        {
                            int[] statusIds = { (int)StatusHelper.ShipmentStatusId.Delivering, StatusHelper.ShipmentStatusId.DeliveryFail };
                            predicate = predicate.And(x => listHub.Contains(x.ToHubId.Value));
                            predicate = predicate.And(x => statusIds.Contains(x.ShipmentStatusId));
                            break;
                        }
                    case ShipmentTypeHelper.Transfer:
                        {
                            int[] statusIds = { (int)StatusHelper.ShipmentStatusId.WaitingToTransfer, StatusHelper.ShipmentStatusId.StoreInWarehouseTransfer, StatusHelper.ShipmentStatusId.StoreInWarehouseReturnTransfer };
                            predicate = predicate.And(x => listHub.Contains((int)x.CurrentHubId));
                            predicate = predicate.And(x => statusIds.Contains(x.ShipmentStatusId));
                            break;
                        }
                    case ShipmentTypeHelper.Transferring:
                        {
                            int[] statusIds = { StatusHelper.ShipmentStatusId.Transferring, StatusHelper.ShipmentStatusId.AssignEmployeeTransfer, StatusHelper.ShipmentStatusId.TransferReturning, StatusHelper.ShipmentStatusId.AssignEmployeeTransferReturn };
                            predicate = predicate.And(x => listHub.Contains((int)x.CurrentHubId));
                            predicate = predicate.And(x => statusIds.Contains(x.ShipmentStatusId));
                            break;
                        }
                    case ShipmentTypeHelper.UpdateTransfer:
                        {
                            int[] statusIds = { (int)StatusHelper.ShipmentStatusId.Transferring, StatusHelper.ShipmentStatusId.TransferReturning };
                            predicate = predicate.And(x => listHub.Contains((int)x.ReceiveHubId));
                            predicate = predicate.And(x => statusIds.Contains(x.ShipmentStatusId));
                            break;
                        }
                    case ShipmentTypeHelper.ReShipTransfer:
                        {
                            int[] statusIds = { (int)StatusHelper.ShipmentStatusId.ReShip, StatusHelper.ShipmentStatusId.ReturnReShip };
                            predicate = predicate.And(x => listHub.Contains((int)x.ReceiveHubId));
                            predicate = predicate.And(x => statusIds.Contains(x.ShipmentStatusId));
                            break;
                        }
                    case ShipmentTypeHelper.Return:
                        {
                            int[] statusIds = { StatusHelper.ShipmentStatusId.StoreInWarehouseReturn, StatusHelper.ShipmentStatusId.AssignEmployeeReturn };
                            predicate = predicate.And(x => listHub.Contains(x.ToHubId.Value));
                            predicate = predicate.And(x => statusIds.Contains(x.ShipmentStatusId));
                            break;
                        }
                    case ShipmentTypeHelper.UpdateReturn:
                        {
                            int[] statusIds = { (int)StatusHelper.ShipmentStatusId.Returning, StatusHelper.ShipmentStatusId.ReturnFail };
                            predicate = predicate.And(x => listHub.Contains(x.ToHubId.Value));
                            predicate = predicate.And(x => statusIds.Contains(x.ShipmentStatusId));
                            break;
                        }
                    case ShipmentTypeHelper.PackPackage:
                        {
                            int[] statusIds =
                            {
                                StatusHelper.ShipmentStatusId.StoreInWarehousePickup,
                                StatusHelper.ShipmentStatusId.StoreInWarehouseReturn,
                                StatusHelper.ShipmentStatusId.StoreInWarehouseDelivery,
                                StatusHelper.ShipmentStatusId.StoreInWarehouseTransfer,
                                StatusHelper.ShipmentStatusId.StoreInWarehouseReturnTransfer,
                                StatusHelper.ShipmentStatusId.WaitingToTransfer,
                                StatusHelper.ShipmentStatusId.ReadyToDelivery,
                            };
                            predicate = predicate.And(x => listHub.Contains(x.ToHubId.Value) && !x.PackageId.HasValue);
                            predicate = predicate.And(x => statusIds.Contains(x.ShipmentStatusId));
                            break;
                        }
                    case ShipmentTypeHelper.OpenPackage:
                        {
                            int[] statusIds =
                            {
                                StatusHelper.ShipmentStatusId.StoreInWarehousePickup,
                                StatusHelper.ShipmentStatusId.StoreInWarehouseReturn,
                                StatusHelper.ShipmentStatusId.StoreInWarehouseDelivery,
                                StatusHelper.ShipmentStatusId.StoreInWarehouseTransfer,
                                StatusHelper.ShipmentStatusId.StoreInWarehouseReturnTransfer,
                                StatusHelper.ShipmentStatusId.WaitingToTransfer,
                                StatusHelper.ShipmentStatusId.ReadyToDelivery,
                            };
                            predicate = predicate.And(x => listHub.Contains(x.ToHubId.Value) && x.PackageId.HasValue);
                            predicate = predicate.And(x => statusIds.Contains(x.ShipmentStatusId));
                            break;
                        }
                    case ShipmentTypeHelper.HubConfirmMoneyFromRider:
                        {
                            int[] statusIds =
                            {
                                StatusHelper.ShipmentStatusId.DeliveryComplete,
                            };
                            predicate = predicate.And(x => listHub.Contains(x.ToHubId.Value) && x.DeliverUserId.HasValue &&
                                                      (x.COD > 0 || (x.PaymentTypeId == PaymentTypeHelper.NGUOI_NHAN_THANH_TOAN && x.TotalPrice > 0))
                                                     );
                            predicate = predicate.And(x => statusIds.Contains(x.ShipmentStatusId));
                            break;
                        }
                    case ShipmentTypeHelper.AccountantConfirmMoneyFromHub:
                        {
                            int[] statusIds =
                            {
                                StatusHelper.ShipmentStatusId.HubReceivedCOD,
                            };
                            predicate = predicate.And(x => listHub.Contains(x.KeepingTotalPriceHubId.Value));
                            predicate = predicate.And(x => statusIds.Contains(x.ShipmentStatusId));
                            break;
                        }
                    case ShipmentTypeHelper.TreasurerConfirmMoneyFromAccountant:
                        {
                            int[] statusIds =
                            {
                                StatusHelper.ShipmentStatusId.AccountantReceivedCOD,
                            };
                            predicate = predicate.And(x => x.KeepingTotalPriceHubId.HasValue && listHub.Contains(x.KeepingTotalPriceHubId.Value) ||
                                                      x.KeepingCODHubId.HasValue && listHub.Contains(x.KeepingCODHubId.Value)
                                                     );
                            predicate = predicate.And(x => statusIds.Contains(x.ShipmentStatusId));
                            break;
                        }
                    case ShipmentTypeHelper.ParentHubConfirmMoneyFromHub:
                        {
                            int[] statusIds =
                            {
                                StatusHelper.ShipmentStatusId.HubReceivedCOD,
                                StatusHelper.ShipmentStatusId.AccountantReceivedCOD,
                                StatusHelper.ShipmentStatusId.TreasurertReceivedCOD,
                            };
                            predicate = predicate.And(x => listHub.Contains(x.KeepingTotalPriceHubId.Value));
                            predicate = predicate.And(x => statusIds.Contains(x.ShipmentStatusId));
                            break;
                        }
                }
                return FindBy(predicate, pageSize, pageNumber, cols);
            }
            catch (Exception ex)
            {
                return ResponseViewModel.CreateError(ex.Message);
            }
        }

        public ResponseViewModel GetLadingHistory(User user, string type, DateTime fromDate, DateTime toDate)
        {
            try
            {
                var listHub = _iuserService.GetListHubFromUser(user);
                var data = _unitOfWork.Repository<Proc_LadingSchedule_report>()
                                      .ExecProcedure(Proc_LadingSchedule_report.GetEntityProc(0, fromDate, toDate));

                switch (type.ToLower())
                {
                    case ShipmentTypeHelper.Delivery:
                        {
                            data = data.Where(x => StatusHelper.GetDeliveryListId().Contains(x.ShipmentStatusId) && listHub.Contains((int)x.LadingScheduleHubId));
                            break;
                        }
                    case ShipmentTypeHelper.Transfer:
                        {
                            data = data.Where(x => StatusHelper.GetTransferListId().Contains(x.ShipmentStatusId) || StatusHelper.GetReturnTransferListId().Contains(x.ShipmentStatusId) && listHub.Contains((int)x.LadingScheduleHubId));
                            break;
                        }
                    case ShipmentTypeHelper.Return:
                        {
                            data = data.Where(x => StatusHelper.GetReturnListId().Contains(x.ShipmentStatusId) && listHub.Contains((int)x.LadingScheduleHubId));
                            break;
                        }
                }

                return ResponseViewModel.CreateSuccess(data);
            }
            catch (Exception ex)
            {
                return ResponseViewModel.CreateError(ex.Message);
            }
        }


        public string GetCodeByType(int type, string prefixCode, int shipmentId, int countIdentity, int? fromProvinceId = 0)
        {
            var shipmentNumberBasic = "";
            if (type == TypeCodeHelper.Shipment.Normal)
            {
                //var randomCode = RandomUtil.GetCode(shipmentId, 7);
                var randomCode = shipmentId.ToString(_icompanyInformation.FormatShipmentCode);
                shipmentNumberBasic = $"{prefixCode}{randomCode}";
            }
            else if (type == TypeCodeHelper.Shipment.Vietstar)
            {
                if (countIdentity == 0) return null;
                var fromProvinceCode = _unitOfWork.RepositoryR<Province>().GetSingle(p => p.Id == fromProvinceId)?.Code;
                if (string.IsNullOrWhiteSpace(fromProvinceCode))
                {
                    fromProvinceCode = "00";
                }
                var randomSevenCode = countIdentity.ToString(_icompanyInformation.FormatShipmentCode);
                DateTime gDate = DateTime.Now;
                string fYearMonth = gDate.ToString("yyMM");
                var shipmentNumberTemp = $"{fromProvinceCode}{fYearMonth}{randomSevenCode}";
                // get sum 
                var sumShipmentNumber = 0;
                for (int i = 0; i < shipmentNumberTemp.Length; i++)
                {
                    int num;
                    bool isSuccess;
                    isSuccess = int.TryParse(shipmentNumberTemp[i].ToString(), out num);
                    if (isSuccess == true)
                        sumShipmentNumber += (num * (i + 1));
                }
                // check number
                var checkNumber = 10 - (sumShipmentNumber % 10);
                if (checkNumber == 10) checkNumber = 0;
                shipmentNumberBasic = $"{shipmentNumberTemp}{checkNumber}";
            }
            return shipmentNumberBasic;
        }

        public string GetBoxCode(int countBox, string shipmentNumberRef)
        {
            return $"{shipmentNumberRef}-{String.Format("{0:D2}", countBox)}";
        }

        public async Task<Shipment> CreateShipment(CreateUpdateShipmentViewModel _viewModel, int currentUserId)
        {
            CreateUpdateShipmentViewModel viewModel = new CreateUpdateShipmentViewModel();
            viewModel = _viewModel.Copy();
            viewModel.ShopCode = null;
            var res = await _iGeneralServiceRaw.Create<Shipment, CreateUpdateShipmentViewModel>(viewModel);
            if (res.IsSuccess)
            {
                var shipment = res.Data as Shipment;
                //
                if (string.IsNullOrWhiteSpace(shipment.ShipmentNumber))
                {
                    using (var context2 = new ApplicationContext())
                    {
                        var resutlt = _unitOfWork.Repository<Proc_GetShipmentNumberAuto>()
                    .ExecProcedureSingle(Proc_GetShipmentNumberAuto.GetEntityProc(shipment.Id, shipment.FromProvinceId));
                        var shipmentNumberBasic = GetCodeByType(_icompanyInformation.TypeShipmentCode, _icompanyInformation.PrefixShipmentCode, shipment.Id, resutlt.CountNumber, shipment.FromProvinceId);
                        if (string.IsNullOrWhiteSpace(shipmentNumberBasic))
                        {
                            return shipment;
                        }
                        shipment.ShipmentNumber = shipmentNumberBasic;
                        var _unitOfWork2 = new UnitOfWork(context2);
                        _unitOfWork2.Repository<Proc_UpdateShipmentNumberAuto>()
                     .ExecProcedureCMD(Proc_UpdateShipmentNumberAuto.GetEntityProc(shipment.Id, shipmentNumberBasic));
                    }
                }
                // thêm hành trình loại nhập kho
                var ladingWarehouseNewShip = new CreateUpdateLadingScheduleViewModel(
                shipment.Id,
                shipment.FromHubId,
                currentUserId,
                StatusHelper.ShipmentStatusId.StoreInWarehousePickup,
                viewModel.CurrentLat,
                viewModel.CurrentLng,
                viewModel.Location,
                viewModel.Note,
                0
            );
                await _iLadingScheduleService.Create(ladingWarehouseNewShip);
                _unitOfWork.Commit();
                return shipment;
            }
            else
            {
                return null;
            }
        }

        public async Task<Shipment> ReCalculatePrice(int shipmentId)
        {
            var viewModel = _unitOfWork.RepositoryR<Shipment>().GetSingle(f => f.Id == shipmentId);
            if (Util.IsNull(viewModel)) return null;
            var totalShipmentBox = _unitOfWork.Repository<Proc_GetTotalShipmentBox>()
                   .ExecProcedureSingle(Proc_GetTotalShipmentBox.GetEntityProc(viewModel.Id));
            if (!Util.IsNull(totalShipmentBox) && totalShipmentBox.TotalBox > 0)
            {
                viewModel.TotalBox = totalShipmentBox.TotalBox;
                viewModel.Weight = totalShipmentBox.TotalWeight;
                viewModel.CalWeight = totalShipmentBox.TotalCalWeight;
                viewModel.CusWeight = totalShipmentBox.TotalCusWeight;
            }
            var dataCalculate = new ShipmentCalculateViewModel();
            dataCalculate.FromDistrictId = viewModel.FromDistrictId.Value;
            dataCalculate.ToDistrictId = viewModel.ToDistrictId.Value;
            dataCalculate.ToDistrictId = viewModel.ToDistrictId.Value;
            if (viewModel.ServiceId.HasValue) dataCalculate.ServiceId = viewModel.ServiceId.Value;
            if (!viewModel.CalWeight.HasValue) viewModel.CalWeight = 0;
            if (viewModel.Weight >= viewModel.CalWeight) dataCalculate.Weight = viewModel.Weight;
            else dataCalculate.Weight = viewModel.CalWeight.Value;
            dataCalculate.FromProvinceId = viewModel.FromProvinceId;
            dataCalculate.FromDistrictId = viewModel.FromDistrictId;
            dataCalculate.FromWardId = viewModel.FromWardId;
            if (viewModel.SenderId.HasValue) dataCalculate.SenderId = viewModel.SenderId.Value;
            var calculate = PriceUtil.Calculate(dataCalculate, _icompanyInformation.Name, true);
            if (calculate.IsSuccess)
            {
                var calculateData = calculate.Data as PriceViewModel;
                viewModel.DefaultPrice = calculateData.DefaultPrice;
                viewModel.DefaultPriceS = calculateData.DefaultPriceS;
                viewModel.DefaultPriceP = calculateData.DefaultPriceP;
                viewModel.TotalDVGT = calculateData.TotalDVGT;
                viewModel.FuelPrice = calculateData.FuelPrice;
                viewModel.OtherPrice = calculateData.OtherPrice;
                viewModel.VATPrice = calculateData.VATPrice;
                viewModel.TotalPrice = calculateData.TotalPrice;
                viewModel.TotalPriceSYS = calculateData.TotalPrice;
            }
            var res = await _iGeneralServiceRaw.Update<Shipment>(viewModel);
            if (res.IsSuccess)
            {
                var shipment = res.Data as Shipment;
                return shipment;
            }
            else
            {
                return null;
            }
        }

        public Proc_GetInfoHubRouting GetInfoRouting(bool? isTruckDelivery, int? districtId, int? wardId, double? weight)
        {
            using (var context = new ApplicationContext())
            {
                var unitOfWork = new UnitOfWork(context);
                var data = unitOfWork.Repository<Proc_GetInfoHubRouting>()
                      .ExecProcedureSingle(Proc_GetInfoHubRouting.GetEntityProc(isTruckDelivery, districtId, wardId, weight));
                return data;
            }
        }

        public Proc_UpdateShipmentStatus UpdateShipmentStatus(string shipmentIds, int statusId, int userId, int hubId)
        {
            var data = _unitOfWork.Repository<Proc_UpdateShipmentStatus>()
                  .ExecProcedureSingle(Proc_UpdateShipmentStatus.GetEntityProc(shipmentIds, statusId, userId, hubId));
            return data;
        }
    }
}
