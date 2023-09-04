var dtReport;
$(function () {
    var date = new Date();
    var strDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    $('.form-starDate').val(strDate);
    $('.form-starDate').parent().parent().addClass("active");
    $('.form-EndDate').val(strDate);
    $('.form-EndDate').parent().parent().addClass("active");
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
            { data: "orderDate", className: "date", render: function (data) { return (data) } },
            { data: "weight", className: "weight", render: function (data) { return (data) } }
        ],
        columnDefs: [{
            "targets": 0,
            "data": 'shipmentNumber',
            "render": function (data, type, full, meta) {
                var htmlButton = "";
                if (full.shipmentStatusId === 1 || full.shipmentStatusId === 2 || full.shipmentStatusId === 4 || full.shipmentStatusId === 54 || full.shipmentStatusId === 41) {
                    htmlButton += ' <button type="button" class="btn btn-xs btn-danger" data-id =' + data + ' onclick="CancelRequest(\'' + data + '\')">Hủy</button>';
                }
                return htmlButton;
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
        order: [[7, "desc"]]
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

function CancelRequest(shipmentNumber) {
    sys.ConfirmDialog("Cảnh báo", "Bạn có chắc muốn hủy yêu cầu nhận hàng!", function () {
        sys.Loading();
        var token = $.cookie('token');
        var request = new Object();
        request.shipmentNumber = shipmentNumber;
        $.when(sys.CallAjaxPostasync(apiCustomer + "/requestShipment/Cancel", request, token)).done(function (data) {
            if (data.isSuccess) {
                dtReport.ajax.reload();
                $(".success").html("Hủy yêu cầu thành công!").slideDown(1000).delay(3000).slideUp(2000);
                sys.HideLoading();
            } else {
                $(".error").html("Hủy yêu cầu thật bại!").slideDown(1000).delay(3000).slideUp(2000);
                sys.HideLoading();
            }
        });
    });
}
