var COD = GetEnumCOD();
var Pack = GetEnumPack();
var Insured = GetEnumInsured();
var TypeAddlading = 0,
    TypePrice = 0;
$(document).ready(function () {
    GetCity(); GetAddress();
    //Chặn nhập chữ
    sys.blockword($(".weight"));
    sys.blockword($(".width"));
    sys.blockword($(".height"));
    sys.blockword($(".length"));
    sys.blockword($(".insured"));
    sys.blockword($(".cod"));
    sys.blockword($(".cod-amount"));
    sys.blockword($(".insured-amount"));
    sys.blockword($(".pack-amount"));
    sys.blockword($(".number-item"));
    $(".address-send-id").on("change", function (event) {
        event.preventDefault();
        var AddressID = $(".address-send-id").val();
        if (AddressID != 0) {
            $.when(sys.CallAjaxPost('/Lading/GetAddress', { AddressID: AddressID })).done(function (data) {
                if (data != null) {
                    $(".sender-name").val(data.SendName);
                    $(".sender-address").val(data.SendAddress);
                    $(".sender-phone").val(data.SendPhone);
                    $(".sender-company").val(data.SendCompany);
                    $(".sender-name").attr("readonly", "readonly");
                    $(".sender-address").attr("readonly", "readonly");
                    $(".sender-phone").attr("readonly", "readonly");
                    $(".sender-company").attr("readonly", "readonly");
                }
            });
        }
        else {
            $(".sender-name").val("");
            $(".sender-address").val("");
            $(".sender-phone").val("");
            $(".sender-company").val("");
            $(".sender-name").removeAttr("readonly");
            $(".sender-address").removeAttr("readonly");
            $(".sender-phone").removeAttr("readonly");
            $(".sender-company").removeAttr("readonly");
        }
    });
    $(".service-another label").on("click", function (event) {
        var hasCOD = 0, hasPack = 0, hasInsured = 0;
        $(".service-another input").each(function (event) {
            if ($(this).is(":checked")) {
                if ($(this).val() === COD.toString()) {
                    hasCOD = 1;
                }
                if ($(this).val() === Pack.toString()) {
                    hasPack = 1;
                }
                if ($(this).val() === Insured.toString()) {
                    hasInsured = 1;
                }
            }
        });
        if (hasCOD === 1) {
            $(".cod-detail").removeClass("display-none");
        } else {
            $(".cod-detail").addClass("display-none");
            $(".cod").val("");
            $(".cod-amount").val("");
        }
        if (hasPack === 1) {
            $(".pack-detail").removeClass("display-none");
        } else {
            $(".pack-detail").addClass("display-none");
            $(".pack-amount").val("");
        }
        if (hasInsured === 1) {
            $(".insured-detail").removeClass("display-none");
        } else {
            $(".insured-detail").addClass("display-none");
            $(".insured").val("");
            $(".insured-amount").val("");
        }
        UpdateAmount();
    });// click
    $(".cod").on("keyup", function (event) {
        sys.formatNumber($(this));
        GetCalCODPrice();
        UpdateAmount();
    });//Giá cod thay đổi
    $(".insured").on("keyup", function (event) {
        sys.formatNumber($(this));
        GetCalInsuredPrice();
        UpdateAmount();
    });//Giá khai giá thay đổi
    $(".width, .height, .length").on("change", function (event) {
        CalWeight();
        //UpdateAmount();
    });//Kích thước thay đổi
    $(".weight").on("keyup", function (event) {
        sys.formatNumber($(this));
        if (TypePrice === 0) { // chi load lai gia khi bang gia tinh theo trong luong
            UpdateAmount();
        }
    });//Cân nặng thay đổi
    $(".number-item").on("keyup", function (event) {
        sys.formatNumber($(this));
        if (TypePrice === 2) { // chi load lai gia khi bang gia tinh theo so kien
            UpdateAmount();
        }
    });//So kien thay đổi
    $(".txtMass").on("keyup", function (event) {
        if (TypePrice === 1) { // chi load lai gia khi bang gia tinh theo khoi luong
            UpdateAmount();
        }
    });//khoi luong thay đổi
    $(".on-site-delivery-price").on("change", function (event) {
        UpdateAmount();
    });//Cước phí phát tận nơi thay đổi
    $(".services .main-service").on("click", function (event) {
        var serviceId = 0, customerId = 0;
        $(".main-service").each(function () {
            if ($(this).is(':checked')) {
                serviceId = $(this).val();
                CheckOnSiteDelivery(serviceId);
                GetTypePrice(customerId, serviceId);
            }
        });
        UpdateAmount();
    });

    $(".btn-save-lading").on("click", function (event) {
        event.preventDefault();
        Save(this);
    });//Nút thêm mới click

    $(".city-send").on("change", function (event) {
        event.preventDefault();
        UpdateAmount();
    });

    $(".city-recipient").on("change", function (event) {
        event.preventDefault();
        UpdateAmount();
    });
});

