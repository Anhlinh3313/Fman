var dtRepost;
var typeCOD = 1;
$(function () {
    var today = new Date();
    var strDate = (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear();
    var strDateFrom = (today.getMonth() + 1) + '-01-' + today.getFullYear();
    $(".search-from-date").val(strDateFrom);
    $(".search-to-date").val(strDate);
    //

    dtReport = $('#report').DataTable({
        ordering: true,
        bFilter: true,
        pagingType: "full_numbers",
        "lengthMenu": [[25, 50, 100, 1000000], [25, 50, 100, "Tất cả"]],
        "language": {
            "lengthMenu": "Hiển thị : _MENU_ vận đơn",
            "emptyTable": "Không tìm thấy vận đơn COD trong khoản thời gian này!",
            "paginate": {
                "previous": "Trở lại", "next": "Tiếp theo", "first": "Trang đầu", "last": "Trang cuối"
            }
        },
        ajax: {
            url: apiCustomer + "/shipment/getCODAll",
            contentType: "application/json",
            type: "GET",
            data: function (d) {
                return {
                    pageSize: d.length, pageNumber: d.draw,
                    fromDate: typeCOD == 1 || typeCOD == 2 ? null : $('.search-from-date').val(),
                    toDate: typeCOD == 1 || typeCOD == 2 ? null : $('.search-to-date').val(),
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
            { data: "cod", className: "number", render: function (data) { return (data) } },
            { data: "totalPrice", className: "number", render: function (data) { return (data) } },
            { data: "paymentType", className: "", render: function(data) { return data ? data.name : "" } },
        ],
        columnDefs: [{
            "targets": 0,
            "data": 'id',
            "render": function (data, type, full, meta) {
                var htmlButton = "";
                htmlButton += ' <button type="button" class="btn btn-xs btn-success" data-id =' + data + ' onclick="ViewDetail(\'' + full.shipmentNumber + '\')">Xem</button>';
                return htmlButton;
            }
        }],
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
        getSummaryCOD();
        getSummaryCODDelivering();
    });
    $('.change-tab').on('click', function () {
        var typeCODSelected = $(this).attr('typeCOD');
        if (typeCOD != typeCODSelected) {
            typeCOD = typeCODSelected;
            dtReport.ajax.reload();
        }
    })
    getSummaryCOD();
    getSummaryCODDelivering();
});
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
    var token = $.cookie('token');
    $.when(sys.CallAjaxasync(apiCustomer + '/shipment/GetCountCODAll', {
        fromDate: $('.search-from-date').val(),
        toDate: $('.search-to-date').val()
    }, token)).done(function (data) {
        if (data.isSuccess) {
            $.each(data.data, function (x, v) {
                if (v.name != "delivering" || v.name != "delive_iHubServicered") {
                    $('.' + v.name).html(formatMoney(v.total, 0) + ' VNĐ');
                    $('.count-' + v.name).html(v.count);
                }
            });
        }
    });
}
function getSummaryCODDelivering() {
    var token = $.cookie('token');
    $.when(sys.CallAjaxasync(apiCustomer + '/shipment/GetCountCODAll', {
    }, token)).done(function (data) {
        if (data.isSuccess) {
            $.each(data.data, function (x, v) {
                if (v.name == "delivering" || v.name == "delive_iHubServicered") {
                    $('.' + v.name).html(formatMoney(v.total, 0) + ' VNĐ');
                    $('.count-' + v.name).html(v.count);
                }
            });
        }
    });
}