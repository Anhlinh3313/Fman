using System.Web.Mvc;
using PCSWebAPP.Common;

namespace PCSWebAPP.Controllers
{
    public class CustomerController : BaseController
    {
        // GET: Customer
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult ChangePass()
        {
            return View();
        }
        public ActionResult ChangeInfo()
        {
            return View();
        }
    }
}