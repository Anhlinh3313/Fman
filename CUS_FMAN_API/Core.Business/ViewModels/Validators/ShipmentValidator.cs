using System;
using Core.Business.ViewModels.Shipments;
using Core.Data.Abstract;
using Core.Entity.Entities;
using Core.Infrastructure.Extensions;
using Core.Infrastructure.Security;
using Core.Infrastructure.Utils;
using FluentValidation.Validators;

namespace Core.Business.ViewModels.Validators.Properties
{
    public class ShipmentValidator : BaseValidator<Shipment>
    {
        public ShipmentValidator(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        protected override bool IsValid(PropertyValidatorContext context)
        {
            bool result = true;

            return result;
        }

        public bool UniqueShipmentNumber(CreateUpdateShipmentViewModel model)
        {
            if (model.Id == 0)
                return !_unitOfWork.RepositoryR<Shipment>().Any(x => x.ShipmentNumber==(model.ShipmentNumber.Trim()));
            else
                return !_unitOfWork.RepositoryR<Shipment>().Any(x => x.ShipmentNumber==(model.ShipmentNumber.Trim()) && x.Id != model.Id);
        }

        public bool UniqueShopCode(CreateUpdateShipmentViewModel model)
        {
            if (model.Id == 0)
                return !_unitOfWork.RepositoryR<Shipment>().Any(x => x.ShopCode==(model.ShopCode.Trim()) && x.SenderId == model.SenderId);
            else
                return !_unitOfWork.RepositoryR<Shipment>().Any(x => x.ShopCode==(model.ShopCode.Trim()) && x.Id != model.Id && x.SenderId == model.SenderId);
        }
    }
}
