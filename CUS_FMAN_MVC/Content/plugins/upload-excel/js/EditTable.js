var _TypePayCode, _ServiceCode, _ProvinceName, token, _GetListService;
var placeAddressTo = null;
var _thisDeleteRow;
var codeObj = new Object();
$(document).ready(function () {
    token = $.cookie('token');
    //
    $.when(sys.CallAjaxasync(apiCustomer + '/paymentType/GetAll', null, token),
        sys.CallAjaxasync(apiCustomer + '/service/GetAll', null, token))
        .done(function (data1, data2) {
            if (data1[0].isSuccess) {
                _TypePayCode = data1[0].data;
            }
            if (data2[0].isSuccess) {
                _ServiceCode = data2[0].data;
            }
        });
    //$.when(sys.CallAjaxasync(apiCustomer + '/province/getProvince', null, token)).done(function (province) {
    //    if (province.isSuccess) {
    //        _ProvinceName = province.data;
    //    }
    //});
    //
    $('.form-edit-cell .edit-cancel').on('click', function () {
        var $cell = $('table.data-excel > tbody > tr > td.active-edit');
        var row_data = $cell.parent();
        $('.form-edit-cell .edit-text').val('');
        $('.form-edit-cell').hide();
        $('.edit-triangle').hide();
        $('table.data-excel > tbody > tr > td.active-edit').focus();
        $('table.data-excel > tbody > tr > td').removeClass('active-edit');
        validation_row(row_data)
    });

});

function init_ready() {
    $('table.data-excel > tbody > tr > td').on('dblclick', function (e) {
        if ($(this).attr('allow') != 'true')
            return;
        click_edit_cell(e, this);
    });
    $('table.data-excel > tbody > tr > td').keypress(function (e) {
        var key = e.which;
        if (key === 13)  // the enter key code
        {
            if ($(this).attr('allow') != 'true')
                return;
            click_edit_cell(e, this);
        }
    });
    $('.form-edit-cell .edit-save').on('click', function () {
        save_text();
    });
    $('.form-edit-cell .edit-text').keypress(function (e) {
        var key = e.which;
        if (key === 13)  // the enter key code
        {
            save_text();
        }
    });
    var allow_edit = ['grid-excel_shipment_number', 'grid-excel_cus_code_to', 'grid-excel_name_to', 'grid-excel_phone_to', 'grid-excel_address_note_to',
        'grid-excel_address_to', 'grid-excel_company_to', 'grid-excel_shop_code', 'grid-excel_cod', 'grid-excel_insured', 'grid-excel_service', 'grid-excel_type_pay',
        'grid-excel_box', 'grid-excel_weight', 'grid-excel_note', 'grid-excel_content', 'grid-excel_truck_delivery'];
    var dalidation_columns = [
        'grid-excel_shipment_number',
        'grid-excel_cus_code_to',
        'grid-excel_name_to',
        'grid-excel_phone_to',
        'grid-excel_address_note_to',
        'grid-excel_address_to',
        'grid-excel_company_to',
        'grid-excel_shop_code',
        'grid-excel_cod',
        'grid-excel_insured',
        'grid-excel_box',
        'grid-excel_weight',
        'grid-excel_service',
        'grid-excel_type_pay',
        'grid-excel_truck_delivery',
        'grid-excel_price',
    ];
    var dalidation_check = [
        'allow_null',
        'allow_null',
        'not_null',
        'not_null',
        'allow_null',
        'not_null',
        'allow_null',
        'allow_null',
        'is_number_min_0',
        'is_number_min_0',
        'is_number_min_0',
        'is_number_min_01',
        'not_null',
        'not_null',
        'allow_null',
        'is_number_min_02',
    ];
    add_error_system();
    init_table(allow_edit, dalidation_columns, dalidation_check);
}

