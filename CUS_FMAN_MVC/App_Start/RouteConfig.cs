using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace PCSWebAPP
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            #region Quản lý đơn hàng
            routes.MapRoute(
            "taodonhang",
            "tao-don-hang.html",
            new { controller = "Lading", action = "AddLading" },
            new string[] { "PCSWebAPP.Controllers" }
         );
            routes.MapRoute(
           "taoyeucau",
           "tao-yeu-cau-lay-hang.html",
           new { controller = "Lading", action = "CreateRequest" },
           new string[] { "PCSWebAPP.Controllers" }
        );
            routes.MapRoute(
           "requestList",
           "quan-ly-yeu-cau-lay-hang.html",
           new { controller = "Lading", action = "RequestList" },
           new string[] { "PCSWebAPP.Controllers" }
        );

            routes.MapRoute(
           "taodonhangexcel",
           "tao-don-hang-bang-excel.html",
           new { controller = "Lading", action = "ImportLading" },
           new string[] { "PCSWebAPP.Controllers" }
        );
            routes.MapRoute(
           "taovandonVT",
           "tao-van-don-VT.html",
           new { controller = "Lading", action = "ImportLadingVT" },
           new string[] { "PCSWebAPP.Controllers" }
        );
            routes.MapRoute(
              "qlvandon",
              "quan-ly-don-hang.html",
              new { controller = "Lading", action = "Index" },
              new string[] { "PCSWebAPP.Controllers" }
           );
            routes.MapRoute(
               "timkiemdonhang",
               "tim-kiem-don-hang.html",
               new { controller = "Lading", action = "Search" },
               new string[] { "PCSWebAPP.Controllers" }
            );
            routes.MapRoute(
               "dvdonhang",
               "dinh-vi-don-hang.html",
               new { controller = "Lading", action = "TrackingLading" },
               new string[] { "PCSWebAPP.Controllers" }
            );
            #endregion
            #region Tiền thu hộ
            routes.MapRoute(
               "qlcongno",
               "quan-ly-cong-no.html",
               new { controller = "Price", action = "Money" },
               new string[] { "PCSWebAPP.Controllers" }
            );
            routes.MapRoute(
               "phienchuyentiencod",
               "phien-chuyen-tien-cod.html",
               new { controller = "Price", action = "MoneyTransfer" },
               new string[] { "PCSWebAPP.Controllers" }
            );
            #endregion
            routes.MapRoute(
              "bkthanhtoan",
              "thanh-toan-cuoc.html",
              new { controller = "Price", action = "Payment" },
              new string[] { "PCSWebAPP.Controllers" }
           );
            #region Khách hàng truy cập
            routes.MapRoute(
               "dangnhap",
               "dang-nhap.html",
               new { controller = "Home", action = "Login" },
               new string[] { "PCSWebAPP.Controllers" }
            );
            routes.MapRoute(
               "dangky",
               "dang-ky.html",
               new { controller = "Home", action = "Register" },
               new string[] { "PCSWebAPP.Controllers" }
            );
            routes.MapRoute(
               "xacnhanmatkhau",
               "xac-nhan-mat-khau.html",
               new { controller = "Home", action = "ConfirmPassword" },
               new string[] { "PCSWebAPP.Controllers" }
            );
            routes.MapRoute(
             "quenmatkhau",
             "quen-mat-khau.html",
             new { controller = "Home", action = "ForgotPassword" },
             new string[] { "PCSWebAPP.Controllers" }
          );
            routes.MapRoute(
         "guimailthanhcong",
         "gui-mail-thanh-cong.html",
         new { controller = "Home", action = "SendMailComplete" },
         new string[] { "PCSWebAPP.Controllers" }
      );
            routes.MapRoute(
               "thoat",
               "thoat.html",
               new { controller = "Home", action = "LogOut" },
               new string[] { "PCSWebAPP.Controllers" }
            );
            #endregion
            #region Khách hàng thông tin
            routes.MapRoute(
               "thongtincanhan",
               "thong-tin-ca-nhan.html",
               new { controller = "Customer", action = "Index" },
               new string[] { "PCSWebAPP.Controllers" }
            );
            routes.MapRoute(
               "doimatkhau",
               "doi-mat-khau.html",
               new { controller = "Customer", action = "ChangePass" },
               new string[] { "PCSWebAPP.Controllers" }
            );
            routes.MapRoute(
               "chinhsuathongtin",
               "chinh-sua-thong-tin.html",
               new { controller = "Customer", action = "ChangeInfo" },
               new string[] { "PCSWebAPP.Controllers" }
            );
            #endregion
            routes.MapRoute(
               "term",
               "dieu-khoan-va-cac-dieu-kien-van-chuyen.html",
               new { controller = "Home", action = "TermAndCondition" },
               new string[] { "PCSWebAPP.Controllers" }
            );
            routes.MapRoute(
              "dhchualay",
              "cho-duyet-gui-hang.html",
              new { controller = "Lading", action = "WaitingPickup" },
              new string[] { "PCSWebAPP.Controllers" }
           );
            routes.MapRoute(
              "dashboard",
              "dashboard.html",
              new { controller = "DashBroad", action = "DashBroad" },
              new string[] { "PCSWebAPP.Controllers" }
           );
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
