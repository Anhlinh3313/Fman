var dtDepartment;
var CusCurrentInfo;
$(document).ready(function () {
    loadProvince();
    $('select.district').chosen().trigger("chosen:updated");
    $('select.ward').chosen().trigger("chosen:updated");
    _selectProvinceChange();
    _selectDistrictChange();
    _selectWardChange();
    //
    GetBankAll();
    $("select.bank").chosen();
    $("select.branch").chosen();
    $('select.bank').on('change', function () {
        GetBranchByBank($(this).val());
    });
    setTimeout(function() {
        GetCurrentInfo();
    }, 500)
    //
    $("#phone").add($("#account-bank")).keypress(function (evt) {
        var charCode = (evt.which) ? evt.which : event.keyCode
        if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;
        return true;
    })
    $('.unlock-btn-bank').on('click', function () {
        if ($('.bank-div').hasClass("bank-div-disabled")) {
            $('.bank-div').removeClass("bank-div-disabled");
            $('.unlock-btn-bank').html("Sửa thông tin chuyển khoản");
            $('.account-name').attr("disabled", true);
            $('.account-bank').attr("disabled", true);
            $('select.bank').attr("disabled", true).trigger("chosen:updated");
            $('select.branch').attr("disabled", true).trigger("chosen:updated");
        } else {
            $('.bank-div').addClass("bank-div-disabled");
            $('.unlock-btn-bank').html("Khóa thông tin chuyển khoản");
            $('.account-name').prop("disabled", false);
            $('.account-bank').prop("disabled", false);
            $('select.bank').prop("disabled", false).trigger("chosen:updated");
            $('select.branch').prop("disabled", false).trigger("chosen:updated");
        }
        
    });
    //
    $('.btn-saveinfo').on('click', function () {
        saveInfo();
    });
    initMap();
    $('.address-department').on("change", function () {
        initMap()
    });
    //
    $(".save-department").on('click', function() {
        var name = $(".name-department").val();
        var format = formatCode(name);
        console.log(format);
    })
    //
    var userId = $.cookie("userId");

    dtReport = $('#department').DataTable({
        ordering: true,
        bFilter: true,
        scrollY: '300px',
        scrollCollapse: true,
        "bLengthChange": false,
        'searching': false,
        pagingType: "full_numbers",
        "language": {
            "lengthMenu": "Hiển thị : _MENU_ vận đơn",
            "emptyTable": "Không tìm thấy địa chỉ nhận khác!",
            "paginate": {
                "previous": "Trở lại", "next": "Tiếp theo", "first": "Trang đầu", "last": "Trang cuối"
            }
        },
        ajax: {
            url: apiCRM + "/CusDepartment/GetByCustomerId",
            contentType: "application/json",
            type: "GET",
            data: function (d) {
                return {
                    customerId: userId,
                }
            }, beforeSend: function (request) {
                if ($.cookie('token')) {
                    request.setRequestHeader("Authorization", "Bearer " + $.cookie('token'));
                }
            },
            dataSrc: "data"
        },
        columns: [
            { data: "id" },
            {
                data: "CustomerId", render: function (data, type, row, meta) {
                    return meta.row + 1;
                }
            },
            { data: "representativeName" },
            { data: "phoneNumber" },
            { data: "address" },
        ],
        columnDefs: [{
            "targets": 0,
            "data": 'id',
            "render": function (data, type, full, meta) {
                var htmlButton = "";
                htmlButton += "<button type='button' class='btn btn-xs btn-success' data-id =" + data + " onclick='DeleteDepartment(" + data + ")' >Xóa</button>";
                return htmlButton;
            }
        }],
    });
    //Location onChange
    function provinceChange() {
        var html = "<option value=''>Chọn quận huyện</option>";
        var token = $.cookie('token');
        $.when(sys.CallAjaxasync(apiCustomer + '/district/GetDistrictByProvince?provinceId=' + $('select.province').val(),
            null,
            token
        )).done(function (data) {
            if (data.isSuccess) {
                const results = data.data.sort((x, y) => sys.BoDauTiengViet(y.name) > sys.BoDauTiengViet(x.name) ? -1 : 1);
                $.each(results, function (key, value) {
                    html += "<option value='" + value.id + "'>" + value.name + "</option>";
                });
            }
            $('select.district').html(html);
            $('select.district').chosen().trigger("chosen:updated");

            $('select.ward').html("<option value=''>Chọn phường xã</option>");
            $('select.ward').chosen().trigger("chosen:updated");
        });
    }
    function districtChange() {
        var html = "<option value=''>Chọn phường xã</option>";
        var token = $.cookie('token');
        $.when(sys.CallAjaxasync(apiCustomer + '/ward/GetWardByDIstrict?districtId=' +  $('select.district').val(),
            null,
            token
        )).done(function (data) {
            if (data.isSuccess) {
                const results = data.data.sort((x, y) => sys.BoDauTiengViet(y.name) > sys.BoDauTiengViet(x.name) ? -1 : 1);
                $.each(results, function (key, value) {
                    html += "<option value='" + value.id + "'>" + value.name + "</option>";
                });
            }
            $('select.ward').html(html);
            $('select.ward').chosen().trigger("chosen:updated");
        });
    }
    function _selectProvinceChange() {
        $('select.province').on('change', function (e) {
            var num = e.delegateTarget.length;
            var a = $('select.province').val();
            for (var i = 1; i < num; i++) {
                var b = e.delegateTarget[i].value
                if (a == e.delegateTarget[i].value) {
                    var id = e.delegateTarget[i].value;
                    $('select.province').val(id);
                    provinceChange();
                }
            }
        });
    }
    function _selectDistrictChange() {
        $('select.district').on('change', function (e) {
            var a = $('select.district').val();
            var num = e.delegateTarget.length;
            for (var i = 1; i < num; i++) {
                if (a == e.delegateTarget[i].value) {
                    var id = e.delegateTarget[i].value;
                    $('select.district').val(id);
                    districtChange();
                }
            }
        });
    }
    function _selectWardChange() {
        $('select.ward').on('change', function (e) {
            var num = e.delegateTarget.length;
            var a = $('select.ward').val();
            for (var i = 0; i < num; i++) {
                if (a == e.delegateTarget[i].value) {
                    var id = e.delegateTarget[i].value;
                    $('select.ward').val(id);
                    getHub(id);

                }
            }
        });
    }
    function getHub(wardId) {
        var token = $.cookie('token');
        $.when(sys.CallAjaxasync(apiCustomer + '/hub/GetHubByWardId', { wardId: $('select.ward').val() }, token)).done(function (data) {
            if (data.isSuccess && data.data != null) {
                var hub = data.data;
                $('.hub-id').val(hub.id);
                return hub.id;
            }
        });
    }
});

