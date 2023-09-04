$(function () {
    checkLogin();
    $('.logout').on('click', function () {
        logOut();
        checkLogin()
    })
})

function checkLogin() {
    var userId = $.cookie('userId');
    var userFullName = $.cookie('userFullName');
    if (userId > 0) {
        $('.customerName').html(userFullName);
    } else {
        window.location.replace("/dang-nhap.html");
    }
}

function logOut() {
    $.removeCookie("userId");
    $.removeCookie("userName");
    $.removeCookie("userFullName");
    $.removeCookie("token");
}