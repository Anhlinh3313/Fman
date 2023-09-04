using System;
namespace Core.Infrastructure.Utils
{
    public static class Util
    {
        public static bool IsNull(object value)
        {
            if (value != null && !string.IsNullOrWhiteSpace(value.ToString()))
            {
                return false;
            }
            return true;
        }

        public static bool IsInt(object value)
        {
            if (IsNull(value))
                return false;

            int data;
            return int.TryParse(value.ToString(), out data);
        }

		public static bool IsBool(object value)
		{
			if (IsNull(value))
				return false;

			bool data;
            return bool.TryParse(value.ToString(), out data);
		}

		public static bool IsDateTime(object value)
		{
			if (IsNull(value))
				return false;

            DateTime data;
            return DateTime.TryParse(value.ToString(), out data);
		}
    }
}
