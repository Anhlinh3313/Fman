﻿var dtReportThatLac;
$(function() {

    //GetStatusLading();
});

function ViewTableThatLacList() {
    var date = new Date();
    var strDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    $('.form-starDate-thatlac').val(strDate);
    $('.form-starDate-thatlac').parent().parent().addClass("active");
    $('.form-EndDate-thatlac').val(strDate);
    $('.form-EndDate-thatlac').parent().parent().addClass("active");

    $('.btn-thatlac').click();
    dtReportThatLac = $('#ThatLac').DataTable({
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
            url: apiCustomer + "/Shipment/GetShipmentByShipmentStatus",
            contentType: "application/json",
            type: "GET",
            data: function(d) {
                return {
                    pageSize: d.length,
                    pageNumber: d.draw,
                    fromDate: $('.form-starDate-thatlac').val(),
                    toDate: $('.form-EndDate-thatlac').val(),
                    type: 'LostPackage',
                    cols: 'ShipmentStatus'
                }
            }, beforeSend: function(request) {
                if ($.cookie('token')) {
                    request.setRequestHeader("Authorization", "Bearer " + $.cookie('token'));
                }
            },
            dataSrc: "data"
        },
        columns: [
            { data: "shipmentNumber" },
            {
                data: "shipmentNumber", render: function(data, type, row, meta) {
                    return meta.row + 1;
                }
            },
            { data: "shipmentNumber" },
            { data: "shipmentStatus", className: "", render: function(data) { return data.name } },
            { data: "senderName" },
            { data: "senderPhone" },
            { data: "pickingAddress" },
            { data: "orderDate", className: "date", render: function(data) { return (data) } },
            { data: "weight", className: "weight", render: function(data) { return (data) } }
        ],
        columnDefs: [{
            "targets": 0,
            "data": 'shipmentNumber',
            "render": function(data, type, full, meta) {
                var htmlButton = "";
                if (full.shipmentStatusId === 1 || full.shipmentStatusId === 2 || full.shipmentStatusId === 4 || full.shipmentStatusId === 54 || full.shipmentStatusId === 41) {
                    htmlButton += ' <button type="button" class="btn btn-xs btn-danger" data-id =' + data + ' onclick="CancelRequest(\'' + data + '\')">Hủy</button>';
                }
                return htmlButton;
            }
        }],
        fnRowCallback: function(nRow, aData, iDisplayIndex) {
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
    $(".btn-search-thatlac").on("click", function() {
        dtReportThatLac.ajax.reload();
    });
    $(".bt-close-thatlac").on("click", function() {
        dtReportThatLac.clear();
        dtReportThatLac.draw();
    })
}