using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Core.Data.Core.Utils;

namespace Core.Business.ViewModels
{
    public class ChangePassWordViewModel : IValidatableObject
    {
        public ChangePassWordViewModel()
        {
        }

        public int Id { get; set; }
        public string CurrentPassWord { get; set; }
        public string NewPassWord { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            var validator = new ChangePassWordViewModelValidator(EntityUtil.GetUnitOfWork(validationContext));
            var result = validator.Validate(this);
            return result.Errors.Select(item => new ValidationResult(item.ErrorMessage, new[] { item.PropertyName }));
        }
    }
}
