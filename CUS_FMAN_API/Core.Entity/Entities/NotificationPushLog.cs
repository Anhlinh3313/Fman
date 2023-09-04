using System;
namespace Core.Entity.Entities
{
    public class NotificationPushLog : EntityBasic
    {
        public int? BikerId { get; set; }
        public int? AnswerStatusId { get; set; }
        public string Message { get; set; }
        public string TempCode { get; set; }
    }
}
