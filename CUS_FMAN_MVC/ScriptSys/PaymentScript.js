var dtBk;
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
            url: apiCustomer + "/ListCustomerPayment/GetListByType?type=1",
            contentType: "application/json",
            type: "GET",
            data: function (d) {
                return {
                    pageSize: d.length, pageNumber: d.draw,
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
        },
        columns: [
            //{ data: "LadingIds" },
            //{
            //    data: "BKCustomerID", render: function (data, type, row, meta) {
            //        return meta.row + 1;
            //    }
            //},
            //{ data: "BKCustomerCode" },
            //{ data: "TotalMoney", className: "number", render: function (data) { return formatMoney(data, 0) } },
            //{ data: "AdjustUp", className: "number", render: function (data) { return formatMoney(data, 0) } },
            //{ data: "AdjustDown", className: "number", render: function (data) { return formatMoney(data, 0) } },
            //{ data: "Amount", className: "number", render: function (data) { return formatMoney(data, 0) } },
            //{ data: "CreatedDate", className: "date", render: function (data) { return sys.formatDateTime(data, 'HH:mm dd/kk/yy') } },
            //{ data: "OfficerName" },
            //{ data: "Payment", className: "status", render: function (data) { return (data == true ? 'Đã thanh toán' : 'Chưa thanh toán') } },
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
            { data: "createdWhen", className: "date"/*, render: function (data) { return sys.formatDateTime(data, 'HH:mm dd/k/yyyy') } */ },
            { data: "userCreated.userName" },
            { data: "statusName", className: "status", render: function (data) { return (data == true ? 'Đã thanh toán' : 'Chưa thanh toán') } },
        ],
        columnDefs: [{
            "targets": 0,
            "data": 'id',
            "render": function (data, type, full, meta) {
                var htmlButton = "";
                htmlButton += ' <button type="button" class="btn btn-xs btn-success" typecodeTTCT=' + full.code + ' typeGrandTotalWhenTTCT=' + full.grandTotal + ' typeCreatedWhenTTCT=' + full.createdWhen + ' value =' + data + ' onclick="ViewBKDetail(this)">Chi tiết</button>';
                return htmlButton;
            }
        }],
        fnRowCallback: function (nRow, aData, iDisplayIndex) {
            $(nRow).addClass("row_" + aData["id"]);
            $(nRow).attr("data", aData["id"])
        }
    });
    //

    dtReportLading = $('#report-lading').DataTable({
        ordering: true,
        bFilter: true,
        pagingType: "full_numbers",
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
        //     url: apiCustomer + "/Shipment/GetListShipmentPriceByPaymentId?paymentId="+ listId,
        //     contentType: "application/json",
        //     type: "GET",
        //     data: function (d) {
        //         return {
        //             pageSize: d.length, pageNumber: d.draw, cols: 'Sender,Service,ShipmentStatus,PaymentType'
        //         }
        //     }, 
        //     beforeSend: function (request) {
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
                }
            });
            $(api.column(".list-lading .totalpayment").footer()).html(formatMoney(totalAmount, 0));
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
    $('.btn-search').on('click', function () {
        dtBk.ajax.reload();
        dtBk.draw();
    })
    //Xuat Excel
    // $(".btn-excel-detail").on("click", function () {
    //     dtReportLading.button().trigger();
    // });
});

function ViewBKDetail(_this) {
    //var listId = $(_this).attr('data-id');
    //$("#modal-lading").modal("show");
    //$.when(sys.CallAjaxPost("/Price/GetLadingByLadingIds", { ladingIds: listId }))
    //.done(function (data) {
    //    dtReportLading.clear();
    //    if (data) {
    //        dtReportLading.rows.add(data);
    //    }
    //    dtReportLading.draw();
    //});
    var listId = _this.value;
    $("#modal-lading").modal("show");
    document.getElementById("codeTTCT").innerHTML = _this.attributes.typecodeTTCT.value != "null" ? _this.attributes.typecodeTTCT.value : "Không có mã";
    document.getElementById("tongtien").innerHTML = _this.attributes.typeGrandTotalWhenTTCT.value != "null" ? _this.attributes.typeGrandTotalWhenTTCT.value : "0";
    document.getElementById("ngaygiaodich").innerHTML = _this.attributes.typeCreatedWhenTTCT.value != "null" ? _this.attributes.typeCreatedWhenTTCT.value : "Không xác nhận dược ngày tạo";

    var token = $.cookie("token");
    var cols = "Sender,Service,ShipmentStatus,PaymentType";
    $.when(sys.CallAjaxasync(apiCustomer + "/Shipment/GetListShipmentPriceByPaymentId", { paymentId: listId ,cols: cols}, token))
        .done(function (data) {
            dtReportLading.clear();
            if (data) {
                dtReportLading.rows.add(data.data);
                document.getElementById("sodon").innerHTML = data.data.length;
            }
            dtReportLading.draw();
        });
   
}
