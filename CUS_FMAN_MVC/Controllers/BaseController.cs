using System.Web.Mvc;

namespace PCSWebAPP.Controllers
{
    public class BaseController : Controller
    {
        #region Custruction
        // chan login
        #endregion
        // GET: Base
        protected override void ExecuteCore()
        {
            base.executecore();
        }

        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            //if (Request.Cookies["cusInfo"] == null)
            //{
            //    Response.Redirect("/dang-nhap.html");
            //}
        }
        protected override bool DisableAsyncSupport
        {
            get
            {
                return true;
            }
        }
    }
}