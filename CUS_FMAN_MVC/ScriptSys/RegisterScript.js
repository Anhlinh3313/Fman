
var lblmessage = $('.lblmessage');
var message = lblmessage.find('.message');
$(document).ready(function () {
    $('input').iCheck({
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
        increaseArea: '20%' // optional
    });
    GetBankAll();
    _LoadProvince();
    //GetCity();
    initMap();

    $('.btn-register').on('click', function () {
        Register();
    })
    //$('.email').on('change', function () {
    //    checkEmail($(this).val());
    //});
    //
    $('select.bank').on('change', function () {
        GetBranchByBank($(this).val());
    });
    $('select.province').on('change', function () {
        _LoadDistrictByProvince($(this).val());
        $("#cityId").val($(this).val());
        $("#districtId").val("");
        $("#wardid").val("");
    });
    $('select.district').on('change', function () {
        _LoadWardByDistrict($(this).val());
        $("#districtId").val($(this).val());
        $("#wardid").val("");
    });
    $('select.ward').on('change', function () {
        $("#wardid").val($(this).val());
    });
    //
    $("select.district").chosen();
    $("select.district").trigger("chosen:updated");
    $("select.ward").chosen();
    $("select.ward").trigger("chosen:updated");
    //
    $("select.bank").chosen();
    $("select.bank").trigger("chosen:updated");
    $("select.branch").chosen();
    $("select.branch").trigger("chosen:updated");
    //
    $('.email').on('change', function () {
        checkEmail($('.email').val());
    });
    $('.phone').keypress(function (evt) {
        var charCode = (evt.which) ? evt.which : event.keyCode
        if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;
        return true;
    })
    $('.phone').on('change', function () {
        if ($('.phone').val() == null || $('.phone').val() == '' || $('.phone').val() < 9) {
            document.getElementById("Phone").focus();
            $('.fa-phone').addClass('icon-error');
            $('.lbl-phone').removeClass('display-none');
            $('.lbl-phone').find('.message').html('Vui lòng nhâp số điện thoại!ít nhất 9 ký tự!');
            return;
        }
        checkNumberPhone($('.phone').val());
    });
});
function Register() {
    var cus = new Object();
    cus.passWord = $('.password').val();
    cus.confirmPassword = $('.confirmPassword').val();
    cus.name = $('.name').val();
    cus.address = $('.address').val();
    cus.adress_CT = $('.address').val();
    cus.companyName = '';
    cus.phoneNumber = $('.phone').val();
    cus.email = $('.email').val();
    cus.userName = $('.email').val();
    cus.lat = $('.lat').val();
    cus.lng = $('.lng').val();
    cus.provinceId = $('.province').val();
    cus.districtId = $('.district').val();
    cus.wardId = $('.ward').val();
    cus.addressNote = $('.address-note').val();
    //
    cus.accountName = $('.account-name').val();
    cus.accountBank = $('.account-bank').val();
    cus.branchId = $('select.branch').val();
    //if (!checkEmail(cus.Email)) {
    //    return;
    //}
    if (cus.name == null || cus.name == '' || cus.name < 5) {
        document.getElementById("CustomerName").focus();
        $('.fa-name').addClass('icon-error');
        $('.lbl-name').removeClass('display-none');
        $('.lbl-name').find('.message').html('Vui lòng nhâp họ tên!');
        return;
    }
    $('.fa-name').removeClass('icon-error');
    $('.lbl-name').addClass('display-none');
    //
    if (cus.phoneNumber == null || cus.phoneNumber == '' || cus.phoneNumber < 9) {
        document.getElementById("Phone").focus();
        $('.fa-phone').addClass('icon-error');
        $('.lbl-phone').removeClass('display-none');
        $('.lbl-phone').find('.message').html('Vui lòng nhâp số điện thoại!ít nhất 9 ký tự!');
        return;
    }
    if (!checkNumberPhone(cus.phoneNumber)) {
        document.getElementById("Phone").focus();
        checkNumberPhone(cus.phoneNumber)
        return;
    }
    $('.fa-phone').removeClass('icon-error');
    $('.lbl-phone').addClass('display-none');
    //
    if (cus.email == null || cus.email == '' || cus.email.length < 5) {
        document.getElementById("Email").focus();
        $('.fa-email').addClass('icon-error');
        $('.lbl-email').removeClass('display-none');
        $('.lbl-email').find('.message').html('Vui lòng nhâp email! ít nhất 5 ký tự!');
        return;
    }
    if (!checkEmail(cus.email)) {
        document.getElementById("Email").focus();
        checkEmail(cus.email)
        return;
    }
    $('.fa-email').removeClass('icon-error');
    $('.lbl-email').addClass('display-none');
    //
    if (cus.passWord == null || cus.passWord == '' || cus.passWord < 5) {
        document.getElementById("PassWord").focus();
        $('.fa-password').addClass('icon-error');
        $('.lbl-password').removeClass('display-none');
        $('.lbl-password').find('.message').html('Vui lòng nhập địa chỉ password, ít nhất 5 ký tự!');
        return;
    }
    $('.fa-password').removeClass('icon-error');
    $('.lbl-password').addClass('display-none');
    //
    if (cus.confirmPassword != cus.passWord) {
        document.getElementById("ConfirmPassword").focus();
        $('.fa-confirmPassword').addClass('icon-error');
        $('.lbl-confirmPassword').removeClass('display-none');
        $('.lbl-confirmPassword').find('.message').html('Mật khẩu xác nhận không chính xác');
        return;
    }
    $('.fa-confirmPassword').removeClass('icon-error');
    $('.lbl-confirmPassword').addClass('display-none');
    //
    if (cus.address == null || cus.address == '' || cus.address < 5) {
        document.getElementById("address").focus();
        $('.fa-address').addClass('icon-error');
        $('.lbl-address').removeClass('display-none');
        $('.lbl-address').find('.message').html('Vui lòng nhâp địa chỉ nhận hàng!');
        return;
    }
    $('.fa-address').removeClass('icon-error');
    $('.lbl-address').addClass('display-none');
    //
    if (cus.provinceId == null || cus.provinceId == '') {
        $("select.province").chosen();
        $('.province-div').find(".chosen-single").addClass('border-error');
        $('.lbl-province').removeClass('display-none');
        $('.lbl-province').find('.message').html('Vui lòng chọn tỉnh thành!');
        return;
    }
    $('.province-div').find(".chosen-single").removeClass('border-error');
    $('.lbl-province').addClass('display-none');
    //
    if (cus.districtId == null || cus.districtId == '') {
        $('.district-div').find(".chosen-single").addClass('border-error');
        $('.lbl-district').removeClass('display-none');
        $('.lbl-district').find('.message').html('Vui lòng chọn Quận huyện!');
        return;
    }
    $('.district-div').find(".chosen-single").removeClass('border-error');
    $('.lbl-district').addClass('display-none');
    //
    if (cus.wardId == null || cus.wardId == '') {
        $('.ward-div').find(".chosen-single").addClass('border-error');
        $('.lbl-ward').removeClass('display-none');
        $('.lbl-ward').find('.message').html('Vui lòng chọn Phường xã!');
        return;
    }
    $('.ward-div').find(".chosen-single").removeClass('border-error');
    $('.lbl-ward').addClass('display-none');
    //
    if (cus.addressNote == null || cus.addressNote == '' || cus.address < 5) {
        document.getElementById("AddressNote").focus();
        $('.fa-address-note').addClass('icon-error');
        $('.lbl-address-note').removeClass('display-none');
        $('.lbl-address-note').find('.message').html('Vui lòng nhâp địa chỉ chi tiết nhận hàng!');
        return;
    }
    $('.fa-address-note').removeClass('icon-error');
    $('.lbl-address-note').addClass('display-none');
    //
    if (cus.accountName != null && cus.accountName != '' || cus.accountBank != null && cus.accountBank != '' || cus.accountBank != null && cus.accountBank != '') {
        if (cus.accountName == null || cus.accountName == '') {
            document.getElementById("AccountName").focus();
            //lblmessage.removeClass('display-none');
            //message.html('Vui lòng nhập tên chủ tài khoản ngân hàng!');
            $('.fa-account-name').addClass('icon-error');
            $('.lbl-account-name').removeClass('display-none');
            $('.lbl-account-name').find('.message').html('Vui lòng nhập tên chủ tài khoản ngân hàng!');
            return;
        }
        $('.fa-account-name').removeClass('icon-error');
        $('.lbl-account-name').addClass('display-none');
        //
        if (cus.accountBank == null || cus.accountBank == '') {
            document.getElementById("AccountBank").focus();
            //lblmessage.removeClass('display-none');
            //message.html('Vui lòng nhập số tài khoản ngân hàng!');
            $('.fa-account-bank').addClass('icon-error');
            $('.lbl-account-bank').removeClass('display-none');
            $('.lbl-account-bank').find('.message').html('Vui lòng nhập số tài khoản ngân hàng!');
            return;
        }
        $('.fa-account-bank').removeClass('icon-error');
        $('.lbl-account-bank').addClass('display-none');
        //
        if (cus.branchId == null || cus.branchId == '') {
        //lblmessage.removeClass('display-none');
        /*message.html('Vui lòng chọn chi nhánh ngân hàng!')*/;
            $('.branch-div').find(".chosen-single").addClass('border-error');
            $('.lbl-branch').removeClass('display-none');
            $('.lbl-branch').find('.message').html('Vui lòng chọn chi nhánh ngân hàng!');
            return;
        }
        $('.branch-div').find(".chosen-single").removeClass('border-error');
        $('.lbl-branch').addClass('display-none');
    }
    //
    lblmessage.addClass('display-none');
    //

    cus.code = sys.BoDauTiengViet(cus.name).split(" ").join("_").toUpperCase();

    sys.Loading();

    $.when(sys.CallAjaxPost(apiCustomer + "/account/Register", cus)).done(function (data) {
        if (data.isSuccess) {
            //lblmessage.removeClass('display-none');
            //lblmessage.html('Đăng ký thông tin khách hàng thành công!');
            sys.HideLoading();
            sys.Alert("Thông báo", "Cám ơn bạn đã đăng ký tài khoản thành công, Bộ phận chăm chăm sóc khách hàng sẽ kích hoạt tài khoản của bạn sau 5 phút", "Đồng ý");
            setTimeout(function () {
                window.location.replace("/dang-nhap.html");
            }, 3000);
        }
        else {
            $('.lbl-email').removeClass('display-none');
            $('.lbl-email').find('.message').html('Đăng ký không thành công, vui lòng kiểm tra lại!!!');
            sys.HideLoading();
            return;
        }
    });
}

