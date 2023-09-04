var dtReport
var token
var latFrom = 0
var lngFrom = 0
var senderId = 0
var hubSenderId = 0
var hubRoutingId = 0
var wardSenderId = 0
var districtSenderId = 0
var citySenderId = 0
var senderName, senderPhone, senderAddress, senderCompany
var requestShipment = {}
var listLaingId = [];
$(document).ready(function () {
    //
    token = $.cookie('token')
    _LoadPayment()
    _LoadProvince()
    loadInfo()
    var date = new Date()
    var date2 = new Date()
    date.setDate(date.getDate() - 7)
    var strDatefrom = date.getFullYear() + '-' + (date.getMonth('mm') + 1) + '-' + date.getDate()
    var strDate = date2.getFullYear() + '-' + (date2.getMonth() + 1) + '-' + date2.getDate()
    $('.form-starDate').val(strDatefrom)
    $('.form-starDate').parent().parent().addClass('active')
    $('.form-EndDate').val(strDate)
    $('.form-EndDate').parent().parent().addClass('active')
    // GetStatusLading()
    $('.selectAll').change(function () {
        if ($(this).prop('checked')) {
            $('tbody tr td input[type="checkbox"]').each(function () {
                $(this).prop('checked', true)
            })
        } else {
            $('tbody tr td input[type="checkbox"]').each(function () {
                $(this).prop('checked', false)
            })
        }
    })
    dtReport = $('#waitingPickup').DataTable({
        ordering: true,
        bFilter: true,
        //scrollY: '450px',
        //scrollCollapse: true,
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
            url: apiCustomer + '/shipment/GetWaitingPickup',
            contentType: 'application/json',
            type: 'GET',
            data: function (d) {
                return {
                    pageSize: d.length,
                    pageNumber: d.draw,
                    fromDate: $('.form-starDate').val(),
                    toDate: $('.form-EndDate').val(),
                    provinceId: $('.province-filter-select').val(),
                    cols: 'ShipmentStatus,PaymentType'
                }
            }, beforeSend: function (request) {
                if ($.cookie('token')) {
                    request.setRequestHeader('Authorization', 'Bearer ' + $.cookie('token'))
                }
            },
            dataSrc: 'data'
        },
        "order": [[2, 'asc']],
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
            { data: 'cod', className: 'number', render: function (data) { return (data) } },
            { data: 'totalPrice', className: 'number', render: function (data) { return (data) } },
            { data: 'priceCOD', className: 'number', render: function (data) { return (data ? data : 0) } },
            { data: 'receiverName' },
            { data: 'receiverPhone' },
            { data: 'addressNoteTo' },
            { data: 'shippingAddress' },
            {
                data: 'paymentType', className: '', render: function (data) {
                    if (data) {
                        return data.name
                    } else {
                        return 'none'
                    }
                }
            },
            { data: 'orderDate', className: 'date', render: function (data) { return (sys.formatDateTimeVN(data, true)) } },
            { data: 'weight', className: 'weight', render: function (data) { return (data) } }
        ],
        columnDefs: [{
            'targets': 1,
            'data': 'id',
            'render': function (data, type, full, meta) {
                var htmlButton = ''
                htmlButton += ' <button style="background-color:#80c241;border-color:#80c241" type="button" class="btn btn-xs btn-success" data-id =' + data + ' onclick="ViewDetail(\'' + full.shipmentNumber + '\')">Xem</button>'
                if (full.shipmentStatusId === 1 || full.shipmentStatusId === 11 || full.shipmentStatusId === 9 || full.shipmentStatusId === 10 || full.shipmentStatusId === 14 || full.shipmentStatusId === 18 || full.shipmentStatusId === 19 || full.shipmentStatusId === 54) {
                    htmlButton += ' <button type="button" class="btn btn-xs btn-success" data-id =' + data + ' onclick="ViewEdit(\'' + full.shipmentNumber + '\')">Sửa</button>'
                    htmlButton += ' <button type="button" class="btn btn-xs btn-danger" data-id =' + data + ' onclick="DeleteLading(' + data + ')">Hủy</button>'
                    htmlButton += '<div class="message_systems" style="visibility: visible;"></div>'
                }
                return htmlButton
            }
        }],
        fnRowCallback: function (nRow, aData, iDisplayIndex) {
            $(nRow).addClass('row_' + aData['id']);
            $(nRow).attr('id', aData['id']);
            $(nRow).attr('senderName', aData['senderName']);
            $(nRow).attr('senderPhone', aData['senderPhone']);
            $(nRow).attr('addressFrom', aData['pickingAddress']);
            $(nRow).attr('provinceId', aData['fromProvinceId']);
            $(nRow).attr('districtId', aData['fromDistrictId']);
            $(nRow).attr('wardId', aData['fromWardId']);
            $(nRow).attr('hubId', aData['fromHubId']);
            $(nRow).attr('lat', aData['latFrom']);
            $(nRow).attr('lng', aData['lngFrom']);
            $(nRow).attr('totalBox', aData['totalBox']);
            $(nRow).attr('weight', aData['weight']);
            if (aData['Status'] == 12) {
                $(nRow).addClass('successlading')
            }
            if (aData['Status'] == 26) {
                $(nRow).addClass('sendbacklading')
            }
        },
        // dom: 'Bfrtip',
        buttons: [
            {
                extend: 'excel',
                text: '<span class="fa fa-file-excel-o"></span> Xuất Excel',
                exportOptions: {
                    columns: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
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
    $('.btn-excel').on('click', function () {
        var oSettings = dtReport.settings()
        var pageInfo = dtReport.page.info()
        var lengthBefore = pageInfo.length
        dtReport.page.len(pageInfo.recordsTotal)
        var dataOld = dtReport.rows().data()

        dtReport.ajax.reload(function () {
            dtReport.button().trigger()
            dtReport.page.len(lengthBefore)
            dtReport.clear()
            if (dataOld) {
                dtReport.rows.add(dataOld)
            }
            dtReport.draw()
        }, false)
    })
    $('.btn-search').on('click', function () {
        dtReport.ajax.reload()
    })
    $('.btn-print').on('click', function () {
        var listLaingId = []
        $('tbody tr td input[type="checkbox"]').each(function () {
            if ($(this).prop('checked')) {
                listLaingId.push($(this).closest('tr').attr('id'))
            }
        })
        if (listLaingId.length == 0) {
            $('.error').html('Vui lòng chọn vận đơn!').show()
            return
        } else {
            PrintBill(listLaingId)
        }
    })
    
    $('.btn-create').on('click', function () {
        var listLaingId = []
        $('tbody tr td input[type="checkbox"]').each(function () {
            if ($(this).prop('checked')) {
                listLaingId.push(Number($(this).closest('tr').attr('id')))
            }
        })
        if (listLaingId.length == 0) {
            $('.error').html('Vui lòng chọn vận đơn!').slideDown(1000).delay(15000).slideUp('slow')
            return
        } else {
            ViewSelectAddress();
        }
        
    })
    //
    // $('.btn-loadModalAddress').click(function() {
        
    // })
    $('.bt-save-loadmodal').on('click', function () {
        $(".bt-save-loadmodal").attr("disabled", true);
        setTimeout(() => {
            $(".bt-save-loadmodal").attr("disabled", false);
        }, 2000);
        sendRequest();
    })
    function _LoadPayment() {
        var html = ''
        var token = $.cookie('token')
        $.when(sys.CallAjaxasync(apiCustomer + '/paymentType/GetAll',
            null,
            token
        )).done(function (data) {
            if (data.isSuccess) {
                $.each(data.data, function (key, value) {
                    html += "<option value='" + value.id + "'>" + value.name + '</option>'
                })
                $('select.payment').html(html)
            }
        })
    }
    $(".modal-sender-address-select").on('change', function () {
        var data = JSON.stringify($(".modal-sender-address-select").val());
        var dataPar = JSON.parse(JSON.parse(data));
        htmlHub = '';
        $.when(sys.CallAjaxasync(apiCore + '/Hub/GetHubByWardId', { wardId: dataPar.wardId }, null)).done(function (data) {
            if (data.isSuccess && data.data != null) {
                var hub = data.data;
                console.log(hub);
                htmlHub += "<option>" + hub.name + "</option>"
                $(".modal-hub-select").html(htmlHub);
                $(".modal-hub-select").chosen();
                $('.modal-hub-select').prop('disabled', true);
                $(".modal-hub-select").trigger("chosen:updated");
            }
        });
        _selectAddress();
    });
    
    function _LoadProvince() {
        var html = "";
        var token = $.cookie('token');
        $.when(sys.CallAjaxasync(apiCustomer + '/province/getProvince',
            null,
            token
        )).done(function (data) {
            if (data.isSuccess) {
                html += "<option value=''>Chọn tỉnh thành</option>";
                const results = data.data.sort((x, y) => sys.BoDauTiengViet(y.name) > sys.BoDauTiengViet(x.name) ? -1 : 1);
                $.each(results, function (key, value) {
                    html += "<option value='" + value.id + "'>" + value.name + "</option>";
                });
                $("select.province-filter-select").html(html);
                $("select.province-filter-select").chosen();
                $("select.province-filter-select").trigger("chosen:updated");
            }
        });
    }
})
//Change Select Address
var _selectAddress = function () {
    requestShipment = {}
    var data = JSON.stringify($(".modal-sender-address-select").val());
    var dataPar = JSON.parse(JSON.parse(data));

    var senderName = dataPar.senderName;
    var senderPhone = dataPar.senderPhone;
    var provinceid = dataPar.provinceId;
    var districtid = dataPar.districtId;
    var wardid = dataPar.wardId;
    var hubId = dataPar.hubId;
    var address = dataPar.addressfrom;
    var lat = dataPar.lat;
    var lng = dataPar.lng;
    var totalWeight = dataPar.totalWeight;

    requestShipment.senderName = senderName;
    requestShipment.senderPhone = senderPhone;
    requestShipment.hubId = hubId;
    requestShipment.fromWardId = wardid;
    requestShipment.fromDistrictId = districtid;
    requestShipment.fromProvinceId = provinceid;
    requestShipment.pickingAddress = address;
    requestShipment.latFrom = lat;
    requestShipment.lngFrom = lng;
    requestShipment.currentLat = lat;
    requestShipment.currentLng = lng;
    requestShipment.totalWeight = totalWeight;
}
function sendRequest() {
    sys.Loading()
    requestShipment.orderDate = sys.formatDateTimeSQL(new Date())
    requestShipment.senderId = senderId
    requestShipment.cusNote = $(".cus-noted").val() ? $(".cus-noted").val() : null;
    // requestShipment.weight = oj.totalWeight;
    requestShipment.totalBox = 0
    //
    // requestShipment.senderAddress = oj.addressfrom;
    // requestShipment.fromProvinceId = oj.provinceId;
    // requestShipment.fromDistrictId = oj.districtId;
    // requestShipment.fromWardId = oj.wardId;
    // requestShipment.latFrom = oj.lat;
    // requestShipment.lngFrom = oj.lng;
    // requestShipment.currentLat = oj.lat;
    // requestShipment.currentLng = oj.lng;
    // requestShipment.pickingAddress = oj.addressfrom;
    // requestShipment.location = oj.addressfrom;
    //
    requestShipment.ListShipmentId = listLaingId;
    
    $.when(sys.CallAjaxasync(apiCore + '/Hub/GetInfoHubRouting', { districtId: requestShipment.fromDistrictId, weight: requestShipment.totalWeight}, null)).done(function (data) {
        if (data.isSuccess && data.data != null) {
            var hub = data.data;
            hubSenderId = hub.hubId;
            hubRoutingId = hub.hubRoutingId;
        }
    });
    // $.when(sys.CallAjaxasync(apiCustomer + '/hub/GetHubByWardId', { wardId: requestShipment.fromWardId }, token)).done(function (dataH) {
    //     if (dataH.isSuccess && dataH.data != null) {
    //         var hub = dataH.data
    //         hubId = hub.id
    //     }
    // })
    requestShipment.fromHubId = hubSenderId ? hubSenderId : null;
    requestShipment.currentHubId = hubSenderId ? hubSenderId : null;
    requestShipment.fromHubRoutingId = hubRoutingId ? hubRoutingId : null;
    // requestShipment.fromHubRoutingId = null;
    console.log(requestShipment);
    if (requestShipment.fromHubRoutingId == 0 || !requestShipment.fromHubRoutingId) {
        $('.error').html('Địa điểm lấy hàng chưa được phục vụ!').slideDown(500).delay(15000).slideUp();
        sys.HideLoading();
        return;
    }
    $.when(sys.CallAjaxPostasync(apiCustomer + '/requestshipment/CreateRequest', requestShipment, token)).done(function (data) {
        if (data.isSuccess) {
            $('.success').html('Gửi yêu cầu nhận hàng thành công: ' + data.data.shipmentNumber).slideDown(500).delay(12000).slideUp();
            dtReport.ajax.reload()
            $(".cus-noted").val("");
            sys.HideLoading();
            $('.bt-close-loadmodal').click();
        } else {
            $('.error').html('Tạo yêu cầu nhận hàng thất bại!').slideDown(500).delay(15000).slideUp();
            sys.HideLoading()
        }
    })
}
var loadDataSelectAddress = function() {
    var arrayGroup = [];
    listLaingId = [];
    $('tbody tr td input[type="checkbox"]').each(function () {
        var array = {};
        if ($(this).prop('checked')) {
            array.id = Number($(this).closest('tr').attr('id'));
            array.senderName = $(this).closest('tr').attr('senderName');
            array.senderPhone = $(this).closest('tr').attr('senderPhone');
            array.provinceId = Number($(this).closest('tr').attr('provinceId'));
            array.districtId = Number($(this).closest('tr').attr('districtId'));
            array.wardId = Number($(this).closest('tr').attr('wardId'));
            array.hubId = Number($(this).closest('tr').attr('hubId'));
            array.lat = Number($(this).closest('tr').attr('lat'));
            array.lng = Number($(this).closest('tr').attr('lng'));
            array.addressfrom = $(this).closest('tr').attr('addressfrom');
            array.weight = $(this).closest('tr').attr('weight');
            array.totalBox = $(this).closest('tr').attr('totalBox');
            arrayGroup.push(array);
        }
    })
    console.log(arrayGroup);
    var html = "";
    Array.prototype.groupBy = function(prop) {
        const count = 0;
        return this.reduce(function(groups, item) {
        const val = item[prop]
        groups[val] = groups[val] || []
        groups[val].push(item)
        return groups
        }, {})
    };

    const groupByMake = arrayGroup.groupBy('addressfrom');
    var array = $.map(groupByMake, function(value, index) {
        return [value];
    });
    console.log(array);

    if (arrayGroup.length == 0) {
        $('.error').html('Vui lòng chọn vận đơn!').slideDown(1000).delay(15000).slideUp('slow')
        return
    } else {
        listLaingId = [];
        // ViewSelectAddress();
        totalWeight = 0;
        totalBox = 0;
        for (let i = 0; i < arrayGroup.length; i++) { 
            listLaingId.push(arrayGroup[i].id);
            totalWeight += Number(arrayGroup[i].weight);
            totalBox += Number(arrayGroup[i].totalBox);
        }

        for (let i = 0; i < array.length; i++) {
            var oj = {};
            for (let j = 0; j < array[i].length; j++) {
                oj.senderName = array[i][0].senderName;
                oj.senderPhone = array[i][0].senderPhone;
                oj.addressfrom = array[i][0].addressfrom;
                oj.provinceId = array[i][0].provinceId;
                oj.districtId = array[i][0].districtId;
                oj.wardId = array[i][0].wardId;
                oj.hubId = array[i][0].hubId;
                oj.lat = array[i][0].lat;
                oj.lng = array[i][0].lng;
            }
            oj.totalWeight = Math.round(totalWeight * 100)/100;
            oj.totalWeight = Math.round(totalBox);
            html += "<option data-representativeName='" + oj.senderName + "'data-phoneNumber='" + oj.senderPhone + "'data-provinceId='" + oj.provinceId + "'data-districtId='" + oj.districtId + "'data-wardId='" + oj.wardId + "'data-hubId='" + oj.hubId + "' value='" + JSON.stringify(oj) + "'>" + oj.addressfrom + "</option>"
            $(".modal-sender-address-select").html(html);
            $(".modal-sender-address-select").chosen();
            $(".modal-sender-address-select").trigger("chosen:updated");
        }
        requestShipment.senderName = array[0][0].senderName;
        requestShipment.senderPhone = array[0][0].senderPhone;
        requestShipment.pickingAddress = array[0][0].addressfrom;
        requestShipment.fromProvinceId = array[0][0].provinceId;
        requestShipment.fromDistrictId = array[0][0].districtId;
        requestShipment.fromWardId = array[0][0].wardId;
        requestShipment.fromHubId = array[0][0].hubId;
        requestShipment.latFrom = array[0][0].lat;
        requestShipment.lngFrom = array[0][0].lng;
        
        $.when(sys.CallAjaxasync(apiCore + '/Hub/GetInfoHubRouting', { districtId: requestShipment.fromDistrictId, weight: requestShipment.totalWeight}, null)).done(function (data) {
            if (data.isSuccess && data.data != null) {
                var hub = data.data;
                hubSenderId = hub.hubId;
                hubRoutingId = hub.hubRoutingId;
            }
        });
        requestShipment.fromHubId = hubSenderId ? hubSenderId : null;
        requestShipment.currentHubId = hubSenderId ? hubSenderId : null;
        requestShipment.fromHubRoutingId = hubRoutingId ? hubRoutingId : null;
        requestShipment.totalWeight = Math.round(totalWeight * 100)/100;

        htmlHub = '';
        $.when(sys.CallAjaxasync(apiCore + '/Hub/GetHubByWardId', { wardId: arrayGroup[0].wardId }, null)).done(function (data) {
            if (data.isSuccess && data.data != null) {
                var hub = data.data;
                console.log(hub);
                htmlHub += "<option>" + hub.name + "</option>"
                $(".modal-hub-select").html(htmlHub);
                $(".modal-hub-select").chosen();
                $('.modal-hub-select').prop('disabled', true);
                $(".modal-hub-select").trigger("chosen:updated");
            }
        });
    }
}
function ViewSelectAddress() {
    $('.btn-loadModalAddress').click();
    loadDataSelectAddress()
}
function GetStatusLading() {
    $.when(sys.CallAjax('/lading/ListStatus')).done(function (data) {
        if (data !== null) {
            var html = "<option value=''>Chọn tất cả</option>"
            $.each(data, function (key, value) {
                html += "<option value='" + value.StatusLadings + "'>" + value.StatusName + '</option>'
            })
            $('select.TypeStatus').html(html)

            $('select.TypeStatus').chosen()
        }
    })
}

function PrintBill(lading) {
    var previewWindow = window.open('about:blank', '_blank', '', false)
    var htmlContent = "<html><head><link  href='/Content/css/printbill/bill.css' rel='stylesheet' type='text/css'/><script src='http://code.jquery.com/jquery-1.11.0.min.js'></script><script src='/ScriptSys/GetData/title.js'></script><script src='/ScriptSys/GetData/GetData.js'></script><script src='/Tool_JS/js/jquery.cookie.js'></script>"
    htmlContent += '</head>'
    htmlContent = htmlContent + '<body>'
    htmlContent = htmlContent + getDataConentHTMLFlashShip(lading)
    htmlContent = htmlContent + '</body></html>'
    // printbill
    previewWindow.document.open()
    previewWindow.document.write(htmlContent)
    previewWindow.document.close()
    setTimeout(function () {
        previewWindow.print()
    }, 200)
    setTimeout(function () {
        //  previewWindow.close()
    }, 1000)
}
function getDataConentHTML(strlading) {
    var html = ''
    if (strlading.length > 0) {
        $.each(strlading, function (index, ladingId) {
            var cols = 'PaymentType,Service,PaymentType,ToHub,Structure,FromHub,Sender'
            $.when(sys.CallAjaxasync(apiCustomer + '/shipment/getById', { id: ladingId, cols: cols }, token)).done(function (data) {
                if (data.isSuccess == true) {
                    var ladings = data.data
                    if (ladings !== null) {
                        html += `
                        <div id='print-section'>
                            <div class='bk-detail-page' style='font-size: 11px;padding: 16px 16px 0 16px;'>
                                <div class='page-header' style='font-size: 11px;display:flex;'>
                                    <div class='pull-left' style='width: 15%;'>
                                        <div class='logo-wrapper'>
                                            <div class='logo'>
                                                <img class='logo-img In-Bill-Logo' src="" id='In-Bill-Logo'>
                                            </div>
                                        </div>
                                    </div>
                                    <div class='pull-left' style='width: 35%;'>
                                        <div class='company-name' style='font-size: 12px;' id='Full-CompanyName'></div>
                                        <div>Điện thoại:  <span id='Hotline'></span></div>
                                        <div>Địa chỉ: <span id='AddressCompany'></span></div>
                                    </div>
                                    <div class='pull-right' style='text-align: center;width: 50%;'>
                                        <div class='barcode' style='margin-top: -10px; margin-bottom: 0px;display: flex;justify-content: center;'>
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
                                                        <span style='font-weight: 600;'>` + ladings.senderName + `</span>
                                                    </div>
                                                    <div>
                                                        Tên công ty:
                                                        <span style='font-weight: 600;'>` + ((ladings.companyFrom != null) ? (ladings.companyFrom) : `-- Không --`) + `</span>
                                                    </div>
                                                    <div>
                                                        Mã khách hàng:
                                                        <span style='font-weight: 600;'>` + ladings.shipmentNumber + `</span>
                                                    </div>
                                                    <div>
                                                        Địa chỉ:
                                                        <span style='font-weight: 600;'>` + ladings.pickingAddress + `</span>
                                                    </div>
                                                    <div>
                                                        Điện thoại:
                                                        <span style='font-weight: 600;'>` + ((ladings.senderPhone != null) ? (ladings.senderPhone) : `-- Không --`) + `</span>
                                                    </div>
                                                </div>
                                                <div class='item-content-left'>
                                                    <div class='title-info'>
                                                        2. THÔNG TIN NGƯỜI NHẬN HÀNG
                                                    </div>
                                                    <div>
                                                        Họ tên:
                                                        <span style='font-weight: 600;'>` + ladings.receiverName + `</span>
                                                    </div>
                                                    <div>
                                                        Tên công ty
                                                        <span></span>
                                                    </div>
                                                    <div>
                                                        Địa chỉ:
                                                        <span style='font-weight: 600;'>` + (ladings.addressNoteTo && ladings.addressNoteTo != '&nbsp;' ? '(' + ladings.addressNoteTo + ') ' : '') + ladings.shippingAddress + `</span>
                                                    </div>
                                                    <div>
                                                        Điện thoại:
                                                        <span style='font-weight: 600;'>` + ladings.receiverPhone + `</span>
                                                    </div>
                                                </div>
                                                <div class='item-content-left-bot'>
                                                    <div class='title-info'>
                                                        3. THÔNG TIN HÀNG HÓA
                                                    </div>
                                                    <div>
                                                        Số kiện:
                                                        <span style='font-weight: 600;float:right;'>` + ladings.totalBox + `</span>
                                                    </div>
                                                    <div>
                                                        Trọng lượng thực tế:
                                                        <span class='unit-conver' style='font-weight: 600;'>(g)</span>
                                                        <span style="font-weight: 600;float:right;">` + ladings.weight + `</span>
                                                    </div>
                                                    <div>
                                                        Trọng lượng tính cước:
                                                        <span class='unit-conver' style='font-weight: 600;'>(g)</span>
                                                        <span style="font-weight: 600;float:right">` + ((ladings.calWeight != null) ? (ladings.calWeight) : `0`) + `</span>
                                                    </div>
                                                    <div>
                                                        Nội dung hàng hóa:
                                                        <span style='font-weight: 600;'>` + ((ladings.content != null) ? (ladings.content) : `-- Không --`) + `</span>
                                                    </div>
                                                    <div>
                                                        Ghi chú:
                                                        <span style='font-weight: 600;'>` + ((ladings.cusNote != null) ? (ladings.cusNote) : `-- Không --`) + `</span>
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
                                                        <span style='font-weight: 600;'>` + ((ladings.service != null) ? (ladings.service.name) : `-- Không -- `) + `</span>
                                                    </div>
                                                    <div>
                                                        Loại hàng hóa:
                                                        <span style='font-weight: 600;'>` + ((ladings.structure != null) ? (ladings.structure.name) : `-- Không -- `) + `</span>
                                                    </div>
                                                    <div>
                                                        Dịch vụ gia tăng:
                                                        <span></span>
                                                    </div>
                                                    <div>
                                                        Giá trị bảo hiểm:
                                                        <span class='unit-conver' style='font-weight: 600;'>(VND)</span>
                                                        <span style="font-weight: 600;float:right">` + formatMoney(ladings.insured) + `</span>
                                                        
                                                    </div>
                                                    <div>&nbsp;</div>
                                                </div>
                                                

                                <div class="item-content-right">
                                <div class="title-info">
                                    5. CƯỚC PHÍ
                                </div>
                                ` + (ladings.sender.isShowPrice ? `<div *ngIf="item.isShowPrice || item.sender?.isShowPrice">
                                    <div>
                                        Cước vận chuyển:
                                        <span style='font-weight: 600;float:right;' class="unit-conver">(VND)</span>
                                        <span style='font-weight: 600;float:right;'>` + ladings.defaultPrice + `</span>
                                    </div>
                                    <div>
                                        Cước vận dịch vụ gia tăng:
                                        <span style='font-weight: 600;float:right;' class="unit-conver">(VND)</span>
                                        <span style='font-weight: 600;float:right;'>` + ladings.totalDVGT + `</span>
                                    </div>
                                    <div>
                                        Phí khác:
                                        <span style='font-weight: 600;float:right;' class="unit-conver">(VND)</span>
                                        <span style='font-weight: 600;float:right;'>` + ladings.otherPrice + `</span>
                                    </div>
                                    <div>
                                        VAT(10%):
                                        <span style='font-weight: 600;float:right;' class="unit-conver">(VND)</span>
                                        <span style='font-weight: 600;float:right;'>` + ladings.vatPrice + `</span>
                                    </div>
                                    <div>
                                        Tổng cước:
                                        <span style='font-weight: 600;float:right;' class="unit-conver">(VND)</span>
                                        <span style='font-weight: 600;float:right;'>` + ladings.totalPrice + `</span>
                                    </div>
                                    <div>
                                        SỐ TIỀN THU HỘ (COD):
                                        <span style='font-weight: 600;float:right;' class="unit-conver">(VND)</span>
                                        <span style='font-weight: 600;float:right;'>` + ladings.cod + `</span>
                                    </div>
                                </div>` : ``) + `

                                <div class="title-info">
                                    TỔNG TIỀN PHẢI THU:
                                ` + (ladings.paymentTypeId == 1 ? ` 
                                        <span style='font-weight: 600;float:right;' class="unit-conver">(VND)</span> 
                                        <span style='font-weight: 600;float:right;'>` + formatMoney(ladings.cod + ladings.totalPrice) + `</span>` :
                                ` 
                                        <span style='font-weight: 600;float:right;' class="unit-conver">(VND)</span>
                                        <span style='font-weight: 600;float:right;'>` + formatMoney(ladings.cod) + `</span>
                                        `
                            ) + `
                                </div>
                                <div>
                                    HÌNH THỨC THANH TOÁN:
                                    <span style='font-weight: 600;'>` + (ladings.paymentType ? ladings.paymentType.name : '') + `</span>
                                    <span class="unit-conver"></span>
                                </div>
                            </div>
                                
                                                <div class='item-content-right-bot'>
                                                    <div class='sign-wrap-emp'>
                                                        <div class='sign-emp' style='border-right:1px solid'>
                                                            <div style='text-align: left;'>
                                                                Nhân viên tạo:
                                                                <span></span>
                                                            </div>
                                                            <div>
                                                                TRẠM GỬI:
                                                                <span class='hub-name' style='font-weight: 600;'>` + ((ladings.toHub != null) ? (ladings.toHub.name) : `-- Không -- `) + `</span>
                                                            </div>
                                                            <div>
                                                                ` + sys.formatDateTimeVN(ladings.orderDate, true) + `
                                                            </div>
                                                            <div>
                                                                (Người gửi ký xác nhận)
                                                            </div>
                                                            <label>&nbsp;</label>
                                                                <div style='border: none;' class='circle'>
                                                            </div>
                                                        </div>
                                                        <div class='sign-emp'>
                                                            <div>
                                                                &nbsp;
                                                                <span></span>
                                                            </div>
                                                            <div>
                                                                TRẠM PHÁT:
                                                                <span class='hub-name' style='font-weight: 600;'>` + ((ladings.fromHub != null) ? (ladings.fromHub.name) : `-- Không -- `) + `</span>
                                                            </div>
                                                            <div>
                                                                ...:...-.../.../.....
                                                            </div>
                                                            <div>
                                                                (Người nhận ký xác nhận)
                                                            </div>
                                                            <label>&nbsp;</label>
                                                                <div style='border: none;' class='circle'>
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
                                    <b id='Link-Website'></b>
                                </div>
                            </div>
                            <div style='page-break-after: always;'></div>
                        </div>
                    `
                    }
                }
            })
        })
    }
    return html
}

function getDataConentHTMLFlashShip(strlading) {
    var html = ''
    if (strlading.length > 0) {
        $.each(strlading, function (index, ladingId) {
            var cols = 'PaymentType,Service,PaymentType,ToHub,Structure,FromHub,Sender'
            $.when(sys.CallAjaxasync(apiCustomer + '/shipment/getById', { id: ladingId, cols: cols }, token)).done(function (data) {
                if (data.isSuccess == true) {
                    var ladings = data.data
                    if (ladings !== null) {
                        html += `
<table border="1" style="width: 100%;border-spacing: 0;">
    <tbody>
        <tr>
            <td border="1" rowspan="2" style="width: 20%;border: 1px solid #000;">
                <span style="font-size:9px;">
                    &nbsp;
                    <img alt="" src="http://post.flashship.com.vn/assets/images/logo/flashship.png"style="width: 60px; height: 40px;" />
                </span>
            </td>
            <td border="1" colspan="2" style="width: 80%; text-align: center;border: 1px solid #000;">
                <div style="padding: 10px 10px 0 10px;justify-content: center;display: flex;">
                    <div id='barcodeTarget'> ` + sys.getbarcodeFlashShip(ladings.shipmentNumber) + `</div>
                </div>
            </td>
        </tr>
        <tr>
            <td border="1" style="width: 60%;text-align: center;border: 1px solid #000;">
                <span style="font-size:9px;">THU COD: ` + sys.formatMoney(ladings.cod) + ` đ</span>
            </td>
            <td border="1" style="width: 20%; text-align: center;border:1px solid #000;">
                <span style="font-size:9px;">` + ladings.weight + `(kg)</span>
            </td>
        </tr>
        <tr>
            <td border="1" colspan="3" style="width: 100%;border: 1px solid #000;">
                <span style="font-size:9px;">Nội dung: ` + ladings.content + `</span>
            </td>
        </tr>
        <tr>
            <td border="1" colspan="3" style="width:100%;border: 1px solid #000;">
                <span style="font-size:9px;">
                    Tên shop: ` + ladings.senderName + ` ` + (ladings.companyFrom ? '[' + ladings.companyFrom + ']' : '' ) + `
                </span>
            </td>
        </tr>
        <tr>
            <td border="1" colspan="3" style="width: 100%;border: 1px solid #000;">
                <span style="font-size:9px;">TT KH nhận:` + ladings.receiverName +  + ` ` + (ladings.companyTo ? '[' + ladings.companyTo + ']' : '' ) + ` - ` + ladings.receiverPhone + `</span>
            </td>
        </tr>
        <tr>
            <td border="1" colspan="3" style="width:100%;border: 1px solid #000;">
                <span style="font-size:9px;">Địa chỉ:` + (ladings.addressNoteTo ? ladings.addressNoteTo  + `, `: '' ) + ladings.shippingAddress + `</span>
            </td>
        </tr>
    </tbody>
</table>                        
                        `
                    }
                }
            })
        })
    }
    return html
}
//
function loadInfo() {
    var html = "";
    $.when(sys.CallAjaxasync(apiCustomer + '/Account/GetCurrentInfo', null, token)).done(function (data) {
        if (data.isSuccess) {
            var info = data.data
            senderId = info.id
            senderName = info.name
            senderPhone = info.phoneNumber
            senderAddress = info.address
            senderCompany = info.nameEn
            latFrom = info.lat
            lngFrom = info.lng
            districtSenderId = info.districtId
            citySenderId = info.provinceId
            wardSenderId = info.wardId
            // $.when(sys.CallAjaxasync(apiCustomer + '/hub/GetHubByWardId', { wardId: wardSenderId }, token)).done(function (dataH) {
            //     if (dataH.isSuccess && dataH.data != null) {
            //         var hub = dataH.data
            //         hubSenderId = hub.id
            //     }
            // })
            $.when(sys.CallAjaxasync(apiCore + '/Hub/GetInfoHubRouting', { districtId: districtSenderId }, null)).done(function (data) {
                if (data.isSuccess && data.data != null) {
                    var hub = data.data;
                    hubSenderId = hub.hubId;
                    hubRoutingId = hub.hubRoutingId;
                }
            });
            html += "<option data-representativeName='" + senderName + "'data-phoneNumber='" + senderPhone + "'data-provinceId='" + citySenderId + "'data-districtId='" + districtSenderId + "'data-wardId='" + wardSenderId + "' data-value='" + JSON.stringify(info) + "' value='" + senderAddress + "'>" + senderAddress + "</option>"
            $.when(sys.CallAjaxasync(apiCRM + '/CusDepartment/GetByCustomerId', { customerId: senderId }, token)).done(function (department) {
                if (department.isSuccess && department.data != null) {
                    var dep = department.data;
                    department = dep;
                    $.each(department, function (key, value) {
                        html += "<option data-representativeName='" + value.representativeName + "'data-phoneNumber='" + value.phoneNumber + "'data-provinceId='" + value.provinceId + "'data-districtId='" + value.districtId + "'data-wardId='" + value.wardId + "' data-value='" + JSON.stringify(value) + "' value='" + value.address + "'>" + value.address + "</option>";
                    });
                    $(".sender-address-select").html(html);
                    $(".sender-address-select").chosen();
                    $(".sender-address-select").trigger("chosen:updated");
                }
            });
        }
    })
}