async function init_table(allow_edit, dalidation_columns, dalidation_check) {
    var data_table = $('table.data-excel > tbody');
    var rows = $('tr', data_table);
    var address = [];
    var oj = {};
    await $(rows).each(function (index, row) {
        if (index == 0) {//not get data row the first
            $(row).find('td').addClass('not_get');
            $(row).find('td').attr('allow', 'false');
            $(row).find('td').css({ 'color': '' });
        }
        if (index > 0) {
            $(row).find('td').each(function (index_td, data_td) {
                var column_name = $(data_td).attr('aria-describedby');
                var row_data = $(this).parent();
                //allow edit cell data
                if ($.inArray(column_name, allow_edit) != -1) {
                    // found it
                    $(data_td).attr('allow', 'true');
                    $(data_td).css({ 'color': '#3e70c3' });
                }
                //add validation
                var int_valid = $.inArray(column_name, dalidation_columns);
                if (int_valid != -1) {
                    // found it
                    $(data_td).addClass(dalidation_check[int_valid]);
                }
                if ($(data_td).html() == "&nbsp;") {
                    $(data_td).html("");
                }
                if (column_name.indexOf('province_to') != -1) {

                }
                //if (row_data[index_td + 1]) {

                //}
                // get data google address
                if (column_name.indexOf('address_to') != -1) {
                    google_address(row_data, $(this), $(this).html());
                }
            });
            validation_row(row);
            //check price
            calculator(row);
            if (index >= (rows.length - 1)) {
                var time = rows.length * 10;
                if (time < 2000) time = 2000;
                setTimeout(function () {
                    sortTableError();
                }, (time))
            }
        }
        //
    });
    //$('table.data-excel > tbody').sortable();
    //$('table.data-excel > tbody').disableSelection();
    //var test = $('tr', $('table.data-excel > tbody'));
    //var test2 = test.sort((x, y) => y > x ? -1 : 1);
}
function sortTableError() {
    var table, rows;
    table = document.getElementById("grid-excel");
    rows = table.rows;
    var countError = 2;
    for (i = 2; i < rows.length; i++) {
        var x = rows[i].className.indexOf('ms-error');
        if (x >= 0) {
            if (countError != i) {
                rows[countError].parentNode.insertBefore(rows[i], rows[countError]);
            }
            countError++;
        }
    }
}
function add_error_system() {
    var message = '<div class="message_systems" onclick="deleteRow(this)"></div>';
    $('table tbody tr td:last-child').html(message);
    //$('.message_systems').on('click', function (e) {
    // sys.ConfirmDialog("Xác nhận", "Bạn Chắc Muốn Xóa?", function (eventa) {
    //     e.preventDefault();
    //     _this.closest('tr').remove();
    //     console.log('BB:' + $(this).closest('tr').text());
    // });
    //});
}

function deleteRow(r) {
    $('.message_systems').css({ "visibility": "hidden" })
    setTimeout(() => {
        $('.message_systems').css({ "visibility": "visible" })
    }, 1000);

    _thisDeleteRow = r;
    $.createDialog({
        attachAfter: '.message_systems',
        title: 'Bạn Chắc Muốn Xóa?',
        accept: 'Xác nhận',
        refuse: 'Không',
        acceptStyle: 'red',
        refuseStyle: 'gray',
        acceptAction: alertCall
    });
    $.showDialog();
}
function alertCall() {
    var i = _thisDeleteRow.parentNode.parentNode.rowIndex;
    document.getElementById("grid-excel").deleteRow(i);
}