//Hàm cập nhật giá
function UpdateAmount() {
    var data = GetParameter();
    sys.Loading();
    $.when(sys.CallAjaxPost("/Lading/UpdatePrice", data)).done(function (response) {
        $(".total-price").val(formatMoney(response.Amount == null ? 0 : response.Amount, 0));
        $(".AmountPriceMain").val(formatMoney(response.PriceMain == null ? 0 : response.PriceMain, 0));
        $(".AmountPPXDPrice").val(formatMoney(response.PPXDPrice == null ? 0 : response.PPXDPrice, 0));
        $(".AmountTHBBPrice").val(formatMoney(response.THBBPrice == null ? 0 : response.THBBPrice, 0));
        $(".AmountBPPrice").val(formatMoney(response.BPPrice == null ? 0 : response.BPPrice, 0));
        $(".AmountCODPrice").val(formatMoney(response.CODPrice == null ? 0 : response.CODPrice, 0));
        $(".AmountInsuredPrice").val(formatMoney(response.InsuredPrice == null ? 0 : response.InsuredPrice, 0));
        sys.HideLoading();
    });
};

//Tính giá cod
function GetCalCODPrice() {
    var cod = Number($(".cod").val().replaceAll(".", ''));
    var customerId = 0;
    $.when(sys.CallAjax("/Lading/GetCalCODPrice", { cod: cod, customerId: customerId })).done(function (data) {
        if (data !== null) {
            if (data <= 100)
                $(".cod-amount").val(formatMoney((data * cod / 100), 0));
            else
                $(".cod-amount").val(formatMoney(data, 0));
        }
    });
};

//Tính giá bảo hiểm hàng hóa khai giá
function GetCalInsuredPrice() {
    var insured = Number($(".insured").val().replaceAll(".", ''));
    var customerId = $(".sender").find("option:selected").val();
    $.when(sys.CallAjax('/Lading/GetCalInsuredPrice', { insured: insured, customerId: customerId })).done(function (data) {
        if (data !== null) {
            $(".insured-amount").val(formatMoney(data, 0));
        }
    });
};

//Tính trọng lượng
function CalWeight() {
    var width = parseInt($(".width").val().replaceAll(".", ""));
    var height = parseInt($(".height").val().replaceAll(".", ""));
    var length = parseInt($(".length").val().replaceAll(".", ""));
    var service = "";
    var mass = 0, weight = 0;
    if (width > 0 && height > 0 && length > 0) {
        mass = (width * height * length);
        $(".main-service").each(function () {
            if ($(this).is(":checked")) {
                service = $(this).attr("data-code");
            }
        });
        if (service === "TK")
            weight = (mass * 300) / 1000;
        else
            weight = mass / 6;
        weight = Number((weight).toFixed(2));
    }
    if (TypePrice === 1) //gia tinh theo khoi
        $(".weight").val(weight);
    else
        $(".txtMass").val((mass / 1000000));
};

