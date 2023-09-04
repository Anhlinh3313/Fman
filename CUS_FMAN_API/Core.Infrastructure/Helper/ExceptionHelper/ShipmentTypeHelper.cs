using System;
namespace Core.Infrastructure.Helper.ExceptionHelper
{
    public static class ShipmentTypeHelper
    {
        public const string Pickup = "pickup";
        public const string UpdatePickup = "updatepickup";
        public const string Delivery = "delivery";
        public const string UpdateDelivery = "updatedelivery";
        public const string Transfer = "transfer";
        public const string Transferring = "transferring";
        public const string UpdateTransfer = "updatetransfer";
        public const string ReShipTransfer = "reShipTransfer";
        public const string Return = "return";
        public const string UpdateReturn = "updatereturn";
        public const string WaitingToPack = "waitingtopack";
        public const string PackPackage = "packpackage";
        public const string OpenPackage = "openpackage";
        public const string HubConfirmMoneyFromRider = "hubconfirmmoneyfromrider";
        public const string ParentHubConfirmMoneyFromHub = "parenthubconfirmmoneyfromhub";
        public const string AccountantConfirmMoneyFromHub = "accountantconfirmmoneyfromhub";
        public const string TreasurerConfirmMoneyFromAccountant = "treasurerconfirmmoneyfromaccountant";
    }
}