function validation_row(data_row) {
    $(data_row).removeClass('ms-error');
    $(data_row).find('td').each(function (index, cell) {
        var value = $(this).html();
        var success = true;
        var message = '';
        if ($(this).hasClass('not_null')) {
            var result = validation_not_null(value, 2, 100);
            success = result[0];
            message = result[1];
        } else if ($(this).hasClass('is_number_min_0')) {
            var result = validation_number_max_min(value, 0, 10000000000);
            success = result[0];
            message = result[1];
        } else if ($(this).hasClass('is_number_min_01')) {
            var result = validation_number_max_min(value, 0.001, 10000000000);
            success = result[0];
            message = result[1];
        } else if ($(this).hasClass('is_number_min_02')) {
            var result = validation_float_max_min(value, 0.001, 10000000000);
            success = result[0];
            message = result[1];
        }
        if ($(this).attr('aria-describedby').indexOf('address_to') != -1) {
            var result = validation_map(cell);
            success = result[0];
            message = result[1];
        }
        if ($(this).attr('aria-describedby').indexOf('service') != -1) {
            var result = validation_ServiceCode(value);
            success = result[0];
            message = result[1];
            if (success)
                $(this).attr('service_id', message);

        }
        if ($(this).attr('aria-describedby').indexOf('type_pay') != -1) {
            var result = validation_TypePayCode(value);
            success = result[0];
            message = result[1];
            $(this).attr('type_pay_id', message);
        }
        if ($(this).attr('aria-describedby').indexOf('number_code') != -1) {
            var result = validation_NumberCode(value, cell);
            success = result[0];
            message = result[1];
            $(this).attr('number_code', message);
            $(this).attr('number_name', "number_name");
        }
        //if ($(this).attr('aria-describedby').indexOf('province_to') != -1) {
        //    var result = validation_ProvinceName(value, cell);
        //    success = result[0];
        //    message = result[1];
        //    $(this).attr('province_id', message);
        //}
        //
        if (!success) {
            $(this).addClass('error');
            $(this).attr('title', message);
            $(data_row).addClass('ms-error');
        } else {
            $(this).removeClass('error');
            $(this).attr('title', '');
        }
    });
}

function validation_NumberCode(code, cell) {
    var result = [true, code];
    if (cell.attributes.number_name) {
        let id = cell.attributes.number_name.value;
        codeObj[id] = code;
    }
    if (code != "" || code != "&nbsp;") {
        $.when(sys.CallAjaxasync(apiPost + '/shipment/tracking', { shipmentNumber: code, cols: null }, token)).done(function (data) {
            if (data.isSuccess) {
                result = [false, 'Mã vận đơn bị trùng, vui lòng kiểm tra lại!'];
            }
        });
    }
    return result;
}
function validation_address(value) {
    var intRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!intRegex.test(value)) {
        return [false, 'Địa chỉ(' + value + ') không hợp lệ(Google Map sẽ giúp bạn lấy vị trí gần nhất)!'];
    }
    return [true, 'OK'];
}
function validation_not_null(value, min, max) {
    if (value === undefined) {
        return [false, 'Giá trị nhập vào không hợp lệ(undefined) !'];
    }
    if (value === null | value === '&nbsp;' | value.trim().length === 0 | undefined | value.toLowerCase() === 'null') {
        return [false, 'Giá trị nhập vào không hợp lệ!'];
    }
    if (value.length <= min | value.length > max) {
        return [false, 'it nhất là ' + min + ' ký tự và nhiều nhất là ' + max + ' ký tự!'];
    }
    return [true, 'OK'];
}
function validation_int(value) {
    var intRegex = /^\d+$/;
    if (!intRegex.test(value)) {
        return [false, 'Giá trị nhập vào phải là số chẵn!'];
    }
    return [true, 'OK'];
}
function validation_int_max_min(value, min, max) {
    var intRegex = /^\d+$/;
    if (!intRegex.test(value)) {
        return [false, 'Giá trị nhập vào phải là số chẵn!'];
    }
    var _value = parseInt(value);
    if (_value < min | _value > max) {
        return [false, 'Giá trị nhập vào không vượt quá từ ' + min + ' đển ' + max + '!'];
    }
    return [true, 'OK'];
}
function validation_number(value) {
    var intRegex = /^\d+$/;
    var floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/;
    if (!intRegex.test(value) && !floatRegex.test(value)) {
        return [false, 'Giá trị nhập vào phải là một số!'];
    }
    return [true, 'OK'];
}
function validation_number_max_min(value, min, max) {
    var intRegex = /^\d+$/;
    var floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/;
    if (!intRegex.test(value) && !floatRegex.test(value)) {
        return [false, 'Giá trị nhập vào phải là một số!'];
    }
    var _value = parseFloat(value);
    if (_value < min | _value > max) {
        return [false, 'Giá trị nhập vào không vượt quá từ ' + min + ' đển ' + max + '!'];
    }
    return [true, 'OK'];
}
function validation_float_max_min(value, min, max) {
    var intRegex = /^\d+$/;
    var floatRegex = /^((\d*\.)?(\d*\.)?\d+)$/;
    if (!intRegex.test(value) && !floatRegex.test(value)) {
        return [false, 'Giá trị nhập vào phải là một số!'];
    }
    var _value = parseFloat(value);
    if (_value < min | _value > max) {
        return [false, 'Giá trị nhập vào không vượt quá từ ' + min + ' đển ' + max + '!'];
    }
    return [true, 'OK'];
}
function validation_map(_this) {
    var result = [false, 'Địa chỉ(' + $(_this).html() + ') không hợp lệ, vui lòng để Google Map định vị giúp bạn!'];
    var result2 = [false, 'Địa chỉ(' + $(_this).html() + ') hiện tại chưa hỗ trợ phát hàng cho khu vực này!'];
    var name_column = $(_this).attr('aria-describedby');
    var _lat = $(_this).attr('lat');
    var _lng = $(_this).attr('lng');
    var _district_name = $(_this).attr('district_name');
    var _hub_id = $(_this).attr('hub_id');
    var _state_name = $(_this).attr('state_name');
    var _ward_name = $(_this).attr('ward_name');
    if (!validation_not_null(_state_name, 1, 100)[0])
        return result;
    //else if (!validation_not_null(_district_name, 1, 100)[0])
    //    return result;
    //else if (!validation_not_null(_hub_id, 1, 100000)[0])
    //    return result2;
    //else if (!validation_number(_lat)[0])
    //    return result;
    //else if (!validation_number(_lng)[0])
    //    return result;
    else
        return [true, 'OK!'];
}
function validation_ServiceCode(code) {
    var result = [false, 'Mã dịch vụ chưa đúng, vui lòng kiểm tra lại!'];
    if (_ServiceCode != undefined) {
        $.map(_ServiceCode, function (elementOfArray, indexInArray) {
            if (elementOfArray.code.toLowerCase() == code.toLowerCase()) {
                result = [true, elementOfArray.id];
            }
        });
    }
    return result;
}
function validation_TypePayCode(code) {
    var result = [false, 'Mã hình thức thanh toán chưa đúng, vui lòng kiểm tra lại!'];
    $.map(_TypePayCode, function (elementOfArray, indexInArray) {
        if (elementOfArray.code.toLowerCase() == code.toLowerCase()) {
            result = [true, elementOfArray.id];
        }
    });
    return result;
}
//function validation_ProvinceName(name) {
//    var result = [false, 'Tên tỉnh thành chưa đúng, vui lòng kiểm tra lại!'];
//    $.map(_ProvinceName, function (elementOfArray, indexInArray) {
//        if (elementOfArray.name.toLowerCase() == name.toLowerCase()) {
//            result = [true, elementOfArray.id];
//        }
//    });
//    return result;
//}