function saveInfo() {
    var token = $.cookie('token');
    var lblmessage = $('.lblmessage-update');
    var message = lblmessage.find('.message');

    sys.Loading();
    var objCus = new Object();
    objCus = CusCurrentInfo;
    objCus.name = $('.customer-name').val();
    objCus.phoneNumber = $('.phone').val();
    //objCus.address = $('.address').val();
    objCus.nameEn = $('.company').val();

    if (!objCus.name.trim()) {
        lblmessage.removeClass('display-none');
        message.html('Vui lòng nhập họ tên!');
        sys.HideLoading();
        return;
    }
    if (!objCus.phoneNumber.trim()) {
        lblmessage.removeClass('display-none');
        message.html('Vui lòng nhập số điện thoại!');
        sys.HideLoading();
        return;
    }
    if (!objCus.nameEn.trim()) {
        lblmessage.removeClass('display-none');
        message.html('Vui lòng nhập tên công ty/tên Shop!');
        sys.HideLoading();
        return;
    }
    if ($('.bank-div').hasClass("bank-div-disabled")) {
        objCus.accountBank = $('.account-bank').val();
        objCus.accountname = $('.account-name').val();
        objCus.branchId = $('select.branch').val();

        if (!objCus.accountBank.trim()) {
            lblmessage.removeClass('display-none');
            message.html('Vui lòng nhập số tài khoản!');
            sys.HideLoading();
            return;
        }
        if (!objCus.accountname.trim()) {
            lblmessage.removeClass('display-none');
            message.html('Vui lòng nhập tên tài khoản!');
            sys.HideLoading();
            return;
        }
        if (!objCus.branchId.trim()) {
            lblmessage.removeClass('display-none');
            message.html('Vui lòng chọn ngân hàng!');
            sys.HideLoading();
            return;
        }
    }
    console.log(objCus);
    //$.when(sys.CallAjaxPost(apiCustomer + "/Account/Update", objCus , token)).done(function (data) {
    //    if (data.isSuccess) {
    //        $(".success").html('Chỉnh sửa thông tin đơn hàng thành công').slideDown(1000).delay(5000).slideUp('slow');
    //        $('.account-name').prop("disabled", true);
    //        $('.account-bank').prop("disabled", true);
    //        $('select.bank').prop("disabled", true).trigger("chosen:updated");
    //        $('select.branch').prop("disabled", true).trigger("chosen:updated");
    //        lblmessage.removeClass('display-none');
    //        message.html('Thay đổi thông tin cá nhân thành công!');
    //        sys.HideLoading();
    //    } else {
    //        lblmessage.removeClass('display-none');
    //        message.html('Lỗi! Vui lòng kiểm tra lại.');
    //        sys.HideLoading();
    //    }
    //});
    sys.HideLoading();
}

