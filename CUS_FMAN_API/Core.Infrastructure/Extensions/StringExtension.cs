using Core.Infrastructure.Utils;
using System;
namespace Core.Infrastructure.Extensions
{
    public static class StringExtension
    {
        //public static bool EqualsIgnoreCase(this string str1, string str2)
        //{
        //    if (string.IsNullOrWhiteSpace(str1))
        //    {
        //        str1 = "";
        //    }
        //    if (!string.IsNullOrWhiteSpace(str2))
        //    {
        //        var a = str1.ToUpper().Trim().Equals(str2.ToUpper().Trim());
        //        return str1.ToUpper().Trim().Equals(str2.ToUpper().Trim());
        //    }
        //    else
        //    {
        //        var a = str1.Equals(str2);
        //        return str1.Equals(str2);
        //    }
        //}

        public static bool IsNullOrEmpty(this string str1)
        {
            if (Util.IsNull(str1))
            {
                return true;
            }
            return false;
        }
    }
}
