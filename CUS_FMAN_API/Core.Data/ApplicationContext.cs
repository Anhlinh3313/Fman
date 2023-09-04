using System;
using Core.Entity.Entities;
using Core.Entity.Procedures;
using Core.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Core.Data
{
    public class ApplicationContext : DbContext
    {
        //public ApplicationContext(DbContextOptions options) : base(options) { }

        public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options) { }

        public ApplicationContext()
        {

        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(Connection.Instance.GetConnectionString());
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            //General
            modelBuilder.Entity<User>().ToTable("Core_User");
            modelBuilder.Entity<Role>().ToTable("Core_Role");
            modelBuilder.Entity<Department>().ToTable("Core_Department");
            modelBuilder.Entity<Country>().ToTable("Core_Country");
            modelBuilder.Entity<Province>().ToTable("Core_Province");
            modelBuilder.Entity<District>().ToTable("Core_District");
            modelBuilder.Entity<Ward>().ToTable("Core_Ward");
            modelBuilder.Entity<Hub>().ToTable("Core_Hub");
            modelBuilder.Entity<HubRoute>().ToTable("Core_HubRoute");
            modelBuilder.Entity<HubRoutingWard>().ToTable("Core_HubRoutingWard");
            modelBuilder.Entity<Street>().ToTable("Core_Street");
            modelBuilder.Entity<StreetJoin>().ToTable("Core_StreetJoin");
            modelBuilder.Entity<HubRoutingStreetJoin>().ToTable("Core_HubRoutingStreetJoin");
            modelBuilder.Entity<NotificationPushLog>().ToTable("Core_NotificationPushLog");
            //
            modelBuilder.Entity<Customer>().ToTable("Crm_Customer");
            modelBuilder.Entity<CustomerInfoLog>().ToTable("Crm_CustomerInfoLog");
            //Post
            modelBuilder.Entity<Shipment>().ToTable("Post_Shipment");
            modelBuilder.Entity<LadingSchedule>().ToTable("Post_LadingSchedule");
            modelBuilder.Entity<RequestShipment>().ToTable("Post_RequestShipment");
            modelBuilder.Entity<RequestLadingSchedule>().ToTable("Post_RequestLadingSchedule");
            modelBuilder.Entity<ShipmentStatus>().ToTable("Post_ShipmentStatus");
            modelBuilder.Entity<Reason>().ToTable("Post_Reason");
            modelBuilder.Entity<AreaGroup>().ToTable("Post_AreaGroup");
            modelBuilder.Entity<Area>().ToTable("Post_Area");
            modelBuilder.Entity<AreaDistrict>().ToTable("Post_AreaDistrict");
            modelBuilder.Entity<Formula>().ToTable("Post_Formula");
            modelBuilder.Entity<WeightGroup>().ToTable("Post_WeightGroup");
            modelBuilder.Entity<Weight>().ToTable("Post_Weight");
            modelBuilder.Entity<PriceList>().ToTable("Post_PriceList");
            modelBuilder.Entity<PriceService>().ToTable("Post_PriceService");
            modelBuilder.Entity<PriceServiceDetail>().ToTable("Post_PriceServiceDetail");
            modelBuilder.Entity<CustomerPriceList>().ToTable("Post_CustomerPriceList");
            modelBuilder.Entity<Service>().ToTable("Post_Service");
            modelBuilder.Entity<ServiceDVGT>().ToTable("Post_ServiceDVGT");
            modelBuilder.Entity<PackType>().ToTable("Post_PackType");
            modelBuilder.Entity<PaymentType>().ToTable("Post_PaymentType");
            modelBuilder.Entity<Structure>().ToTable("Post_Structure");
            modelBuilder.Entity<ShipmentServiceDVGT>().ToTable("Post_ShipmentServiceDVGT");
            modelBuilder.Entity<ServiceDVGTPrice>().ToTable("Post_ServiceDVGTPrice");
            modelBuilder.Entity<Box>().ToTable("Post_Box");
            modelBuilder.Entity<Package>().ToTable("Post_Package");
            modelBuilder.Entity<ShipmentPackage>().ToTable("Post_ShipmentPackage");
            modelBuilder.Entity<ShipmentServiceDVGT>().ToTable("Post_ShipmentServiceDVGT");
            modelBuilder.Entity<Size>().ToTable("Post_Size");
            modelBuilder.Entity<RequestShipmentServiceDVGT>().ToTable("Post_RequestShipmentServiceDVGT");
            modelBuilder.Entity<ListCustomerPayment>().ToTable("Post_ListCustomerPayment");
            modelBuilder.Entity<ListCustomerPaymentType>().ToTable("Post_ListCustomerPaymentType");
            modelBuilder.Entity<ShipmentImageCus>().ToTable("Post_ShipmentImageCus");
            modelBuilder.Entity<TelephoneAreaCodes>().ToTable("Post_TelephoneAreaCodes");
            modelBuilder.Entity<DeadlinePickupDelivery>().ToTable("Post_DeadlinePickupDelivery");
            modelBuilder.Entity<DeadlinePickupDeliveryDetail>().ToTable("Post_DeadlinePickupDeliveryDetail");
            modelBuilder.Entity<CalculateBy>().ToTable("Post_CalculateBy");
            modelBuilder.Entity<ChargedCOD>().ToTable("Post_ChargedCOD");
            modelBuilder.Entity<ChargedRemote>().ToTable("Post_ChargedRemote");
            modelBuilder.Entity<PriceListDVGT>().ToTable("Post_PriceListDVGT");
            modelBuilder.Entity<CustomerPriceService>().ToTable("Post_CustomerPriceService");
            modelBuilder.Entity<ComplainType>().ToTable("Post_ComplainType");
            modelBuilder.Entity<ComplainStatus>().ToTable("Post_ComplainStatus");
            modelBuilder.Entity<Complain>().ToTable("Post_Complain");
            modelBuilder.Entity<ComplainHandle>().ToTable("Post_ComplainHandle");
            modelBuilder.Entity<Bank>().ToTable("Core_Bank");
            modelBuilder.Entity<Branch>().ToTable("Core_Branch");
            modelBuilder.Entity<Holiday>().ToTable("Post_Holiday");
            modelBuilder.Entity<CustomerSettinng>().ToTable("Crm_CustomerSetting");
            modelBuilder.Entity<FormPrint>().ToTable("Post_FormPrint");
            //modelBuilder.Entity<GeneralInfo>().ToTable("Core_GeneralInfo");
            //
            modelBuilder.Entity<Proc_GetInfoRemote>().ToTable(Proc_GetInfoRemote.ProcName);
            modelBuilder.Entity<Proc_GetDeadlineService>().ToTable(Proc_GetDeadlineService.ProcName);
            modelBuilder.Entity<Proc_PriceServiceDVGT>().ToTable(Proc_PriceServiceDVGT.ProcName);
            modelBuilder.Entity<Proc_PriceService>().ToTable(Proc_PriceService.ProcName);
            modelBuilder.Entity<Proc_GetShipmentByShipmentNumber>().ToTable(Proc_GetShipmentByShipmentNumber.ProcName);
            modelBuilder.Entity<Proc_LadingSchedule_Joined>().ToTable(Proc_LadingSchedule_Joined.ProcName);
            modelBuilder.Entity<Proc_RequestLadingSchedule_Joined>().ToTable(Proc_RequestLadingSchedule_Joined.ProcName);
            modelBuilder.Entity<Proc_LadingSchedule_report>().ToTable(Proc_LadingSchedule_report.ProcName);
            modelBuilder.Entity<Proc_GetShipmentNumberAuto>().ToTable(Proc_GetShipmentNumberAuto.ProcName);
            modelBuilder.Entity<Proc_UpdateShipmentNumberAuto>().ToTable(Proc_UpdateShipmentNumberAuto.ProcName);
            modelBuilder.Entity<Proc_GetBoxNumberAuto>().ToTable(Proc_GetBoxNumberAuto.ProcName);
            modelBuilder.Entity<Proc_Core_DeleteTable>().ToTable(Proc_Core_DeleteTable.ProcName);
            modelBuilder.Entity<Proc_GenderComplainCode>().ToTable(Proc_GenderComplainCode.ProcName);
            modelBuilder.Entity<Proc_FindShipmentParent>().ToTable(Proc_FindShipmentParent.ProcName);
            modelBuilder.Entity<Proc_GetTotalShipmentBox>().ToTable(Proc_GetTotalShipmentBox.ProcName);
            modelBuilder.Entity<Proc_GetInfoHubRouting>().ToTable(Proc_GetInfoHubRouting.ProcName);
            modelBuilder.Entity<Proc_GetCountCustomerByProvince>().ToTable(Proc_GetCountCustomerByProvince.ProcName);
            modelBuilder.Entity<Proc_UpdateShipmentRequestId>().ToTable(Proc_UpdateShipmentRequestId.ProcName);
            modelBuilder.Entity<Proc_GetShipmentToPrint>().ToTable(Proc_GetShipmentToPrint.ProcName);
            modelBuilder.Entity<Proc_CreateFastBooking>().ToTable(Proc_CreateFastBooking.ProcName);
            modelBuilder.Entity<Proc_SaveLogReceiveData>().ToTable(Proc_SaveLogReceiveData.ProcName);
            modelBuilder.Entity<Proc_CusReportListShipment>().ToTable(Proc_CusReportListShipment.ProcName);
            modelBuilder.Entity<Proc_CustomerDashboard>().ToTable(Proc_CustomerDashboard.ProcName);
            modelBuilder.Entity<Proc_CustomerDashboardDetail>().ToTable(Proc_CustomerDashboardDetail.ProcName);
            modelBuilder.Entity<Proc_CustomerCountCOD>().ToTable(Proc_CustomerCountCOD.ProcName);
            modelBuilder.Entity<Proc_CustomerCountCODDetail>().ToTable(Proc_CustomerCountCODDetail.ProcName);
            modelBuilder.Entity<Proc_CheckShipmentRequest>().ToTable(Proc_CheckShipmentRequest.ProcName);
            modelBuilder.Entity<Proc_CustomerComparing>().ToTable(Proc_CustomerComparing.ProcName);
            modelBuilder.Entity<Proc_CustomerComparingDetails>().ToTable(Proc_CustomerComparingDetails.ProcName);
            modelBuilder.Entity<Proc_GetByShipmentNumber>().ToTable(Proc_GetByShipmentNumber.ProcName);
            modelBuilder.Entity<Proc_UpdateShipmentStatus>().ToTable(Proc_UpdateShipmentStatus.ProcName);
            modelBuilder.Entity<Proc_GetListShipments>().ToTable(Proc_GetListShipments.ProcName);
            modelBuilder.Entity<Proc_GetGroupListShipments>().ToTable(Proc_GetGroupListShipments.ProcName);
            modelBuilder.Entity<Proc_FindingBiker>().ToTable(Proc_FindingBiker.ProcName);
            //
            modelBuilder.Entity<User>()
                        .HasOne(a => a.Hub)
                        .WithMany(b => b.Users);

            modelBuilder.Entity<Hub>()
                        .HasOne(a => a.CenterHub)
                        .WithMany(b => b.PoHubs);
        }

        #region Table
        #endregion
    }
}
