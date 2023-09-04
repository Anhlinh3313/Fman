using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PCSWebAPP.Controllers
{
    public class HomeController : BaseController
    {

        public ActionResult Index()
        {
            return View();
        }
        public ActionResult TermAndCondition()
        {
            return View();
        }
        public ActionResult CreateGuid()
        {
            return View();
        }
        #region Tài khoản khách hàng
        public ActionResult Login()
        {
            return View();
        }

        public PartialViewResult LoginFrame()
        {
            return PartialView();
        }

        public PartialViewResult CustomerPartial()
        {
            return PartialView("_LoginPartial");
        }
        public ActionResult Register()
        {
            return View();
        }
        public ActionResult ForgotPassword()
        {
            return View();
        }
        public ActionResult ConfirmPassword(string id, string code)
        {
            if (!string.IsNullOrEmpty(id) && !string.IsNullOrEmpty(code))
            {
                ViewBag.id = id;
                ViewBag.code = code;
                return View();
            }
            return new HttpNotFoundResult();
        }

        public ActionResult SendMailComplete()
        {
            return View();
        }
        #endregion Tài khoản khách hàng
    }
}