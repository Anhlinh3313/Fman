using PCSWebAPP.Common;
using Newtonsoft.Json;
using System;
using System.Web.Mvc;

namespace PCSWebAPP.Controllers
{
    public class PriceController : BaseController
    {
        // GET: Phiên chuyển tiền COD
        public ActionResult MoneyTransfer()
        {
            return View();
        }
        // GET: Tiền thu hộ
        public ActionResult Money()
        {
            return View();
        }
        public ActionResult Payment()
        {
            return View();
        }
    }
}