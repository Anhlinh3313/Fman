$(document).ready(function () {
    GetBankAll();
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
            $('select.bank').chosen(info.branch ? info.branch.bankId : "").trigger("chosen:updated").trigger("change");
            $('select.branchId').chosen(info.branchId).trigger("chosen:updated").trigger("change");
            //$('select.bank').val(info.branch ? info.branch.bankId : "");
            //$('select.branchId').val(info.branchId);
        }
    });
})