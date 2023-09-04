using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(PCSWebAPP.Startup))]
namespace PCSWebAPP
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
