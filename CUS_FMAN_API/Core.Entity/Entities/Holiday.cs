using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Entity.Entities
{
    public class Holiday : EntitySimple
    {
        public Holiday() { }

        public DateTime Date { get; set; }
    }
}
