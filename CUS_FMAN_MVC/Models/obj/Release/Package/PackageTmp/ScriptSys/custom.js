$(function () {
    $('.datepicker').datepicker({ dateFormat: 'dd-mm-yy' });
    $('.content-wrapper').height($(window).height() - $('.navbar-static-top').height() - $('.logo').height());
    $('.content-wrapper').css('min-height', ($(window).height() - $('.navbar-static-top').height() - $('.logo').height()) + 'px');
    $('.btn-tracking').on('click', function () {
        var trackingNumber = $('.trackingNumber').val();
        if (trackingNumber) {
            ViewDetail(trackingNumber);
            $('.trackingNumber').val('');
        }
    });
    $('.trackingNumber').keyup(function (e) {
        if (e.keyCode == 13) {
            var trackingNumber = $('.trackingNumber').val();
            if (trackingNumber) {
                ViewDetail(trackingNumber);
                $('.trackingNumber').val('');
            }
        }
    });
});
/* form */
$(function st_form() {
    $('.inputField').each(function () {
        var $inputField = $(this);
        var $input = $(this).find('.inputText');
        var $inputBut = $(this).find('.inputBut');
        $input.focus(function () {
            $inputField.addClass('focus');
        });
        $input.focusout(function () {
            $inputField.removeClass('focus');
        });
        $inputBut.hover(function () {
            $inputField.addClass('focus');
        });
        $inputBut.mouseleave(function () {
            $inputField.removeClass('focus');
        });
    });
    $('.inputFields').each(function () {
        var $inputField = $(this);
        var $input = $(this).find('.inputText');
        var $inputBut = $(this).find('.inputBut');
        if ($input.val() != '' && $inputBut.val() != '') {
            $inputField.addClass('active');
        };
        $input.focus(function () {
            $inputField.addClass('active focus');
        });
        $input.focusout(function () {
            $inputField.removeClass('focus');
            if ($(this).val() != '') {
                $inputField.addClass('active');
            } else {
                $inputField.removeClass('active');
            };
        });
        $inputBut.hover(function () {
            $inputField.addClass('active focus');
        });
        $inputBut.mouseleave(function () {
            $inputField.removeClass('focus');
            if ($input.val() != '') {
                $inputField.addClass('active');
            } else {
                $inputField.removeClass('active');
            };
        });
    });
    $('.st-select').each(function () {
        var $select = $(this).find('.chosen-container');
        var $label = $(this).find('.label');
        $select.hover(function () {
            $label.addClass('orange');
        });
        $select.mouseleave(function () {
            $label.removeClass('orange');
        });
    });
    $('.checkbox-inline').each(function () {
        var $check = $(this);
        $check.hover(function () {
            $check.addClass('orange');
        });
        $check.mouseleave(function () {
            $check.removeClass('orange');
        });
    });
});
$(document).ready(function () {
    $(".inputField").addClass("active");
    $('.printMe').click(function () {
        var divToPrint = document.getElementById('print-content');
        var newWin = window.open('', 'Print-Window');
        newWin.document.open();
        newWin.document.write('<html>');
        newWin.document.write('<head><link rel="stylesheet" href="http://localhost:2637/content/print.css" type="text/css" /></head>');
        newWin.document.write('<body onload="window.print()">' + divToPrint.innerHTML + '</body>');
        newWin.document.write('</html>');
        newWin.document.close();
        setTimeout(function () { newWin.close(); }, 10);
    });

    $('.txt-searchG').on("change", function () {
        searchG();
    });
});

//Khi table không có dữ liệu gọi hàm này
function NoData(content, sms) {
    var htm = "";
    htm += '<div class="order-items ">';
    htm += '    <div class="ember-view no-result center">';
    htm += '        <span class="no-result__image ic-no-order"></span>';
    htm += '        <div class="center no-result__text">' + sms + '</div>';
    htm += '    </div>';
    htm += '</div>';
    $(content).html(htm);
};

