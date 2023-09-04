var typeDB = ''
var nameModal = ' - Tiền đã thu hộ'

var dtReport;
var dtHistoryReport;
var typeCOD = 1;
var dtShipmentLoadModal;
var paymentId;
$(function () {
    var today = new Date();
    var strDate = (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear();
    var strDateFrom = (today.getMonth() + 1) + '-01-' + today.getFullYear();
    $(".search-from-date").val(strDateFrom);
    $(".search-to-date").val(strDate);
    $('.bt-close-loadmodalShipment').on('click', function () {
        //dtReportLoadModal.clear()
        dtShipmentLoadModal.draw()
    })
    getHistoryReport();
    dtShipment();
    //
    $('a.typeCOD').on('click', function () {
        var typeCODClick = $(this).attr('typeCOD')
        var nameModalClick = $(this).attr('typeName')
        if (typeCOD != typeCODClick) {
            typeCOD = typeCODClick
            nameModal = nameModalClick
            document.getElementById('nameModal').innerHTML = " - " + nameModal
            dtReport.ajax.reload()
        }
    })
    //
    dtReport = $('#report').DataTable({
        ordering: true,
        bFilter: true,
        scrollY: '450px',
        scrollCollapse: true,
        pagingType: "full_numbers",
        "lengthMenu": [[10, 25, 50, 100, 1000000], [10, 25, 50, 100, "Tất cả"]],
        "language": {
            "lengthMenu": "Hiển thị : _MENU_ vận đơn",
            "emptyTable": "Không tìm thấy vận đơn COD trong khoản thời gian này!",
            "paginate": {
                "previous": "Trở lại", "next": "Tiếp theo", "first": "Trang đầu", "last": "Trang cuối"
            }
        },
        ajax: {
            // url: apiCustomer + "/shipment/getCODAll",
            url: apiCustomer + "/shipment/getCODAll",
            contentType: "application/json",
            type: "GET",
            data: function (d) {
                return {
                    pageSize: d.length, pageNumber: d.draw,
                    fromDate: /*typeCOD == 1 || typeCOD == 2 ? null :*/ $('.search-from-date').val(),
                    toDate: /*typeCOD == 1 || typeCOD == 2 ? null :*/ $('.search-to-date').val(),
                    typeCOD: typeCOD,
                    cols: 'ShipmentStatus,PaymentType,Service'
                }
            }, beforeSend: function (request) {
                if ($.cookie('token')) {
                    request.setRequestHeader("Authorization", "Bearer " + $.cookie('token'));
                }
            },
            dataSrc: "data"
        },
        columns: [
            { data: "id" },
            {
                data: "shipmentNumber", render: function (data, type, row, meta) {
                    return meta.row + 1;
                }
            },
            { data: "shipmentNumber" },
            { data: "orderDate", className: "date", render: function (data) { return (data) } },
            { data: "shipmentStatus", className: "", render: function (data) { return data.name } },
            { data: "service", className: "", render: function (data) { return data.name } },
            { data: "receiverName" },
            { data: "receiverPhone" },
            { data: "shippingAddress" },
            { data: "weight", className: "weight", render: function (data) { return (data) } },
            { data: "cod", className: "number", render: function (data) { return (formatMoney(data)) } },
            { data: "insured", className: "number", render: function (data) { return (formatMoney(data)) } },
            { data: "defaultPrice", className: "number", render: function (data) { return (formatMoney(data)) } },
            { data: "remoteAreasPrice", className: "number", render: function (data) { return (formatMoney(data)) } },
            { data: "fuelPrice", className: "number", render: function (data) { return (formatMoney(data)) } },
            { data: "totalDVGT", className: "number", render: function (data) { return (formatMoney(data)) } },
            { data: "totalPrice", className: "number", render: function (data) { return (formatMoney(data)) } },
            { data: "paymentType", className: "", render: function (data) { return data ? data.name : "" } },
            // { data: "id" },
            // {
            //     data: "code", render: function (data, type, row, meta) {
            //         return meta.row + 1;
            //     }
            // },
            // { data: "code" },
            // { data: "GrandTotal", className: "", render: function (data) { return data.name } },
            // { data: "listCustomerPaymentType", className: "", render: function (data) { return data.name } },
            // { data: "" },
            // { data: "hubCreated", className: "", render: function (data) { return data.name } },
            // { data: "statusName" },
        ],
        columnDefs: [{
            "targets": 0,
            "data": 'id',
            "render": function (data, type, full, meta) {
                var htmlButton = "";
                htmlButton += ' <button type="button" class="btn btn-xs btn-success" data-id =' + data + ' onclick="ViewDetail(\'' + full.shipmentNumber + '\')">Xem</button>';
                return htmlButton;
                }
            }
        ],
        fnRowCallback: function (nRow, aData, iDisplayIndex) {
            $(nRow).addClass("row_" + aData["Id"]);
            $(nRow).attr("id", aData["Id"]);
            if (aData['Status'] == 6) {
                $(nRow).addClass("successlading");
            }
            if (aData['Status'] == 13) {
                $(nRow).addClass("sendbacklading");
            }
        },
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
    //
    $('#report_filter label input').addClass('form-control');
    $('#report_length label select').addClass('form-control select-choice chosen-select');
    //
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
        $('.dataTable tfoot>tr>th.number').html('0');
        dtReport.ajax.reload();
        dtHistoryReport.ajax.reload();
        getSummaryCOD();
        //getSummaryCODDelivering();
    });
    $('.change-tab').on('click', function () {
        var typeCODSelected = $(this).attr('typeCOD');
        if (typeCOD != typeCODSelected) {
            typeCOD = typeCODSelected;
            dtReport.ajax.reload();
        }
    })
    getSummaryCOD();
    //getSummaryCODDelivering();
    
});

function ViewTableDataShipment(id) {
    $('.btn-loadmodalShipment').click();
    getListShipmentByRequestId(id);
}

function getListShipmentByRequestId(id) {
    paymentId = id;
    dtShipmentLoadModal.ajax.reload();
};

function dtShipment() {
    var token = $.cookie('token');
    var cols = 'Service,Structure,ShipmentStatus,FromHub,ToHub,ShipmentServiceDVGTs,PaymentType,PickUser';
    dtShipmentLoadModal = $('#LoadDataShipment').DataTable({
        ordering: true,
        bFilter: true,
        pagingType: 'full_numbers',
        'lengthMenu': [[25, 50, 100, 1000000], [25, 50, 100, 'Tất cả']],
        'language': {
            'lengthMenu': 'Hiển thị: _MENU_ ',
            'emptyTable': 'Không tìm thấy vận đơn trong khoảng thời gian này!',
            'paginate': {
                'previous': 'Trở lại', 'next': 'Tiếp theo', 'first': 'Trang đầu', 'last': 'Trang cuối'
            }
        },
        ajax: {
            url: apiCustomer + '/Shipment/GetListShipmentPriceByPaymentId',
            contentType: 'application/json',
            type: 'GET',
            data: function (d) {
                return {
                    paymentId: paymentId,
                    cols: cols
                }
            }, beforeSend: function (request) {
                if (token) {
                    request.setRequestHeader('Authorization', 'Bearer ' + token)
                }
            },
            dataSrc: 'data'
        },
        columns: [
            { data: 'id', render: function () { return "<input type='checkbox'></input>"; } },
            { data: 'id' },
            {
                data: 'shipmentNumber', render: function (data, type, row, meta) {
                    return meta.row + 1
                }
            },
            { data: 'shipmentNumber' },
            { data: 'shopCode' },
            { data: 'shipmentStatus', className: '', render: function (data) { return data.name } },
            { data: 'deliveryNote' },
            { data: 'cod', className: 'number', render: function (data) { return (formatMoney(data)) } },
            {
                data: 'totalPrice', className: 'number', render: function (data) {
                    return (formatMoney(data))
                }
            },
            { data: 'receiverName' },
            { data: 'receiverPhone' },
            { data: 'addressNoteTo' },
            { data: 'shippingAddress' },
            { data: 'content' },
            { data: 'cusNote' },
            {
                data: 'paymentType', className: '', render: function (data) {
                    if (data) {
                        return data.name
                    } else {
                        return '-- không --'
                    }
                }
            },
            { data: 'orderDate', className: 'date', render: function (data) { return (sys.formatDateTimeT(data, 'yy/kk/dd hh:mm')) } },
            { data: 'weight', className: 'weight', render: function (data) { return (data) } }
        ],
        columnDefs: [
            {
                'targets': 1,
                'data': 'id',
                'render': function (data, type, full, meta) {
                    var htmlButton = ''
                    if (full.shipmentStatusId !== 57) {
                        htmlButton += ' <button type="button" class="btn btn-xs btn-success" data-id =' + data + ' onclick="ViewDetail(\'' + full.shipmentNumber + '\')">Xem</button>'
                    }
                    return htmlButton
                }
            },
        ],
        fnRowCallback: function (nRow, aData, iDisplayIndex) {
            $(nRow).addClass('row_' + aData['id'])
            $(nRow).attr('id', aData['id'])
            if (aData['shipmentStatusId'] == 12) {
                $(nRow).addClass('success')
            }
            if (aData['shipmentStatusId'] == 26) {
                $(nRow).addClass('danger')
            }
            if (aData['shipmentStatusId'] == 57) {
                $(nRow).addClass('active')
            }
        },
        order: [[12, 'desc']],
        // dom: 'Bfrtip',
        buttons: [
            {
                extend: 'excel',
                text: '<span class="fa fa-file-excel-o"></span> Xuất Excel',
                exportOptions: {
                    columns: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
                    modifier: {
                        search: 'applied',
                        order: 'applied'
                    },
                    format: {
                        body: function (data, row, column, node) {
                            var number = ''
                            if (typeof data === 'string') {
                                number = data.replaceAll('.', '') * 1
                            }
                            return !isNaN(number) ?
                                number :
                                data
                        }
                    }
                }
            }]
    })
}
function getHistoryReport() {
    //
    dtHistoryReport = $('#historyReport').DataTable({
        ordering: true,
        bFilter: true,
        scrollY: '450px',
        scrollCollapse: true,
        pagingType: "full_numbers",
        "lengthMenu": [[10, 25, 50, 100, 1000000], [10, 25, 50, 100, "Tất cả"]],
        "language": {
            "lengthMenu": "Hiển thị : _MENU_ vận đơn",
            "emptyTable": "Không tìm thấy vận đơn COD trong khoản thời gian này!",
            "paginate": {
                "previous": "Trở lại", "next": "Tiếp theo", "first": "Trang đầu", "last": "Trang cuối"
            }
        },
        ajax: {
            // url: apiCustomer + "/shipment/getCODAll",
            url: apiCustomer + "/ListCustomerPayment/GetAllList",
            contentType: "application/json",
            type: "GET",
            data: function (d) {
                return {
                    pageSize: d.length, pageNumber: d.draw,
                    fromDate: /*typeCOD == 1 || typeCOD == 2 ? null :*/ $('.search-from-date').val(),
                    toDate: /*typeCOD == 1 || typeCOD == 2 ? null :*/ $('.search-to-date').val(),
                    cols: 'ListCustomerPaymentType,HubCreated'
                }
            }, beforeSend: function (request) {
                if ($.cookie('token')) {
                    request.setRequestHeader("Authorization", "Bearer " + $.cookie('token'));
                }
            },
            dataSrc: "data"
        },
        columns: [
            {
                data: "code", render: function (data, type, row, meta) {
                    return meta.row + 1;
                }
            },
            { data: "code" },
            { data: "grandTotal", className: "number", render: function (data) { return (formatMoney(data)) }},
            { data: "listCustomerPaymentType", className: "", render: function (data) { return data.name } },
            { data: "createdWhen", className: "date", render: function (data) { return (data) }},
            { data: "hubCreated", className: "", render: function (data) { return data ? data.name : null } },
            { data: "statusName" },
        ],
        columnDefs: [
            {
                "targets": 1,
                "data": 'code',
                "render": function (data, type, full, meta) {
                    var htmlHref = "";
                    htmlHref += ' <a style="cursor: pointer;" class="" data-id =' + data + ' onclick="ViewTableDataShipment(\'' + full.id + '\')">' + data + '</a>';
                    return htmlHref;
                }
            }
        ],
    });
}
//hàm search
function Search(currentPage, sizePage) {
    var data = GetParameterSearch();
    data.sizePage = sizePage;
    data.curentPage = sys._setSkip(currentPage);
    if (data.FromDate === "") {
        sys.Alert("Cảnh Báo", "Vui Lòng Chọn Từ Ngày!", "Kiểm Tra");
        return;
    } else if (data.ToDate === "") {
        sys.Alert("Cảnh Báo", "Vui Lòng Chọn Đến Ngày!", "Kiểm Tra");
        return;
    } else {

    }
};

function getSummaryCOD() {
    var codDelivering, priceShipDelivering, priceDVGTDelivering, priceCODDelivering;
    var codDelivered, priceShipDelivered, priceDVGTDelivered, priceCODDelivered;
    var codReturn, priceShipReturn, priceDVGTReturn, priceCODReturn;
    var token = $.cookie('token');
    //#region GetCountCODAll
    $.when(sys.CallAjaxasync(apiCustomer + '/shipment/GetCountCODAll', {
        fromDate: $('.search-from-date').val(),
        toDate: $('.search-to-date').val()
    }, token)).done(function (data) {
        if (data.isSuccess) {
            $.each(data.data, function (x, v) {
                if (data.isSuccess) {
                    $('.' + v.name).html(formatMoney(v.total, 0) + ' VNĐ');
                    $('.count-' + v.name).html(v.count);
                    if (v.name == "codDelivering") {
                        codDelivering = v.total;
                    } if (v.name == "priceShipDelivering") {
                        priceShipDelivering = v.total;
                    } if (v.name == "priceDVGTDelivering") {
                        priceDVGTDelivering = v.total;
                    } if (v.name == "priceCODDelivering") {
                        priceCODDelivering = v.total;
                    } if (v.name == "codDelivered") {
                        codDelivered = v.total;
                    } if (v.name == "priceShipDelivered") {
                        priceShipDelivered = v.total;
                    } if (v.name == "priceDVGTDelivered") {
                        priceDVGTDelivered = v.total;
                    } if (v.name == "priceCODDelivered") {
                        priceCODDelivered = v.total;
                    } if (v.name == "codReturn") {
                        codReturn = v.total;
                    } if (v.name == "priceShipReturn") {
                        priceShipReturn = v.total;
                    } if (v.name == "priceDVGTReturn") {
                        priceDVGTReturn = v.total;
                    } if (v.name == "priceCODReturn") {
                        priceCODReturn = v.total;
                    }
                }
            });

            var Delivering = codDelivering - priceShipDelivering - priceDVGTDelivering - priceCODDelivering;
            var Delivered = codDelivered - priceShipDelivered - priceDVGTDelivered - priceCODDelivered;
            var Return = codReturn - priceShipReturn - priceDVGTReturn - priceCODReturn;
            $(".priceDelivering").html(formatMoney(Delivering, 0) + ' VNĐ');
            $(".priceDelivered").html(formatMoney(Delivered, 0) + ' VNĐ');
            $(".priceReturn").html(formatMoney(Return, 0) + ' VNĐ');
        }
    });
    //#endregion
    $.when(sys.CallAjaxasync(apiCustomer + '/shipment/GetCountCODByProc', {
        fromDate: $('.search-from-date').val(),
        toDate: $('.search-to-date').val(),
        senderId: $.cookie('userId')
    }, token)).done(function (data) {
        console.log(data);
    });
}
function ViewTableData() {
    $('.btn-loadmodal').click()
}
function getSummaryCODDelivering() {
    var token = $.cookie('token');
    var tong = 0;
    $.when(sys.CallAjaxasync(apiCustomer + '/shipment/GetCountCODAll', {
    }, token)).done(function (data) {
        if (data.isSuccess) {
            $.each(data.data, function (x, v) {
                if (v.name == "delivering" || v.name == "delive_iHubServicered") {
                    $('.' + v.name).html(formatMoney(v.total, 0) + ' VNĐ');
                    $('.count-' + v.name).html(v.count);
                    tong += v.count;
                }
                
            });
        }
    });
    $(".total").html(tong);
}