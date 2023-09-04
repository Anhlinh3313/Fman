using System;
namespace Core.Infrastructure.Helper
{
    public class StatusHelper
    {
        public class ShipmentStatusId
        {
            public const int ReadyToPick = 1;
            public const int Picking = 2;
            public const int PickupComplete = 3;
            public const int PickupFail = 4;
            public const int PickupCancel = 5;
            public const int ReadyToPack = 6;
            public const int WaitingToTransfer = 7;
            public const int Transferring = 8;
            public const int Storing = 9;
            public const int ReadyToDelivery = 10;
            public const int Delivering = 11;
            public const int DeliveryComplete = 12;
            public const int DeliveryFail = 13;
            public const int WaitingAcceptReturn = 14;
            public const int HubReceivedCOD = 15;
            public const int AccountantReceivedCOD = 16;
            public const int ReadyToCollect = 17;
            public const int Collecting = 18;
            public const int CollectComplete = 19;
            public const int CollectFail = 20;
            public const int CollectCancel = 21;
            public const int HubTransferCODToAccountant = 22;
            public const int ReShip = 23;
            public const int TransferLostPackage = 24;
            public const int LotteCancel = 25;
            public const int ReturnComplete = 26;
            public const int ReturnLostPackage = 27;
            public const int ReturnFail = 28;
            public const int PickupLostPackage = 29;
            public const int DeliveryLostPackage = 30;
            public const int Returning = 31;
            public const int TransferComplete = 32;
            public const int DeliveryContinue = 33;
            public const int TransferReturnComplete = 34;
            public const int TransferReturnLostPackage = 35;
            public const int TransferReturnFail = 36;
            public const int TransferReturning = 37;
            public const int AcceptReturn = 38;
            public const int ChangeDeliveryAddress = 39;
            public const int TransferTo3PL = 40;
            public const int AssignEmployeePickup = 41;
            public const int RejectPickup = 42;
            public const int StoreInWarehousePickup = 43;
            public const int StoreInWarehouseTransfer = 44;
            public const int StoreInWarehouseDelivery = 45;
            public const int StoreInWarehouseReturnTransfer = 46;
            public const int StoreInWarehouseReturn = 47;
            public const int AssignEmployeeDelivery = 48;
            public const int AssignEmployeeTransfer = 49;
            public const int AssignEmployeeTransferReturn = 50;
            public const int AssignEmployeeReturn = 51;
            public const int ReturnReShip = 52;
            public const int TreasurertReceivedCOD = 53;
            public const int NewRequest = 54;
            public const int Cancel = 57;
            public const int ChangeShippingAddress = 58;
            public const int WaitingHandling = 59;
            public const int Incident = 60;
            public const int Compensation = 61;
            public const int WarehouseEmp = 62;
            public const int AssignWarehouse = 63;
            public const int CallSuccess = 100;
            public const int CallFailedOne = 101;
            public const int CallFailedTwo = 102;
            public const int DeliveryCallFailOne = 103;
            public const int Idle = 104;
            public const int WarehousingShopCheck = 106;
        }

        public static int[] GetPickupListId()
        {
            return new int[]
            {
                ShipmentStatusId.ReadyToPick,
                ShipmentStatusId.StoreInWarehousePickup,
                ShipmentStatusId.RejectPickup,
                ShipmentStatusId.AssignEmployeePickup,
                ShipmentStatusId.Picking,
                ShipmentStatusId.PickupComplete,
                ShipmentStatusId.PickupFail,
                ShipmentStatusId.PickupCancel,
                ShipmentStatusId.PickupLostPackage
            };
        }       

        public static int[] GetPackingListId()
        {
            return new int[]
            {
                ShipmentStatusId.ReadyToPack,
                ShipmentStatusId.ReadyToDelivery
            };
        }

        public static int[] GetTransferListId()
        {
            return new int[]
            {
                ShipmentStatusId.WaitingToTransfer,
                ShipmentStatusId.AssignEmployeeTransfer,
                ShipmentStatusId.Transferring,
                ShipmentStatusId.TransferReturning,
                ShipmentStatusId.TransferLostPackage,
                ShipmentStatusId.Storing,
                ShipmentStatusId.TransferComplete,
                ShipmentStatusId.ReShip
            };
        }

        public static int[] GetDeliveryListId()
        {
            return new int[]
            {
                ShipmentStatusId.ReadyToDelivery,
                ShipmentStatusId.AssignEmployeeDelivery,
                ShipmentStatusId.Delivering,
                ShipmentStatusId.DeliveryComplete,
                ShipmentStatusId.DeliveryFail,
                ShipmentStatusId.DeliveryLostPackage,
                ShipmentStatusId.ChangeDeliveryAddress
            };
        }

