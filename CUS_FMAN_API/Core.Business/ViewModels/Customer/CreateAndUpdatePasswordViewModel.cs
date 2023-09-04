using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Core.Data.Core.Utils;

namespace Core.Business.ViewModels
{
    public class CreateAndUpdatePasswordViewModel
    {
        public CreateAndUpdatePasswordViewModel()
        {
        }

        public string passWordNew { get; set; }
        public string passWordOld { get; set; }
    }
}