function save_text() {
    var $cell = $('table.data-excel > tbody > tr > td.active-edit');
    $cell.html($('.form-edit-cell .edit-text').val());
    var row_data = $cell.parent();
    if ($('.form-edit-cell .edit-text').attr('class').indexOf('google_address') >= 0) {
        var address = $('.google_address').val()
        google_address(row_data, $cell, address);
    }
    validation_row(row_data);
    calculator(row_data);
    //
    $('.form-edit-cell').hide();
    $('.edit-triangle').hide();
    $('.form-edit-cell .edit-text').val('');
    $cell.removeClass('active-edit');
    $cell.focus(); setTimeout(function () {
        sortTableError();
    }, 500)
}

function click_edit_cell(e, _this) {
    var $control_edit_text = $('.form-edit-cell .edit-text');
    $('.form-edit-cell').show();
    $('.edit-triangle').show();
    $('table.data-excel > tbody > tr > td').removeClass('active-edit');
    $(_this).addClass('active-edit');
    if ($(_this).attr('aria-describedby').indexOf('address_to') >= 0) {
        initMap();
        $control_edit_text.addClass('google_address');
    }
    else {
        removeMap();
        $control_edit_text.removeClass('google_address');
    }
    var _offset = $(_this).offset();
    var position_left = _offset.left, position_top = _offset.top - 70;
    var position_left_down = _offset.left + 10, position_top_down = _offset.top - 65;
    //var position_left = e.pageX - 40, position_top = e.pageY - 85;
    //var position_left_down = e.pageX - 30, position_top_down = e.pageY - 80;
    var margin_left = _offset.left, wwidth_window = $('body').width();
    if (wwidth_window - margin_left < 310) {
        position_left = position_left - 260;
    }
    if (wwidth_window - margin_left < 40) {
        position_left = position_left - 35;
        $('.edit-triangle').css({ "border-right": "0px solid transparent" });
        $('.edit-triangle').css({ "border-left": "30px solid transparent" });
    } else {
        if (position_left < 5) {
            position_left = 5;
            position_left_down = 15;
            $('.edit-triangle').css({ "border-left": "0px solid transparent" });
            $('.edit-triangle').css({ "border-right": "30px solid transparent" });
        } else {
            $('.edit-triangle').css({ "border-left": "30px solid transparent" });
            $('.edit-triangle').css({ "border-right": "30px solid transparent" });
        }
    }
    $('.form-edit-cell').offset({ left: position_left, top: position_top });
    $('.edit-triangle').offset({ left: position_left_down, top: position_top_down + 35 });
    /*SET DATA*/
    if ($(_this).html() == "&nbsp;") {
        $(_this).html("");
    }
    $control_edit_text.val($(_this).html());
    $control_edit_text.focus();
}