//Hàm hiện thông tin chi tiết vận đơn
function ViewDetail(shipmentNumber) {
    sys.Loading();
    var cols = 'Service,Structure,ShipmentStatus,FromHub,ToHub,ShipmentServiceDVGTs,PaymentType';
    $.when(sys.CallAjaxasync(apiCustomer + '/shipment/tracking', { shipmentNumber: shipmentNumber, cols: cols })).done(function (data) {
        if (data.isSuccess) {
            var Lading = data.data;
            $(".btn-view-detail").click();
            $(".detail-create-date").text(Lading.orderDate);
            if (Lading.endDeliveryTime != '' && Lading.endDeliveryTime != null) {
                $(".detail-receive").text(Lading.realRecipientName);
                $(".detail-finish-date").text(Lading.endDeliveryTime);
                $('.imageSignal').removeClass('display-none');
                $('.imageSignal').attr('href', '#' + Lading.shipmentNumber);
            }
            else {
                $(".detail-receive").text("Đang phát");
                $(".detail-finish-date").text("--:-- --/--/----");
                $('.imageSignal').addClass('display-none');
            }
            $(".detail-from-hub").text(Lading.fromHub.name);
            $(".detail-to-hub").text(Lading.toHub.name);
            $(".detail-sender-name").text(Lading.senderName);
            $(".detail-from-address").text(Lading.pickingAddress);
            $(".detail-from-phone").text(Lading.senderPhone);
            $(".detail-weight").text(Lading.weight + '(kg)');
            $(".detail-service-name").text(Lading.service ? Lading.service.name : "");
            $(".detail-code").text(Lading.shipmentNumber);
            $(".detail-recipient-name").text(Lading.receiverName);
            $(".detail-recipient-phone").text(Lading.receiverPhone);
            $(".detail-recipient-address").text(Lading.shippingAddress);
            $(".detail-description").text(Lading.content);
            $(".detail-noted").text(Lading.cusNote);
            $(".detail-payment-name").text(Lading.paymentType != null ? Lading.paymentType.name : "-- không --");
            $(".detail-status").text(Lading.shipmentStatus.name);
            var serviceDVGTs = "";
            if (Lading.shipmentServiceDVGTs.length > 0) {
                $.each(Lading.shipmentServiceDVGTs, function (i, v) {
                    if (Lading.shipmentServiceDVGTs.length == i + 1) {
                        serviceDVGTs += v.serviceDVGT.name
                    } else {
                        serviceDVGTs += v.serviceDVGT.name + ', '
                    }
                });
            }
            $(".detail-support-service").text(serviceDVGTs);
            $(".detail-amount").text(formatMoney((Lading.totalPrice), 00) + 'đ');//tổng tiền
            $(".detail-pricemain").text(formatMoney((Lading.defaultPrice), 00) + 'đ');//cước phí
            $(".detail-ppxdprice").text(formatMoney((Lading.fuelPrice), 00) + 'đ');//phụ phí xăng dầu
            $(".detail-vsvxprice").text(formatMoney((Lading.remoteAreasPrice), 00) + 'đ');//phụ phí VSVX
            $(".detail-cod").text(formatMoney((Lading.cod), 00) + 'đ');
            $(".detail-insured").text(formatMoney((Lading.insured), 00) + 'đ');
            $(".detail-otherprice").text(formatMoney((Lading.otherPrice), 00) + 'đ');
            $(".detail-dvgtprice").text(formatMoney((Lading.totalDVGT), 00) + 'đ');
            if (Lading.ladingSchedules.length > 0) {
                var html = '';
                var isSendBack = false;
                $.each(Lading.ladingSchedules, function (k, v) {
                    html += '<tr>';
                    html += '<td data-th="Thời gian" class="text-center">' + v.timeCreated + ' ' + v.dateCreated + '</td>';
                    html += '<td data-th="Nhân viên">' + v.userFullName + (v.userPhone != "" ? ' (' + v.userPhone +')' : "") + '</td>';
                    html += '<td data-th="Địa điểm">' + sys.convertNull(v.location) + '</td>';
                    html += '<td data-th="Trạng thái">' + v.shipmentStatusName + '</td>';
                    html += '<td data-th="Ghi chú" class="text-left">' + sys.convertNull(v.note) + '</td>';
                    html += '</tr>';
                });
                $("#table-history-lading tbody").html(html);
            }
            else {
                $("#table-history-lading tbody").html('<tr><td colspan="5" class="text-center">Không tìm thấy thông tin</td></tr>');
            }
        } else {
            sys.Alert("Thông báo", "Không tìm thấy thông tin mã vận đơn: " + shipmentNumber, 'Kiểm tra lại')
        }
        sys.HideLoading();
    });
};
//Hàm load thông tin thanh toán
function LoadPaymentType(id) {
    var type = "Thanh toán cuối tháng";
    if (id == 1)
        type = "Người nhận thanh toán";
    else if (id == 2)
        type = "Đã thanh toán";
    else if (id == 3)
        type = "Khác";
    return type;
};
//Hàm format ngày tháng
function FormatDate(jsonDate) {
    var fullDate = new Date(parseInt(jsonDate.substring(6)));
    var twoDigitMonth = (fullDate.getMonth() + 1) + ""; if (twoDigitMonth.length === 1) twoDigitMonth = "0" + twoDigitMonth;
    var twoDigitDate = fullDate.getDate() + ""; if (twoDigitDate.length === 1) twoDigitDate = "0" + twoDigitDate;
    var currentDate = twoDigitDate + "/" + twoDigitMonth + "/" + fullDate.getFullYear();
    return currentDate;
}

function formatCurrency(total) {
    var neg = false;
    if (total < 0) {
        neg = true;
        total = Math.abs(total);
    }
    return parseFloat(total, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString() + "đ";
}

function searchG() {
    window.location.href = "/tim-kiem-don-hang.html?code=" + $('.txt-searchG').val();
}