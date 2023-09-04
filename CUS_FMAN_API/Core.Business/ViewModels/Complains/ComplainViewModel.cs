using Core.Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Business.ViewModels
{
    public class ComplainViewModel : EntitySimple
    {
        public ComplainViewModel() { }

        public bool IsView { get; set; }
        public bool IsDelete { get; set; }
        public int ShipmentId { get; set; }
        public int CustomerId { get; set; }
        public int ComplainTypeId { get; set; }
        public int ComplainStatusId { get; set; }
        public string ComplainContent { get; set; }
        public string ComplainImagePath { get; set; }
        public DateTime? EndDate { get; set; }
        public int? HandlingEmpId { get; set; }
        public int? HandlingHubId { get; set; }
        public int? ForwardToEmpId { get; set; }
        public int? ForwardToHubId { get; set; }
    }
}
