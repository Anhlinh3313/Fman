var id = $("#id").val();
var code = $("#code").val();

$(function () {

    checkLogin();

    $.when(sys.CallAjaxasync(apiCustomer + "/account/ConfirmResetPassWord?id=" + id + "&code=" + code)).done(function (res) {
        if (res.isSuccess) {
            $("#confirm").removeAttr("hidden");
            $("#confirm").html(`
                <p class="login-box-msg">THIẾT LẬP MẬT KHẨU</p>
                <div>
                    <div class="form-group has-feedback">
                        <input type="password" class="form-control newPassword" name="nhập mật khẩu mới" placeholder="nhập mật khẩu mới" />
                        <span class="glyphicon glyphicon-lock form-control-feedback"></span>
                    </div>
                    <div class="form-group has-feedback">
                        <input type="password" class="form-control confirmPassword" name="nhập lại mật khẩu mới" placeholder="nhập lại mật khẩu mới" />
                        <span class="glyphicon glyphicon-lock form-control-feedback"></span>
                    </div>
                    <div class="form-group has-feedback">
                        <label class="font-red-haze lblmessage display-none" style="color:red"><i class="fa fa-exclamation-triangle"></i> <span class="message">Dữ liệu không hợp lệ!</span></label>
                    </div>

                    <div class="row">
                        <div class="col-xs-6"></div>
                        <div class="col-xs-6">
                            <button type="submit" class="btn btn-primary btn-block btn-flat btn-submit"> <i class="fa fa-lock"></i> Đổi mật khẩu</button>
                        </div>
                    </div>
                </div>
            `)

            $("#checkConfirm").attr("hidden", "hidden");
        }
        else {
            $(".text-error").text("Yêu cầu không hợp lệ hoặc đã hết hạn");
        }
    });

    $('input').keypress(function (e) {
        if (e.which == 13) {
            Submit();
        }
    });

    $(".btn-submit").click(function () {
        Submit();
    })
})

function Submit() {
    //sys.Loading();

    var lblmessage = $('.lblmessage');
    var message = lblmessage.find('.message');

    var newPassword = $('.newPassword').val();
    var confirmPassword = $('.confirmPassword').val();

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

    sys.Loading();

    $.when(sys.CallAjaxPost(apiCustomer + "/account/ResetPassWord", { Id: id, NewPassWord: newPassword, Code: code })).done(function (res) {
        if (res.isSuccess) {
            window.location.replace("/dang-nhap.html");
        }
        else {
            message.html('Yêu cầu không hợp lệ hoặc đã hết hạn!');
        }
        sys.HideLoading();
    });
}

function checkLogin() {
    var userId = $.cookie('userId');
    if (userId > 0) {
        window.location.replace("/quan-ly-don-hang.html");
    } else {
    }
}