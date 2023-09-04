using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.IO;
using System.Web;
using System.Drawing;
using System.Text.RegularExpressions;


namespace PCSWebAPP.Common
{
    public static class Command
    {
        public static string GetUserCookie()
        {
            var httpCookie = HttpContext.Current.Request.Cookies["cusInfo"];
            return httpCookie != null ? httpCookie["Email"] : string.Empty;
        }
        public static int CountWords(string text, string separator, int index)
        {
            var array = Regex.Split(text, separator);
            return array[index].Length;
        }

        public static string ConvertToUnSign(string text)
        {
            Regex regex = new Regex("\\p{IsCombiningDiacriticalMarks}+");
            string temp = text.Normalize(NormalizationForm.FormD);
            return regex.Replace(temp, string.Empty).Replace('\u0111', 'd').Replace('\u0110', 'D');
        }

        public static void MoveFile(string sourceFolder, string destinationFolder, string fileName)
        {
            CreateFolder(sourceFolder);
            CreateFolder(destinationFolder);

            var sourceFile = sourceFolder + "\\" + fileName;
            var destinationFile = destinationFolder + "\\" + fileName;

            if (System.IO.File.Exists(sourceFile))
            {
                System.IO.File.Move(sourceFile, destinationFile);
            }
        }

        public static void CreateFolder(string path)
        {
            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);
        }

        public static void DeleteFile(string path)
        {
            if (System.IO.File.Exists(path))
                System.IO.File.Delete(path);
        }

        public static void SaveFile(string path, string name, HttpPostedFileBase input)
        {
            CreateFolder(path);//tao thu muc neu chua co
            input.SaveAs(path + "/" + name);
        }

        public static void SaveImage(string path, string imageSave, HttpPostedFileBase filePost)
        {
            CreateFolder(path);//tao thu muc neu chua co
            Image img = Image.FromStream(filePost.InputStream);
            Bitmap bitmapMasterImage = new System.Drawing.Bitmap(img);
            bitmapMasterImage.Save(path + "/" + imageSave);
        }

        public static string GetNameImage(HttpPostedFileBase input)
        {
            string type = "." + getFormatFile(input.ContentType).ToString();
            string nameImgDefault = TextClearNormal(input.FileName.Replace(type, ""), 50) + "_" + DateTime.Now.ToString("hhmmssffMMddyy");
            return nameImgDefault + type;
        }

        public static void DeleteImage(string path, string imageFile)
        {
            string paththumb = path + "thumb\\" + imageFile;
            string pathmedium = path + "medium\\" + imageFile;
            string pathlarge = path + imageFile;
            DeleteFile(paththumb);
            DeleteFile(pathmedium);
            DeleteFile(pathlarge);
        }

        public static string getFormatFile(string contentType)
        {
            string format;
            switch (contentType)
            {
                case "image/png":
                    format = "png";
                    break;
                case "image/gif":
                    format = "gif";
                    break;
                case "application/x-shockwave-flash":
                    format = "swf";
                    break;
                default:
                    format = "jpg";
                    break;
            }
            return format;
        }
        #region resizeimage
        //public static void SaveImage(string path, string imageSave, HttpPostedFileBase filePost, string module)
        //{
        //    string paththumb = path + "thumb\\";
        //    string pathmedium = path + "medium\\";
        //    CreateFolder(path);//tao thu muc neu chua co
        //    CreateFolder(paththumb);// tao thu muc thumb neu chua co
        //    CreateFolder(pathmedium);// tao thu muc medium neu chua co
        //    Image img = Image.FromStream(filePost.InputStream);
        //    Bitmap bitmapMasterImage = new System.Drawing.Bitmap(img);
        //    Bitmap bitmapMasterImageThumb = GetThumbnail(img, module);
        //    Bitmap bitmapMasterImageMedium = GetImageMedium(img, module);
        //    Bitmap bitmapMasterImageLage = GetImageLarge(img, module);
        //    bitmapMasterImageThumb.Save(paththumb + imageSave);
        //    bitmapMasterImageMedium.Save(pathmedium + imageSave);
        //    //bitmapMasterImageLage.Save(path + imageSave);
        //    bitmapMasterImage.Save(path + imageSave);
        //}

