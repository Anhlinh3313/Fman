using Core.Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Business.ViewModels
{
    public class ServiceViewModel : SimpleViewModel<ServiceViewModel, Service>
    {
        public ServiceViewModel() { }
        public int? NUMBER_L_W_H_MULTIP { set; get; }
        public int? NUMBER_L_W_H_DIM { set; get; }

        public bool IsSub { get; set; }
        public bool IsPublish { set; get; }
        public string VSEOracleCode { get; set; }
    }
}