        public static int[] GetReturnTransferListId()
        {
            return new int[]
            {
                ShipmentStatusId.AssignEmployeeTransferReturn,
                ShipmentStatusId.TransferReturning,
                ShipmentStatusId.TransferReturnComplete,
                ShipmentStatusId.TransferReturnLostPackage,
                ShipmentStatusId.StoreInWarehouseReturnTransfer,
                ShipmentStatusId.ReturnReShip
            };
        }

        public static int[] GetReturnListId()
        {
            return new int[]
            {
                ShipmentStatusId.AssignEmployeeReturn,
                ShipmentStatusId.ReturnComplete,
                ShipmentStatusId.ReturnLostPackage,
                ShipmentStatusId.ReturnFail,
                ShipmentStatusId.Returning
            };
        }

        public static int[] GetTypePaying()
        {
            return new int[]
            {
            };
        }

        public static int[] GetTypeCODDelivered()
        {
            return new int[]
            {
                ShipmentStatusId.DeliveryComplete,
            };
        }

        public static int[] GetTypeCODReturn()
        {
            return new int[]
            {
                ShipmentStatusId.ReturnComplete,
            };
        }

        public static int[] GetTypeCODCancel()
        {
            return new int[]
            {
                ShipmentStatusId.PickupCancel,
            };
        }

        public static int[] GetStatusAllowCancelRequest()
        {
            return new int[]
            {
                ShipmentStatusId.ReadyToPick,
                ShipmentStatusId.Picking,
                ShipmentStatusId.PickupFail,
                ShipmentStatusId.NewRequest,
                ShipmentStatusId.AssignEmployeePickup,
            };
        }
        //Đang chuyển hoàn
        public static int[] ChoChuyenHoan()
        {
            return new int[]
            {
                ShipmentStatusId.AssignEmployeeReturn,
            };
        }
        //Đang chuyển hoàn
        public static int[] AssignEmployeeReturn()
        {
            return new int[]
            {
                ShipmentStatusId.WaitingAcceptReturn,
                ShipmentStatusId.AssignEmployeeReturn,
            };
        }
        //
        public static int[] GetLostPackage()
        {
            return new int[]
            {
                ShipmentStatusId.PickupLostPackage,
                ShipmentStatusId.TransferLostPackage,
                ShipmentStatusId.DeliveryLostPackage,
                ShipmentStatusId.TransferReturnLostPackage,
                ShipmentStatusId.ReturnLostPackage,
            };
        }
        public static int[] GetCancel()
        {
            return new int[]
            {
                ShipmentStatusId.PickupCancel,
                ShipmentStatusId.LotteCancel,
                ShipmentStatusId.RejectPickup,
                ShipmentStatusId.Cancel,
            };
        }
        //moi tao
        public static int[] NewRequest()
        {
            return new int[]
            {
                ShipmentStatusId.NewRequest,
                ShipmentStatusId.WaitingHandling,
            };
        }
        //cho lay hang
        public static int[] ReadyPickup()
        {
            return new int[]
            {
                ShipmentStatusId.ReadyToPick,
                ShipmentStatusId.Picking,
                ShipmentStatusId.RejectPickup,
                ShipmentStatusId.PickupFail,
            };
        }

        //Dang phat
        public static int[] Delivering()
        {
            return new int[]
            {
                ShipmentStatusId.WaitingToTransfer,
                ShipmentStatusId.ReadyToDelivery,
                ShipmentStatusId.DeliveryFail,
                ShipmentStatusId.Delivering,
                ShipmentStatusId.AssignEmployeeDelivery,
            };
        }
        //phat thanh cong
        public static int[] Delivered()
        {
            return new int[]
            {
                ShipmentStatusId.DeliveryComplete,
            };
        }

        //Đã chuyển hoàn
        public static int[] ReturnComplete()
        {
            return new int[]
            {
                ShipmentStatusId.ReturnComplete,
            };
        }
        //Đã lấy hàng
        public static int[] PickupComplete()
        {
            return new int[]
            {
                ShipmentStatusId.PickupComplete,
            };
        }
        //Trong kho
        public static int[] Warehousing()
        {
            return new int[]
            {
                ShipmentStatusId.ReturnComplete,
                ShipmentStatusId.DeliveryComplete,
                ShipmentStatusId.Delivering,
                ShipmentStatusId.AssignEmployeeDelivery,
                ShipmentStatusId.ReadyToPick,
                ShipmentStatusId.Picking,
                ShipmentStatusId.RejectPickup,
                ShipmentStatusId.PickupFail,
                ShipmentStatusId.NewRequest,
            };
        }
        //Trong kho
        public static int[] Fail()
        {
            return new int[]
            {
                ShipmentStatusId.ReturnFail,
                ShipmentStatusId.DeliveryFail,
                ShipmentStatusId.WarehouseEmp,
                ShipmentStatusId.AssignWarehouse,
            };
        }
        // SendRequest
        public static int[] SendRequest()
        {
            return new int[]
            {
                ShipmentStatusId.NewRequest,
                ShipmentStatusId.ReadyToPick,
                ShipmentStatusId.AssignEmployeePickup,
            };
        }
    }
}
