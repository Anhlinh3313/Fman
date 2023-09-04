using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace Core.Infrastructure.Utils
{
    public static class FireBaseUtil
    {
        //FLASHSHIP
        //public const string BrowserAPIKey = "AAAA-1nB5Do:APA91bGkzPEGLTMKfZI0MadiXXH2z6PapzbVAUqwz-7PRs5fw6grpHJCEfE98fHMQSQTDtIKrQ6iYpakCasImuBUB5mzerm1TL8L6kV1wEv8CVOqmNPoT-yV6ss7Eze8_0Gt7spdPjlP";
        //GHBH
        //public const string BrowserAPIKey = "AAAA3jw5nvU:APA91bEmFZA0_gSFXiG0Vq8E0x-Wdz5XwB6KKBJUAolZWBym1KExgcHuMQkJz8QlTjIlR3Ij_KZ9yC8YNnVRvO-pHRmHcwFlXXUfROL7Tufmzdo_TLI09fQZ8lxjGQvK5exwy-gtb-YH";
        //vietstar
        public const string BrowserAPIKey = "AAAAWbmGpJM:APA91bEwaQRAz9cYvezoFjvEnv92kaaswkPzm1_t75fCymFE7b1laZNjqt-LXWdVVX3A3p0bLOzqw8ZfNHovkJsUS2l7nVdmJnl62VxLISetMk7Rxn44jVeKKhD4CVFANojJjyHm9d7V";
        //gsdp
        //public const string BrowserAPIKey = "AAAAclJdHxg:APA91bF3ojRfKAhDJJDw6mj1TL5U9qqEwN7y_i9LLCJAh4vFr38Auk8bhR_mLqFAU8EdPuJhsgE33BjHA97l6h2U1Jv3qR5kmtHs_p9YgaANrr-qz26SdV7Q_36KlTlFHxknvXLiNDK0";
        //delta
        //public const string BrowserAPIKey = "AAAA3jw5nvU:APA91bEmFZA0_gSFXiG0Vq8E0x-Wdz5XwB6KKBJUAolZWBym1KExgcHuMQkJz8QlTjIlR3Ij_KZ9yC8YNnVRvO-pHRmHcwFlXXUfROL7Tufmzdo_TLI09fQZ8lxjGQvK5exwy-gtb-YH";
        //Airline Express
        //public const string BrowserAPIKey = "AAAAkwOtt6Y:APA91bH1KdoDENb56QrmaSk_aa-J8uNSH5wtsgzah5YVUMnUh61LH38w9omss4YAemAg5b6CsKl_P2q9T5qF_AhI4-l0QO9-EqmZDOCUzDn79TdkkYbI2GVBS6Xoj8_mxKHuls9q72g3";
        //Vintrans
        //public const string BrowserAPIKey = "AAAA-2VAwpg:APA91bE84hyJ7tP6E6So0ErvVGW5252KCxcRd1MYklXBMxWnVKD6AYWCDxdGduVUz6OS2q1NN3wfql3YFdbJr12JcEyoO4JO4NZQqZJrO5Tymyd_ekOaN0OPevax5bo8miRnVJcFtuJu";
        //pcs
        //public const string BrowserAPIKey = "AAAAxbhGYrk:APA91bFJHd2JavDZheIF-iMkXLVtPpdsTVfORq87WCWhls4oSmVfnWDYv8TLsJccw8vUWC_RteyhpG67jbNGKCjoGcqopnn15IdWvEJDEBE1ghifVs2dh7CPen_zbBomicPoTj67TF66";
        //BE GROUP
        //public const string BrowserAPIKey = "AAAA3jw5nvU:APA91bEmFZA0_gSFXiG0Vq8E0x-Wdz5XwB6KKBJUAolZWBym1KExgcHuMQkJz8QlTjIlR3Ij_KZ9yC8YNnVRvO-pHRmHcwFlXXUfROL7Tufmzdo_TLI09fQZ8lxjGQvK5exwy-gtb-YH";

        public const string CONTENT_TYPE_JSON = "application/json";
        public const string TOPIC_NAME_REQUEST_LADING = "post";//Topic type : YÊU CẦU LẤY HÀNG

        public static bool RegisterTopic(string registerToken, int? topicId = null)
        {
            var result = false;
            string topicName = TOPIC_NAME_REQUEST_LADING;
            if (topicId.HasValue)
                topicName += "-" + topicId;

            HttpWebRequest Request = (HttpWebRequest)WebRequest.Create("https://iid.googleapis.com/iid/v1/" + registerToken + "/rel/topics/" + topicName);
            Request.Method = "POST";
            Request.KeepAlive = false;
            Request.ContentType = CONTENT_TYPE_JSON;
            Request.Headers.Add(string.Format("Authorization: key={0}", BrowserAPIKey));
            Request.ContentLength = 0;


            try
            {
                WebResponse Response = Request.GetResponse();
                HttpStatusCode ResponseCode = ((HttpWebResponse)Response).StatusCode;
                if (ResponseCode.Equals(HttpStatusCode.Unauthorized) || ResponseCode.Equals(HttpStatusCode.Forbidden))
                {
                    var text = "Unauthorized - need new token";
                }
                else if (!ResponseCode.Equals(HttpStatusCode.OK))
                {
                    var text = "Response from web service isn't OK";
                }
                else
                {
                    result = true;
                }

            }
            catch (Exception e)
            {

            }
            return result;
        }

        public static dynamic DeleteTopic(string registerToken, int? topicId = null)
        {
            var result = false;
            string topicName = TOPIC_NAME_REQUEST_LADING;
            if (topicId.HasValue)
                topicName += "-" + topicId;

            string postData = "{\"to\": \"/topics/" + topicName + "\","
                    + "\"registration_tokens\": [\"" + registerToken + "\"]"
                    + "}";
            byte[] byteArray = Encoding.UTF8.GetBytes(postData);
            HttpWebRequest Request = (HttpWebRequest)WebRequest.Create("https://iid.googleapis.com/iid/v1:batchRemove");
            Request.Method = "POST";
            Request.KeepAlive = false;
            Request.ContentType = CONTENT_TYPE_JSON;
            Request.Headers.Add(string.Format("Authorization: key={0}", BrowserAPIKey));
            Request.ContentLength = byteArray.Length;

            Stream dataStream = Request.GetRequestStream();
            dataStream.Write(byteArray, 0, byteArray.Length);
            dataStream.Close();

            try
            {
                WebResponse Response = Request.GetResponse();
                HttpStatusCode ResponseCode = ((HttpWebResponse)Response).StatusCode;
                if (ResponseCode.Equals(HttpStatusCode.Unauthorized) || ResponseCode.Equals(HttpStatusCode.Forbidden))
                {
                    var text = "Unauthorized - need new token";
                }
                else if (!ResponseCode.Equals(HttpStatusCode.OK))
                {
                    var text = "Response from web service isn't OK";
                }
                else
                {
                    result = true;
                }
            }
            catch (Exception e)
            {

            }
            return result;
        }

        public static async Task<bool> SendNotification(string token, string title, string message, int badge, object data = null, int? type = null)
        {
            if (badge > 0)
            {
                await SendFCMNotification(
                    BrowserAPIKey
                    , GetPostData(token, title, message, badge, data, type)
                    );
                return true;
            }
            else
            {
                return false;
            }
        }

        public static async Task<bool> SendNotification(string token, string message, int badge)
        {
            if (badge > 0)
            {
                await SendFCMNotification(
                    BrowserAPIKey
                    , GetPostData(token, message, badge)
                    );
                return true;
            }
            else
            {
                return false;
            }
        }

        public static string GetPostData(string registrationID, string message, int badge)
        {
            return "{\"to\":\"" + registrationID + "\"," +
                "\"priority\": \"high\"," +
                "\"content_available\":true," +
                "\"notification\":{" +
                "\"sound\": \"default\"," +
                "\"badge\": \"" + badge + "\"," +
                "\"title\": \"Thông báo\"," +
                "\"body\":\"" + message + "\"}}"
                ;
        }


        public static string GetPostData(string registrationID, string title, string message, int badge, object data = null, int? type = null)
        {
            var objStr = "";

            if (data != null)
            {
                objStr = JsonConvert.SerializeObject(data);
                dynamic obj = JsonConvert.DeserializeObject(objStr);

                if (type != null)
                {
                    obj.NotificationType = type;
                }

                objStr = JsonConvert.SerializeObject(obj);
            }

            return "{" +
                "\"to\":\"" + registrationID + "\"," +
                "\"priority\": \"high\"," +
                "\"content_available\":true," +
                "\"notification\":" +
                    "{" +
                        "\"sound\": \"default\"," +
                        "\"badge\": \"" + badge + "\"," +
                        "\"click_action\": \"FCM_PLUGIN_ACTIVITY\"," +
                        "\"title\": \"" + title + "\"," +
                        "\"body\":\"" + message + "\"" +
                    "}" +
                "\"data\":" +
                    objStr +
                "}"
                ;
        }

        public static async Task<string> SendFCMNotification(string apiKey, string postData)
        {
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri("https://fcm.googleapis.com/");

            // Add an Accept header for JSON format.
            client.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("key", "=" + apiKey);

            HttpContent content = new StringContent(
                postData
                , Encoding.UTF8
                , "application/json");

            HttpResponseMessage response = client.PostAsync("fcm/send", content).Result;

            if (response.IsSuccessStatusCode)
            {
                string sOutput = await response.Content.ReadAsStringAsync();
                return sOutput;
            }
            else
            {
                string sOutput = await response.Content.ReadAsStringAsync();
                return sOutput;
            }
        }
    }
}
