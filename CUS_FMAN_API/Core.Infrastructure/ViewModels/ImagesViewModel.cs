using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Infrastructure.ViewModels
{
    public class ImagesViewModel
    {
        public ImagesViewModel()
        {
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public int ShipmentId { get; set; }
        public string PathImage { get; set; }
    }
}
