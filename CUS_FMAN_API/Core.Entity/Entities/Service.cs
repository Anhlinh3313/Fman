using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Entity.Entities
{
    public class Service : EntitySimple
    {
        public Service() { }

        public bool IsPublish { set; get; }
        public bool IsSub { get; set; }
        public string VSEOracleCode { get; set; }
    }
}
