var dtReport;
var dtShipmentLoadModal
var requestId;
var shipmentNumberCancel;
$(function () {
    var date = new Date();
    var strDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    $('.form-starDate').val(strDate);
    $('.form-starDate').parent().parent().addClass("active");
    $('.form-EndDate').val(strDate);
    $('.form-EndDate').parent().parent().addClass("active");
    //
    $('.bt-close-loadmodal').on('click', function () {
        //dtReportLoadModal.clear()
        dtShipmentLoadModal.draw()
    })
    dtShipment();
    //GetStatusLading();
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
        scrollY: '450px',
        scrollCollapse: true,
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
            url: apiCustomer + "/requestShipment/getAll",
            contentType: "application/json",
            type: "GET",
            data: function (d) {
                return {
                    pageSize: d.length, pageNumber: d.draw, fromDate: $('.form-starDate').val(), toDate: $('.form-EndDate').val(), cols: 'ShipmentStatus'
                }
            }, beforeSend: function (request) {
                if ($.cookie('token')) {
                    request.setRequestHeader("Authorization", "Bearer " + $.cookie('token'));
                }
            },
            dataSrc: "data"
        },
        columns: [
            { data: "shipmentNumber" },
            {
                data: "shipmentNumber", render: function (data, type, row, meta) {
                    return meta.row + 1;
                }
            },
            { data: "shipmentNumber" },
            { data: "shipmentStatus", className: "", render: function (data) { return data.name } },
            { data: "senderName" },
            { data: "senderPhone" },
            { data: "pickingAddress" },
            { data: "orderDate", className: "date", render: function (data) { return (sys.formatDateTimeVN(data, true)) } },
            { data: "weight", className: "weight", render: function (data) { return (data) } }
        ],
        columnDefs: [{
            "targets": 0,
            "data": 'shipmentNumber',
            "render": function (data, type, full, meta) {
                var htmlButton = "";
                if (full.shipmentStatusId === 1 || full.shipmentStatusId === 2 || full.shipmentStatusId === 4 || full.shipmentStatusId === 54 || full.shipmentStatusId === 41) {
                    htmlButton += ' <button type="button" class="btn btn-xs btn-danger btn-cancel" data-id =' + data + ' onclick="CancelRequest(\'' + data + '\')">Hủy</button>';
                }
                return htmlButton;
            }
        },{
            "targets": 2,
            "data": 'shipmentNumber',
            "render": function (data, type, full, meta) {
                var htmlHref = "";
                if (full.shipmentStatusId > 0) {
                    htmlHref += ' <a style="cursor: pointer;" class="" data-id =' + data + ' onclick="ViewTableDataShipment(\'' + full.id + '\')">' + data + '</a>';
                }
                return htmlHref;
            }
        }],
        fnRowCallback: function (nRow, aData, iDisplayIndex) {
            $(nRow).addClass("row_" + aData["Id"]);
            $(nRow).attr("id", aData["Id"]);
            if (aData['shipmentStatusId'] == 3 || aData['shipmentStatusId'] == 43) {
                $(nRow).addClass("successlading");
            }
            if (aData['shipmentStatusId'] == 5) {
                $(nRow).addClass("sendbacklading");
            }
        },
        order: [[1, "desc"]]
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
});
function ViewTableDataShipment(id) {
    $('.btn-loadmodal').click();
    getListShipmentByRequestId(id);
}
function getListShipmentByRequestId(id) {
    var Weight = $.cookie("Weight");
    requestId = id;
    dtShipmentLoadModal.ajax.reload();
};
function dtShipment() {
    var token = $.cookie('token');
    var cols = 'Service,Structure,ShipmentStatus,FromHub,ToHub,ShipmentServiceDVGTs,PaymentType,PickUser';
    dtShipmentLoadModal = $('#LoadData').DataTable({
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
            url: apiCustomer + '/Shipment/GetListShipmentByRequestId',
            contentType: 'application/json',
            type: 'GET',
            data: function (d) {
                return {
                    id: requestId,
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
                    // if (full.shipmentStatusId === 54) {
                    //    htmlButton += ' <button type="button" class="btn btn-xs btn-info btn-create" data-id =' + data + ' onclick="SendRequest(\'' + full.id + '\')">Yêu cầu lấy hàng</button>'
                    // }
                    // if (full.shipmentStatusId === 1 || full.shipmentStatusId === 11 || full.shipmentStatusId === 9 || full.shipmentStatusId === 10 || full.shipmentStatusId === 14 || full.shipmentStatusId === 18 || full.shipmentStatusId === 19) {
                    //    htmlButton += ' <button type="button" class="btn btn-xs btn-success" data-id =' + data + ' onclick="ViewEdit(' + data + ')">Sửa</button>'
                    //    htmlButton += ' <button type="button" class="btn btn-xs btn-danger" data-id =' + data + ' onclick="DeleteLading(' + data + ')">Hủy</button>'
                    // }
                    return htmlButton
                }
            },
            //   {
            //     'targets': 6,
            //     'data': 'id',
            //     'render': function (data, type, full, meta) {
            //       var deliveryNote = ''
            //       if (typeDB === 'ChoChuyenHoan') {
            //         deliveryNote += full.deliveryNote
            //       }
            //       return deliveryNote
            //     }
            //   }
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
function CancelRequest(shipmentNumber) {
    shipmentNumberCancel = shipmentNumber;
    $(".btn-cancel").attr('diabled', true);
    // sys.ConfirmDialog("Cảnh báo", "Bạn có chắc muốn hủy yêu cầu nhận hàng!", function () {
    //     sys.Loading();
    //     var token = $.cookie('token');
    //     var request = new Object();
    //     request.shipmentNumber = sn;
    //     $.when(sys.CallAjaxPostasync(apiCustomer + "/requestShipment/Cancel", request, token)).done(function (data) {
    //         if (data.isSuccess) {
    //             dtReport.ajax.reload();
    //             $(".success").stop().slideDown(); 
    //             $(".success").html("Hủy yêu cầu thành công!").slideDown(1000).delay(3000).slideUp(2000);
    //             sys.HideLoading();
    //             $(".btn-cancel").attr('diabled', false);
    //         } else {
    //             $(".error").stop().slideDown(); 
    //             $(".error").html("Hủy yêu cầu thật bại!").slideDown(1000).delay(3000).slideUp(2000);
    //             sys.HideLoading();
    //             $(".btn-cancel").attr('diabled', false);
    //         }
    //     });
    // });
    $('.cancel_request').css({ "visibility": "hidden" })
    setTimeout(() => {
        $('.cancel_request').css({ "visibility": "visible" })
    }, 1000);
    $.createDialog({
        attachAfter: '.cancel_request',
        title: 'Bạn Chắc Muốn Xóa?',
        accept: 'Xác nhận',
        refuse: 'Không',
        acceptStyle: 'red',
        refuseStyle: 'gray',
        acceptAction: alertCallCancel,
    });
    $.showDialog();
}
function alertCallCancel() {
        sys.Loading();
        var token = $.cookie('token');
        var request = new Object();
        request.shipmentNumber = shipmentNumberCancel;
        $.when(sys.CallAjaxPostasync(apiCustomer + "/requestShipment/Cancel", request, token)).done(function (data) {
            if (data.isSuccess) {
                dtReport.ajax.reload();
                $(".success").stop().slideDown(); 
                $(".success").html("Hủy yêu cầu thành công!").slideDown(1000).delay(3000).slideUp(2000);
                sys.HideLoading();
                $(".btn-cancel").attr('diabled', false);
            } else {
                $(".error").stop().slideDown(); 
                $(".error").html("Hủy yêu cầu thật bại!").slideDown(1000).delay(3000).slideUp(2000);
                sys.HideLoading();
                $(".btn-cancel").attr('diabled', false);
            }
        });
}