function checkEmail(email) {
    lblmessage.addClass('display-none');
    if (!sys.CheckMail(email)) {
        //$('.email').addClass('email-error');
        $('.fa-email').addClass('icon-error');
        $('.lbl-email').removeClass('display-none');
        $('.lbl-email').find('.message').html('Email không đúng định dạng, vui lòng kiểm tra lại!');
        return false;
    } else {
        $('.fa-email').removeClass('icon-error');
        $('.lbl-email').addClass('display-none');
    }
    $.when(sys.CallAjaxasync(apiCustomer + "/Account/CheckEmail", { Email: email })).done(function (data) {
        if (!data.isSuccess) {
            //Load khach hang       
            //$('.email').addClass('email-error');
            $('.fa-email').addClass('icon-error');
            $('.lbl-email').removeClass('display-none');
            $('.lbl-email').find('.message').html(data.message + "");
            return false;
        }
    });
    return true;
}
function checkNumberPhone(numberPhone) {
    lblmessage.addClass('display-none');
    //if (!sys.CheckMail(email)) {
    //    //$('.email').addClass('email-error');
    //    $('.fa-email').addClass('icon-error');
    //    $('.lbl-email').removeClass('display-none');
    //    $('.lbl-email').find('.message').html('Email không đúng định dạng, vui lòng kiểm tra lại!');
    //    return false;
    //} else {
    //    $('.fa-email').removeClass('icon-error');
    //    $('.lbl-email').addClass('display-none');
    //}
    $.when(sys.CallAjaxasync(apiCustomer + "/Account/CheckNumberPhone", { numberPhone: numberPhone })).done(function (data) {
        if (!data.isSuccess) {
            //Load khach hang       
            //$('.email').addClass('email-error');
            $('.fa-phone').addClass('icon-error');
            $('.lbl-phone').removeClass('display-none');
            $('.lbl-phone').find('.message').html(data.message + "");
            return false;
        } else {
            $('.fa-phone').removeClass('icon-error');
            $('.lbl-phone').addClass('display-none');
        }
    });
    return true;
}
function GetCity() {
    $.when(sys.CallAjax(apiCustomer + "/account/GetCity")).done(function (data) {
        if (data !== null) {
            var html = "<option value='0'>Tỉnh</option>";
            $.each(data, function (key, value) {
                html += "<option value='" + value.Code_Local + "'>" + value.LocationName + "</option>";
            });
            $("select.create-city").html(html);
        }
    });
};