//Hàm lấy giá trị
function GetParameter() {
    var customer = new Object();
    customer.Id = $(".Ladingid").val();
    customer.Code = $(".code").val();
    customer.PartnerCode = $(".partner-code").val();
    if ($("input.create-date").val() !== "")
        customer.CreateDate = $("input.create-date").val();
    else
        customer.CreateDate = null;
    customer.SenderId = $(".sender").find("option:selected").val();
    customer.SenderName = $(".sender-name").val();
    customer.SenderAddress = $(".sender-address").val();
    customer.SenderPhone = $(".sender-phone").val();
    customer.SenderCompany = $(".sender-company").val();
    //customer.RecipientId = $(".recipient").find("option:selected").val();
    customer.RecipientName = $(".recipient-name").val();
    customer.RecipientAddress = $(".recipient-address").val();
    customer.RecipientPhone = $(".recipient-phone").val();
    customer.RecipientCompany = $(".recipient-company").val();
    customer.Weight = Number($(".weight").val().replaceAll(".", ""));
    customer.Length = Number($(".length").val().replaceAll(".", ""));
    customer.Width = Number($(".width").val().replaceAll(".", ""));
    customer.Height = Number($(".height").val().replaceAll(".", ""));
    customer.Number = Number($(".number-item").val().replaceAll(".", ""));
    customer.Mass = Number($(".txtMass").val());
    customer.Noted = $(".noted").val();
    customer.Description = $(".description").val();
    customer.CitySendId = $(".city-send").find("option:selected").val();
    customer.CityRecipientId = $(".city-recipient").find("option:selected").val();
    customer.TypeAddlading = TypeAddlading;

    $(".main-service").each(function () {
        if ($(this).is(':checked')) {
            customer.ServiceId = $(this).val();
        }
    });
    customer.AnotherServiceId = new Array();
    $(".another-service").each(function () {
        if ($(this).parent().hasClass("checked")) {
            customer.AnotherServiceId.push($(this).val());
        }
    });
    $(".payment-type").each(function () {
        if ($(this).is(':checked')) {
            customer.PaymentId = Number($(this).val());
        }
    });
    $(".another-price").each(function () {
        if ($(this).parent().hasClass("checked")) {
            customer.AnotherPrice = "1";
            customer.THBBPrice = Number($(".AmountTHBBPrice").val().replaceAll(".", ''));
            customer.PPXDPercent = Number($(".AmountPPXDPrice").val().replaceAll(".", ''));
            customer.BPPrice = Number($(".AmountBPPrice").val().replaceAll(".", ''));
            customer.PriceMain = Number($(".AmountPriceMain").val().replaceAll(".", ''));
            customer.Amount = Number($(".total-price").val().replaceAll(".", ''));
        }
        else
            customer.AnotherPrice = "0";
    });
    $(".pack-type").each(function () {
        if ($(this).is(':checked')) {
            customer.PackId = $(this).val();
        }
    });
    customer.COD = Number($(".cod").val().replaceAll(".", ''));
    customer.CODPrice = Number($(".cod-amount").val().replaceAll(".", ''));
    customer.insured = Number($(".insured").val().replaceAll(".", ''));
    customer.InsuredPrice = Number($(".insured-amount").val().replaceAll(".", ''));
    customer.PackPrice = Number($(".pack-amount").val().replaceAll(".", ''));
    customer.OnSiteDeliveryPrice = $(".on-site-delivery-price").find("option:selected").val();
    return customer;
};

//Hàm lấy danh sách tỉnh
function GetAddress() {
    $.when(sys.CallAjax('/Lading/GetListAddress')).done(function (data) {
        if (data !== null) {
            var html = "<option value='0'>---- Địa chỉ có sẵn ----</option>";
            $.each(data, function (key, value) {
                html += "<option value='" + value.AddressID + "'>" + value.SendAddress + "</option>";
            });
            $("select.address-send-id").html(html);
            $('.select-choice.address-send-id').chosen();
            $('.select-choice.address-send-id').chosen({ allow_single_deselect: true });
        }
    });
};

//Hàm lấy danh sách tỉnh
function GetCity() {
    $.when(sys.CallAjax('/Lading/GetLocation')).done(function (data) {
        if (data !== null) {
            var html = "";
            $.each(data, function (key, value) {
                html += "<option value='" + value.LocationID + "'>" + value.Code_Local + "-" + value.LocationName + "</option>";
            });
            var htmlS = "<option value='0'>Tỉnh</option>";
            htmlS += html;
            $("select.city-recipient").html(html);
            $('.select-choice.city-recipient').chosen();
            $('.select-choice.city-recipient').chosen({ allow_single_deselect: true });

            $("select.city-send").html(html);
            $('.select-choice.city-send').chosen();
            $('.select-choice.city-send').chosen({ allow_single_deselect: true });
        }
    });
};

//Hàm lấy Enum dịch vụ gia tăng COD
function GetEnumCOD() {
    var key = null;
    $.when(sys.CallAjaxasync('/Lading/GetEnumCOD')).done(function (data) {
        if (data !== null) {
            key = data;
        }
    });
    return key;
};

