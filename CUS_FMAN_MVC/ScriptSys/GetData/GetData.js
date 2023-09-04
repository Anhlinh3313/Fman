var apiCustomer = "";
var apiPost = "";
var apiCRM = "";
var apiCore = "";
var KeyGoogle = "";
$(document).ready(function () {
    let arrDomainC = ["cus"];
    let arrDomain = ["farmtech", "localhost"];
    let hostName = location.hostname.split(".");
    let domainC = hostName.find(x => arrDomainC.includes(x));
    let domain = hostName.find(x => arrDomain.includes(x));
    var envir = {
        companyName: "",
        fullCompanyName: "",
        logo: "",
        favicon: "",
        linkWeb: "",
        logoBill: "",
        hotline: "",
        addressCompany: "",
        email: "",
        weight: "",

        UrlGoogleMaps: "https://maps.googleapis.com/maps/api/geocode/json"
    }
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');

    envir = getEnvironment(domain, domainC);

    function getEnvironment(domainName, domainCName) {
        switch (domainCName) {
            case "cusfsdn":
                switch (domainName) {
                    case "dsc":
                        //Web
                        if (document.getElementById('css_flashship_color')) {
                            document.getElementById('css_flashship_color').disabled = false;
                        }
                        //Web
                        envir.logo = "/Content/img/Logo-fman.png";
                        envir.linkWeb = "http://farmtech.vn/";
                        envir.favicon = "/Content/img/Logo-fmanvr1.png";
                        envir.weight = "KG";
                        //In Bill
                        envir.companyName = "Fman";
                        envir.fullCompanyName = "Fman - Shipper đến từ Nha Trang";
                        envir.logoBill = "/Content/img/Logo-fman.png";
                        envir.hotline = "0258 730 6899";
                        envir.addressCompany = "Tầng 2,3 34 Lê Thành Phương, Nha Trang, Khánh Hòa";
                        envir.email = "info@farmtech.vn";
                        //Api
                        apiCustomer = "http://coreapi.fman.asia/api";
                        apiPost = "http://postapi.fman.asia/api";
                        apiCRM = "http://crmapi.fman.asia/api";
                        apiCore = "http://coreapi.fman.asia/api";
                        //Script
                        KeyGoogle = " AIzaSyC_kohSP2AOdC7IMsdrHyvvtCO5IH4qmEA";
                        //
                        break;
                }
            break
            case "cus":
                switch (domainName) {
                    case "flashship":
                        //Web
                        if (document.getElementById('css_flashship_color')) {
                            document.getElementById('css_flashship_color').disabled = false;
                        }
                        //Web
                        envir.logo = "/Content/img/Logo-fman.png";
                        envir.linkWeb = "http://farmtech.vn/";
                        envir.favicon = "/Content/img/Logo-fmanvr1.png";
                        envir.weight = "KG";
                        //In Bill
                        envir.companyName = "Fman";
                        envir.fullCompanyName = "Fman - Shipper đến từ Nha Trang";
                        envir.logoBill = "/Content/img/Logo-fman.png";
                        envir.hotline = "0258 730 6899";
                        envir.addressCompany = "Tầng 2,3 34 Lê Thành Phương, Nha Trang, Khánh Hòa";
                        envir.email = "info@farmtech.vn";
                        //Api
                        apiCustomer = "http://coreapi.fman.asia/api";
                        apiPost = "http://postapi.fman.asia/api";
                        apiCRM = "http://crmapi.fman.asia/api";
                        apiCore = "http://coreapi.fman.asia/api";
                        //Script
                        KeyGoogle = " AIzaSyC_kohSP2AOdC7IMsdrHyvvtCO5IH4qmEA";
                        //
                        break;
                }
            break
            // FLASHSHIP
            default:
                if (document.getElementById('css_flashship_color')) {
                    document.getElementById('css_flashship_color').disabled = false;
                }
                //Web
                envir.logo = "/Content/img/Logo-fman.png";
                envir.linkWeb = "http://farmtech.vn/";
                envir.favicon = "/Content/img/Logo-fmanvr1.png";
                envir.weight = "KG";
                //In Bill
                envir.companyName = "Fman";
                envir.fullCompanyName = "Fman - Shipper đến từ Nha Trang";
                envir.logoBill = "/Content/img/Logo-fman.png";
                envir.hotline = "0258 730 6899";
                envir.addressCompany = "Tầng 2,3 34 Lê Thành Phương, Nha Trang, Khánh Hòa";
                envir.email = "info@farmtech.vn";
                //Api
                 apiCustomer = "http://localhost:55409/api";
                //apiCustomer = "http://coreapi.fman.asia/api";
                apiPost = "http://postapi.fman.asia/api";
                apiCRM = "http://crmapi.fman.asia/api";
                apiCore = "http://coreapi.fman.asia/api";
                //Script
                KeyGoogle = " AIzaSyC_kohSP2AOdC7IMsdrHyvvtCO5IH4qmEA";
                //
                break;// localhost
        }
        return envir;
    }
    //title
    Title.suf(envir.companyName);
    //================= Web =====================//
    //Weight
    $.cookie("Weight", envir.weight);
    if (document.getElementById("Weight")) {
        document.getElementById("Weight").innerHTML = envir.weight;
    }
    if (document.getElementsByClassName("Weight")) {
        for (var i = 0; i < document.getElementsByClassName("Weight").length; i++) {
            document.getElementsByClassName("Weight")[i].innerHTML = envir.weight;
        }
    }
    //Company
    if (document.getElementById("companyNameJS")) {
        document.getElementById("companyNameJS").innerHTML = envir.companyName;
    }
    if (document.getElementsByClassName("companyNameJS")) {
        for (var i = 0; i < document.getElementsByClassName("companyNameJS").length; i++) {
            document.getElementsByClassName("companyNameJS")[i].innerHTML = envir.companyName;
        }
    }
    //logo

    if (document.getElementById("Logo-Company")) {
        document.getElementById("Logo-Company").src = envir.logo;
    }
    if (document.getElementById("Favicon-Company-Home")) {
        document.getElementById("Favicon-Company-Home").src = envir.favicon;
    }
    //favicon
    if (document.getElementById("Favicon")) {
        document.getElementById("Favicon").href = envir.favicon;
    }

    //================= In Bill =====================//
    //logo in bill
    // if (document.getElementById("In-Bill-Logo")) {
    //     document.getElementById("In-Bill-Logo").src = envir.logoBill;
    // }
    if (document.getElementsByClassName("In-Bill-Logo")) {
        for (var i = 0; i < document.getElementsByClassName("In-Bill-Logo").length; i++) {
            document.getElementsByClassName("In-Bill-Logo")[i].src = envir.logoBill;
        }
    }
    //full companyname
    if (document.getElementById("Full-CompanyName")) {
        document.getElementById("Full-CompanyName").innerHTML = envir.fullCompanyName;
    }
    //link website
    if (document.getElementById("Link-Website")) {
        document.getElementById("Link-Website").innerHTML = envir.linkWeb;
    }
    if (document.getElementsByClassName("Link-Website")) {
        for (var i = 0; i < document.getElementsByClassName("Link-Website").length; i++) {
            document.getElementsByClassName("Link-Website")[i].href = envir.linkWeb;
        }
    }
    //Hotline
    if (document.getElementById("Hotline")) {
        document.getElementById("Hotline").innerHTML = envir.hotline;
    }
    //AddressCompany
    if (document.getElementById("AddressCompany")) {
        document.getElementById("AddressCompany").innerHTML = envir.addressCompany;
    }
    //Script Key GoogleMaps
    //script.type = 'text/javascript';
    //script.onload = function () {
    //    callFunctionFromScript();
    //}
    //script.src = envir.UrlGoogleMaps + envir.KeyGoogle;
    //head.appendChild(script);
    var token = $.cookie("token");
    if (token) {
        loadInfoCheck();
    }
});
function loadInfoCheck() {
    var token = $.cookie('token');
    $.when(sys.CallAjaxasync(apiCustomer + '/Account/GetCurrentInfo', null, token)).done(function (data) {
        if (data.isSuccess) {
            var info = data.data;
            $('.customerCode').html(info.code);
            if (document.getElementById("importLadingVT") && (info.code != "5000287" && info.code != "3833000")) {
                document.getElementById("importLadingVT").style.display = "none";
            }
        }
    });
}