var initMap = function () {
    var options = {
        componentRestrictions: { 'country': ['vi', 'vn'] }
    };
    var input = document.getElementById("address");

    var autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.addListener('place_changed', function () {
        $("#cityId").val('');
        $("#districtId").val('');
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            window.alert("Không tìm thấy thông tin địa chỉ: '" + place.name + "'");
            return;
        } else {
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
            $.ajax({
                url: 'https://maps.googleapis.com/maps/api/geocode/json',
                data: {
                    sensor: false,
                    address: place.formatted_address,
                    key: KeyGoogle
                },
                dataType: 'json',
                success: function (data, textStatus) {
                    //console.log(data.results[0].address_components);
                    var address = data.results[0];
                    if (!data.results[0] || !data.results[0].geometry) {
                        window.alert("Không tìm thấy thông tin địa chỉ: '" + place.formatted_address + "'");
                        return;
                    }
                    var locationTo = data.results[0].geometry.location;
                    $("#lat").val(locationTo.lat);
                    $("#lng").val(locationTo.lng);
                    $.ajax({
                        url: 'https://maps.googleapis.com/maps/api/geocode/json',
                        data: {
                            sensor: false,
                            latlng: locationTo.lat + ',' + locationTo.lng,
                            key: KeyGoogle
                        },
                        async: true,
                        dataType: 'json',
                        success: function (data, textStatus) {
                            var addr = data.results[0].address_components;
                            var districtName, stateName, wardName, stateID, districtID, wardID;
                            //
                            const results = data.results.sort((x, y) => y.address_components.length - x.address_components.length);
                            const dataAddress = results[0];
                            let findTypeWard = dataAddress.address_components.filter(x => x.types.find(y => y == "sublocality_level_1"))[0];
                            if (!findTypeWard) {
                                for (const item in results) {
                                    if (results.hasOwnProperty(item)) {
                                        const element = results[item];
                                        let typeWard = element.address_components.filter(x => x.types.find(y => y == "sublocality_level_1"))[0];
                                        if (typeWard) {
                                            dataAddress.address_components.push(typeWard);
                                            break;
                                        }
                                    }
                                }
                            }
                            var addr = dataAddress.address_components;
                            for (var i = 0; i < addr.length; i++) {
                                for (j = 0; j < addr[i].types.length; j++) {
                                    var addressType = addr[i].types;
                                    if (addressType[j] == 'administrative_area_level_1') {
                                        stateName = addr[i][componentForm[addressType[j]]];
                                    }
                                    if (addressType[j] == 'administrative_area_level_2' || addressType[j] == 'locality') {
                                        districtName = addr[i][componentForm[addressType[j]]];
                                    }
                                    if (addressType[j] == "sublocality_level_1" || addressType[j] == "administrative_area_level_3") {
                                        wardName = addr[i][componentForm[addressType[j]]];
                                    }
                                }
                            }

                            var district_id = 0, state_id = 0; ward_id = 0; hub_id = 0;
                            var provinceId = "null"; districtId = "null"; wardId = "null"; countryId = "null";
                            var token = $.cookie('token');
                            $.when(sys.CallAjaxasync(apiCore + '/hub/GetInfoLocation', { provinceName: stateName, districtName: districtName, wardName: wardName, provinceId: provinceId, districtId: districtId, wardId: wardId, countryId: countryId }, null)).done(function (dataInfoLocation) {
                                if (dataInfoLocation.isSuccess && dataInfoLocation.data != null) {
                                    var infoLocation = dataInfoLocation.data;
                                    hub_id = infoLocation.hubId;
                                    state_id = infoLocation.provinceId;
                                    district_id = infoLocation.districtId;
                                    ward_id = infoLocation.wardId;

                                    $('select.province').val(state_id).trigger("chosen:updated").trigger("change");
                                    $("#cityId").val(state_id);

                                    _LoadDistrictByProvince(state_id);
                                    $('select.district').val(district_id).trigger("chosen:updated").trigger("change");
                                    $("#districtId").val(district_id);

                                    _LoadWardByDistrict(district_id);
                                    $('select.ward').val(ward_id).trigger("chosen:updated").trigger("change");
                                    $("#wardid").val(ward_id);
                                }
                            });
                            // Get State
                            //$.when(sys.CallAjaxasync(apiCustomer + "/Province/GetProvinceByName", { name: stateName })).done(function (data) {
                            //    if (data.isSuccess) {
                            //        $("#cityId").val(data.data.id);

                            //        // Get District
                            //        $.when(sys.CallAjaxasync(apiCustomer + "/District/GetDistrictByName", { name: districtName, provinceId: data.data.id })).done(function (res) {
                            //            if (res.isSuccess) {
                            //                $("#districtId").val(res.data.id);

                            //                // Get Ward
                            //                $.when(sys.CallAjaxasync(apiCustomer + "/Ward/GetWardByName", { name: wardName, districtid: res.data.id })).done(function (rs) {
                            //                    if (rs.isSuccess) {
                            //                        $("#wardid").val(rs.data.id);
                            //                    }
                            //                });
                            //            }
                            //        });
                            //    }
                            //});
                        }
                    });
                    //UpdateAmount();
                    //
                }
            });
        };

        return false;
    });
}
function GetBankAll() {
    var html = "";
    $.when(sys.CallAjax(apiCustomer + '/Account/GetBankAll')).done(function (data) {
        html += "<option value='' data-name=''>-- Chọn ngân hàng --</option>";
        if (data.isSuccess) {
            $.each(data.data, function (key, value) {
                html += "<option value='" + value.id + "' data-name='" + value.code + "'>" + value.name + "</option>";
            });
            $("select.bank").html(html);
            $("select.bank").chosen();
            $("select.bank").trigger("chosen:updated");
        }
        else {
            $("select.bank").html(html);
            $("select.bank").chosen();
            $("select.bank").trigger("chosen:updated");
        }
    });
};
function GetBranchByBank(bankId) {
    var html = "";
    $.when(sys.CallAjax(apiCustomer + '/Account/GetBranchBy', { bankId: bankId })).done(function (data) {
        html += "<option value='' data-name=''>-- Chọn chi nhánh ngân hàng --</option>";
        if (data.isSuccess) {
            $.each(data.data, function (key, value) {
                html += "<option value='" + value.id + "' data-name='" + value.code + "'>" + value.name + "</option>";
            });
            $("select.branch").html(html);
            $("select.branch").chosen();
            $("select.branch").trigger("chosen:updated");
        }
        else {
            $("select.branch").html(html);
            $("select.branch").chosen();
            $("select.branch").trigger("chosen:updated");
        }
    });
}
function _LoadProvince() {
    var html = "";
    $.when(sys.CallAjax(apiCustomer + '/province/getProvince')).done(function (data) {
        if (data.isSuccess) {
            html += "<option value=''>-- Chọn tỉnh thành --</option>";
            const results = data.data.sort((x, y) => sys.BoDauTiengViet(y.name) > sys.BoDauTiengViet(x.name) ? -1 : 1);
            $.each(results, function (key, value) {
                html += "<option value='" + value.id + "'>" + value.name + "</option>";
            });
            $("select.province").html(html);
            $("select.province").chosen();
            $("select.province").trigger("chosen:updated");
        }
    });
}
async function _LoadDistrictByProvince(provinceId) {
    var html = "";
    await $.when(sys.CallAjaxasync(apiCustomer + '/district/GetDistrictByProvince', { provinceId: provinceId })).done(function (data) {
        if (data.isSuccess) {
            html += "<option value=''>-- Chọn quận huyện --</option>";
            const results = data.data.sort((x, y) => sys.BoDauTiengViet(y.name) > sys.BoDauTiengViet(x.name) ? -1 : 1);
            $.each(results, function (key, value) {
                html += "<option value='" + value.id + "'>" + value.name + "</option>";
            });

            $("select.district").html(html);
            $("select.district").chosen();
            $("select.district").trigger("chosen:updated");
        }
    });
}
async function _LoadWardByDistrict(districtId) {
    var html = "";
    await $.when(sys.CallAjaxasync(apiCustomer + '/ward/GetWardByDistrict', { districtId: districtId })).done(function (data) {
        if (data.isSuccess) {
            html += "<option value=''>-- Chọn phường xã --</option>";
            const results = data.data.sort((x, y) => sys.BoDauTiengViet(y.name) > sys.BoDauTiengViet(x.name) ? -1 : 1);
            $.each(results, function (key, value) {
                html += "<option value='" + value.id + "'>" + value.name + "</option>";
            });
            $("select.ward").html(html);
            $("select.ward").chosen();
            $("select.ward").trigger("chosen:updated");
        }
    });
}