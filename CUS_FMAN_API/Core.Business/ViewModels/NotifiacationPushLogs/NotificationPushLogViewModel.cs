using Core.Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Business.ViewModels.NotifiacationPusgLogs
{
    public class NotificationPushLogViewModel : EntityBasic
    {
        public int BikerId { get; set; }
        public int AnswerStatusId { get; set; }
        public string Message { get; set; }
        public string TempCode { get; set; }
    }
}
