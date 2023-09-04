var status = 0;
$(document).ready(function () {
    var today = new Date();
    var strDate = (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear();
    $(".search-from-date").val(strDate);
    $(".search-to-date").val(strDate);
    Search(0, parseInt($("#tab" + status + " .ctl-show-data .selectPageContent").find("option:selected").val()));
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $(e.target).attr("aria-controls") // activated tab
        status = target;
        Search(0, parseInt($("#tab" + status + " .ctl-show-data .selectPageContent").find("option:selected").val()));
    });
    $(".search-from-date").on("change", function (event) {
        event.preventDefault();
        Search(0, parseInt($("#tab" + status + " .ctl-show-data .selectPageContent").find("option:selected").val()));
    });
    $(".search-to-date").on("change", function (event) {
        event.preventDefault();
        Search(0, parseInt($("#tab" + status + " .ctl-show-data .selectPageContent").find("option:selected").val()));
    });
    ////export excel all bang ke
    $(".btn-excel").on("click", function (event) {
        event.preventDefault();
        $("#tab" + status + " .ctl-show-data table.table-tracking").table2excel({
            // exclude CSS class
            exclude: ".noExl", //class nay dung de bo qua dong khong can export, set class cho dong do
            name: "Excel Document Name",
            filename: "Danh-Sach-Van-Don", //filename export
            fileext: ".xls",
            exclude_img: true,
            exclude_links: true,
            exclude_inputs: true
        });
    });
    $(".cball").on("change", function () {
        var isprint = $(this).is(':checked');
        $('.cbPrint').each(function (index) {
            $(this).prop('checked', isprint);
        });
    });//check all
    $('.btn-print').on("click", function () {
        var list = "";
        $('.cbPrint').each(function (index) {
            if ($(this).is(':checked')) {
                list += $(this).attr("id") + "//";
            }
        });
        if (list.length > 0) {
            PrintBill(list);
        } else {
            sys.Alert("Thông báo", "Vui lòng chọn vận đơn cần In!", "Đóng");
        }
    });
});
//Hàm get value search
function GetParameterSearch() {
    var customer = new Object();
    customer.FromDate = $(".search-from-date").val();
    customer.ToDate = $(".search-to-date").val();
    customer.ListStatus = status;
    customer.SenderId = 0;
    return customer;
};

