$(document).ready(function () {
    loadService();
    $(".btn-search").on("click", function (event) {//Nút tìm kiếm click
        var stt = 0;
        Search(0, parseInt($(".ctl-show-data .selectPageContent").find("option:selected").val()));
    });
    /*function widget support*/
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

});
function loadService() {
    $.when(sys.CallAjaxasync("/Lading/GetService", {})).done(function (data) {
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
    customer.Code = $(".search-code").val();
    customer.RecipientPhone = $(".search-receive").val();
    customer.FromDate = $(".search-from-date").val();
    customer.ToDate = $(".search-to-date").val();
    customer.ListServiceId = new Array();
    $(".search-main-service").each(function () {
        if ($(this).is(':checked')) {
            //customer.ServiceId = $(this).val();
            customer.ListServiceId.push($(this).val());
        }
    });
    customer.AnotherServiceId = new Array();
    $(".search-another-service").each(function () {
        if ($(this).is(':checked')) {
            customer.AnotherServiceId.push($(this).val());
        }
    });
    customer.ListPaymentId = new Array();
    $(".search-payment-type").each(function () {
        if ($(this).is(':checked')) {
            //customer.PaymentId = Number($(this).val());
            customer.ListPaymentId.push($(this).val());
        }
    });
    return customer;
};
//hàm search
function Search(currentPage, sizePage) {
    var data = GetParameterSearch();
    data.sizePage = sizePage;
    data.curentPage = sys._setSkip(currentPage);
    sys.Loading();
    $.when(sys.CallAjaxPost("/Lading/Search", data)).done(function (response) {
        if (response != null) {
            var html = '';
            var stt = 0;
            if (response.ListSearchLading.length > 0) {
                $.each(response.ListSearchLading, function (k, v) {
                    stt++;
                    html += '<tr>';
                    html += '<td data-th="Mã vận đơn" class="text-center">' + v.Code + '</td>';
                    html += '<td data-th="Thời gian gửi" class="text-center">' + v.CreateDateString + '</td>';
                    html += '<td data-th="Người nhận">' + v.RecipientName + '</td>';
                    html += '<td data-th="Tỉnh đi">' + v.CitySendName + '</td>';
                    html += '<td data-th="Tỉnh đến">' + v.CityRecipientName + '</td>';
                    html += '<td data-th="Dịch vụ">' + v.ServiceName + '</td>';
                    html += '<td data-th="Thanh toán">' + LoadPaymentType(v.PaymentType) + '</td>';
                    html += '<td data-th="Tổng tiền" class="text-right">' + formatMoney((v.Amount), 00) + 'đ' + '</td>';
                    html += '<td data-th="Tùy chọn" class="text-center"><button onclick="ViewDetail(' + v.Id + ')" class="btn btn-success btn-xs purple btn-view"><i class="fa fa-edit"></i> Xem</button></td>';
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