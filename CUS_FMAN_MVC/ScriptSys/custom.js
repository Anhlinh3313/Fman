var deliveryImagePath = "";
var shipmentId = "";

$(function () {
    var token = $.cookie('token');

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
    $('.imageDelivery').on('click', function () {
        //if (deliveryImagePath) {
        //    $.when(sys.CallAjaxasync(apiPost + '/Upload/GetImageByShipmentId', { shipmentId: shipmentId, imageType: 2 }, token)).done(function (data) {
        //        if (data.isSuccess) {
        //            document.getElementById("imgBase64String").src = "data:image/png;base64, " + data.data.fileBase64String;
        //        } else {
        //            $('.imageDelivery').removeClass('display-none');
        //        }
        //    });
        //}
    });
    $('.imageSignal-2').on('click', function () {
        if (deliveryImagePath) {
            $.when(sys.CallAjaxasync(apiPost + '/Upload/GetImageByPath', { imagePath: deliveryImagePath }, token)).done(function (data) {
                if (data.isSuccess) {
                    document.getElementById("imgBase64String").src = "data:image/png;base64, " + data.data.fileBase64String;
                }
            });
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
    var Weight = $.cookie("Weight");
    var token = $.cookie('token');
    sys.Loading();
    //$(".tracking-ShipmentNumber").css("display", "none");
    //$(".tracking-PhoneNumber").css("display", "none");
    var cols = 'Service,Structure,ShipmentStatus,FromHub,ToHub,ShipmentServiceDVGTs,PaymentType,PickUser';
    $.when(sys.CallAjaxasync(apiCustomer + '/shipment/TrackingShipmentNumberAndPhoneNumber', { tracking: shipmentNumber, cols: cols }, token)).done(function (data) {
        if (data.isSuccess && !data.dataCount && data.data != null) {
            //$(".tracking-ShipmentNumber").css("display", "block");
            var Lading = data.data;
            //
            deliveryImagePath = Lading.deliveryImagePath;
            shipmentId = Lading.id;
            //
            $(".btn-view-detail").click();
            $(".detail-create-date").text(Lading.orderDate);
            if (Lading.endDeliveryTime != '' && Lading.endDeliveryTime != null) {
                $(".detail-receive").text(Lading.realRecipientName);
                $(".detail-finish-date").text(Lading.endDeliveryTime);
                $('.imageDelivery').removeClass('display-none');
                $('.imageDelivery').attr('href', '#' + Lading.shipmentNumber);

                $.when(sys.CallAjaxasync(apiPost + '/Upload/GetImageByShipmentId', { shipmentId: shipmentId, imageType: 2 }, token)).done(function (data) {
                    var htmlImage = "";
                    var htmlModel = "";
                    if (data.isSuccess) {
                        //document.getElementById("imgBase64String").src = "data:image/png;base64, " + data.data[0].fileBase64String;
                        var images = data.data;
                       
                        $.each(images, function (index, value) {
                            if (value.fileBase64String) {
                                var fileName = value.fileName.split(".")[0];
                                if (index == 0) {
                                    htmlImage += `<div class="item active">
                                                <img id="` + fileName + `` + index + `" src="data:image/png;base64, ` + value.fileBase64String + `" alt="` + fileName + `" style="width:100%;">
                                            </div>`
                                } else {
                                    htmlImage += `<div class="item">
                                            <img id="` + fileName + `` + index + `" src="data:image/png;base64, ` + value.fileBase64String + `" alt="` + value.fileName + `" style="width:100%;">
                                        </div>`;
                                }
                            } else {
                                $(".carousel-inner-pickup").html("");
                            }
                        })
                        $(".carousel-inner-delivery").html(htmlImage);
                    } else {
                        $('.imageDelivery').addClass('display-none');
                        $(".carousel-inner-delivery").html("");
                    }
                });
            }
            else {
                $(".detail-receive").text("Đang phát");
                $(".detail-finish-date").text("--:-- --/--/----");
                $('.imageDelivery').addClass('display-none');
            }
            $(".detail-from-hub").text(Lading.fromHub ? Lading.fromHub.name : "");
            $(".detail-to-hub").text(Lading.toHub ? Lading.toHub.name : "");
            $(".detail-sender-name").text(Lading.senderName);
            $(".detail-from-address").text(Lading.pickingAddress);
            $(".detail-from-phone").text(Lading.senderPhone);
            $(".detail-weight").text(Lading.weight + '(' + Weight + ')');
            $(".detail-service-name").text(Lading.service ? Lading.service.name : "");
            $(".detail-code").text(Lading.shipmentNumber);
            $(".detail-shop-code").text(Lading.shopCode ? Lading.shopCode : "");
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
                        serviceDVGTs += v.serviceDVGT ? v.serviceDVGT.name : ""
                    } else {
                        serviceDVGTs += v.serviceDVGT ? v.serviceDVGT.name + ', ' : ""
                    }
                });
            }
            $(".detail-support-service").text(serviceDVGTs);
            $(".detail-amount").text(formatMoney((Lading.totalPrice), 00) + 'đ');//tổng tiền
            $(".detail-pricemain").text(formatMoney((Lading.defaultPrice), 00) + 'đ');//cước phí
            $(".detail-ppxdprice").text(formatMoney((Lading.fuelPrice), 00) + 'đ');//phụ phí xăng dầu
            $(".detail-vsvxprice").text(formatMoney((Lading.remoteAreasPrice), 00) + 'đ');//phụ phí VSVX
            $(".detail-cod").text(formatMoney((Lading.cod), 00) + 'đ');
            $(".detail-price-cod").text(formatMoney((Lading.priceCod ? Lading.priceCod : 0), 00) + 'đ');
            $(".detail-insured").text(formatMoney((Lading.insured), 00) + 'đ');
            $(".detail-otherprice").text(formatMoney((Lading.otherPrice), 00) + 'đ');
            $(".detail-dvgtprice").text(formatMoney((Lading.totalDVGT), 00) + 'đ');
            //
            if (Lading.ladingSchedules.length > 0) {
                var html = '';
                var isSendBack = false;
                $.each(Lading.ladingSchedules, function (k, v) {
                    html += '<tr>';
                    html += '<td data-th="Thời gian" class="text-center">' + v.timeCreated + ' ' + v.dateCreated + '</td>';
                    //$.when(sys.CallAjaxasync(apiCore + '/account/get', { id: v.userId }, token)).done(function (dataUser) {
                    //    if (dataUser.data != null) {
                    //        html += '<td data-th="Nhân viên">' + v.userFullName + (dataUser.data.phoneNumber ? ' (' + dataUser.data.phoneNumber + ')' : "") + '</td>';
                    //    } else {
                    //        html += '<td data-th="Nhân viên">' + v.userFullName + '</td>';
                    //    }
                    //})
                    html += '<td data-th="Nhân viên">' + v.userFullName + '</td>';
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
            $.when(sys.CallAjaxasync(apiPost + '/Upload/GetImageByShipmentId', { shipmentId: shipmentId, imageType: 1 }, token)).done(function (data) {
                var htmlImage = ""
                if (data.isSuccess) {
                    var images = data.data;
                    $('.imagePickup').removeClass('display-none');
                    $.each(images, function (index, value) {
                        if (value.fileBase64String) {
                            var fileName = value.fileName.split(".")[0];
                            if (index == 0) {
                                htmlImage += `<div class="item active">
                                                <img id="` + fileName + `` + index + `" src="data:image/png;base64, ` + value.fileBase64String + `" alt="` + fileName + `" style="width:100%;">
                                            </div>`
                            } else {
                                htmlImage += `<div class="item">
                                            <img id="` + fileName + `` + index + `" src="data:image/png;base64, ` + value.fileBase64String + `" alt="` + value.fileName + `" style="width:100%;">
                                        </div>`;
                            }
                        } else {
                            $(".carousel-inner-pickup").html("");
                        }
                    })
                    $(".carousel-inner-pickup").html(htmlImage);
                    //document.getElementById("imgBase64StringPickup").src = "data:image/png;base64, " + data.data[0].fileBase64String;
                } else {
                    $('.imagePickup').addClass('display-none');
                    $(".carousel-inner-pickup").html("");
                }
            });

        }
        else if (data.isSuccess && data.dataCount) {
            //$(".tracking-PhoneNumber").css("display", "block");
            $(".btn-view-detail-phoneNumber").click();
            var html = '';
            var isSendBack = false;
            $.each(data.data, function (k, v) {
                html += '<tr>';
                html += '<td data-th="Mã đơn hàng" width="200px" class="text-center"><a onclick="ViewDetail(\'' + v.shipmentNumber + '\')">' + v.shipmentNumber + '</a></td>';
                html += '<td data-th="Thời gian" width="200px" class="text-center">' + v.orderDate + '</td>';
                html += '<td data-th="Người nhận" width="200px">' + v.receiverName + '</td>';
                html += '<td data-th="Địa điểm" width="300px">' + v.shippingAddress + '</td>';
                html += '<td data-th="Trạng thái" width="200px">' + v.shipmentStatus.name + '</td>';
                html += '</tr>';
            });
            $("#table-tracking-phonenumber tbody").html(html);
        }
        else {
            $.createDialog({
                attachAfter: '.message-dialog',
                title: 'Thông báo</br> Không tìm thấy thông tin mã vận đơn: ' + shipmentNumber,
                accept: 'Kiểm tra lại',
                acceptStyle: 'red',
                refuseStyle: 'gray',
            });
            $.showDialog();
            if ($("#confirm_dont").html() == "") {
                $("#confirm_dont").addClass("display-none");
            }
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