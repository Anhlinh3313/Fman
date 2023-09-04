
var lblmessage = $('.lblmessage');
var message = lblmessage.find('.message');
$(document).ready(function () {
    $('input').iCheck({
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
        increaseArea: '20%' // optional
    });
    //GetCity();
    initMap();

    $('.btn-register').on('click', function () {
        Register();
    })
    //$('.email').on('change', function () {
    //    checkEmail($(this).val());
    //});
});
function Register() {
    var cus = new Object();
    cus.PassWord = $('.password').val();
    cus.ConfirmPassword = $('.confirmPassword').val();
    cus.Name = $('.name').val();
    cus.Address = $('.address').val();
    cus.Adress_CT = $('.address').val();
    cus.CompanyName = '';
    cus.PhoneNumber = $('.phone').val();
    cus.Email = $('.email').val();
    cus.UserName = $('.email').val();
    cus.Lat = $('.lat').val();
    cus.Lng = $('.lng').val();
    cus.ProvinceId = $('.cityid').val();
    cus.DistrictId = $('.districtid').val();
    cus.WardId = $('.wardid').val();
    //if (!checkEmail(cus.Email)) {
    //    return;
    //}
    if (cus.Email == null || cus.Email == '' || cus.Email.length < 5) {
        lblmessage.removeClass('display-none');
        message.html('Vui lòng nhập địa chỉ email!');
        return;
    }
    if (cus.PassWord == null || cus.PassWord == '' || cus.Email.PassWord < 5) {
        lblmessage.removeClass('display-none');
        message.html('Vui lòng nhập địa chỉ password, ít nhất 5 ký tự!');
        return;
    }
    if (cus.ConfirmPassword != cus.PassWord) {
        lblmessage.removeClass('display-none');
        message.html('Mật khẩu xác nhận không chính xác');
        return;
    }
    if (cus.Name == null || cus.Name == '' || cus.Email.Name < 5) {
        lblmessage.removeClass('display-none');
        message.html('Vui lòng nhâp họ tên!');
        return;
    }
    if (cus.PhoneNumber == null || cus.PhoneNumber == '' || cus.Email.PhoneNumber < 9) {
        lblmessage.removeClass('display-none');
        message.html('Vui lòng nhâp số điện thoại!');
        return;
    }
    if (cus.Address == null || cus.Address == '' || cus.Email.Address < 5) {
        lblmessage.removeClass('display-none');
        message.html('Vui lòng nhâp địa chỉ nhận hàng!');
        return;
    }
    if (cus.ProvinceId == null || cus.ProvinceId == '') {
        lblmessage.removeClass('display-none');
        message.html('Thông tin địa chỉ không hợp lệ, hãy để google map định vị giúp bạn!');
        return;
    }
    if (cus.DistrictId == null || cus.DistrictId == '') {
        lblmessage.removeClass('display-none');
        message.html('Thông tin địa chỉ không hợp lệ, hãy để google map định vị giúp bạn!!!');
        return;
    }
    if (cus.WardId == null || cus.WardId == '') {
        lblmessage.removeClass('display-none');
        message.html('Thông tin địa chỉ không hợp lệ, hãy để google map định vị giúp bạn!!!');
        return;
    }
    //
    lblmessage.addClass('display-none');
    //

    cus.Code = sys.BoDauTiengViet(cus.Name).split(" ").join("_").toUpperCase();

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
            lblmessage.removeClass('display-none');
            message.html('Đăng ký không thành công, vui lòng kiểm tra lại!!!');
            sys.HideLoading();
            return;
        }
    });
}
function checkEmail(email) {
    lblmessage.addClass('display-none');
    if (!sys.CheckMail(email)) {
        lblmessage.removeClass('display-none');
        message.html('Email không đúng định dạng, vui lòng kiểm tra lại!');
        return false;
    }
    $.when(sys.CallAjaxasync(apiCustomer + "/Home/CheckMail", { Email: email, CustomerID: 0 })).done(function (data) {
        if (data !== "") {
            if (data) { // neu add new thi controller tra ve id customer
                //Load khach hang       
                lblmessage.removeClass('display-none');
                message.html('Email đã tồn tại, vui lòng kiểm tra lại!');
                return false;
            }
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
                    address: place.formatted_address
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
                            key: 'AIzaSyATzgv59sgNUWPRFGUJF5k8LRKJ291V0mY',
                        },
                        async: true,
                        dataType: 'json',
                        success: function (data, textStatus) {
                            var addr = data.results[0].address_components;
                            var districtName, stateName, wardName, stateID, districtID, wardID;
                            for (var i = 0; i < addr.length; i++) {
                                var addressType = addr[i].types;
                                if (addressType[0] == 'administrative_area_level_1') {
                                    stateName = addr[i][componentForm[addressType[0]]];
                                }
                                if (addressType[0] == 'administrative_area_level_2') {
                                    districtName = addr[i][componentForm[addressType[0]]];
                                }
                                if (addressType[0] == "administrative_area_level_3") {
                                    wardName = addr[i][componentForm[addressType[0]]];
                                }
                            }
                            //$('.address').attr('title', stateName + ', ' + districtName);
                            //$.when(sys.CallAjaxasync("/Home/GetStateIDAndDistrictID", { stateName: stateName, districtName: districtName })).done(function (data) {
                            //    if (data !== null) {
                            //        $("#cityId").val(data.StateID);
                            //        $("#districtId").val(data.DistrictID);
                            //    }
                            //});

                            // Get State
                            $.when(sys.CallAjaxasync(apiCustomer + "/Province/GetProvinceByName", { name: stateName })).done(function (data) {
                                if (data.isSuccess) {
                                    $("#cityId").val(data.data.id);

                                    // Get District
                                    $.when(sys.CallAjaxasync(apiCustomer + "/District/GetDistrictByName", { name: districtName, provinceId: data.data.id })).done(function (res) {
                                        if (res.isSuccess) {
                                            $("#districtId").val(res.data.id);

                                            // Get Ward
                                            $.when(sys.CallAjaxasync(apiCustomer + "/Ward/GetWardByName", { name: wardName, districtid: res.data.id })).done(function (rs) {
                                                if (rs.isSuccess) {
                                                    $("#wardid").val(rs.data.id);
                                                }
                                            });
                                        }
                                    });
                                }
                            });
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