function initMap() {
    // var $cell = $('table.data-excel > tbody > tr > td.active-edit');
    // $cell.html($('.form-edit-cell .edit-text').val());
    // var row_data = $cell.parent();
    var options = {
        componentRestrictions: { 'country': ['vi', 'vn'] }
    };
    var input = document.getElementById("google_address");
    var autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.addListener('place_changed', function () {
        placeAddressTo = autocomplete.getPlace();
        if (!placeAddressTo.geometry) {
            window.alert("Không tìm thấy địa chỉ: '" + placeAddressTo.name + "'");
            return;
        }
        // google_address(row_data, $cell, address);
    });
}

function removeMap() {
    var input = document.getElementById("google_address");
    google.maps.event.clearInstanceListeners(input);
}

// function google_address(row, _this, address) {
//     var $col_province_to = $(row).find('td[aria-describedby="grid-excel_province_to"]');
//     var $col_district_to = $(row).find('td[aria-describedby="grid-excel_district_to"]');
//     var $col_ward_to = $(row).find('td[aria-describedby="grid-excel_ward_to"]');

//     var address_google = address;
//     if (address_google === null | address_google === '' | address_google === 'undefined') {
//         address_google = $('.google_address').val();
//     }
//     var componentForm = {
//         street_number: 'short_name',
//         route: 'short_name',//đường
//         locality: 'short_name',
//         sublocality_level_1: 'short_name',//phường xã
//         administrative_area_level_3: 'short_name',//phường xã
//         administrative_area_level_2: 'short_name',//Quận huyện
//         administrative_area_level_1: 'short_name',//Tỉnh thành
//         country: 'short_name',//Quốc gia
//         postal_code: 'short_name'
//     };
//     //
//     var lat = 0, lng = 0, district_name = '', state_name = '', ward_name = '';

//     $.ajax({
//         url: 'https://maps.googleapis.com/maps/api/geocode/json',
//         data: {
//             sensor: false,
//             address: address_google,
//             key: KeyGoogle
//         },
//         dataType: 'json',
//         success: function (data, textStatus) {
//             if (!data.results[0] || !data.results[0].geometry) {
//             } else {
//                 const results = data.results.sort((x, y) => y.address_components.length - x.address_components.length);
//                 const dataTEST = results[0];
//                 let findTypeWard = dataTEST.address_components.filter(x => x.types.find(y => y == "sublocality_level_1"))[0];
//                 if (!findTypeWard) {
//                     for (const item in results) {
//                         if (results.hasOwnProperty(item)) {
//                             const element = results[item];
//                             let typeWard = element.address_components.filter(x => x.types.find(y => y == "sublocality_level_1"))[0];
//                             if (typeWard) {
//                                 dataTEST.address_components.push(typeWard);
//                                 break;
//                             }
//                         }
//                     }
//                 }

