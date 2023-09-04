using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Core.Data.Core.Utils;

namespace Core.Business.ViewModels.General
{
    public class WardViewModel : SimpleViewModel
    {
        public WardViewModel()
        {
        }

        public int DistrictId { get; set; }
    }
}
