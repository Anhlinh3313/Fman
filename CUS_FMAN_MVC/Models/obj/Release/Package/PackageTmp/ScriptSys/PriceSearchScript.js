var dtBk;
var dtReportLading;
$(document).ready(function () {
    var today = new Date();
    var strDate = (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear();
    var strDateFrom = (today.getMonth() + 1) + '-01-' + today.getFullYear();
    $(".search-from-date").val(strDateFrom);
    $(".search-to-date").val(strDate);
    //
    dtBk = $('#listBk').DataTable({
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
            url: apiCustomer + "/ListCustomerPayment/GetListByType?type=2",
            contentType: "application/json",
            type: "GET",
            data: function (d) {
                return {
                    pageSize: d.length,
                    pageNumber: d.draw,
                    fromDate: $('.search-from-date').val(),
                    toDate: $('.search-to-date').val(),
                    cols: 'ListCustomerPaymentType,UserCreated,Customer'
                }
            }, beforeSend: function (request) {
                if ($.cookie('token')) {
                    request.setRequestHeader("Authorization", "Bearer " + $.cookie('token'));
                }
            },
            dataSrc: "data"
        }, columns: [
            { data: "id" },
            {
                data: "code", render: function (data, type, row, meta) {
                    return meta.row + 1;
                }
            },
            { data: "code" },
            //{ data: "TotalMoney", className: "number", render: function (data) { return formatMoney(data, 0) } },
            //{ data: "AdjustUp", className: "number", render: function (data) { return formatMoney(data, 0) } },
            //{ data: "AdjustDown", className: "number", render: function (data) { return formatMoney(data, 0) } },
            { data: "grandTotal", className: "number", render: function (data) { return formatMoney(data, 0) } },
            { data: "createdWhen", className: "date"/*, render: function (data) { return sys.formatDateTime(data, 'HH:mm dd/kk/yy') }*/ },
            { data: "userCreated.fullName" },
            { data: "statusName", className: "status", render: function (data) { return (data == true ? 'Đã thanh toán' : 'Chưa thanh toán') } },
        ],
        columnDefs: [{
            "targets": 0,
            "data": 'id',
            "render": function (data, type, full, meta) {
                var htmlButton = "";
                htmlButton += ' <button type="button" class="btn btn-xs btn-success" typeCodeCOD=' + full.code + ' typeGrandTotalWhenCOD=' + full.grandTotal + ' typeCreatedWhenCOD=' + full.createdWhen + ' value =' + data + ' onclick="ViewBKDetail(this)">Chi tiết</button>';
                return htmlButton;
            }
        }],
        fnRowCallback: function (nRow, aData, iDisplayIndex) {
            $(nRow).addClass("row_" + aData["customerId"]);
            $(nRow).attr("data", aData["customerId"])
        }
    });
    //
    $('.btn-search').on('click', function () {
        dtBk.ajax.reload();
        dtBk.draw();
    })
    dtReportLading = $('#report-lading').DataTable({
        ordering: true,
        bFilter: true,
        pagingType: "full_numbers",
        "lengthMenu": [[25, 50, 100, 1000000], [25, 50, 100, "Tất cả"]],
        "language": {
            "lengthMenu": "Hiển thị: _MENU_ ",
            "emptyTable": "Không tìm thấy dữ liệu!",
            "paginate": {
                "previous": "Trở lại", "next": "Tiếp theo", "first": "Trang đầu", "last": "Trang cuối"
            }
        },
        // ajax: {
        //     url: apiCustomer + "/Shipment/GetListShipmentCODByPaymentId?paymentId="+ listId,
        //     contentType: "application/json",
        //     type: "GET",
        //     data: function (d) {
        //         return {
        //             pageSize: d.length, pageNumber: d.draw, cols: 'Sender,Service,ShipmentStatus,PaymentType'
        //         }
        //     }, beforeSend: function (request) {
        //         if ($.cookie('token')) {
        //             request.setRequestHeader("Authorization", "Bearer " + $.cookie('token'));
        //         }
        //     },
        //     dataSrc: "data"
        // },
        columns: [
            {
                data: "id", render: function (data, type, row, meta) {
                    return meta.row + 1;
                }
            },
            { data: "shipmentNumber" },
            { data: "sender.code" },
            { data: "sender.name" },
            {
                data: "orderDate", render: function (data, type, row) {
                    return sys.formatDateTime(data, 'dd/kk/yy HH:mm');
                }
            },
            { data: "shippingAddress" },
            { data: "receiverPhone" },
            { data: "service.name" },
            { data: "weight", className: "number", render: function (data) { return formatMoney(data, 0) } },
            { data: "totalPrice", className: "number", render: function (data) { return formatMoney(data, 0) } },
            //  { data: "MonthPayment", className: "number", render: function (data) { return formatMoney(data, 0) } },
            { data: "cod", className: "number", render: function (data) { return formatMoney(data, 0) } },
            //  { data: "CODSendBack", className: "number", render: function (data) { return formatMoney(data, 0) } },
            //  {
            //      name: "TotalPayment",
            //      className: "number totalpayment",
            //      render: function (data, type, row) {
            //          return formatMoney(row["cod"] - row["CODSendBack"] - row["MonthPayment"]);
            //      }
            //  },
            { data: "shipmentStatus.name" },
            { data: "paymentType.name" }
        ],
        fnRowCallback: function (nRow, aData, iDisplayIndex) {
            $(nRow).addClass("row_" + aData["id"]);
            $(nRow).attr("data", aData["id"])
            if (aData['paymentType'] == true) {
                $(nRow).addClass("success");
            }
        },
        footerCallback: function (row, data, start, end, display) {
            var api = this.api(), data;
            var totalPayment = 0;
            var totalAmount = 0;
            var totalCOD = 0;
            var totalMonthPayment = 0;
            var totalCODSendBack = 0;
            $(api.columns(".number").footer()).html(0);
            var columns = api.settings().init().columns;
            $.each(columns, function (i, v) {
                if (v.className === "number") {
                    var total = api.column(i).data().reduce(function (a, b) {
                        return a + b;
                    }, 0);
                    $(api.column(i).footer()).html(formatMoney(total, 0));
                    if (v.data == 'totalPrice') {
                        totalAmount = total;
                    }
                    if (v.data == 'cod') {
                        totalCOD = total;
                    }
                    // if (v.data == 'MonthPayment') {
                    //     totalMonthPayment = total;
                    // }
                    // if (v.data == 'CODSendBack') {
                    //     totalCODSendBack = total;
                    // }
                }
            });
            totalPayment = totalCOD;
            $(api.column(".list-lading .totalpayment").footer()).html(formatMoney(totalPayment, 0));
        },
        buttons: [
            {
                dom: 'Bfrtip',
                extend: 'excel',
                text: '<span class="fa fa-file-excel-o"></span> Xuất Excel',
                exportOptions: {
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
    //Xuat Excel
    $(".btn-excel-detail").on("click", function () {
        dtReportLading.button().trigger();
    });
});

function ViewBKDetail(_this) {
    var listId = _this.value;
    $("#modal-lading").modal("show");
    document.getElementById("codeCOD").innerHTML = _this.attributes.typecodecod.value;
    document.getElementById("tongtien").innerHTML = _this.attributes.typeGrandTotalWhenCOD.value;
    document.getElementById("ngaygiaodich").innerHTML = _this.attributes.typeCreatedWhenCOD.value;
    var token = $.cookie("token");
    var cols = "Sender,Service,ShipmentStatus,PaymentType";
    $.when(sys.CallAjaxasync(apiCustomer + "/Shipment/GetListShipmentCODByPaymentId", { paymentId: listId, cols: cols }, token))
        .done(function (data) {
            // dtReportLading.clear();
            if (data) {
                dtReportLading.rows.add(data.data);
                document.getElementById("sodon").innerHTML = data.data.length;
            }
            dtReportLading.draw();
        });

}
