using System;
namespace Core.Business.ViewModels
{
    public class GetByIdsViewModel
    {
        public GetByIdsViewModel()
        {
        }

        public int[] Ids { get; set; }
        public string Cols { get; set; }
    }
}
