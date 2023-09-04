var token;
var latFrom = 0;
var lngFrom = 0;
var hubSenderId = 0;
var wardSenderId = 0;
var districtSenderId = 0;
var citySenderId = 0;
var senderName, senderPhone, senderAddress, senderCompany;
var priceDVGTs = [];
var paramSender = {}

$(document).ready(function () {
    token = $.cookie('token');
    loadInfo();
    $('.form-edit-cell .edit-cancel').on('click', function () {
        $('.form-edit-cell .edit-text').val('');
        $('.form-edit-cell').hide();
        $('.edit-triangle').hide();
        $('table.data-excel > tbody > tr > td.active-edit').focus();
        $('table.data-excel > tbody > tr > td').removeClass('active-edit');
    });
    $(".btn_save").on("click", function () {
        event.preventDefault();
        SaveExcel();
        showAddress();
    });//Nút thêm excel
    $(".btn_clear").on("click", function () {
        $('#upload_excel').val(null);
        $("table.data-excel").empty();
        showAddress();
    });//Nút thêm excel
    _selectAddress();
    $(".address-select").on('change', function () {
        _selectAddress();
    });
    $('#upload_excel').on('change', function () {
        showAddress();
    })
    var showAddress = function () {
        if ($('#upload_excel').val()) {
            $(".address-select").prop("disabled", true).trigger("chosen:updated");
        } else {
            $(".address-select").prop("disabled", false).trigger("chosen:updated");
        }
    }
});
//Hàm lưu file excel
function SaveExcel() {
    sys.Loading();
    if ($('table.data-excel > tbody > tr.ms-error')[0]) {
        $(".message_error").html("Danh sách thông tin đơn hàng lỗi, vui lòng kiểm tra lại!");
        $(".message_error").slideDown(1000).delay(5000).slideUp('slow');
        sys.HideLoading();
        return false;
    } else {
        var elem = document.getElementById("myBar");
        var countSuccess = 0, count = 0, ladingError = "";
        var data_table = $('table.data-excel > tbody');
        var rows = $('tr', data_table);
        var countRows = rows.length - 1;
        if (rows.length == 0) {
            $(".message_error").html("Danh sách thông tin đơn trống, vui lòng kiểm tra lại!");
            $(".message_error").slideDown(1000).delay(5000).slideUp('slow');
            sys.HideLoading();
        }
        $(rows).each(async function (index, row) {
            if (index > 0) {
                var phantram = 0;
                var id;
                var item = GetLadingModel(row);
                if (item.PaymentTypeId == undefined) {
                    $(".message_error").html("Sai hình thức thanh toán!");
                    $(".message_error").slideDown(1000).delay(5000).slideUp('slow');
                    sys.HideLoading();
                    return;
                }
                await $.when(sys.CallAjaxPostasync(apiCustomer + "/shipment/Create", item, token)).done(function (data) {
                    count++;
                    if (data.isSuccess) {
                        countSuccess++;
                    } else {
                        ladingError += (index + 1) + ', ';
                    }
                    if (count + 1 == $(rows).length) {
                        if (count > 0) {
                            sys.HideLoading();
                            if (ladingError != "") {
                                $(".message_error").html('Upload thành công ' + countSuccess + ' đơn hàng / tổng ' + count + ' đơn hàng,' + 'upload không thành công ' + ladingError);
                                $(".message_error").show();

                            }
                            else {
                                $(".message_success").html('Upload thành công ' + countSuccess + ' đơn hàng / tổng ' + count + ' đơn hàng.');
                                $(".message_success").show();
                            }
                            $("table.data-excel").empty();

                            //sys.HideLoading();
                            $('.btn_save').removeClass('display-none');
                            $('.btn-file').removeClass('display-none');
                            $('#upload_excel').val(null);
                        } else {
                            $(".message_error").html("Vui lòng upload file(excel) thông tin đơn hàng cần thêm!");
                            $(".message_error").slideDown(1000).delay(5000).slideUp('slow');
                            sys.HideLoading();
                        }
                    }
                });
                sys.HideLoading();
                $('#upload_excel').val(null);
            }
        });
    }
};

