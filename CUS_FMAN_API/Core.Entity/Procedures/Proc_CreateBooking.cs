using Core.Entity.Abstract;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.SqlClient;
using System.Text;

namespace Core.Entity.Procedures
{
     public class Proc_CreateBooking : IEntityProcView
    {
        public const string ProcName = "Proc_CreateBooking";
        [Key]
        public Boolean IsSuccess { get; set; }
        public string Message { get; set; }
        public string ShipmentNumber { get; set; }

        public Proc_CreateBooking() { }
        public static IEntityProc GetEntityProc
            (int? senderId = null, string senderName = null, string senderPhone = null, string addressNoteFrom = null,
            string pickingAddress = null, int? fromProvinceId = null, int? fromDistrictId = null, int? fromWardId = null,
            int? fromHubId = null, int? fromHubRoutingId = null, int? currentHubId = null, int? serviceId = null, 
            double? weight = null, int? shipmentStatusId = null, string receiverName = null, string receiverPhone = null,
            string addressNoteTo = null, string shippingAddress = null, int? toProvinceId = null, int? toDistrictId = null, 
            int? toWardId = null, int? toHubId = null, int? toHubRoutingId = null, string cusNote = null, string note = null,
            DateTime? orderDate = null, int? shipmentId = null, string preCode = null)
        {
            SqlParameter SenderId = new SqlParameter("@SenderId", senderId);
            if (!senderId.HasValue || senderId==0) SenderId.Value = DBNull.Value;
            SqlParameter SenderName = new SqlParameter("@SenderName", senderName);
            if (string.IsNullOrWhiteSpace(senderName)) SenderName.Value = DBNull.Value;
            SqlParameter SenderPhone = new SqlParameter("@SenderPhone", senderPhone);
            if (string.IsNullOrWhiteSpace(senderPhone)) SenderPhone.Value = DBNull.Value;
            SqlParameter AddressNoteFrom = new SqlParameter("@AddressNoteFrom", addressNoteFrom);
            if (string.IsNullOrWhiteSpace(addressNoteFrom)) AddressNoteFrom.Value = DBNull.Value;
            SqlParameter PickingAddress = new SqlParameter("@PickingAddress", pickingAddress);
            if (string.IsNullOrWhiteSpace(pickingAddress)) PickingAddress.Value = DBNull.Value;
            SqlParameter FromProvinceId = new SqlParameter("@FromProvinceId", fromProvinceId);
            if (!fromProvinceId.HasValue || fromProvinceId == 0) FromProvinceId.Value = DBNull.Value;
            SqlParameter FromDistrictId = new SqlParameter("@FromDistrictId", fromDistrictId);
            if (!fromDistrictId.HasValue || fromDistrictId == 0) FromDistrictId.Value = DBNull.Value;
            SqlParameter FromWardId = new SqlParameter("@FromWardId", fromWardId);
            if (!fromWardId.HasValue || fromWardId == 0) FromWardId.Value = DBNull.Value;
            SqlParameter FromHubId = new SqlParameter("@FromHubId", fromHubId);
            if (!fromHubId.HasValue || fromHubId == 0) FromHubId.Value = DBNull.Value;
            SqlParameter FromHubRoutingId = new SqlParameter("@FromHubRoutingId", fromHubId);
            if (!fromHubRoutingId.HasValue || fromHubRoutingId == 0) FromHubRoutingId.Value = DBNull.Value;
            SqlParameter CurrentHubId = new SqlParameter("@CurrentHubId", currentHubId);
            if (!currentHubId.HasValue || currentHubId == 0) CurrentHubId.Value = DBNull.Value;
            SqlParameter ServiceId = new SqlParameter("@ServiceId", serviceId);
            if (!serviceId.HasValue || serviceId == 0) ServiceId.Value = DBNull.Value;
            SqlParameter Weight = new SqlParameter("@Weight", weight);
            if (!weight.HasValue) Weight.Value = 0;
            SqlParameter ShipmentStatusId = new SqlParameter("@ShipmentStatusId", shipmentStatusId);
            if (!shipmentStatusId.HasValue || shipmentStatusId == 0) ShipmentStatusId.Value = DBNull.Value;
            SqlParameter ReceiverName = new SqlParameter("@ReceiverName", receiverName);
            if (string.IsNullOrWhiteSpace(receiverName)) ReceiverName.Value = DBNull.Value;
            SqlParameter ReceiverPhone = new SqlParameter("@ReceiverPhone", receiverPhone);
            if (string.IsNullOrWhiteSpace(receiverPhone)) ReceiverPhone.Value = DBNull.Value;
            SqlParameter AddressNoteTo = new SqlParameter("@AddressNoteTo", addressNoteTo);
            if (string.IsNullOrWhiteSpace(addressNoteTo)) AddressNoteTo.Value = DBNull.Value;
            SqlParameter ShippingAddress = new SqlParameter("@ShippingAddress", shippingAddress);
            if (string.IsNullOrWhiteSpace(shippingAddress)) ShippingAddress.Value = DBNull.Value;
            SqlParameter ToProvinceId = new SqlParameter("@ToProvinceId", toProvinceId);
            if (!toProvinceId.HasValue || toProvinceId == 0) ToProvinceId.Value = DBNull.Value;
            SqlParameter ToDistrictId = new SqlParameter("@ToDistrictId", toDistrictId);
            if (!toDistrictId.HasValue || toDistrictId == 0) ToDistrictId.Value = DBNull.Value;
            SqlParameter ToWardId = new SqlParameter("@ToWardId", toWardId);
            if (!toWardId.HasValue || toWardId == 0) ToWardId.Value = DBNull.Value;
            SqlParameter ToHubId = new SqlParameter("@ToHubId", toHubId);
            if (!toHubId.HasValue || toHubId == 0) ToHubId.Value = DBNull.Value;
            SqlParameter ToHubRoutingId = new SqlParameter("@ToHubRoutingId", toHubRoutingId);
            if (!toHubRoutingId.HasValue || toHubRoutingId == 0) ToHubRoutingId.Value = DBNull.Value;
            SqlParameter CusNote = new SqlParameter("@CusNote", cusNote);
            if (string.IsNullOrWhiteSpace(cusNote)) CusNote.Value = DBNull.Value;
            SqlParameter Note = new SqlParameter("@Note", note);
            if (string.IsNullOrWhiteSpace(note)) Note.Value = DBNull.Value;
            SqlParameter OrderDate = new SqlParameter("@Note", orderDate);
            if (!orderDate.HasValue) OrderDate.Value = DBNull.Value;
            SqlParameter ShipmentId = new SqlParameter("@ShipmentId", shipmentId);
            if (!shipmentId.HasValue || shipmentId == 0) ShipmentId.Value = DBNull.Value;
            SqlParameter PreCode = new SqlParameter("@PreCode", preCode);
            if (string.IsNullOrWhiteSpace(preCode)) PreCode.Value = DBNull.Value;

            return new EntityProc(
                $"{ProcName} @SenderId,@SenderName,@SenderPhone,@AddressNoteFrom,@PickingAddress,@FromProvinceId,@FromDistrictId,"
                +"@FromWardId,@FromHubId,@FromHubRoutingId,@CurrentHubId,@ServiceId,@Weight,@ShipmentStatusId,"
                +"@ReceiverName,@ReceiverPhone,@AddressNoteTo,@ShippingAddress,@ToProvinceId,@ToDistrictId,@ToWardId,"
                +"@ToHubId,@ToHubRoutingId,@CusNote,@Note,@OrderDate,@ShipmentId,@PreCode",
                new SqlParameter[] {
                    SenderId,SenderName,SenderPhone,AddressNoteFrom,PickingAddress,FromProvinceId,FromDistrictId,
                    FromWardId,FromHubId,FromHubRoutingId,CurrentHubId,ServiceId,Weight,ShipmentStatusId,
                    ReceiverName,ReceiverPhone,AddressNoteTo,ShippingAddress,ToProvinceId,ToWardId,
                    ToHubId,ToHubRoutingId,CusNote,Note,OrderDate,ShipmentId,PreCode
                }
            );
        }
    }
}
