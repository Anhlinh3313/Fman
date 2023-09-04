using System;
using System.ComponentModel.DataAnnotations.Schema;
using Core.Entity.Abstract;

namespace Core.Entity.Entities
{
    [Table("Core_HubRouting")]
    public class HubRouting : EntitySimple
    {
        public HubRouting()
        {
        }

        public int HubId { get; set; }
        public int? UserId { get; set; }

        public virtual User User { get; set; }
        public virtual Hub Hub { get; set; }
    }
}
