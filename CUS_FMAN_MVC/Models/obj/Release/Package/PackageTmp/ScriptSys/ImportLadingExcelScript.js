var token;
var latFrom = 0;
var lngFrom = 0;
var hubSenderId = 0;
var wardSenderId = 0;
var districtSenderId = 0;
var citySenderId = 0;
var senderName, senderPhone, senderAddress, senderCompany;

$(document).ready(function() {
    token = $.cookie('token');
    loadInfo();
    $('.form-edit-cell .edit-cancel').on('click', function() {
        $('.form-edit-cell .edit-text').val('');
        $('.form-edit-cell').hide();
        $('.edit-triangle').hide();
        $('table.data-excel > tbody > tr > td.active-edit').focus();
        $('table.data-excel > tbody > tr > td').removeClass('active-edit');
    });
    $(".btn_save").on("click", function() {
        event.preventDefault();
        SaveExcel();
    });//Nút thêm excel
});
//Hàm lưu file excel
function SaveExcel() {
    sys.Loading();
    if ($('table.data-excel > tbody > tr.ms-error')[0]) {
        $(".message_error").append("Danh sách thông tin đơn hàng lỗi, vui lòng kiểm tra lại!");
        $(".message_error").slideDown(1000).delay(5000).slideUp('slow');
        sys.HideLoading();
        return false;
    } else {
        var elem = document.getElementById("myBar");
        var countSuccess = 0, count = 0, ladingError = "";
        var data_table = $('table.data-excel > tbody');
        var rows = $('tr', data_table);
        var countRows = rows.length - 1;
        $(rows).each(async function(index, row) {
            if (index > 0) {
                var phantram = 0;
                var id;

                var item = GetLadingModel(row);
                await $.when(sys.CallAjaxPostasync(apiCustomer + "/shipment/Create", item, token)).done(function(data) {
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
                //sys.HideLoading();
                //$('#upload_excel').val(null);
            }
        });
    }
};

function calculator(row) {
    var lading = GetLadingModel(row);
    var $col_price = $(row).find('td[aria-describedby="grid-excel_price"]');
    $.when(sys.CallAjaxPostasync(apiCustomer + "/price/Calculate", lading, token)).done(function(data) {
        if (data.isSuccess) {
            var result = data.data;
            $(row).attr('PriceMain', formatMoney(result.defaultPrice, 0));
            $(row).attr('PriceOther', formatMoney(result.otherPrice, 0));
            $(row).attr('PPXDPrice', formatMoney(result.fuelPrice, 0));
            $(row).attr('PriceFar', formatMoney(result.remoteAreasPrice, 0));
            $(row).attr('VAT', formatMoney(result.vatPrice, 0));
            $(row).attr('TotalDVGT', formatMoney(result.totalDVGT, 0));
            $(row).attr('Amount', formatMoney(result.totalPrice, 0));
            $col_price.html((formatMoney(result.totalPrice, 0)));
            validation_row(row);
        }
    });
}

function GetLadingModel(row) {
    var lading = new Object();
    var $col_name_from = $(row).find('td[aria-describedby="grid-excel_name_from"]');
    var $col_phone_from = $(row).find('td[aria-describedby="grid-excel_phone_from"]');
    var $col_address_from = $(row).find('td[aria-describedby="grid-excel_address_from"]');
    var $col_name_to = $(row).find('td[aria-describedby="grid-excel_name_to"]');
    var $col_phone_to = $(row).find('td[aria-describedby="grid-excel_phone_to"]');
    var $col_address_to = $(row).find('td[aria-describedby="grid-excel_address_to"]');
    var $col_address_note_to = $(row).find('td[aria-describedby="grid-excel_address_note_to"]');
    var $col_cod = $(row).find('td[aria-describedby="grid-excel_cod"]');
    var $col_weight = $(row).find('td[aria-describedby="grid-excel_weight"]');
    var $col_service = $(row).find('td[aria-describedby="grid-excel_service"]');
    var $col_type_pay = $(row).find('td[aria-describedby="grid-excel_type_pay"]');
    var $col_content = $(row).find('td[aria-describedby="grid-excel_content"]');
    var $col_note = $(row).find('td[aria-describedby="grid-excel_note"]');
    //
    lading.orderDate = sys.formatDateTimeSQL(new Date());

    lading.SenderId = $.cookie('userId');
    lading.FromDistrictId = districtSenderId;
    lading.pickingAddress = senderAddress;
    lading.senderName = lading.NameFrom = senderName;
    lading.senderPhone = lading.PhoneFrom = senderPhone;
    lading.companyFrom = lading.CompanyFrom = senderCompany;
    lading.fromProvinceId = citySenderId;
    lading.fromWardId = wardSenderId;
    lading.fromHubId = hubSenderId;
    lading.currentHubId = hubSenderId;
    lading.LatFrom = latFrom;
    lading.LngFrom = lngFrom;

    lading.receiverName = $col_name_to.html();
    lading.shippingAddress = $col_address_to.html();
    lading.addressNoteTo = $col_address_note_to.html();
    lading.receiverPhone = $col_phone_to.html();
    //lading.CompanyTo = value.$CompanyTo.val();
    lading.CityRecipientId = $col_address_to.attr('state_id');
    lading.toDistrictId = $col_address_to.attr('district_id');
    lading.toWardId = $col_address_to.attr('ward_id');
    lading.toHubId = $col_address_to.attr('hub_id');
    lading.LatTo = $col_address_to.attr('lat');
    lading.LngTo = $col_address_to.attr('lng');
    lading.Width = 0;
    lading.Height = 0;
    lading.Length = 0;
    //  lading.RouteLength = ladingModel.RouteLength;
    lading.Weight = $col_weight.html().replace(/\./g, '').replace(/\,/g, '.');
    lading.totalBox = 1;
    lading.cusNote = $col_note.html();
    lading.Content = $col_content.html();
    lading.ServiceId = $col_service.attr('service_id');
    lading.PaymentTypeId = $col_type_pay.attr('type_pay_id');
    lading.Insured = 0;
    lading.COD = $col_cod.html().replace(/\./g, '').replace(/\,/g, '.');
    lading.shipmentStatusId = 54;//yêu cầu mới tạo
    lading.serviceDVGTIds = [];
    if (parseFloat(lading.COD) > 0) {
        //lading.serviceDVGTIds.push({
        //    ServiceCode: 'COD'
        //});
    }
    lading.PackId = null;
    // price
    if ($(row).attr('PriceMain')) {
        lading.DefaultPrice = $(row).attr('PriceMain').replace(/\./, '');
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
    $.when(sys.CallAjaxasync(apiCustomer + '/Account/GetCurrentInfo', null, token)).done(function(data) {
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
            $.when(sys.CallAjaxasync(apiCustomer + '/hub/GetHubByWardId', { wardId: wardSenderId }, token)).done(function(dataH) {
                if (dataH.isSuccess && dataH.data != null) {
                    var hub = dataH.data;
                    hubSenderId = hub.id;
                }
            });
        }
    });
}