        //public static Bitmap GetThumbnail(Image img, string module)
        //{
        //    UnitOfWork unitOfWork = new UnitOfWork();
        //    var thumbconfig = unitOfWork.ImageConfigRepository.GetImageConfigs().SingleOrDefault(a => a.Key == "thumb" && a.Module == module);
        //    int width = thumbconfig.Width ?? 0;
        //    int height = thumbconfig.Height ?? 0;
        //    if (thumbconfig.IsRatio == true)
        //    {
        //        height = (width * img.Height) / img.Width;
        //        Bitmap resizedImage = new Bitmap(img, width, height);
        //        return resizedImage;
        //    }
        //    else
        //    {
        //        //Image resizedImage = img.GetThumbnailImage(thumbconfig.Width ?? 100, thumbconfig.Height ?? 100, null, IntPtr.Zero);
        //        Bitmap resizedImage = new Bitmap(img, width, height);
        //        return resizedImage;
        //    }
        //}

        //public static Bitmap GetImageMedium(Image img, string module)
        //{
        //    UnitOfWork unitOfWork = new UnitOfWork();
        //    var mediumconfig = unitOfWork.ImageConfigRepository.GetImageConfigs().SingleOrDefault(a => a.Key == "medium" && a.Module == module);
        //    int width = mediumconfig.Width ?? 0;
        //    int height = mediumconfig.Height ?? 0;
        //    if (mediumconfig.IsRatio == true)
        //    {
        //        height = (width * img.Height) / img.Width;
        //        Bitmap resizedImage = new Bitmap(img, width, height);
        //        return resizedImage;
        //    }
        //    else
        //    {
        //        Bitmap resizedImage = new Bitmap(img, width, height);
        //        return resizedImage;
        //    }
        //}

        //public static Bitmap GetImageLarge(Image img, string module)
        //{
        //    UnitOfWork unitOfWork = new UnitOfWork();
        //    var largeconfig = unitOfWork.ImageConfigRepository.GetImageConfigs().SingleOrDefault(a => a.Key == "large" && a.Module == module);
        //    int width = largeconfig.Width ?? 0;
        //    int height = largeconfig.Height ?? 0;
        //    if (largeconfig.IsRatio == true)
        //    {
        //        height = (width * img.Height) / img.Width;
        //        Bitmap resizedImage = new Bitmap(img, width, height);
        //        return resizedImage;
        //    }
        //    else
        //    {
        //        Bitmap resizedImage = new Bitmap(img, width, height);
        //        return resizedImage;
        //    }
        //}

        #endregion

        public static string GetSiteRoot()
        {
            string port = System.Web.HttpContext.Current.Request.ServerVariables["SERVER_PORT"];
            if (port == null || port == "80" || port == "443")
                port = "";
            else
                port = ":" + port;

            string protocol = System.Web.HttpContext.Current.Request.ServerVariables["SERVER_PORT_SECURE"];
            if (protocol == null || protocol == "0")
                protocol = "http://";
            else
                protocol = "https://";

            string sOut = protocol + System.Web.HttpContext.Current.Request.ServerVariables["SERVER_NAME"] + port + System.Web.HttpContext.Current.Request.ApplicationPath;

            if (sOut.EndsWith("/"))
            {
                sOut = sOut.Substring(0, sOut.Length - 1);
            }

            return sOut;
        }

        public static string toFriendly(string title, int maxLength)//bo dau
        {

            string titleUni = toFriendly1(title);
            var match = Regex.Match(titleUni.ToLower(), "[\\w]+");
            StringBuilder result = new StringBuilder("");
            bool maxLengthHit = false;
            while (match.Success && !maxLengthHit)
            {
                if (result.Length + match.Value.Length <= maxLength)
                {
                    result.Append(match.Value + "-");
                }
                else
                {
                    maxLengthHit = true;
                    // Handle a situation where there is only one word and it is greater than the max length.
                    if (result.Length == 0) result.Append(match.Value.Substring(0, maxLength));
                }
                match = match.NextMatch();
            }
            // Remove trailing '-'
            if (result[result.Length - 1] == '-') result.Remove(result.Length - 1, 1);
            return result.ToString();
        }