//                 var address = dataTEST;
//                 var locationTo = dataTEST.geometry.location;
//                 lat = locationTo.lat;
//                 lng = locationTo.lng;
//                 for (var i = 0; i < address.address_components.length; i++) {
//                     for (j = 0; j < address.address_components[i].types.length; j++) {
//                         var addressType = address.address_components[i].types[j];
//                         if (addressType == 'administrative_area_level_1') {
//                             state_name = address.address_components[i][componentForm[addressType]];
//                         }
//                         if (addressType == 'administrative_area_level_2') {
//                             district_name = address.address_components[i][componentForm[addressType]];
//                         }
//                         if (addressType == "sublocality_level_1" || addressType == "administrative_area_level_3") {
//                             ward_name = address.address_components[i][componentForm[addressType]];
//                         }
//                     }
//                 }
//             }
//         },
//         async: false
//     });

//     var district_id = 0, state_id = 0; ward_id = 0; hub_id = 0;
//     var provinceId = "null"; districtId = "null"; wardId = "null"; countryId = "null";
//     if (state_name != "") {
//         $.when(sys.CallAjaxasync(apiCore + '/hub/GetInfoLocation', { provinceName: state_name, districtName: district_name, wardName: ward_name, provinceId: provinceId, districtId: districtId, wardId: wardId, countryId: countryId }, token)).done(function (dataInfoLocation) {
//             if (dataInfoLocation.isSuccess && dataInfoLocation.data != null) {
//                 var infoLocation = dataInfoLocation.data;
//                 hub_id = infoLocation.hubId;
//                 state_id = infoLocation.provinceId;
//                 district_id = infoLocation.districtId;
//                 ward_id = infoLocation.wardId;