function toggleChangePassword() {
    let element = $(".change-password");
    let isHidden = element.attr("hidden");

    if (isHidden) {
        element.removeAttr("hidden");
    }
    else {
        element.attr("hidden", "hidden");
    }
}
function toggleAddAddressDepartment() {
    let element = $(".add-address-department");
    let isHidden = element.attr("hidden");

    if (isHidden) {
        element.removeAttr("hidden");
    }
    else {
        element.attr("hidden", "hidden");
    }
}

function changePassword() {
    var oldPassword = $("#oldPassword").val();
    var newPassword = $("#newPassword").val();
    var confirmPassword = $("#confirmPassword").val();

    var lblmessage = $('.lblmessage');
    var message = lblmessage.find('.message');

    var userId = $.cookie('userId');
    var token = $.cookie('token');

    if (!oldPassword.trim()) {
        lblmessage.removeClass('display-none');
        message.html('Vui lòng nhập mật khẩu cũ!');
        return;
    }

    if (!newPassword.trim()) {
        lblmessage.removeClass('display-none');
        message.html('Vui lòng nhập mật khẩu mới!');
        return;
    }

    if (!confirmPassword.trim()) {
        lblmessage.removeClass('display-none');
        message.html('Mật khẩu xác nhận không chính xác!');
        return;
    }

    $.when(sys.CallAjaxPost(apiCustomer + "/account/ChangePassWord", { Id: userId, CurrentPassWord: oldPassword, NewPassWord: newPassword }, token)).done(function (res) {
        if (res.isSuccess) {
            sys.Alert("Thành công", "Đổi mật khẩu thành công", "Xác nhận");

            $("#oldPassword").val('');
            $("#newPassword").val('');
            $("#confirmPassword").val('');

            lblmessage.addClass('display-none');
            message.html('');
        }
        else {
            lblmessage.removeClass('display-none');
            message.html('Mật khẩu cũ không chính xác!');
        }
    });
}

function saveDepartmant() {
    var representativeName = $(".name-department").val();
    var phone = $(".phone-department").val();
    var address = $(".address-department").val();

    var formatName = formatCode(representativeName);
    console.log(formatName);

    var lblmessage = $('.lblmessage-department');
    var message = lblmessage.find('.message');

    var userId = $.cookie('userId');
    var token = $.cookie('token');

    if (!representativeName.trim()) {
        lblmessage.removeClass('display-none');
        message.html('Vui lòng nhập tên người đại diện!');
        return;
    }
    if (!phone.trim()) {
        lblmessage.removeClass('display-none');
        message.html('Vui lòng nhập số điện thoại đại diện!');
        return;
    }
    if (!address.trim()) {
        lblmessage.removeClass('display-none');
        message.html('Vui lòng nhập địa chỉ đại diện!');
        return;
    }
    var object = new Object();
    object.address = address;
    object.code = formatName + "_" + phone;
    object.name = representativeName + " - " + phone;
    object.phoneNumber = phone;
    object.representativeName = representativeName;
    object.customerID = userId;
    object.lat = $(".lat").val();
    object.lng = $(".lng").val();
    object.provinceId = $("select.province").val() ? $("select.province").val() : $(".province-id").val();
    object.districtId = $("select.district").val() ? $("select.district").val() : $(".district-id").val();
    object.wardId = $("select.ward").val() ? $("select.ward").val() : $(".ward-id").val();
    object.hubId = $(".hub-id").val();
    object.AddressNote = $('.address-note').val();
    console.log(object);

    //{ "isEnabled": true, "code": "DSC", "name": "DSC", "representativeName": "DSC", "phoneNumber": "123456789", "address": "123 Lê Thánh Tôn, Bến Nghé, Quận 1, Hồ Chí Minh, Việt Nam", "lat": 10.7747711, "lng": 106.69985020000001, "provinceId": 50, "districtId": 544, "customerID": 4 }
    $.when(sys.CallAjaxPostasync(apiCRM + "/CusDepartment/Create", object, token)).done(function (res) {
        if (res.isSuccess) {
            //sys.Alert("Thành công", "Tạo thành công", "Xác nhận");

            $(".name-department").val('');
            $(".phone-department").val('');
            $(".address-department").val('');

            dtReport.ajax.reload();
        }
        else {
            lblmessage.removeClass('display-none');
        }
    });
}

