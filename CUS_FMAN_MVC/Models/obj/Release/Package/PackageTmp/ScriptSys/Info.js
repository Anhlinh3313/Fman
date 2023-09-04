$(document).ready(function () {
    $('.btn-saveinfo').on('click', function () {
        saveInfo();
    });
});

function saveInfo() {
    sys.Loading();
    var objCus = new Object();
    objCus.CustomerName = $('.name').val();
    objCus.Phone = $('.phone').val();
    objCus.Adress_CT = $('.address').val();
    objCus.CompanyName = $('.company').val();
    $.when(sys.CallAjaxPost("/Customer/SaveInfo", { cus: objCus })).done(function (data) {
        if (data) {
            $(".success").html('Chỉnh sửa thông tin đơn hàng thành công').slideDown(1000).delay(5000).slideUp('slow');
            sys.HideLoading();
        } else {
            $(".error").html("Lỗi trong quá trình chỉnh sửa thông tin đơn hàng!").show();
            sys.HideLoading();
        }
    });
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