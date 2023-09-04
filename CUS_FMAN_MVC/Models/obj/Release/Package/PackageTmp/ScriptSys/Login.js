$(function () {
    checkLogin();

    $('input').keypress(function (e) {
        if (e.which == 13) {
            Login();
        }
    });

    $(".btn-login").click(function(){
        Login();
    })
})

function Login() {
    sys.Loading();
    username = $('.username').val(), password = $('.password').val();
    $.when(sys.CallAjaxPost(apiCustomer + "/account/SignIn", { userName: username, passWord: password })).done(function (data) {
        if (data.isSuccess) {
            $.cookie("userId", data.data.userId, { expires: 7 });
            $.cookie("userName", data.data.userName, { expires: 7 });
            $.cookie("userFullName", data.data.userFullName, { expires: 7 });
            $.cookie("token", data.data.token, { expires: 7 });
            window.location.replace("/dashbroad.html");
        } else {
            sys.Alert("Thông báo", data.message, "Kiểm tra lại");
            sys.HideLoading();
        }
    });
}

function checkLogin() {
    var userId = $.cookie('userId');
    if (userId > 0) {
        window.location.replace("/dashbroad.html");
    } else {
    }
}