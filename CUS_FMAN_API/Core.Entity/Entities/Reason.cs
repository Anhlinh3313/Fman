using System;
namespace Core.Entity.Entities
{
    public class Reason: EntitySimple
    {
        public Reason()
        {
        }

        public bool PickFail { get; set; }
        public bool PickCancel { get; set; }
        public bool PickReject { get; set; }
        public bool DeliverFail { get; set; }
        public bool DeliverCancel { get; set; }
        public bool ReturnFail { get; set; }
        public bool ReturnCancel { get; set; }
        public int ItemOrder { get; set; }
    }
}