        public static string toFriendly1(string ip_str_change)//bo dau
        {
            Regex v_reg_regex = new Regex("\\p{IsCombiningDiacriticalMarks}+");
            string v_str_FormD = ip_str_change.Normalize(NormalizationForm.FormD);
            v_str_FormD = v_str_FormD.Replace(",", "-");
            v_str_FormD = v_str_FormD.Replace(" ", "-");
            v_str_FormD = v_str_FormD.Replace("--", "-");
            return v_reg_regex.Replace(v_str_FormD, string.Empty).Replace('\u0111', 'd').Replace('\u0110', 'D').ToLower();
        }

        public static string toFriendlyForsearch(string ip_str_change)//bo dau
        {
            Regex v_reg_regex = new Regex("\\p{IsCombiningDiacriticalMarks}+");
            string v_str_FormD = ip_str_change.Normalize(NormalizationForm.FormD);
            return v_reg_regex.Replace(v_str_FormD, string.Empty).Replace('\u0111', 'd').Replace('\u0110', 'D').ToLower();
        }

        public static int PageTotal(int total, int size)
        {
            int result = 0;
            result = total / size;
            if (total % size > 0)
                result += 1;
            return result;
        }

        public static string TextClear(string text, int length)
        {
            if (!string.IsNullOrEmpty(text) && text.Length > length)
            {
                string cutString = text.Substring(0, length);
                var array = Regex.Split(cutString.Trim(), "\\s+").ToList();
                array.RemoveAt(array.Count() - 1);

                return string.Join(" ", array) + "...";
            }
            else
            {
                return text;
            }
        }
        public static string TextClearNormal(string text, int length)
        {
            string result = "";
            if (text != null && text.Length > length)
            {
                result = text;
                int l = text.Length;
                if (l > length)
                    result = text.Substring(0, length);
            }
            else
            {
                result = text;
            }
            return result;
        }

        //public static void SendEmail(EmailModel model)
        //{
        //    var configSSl = false;
        //    if (model.Host.Contains("gmail"))
        //    {
        //        configSSl = true;
        //    }
        //    var fromAddress = new MailAddress(model.EmailFrom);
        //    var toAddress = new MailAddress(model.EmailTo);
        //    //send mail to customer
        //    var smtp = new SmtpClient
        //    {
        //        Host = model.Host,
        //        Port = model.Port,
        //        EnableSsl = configSSl,
        //        DeliveryMethod = SmtpDeliveryMethod.Network,
        //        UseDefaultCredentials = true,
        //        Credentials = new NetworkCredential(fromAddress.Address, model.PasswordEmailFrom)
        //    };
        //    MvcHtmlString string2Html = MvcHtmlString.Create(model.EmailBody);
        //    using (var message = new MailMessage(fromAddress, toAddress)
        //    {
        //        Subject = model.EmailSubject,
        //        Body = string2Html.ToHtmlString(),
        //        IsBodyHtml = true
        //    })
        //        try
        //        {
        //            smtp.Send(message);
        //        }
        //        catch (Exception ex)
        //        {
        //            return;
        //        }
        //}

        public static string RandomCharecter()
        {
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            var result = new string(
                Enumerable.Repeat(chars, 8)
                          .Select(s => s[random.Next(s.Length)])
                          .ToArray());
            return result;
        }
        

        public static string ConvertCurrency(string price)
        {
            var length = price.Length;
            if (!string.IsNullOrEmpty(price))
            {
                if (price.Equals("0"))
                {
                    return "Thỏa thuận";
                }
                else if (length > 6 && length <= 9)
                {
                    var result = Double.Parse(price) / 1000000;
                    return string.Format("{0}{1}", result, " triệu");
                }
                else if (length > 9)
                {
                    var result = Double.Parse(price) / 1000000000;
                    return string.Format("{0}{1}", result, " tỷ");
                }
                return string.Format("{0}{1}", Double.Parse(price).ToString("#,###"), " đ");
            }
            return "Thỏa thuận";
        }

        public static string ConvertYoutube(string videoLink)
        {
            string result = videoLink.Substring(videoLink.LastIndexOf("/watch?v=") + 9);
            return string.Format("//www.youtube.com/embed/{0}", result);
        }      
    }

   
}