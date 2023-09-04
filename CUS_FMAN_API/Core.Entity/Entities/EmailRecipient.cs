using System;
namespace Core.Entity.Entities
{
    public class EmailRecipient
    {
        public EmailRecipient(int id, string email, string name, string codeResetPassWord)
        {
            Id = id;
            Email = email;
            Name = name;
            CodeResetPassWord = codeResetPassWord;
        }

        public int Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string CodeResetPassWord { get; set; }
    }
}
