var dtReport;
var dataSource = [];
var html = "";
var _this = this;
_this.$el = null;
_this.$template = $('.content-wrapper>.form-horizontal');
_this.$el = _this.$template.clone();
_this.$ShipmentStatus = null;
_this.$ShipmentStatus = _this.$el.find('.shipmentStatus');
_this.$ShipmentStatus.chosen();
$(function () {
    var date = new Date();
    var strDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    $('.form-starDate').val(strDate);
    $('.form-starDate').parent().parent().addClass("active");
    $('.form-EndDate').val(strDate);
    $('.form-EndDate').parent().parent().addClass("active");
    //GetStatusLading();
    _LoadShipmentStatus();
    _LoadPaymentType();
    //
    $('.selectAll').change(function () {
        if ($(this).prop('checked')) {
            $('tbody tr td input[type="checkbox"]').each(function () {
                $(this).prop('checked', true);
            });
        } else {
            $('tbody tr td input[type="checkbox"]').each(function () {
                $(this).prop('checked', false);
            });
        }
    });
    dtReport = $('#listLading').DataTable({
        ordering: true,
        bFilter: true,
        pagingType: "full_numbers",
        "lengthMenu": [[25, 50, 100, 1000000], [25, 50, 100, "Tất cả"]],
        "language": {
            "lengthMenu": "Hiển thị: _MENU_ ",
            "emptyTable": "Không tìm thấy vận đơn trong khoảng thời gian này!",
            "paginate": {
                "previous": "Trở lại", "next": "Tiếp theo", "first": "Trang đầu", "last": "Trang cuối"
            }
        },
        ajax: {
            url: apiCustomer + "/shipment/getListAll",
            contentType: "application/json",
            type: "GET",
            data: function (d) {
                return {
                    pageSize: d.length,
                    pageNumber: d.draw,
                    fromDate: $('.form-starDate').val(),
                    toDate: $('.form-EndDate').val(),
                    shipmentStatus: $("select.TypeStatus")[0].value,
                    paymentType: $("select.PaymentType")[0].value,
                    cols: 'ShipmentStatus,PaymentType'
                }
            }, beforeSend: function (request) {
                if ($.cookie('token')) {
                    request.setRequestHeader("Authorization", "Bearer " + $.cookie('token'));
                }
            },
            dataSrc: "data"
        },
        columns: [
            { data: "id", render: function () { return "<input type='checkbox'></input>"; } },
            { data: "id" },
            {
                data: "shipmentNumber", render: function (data, type, row, meta) {
                    return meta.row + 1;
                }
            },
            { data: "shipmentNumber" },
            { data: "shipmentStatus", className: "", render: function (data) { return data.name } },
            { data: "cod", className: "number", render: function (data) { return (data) } },
            { data: "totalPrice", className: "number", render: function (data) { return (data) } },
            { data: "receiverName" },
            { data: "receiverPhone" },
            { data: "addressNoteTo" },
            { data: "shippingAddress" },
            {
                data: "paymentType", className: "", render: function (data) {
                    if (data) {
                        return data.name
                    } else {
                        return "-- không --"
                    }
                }
            },
            { data: "orderDate", className: "date", render: function (data) { return (data) } },
            { data: "weight", className: "weight", render: function (data) { return (data) } }
        ],
        columnDefs: [{
            "targets": 1,
            "data": 'id',
            "render": function (data, type, full, meta) {

                var htmlButton = "";
                if (full.shipmentStatusId !== 57) {
                    htmlButton += ' <button type="button" class="btn btn-xs btn-success" data-id =' + data + ' onclick="ViewDetail(\'' + full.shipmentNumber + '\')">Xem</button>';
                }
                //if (full.shipmentStatusId === 1 || full.shipmentStatusId === 11 || full.shipmentStatusId === 9 || full.shipmentStatusId === 10 || full.shipmentStatusId === 14 || full.shipmentStatusId === 18 || full.shipmentStatusId === 19) {
                //    htmlButton += ' <button type="button" class="btn btn-xs btn-success" data-id =' + data + ' onclick="ViewEdit(' + data + ')">Sửa</button>';
                //    htmlButton += ' <button type="button" class="btn btn-xs btn-danger" data-id =' + data + ' onclick="DeleteLading(' + data + ')">Hủy</button>';
                //}
                return htmlButton;
            }
        }],
        fnRowCallback: function (nRow, aData, iDisplayIndex) {
            $(nRow).addClass("row_" + aData["id"]);
            $(nRow).attr("id", aData["id"]);
            if (aData['shipmentStatusId'] == 12) {
                $(nRow).addClass("success");
            }
            if (aData['shipmentStatusId'] == 26) {
                $(nRow).addClass("danger");
            }
            if (aData['shipmentStatusId'] == 57) {
                $(nRow).addClass("active");
            }
        },
        order: [[12, "desc"]],
        //dom: 'Bfrtip',
        buttons: [
            {
                extend: 'excel',
                text: '<span class="fa fa-file-excel-o"></span> Xuất Excel',
                exportOptions: {
                    columns: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                    modifier: {
                        search: 'applied',
                        order: 'applied'
                    },
                    format: {
                        body: function (data, row, column, node) {
                            var number = "";
                            if (typeof data === 'string') {
                                number = data.replaceAll('.', '') * 1;
                            }
                            return !isNaN(number) ?
                                number :
                                data;
                        }
                    }
                }
            }]
    });

    $(".btn-excel").on("click", function () {
        var oSettings = dtReport.settings();
        var pageInfo = dtReport.page.info();
        var lengthBefore = pageInfo.length;
        dtReport.page.len(pageInfo.recordsTotal);
        var dataOld = dtReport.rows().data();

        dtReport.ajax.reload(function () {
            dtReport.button().trigger();
            dtReport.page.len(lengthBefore);
            dtReport.clear();
            if (dataOld) {
                dtReport.rows.add(dataOld);
            }
            dtReport.draw();
        }, false);
    });
    $(".btn-search").on("click", function () {
        dtReport.ajax.reload();
    });
    $('.btn-print').on("click", function () {
        var listLaingId = "";
        $('tbody tr td input[type="checkbox"]').each(function () {
            if ($(this).prop('checked')) {
                listLaingId += ($(this).closest('tr').attr('id')) + "//";
            }
        });
        if (listLaingId == "") {
            sys.ErrorAlert('Vui lòng chọn vận đơn để in!');
            return;
        } else {
            PrintBill(listLaingId);
        }
    });
    $("select.TypeStatus").on("change", function () {
        console.log($("select.TypeStatus")[0].value);
    });
});

