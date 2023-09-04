var apiCustomer = "";

$(document).ready(function () {
    let arrDomain = ["tasetco", "pcspost", "vintrans", "shipnhanh", "vietstarexpress","flashship","localhost"];
    let hostName = location.hostname.split(".");
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
        email:"",
    }
    //var js_file = document.createElement('script');
    //js_file.type = 'text/javascript';
    //js_file.async = 'async';
    //document.getElementsByTagName('head')[0].appendChild(js_file);

    envir = getEnvironment(domain);

    function getEnvironment(domainName) {
        switch (domainName) {
            // TASETCO
            case "tasetco":
                //Web
                envir.logo = "/Content/img/tasetco.png";
                envir.logoBill = "http://dsc.vn/images/clients/tasetco.png";
                envir.favicon = "/Content/img/tasetco.ico";
                //In bill
                envir.companyName = "TASETCO";
                envir.fullCompanyName = "CTY CPTM VÀ DV CHUYỂN PHÁT NHANH TÂN SƠN NHẤT";
                envir.hotline = "(028) 35 472 472 | (028) 35 472 212";
                envir.addressCompany = "20F Lam Sơn, P. 2, Q. Tân Bình, TP. HCM.";
                envir.linkWeb = "http://tansonnhat.vn";
                //Api
                apiCustomer = "http://cusapi.tasetco.com.vn/api";
                break;
            // PCSPOST
            case "pcspost":
                //Web
                envir.logo = "/Content/img/pcspost.png";
                envir.logoBill = "/Content/img/pcspost.png";
                envir.favicon = "/Content/img/pcspost.ico";
                //In bill
                envir.companyName = "PCSPOST";
                envir.fullCompanyName = "Công ty Cổ phần giao nhận hàng hóa PCS";
                envir.hotline = " (84)-24-3547 4913";
                envir.addressCompany = "Tầng 6, Tòa nhà 25T1, Đường Trần Duy Hưng, Quận Cầu Giấy, Hà Nội";
                envir.linkWeb = "http://pcspost.vn";
                //Api
                apiCustomer = "http://cusapi.pcspost.vn/api";
                break;
            // VINTRANS
            case "vintrans":
                //Web
                envir.logo = "/Content/img/vintrans.png";
                envir.logoBill = "/Content/img/vintrans.png";
                envir.favicon = "/Content/img/vintrans.ico";
                //In bill
                envir.companyName = "VINTRANS";
                envir.fullCompanyName = "CÔNG TY CP VẬN TẢI BƯU CHÍNH VIỆT NAM";
                envir.hotline = "028. 38 479 479";
                envir.addressCompany = "Số 6 Pham Van hai Str, Ward 2, Tan Binh Dist, HCM";
                envir.linkWeb = "http://vintrans.com.vn";
                //Api
                apiCustomer = "http://cusapi.vintrans.com.vn/api";
                break;
            // SHIPNHANH
            case "shipnhanh":
                //Web
                envir.logo = "/Content/img/shipnhanh.png";
                envir.logoBill = "/Content/img/shipnhanh.png";
                envir.favicon = "/Content/img/shipnhanh.ico";
                //In bill
                envir.companyName = "SHIPNHANH";
                envir.fullCompanyName = "CÔNG TY CỔ PHẦN CPN NAM BẮC";
                envir.hotline = "093 785 1155 | 0243.785.1155";
                envir.addressCompany = "Toà nhà Golden West, 2 Lê Văn Thiêm, Q.Thanh Xuân, Hà Nội";
                envir.linkWeb = "http://shipnhanh.vn";
                envir.email = "support@shipnhanh.vn";
                //Api
                apiCustomer = "http://cusapi.shipnhanh.vn/api";
                break;
            // VIETSTAREXPRESS
            case "vietstarexpress":
                //Web
                envir.logo = "/Content/img/vietstarexpress.png";
                envir.logoBill = "/Content/img/vietstarexpress.png";
                envir.favicon = "/Content/img/vietstarexpress.ico";
                //In bill
                envir.companyName = "VIETSTAREXPRESS";
                envir.fullCompanyName = "Công ty Cổ Phần Chuyển Phát Nhanh Vietstar";
                envir.hotline = "0989 19 88888";
                envir.addressCompany = "28 Phan Thúc Duyện, phường 4, quận Tân Bình, TP. Hồ Chí Minh";
                envir.linkWeb = "http://vietstarexpress.net";
                envir.email = "";
                //Api
                apiCustomer = "http://cusapi.vietstarexpress.net/api";
                break;
            // localhost
            case "localhost":
                //Web
                envir.logo = "http://www.dsc.vn/images/sidebar-logo.png";
                envir.linkWeb = "http://dsc.vn";
                envir.favicon = "http://dsc.vn/favicon.ico";
                //In Bill
                envir.companyName = "DSC";
                envir.fullCompanyName = "DIGITAL SYSTEMS CO., LTD INTRODUCTION";
                envir.logoBill = "http://www.dsc.vn/images/sidebar-logo.png";
                envir.hotline = "+84.909.824.462";
                envir.addressCompany = "Park 6B 3606, Vinhome Central Park, Nguyen Huu Canh, Binh Thanh D. , HCMC";
                //Api
                //apiCustomer = "http://cusapi.flashship.vn/api";
                apiCustomer = "http://localhost:55408/api";
                //
                //js_file.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCfqPJqJnthPCSdgAs4pn1Gcc5RZrElg3U&sensor=false&amp;libraries=places';
                //
                break;
            // FLASHSHIP
            default:
                //Web
                envir.logo = "http://www.dsc.vn/images/sidebar-logo.png";
                envir.linkWeb = "http://dsc.vn";
                envir.favicon = "http://dsc.vn/favicon.ico";
                //In Bill
                envir.companyName = "DSC";
                envir.fullCompanyName = "DIGITAL SYSTEMS CO., LTD INTRODUCTION";
                envir.logoBill = "http://www.dsc.vn/images/sidebar-logo.png";
                envir.hotline = "+84.909.824.462";
                envir.addressCompany = "Park 6B 3606, Vinhome Central Park, Nguyen Huu Canh, Binh Thanh D. , HCMC";
                //Api
                apiCustomer = "http://cusapi.flashship.vn/api";
                //apiCustomer = "http://localhost:55408/api";
                //
                //js_file.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCkR-wl8rYwyb5XhvinbcfZOuFsRV2IFDo&sensor=false&amp;libraries=places';
                //
                break;
        }
        return envir;
    }
    //title
    Title.suf(envir.companyName);
    //================= Web =====================//
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
    if (document.getElementById("In-Bill-Logo")) {
        document.getElementById("In-Bill-Logo").src = envir.logoBill;
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
})