async function calculator(row) {
    var lading = GetCalculatorModel(row);
    priceDVGTs = [];
    var $col_price = $(row).find('td[aria-describedby="grid-excel_price"]');
    await $.when(sys.CallAjaxPostasync(apiCustomer + "/price/Calculate", lading, token)).done(function (data) {
        if (data.isSuccess) {
            var result = data.data;
            $(row).attr('PriceMain', formatMoney(result.defaultPrice, 0));
            $(row).attr('DefaultPriceP', formatMoney(result.defaultPriceP, 0));
            $(row).attr('DefaultPriceS', formatMoney(result.defaultPriceS, 0));
            $(row).attr('PriceOther', formatMoney(result.otherPrice, 0));
            $(row).attr('PPXDPrice', formatMoney(result.fuelPrice, 0));
            $(row).attr('PriceFar', formatMoney(result.remoteAreasPrice, 0));
            $(row).attr('VAT', formatMoney(result.vatPrice, 0));
            $(row).attr('TotalDVGT', formatMoney(result.totalDVGT, 0));
            $(row).attr('Amount', formatMoney(result.totalPrice, 0));
            $col_price.html((formatMoney(result.totalPrice, 0)));
            priceDVGTs = result.priceDVGTs
            validation_row(row);
        } else {
            $(row).attr('PriceMain', 0);
            $(row).attr('DefaultPriceP', 0);
            $(row).attr('DefaultPriceS', 0);
            $(row).attr('PriceOther', 0);
            $(row).attr('PPXDPrice', 0);
            $(row).attr('PriceFar', 0);
            $(row).attr('VAT', 0);
            $(row).attr('TotalDVGT', 0);
            $(row).attr('Amount', 0);
            $col_price.html(0);
            validation_row(row);
        }
    });
}

function GetCalculatorModel(row) {
    var lading = new Object();
    var $col_service = $(row).find('td[aria-describedby="grid-excel_service"]');
    var $col_address_to = $(row).find('td[aria-describedby="grid-excel_address_to"]');
    var $col_district_to = $(row).find('td[aria-describedby="grid-excel_district_to"]');
    var $col_weight = $(row).find('td[aria-describedby="grid-excel_weight"]');
    var $col_box = $(row).find('td[aria-describedby="grid-excel_box"]');
    var $col_cod = $(row).find('td[aria-describedby="grid-excel_cod"]');
    var $col_order_date = $(row).find('td[aria-describedby="grid-excel_order_date"]');
    var $col_insured = $(row).find('td[aria-describedby="grid-excel_insured"]');

    lading.orderDate = $col_order_date.html() ? $col_order_date.html() : sys.formatDateTimeSQL(new Date());

    lading.SenderId = $.cookie('userId');
    //lading.fromProvinceId = citySenderId;
    lading.fromProvinceId = paramSender.fromProvinceId;
    lading.fromDistrictId = paramSender.fromDistrictId;
    //lading.fromDistrictId = districtSenderId;
    lading.ServiceId = $col_service.attr('service_id');
    lading.StructureId = 7;
    lading.toDistrictId = !isNaN($col_district_to.attr('district_id')) && $col_district_to.attr('district_id') != 0 ? $col_district_to.attr('district_id') : $col_address_to.attr('district_id');
    lading.Weight = $col_weight.html();
    lading.totalBox = $col_box.html();
    lading.Width = 0;
    lading.Height = 0;
    lading.Length = 0;
    lading.IsTruckdelivery = null;
    lading.COD = $col_cod.html().replace(/\./g, '').replace(/\,/g, '.');
    lading.Insured = $col_insured.html().replace(/\./g, '').replace(/\,/g, '.');

    return lading;
}

