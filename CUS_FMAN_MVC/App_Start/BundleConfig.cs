using System.Web;
using System.Web.Optimization;

namespace PCSWebAPP
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            //bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
            //            "~/Scripts/jquery.validate.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            //bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
            //            "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/js").Include(
                      "~/content/bootstrap/js/bootstrap.min.js",
                      "~/content/plugins/slimScroll/jquery.slimscroll.min.js",
                      "~/content/plugins/fastclick/fastclick.js",
                      "~/content/plugins/datepicker/bootstrap-datepicker.js",
                      "~/content/dist/js/app.min.js",
                      "~/content/chosen/js/chosen.jquery.js",
                      "~/content/chosen/js/bootstrap-multiselect.js",
                      "~/content/swal/sweetalert2.min.js",
                      "~/ScriptSys/custom.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/content/bootstrap/css/bootstrap.min.css",
                      "~/content/plugins/datepicker/datepicker3.css",
                      "~/content/font-awesome/css/font-awesome.min.css",
                      "~/content/ionicons/css/ionicons.min.css",
                      "~/content/dist/css/AdminLTE.min.css",
                      "~/content/dist/css/skins/_all-skins.min.css",
                      "~/content/chosen/css/bootstrap-chosen.css",
                      "~/content/chosen/css/bootstrap-multiselect.css",
                      "~/Content/swal/sweetalert2.min.css",
                      "~/Content/css/st-form.css",
                      "~/Content/css/scrollbar.css",
                      "~/Content/css/pagination.css",
                      "~/Content/css/custom.css"));
        }
    }
}