//hàm search
function Search(currentPage, sizePage) {
    var data = GetParameterSearch();
    data.sizePage = sizePage;
    data.curentPage = sys._setSkip(currentPage);
    sys.Loading();
    CountStatusLading();
    $.when(sys.CallAjaxPost("/Lading/Search", data)).done(function (response) {
        if (response != null) {
            var html = '';
            var stt = 0;
            if (response.ListSearchLading.length > 0) {
                $.each(response.ListSearchLading, function (k, v) {
                    stt++;
                    html += '<tr>';
                    html += '<td data-th="check" class="text-center"><label> <div class="checker"><span><input id="' + v.Id + '" class="cbPrint" type="checkbox"></span></div></label></td>';
                    html += '<td data-th="STT" class="text-center">' + stt + '</td>';
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
                $("#tab" + status + " .ctl-show-data table.table-tracking").find("tbody").html(html).fadeIn("slow");
                //Show phân trang
                sys._PageNumberAjax($("#tab" + status + " .ctl-show-data"), currentPage, response.TotalRow, sizePage, Search);

                $("#tab" + status + " .dataTables_wrapper").removeClass("display-none");
                $("#tab" + status + " .order-items").addClass("display-none");
            }
            else {
                $("#tab" + status + " .dataTables_wrapper").addClass("display-none");
                $("#tab" + status + " .order-items").removeClass("display-none");
            }
        }

        sys.HideLoading();
    });
};

//Hàm count lading
function CountStatusLading(data) {
    var data = GetParameterSearch();
    $.when(sys.CallAjaxPost("/Lading/CountStatusLading", data)).done(function (data) {
        $(".tab-flat #MoiTao").html(data.MoiTao);
        $(".tab-flat #DangLayHang").html(data.DangLayHang);
        $(".tab-flat #DaLayHang").html(data.DaLayHang);
        $(".tab-flat #DangTrungChuyen").html(data.DangTrungChuyen);
        $(".tab-flat #LuuKho").html(data.NhapKho);
        $(".tab-flat #DangPhat").html(data.DangPhat);
        $(".tab-flat #ThanhCong").html(data.ThanhCong);
        $(".tab-flat #ChoChuyenHoan").html(data.ChoChuyenHoan);
        $(".tab-flat #ChuyenHoan").html(data.ChuyenHoan);
        $(".tab-flat #DaHuy").html(data.DaHuy);
    });
}


function PrintBill(lading) {
    var previewWindow = window.open('about:blank', '', '', false);
    var htmlContent = "<html><head><link  href='http://mvc3.SHIPNHANH.vn/Content/css/PrintBill/printbill.css' rel='stylesheet' type='text/css'  media='screen, print' />";
    htmlContent += "</head>";
    htmlContent = htmlContent + "<body>";
    htmlContent = htmlContent + getDataConentHTML(lading.toString());
    htmlContent = htmlContent + "</body></html>";
    //printbill
    previewWindow.document.open();
    previewWindow.document.write(htmlContent);
    previewWindow.document.close();
    setTimeout(function () {
        previewWindow.print();
    }, 200);
    //setTimeout(function () {
    //    previewWindow.close();
    //}, 1000);
}
function getDataConentHTML(strlading) {
    if (strlading !== null) {
        var html = "";
        $.when(sys.CallAjaxasync("/Lading/GetLadingByListID", { lading: strlading })).done(function (data) {
            if (data !== null) {
                $.each(data, function (x, item) {
                    if (item !== null) {
                        html += "<div class='extend-container print_bill'><div class=''>                                        "
                       + "<div class='header_top'>                                                                                      "
                       + "<div class='col-25'>                                                                                          "
                       //+ "<img class='logo' src='http://mvc3.SHIPNHANH.vn/Content/img/Logo.png' />"
                       + "</div>                                                                                                        "
                       + "<div class='col-40'><h3>PHIẾU VẬN ĐƠN</h3></div>                                                              "
                       + "<div class='col-35' style='overflow:initial'>                                        "
                       + "<div class='bar-img'><label class='barcode'>Mã tra cứu vận đơn</label>  " + sys.getbarcode(item.Code) + "</div></div></div>                                     "
                       + "<div class='row'>                                                                                             "
                       + "<div class='col-50'>                                                                                          "
                       + "<div class='content border-right padding-10'>                                                                 "
                       + "<div class='itemp'>                                                                                           "
                       + "<p class='headerp'><span>1.</span> NGƯỜI GỬI: " + item.NameFrom + "</p>                                       "
                       + "<p class='text line_2'><b>Địa chỉ: </b> " + item.AddressFrom + "</p>                  "
                       + "<p class='text'><b>Điện thoại: </b> " + item.PhoneFrom + "</p>                                                            "
                       + "</div>                                                                                                        "
                       + "<div class='itemp'>                                                                                           "
                       + "<p class='headerp'><span>3.</span> THÔNG TIN HÀNG HÓA</p>                                                     "
                       + "<p class='text'><b>Loại sản phẩm: </b> " + (item.Weight < 100 ? 'Tài liệu' : 'Hàng hóa') + "</p>                                                           "
                       + "<p class='text'><b>Số lượng: </b> " + item.Number + "</p>                                                                       "
                       + "<p class='text'><b>Trọng lượng: </b> " + item.Weight + " (kg)</p>                                                             "
                       + "<p class='text'><b>Khai giá: </b> " + formatMoney(item.Insured, 00) + " đ</p>                                                                "
                       + "</div>                                                                                                        "
                       + "<div class='itemp'>                                                                                           "
                       + "<p class='headerp'><span>5.</span> THÔNG TIN CƯỚC PHÍ</p>                                                     "
                       + "<p class='text'><b>Cước dịch vụ: </b> " + formatMoney(item.Amount, 00) + " đ</p>                                                             "
                       + "<p class='text'><b>Dịch vụ cộng thêm: </b> " + formatMoney(item.CODPrice + item.InsuredPrice + item.THBBPrice + item.HHKGPercent + item.BPPrice) + " đ</p>                                                        "
                       + "<p class='text'><b>Tổng số tiền thu hộ: " + formatMoney(item.COD, 00) + " đ</b></p>                                                     "
                       + "</div>                                                                                                        "
                       + "</div>                                                                                                        "
                       + "</div>                                                                                                        "
                       + "<div class='col-50'>                                                                                          "
                       + "<div class='content border-bottom  padding-10'>                                                               "
                       + "<div class='itemp'>                                                                                           "
                       + "<p class='headerp'>                                                                                           "
                       + "<span>2.</span> NGƯỜI NHẬN: " + item.NameTo + "                                          "
                       + "</p>                                                                                                          "
                       + "<p class='text line_2'>                                                                                       "
                       + "<b>Địa chỉ: </b> " + item.AddressTo + "                                             "
                       + "</p>                                                                                                          "
                       + "<p class='text'>                                                                                              "
                       + "<b>Điện thoại: </b> " + item.PhoneTo + "                                                                                "
                       + "</p>                                                                                                          "
                       + "</div>                                                                                                        "
                       + "<div class='itemp'>                                                                                           "
                       + "<p class='headerp'><span>4.</span> Dịch vụ: " + item.ServiceName + "</p>                                             "
                       + "<p class='text'><b>Dịch vụ cộng thêm: </b> " + item.AnotherServiceName + "</p>                                           "
                       + "</div>                                                                                                        "
                       + "</div>                                                                                                        "
                       + "<div class='col-100'>                                                                                         "
                       + "<div class='col-50'>                                                                                          "
                       + "<div class='text_center content padding-5 border-right'>                                                      "
                       + "<p>Giờ gửi: " + sys.formatDateTime(item.CreateDate, 'hh:mm') + "</p>                                                                                         "
                       + "<p>Ngày gửi: " + sys.formatDateTime(item.CreateDate, 'dd/kk/yy') + "</p>                                                                                   "
                       + "<p class='signal'>Ký và ghi rõ họ tên</p>                                                                     "
                       + "</div>                                                                                                        "
                       + "</div>                                                                                                        "
                       + "<div class='col-50'>                                                                                          "
                       + "<div class='text_center content padding-5'>                                                                   "
                       + "<p>Giờ nhận: ...:...</p>                                                                                      "
                       + "<p>Ngày nhận: .../.../" + $.datepicker.formatDate('yy', new Date()) + "</p>                                                                                "
                       + "<p class='signal'>Ký và ghi rõ họ tên</p></div></div></div></div></div>                                       "
                       + "<div class='row'>                                                                                             "
                       + "<div class='col-100 content border-bottom border-top padding-10''>                                            "
                       + "<p class='notep'>(*)<b>Lưu ý: </b>Vui lòng kiểm tra hàng trước khi ký, không khiếu nại đối với bill đã ký.</p>"
                       + "</div>                                                                                                        "
                       + "<div class='col-100 content padding-10''>                                                                     "
                       + "<p class='pull-left'><b>Hotline chăm sóc khách hàng: 043.785.1155 - 093.634.1179</b></p>                      "
                       + "<p class='pull-right'><b>Email: <span id='EmailCompany'>cskh@vietstar.vn<span></b></p>                                                     "
                       + "</div>                                                                                                        "
                       + "</div>                                                                                                        "
                       + "</div></div>                                                                                                         "
                        + "<div class='break-page'></div>                                                                                                        ";
                    }
                });
            }
        });
    }
    return html;
}