using System.Web.Mvc;
using System;
using PCSWebAPP.Common;
using System.Linq;
using System.IO;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace PCSWebAPP.Controllers
{
    public class LadingController : BaseController
    {
        #region //Các view
        public ActionResult Index()
        {
            return View();
        }//Danh sách vận đơn
        public ActionResult ListLading()
        {
            return View();
        }//Danh sách vận đơn
        public ActionResult RequestList()
        {
            return View();
        }//Danh sách yêu cầu
        public ActionResult Search()
        {
            return View();
        }//View tìm kiếm vận đơn     
        public ActionResult ImportLading()
        {
            return View();
        }//Import excel view
        public ActionResult ImportLadingVT()
        {
            return View();
        }//Import excel view

        public ActionResult AddLading()
        {
            return View();
        }//thêm vận đơn

        public ActionResult CreateRequest()
        {
            return View();
        }//tạo yêu cầu

        public ActionResult WaitingPickup()
        {
            return View();
        }//Đơn hàng chưa lấy
        #endregion

    }
}