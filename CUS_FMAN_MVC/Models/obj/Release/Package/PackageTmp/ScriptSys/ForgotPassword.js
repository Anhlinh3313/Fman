$(function () {
    checkLogin();

    $('input').keypress(function (e) {
        if (e.which == 13) {
            Submit();
        }
    });

    $(".btn-submit").click(function () {
        Submit();
    })
})

var lblmessage = $('.lblmessage');
var message = lblmessage.find('.message');

function Submit() {
    var email = $('.email').val();

    if (!email.trim()) {
        lblmessage.removeClass('display-none');
        message.html('Vui lòng nhập địa chỉ email!');
        return;
    }

    sys.Loading();

    $.when(sys.CallAjaxPost(apiCustomer + "/account/ForgotPassword", { email: email })).done(function (data) {
        if (data.isSuccess) {
            window.location.replace("/gui-mail-thanh-cong.html");
        } else {
            sys.Alert("Thông báo", data.message, "Kiểm tra lại");
            lblmessage.addClass('display-none');
            message.html('');
            sys.HideLoading();
        }
    });
}

function checkLogin() {
    var userId = $.cookie('userId');
    if (userId > 0) {
        window.location.replace("/danh-sach-don-hang.html");
    } else {
    }
}