function GetStatusLading() {
    $.when(sys.CallAjax('/lading/ListStatus')).done(function (data) {
        if (data !== null) {
            var html = "<option value=''>Chọn tất cả</option>";
            $.each(data, function (key, value) {
                html += "<option value='" + value.StatusLadings + "'>" + value.StatusName + "</option>";
            });
            $("select.TypeStatus").html(html);

            $('select.TypeStatus').chosen();
        }
    });
}

function _LoadShipmentStatus() {
    var token = $.cookie('token');
    $.when(sys.CallAjax(apiCustomer + '/ShipmentStatus/getAll', null, token)).done(function (data) {
        if (data !== null) {
            html = "<option value=''>Chọn tất cả</option>";
            $.each(data.data, function (key, value) {
                html += "<option value='" + value.id + "'>" + value.name + "</option>";
            });

            $("select.TypeStatus").val(html).trigger("chosen:updated");
            $("select.TypeStatus").html(html);
            $('select.TypeStatus').chosen();
        }
    });
}

function _LoadPaymentType() {
    var token = $.cookie('token');
    $.when(sys.CallAjax(apiCustomer + '/PaymentType/getAll', null, token)).done(function (data) {
        if (data !== null) {
            html = "<option value=''>Chọn tất cả</option>";
            $.each(data.data, function (key, value) {
                html += "<option value='" + value.id + "'>" + value.name + "</option>";
            });

            $("select.PaymentType").val(html).trigger("chosen:updated");
            $("select.PaymentType").html(html);
            $('select.PaymentType').chosen();
        }
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
    setTimeout(function () {
        //  previewWindow.close();
    }, 1000);
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
                            + "<img class='logo' src='http://dsc.vn/images/clients/VietStar.png' />                                                              "
                            + "</div>                                                                                                        "
                            + "<div class='col-40'><h3>PHIẾU VẬN ĐƠN</h3></div>                                                              "
                            + "<div class='col-35' style='text-align: center;'><label class='barcode'>Mã tra cứu vận đơn(" + item.Code + ")</label>                                         "
                            + "<div class='bar-img'> " + sys.getbarcode(item.Code) + "</div></div></div>                                     "
                            + "<div class='row'>                                                                                             "
                            + "<div class='col-50'>                                                                                          "
                            + "<div class='content border-right padding-10'>                                                                 "
                            + "<div class='itemp'>                                                                                           "
                            + "<p class='headerp'><span>1.</span> NGƯỜI GỬI: " + item.NameFrom + "</p>                                       "
                            + "<p class='text line_2'><b>Địa chỉ: </b> " + item.Adress_CT + "</p>                  "
                            + "<p class='text'><b>Điện thoại: </b> " + item.PhoneFrom + "</p>                                                            "
                            + "</div>                                                                                                        "
                            + "<div class='itemp'>                                                                                           "
                            + "<p class='headerp'><span>3.</span> THÔNG TIN HÀNG HÓA</p>                                                     "
                            + "<p class='text'><b>Loại sản phẩm: </b> " + (item.Weight < 100 ? 'Tài liệu' : 'Hàng hóa') + "</p>                                                           "
                            + "<p class='text'><b>Số lượng: </b> " + item.Number + "</p>                                                                       "
                            + "<p class='text'><b>Trọng lượng: </b> " + item.Weight + " (kg)</p>                                                             "
                            + "<p class='text'><b>Khai giá: </b> " + (item.Insured) + " đ</p>                                                                "
                            + "</div>                                                                                                        "
                            + "<div class='itemp'>                                                                                           "
                            + "<p class='headerp'><span>5.</span> THÔNG TIN CƯỚC PHÍ</p> ";
                        if (item.IsHidePrice) {
                            //
                        } else {
                            html += "<p class='text'><b>Tổng cước dịch vụ: </b> " + (item.Amount) + " đ</p>  ";
                        }
                        html += "<p class='text'><b>Tiền thu hộ: " + (item.COD) + " đ</b></p>";
                        if (item.PaymentType == 2) {
                            html += "<p class='text'><b>Tổng thu: " + ((item.COD + item.Amount)) + " đ</b></p>";
                        } else {
                            html += "<p class='text'><b>Tổng thu: " + (item.COD) + " đ</b></p>";
                        }
                        html += "</div>                                                                                                        "
                            + "</div>                                                                                                        "
                            + "</div>                                                                                                        "
                            + "<div class='col-50'>                                                                                          "
                            + "<div class='content border-bottom  padding-10'>                                                               "
                            + "<div class='itemp'>                                                                                           "
                            + "<p class='headerp'>                                                                                           "
                            + "<span>2.</span> NGƯỜI NHẬN: " + item.NameTo + "                                          "
                            + "</p>                                                                                                          "
                            + "<p class='text line_2'>                                                                                       "
                            + "<b>Địa chỉ: </b> " + (item.AdressNoteTo == null ? "" : (item.AdressNoteTo + " - ")) + item.AddressTo + "                                             "
                            + "</p>                                                                                                          "
                            + "<p class='text'>                                                                                              "
                            + "<b>Điện thoại: </b> " + item.PhoneTo + "                                                                                "
                            + "</p>                                                                                                          "
                            + "</div>                                                                                                        "
                            + "<div class='itemp'>                                                                                           "
                            + "<p class='headerp'><span>4.</span> Dịch vụ: " + item.ServiceName + "</p>                                             "
                            + "<p class='text'><b>Dịch vụ cộng thêm: </b> " + item.DVGTName + "</p>                                           "
                            + "</div>                                                                                                        "
                            + "</div>                                                                                                        "
                            + "<div class='col-100'>                                                                                         "
                            + "<div class='col-50'>                                                                                          "
                            + "<div class='text_center content padding-5 border-right'>                                                      "
                            + "<p><b>" + item.POFromName + "</b></p>                                                                                         "
                            + "<p>Ngày gửi: " + sys.formatDateTime(item.CreateDate, 'hh:mm dd/kk/yy') + "</p>                                                                                   "
                            + "<p class='signal'>Ký và ghi rõ họ tên</p>                                                                     "
                            + "</div>                                                                                                        "
                            + "</div>                                                                                                        "
                            + "<div class='col-50'>                                                                                          "
                            + "<div class='text_center content padding-5'>                                                                   "
                            + "<p><b>" + item.POToName + "</b></p>                                                                                      "
                            + "<p>Ngày nhận: ..:.. .../.../" + (new Date()).getFullYear() + "</p>                                                                                "
                            + "<p class='signal'>Ký và ghi rõ họ tên</p></div></div>                                       "
                            + "<div class='col-100 content border-top'>                                                                                          "
                            + "<p class='notep text_center'><b>Lưu ý: </b>Vui lòng kiểm tra hàng trước khi ký.</p>"
                            + "</div></div></div></div>"
                            + "<div class='row'>                                                                                             "
                            + "<div class='col-100 content border-bottom border-top padding-10' style='position:relative;overflow:hidden'>                                            "
                            + "<p class='notep pull-left' style='font-size:16px; line-height:24px'><b>Ghi chú: </b>" + item.Noted + "</p>"
                            + "</div>                                                                                                          "
                            + "<div class='col-100 content padding-10'>                                                                     "
                            + "<p class='pull-left'><b>Hotline chăm sóc khách hàng: 043.785.1155 - 093.634.1179</b></p>                      "
                            + "<p class='pull-right'><b>Email: cskh@vietstar.vn</b></p>                                                     "
                            + "</div>                                                                                                        "
                            + "</div>                                                                                                        "
                            + "</div></div>                                                                                                         "
                            + "<div style='page-break-before: always;' class='break-page'></div>                                                                                                        ";
                    }
                });
            }
        });
    }
    return html;
}