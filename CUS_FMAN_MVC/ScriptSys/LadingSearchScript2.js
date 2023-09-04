$(document).ready(function () {
    var today = new Date();
    var strDate = (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear();
    var strDateFrom = (today.getMonth() + 1) + '-01-' + today.getFullYear();
    $(".search-from-date").val(strDateFrom);
    $(".search-to-date").val(strDate);
    //
    loadService();
    $(".btn-search").on("click", function (event) {//Nút tìm kiếm click
        var stt = 0;
        Search(0, parseInt($(".ctl-show-data .selectPageContent").find("option:selected").val()));
    });
    /*function widget support*/
    $('.support-widget').removeClass('open');
    $(function fn_widget() {
        $('.toggle-widget, .close-widget').click(function () {
            $('.support-widget').toggleClass('open');
        });
        $(window).resize(function () {
            if ($(window).width() < 768) {
                $('.support-widget').removeClass('open');
            }
        }).resize();
    });
    $('#search-main-service').multiselect({
        includeSelectAllOption: true,
        selectAllText: 'Chọn tất cả',
        allSelectedText: 'Dịch vụ',
        nonSelectedText: 'Dịch vụ'
    });
    $('#search-another-service').multiselect({
        includeSelectAllOption: true,
        selectAllText: 'Chọn tất cả',
        allSelectedText: 'Dịch vụ GTGT',
        nonSelectedText: 'Dịch vụ GTGT'
    });
    var listCode = getParameterByName('code');
    if (listCode != null && listCode != '') {
        $('.search-code').val(listCode);
        Search(0, parseInt($(".ctl-show-data .selectPageContent").find("option:selected").val()));
    }
});
function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function loadService() {
    $.when(sys.CallAjaxasync("/Lading/GetListMainService", {})).done(function (data) {
        if (data !== null) {
            var html = "";
            var $etHtml = $('.search-main-service').html();
            var count = 0;
            $.each(data, function (i, value) {
                html += "<option value='" + value.ServiceID + "'>" + value.ServiceName + "</option>";
            });
            $('.search-main-service').html(html);
        }
    });
}
//Hàm get value search
function GetParameterSearch() {
    var customer = new Object();
    customer.Code = $(".search-code").val().replace(/\,/g, '/');
    customer.PhoneTo = $(".search-receive").val();
    customer.FromDate = $(".search-from-date").val();
    customer.ToDate = $(".search-to-date").val();
    customer.ListServiceId = new Array();
    $('#search-main-service option').each(function () {
        if ($(this).is(':checked')) {
            customer.ListServiceId.push($(this).val());
        }
    });
    customer.AnotherServiceId = new Array();
    $('#search-main-service option').each(function () {
        if ($(this).is(':checked')) {
            customer.AnotherServiceId.push($(this).val());
        }
    });
    if (customer.Code.trim().length > 0) {
        customer.SenderID = null;
    } else {
        customer.SenderID = 0;
    }
    customer.ListPaymentId = new Array();
    return customer;
};
//hàm search
function Search(currentPage, sizePage) {
    var data = GetParameterSearch();
    data.sizePage = sizePage;
    data.curentPage = sys._setSkip(currentPage);
    sys.Loading();
    $.when(sys.CallAjaxPost("/Lading/SearchTracking", data)).done(function (response) {
        if (response != null) {
            var html = '';
            var stt = 0;
            if (response.ListSearchLading.length > 0) {
                $.each(response.ListSearchLading, function (k, v) {
                    stt++;
                    html += '<tr>';
                    html += '<td data-th="Tùy chọn" class="text-center"><button onclick="ViewDetail(' + v.Id + ')" class="btn btn-success btn-xs purple btn-view"><i class="fa fa-edit"></i> Xem</button></td>';
                    html += '<td data-th="STT" class="text-center">' + stt + '</td>';
                    html += '<td data-th="Mã vận đơn" class="text-center">' + v.Code + '</td>';
                    html += '<td data-th="Thời gian gửi" class="text-center">' + v.CreateDateString + '</td>';
                    html += '<td data-th="Người nhận">' + v.RecipientName + '</td>';
                    html += '<td data-th="Địac chỉ nhận">' + v.AddressTo + '</td>';
                    html += '<td data-th="Điện thoại">' + v.PhoneTo + '</td>';
                    html += '<td data-th="Dịch vụ">' + v.ServiceName + '</td>';
                    html += '<td data-th="Thanh toán">' + LoadPaymentType(v.PaymentType) + '</td>';
                    html += '<td data-th="Tổng tiền" class="text-right">' + formatMoney((v.Amount), 00) + 'đ' + '</td>';
                    html += '</tr>';
                });
                $(".ctl-show-data table.table-tracking").find("tbody").html(html).fadeIn("slow");
                //Show phân trang
                sys._PageNumberAjax($(".dataTables_wrapper"), currentPage, response.TotalRow, sizePage, Search);
                $(".dataTables_wrapper").removeClass("display-none");
                $(".order-items").addClass("display-none");
            }
            else {
                $(".dataTables_wrapper").addClass("display-none");
                $(".order-items").removeClass("display-none");
            }
        }

        sys.HideLoading();
    });
};