$(function () {
  checkLogin()

  $('input').keypress(function (e) {
    if (e.which == 13) {
      Login()
    }
  })

  $('.btn-login').click(function () {
    Login()
  })
})

function Login () {
  sys.Loading()

  username = $('.username').val(), password = $('.password').val()
  if (!username) {
    //sys.Alert('Thông báo', 'Tài khoản không được để trống', 'Xác nhận')
      $.createDialog({
          attachAfter: '.message-dialog',
          title: 'Thông báo</br> Tài khoản không được để trống!',
          accept: 'Xác nhận',
          acceptStyle: 'red',
          refuseStyle: 'gray',
      });
      $.showDialog();
      if ($("#confirm_dont").html() == "") {
          $("#confirm_dont").addClass("display-none");
      }
    sys.HideLoading()
    return
  }
//   if (!password) {
//     sys.Alert('Thông báo', 'Mật khẩu không được để trống', 'Xác nhận')
//     sys.HideLoading()
//     return
//   }

  $.when(sys.CallAjaxPost(apiCustomer + '/account/SignIn', { userName: username, passWord: password })).done(function (data) {
    if (data.isSuccess) {
        $.cookie('userId', data.data.userId, { expires: 0.5})
        $.cookie('userName', data.data.userName, { expires: 0.5 })
        $.cookie('userFullName', data.data.userFullName, { expires: 0.5 })
        $.cookie('token', data.data.token, { expires: 0.5 })
        window.location.replace('/')
    } else {
        $.createDialog({
            attachAfter: '.message-dialog',
            title: 'Thông báo</br>' + data.message,
            accept: 'Xác nhận',
            acceptStyle: 'red',
            refuseStyle: 'gray',
        });
        $.showDialog();
        //sys.Alert('Thông báo', data.message, 'Kiểm tra lại')
        sys.HideLoading()
    }
  })
}

function checkLogin () {
  var userId = $.cookie('userId')
  if (userId > 0) {
    window.location.replace('/dashboard.html')
  } else {
  }
}