//Hàm lấy Enum dịch vụ gia tăng Pack
function GetEnumPack() {
    var key = null;
    $.when(sys.CallAjaxasync('/Lading/GetEnumPack')).done(function (data) {
        if (data !== null) {
            key = data;
        }
    });
    return key;
};
//Hàm lấy Enum dịch vụ gia tăng bảo hiểm hàng hóa khai giá
function GetEnumInsured() {
    var key = null;
    $.when(sys.CallAjaxasync('/Lading/GetEnumInsured')).done(function (data) {
        if (data !== null) {
            key = data;
        }
    });
    return key;
};
//Hàm lưu vận đơn
function Save(obj) {
    var data = GetParameter();
    //Kiểm tra dữ liệu trước khi lưu
    if (data.SenderName === "") {
        sys.Alert("Cảnh Báo", "Vui Lòng Nhập Tên Người Gửi!", "Kiểm Tra");
        sys.enButon(obj);
        return;
    }
    if (data.SenderAddress === "") {
        sys.Alert("Cảnh Báo", "Vui Lòng Nhập Địa Chỉ Người Gửi!", "Kiểm Tra");
        sys.enButon(obj);
        return;
    }
    if (data.SenderPhone === "") {
        sys.Alert("Cảnh Báo", "Vui Lòng Nhập Số Điện Thoại Người Gửi!", "Kiểm Tra");
        sys.enButon(obj);
        return;
    }
    if (data.RecipientName === "") {
        sys.Alert("Cảnh Báo", "Vui Lòng Nhập Tên Người Nhận!", "Kiểm Tra");
        sys.enButon(obj);
        return;
    }
    if (data.RecipientAddress === "") {
        sys.Alert("Cảnh Báo", "Vui Lòng Nhập Địa Chỉ Người Nhận!", "Kiểm Tra");
        sys.enButon(obj);
        return;
    }
    if (data.RecipientPhone === "") {
        sys.Alert("Cảnh Báo", "Vui Lòng Nhập Số Điện Thoại Người Nhận!", "Kiểm Tra");
        sys.enButon(obj);
        return;
    }
    if (data.CitySendId <= 0) {
        sys.Alert("Cảnh Báo", "Vui Lòng Chọn Tỉnh Đi!", "Kiểm Tra");
        sys.enButon(obj);
        return;
    }
    if (data.CityRecipientId <= 0) {
        sys.Alert("Cảnh Báo", "Vui Lòng Chọn Tỉnh Đến!", "Kiểm Tra");
        sys.enButon(obj);
        return;
    }
    if (data.Weight === "") {
        sys.Alert("Cảnh Báo", "Vui Lòng Nhập Trọng Lượng!", "Kiểm Tra");
        sys.enButon(obj);
        return;
    }
    if (data.PaymentId === "") {
        sys.Alert("Cảnh Báo", "Vui Lòng Chọn Hình Thức Thanh Toán!", "Kiểm Tra");
        sys.enButon(obj);
        return;
    }
    sys.Loading();
    $.when(sys.CallAjaxPost("/Lading/SaveLading", data)).done(function (response) {
        sys.HideLoading();
        ClearForm();
        sys.SucessAlert("Lưu thành công");
        sys.OnTop();
        $('.modal-backdrop').remove();
    });
};
//Hàm xóa form
function ClearForm() {
    $(".sender-name").val("");
    $(".sender-address").val("");
    $(".sender-phone").val("");
    $(".sender-company").val("");
    $(".recipient-name").val("");
    $(".recipient-address").val("");
    $(".recipient-phone").val("");
    $(".recipient-company").val("");
    $(".weight").val("0");
    $(".length").val("0");
    $(".width").val("0");
    $(".txtMass").val("0");//insured 
    $(".insured").val("0");
    $(".insured-amount").val("0");
    $(".cod").val("0");
    $(".cod-amount").val("0");
    $(".pack-amount").val("0");
    $(".number-item").val("0");
    $(".service-another input").each(function (event) {
        $(this).removeAttr("checked")
    });
    $(".modal").fadeOut("slow");
    swal("Complete", "Thêm thành công !", "success");
    UpdateAmount();
};

//Get typePrice cua bang gia khi chon dich vu
function GetTypePrice(customerId, serviceId) {
    $.when(sys.CallAjax("/Lading/GetTypePrice", { customerId: customerId, serviceId: serviceId })).done(function (data) {
        if (TypePrice !== data) {
            if (data === 1) { //Neu TypePrice = 1 thi tinh theo khoi luong, enabel input khoi luong
                $(".weight").attr("readonly", "readonly");
                $(".txtMass ").removeAttr("readonly");
            }
            else { //Tinh theo trong luong hoac so kien, enabel input trong luong
                $(".txtMass").attr("readonly", "readonly");
                $(".weight ").removeAttr("readonly");
            }
            $(".txtMass ").val(0);
            $(".weight ").val(0);
            $(".number-item ").val(0);
            $(".length").val(0);
            $(".width ").val(0);
            $(".height ").val(0);
            TypePrice = data;
        }
        UpdateAmount();
    });
}

//Hàm kiểm tra dịch vụ có "Cước phí phát tận nơi" không
function CheckOnSiteDelivery(id) {
    $.when(sys.CallAjaxasync('/Lading/CheckOnSiteDelivery', { id: id })).done(function (data) {
        if (data !== null && data === true) {
            $(".form-on-site-delivery-price").removeClass("display-none");
        } else {
            $(".form-on-site-delivery-price").addClass("display-none");
        }
        $(".on-site-delivery-price").val(0);
        $(".on-site-delivery-price .select2-chosen").text("0 %");
    });
};