var initMap = function () {
    var options = {
        componentRestrictions: { 'country': ['vi', 'vn'] }
    };
    var input = document.getElementById('address-department');

    var autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            return;
        } else {
            var token = $.cookie('token');
            $.when(sys.CallAjaxasync(apiCore + '/hub/GetInfoLocationByAddress', { address: place.formatted_address }, token)).done(function (dataInfoLocation) {
                if (dataInfoLocation.isSuccess && dataInfoLocation.data != null) {
                    var infoLocation = dataInfoLocation.data;
                    hub_id = infoLocation.hubId;
                    province_id = infoLocation.provinceId;
                    district_id = infoLocation.districtId;
                    ward_id = infoLocation.wardId;
                    lat = place.geometry.location.lat();
                    lng = place.geometry.location.lng();

                    $('.province-id').val(province_id);
                    $('select.province').val(province_id).trigger("chosen:updated").trigger("change");
                    $('.district-id').val(district_id);
                    $('select.district').val(district_id).trigger("chosen:updated").trigger("change");
                    $('.ward-id').val(ward_id);
                    $('select.ward').val(ward_id).trigger("chosen:updated").trigger("change");
                    $('.hub-id').val(hub_id);
                    $('.lat').val(lat);
                    $('.lng').val(lng);
                } else {

                }
            });
        };
    });
}
function loadProvince() {
    var html = "";
    var token = $.cookie('token');
    $.when(sys.CallAjaxasync(apiCustomer + '/province/getProvince',
        null,
        token
    )).done(function (data) {
        if (data.isSuccess) {
            html += "<option value=''>Chọn tỉnh thành</option>";
            const results = data.data.sort((x, y) => sys.BoDauTiengViet(y.name) > sys.BoDauTiengViet(x.name) ? -1 : 1);
            $.each(results, function (key, value) {
                html += "<option value='" + value.id + "'>" + value.name + "</option>";
            });
            $('select.province').html(html);
            $('select.province').chosen().trigger("chosen:updated");
        }
    });
}
function LoadSenderTo(addressFormat, place) {
    //
    if (addressFormat) {
        $.ajax({
            url: 'https://maps.googleapis.com/maps/api/geocode/json',
            data: {
                sensor: false,
                address: addressFormat,
                key: KeyGoogle
            },
            async: true,
            dataType: 'json',
            success: function (data, textStatus) {
                
            }
        });
    }
}
function formatCode(alias) {
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    str = str.replace(/ + /g, " ");
    str = str.replace(/ /g, "_");
    str = str.trim();
    str = str.toUpperCase();
    return str;
};
function DeleteDepartment(id) {
    console.log(id);
    var token = $.cookie('token');
    sys.ConfirmDialog('Xác nhận', 'Bạn chắc muốn hủy vận đơn này?', function () {
        $.when(sys.CallAjaxPost(apiCRM + '/CusDepartment/delete', { id: id }, token)).done(function (data) {
            if (data.isSuccess) {
                $(".success").html('Đã hủy địa chỉ lấy hàng thành công thành công').slideDown(1000).delay(5000).slideUp('slow');
                dtReport.ajax.reload();
            } else {
                $(".error").html('Hủy địa chỉ lấy hàng thất bại. Vui lòng thử lại sau!').slideDown(1000).delay(5000).slideUp('slow');
            }
        });
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
function GetCurrentInfo() {
    var token = $.cookie('token');
    $.when(sys.CallAjaxasync(apiCustomer + '/Account/GetCurrentInfo', null, token)).done(function (data) {
        if (data.isSuccess) {
            var info = data.data;
            CusCurrentInfo = info;
            $('.name').html(info.name);
            $('.nameEn').html(info.nameEn);
            $('.name').val(info.name);
            $('.phone').val(info.phoneNumber);
            $('.addressEn').val(info.address);
            $('.address').val(info.address);
            $('.nameEn').val(info.nameEn);
            $('.email').val(info.email);
            $('.account-name').val(info.accountname);
            $('.account-bank').val(info.accountBank);
            if (info.branch) {
                setTimeout(function () {
                    $('select.bank').val(info.branch.bankId).trigger("chosen:updated").trigger("change");
                    GetBranchByBank(info.branch.bankId);
                    setTimeout(function () {
                        $('select.branch').val(info.branchId).trigger("chosen:updated").trigger("change");
                    }, 500);
                }, 500);
            }
            //$('select.bank').val(info.branch ? info.branch.bankId : "");
            //$('select.branchId').val(info.branchId);
        }
    });
}