//Change Select Address
function _selectAddress() {
    paramSender = {}
    var data = JSON.stringify($(".address-select").val());
    var dataPar = JSON.parse(JSON.parse(data));

    var senderName = dataPar.representativeName ? dataPar.representativeName : dataPar.name;
    var phonenumber = dataPar.phoneNumber;
    var provinceid = dataPar.provinceId;
    var districtid = dataPar.districtId;
    var wardid = dataPar.wardId;
    var address = dataPar.address;
    var company = dataPar.nameEn ? dataPar.nameEn : null;
    var hubId = null;
    var lat = dataPar.lat;
    var lng = dataPar.lng;

    paramSender.senderName = senderName;
    paramSender.senderPhone = phonenumber;
    paramSender.senderAddress = address;
    paramSender.fromWardId = wardid;
    paramSender.fromDistrictId = districtid;
    paramSender.fromProvinceId = provinceid;
    paramSender.pickingAddress = address;
    paramSender.company = company;
    paramSender.latFrom = lat;
    paramSender.lngFrom = lng;
    paramSender.currentLat = lat
    paramSender.currentLng = lng
    paramSender.location = address
    $.when(sys.CallAjaxasync(apiCustomer + '/hub/GetHubByWardId', { wardId: wardSenderId }, token)).done(function (dataH) {
        if (dataH.isSuccess && dataH.data != null) {
            var hub = dataH.data
            hubId = hub.id
        }
    })
    paramSender.fromHubId = hubId ? hubId : null;
    paramSender.currentHubId = hubId ? hubId : null;
}
function GetLadingModel(row) {
    var order_DateTime;
    var lading = new Object();
    var $col_name_from = $(row).find('td[aria-describedby="grid-excel_name_from"]');
    var $col_phone_from = $(row).find('td[aria-describedby="grid-excel_phone_from"]');
    var $col_address_from = $(row).find('td[aria-describedby="grid-excel_address_from"]');
    var $col_number_code = $(row).find('td[aria-describedby="grid-excel_shipment_number"]');
    var $col_order_date = $(row).find('td[aria-describedby="grid-excel_order_date"]');
    var $col_cus_code_to = $(row).find('td[aria-describedby="grid-excel_cus_code_to"]');
    var $col_name_to = $(row).find('td[aria-describedby="grid-excel_name_to"]');
    var $col_phone_to = $(row).find('td[aria-describedby="grid-excel_phone_to"]');
    var $col_address_to = $(row).find('td[aria-describedby="grid-excel_address_to"]');
    var $col_province_to = $(row).find('td[aria-describedby="grid-excel_province_to"]');
    var $col_district_to = $(row).find('td[aria-describedby="grid-excel_district_to"]');
    var $col_ward_to = $(row).find('td[aria-describedby="grid-excel_ward_to"]');
    var $col_address_note_to = $(row).find('td[aria-describedby="grid-excel_address_note_to"]');
    var $col_company_to = $(row).find('td[aria-describedby="grid-excel_company_to"]');
    var $col_shop_code = $(row).find('td[aria-describedby="grid-excel_shop_code"]');
    var $col_cod = $(row).find('td[aria-describedby="grid-excel_cod"]');
    var $col_insured = $(row).find('td[aria-describedby="grid-excel_insured"]');
    var $col_weight = $(row).find('td[aria-describedby="grid-excel_weight"]');
    var $col_box = $(row).find('td[aria-describedby="grid-excel_box"]');
    var $col_service = $(row).find('td[aria-describedby="grid-excel_service"]');
    var $col_type_pay = $(row).find('td[aria-describedby="grid-excel_type_pay"]');
    var $col_content = $(row).find('td[aria-describedby="grid-excel_content"]');
    var $col_note = $(row).find('td[aria-describedby="grid-excel_note"]');
    var $col_truck_delivery = $(row).find('td[aria-describedby="grid-excel_truck_delivery"]');
    //
    if ($col_order_date.html()) {
        order_DateTime = new Date($col_order_date.html());
    } else {
        order_DateTime = null;
    }

    lading.orderDate = sys.formatDateTimeSQL(new Date())

    lading.SenderId = $.cookie('userId');
    lading.CusCodeTo = $col_cus_code_to.html();
    if ($col_number_code.html() !== "" && $col_number_code.html() !== null && $col_number_code.html() !== '&nbsp;') {
        lading.shipmentNumber = $col_number_code.html();
    }
    // Sender
    //paramSender.senderName = senderName;
    //paramSender.senderPhone = phonenumber;
    //paramSender.senderAddress = address;
    //paramSender.fromWardId = wardid;
    //paramSender.fromDistrictId = districtid;
    //paramSender.fromProvinceId = provinceid;
    //paramSender.pickingAddress = address;
    //paramSender.company = company;
    //paramSender.latFrom = lat;
    //paramSender.lngFrom = lng;
    //paramSender.currentLat = lat
    //paramSender.currentLng = lng
    //paramSender.location = address
    //paramSender.fromHubId = hubId ? hubId : null;
    //paramSender.currentHubId = hubId ? hubId : null;
    //
    lading.senderName = paramSender.senderName;
    lading.senderPhone = paramSender.senderPhone;
    lading.pickingAddress = paramSender.pickingAddress;
    lading.fromProvinceId = paramSender.fromProvinceId;
    lading.FromDistrictId = paramSender.fromDistrictId;
    lading.fromWardId = paramSender.fromWardId;
    lading.companyFrom = paramSender.company;
    lading.fromHubId = paramSender.fromHubId;
    lading.currentHubId = paramSender.fromHubId;
    lading.LatFrom = paramSender.latFrom;
    lading.LngFrom = paramSender.lngFrom;
    //
    lading.receiverName = $col_name_to.html();
    lading.shippingAddress = $col_address_to.html();
    lading.addressNoteTo = $col_address_note_to.html();
    lading.receiverPhone = $col_phone_to.html();
    lading.companyTo = $col_company_to.html();
    lading.shopCode = $col_shop_code.html();
    //lading.CompanyTo = value.$CompanyTo.val();
    //lading.CityRecipientId = $col_address_to.attr('state_id');
    //lading.toProvinceId = $col_province_to.attr('province_id') != 0 && $col_province_to.attr('province_id') ? $col_province_to.attr('province_id') : ($col_address_to.attr('state_id') != 0 ? $col_address_to.attr('state_id') : null);
    //lading.toDistrictId = $col_district_to.attr('district_id') != 0 && $col_province_to.attr('district_id') ? $col_district_to.attr('district_id') : ($col_address_to.attr('district_id') != 0 ? $col_address_to.attr('district_id') : null);
    //lading.toWardId = $col_ward_to.attr('ward_id') != 0 && $col_ward_to.attr('ward_id') ? $col_ward_to.attr('ward_id') : ();

    if ($col_province_to.attr('province_id') == 0) {
        lading.toProvinceId = $col_address_to.attr('state_id') ? $col_address_to.attr('state_id') : null
    } else {
        lading.toProvinceId = $col_province_to.attr('province_id') ? $col_province_to.attr('province_id') : null
    }
    if ($col_district_to.attr('district_id') == 0) {
        lading.toDistrictId = $col_address_to.attr('district_id') != 0 ? $col_address_to.attr('district_id') : null
    } else {
        lading.toDistrictId = $col_district_to.attr('district_id') ? $col_district_to.attr('district_id') : null
    }
    if ($col_ward_to.attr('ward_id') == 0) {
        lading.toWardId = $col_address_to.attr('ward_id') != 0 ? $col_address_to.attr('ward_id') : null
    } else {
        lading.toWardId = $col_ward_to.attr('ward_id') ? $col_ward_to.attr('ward_id') : null
    }
    if ($col_province_to.attr('hub_id') == 0) {
        lading.toHubId = $col_address_to.attr('hub_id') != 0 ? $col_address_to.attr('hub_id') : null
    } else {
        lading.toHubId = $col_province_to.attr('hub_id') ? $col_province_to.attr('hub_id') : null
    }

    //lading.toHubId = $col_province_to.attr('hub_id') != 0 ? $col_province_to.attr('hub_id') : $col_address_to.attr('hub_id');
    lading.LatTo = $col_address_to.attr('lat');
    lading.LngTo = $col_address_to.attr('lng');
    lading.Width = 0;
    lading.Height = 0;
    lading.Length = 0;
    //  lading.RouteLength = ladingModel.RouteLength;
    lading.Weight = $col_weight.html().replace(/\./g, ',').replace(/\,/g, '.');
    lading.totalBox = $col_box.html().replace(/\./g, ',').replace(/\,/g, '.');
    lading.cusNote = $col_note.html();
    lading.Content = $col_content.html();
    lading.ServiceId = $col_service.attr('service_id');
    if ($col_type_pay.attr('type_pay_id') == undefined) {
        lading.PaymentTypeId = null;
    }
    else {
        lading.PaymentTypeId = $col_type_pay.attr('type_pay_id');
    }
    lading.priceDVGTs = priceDVGTs;
    lading.Insured = 0;
    lading.COD = $col_cod.html().replace(/\./g, '').replace(/\,/g, '.');
    lading.insured = $col_insured.html().replace(/\./g, '').replace(/\,/g, '.');
    lading.shipmentStatusId = 54;//yêu cầu mới tạo
    lading.serviceDVGTIds = [];
    //lading.ServiceId = [];
    if (parseFloat(lading.COD) > 0) {
        //lading.serviceDVGTIds.push({
        //    ServiceCode: 'COD'
        //});
    }
    lading.PackId = null;
    lading.IsTruckDelivery = $col_truck_delivery.html() == "XT" ? true : false;
    // price
    if ($(row).attr('PriceMain')) {
        lading.DefaultPrice = $(row).attr('PriceMain').replace(/\./, '');
        lading.defaultPriceP = $(row).attr('DefaultPriceP').replace(/\./, '');
        lading.defaultPriceS = $(row).attr('DefaultPriceS').replace(/\./, '');
        lading.FuelPrice = $(row).attr('PPXDPrice').replace(/\./, '');
        lading.RemoteAreasPrice = $(row).attr('PriceFar').replace(/\./, '');
        lading.TotalDVGT = $(row).attr('TotalDVGT').replace(/\./, '');
        lading.PriceOther = 0;
        lading.VATPrice = $(row).attr('VAT').replace(/\./, '');
        lading.TotalPrice = $(row).attr('Amount').replace(/\./, '');
    }
    return lading;
}


