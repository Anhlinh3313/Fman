var _TypePayCode, _ServiceCode, token, _GetListService, _ProviceName, _AddressTo;
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
    var allow_edit = [
        'grid-excel_Ngày lập',
        'grid-excel_SO',
        'grid-excel_IMEI DV',
        'grid-excel_Warehouse name',
        'grid-excel_Interpretation',
        'grid-excel_Số lượng',
        'grid-excel_Unit',
        'grid-excel_Số HĐ',
        'grid-excel_Đ/c GH',
        //'grid-excel_Địa chỉ Kerry',
        //'grid-excel_Tỉnh thành',
        'grid-excel_Người nhận',
    ];
    var dalidation_columns = [
        'grid-excel_Ngày lập',
        'grid-excel_SO',
        'grid-excel_IMEI DV',
        'grid-excel_Warehouse name',
        'grid-excel_Interpretation',
        'grid-excel_Số lượng',
        'grid-excel_Unit',
        'grid-excel_Số HĐ',
        'grid-excel_Đ/c GH',
        //'grid-excel_Địa chỉ Kerry',
        //'grid-excel_Tỉnh thành',
        'grid-excel_Người nhận',
    ];
    var dalidation_check = [
        'allow_null',
        'allow_null',
        'allow_null',
        'allow_null',
        'allow_null',
        'is_number_min_0',
        'allow_null',
        'allow_null',
        'allow_null',
        //'allow_null',
        //'allow_null',
        'allow_null',
    ];
    add_error_system();
    init_table(allow_edit, dalidation_columns, dalidation_check);
}

function init_table(allow_edit, dalidation_columns, dalidation_check) {
    var data_table = $('table.data-excel > tbody');
    var rows = $('tr', data_table);
    var oj = {};
    $(rows).each(function (index, row) {
        //if (index == 0) {//not get data row the first
        //    $(row).find('td').addClass('not_get');
        //    $(row).find('td').attr('allow', 'false');
        //    $(row).find('td').css({ 'color': '' });
        //}
        if (index >= 0) {
            $(row).find('td').each(function (index_td, data_td) {
                var column_name = $(data_td).attr('aria-describedby');
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
                
                // get data google address
                if (column_name.indexOf('Đ/c GH') != -1) {
                    //google_address($(this), $(this).html());
                    get_address($(this), $(this).html());
                }
            });
            var a = GetLadingModel(row);
            validation_row(row);
            //check price
            calculator(row);
        }
        //
    });
}

function add_error_system() {
    //var message = '<div class="message_systems"></div>';
    //$('table tbody tr td:last-child').html(message);
    //$('.message_systems').on('click', function () {
    //    sys.ConfirmDialog("Xác nhận", "Bạn Chắc Muốn Xóa?", function (eventa) {
    //        $(this).closest('tr').remove();
    //        console.log('BB:' + $(this).closest('tr').text());
    //    });
    //});
    var message = '<div class="message_systems" onclick="deleteRow(this)"></div>';
    $('table tbody tr td:last-child').html(message);
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
        if ($(this).attr('aria-describedby').indexOf('Đ/c GH') != -1) {
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

function validation_address(value) {
    var intRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!intRegex.test(value)) {
        return [false, 'Địa chỉ(' + value + ') không hợp lệ (Google Map sẽ giúp bạn lấy vị trí gần nhất)!'];
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
    var _district_id = $(_this).attr('district_id');
    var _hub_id = $(_this).attr('hub_id');
    var _state_name = $(_this).attr('state_name');
    if (!validation_not_null(_state_name, 1, 100)[0])
        return result;
    // else if (!validation_not_null(_district_name, 1, 100)[0])
    //     return result;
    //else if (!validation_not_null(_district_id, 1, 100)[0])
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
            if (elementOfArray.code == code) {
                result = [true, elementOfArray.id];
            }
        });
    }
    return result;
}
function validation_TypePayCode(code) {
    var result = [false, 'Mã hình thức thanh toán chưa đúng, vui lòng kiểm tra lại!'];
    $.map(_TypePayCode, function (elementOfArray, indexInArray) {
        if (elementOfArray.code == code) {
            result = [true, elementOfArray.id];
        }
    });
    return result;
}

function save_text() {
    var $cell = $('table.data-excel > tbody > tr > td.active-edit');
    $cell.html($('.form-edit-cell .edit-text').val());
    if ($('.form-edit-cell .edit-text').attr('class').indexOf('google_address') >= 0) {
        google_address($cell, $('.google_address').val());
        // console.log('BB: ' + $('.google_address').val());
    }
    var row_data = $cell.parent();
    validation_row(row_data);
    calculator(row_data);
    //
    $('.form-edit-cell').hide();
    $('.edit-triangle').hide();
    $('.form-edit-cell .edit-text').val('');
    $cell.removeClass('active-edit');
    $cell.focus();
}

