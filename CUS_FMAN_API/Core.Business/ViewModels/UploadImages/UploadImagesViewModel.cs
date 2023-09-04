using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Business.ViewModels.UploadImages
{
    public class UploadImagesViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public int ShipmentId { get; set; }
        public string PathImage { get; set; }

        public UploadImagesViewModel()
        {
        }
    }
}