//                 _this.attr('hub_id', hub_id);
//                 _this.attr('state_id', state_id);
//                 _this.attr('district_id', district_id);
//                 _this.attr('ward_id', ward_id);
//                 _this.attr('lat', lat);
//                 _this.attr('lng', lng);
//                 _this.attr('state_name', state_name);
//                 _this.attr('district_name', district_name);
//                 _this.attr('ward_name', ward_name);
//                 //console.log(infoLocation);
//                 $col_province_to.html(state_name)
//                 $col_district_to.html(district_name)
//                 $col_ward_to.html(ward_name)
//             }
//         });
//     }
//     else {
//         _this.attr('state_name', state_name);
//         _this.attr('district_name', district_name);
//         _this.attr('ward_name', ward_name);
//         var $cell = $('table.data-excel > tbody > tr > td.active-edit');
//         var row_data = $cell.parent();
//         validation_row(row_data)
//     }
// }
async function google_address(row, _this, address) {
    var $col_province_to = $(row).find('td[aria-describedby="grid-excel_province_to"]');
    var $col_district_to = $(row).find('td[aria-describedby="grid-excel_district_to"]');
    var $col_ward_to = $(row).find('td[aria-describedby="grid-excel_ward_to"]');

    if ($col_province_to.html() == "&nbsp;") {
        $col_province_to.html("")
    } else if ($col_district_to.html() == "&nbsp;") {
        $col_district_to.html("")
    } else if ($col_ward_to.html() == "&nbsp;") {
        $col_ward_to.html("")
    }

    // if ($col_province_to.html() && $col_district_to.html()) {
    //     get_info_location(row, _this);
    //     return;
    // } else {
    //     $col_province_to.attr('province_id', 0);
    //     $col_province_to.attr('hub_id', 0);
    //     $col_district_to.attr('district_id', 0);
    //     $col_ward_to.attr('ward_id', 0);
    // }

    var address_google = address;
    if (address_google === null | address_google === '' | address_google === 'undefined') {
        address_google = $('.google_address').val();
    }
    var componentForm = {
        street_number: 'short_name',
        route: 'short_name',// đường
        locality: 'short_name',
        sublocality_level_1: 'short_name',// phường xã
        administrative_area_level_3: 'short_name',// phường xã
        administrative_area_level_2: 'short_name',// Quận huyện
        administrative_area_level_1: 'short_name',// Tỉnh thành
        country: 'short_name',//Quốc gia
        postal_code: 'short_name'
    };
    //
    var lat = 0, lng = 0, district_name = null, state_name = null, ward_name = null, location = null;

    $.ajax({
        url: 'https://maps.googleapis.com/maps/api/geocode/json',
        data: {
            sensor: false,
            address: address_google,
            key: KeyGoogle
        },
        dataType: 'json',
        success: function (data, textStatus) {
            if (!data.results[0] || !data.results[0].geometry) {
            } else {
                const results = data.results.sort((x, y) => y.address_components.length - x.address_components.length);
                const dataTEST = results[0];
                var locationTo = dataTEST.geometry.location;
                lat = locationTo.lat;
                lng = locationTo.lng;

                location = lat + "," + lng;
            }
        },
        async: false
    });

    $.ajax({
        url: 'https://maps.googleapis.com/maps/api/geocode/json',
        data: {
            sensor: false,
            latlng: location,
            key: KeyGoogle
        },
        dataType: 'json',
        success: function (data, textStatus) {
            if (!data.results[0] || !data.results[0].geometry) {
            } else {
                const results = data.results.sort((x, y) => y.address_components.length - x.address_components.length);
                const dataTEST = results[0];
                let findTypeWard = dataTEST.address_components.filter(x => x.types.find(y => y == "sublocality_level_1"))[0];
                if (!findTypeWard) {
                    for (const item in results) {
                        if (results.hasOwnProperty(item)) {
                            const element = results[item];
                            let typeWard = element.address_components.filter(x => x.types.find(y => y == "sublocality_level_1"))[0];
                            if (typeWard) {
                                dataTEST.address_components.push(typeWard);
                                break;
                            }
                        }
                    }
                }
                let findTypeDistrict = dataTEST.address_components.filter(x => x.types.find(y => y == "administrative_area_level_2"))[0];
                if (!findTypeDistrict) {
                    for (const item in results) {
                        if (results.hasOwnProperty(item)) {
                            const element = results[item];
                            let typeWard = element.address_components.filter(x => x.types.find(y => y == "administrative_area_level_2"))[0];
                            if (typeWard) {
                                dataTEST.address_components.push(typeWard);
                                break;
                            }
                        }
                    }
                }

                var address = dataTEST;
                var locationTo = dataTEST.geometry.location;
                lat = locationTo.lat;
                lng = locationTo.lng;
                for (var i = 0; i < address.address_components.length; i++) {
                    for (j = 0; j < address.address_components[i].types.length; j++) {
                        var addressType = address.address_components[i].types[j];
                        if (addressType == 'administrative_area_level_1') {
                            state_name = address.address_components[i][componentForm[addressType]];
                        }
                        if (addressType == 'administrative_area_level_2') {
                            district_name = address.address_components[i][componentForm[addressType]];
                        }
                        if (addressType == "sublocality_level_1" || addressType == "administrative_area_level_3") {
                            ward_name = address.address_components[i][componentForm[addressType]];
                        }
                    }
                }
                location = lat + "," + lng;
            }
        },
        async: false
    });
   
    var district_id = 0, state_id = 0; ward_id = 0; hub_id = 0;
    var provinceId = "null"; districtId = "null"; wardId = "null"; countryId = "null";
    if (state_name != "") {
        $.when(sys.CallAjaxasync(apiCore + '/hub/GetInfoLocation', { provinceName: state_name, districtName: district_name, wardName: ward_name, provinceId: provinceId, districtId: districtId, wardId: wardId, countryId: countryId }, token)).done(function (dataInfoLocation) {
            if (dataInfoLocation.isSuccess && dataInfoLocation.data != null) {
                var infoLocation = dataInfoLocation.data;
                hub_id = infoLocation.hubId;
                state_id = infoLocation.provinceId;
                district_id = infoLocation.districtId;
                ward_id = infoLocation.wardId;

                _this.attr('hub_id', hub_id);
                _this.attr('state_id', state_id);
                _this.attr('district_id', district_id);
                _this.attr('ward_id', ward_id);
                _this.attr('lat', lat);
                _this.attr('lng', lng);
                _this.attr('state_name', state_name);
                _this.attr('district_name', district_name);
                _this.attr('ward_name', ward_name);
                //console.log(infoLocation);
                $col_province_to.html(state_name)
                $col_district_to.html(district_name)
                $col_ward_to.html(ward_name)
            }
        });
    }
    else {
        _this.attr('state_name', state_name);
        _this.attr('district_name', district_name);
        _this.attr('ward_name', ward_name);
        var $cell = $('table.data-excel > tbody > tr > td.active-edit');
        var row_data = $cell.parent();
        validation_row(row_data)
    }
}