function loadInfo() {
    var token = $.cookie('token');
    var html = "";
    $.when(sys.CallAjaxasync(apiCustomer + '/Account/GetCurrentInfo', null, token)).done(function (data) {
        if (data.isSuccess) {
            var info = data.data;
            senderName = info.name;
            senderPhone = info.phoneNumber;
            senderAddress = info.address;
            senderCompany = info.nameEn;
            districtSenderId = info.districtId;
            citySenderId = info.provinceId;
            wardSenderId = info.wardId;
            latFrom = info.lat;
            lngFrom = info.lng;
            $.when(sys.CallAjaxasync(apiCustomer + '/hub/GetHubByWardId', { wardId: wardSenderId }, token)).done(function (dataH) {
                if (dataH.isSuccess && dataH.data != null) {
                    var hub = dataH.data;
                    hubSenderId = hub.id;
                }
            });
            html += "<option data-representativeName='" + senderName + "'data-phoneNumber='" + senderPhone + "'data-provinceId='" + citySenderId + "'data-districtId='" + districtSenderId + "'data-wardId='" + wardSenderId + "' value='" + JSON.stringify(info) + "'>" + senderAddress + "</option>"
            $.when(sys.CallAjaxasync(apiCRM + '/CusDepartment/GetByCustomerId', { customerId: info.id }, token)).done(function (department) {
                if (department.isSuccess && department.data != null) {
                    var dep = department.data;
                    department = dep;
                    $.each(department, function (key, value) {
                        html += "<option data-representativeName='" + value.representativeName + "'data-phoneNumber='" + value.phoneNumber + "'data-provinceId='" + value.provinceId + "'data-districtId='" + value.districtId + "'data-wardId='" + value.wardId + "' value='" + JSON.stringify(value) + "'>" + value.address + "</option>";
                    });
                    $(".address-select").html(html);
                    $(".address-select").chosen();
                    $(".address-select").trigger("chosen:updated");
                }
            });
        }
    });
}