function click_edit_cell(e, _this) {
    var $control_edit_text = $('.form-edit-cell .edit-text');
    $('.form-edit-cell').show();
    $('.edit-triangle').show();
    $('table.data-excel > tbody > tr > td').removeClass('active-edit');
    $(_this).addClass('active-edit');
    if ($(_this).attr('aria-describedby').indexOf('Đ/c GH') >= 0) {
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
    $control_edit_text.val($(_this).html());
    $control_edit_text.focus();
}

function initMap() {
    var options = {
        componentRestrictions: { 'country': ['vi', 'vn'] }
    };
    var input = document.getElementById("google_address");
    var autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            window.alert("Không tìm thấy địa chỉ: '" + place.name + "'");
            return;
        }
    });
}

function removeMap() {
    var input = document.getElementById("google_address");
    google.maps.event.clearInstanceListeners(input);
}

function google_address(_this, address) {
    var address_google = address;
    if (address_google === null || address_google === '' || address_google === 'undefined') {
        address_google = $('.google_address').val();
    }
    var componentForm = {
        street_number: 'short_name',
        route: 'short_name',//đường
        locality: 'short_name',
        sublocality_level_1: 'short_name',//phường xã
        administrative_area_level_3: 'short_name',//phường xã
        administrative_area_level_2: 'short_name',//Quận huyện
        administrative_area_level_1: 'short_name',//Tỉnh thành
        country: 'short_name',//Quốc gia
        postal_code: 'short_name'
    };
    //
    if (address_google === null | address_google === '' | address_google === 'undefined') {
        return;
    }
    var lat = 0, lng = 0, district_name = '', state_name = '', ward_name = '';
    $.ajax({
        url: 'https://maps.googleapis.com/maps/api/geocode/json',
        data: {
            sensor: false,
            address: address_google,
            key: KeyGoogle
        },
        dataType: 'json',
        success: function (data, textStatus) {
            //console.log(data.results[0].address_components);
            var address = data.results[0];
            if (!data.results[0] || !data.results[0].geometry) {
                //window.alert("Không tìm thấy thông tin địa chỉ: '" + address_google + "'");
                // return;
            } else {
                var locationTo = data.results[0].geometry.location;
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
                        if (addressType == "sublocality_level_1") {
                            ward_name = address.address_components[i][componentForm[addressType]];
                        }
                    }
                }
            }
        },
        async: false
    });
    if (state_name == null || state_name == '' || district_name == null || district_name == '' || ward_name == null || ward_name == '') {
        $.ajax({
            url: 'https://maps.googleapis.com/maps/api/geocode/json',
            data: {
                sensor: false,
                latlng: lat + ',' + lng,
                key: KeyGoogle
            },
            dataType: 'json',
            success: function (data, textStatus) {
                //console.log(data.results[0].address_components);
                var address = data.results[0];
                if (!data.results[0] || !data.results[0].geometry) {
                    //window.alert("Không tìm thấy thông tin địa chỉ: '" + address_google + "'");
                    // return;
                } else {
                    var locationTo = data.results[0].geometry.location;
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
                }
            },
            async: false
        });
    }
    var district_id = 0, state_id = 0; ward_id = 0; hub_id = 0;
    var provinceId = "null"; districtId = "null"; wardId = "null"; countryId = "null";
    if (state_name != "" && state_name != null) {
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
    // var district_id = 0, state_id = 0; ward_id = 0; hub_id = 0;
    // $.when(sys.CallAjaxasync(apiCustomer + '/province/GetProvinceByName', { name: state_name }, token)).done(function (data1) {
    //     if (data1.isSuccess) {
    //         var pro = data1.data;
    //         state_id = pro.id;
    //         $.when(sys.CallAjaxasync(apiCustomer + '/district/GetDistrictByName', { name: district_name, provinceId: state_id }, token)).done(function (data2) {
    //             if (data2.isSuccess) {
    //                 var dis = data2.data;
    //                 district_id = dis.id;
    //                 $.when(sys.CallAjaxasync(apiCustomer + '/ward/GetWardByName', { name: ward_name, districtId: district_id }, token)).done(function (data3) {
    //                     if (data3.isSuccess) {
    //                         var ward = data3.data;
    //                         ward_id = ward.id;
    //                         $.when(sys.CallAjaxasync(apiCustomer + '/hub/GetHubByWardId', { wardId: ward_id }, token)).done(function (data4) {
    //                             if (data4.isSuccess && data4.data != null) {
    //                                 var hub = data4.data;
    //                                 hub_id = hub.id;
    //                             }
    //                             _this.attr('district_id', district_id);
    //                             _this.attr('state_id', state_id);
    //                             _this.attr('ward_id', ward_id);
    //                             _this.attr('hub_id', hub_id);
    //                             _this.attr('lat', lat);
    //                             _this.attr('lng', lng);
    //                             _this.attr('state_name', state_name);
    //                             _this.attr('district_name', district_name);
    //                         });
    //                     }
    //                 });
    //             }
    //         });
    //     }
    // });
}
function get_address(_this, address) {
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