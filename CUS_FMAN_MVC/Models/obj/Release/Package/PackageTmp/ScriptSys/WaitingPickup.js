var dtReport;
var token;
var latFrom = 0;
var lngFrom = 0;
var senderId = 0;
var hubSenderId = 0;
var wardSenderId = 0;
var districtSenderId = 0;
var citySenderId = 0;
var senderName, senderPhone, senderAddress, senderCompany;

$(function () {
    token = $.cookie('token');
    _LoadPayment();
    loadInfo();
    var date = new Date();
    var date2 = new Date();
    date.setDate(date.getDate() - 7);
    var strDatefrom = date.getFullYear() + '-' + (date.getMonth("mm") + 1) + '-' + date.getDate();
    var strDate = date2.getFullYear() + '-' + (date2.getMonth() + 1) + '-' + date2.getDate();
    $('.form-starDate').val(strDatefrom);
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
    dtReport = $('#waitingPickup').DataTable({
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
            url: apiCustomer + "/shipment/GetWaitingPickup",
            contentType: "application/json",
            type: "GET",
            data: function (d) {
                return {
                    pageSize: d.length, pageNumber: d.draw, fromDate: $('.form-starDate').val(), toDate: $('.form-EndDate').val(), cols: 'ShipmentStatus,PaymentType'
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
                        return "none"
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
                htmlButton += ' <button type="button" class="btn btn-xs btn-success" data-id =' + data + ' onclick="ViewDetail(\'' + full.shipmentNumber + '\')">Xem</button>';
                if (full.shipmentStatusId === 1 || full.shipmentStatusId === 11 || full.shipmentStatusId === 9 || full.shipmentStatusId === 10 || full.shipmentStatusId === 14 || full.shipmentStatusId === 18 || full.shipmentStatusId === 19 || full.shipmentStatusId === 54) {
                    htmlButton += ' <button type="button" class="btn btn-xs btn-success" data-id =' + data + ' onclick="ViewEdit(\'' + full.shipmentNumber + '\')">Sửa</button>';
                    htmlButton += ' <button type="button" class="btn btn-xs btn-danger" data-id =' + data + ' onclick="DeleteLading(' + data + ')">Hủy</button>';
                }
                return htmlButton;
            }
        }],
        fnRowCallback: function (nRow, aData, iDisplayIndex) {
            $(nRow).addClass("row_" + aData["id"]);
            $(nRow).attr("id", aData["id"]);
            if (aData['Status'] == 12) {
                $(nRow).addClass("successlading");
            }
            if (aData['Status'] == 26) {
                $(nRow).addClass("sendbacklading");
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
        var listLaingId = [];
        $('tbody tr td input[type="checkbox"]').each(function () {
            if ($(this).prop('checked')) {
                listLaingId.push($(this).closest('tr').attr('id'));
            }
        });
        if (listLaingId.length == 0) {
            $(".error").html("Vui lòng chọn vận đơn!").show();
            return;
        } else {
            PrintBill(listLaingId);
        }
    });

    $('.btn-create').on("click", function () {
        var listLaingId = [];
        $('tbody tr td input[type="checkbox"]').each(function () {
            if ($(this).prop('checked')) {
                listLaingId.push(Number($(this).closest('tr').attr('id')));
            }
        });
        console.log("listLading", listLaingId);
        if (listLaingId.length == 0) {
            $(".error").html("Vui lòng chọn vận đơn!").slideDown(1000).delay(15000).slideUp('slow');
            return;
        } else {
            sendRequest(listLaingId);
        }
    });

    function _LoadPayment() {
        var html = "";
        var token = $.cookie('token');
        $.when(sys.CallAjaxasync(apiCustomer + '/paymentType/GetAll',
            null,
            token
        )).done(function (data) {
            if (data.isSuccess) {
                $.each(data.data, function (key, value) {
                    html += "<option value='" + value.id + "'>" + value.name + "</option>";
                });
                $("select.payment").html(html);
            }
        });
    }

});

function sendRequest(listLaingId) {
    sys.Loading();
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
    request.ListShipmentId = listLaingId;
    request.latFrom = latFrom;
    request.lngFrom = lngFrom;
    request.currentLat = latFrom;
    request.currentLng = lngFrom;
    request.location = senderAddress;
    //
    $.when(sys.CallAjaxPostasync(apiCustomer + "/requestshipment/CreateRequest", request, token)).done(function (data) {
        if (data.isSuccess) {
            $(".success").html('Gửi yêu cầu nhận hàng thành công.').slideDown(1000).delay(7000).slideUp('slow');
            dtReport.ajax.reload();
            sys.HideLoading();
        } else {
            $(".error").html("Tạo yêu cầu nhận hàng thất bại!").slideDown(1000).delay(15000).slideUp('slow');
            sys.HideLoading();
        }
    });
}

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

function PrintBill(lading) {
    var previewWindow = window.open('about:blank', '_blank', '', false);
    var htmlContent = "<html><head><link  href='/Content/css/printbill/bill.css' rel='stylesheet' type='text/css'/><script src='http://code.jquery.com/jquery-1.11.0.min.js'></script><script src='/ScriptSys/GetData/title.js'></script><script src='/ScriptSys/GetData/GetData.js'></script>";
    htmlContent += "</head>";
    htmlContent = htmlContent + "<body>";
    htmlContent = htmlContent + getDataConentHTML(lading);
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
    var html = "";
    if (strlading.length > 0) {
        $.each(strlading, function (index, ladingId) {
            var cols = "PaymentType,Service,PaymentType,ToHub,Structure,FromHub,Sender";
            $.when(sys.CallAjaxasync(apiCustomer + "/shipment/getById", { id: ladingId, cols: cols }, token)).done(function (data) {
                if (data.isSuccess == true) {
                    var ladings = data.data;
                    if (ladings !== null) {
                        html += `
                        <div id='print-section'>
                            <div class='bk-detail-page' style='font-size: 11px;padding: 16px 16px 0 16px;'>
                                <div class='page-header' style='font-size: 11px;display:flex;'>
                                    <div class='pull-left'>
                                        <div class='logo-wrapper'>
                                            <div class='logo'>
                                                <img class='logo-img' src='' id='In-Bill-Logo'>
                                            </div>
                                        </div>
                                    </div>
                                    <div class='pull-left' style='width: 344px;'>
                                        <div class='company-name' style='font-size: 12px;' id='Full-CompanyName'></div>
                                        <div>Điện thoại:  <span id='Hotline'>0943 545 358 | 028 38 116 116</span></div>
                                        <div>Địa chỉ: <span id='AddressCompany'>28 Phan Thúc Duyện, phường 4, quận Tân Bình, Tp.Hồ Chí Minh</span></div>
                                    </div>
                                    <div class='pull-right' style='text-align: center;'>
                                        <div class='barcode' style='margin-top: -10px; margin-bottom: 0px;'>
                                            <div class='bar-img' id='barcodeTarget'> ` + sys.getbarcode(ladings.shipmentNumber) + `</div>
                                        </div>
                                       
                                    </div>
                                    <div class='clearfix'></div>
                                </div>
                                <div class='page-content' style='border: 3px solid #7a4188;'>
                                    <div class='content-wrapper'>
                                        <div style='display: flex;'>
                                            <div class='flex-left' style='border-right: 1px solid #223a44;'>
                                                <div class='item-content-left'>
                                                    <div class='title-info'>
                                                        1. THÔNG TIN NGƯỜI GỬI HÀNG
                                                    </div>
                                                    <div>
                                                        Họ tên:
                                                        <span>` + ladings.senderName + `</span>
                                                    </div>
                                                    <div>
                                                        Tên công ty:
                                                        <span>` + ((ladings.companyFrom != null) ? (ladings.companyFrom) : `-- Không --`) + `</span>
                                                    </div>
                                                    <div>
                                                        Mã khách hàng:
                                                        <span>` + ladings.shipmentNumber + `</span>
                                                    </div>
                                                    <div>
                                                        Địa chỉ:
                                                        <span>` + ladings.pickingAddress + `</span>
                                                    </div>
                                                    <div>
                                                        Điện thoại:
                                                        <span>` + ((ladings.senderPhone != null) ? (ladings.senderPhone) : `-- Không --`) + `</span>
                                                    </div>
                                                </div>
                                                <div class='item-content-left'>
                                                    <div class='title-info'>
                                                        2. THÔNG TIN NGƯỜI NHẬN HÀNG
                                                    </div>
                                                    <div>
                                                        Họ tên:
                                                        <span>` + ladings.receiverName + `</span>
                                                    </div>
                                                    <div>
                                                        Tên công ty
                                                        <span></span>
                                                    </div>
                                                    <div>
                                                        Địa chỉ:
                                                        <span>` + (ladings.addressNoteTo && ladings.addressNoteTo != "&nbsp;" ? "(" + ladings.addressNoteTo + ") " : "") + ladings.shippingAddress + `</span>
                                                    </div>
                                                    <div>
                                                        Điện thoại:
                                                        <span>` + ladings.receiverPhone + `</span>
                                                    </div>
                                                </div>
                                                <div class='item-content-left-bot'>
                                                    <div class='title-info'>
                                                        3. THÔNG TIN HÀNG HÓA
                                                    </div>
                                                    <div>
                                                        Số kiện:
                                                        <span>` + ladings.totalBox + `</span>
                                                    </div>
                                                    <div>
                                                        Trọng lượng thực tế:
                                                        <span class='unit-conver'>(g)</span>
                                                        <span style="float:right">` + ladings.weight + `</span>
                                                    </div>
                                                    <div>
                                                        Trọng lượng tính cước:
                                                        <span class='unit-conver'>(g)</span>
                                                        <span style="float:right">` + ((ladings.calWeight != null) ? (ladings.calWeight) : `0`) + `</span>
                                                    </div>
                                                    <div>
                                                        Yêu cầu phục vụ:
                                                        <span>` + ((ladings.cusNote != null) ? (ladings.cusNote) : `-- Không --`) + `</span>
                                                    </div>
                                                    <div>
                                                        <div class='title-info'>
                                                            Cam kết người gửi hàng:
                                                        </div>
                                                        <div>-Cam kết người gửi hàng</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class='flex-right'>
                                                <div class='item-content-right'>
                                                    <div class='title-info'>
                                                        4. THÔNG TIN DỊCH VỤ
                                                    </div>
                                                    <div>
                                                        Dịch vụ:
                                                        <span >` + ((ladings.service != null) ? (ladings.service.name) : `-- Không -- `) + `</span>
                                                    </div>
                                                    <div>
                                                        Loại hàng hóa:
                                                        <span >` + ((ladings.structure != null) ? (ladings.structure.name) : `-- Không -- `) + `</span>
                                                    </div>
                                                    <div>
                                                        Dịch vụ gia tăng:
                                                        <span></span>
                                                    </div>
                                                    <div>
                                                        Giá trị bảo hiểm:
<span class='unit-conver'>(VND)</span>
                                                        <span style="float:right">` + ladings.insured + `</span>
                                                        
                                                    </div>
                                                    <div>&nbsp;</div>
                                                </div>
                                                

                                <div class="item-content-right">
                                <div class="title-info">
                                    5. CƯỚC PHÍ
                                </div>
                                `+ (ladings.sender.isShowPrice ? `<div *ngIf="item.isShowPrice || item.sender?.isShowPrice">
                                    <div>
                                        Cước vận chuyển:
                                        <span>`+ ladings.defaultPrice+`</span>
                                        <span class="unit-conver">(VND)</span>
                                    </div>
                                    <div>
                                        Cước vận dịch vụ gia tăng:
                                        <span>`+ ladings.totalDVGT +`</span>
                                        <span class="unit-conver">(VND)</span>
                                    </div>
                                    <div>
                                        Phí khác:
                                        <span>`+ ladings.otherPrice +`</span>
                                        <span class="unit-conver">(VND)</span>
                                    </div>
                                    <div>
                                        VAT(10%):
                                        <span>`+ ladings.vatPrice +`</span>
                                        <span class="unit-conver">(VND)</span>
                                    </div>
                                    <div>
                                        Tổng cước:
                                        <span>`+ ladings.totalPrice +`</span>
                                        <span class="unit-conver">(VND)</span>
                                    </div>
                                    <div>
                                        SỐ TIỀN THU HỘ (COD):
                                        <span>`+ ladings.cod +`</span>
                                        <span class="unit-conver">(VND)</span>
                                    </div>
                                </div>`: ``) +`

                                <div class="title-info">
                                    TỔNG TIỀN PHẢI THU:
                                `+ (ladings.paymentTypeId == 1 ? ` 
                                        <span>`+ (ladings.cod + ladings.totalPrice) +`</span>
                                        <span class="unit-conver">(VND)</span> `:
                                        ` 
                                        <span>`+ladings.cod+`</span>
                                        <span class="unit-conver">(VND)</span>
                                        `
                                ) + `
                                </div>
                                <div>
                                    HÌNH THỨC THANH TOÁN:
                                    <span>`+ ladings.paymentType.name +`</span>
                                    <span class="unit-conver"></span>
                                </div>
                            </div>
                                
                                                <div class='item-content-right-bot'>
                                                    <div>
                                                        Nhân viên tạo:
                                                        <span></span>
                                                    </div>

                                                    <div class='sign-wrap-emp'>
                                                        <div class='sign-emp'>
                                                            <div>
                                                                TRẠM GỬI:
                                                                <span class='hub-name'>` + ((ladings.toHub != null) ? (ladings.toHub.name) : `-- Không -- `) + `</span>
                                                            </div>
                                                            <div>
                                                                10:39-01/11/2017
                                                            </div>
                                                            <div>
                                                                (Người gửi ký xác nhận)
                                                            </div>
                                                            <label>&nbsp;</label>
                                                            <div class='circle'>
                                                            </div>
                                                        </div>
                                                        <div class='sign-emp'>
                                                            <div>
                                                                TRẠM PHÁT:
                                                                <span class='hub-name'>` + ((ladings.fromHub != null) ? (ladings.fromHub.name) : `-- Không -- `) + `</span>
                                                            </div>
                                                            <div>
                                                                ...:...-.../.../.....
                                                            </div>
                                                            <div>
                                                                (Người nhận ký xác nhận)
                                                            </div>
                                                            <label>&nbsp;</label>
                                                            <div class='circle'>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class='page-footer'>
                                            <div class='signal-wrapper'>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class='research-web'>Tra cứu đơn hàng trực tiếp tại
                                    <b id='Link-Website'>http://vietstarexpress.com</b>
                                </div>
                            </div>
                            <div style='page-break-after: always;'></div>
                        </div>
                    `
                    }
                }
            });
        });
    }
    return html;
}

function loadInfo() {
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
