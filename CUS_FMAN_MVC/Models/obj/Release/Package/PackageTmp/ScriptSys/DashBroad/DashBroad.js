var typeDB = "";
var dtReportLoadModal;
var nameModal = "Mới tạo";

var latFrom = 0;
var lngFrom = 0;
var senderId = 0;
var hubSenderId = 0;
var wardSenderId = 0;
var districtSenderId = 0;
var citySenderId = 0;
var senderName, senderPhone, senderAddress, senderCompany;

$(function () {

    loadInfo()
    var date = new Date();
    var strDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

    var token = $.cookie('token');
    $.when(sys.CallAjaxasync(apiCustomer + '/shipment/GetCountShipmentByShipmentStatus', null, token)).done(function (data) {
        if (data.isSuccess) {
            console.log(data.data);
            if (document.getElementById("CountAllListM")) {
                document.getElementById("CountAllListM").innerHTML = '(' + data.data[0].count + ')';
            }
            document.getElementById("CountRequestListM").innerHTML = '(' + data.data[1].count + ')';
            document.getElementById("CountReadyToPickListM").innerHTML = '(' + data.data[2].count + ')';
            document.getElementById("CountPickingListM").innerHTML = '(' + data.data[3].count + ')';
            document.getElementById("CountPickupCompleteListM").innerHTML = '(' + data.data[4].count + ')';
            document.getElementById("CountDaChuyenHoanListM").innerHTML = '(' + data.data[5].count + ')';
            document.getElementById("CountChoChuyenHoanListM").innerHTML = '(' + data.data[6].count + ')';
            document.getElementById("CountChoChuyenCODListM").innerHTML = '(' + data.data[7].count + ')';
            document.getElementById("CountDeliveringListM").innerHTML = '(' + data.data[8].count + ')';
            document.getElementById("CountHoanTatListM").innerHTML = '(' + data.data[9].count + ')';
            document.getElementById("CountThatLacListM").innerHTML = '(' + data.data[10].count + ')';
            document.getElementById("CountHuyListM").innerHTML = '(' + data.data[11].count + ')';
        }
    });
    var dateF; var dateT;
    dateF = strDate;
    dateT = strDate;
    $.when(sys.CallAjaxasync(apiCustomer + '/shipment/GetCountShipmentByShipmentStatus', {
        fromDate: dateF,
        toDate: dateT
    }, token)).done(function (data) {
        if (data.isSuccess) {
            console.log(data.data);
            if (document.getElementById("CountAllList")) {
                document.getElementById("CountAllList").innerHTML = data.data[0].count;
            }
            document.getElementById("CountRequestList").innerHTML = data.data[1].count;
            document.getElementById("CountReadyToPickList").innerHTML = data.data[2].count;
            document.getElementById("CountPickingList").innerHTML = data.data[3].count;
            document.getElementById("CountPickupCompleteList").innerHTML = data.data[4].count;
            document.getElementById("CountDaChuyenHoanList").innerHTML = data.data[5].count;
            document.getElementById("CountChoChuyenHoanList").innerHTML = data.data[6].count;
            document.getElementById("CountChoChuyenCODList").innerHTML = data.data[7].count;
            document.getElementById("CountDeliveringList").innerHTML = data.data[8].count;
            document.getElementById("CountHoanTatList").innerHTML = data.data[9].count;
            document.getElementById("CountThatLacList").innerHTML = data.data[10].count;
            document.getElementById("CountHuyList").innerHTML = data.data[11].count;
        }
    });

    
    $('.form-starDate-loadmodal').val(strDate);
    $('.form-starDate-loadmodal').parent().parent().addClass("active");
    $('.form-EndDate-loadmodal').val(strDate);
    $('.form-EndDate-loadmodal').parent().parent().addClass("active");

    //$('.btn-loadmodal').click();


    dtReportLoadModal = $('#LoadData').DataTable({
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
            data: function (d) {
                return {
                    pageSize: d.length,
                    pageNumber: d.draw,
                    fromDate: $('.form-starDate-loadmodal').val(),
                    toDate: $('.form-EndDate-loadmodal').val(),
                    type: typeDB,
                    cols: 'ShipmentStatus'
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
                if (full.shipmentStatusId === 54) {
                    console.log(data);
                    console.log(type);
                    console.log(full.id);
                    console.log(meta);
                    htmlButton += ' <button type="button" class="btn btn-xs btn-info btn-create" data-id =' + data + ' onclick="SendRequest(\'' + full.id + '\')">Yêu cầu lấy hàng</button>';
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

    $('button.info-box-icon').on('click', function () {
        var typeDBClick = $(this).attr('typeDB');
        var nameModalClick = $(this).attr('typeName');
        if (typeDB != typeDBClick) {
            typeDB = typeDBClick;
            nameModal = nameModalClick;
            document.getElementById("nameModal").innerHTML = nameModal;
            dtReportLoadModal.ajax.reload();
        }
    })
    $(".btn-search-loadmodal").on("click", function () {
        dtReportLoadModal.ajax.reload();
    });
    $(".bt-close-loadmodal").on("click", function () {
        dtReportLoadModal.clear();
        dtReportLoadModal.draw();
    })
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
function SendRequest(listLaingId) {
    sys.Loading();
    var token = $.cookie('token');
    var request = new Object();
    request.orderDate = sys.formatDateTimeSQL(new Date());;
    request.senderId = senderId;
    request.senderName = senderName;
    request.senderPhone = senderPhone;
    request.pickingAddress = senderAddress;
    request.fromWardId = wardSenderId;
    request.fromProvinceId = citySenderId;
    request.fromDistrictId = districtSenderId;
    request.cusNote = "";
    request.weight = 0;
    request.totalBox = 0;
    request.fromHubId = hubSenderId;
    request.currentHubId = hubSenderId;
    request.ListShipmentId = [listLaingId];
    request.latFrom = latFrom;
    request.lngFrom = lngFrom;
    request.currentLat = latFrom;
    request.currentLng = lngFrom;
    request.location = senderAddress;
    //
    $.when(sys.CallAjaxPostasync(apiCustomer + "/requestshipment/CreateRequest", request, token)).done(function (data) {
        if (data.isSuccess) {
            $(".success").html('Gửi yêu cầu nhận hàng thành công.').slideDown(1000).delay(7000).slideUp('slow');
            dtReportLoadModal.ajax.reload();
            sys.HideLoading();
        } else {
            $(".error").html("Tạo yêu cầu nhận hàng thất bại!").slideDown(1000).delay(15000).slideUp('slow');
            sys.HideLoading();
        }
    });
}
function ViewTableData() {
    $('.btn-loadmodal').click();
   
}

function loadInfo() {
    var token = $.cookie('token');
    $.when(sys.CallAjaxasync(apiCustomer + '/Account/GetCurrentInfo', null, token)).done(function (data) {
        if (data.isSuccess) {
            var info = data.data;
            senderId = info.id;
            senderName = info.name;
            senderPhone = info.phoneNumber;
            senderAddress = info.address;
            senderCompany = info.nameEn;
            latFrom = info.lat;
            lngFrom = info.lng;
            districtSenderId = info.districtId;
            citySenderId = info.provinceId;
            wardSenderId = info.wardId;
            $.when(sys.CallAjaxasync(apiCustomer + '/hub/GetHubByWardId', { wardId: wardSenderId }, token)).done(function (dataH) {
                if (dataH.isSuccess && dataH.data != null) {
                    var hub = dataH.data;
                    hubSenderId = hub.id;
                }
            });
        }
    });
}