function get_address(row, _this, address) {
    var $col_province_to = $(row).find('td[aria-describedby="grid-excel_province_to"]');
    var $col_district_to = $(row).find('td[aria-describedby="grid-excel_district_to"]');
    var $col_ward_to = $(row).find('td[aria-describedby="grid-excel_ward_to"]');

    if ($col_province_to.html() == "&nbsp;") {
        $col_province_to.html("")
    } else if ($col_district_to.html() == "&nbsp;") {
        $col_district_to.html("")
    } else if ($col_ward_to.html() == "&nbsp;") {
        $col_ward_to.html("")
    }

    if ($col_province_to.html() && $col_district_to.html()) {
        get_info_location(row, _this);
    } else {
        $col_province_to.attr('province_id', 0);
        $col_province_to.attr('hub_id', 0);
        $col_district_to.attr('district_id', 0);
        $col_ward_to.attr('ward_id', 0);
    }

    if (address != "") {
        $.when(sys.CallAjaxasync(apiCore + '/hub/GetInfoLocationByAddress', { address: address }, token)).done(function (dataInfoLocation) {
            if (dataInfoLocation.isSuccess && dataInfoLocation.data != null) {
                var infoLocation = dataInfoLocation.data;
                hub_id = infoLocation.hubId;
                state_id = infoLocation.provinceId;
                district_id = infoLocation.districtId;
                ward_id = infoLocation.wardId;

                _this.attr('hub_id', infoLocation.hubId);
                _this.attr('state_id', infoLocation.provinceId);
                _this.attr('district_id', infoLocation.districtId);
                _this.attr('ward_id', infoLocation.wardId);
                //_this.attr('lat', null);
                //_this.attr('lng', null);
                _this.attr('state_name', infoLocation.provinceName);
                _this.attr('district_name', infoLocation.districtName);
                _this.attr('ward_name', infoLocation.wardName);
                console.log(infoLocation);
                if (!($col_province_to.html() && $col_district_to.html())) {
                    $col_province_to.html(infoLocation.provinceName)
                    $col_district_to.html(infoLocation.districtName)
                    $col_ward_to.html(infoLocation.wardName)
                }
            } else {
                _this.attr('state_name', '');
                _this.attr('district_name', '');
                _this.attr('ward_name', '');
                var $cell = $('table.data-excel > tbody > tr > td.active-edit');
                var row_data = $cell.parent();
                validation_row(row_data)
            }
        });
    }
}
function get_info_location(row, _this) {
    var provinceId = "null"; districtId = "null"; wardId = "null"; countryId = "null";
    var $col_province_to = $(row).find('td[aria-describedby="grid-excel_province_to"]');
    var $col_district_to = $(row).find('td[aria-describedby="grid-excel_district_to"]');
    var $col_ward_to = $(row).find('td[aria-describedby="grid-excel_ward_to"]');
    var $col_address_to = $(row).find('td[aria-describedby="grid-excel_address_to"]');

    $.when(sys.CallAjaxasync(apiCore + '/hub/GetInfoLocation', { provinceName: $col_province_to.html(), districtName: $col_district_to.html(), wardName: $col_ward_to.html(), provinceId: provinceId, districtId: districtId, wardId: wardId, countryId: countryId }, token)).done(function (dataInfoLocation) {
        if (dataInfoLocation.isSuccess && dataInfoLocation.data != null) {
            var infoLocation = dataInfoLocation.data;
            if (infoLocation.provinceId && infoLocation.districtId) {
                $col_province_to.attr('province_id', infoLocation.provinceId);
                $col_province_to.attr('hub_id', infoLocation.hubId);
                $col_district_to.attr('district_id', infoLocation.districtId);
                $col_ward_to.attr('ward_id', infoLocation.wardId);
                $col_address_to.attr('state_name', $col_province_to.html());
                var $cell = $('table.data-excel > tbody > tr > td.active-edit');
                var row_data = $cell.parent();
                validation_row(row);
            }
        }
    });
}