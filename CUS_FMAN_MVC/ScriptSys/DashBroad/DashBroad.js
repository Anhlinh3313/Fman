var typeDB = ''
var dtReportLoadModal
var nameModal = 'Mới tạo'

var latFrom = 0
var lngFrom = 0
var senderId = 0
var hubSenderId = 0
var wardSenderId = 0
var districtSenderId = 0
var citySenderId = 0
var senderName, senderPhone, senderAddress, senderCompany
var listLaingId = []
var token = $.cookie('token')

var date = new Date();
var strDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
var pageSize = 25;
var pageNumber = 1;
var shipmentNumber;

$(function () {
    loadInfo();
    GetCountShipmentByShipmentStatus();
    GetCountShipmentByShipmentStatusM();

    $('.form-starDate-loadmodal').val(strDate)
    $('.form-starDate-loadmodal').parent().parent().addClass('active')
    $('.form-EndDate-loadmodal').val(strDate)
    $('.form-EndDate-loadmodal').parent().parent().addClass('active')

    // $('.btn-loadmodal').click()
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
    dtReport();
    //==================================
    var listShipmentId = []
    $(".shipment-status").html("<option value='38'>Duyệt chuyển hoàn</option><option value='33'>Tiếp tục giao hàng</option>");
    $(".shipment-status").chosen().trigger("chosen:updated");
    $('.btn-AcceptReturn').on('click', function () {
        listShipmentId = [];
        $('tbody tr td input[type="checkbox"]').each(function () {
            if ($(this).prop('checked')) {
                listShipmentId.push(Number($(this).closest('tr').attr('id')))
            }
        })
        console.log('listLading', listShipmentId)
        if (listShipmentId.length == 0) {
            $('.error').html('Vui lòng chọn vận đơn!').slideDown(1000).delay(15000).slideUp('slow')
            return
        }
        else {
            $(".btn-AR").click();
        }
    })
    $('.btn-ContinueDelivery').on('click', function () {
        listShipmentId = [];
        $('tbody tr td input[type="checkbox"]').each(function () {
            if ($(this).prop('checked')) {
                listShipmentId.push(Number($(this).closest('tr').attr('id')))
            }
        })
        console.log('listLading', listShipmentId)
        if (listShipmentId.length == 0) {
            $('.error').html('Vui lòng chọn vận đơn!').slideDown(1000).delay(15000).slideUp('slow')
            return
        }
        else {
            $(".btn-CD").click();
        }
    })
    $('.btn-accept-return').on('click', function () {
        sendAcceptReturn(listShipmentId)
    })
    $('.btn-continue-delivery').on('click', function () {
        sendContinueDelivery(listShipmentId)
    })
    //==================================
    $('.info-box.bg-green').on('click', function () {
        var typeDBClick = $(this).attr('typeDB')
        var nameModalClick = $(this).attr('typeName')
        if (typeDB != typeDBClick) {
            typeDB = typeDBClick
            nameModal = nameModalClick;
            $(".btn-AcceptReturn").addClass("display-none");
            $(".btn-ContinueDelivery").addClass("display-none");
            if (nameModal == 'Đang đi phát') {
                nameModal = 'Đang phát'
            }
            if (nameModal == "Lưu kho chờ shop check") {
                $(".btn-AcceptReturn").removeClass("display-none");
                $(".btn-ContinueDelivery").removeClass("display-none");
            }
            document.getElementById('nameModal').innerHTML = nameModal
            dtReportLoadModal.ajax.reload()
        } else {
            dtReportLoadModal.ajax.reload()
        }
    })
    $('.btn-search-loadmodal').on('click', function () {
        pageNumber = 1;
        dtReportLoadModal.ajax.reload();
    })
    $('.bt-close-loadmodal').on('click', function () {
        //dtReportLoadModal.clear()
        dtReportLoadModal.draw()
    })
    $('.btn-print').on('click', function () {
        listLaingId = [];
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
    $('.btn-excel').on('click', function () {
        var oSettings = dtReportLoadModal.settings()
        var pageInfo = dtReportLoadModal.page.info()
        var lengthBefore = pageInfo.length
        dtReportLoadModal.page.len(pageInfo.recordsTotal)
        var dataOld = dtReportLoadModal.rows().data()

        dtReportLoadModal.ajax.reload(function () {
            dtReportLoadModal.button().trigger()
            dtReportLoadModal.page.len(lengthBefore)
            dtReportLoadModal.clear()
            if (dataOld) {
                dtReportLoadModal.rows.add(dataOld)
            }
            //dtReportLoadModal.draw()
        }, false)
    })

    //var pageSize;
    //var pageNumber;
    $('#LoadData').on('page.dt', function () {
        var info = dtReportLoadModal.page.info();
        pageNumber = info.page + 1;
        console.log(pageNumber)
        //dtReportLoadModal.ajax.reload();
        //$('#pageInfo').html('Showing page: ' + info.page + ' of ' + info.pages);
    })
    $('#LoadData').on('length.dt', function (e, settings, len) {
        console.log('New page length: ' + len);
        pageSize = len;
        console.log(pageSize)
        //dtReportLoadModal.ajax.reload();
    });

    $('#LoadData_filter input[type="search"]').unbind();
    $('#LoadData_filter input[type="search"]').keyup(function (e) {
        if (e.keyCode == 13) {
            shipmentNumber = "";
            clearTimeout(timer);
            timer = setTimeout(() => {
                shipmentNumber = $('#LoadData_filter input[type="search"]').val();
                dtReportLoadModal.ajax.reload();
            }, 500);
        }
    });
})
//=========================================
function dtReport() {
    dtReportLoadModal = $('#LoadData').DataTable({
        processing: true,
        ordering: false,
        // bFilter: true,
        scrollY: '450px',
        scrollX: true,
        scrollCollapse: true,
        serverSide: true,
        //
        pagingType: 'full_numbers',
        'lengthMenu': [[25, 50, 100, 1000000], [25, 50, 100, 'Tất cả']],
        'language': {
            'lengthMenu': 'Hiển thị: _MENU_ ',
            'emptyTable': 'Không tìm thấy vận đơn trong khoảng thời gian này!',
            'paginate': {
                'previous': 'Trở lại', 'next': 'Tiếp theo', 'first': 'Trang đầu', 'last': 'Trang cuối'
            }
        },
        serverSide: true,
        ajax: {
            url: apiCustomer + '/Shipment/GetShipmentByShipmentStatusBeta',
            contentType: 'application/json',
            type: 'POST',
            data: function (d) {
                var params = {
                    pageSize: pageSize,
                    pageNumber: pageNumber,
                    OrderDateFrom: $('.form-starDate-loadmodal').val(),
                    OrderDateTo: $('.form-EndDate-loadmodal').val(),
                    senderId: senderId,
                    shipmentNumber: shipmentNumber,
                    GroupStatusId: typeDB,
                }
                return JSON.stringify(params)
                //return {
                //    pageSize: pageSize,
                //    pageNumber: pageNumber,
                //    fromDate: $('.form-starDate-loadmodal').val(),
                //    toDate: $('.form-EndDate-loadmodal').val(),
                //    type: typeDB,
                //    cols: 'ShipmentStatus,PaymentType'
                //}
            }, beforeSend: function (request) {
                if (token) {
                    request.setRequestHeader('Authorization', 'Bearer ' + token)
                }
            },
            dataFilter: function (data) {
                var json = jQuery.parseJSON(data);
                json.recordsTotal = json.data.length > 0 ? json.data[0].totalCount : 0;
                json.recordsFiltered = json.data.length > 0 ? json.data[0].totalCount : 0;
                json.data = json.data;

                return JSON.stringify(json); // return JSON string
            },
            dataSrc: 'data',
        },
        deferLoading: 57,
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
            { data: 'shipmentStatusName', className: ''},
            { data: 'deliveryNote' },
            { data: 'cod', className: 'number', render: function (data) { return (formatMoney(data)) } },
            {
                data: 'totalPrice', className: 'number', render: function (data) {
                    return (formatMoney(data))
                }
            },
            {
                data: 'priceCOD', className: 'number', render: function (data) {
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
            { data: 'orderDate', className: 'date', render: function (data) { return (sys.formatDateTimeVN(data, true)) } },
            { data: 'weight', className: 'weight', render: function (data) { return (data) } }
        ],
        "order": [[2, "asc"]],
        columnDefs: [
            {
                "visible": false,
                "searchable": false
            },
            {
                'targets': 1,
                'data': 'id',
                'render': function (data, type, full, meta) {
                    var htmlButton = ''
                    if (full.shipmentStatusId !== 57) {
                        htmlButton += ' <button type="button" class="btn btn-xs btn-success" data-id =' + data + ' onclick="ViewDetail(\'' + full.shipmentNumber + '\')">Xem</button>'
                    }
                    // if (full.shipmentStatusId === 54 || full.shipmentStatusId === 1 || full.shipmentStatusId === 41) {
                    //    htmlButton += ' <button type="button" class="btn btn-xs btn-info btn-create" data-id =' + data + ' onclick="SendRequest(\'' + full.id + '\')">Yêu cầu lấy hàng</button>'
                    // }
                    if (full.shipmentStatusId === 1 || full.shipmentStatusId === 54 || full.shipmentStatusId === 41) {
                        htmlButton += ` <button style="background-color: red;border-color: red;" type="button" class="btn btn-xs btn-success" data-id =` + data + ` onclick="ViewEdit('` + full.shipmentNumber + `')">Sửa</button>`
                    //    htmlButton += ' <button type="button" class="btn btn-xs btn-danger" data-id =' + data + ' onclick="DeleteLading(' + data + ')">Hủy</button>'
                    }
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
        // dom: 'Bfrtip',
        buttons: [
            {
                extend: 'excelHtml5',
                text: '',
                // text: '<span class="fa fa-file-excel-o"></span> Xuất Excel',
                messageTop: 'FORM QUẢN LÝ VẬN ĐƠN TRÊN CUS.GSDP.VN',
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
                },
                customize: function (xlsx) {
                    //#region new_style
                    var new_style =
                        `<?xml version="1.0" encoding="UTF-8"?>
                    <styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="https://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">
                        <numFmts count="2">
                            <numFmt numFmtId="171" formatCode="d/mm/yyyy;@" />
                            <numFmt numFmtId="172" formatCode="m/d/yyyy;@" />
                        </numFmts>
                        <fonts count="10" x14ac:knownFonts="1">
                            <font>
                                <sz val="11"/>
                                <color theme="1"/>
                                <name val="Calibri"/>
                                <family val="2"/>
                                <scheme val="minor"/>
                                </font><font><sz val="11"/>
                                <color theme="1"/>
                                <name val="Calibri"/>
                                <family val="2"/>
                                <scheme val="minor"/>
                            </font>
                            <font>
                                <b/>
                                <sz val="11"/>
                                <color theme="1"/>
                                <name val="Calibri"/>
                                <family val="2"/>
                                <scheme val="minor"/>
                            </font>
                            <font>
                                <sz val="11"/>
                                <color theme="0"/>
                                <name val="Calibri"/>
                                <family val="2"/>
                                <scheme val="minor"/>
                            </font>
                            <font>
                                <i/>
                                <sz val="11"/>
                                <color theme="1"/>
                                <name val="Calibri"/>
                                <family val="2"/>
                                <scheme val="minor"/>
                            </font>
                            <font>
                                <sz val="11"/>
                                <color rgb="FFC00000"/>
                                <name val="Calibri"/>
                                <family val="2"/>
                                <scheme val="minor"/>
                            </font>
                            <font>
                                <sz val="11"/>
                                <color rgb="FF006600"/>
                                <name val="Calibri"/>
                                <family val="2"/>
                                <scheme val="minor"/>
                            </font>
                            <font>
                                <sz val="11"/>
                                <color rgb="FF990033"/>
                                <name val="Calibri"/>
                                <family val="2"/>
                                <scheme val="minor"/>
                            </font>
                                <font><sz val="11"/>
                                <color rgb="FF663300"/>
                                <name val="Calibri"/>
                                <family val="2"/>
                                <scheme val="minor"/>
                            </font>
                            <font>
                                <b/>
                                <sz val="11"/>
                                <color rgb="FFC00000"/>
                                <name val="Calibri"/>
                                <family val="2"/>
                                <scheme val="minor"/>
                            </font>
                        </fonts>
                        <fills count="16">
                            <fill>
                                <patternFill patternType="none" />
                            </fill>
                            <fill>
                                <patternFill patternType="gray125" />
                            </fill>
                            <fill>
                                <patternFill patternType="solid">
                                    <fgColor rgb="FFC00000" />
                                    <bgColor indexed="64" />
                                </patternFill>
                            </fill>
                            <fill>
                                <patternFill patternType="solid">
                                    <fgColor rgb="FFFF0000" />
                                    <bgColor indexed="64" />
                                </patternFill>
                            </fill>
                            <fill>
                                <patternFill patternType="solid">
                                    <fgColor rgb="FFFFC000" />
                                    <bgColor indexed="64" />
                                </patternFill>
                            </fill>
                            <fill>
                                <patternFill patternType="solid">
                                    <fgColor rgb="FFFFFF00" />
                                    <bgColor indexed="64" />
                                </patternFill>
                            </fill>
                            <fill>
                                <patternFill patternType="solid">
                                    <fgColor rgb="FF92D050" />
                                    <bgColor indexed="64" />
                                </patternFill>
                            </fill>
                            <fill>
                                <patternFill patternType="solid">
                                    <fgColor rgb="FF00B050" />
                                    <bgColor indexed="64" />
                                </patternFill>
                            </fill>
                            <fill>
                                <patternFill patternType="solid">
                                    <fgColor rgb="FF00B0F0" />
                                    <bgColor indexed="64" />
                                </patternFill>
                            </fill>
                            <fill>
                                <patternFill patternType="solid">
                                    <fgColor rgb="FF0070C0" />
                                    <bgColor indexed="64" />
                                </patternFill>
                            </fill>
                            <fill>
                                <patternFill patternType="solid">
                                    <fgColor rgb="FF002060" />
                                    <bgColor indexed="64" />
                                </patternFill>
                            </fill>
                            <fill>
                                <patternFill patternType="solid">
                                    <fgColor rgb="FF7030A0" />
                                    <bgColor indexed="64" />
                                </patternFill>
                            </fill>
                            <fill>
                                <patternFill patternType="solid">
                                    <fgColor theme="1" />
                                    <bgColor indexed="64" />
                                </patternFill>
                            </fill>
                            <fill>
                                <patternFill patternType="solid">
                                    <fgColor rgb="FF99CC00" />
                                    <bgColor indexed="64" />
                                </patternFill>
                            </fill>
                            <fill>
                                <patternFill patternType="solid">
                                    <fgColor rgb="FFFF9999" />
                                    <bgColor indexed="64" />
                                </patternFill>
                            </fill>
                            <fill>
                                <patternFill patternType="solid">
                                    <fgColor rgb="FFFFCC00" />
                                    <bgColor indexed="64" />
                                </patternFill>
                            </fill>
                        </fills>
                        <borders count="2">
                            <border>
                                <left/>
                                <right/>
                                <top/>
                                <bottom/>
                                <diagonal/>
                            </border>
                            <border>
                                <left style="thin">
                                    <color indexed="64" />
                                </left>
                                <right style="thin">
                                    <color indexed="64" />
                                </right>
                                <top style="thin">
                                    <color indexed="64" />
                                </top>
                                <bottom style="thin">
                                    <color indexed="64" />
                                </bottom>
                                <diagonal/>
                            </border>
                        </borders>
                        <cellStyleXfs count="2">
                            <xf numFmtId="0" fontId="0" fillId="0" borderId="0" />
                            <xf numFmtId="9" fontId="1" fillId="0" borderId="0" applyFont="0" applyFill="0" applyBorder="0" applyAlignment="0" applyProtection="0" />
                        </cellStyleXfs>
                        <cellXfs count="70">
                            <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" />
                            <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1">
                                <alignment vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1">
                                <alignment vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1">
                                <alignment horizontal="center" vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1">
                                <alignment horizontal="right" vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="4" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1">
                                <alignment vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="4" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1">
                                <alignment horizontal="center" vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="4" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1">
                                <alignment horizontal="right" vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1">
                                <alignment vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1">
                                <alignment horizontal="center" vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1">
                                <alignment horizontal="right" vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1">
                                <alignment vertical="top" wrapText="1" />
                            </xf>
                            <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1">
                                <alignment vertical="top" wrapText="1" />
                            </xf>
                            <xf numFmtId="0" fontId="3" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1">
                                <alignment vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="3" fillId="3" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1">
                                <alignment vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="0" fillId="4" borderId="0" xfId="0" applyFill="1" applyAlignment="1">
                                <alignment vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="0" fillId="5" borderId="0" xfId="0" applyFill="1" applyAlignment="1">
                                <alignment vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="0" fillId="6" borderId="0" xfId="0" applyFill="1" applyAlignment="1">
                                <alignment vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="3" fillId="7" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1">
                                <alignment vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="0" fillId="8" borderId="0" xfId="0" applyFill="1" applyAlignment="1">
                                <alignment vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="3" fillId="9" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1">
                                <alignment vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="3" fillId="10" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1">
                                <alignment vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="3" fillId="11" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1">
                                <alignment vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="3" fillId="12" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1">
                                <alignment vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="3" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1">
                                <alignment horizontal="center" vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="3" fillId="3" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1">
                                <alignment horizontal="center" vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="0" fillId="4" borderId="0" xfId="0" applyFill="1" applyAlignment="1">
                                <alignment horizontal="center" vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="0" fillId="5" borderId="0" xfId="0" applyFill="1" applyAlignment="1">
                                <alignment horizontal="center" vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="0" fillId="6" borderId="0" xfId="0" applyFill="1" applyAlignment="1">
                                <alignment horizontal="center" vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="3" fillId="7" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1">
                                <alignment horizontal="center" vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="0" fillId="8" borderId="0" xfId="0" applyFill="1" applyAlignment="1">
                                <alignment horizontal="center" vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="3" fillId="9" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1">
                                <alignment horizontal="center" vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="3" fillId="10" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1">
                                <alignment horizontal="center" vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="3" fillId="11" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1">
                                <alignment horizontal="center" vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="3" fillId="12" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1">
                                <alignment horizontal="center" vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="3" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1">
                                <alignment horizontal="right" vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="3" fillId="3" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1">
                                <alignment horizontal="right" vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="0" fillId="4" borderId="0" xfId="0" applyFill="1" applyAlignment="1">
                                <alignment horizontal="right" vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="0" fillId="5" borderId="0" xfId="0" applyFill="1" applyAlignment="1">
                                <alignment horizontal="right" vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="0" fillId="6" borderId="0" xfId="0" applyFill="1" applyAlignment="1">
                                <alignment horizontal="right" vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="3" fillId="7" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1">
                                <alignment horizontal="right" vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="0" fillId="8" borderId="0" xfId="0" applyFill="1" applyAlignment="1">
                                <alignment horizontal="right" vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="3" fillId="9" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1">
                                <alignment horizontal="right" vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="3" fillId="10" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1">
                                <alignment horizontal="right" vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="3" fillId="11" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1">
                                <alignment horizontal="right" vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="3" fillId="12" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1">
                                <alignment horizontal="right" vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1">
                                <alignment horizontal="center" vertical="top" textRotation="90" />
                            </xf>
                            <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1">
                                <alignment horizontal="center" textRotation="255" />
                            </xf>
                            <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1">
                                <alignment textRotation="45" />
                            </xf>
                            <xf numFmtId="0" fontId="5" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1" applyAlignment="1">
                                <alignment vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="5" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1" applyAlignment="1">
                                <alignment horizontal="center" vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="5" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1" applyAlignment="1">
                                <alignment horizontal="right" vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="5" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1" applyAlignment="1">
                                <alignment vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="5" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1" applyAlignment="1">
                                <alignment horizontal="center" vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="5" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1" applyAlignment="1">
                                <alignment horizontal="right" vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="6" fillId="13" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyAlignment="1">
                                <alignment vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="6" fillId="13" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
                                <alignment vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="7" fillId="14" borderId="0" xfId="1" applyNumberFormat="1" applyFont="1" applyFill="1" applyAlignment="1">
                                <alignment vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="7" fillId="14" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
                                <alignment vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="8" fillId="15" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyAlignment="1">
                                <alignment vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="8" fillId="15" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
                                <alignment vertical="top" />
                            </xf>
                            <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyBorder="1" applyAlignment="1">
                                <alignment vertical="top" />
                            </xf>
                            <xf numFmtId="171" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyAlignment="1">
                                <alignment horizontal="center" vertical="top" />
                            </xf>
                            <xf numFmtId="172" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyAlignment="1">
                                <alignment horizontal="center" vertical="top" />
                            </xf>
                            <xf numFmtId="171" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1">
                                <alignment horizontal="center" vertical="top" />
                            </xf>
                            <xf numFmtId="172" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1">
                                <alignment horizontal="center" vertical="top" />
                            </xf>
                            <xf numFmtId="171" fontId="9" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1" applyAlignment="1">
                                <alignment horizontal="center" vertical="top" />
                            </xf>
                            <xf numFmtId="172" fontId="9" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1" applyAlignment="1">
                                <alignment horizontal="center" vertical="top" />
                            </xf>
                            <xf numFmtId="171" fontId="9" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1" applyAlignment="1">
                                <alignment horizontal="center" vertical="top" />
                            </xf>
                            <xf numFmtId="172" fontId="9" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1" applyAlignment="1">
                                <alignment horizontal="center" vertical="top" />
                            </xf>
                        </cellXfs>
                        <cellStyles count="2">
                            <cellStyle name="Procent" xfId="1" builtinId="5" />
                            <cellStyle name="Standaard" xfId="0" builtinId="0" />
                        </cellStyles>
                        <dxfs count="0" />
                        <tableStyles count="0" defaultTableStyle="TableStyleMedium2" defaultPivotStyle="PivotStyleLight16" />
                        <colors>
                            <mruColors>
                                <color rgb="FF663300" />
                                <color rgb="FFFFCC00" />
                                <color rgb="FF990033" />
                                <color rgb="FF006600" />
                                <color rgb="FFFF9999" />
                                <color rgb="FF99CC00" />
                            </mruColors>
                        </colors>
                        <extLst>
                            <ext uri="{EB79DEF2-80B8-43e5-95BD-54CBDDF9020C}" xmlns:x14="https://schemas.microsoft.com/office/spreadsheetml/2009/9/main">
                                <x14:slicerStyles defaultSlicerStyle="SlicerStyleLight1" />
                            </ext>
                        </extLst>
                    </styleSheet>`
                    //#endregion new_style
                    xlsx.xl['styles.xml'] = $.parseXML(new_style);
                    var sheet = xlsx.xl.worksheets['sheet1.xml'];
                    //Apply a style to the header columns
                    $('row:first c', sheet).attr('s', '20');
                    //Individual example cells styling
                    // $('row:nth-child(4) c:nth-child(3)', sheet).attr('s','2');
                    // $('row:nth-child(4) c:nth-child(4)', sheet).attr('s','3');
                    // $('row:nth-child(5) c:nth-child(4)', sheet).attr('s','4');
                    // $('row:nth-child(6) c:nth-child(4)', sheet).attr('s','5');
                    // $('row:nth-child(7) c:nth-child(4)', sheet).attr('s','6');
                    // $('row:nth-child(8) c:nth-child(4)', sheet).attr('s','7');
                    // $('row:nth-child(9) c:nth-child(4)', sheet).attr('s','8');
                    // $('row:nth-child(10) c:nth-child(4)', sheet).attr('s','9');
                    // $('row:nth-child(11) c:nth-child(4)', sheet).attr('s','10');
                    // $('row:nth-child(12) c:nth-child(4)', sheet).attr('s','11');
                    // $('row:nth-child(13) c:nth-child(4)', sheet).attr('s','12');
                    // $('row:nth-child(14) c:nth-child(4)', sheet).attr('s','13');
                    // $('row:nth-child(15) c:nth-child(4)', sheet).attr('s','14');
                    // $('row:nth-child(16) c:nth-child(4)', sheet).attr('s','15');
                    // $('row:nth-child(17) c:nth-child(4)', sheet).attr('s','16');
                    // $('row:nth-child(18) c:nth-child(4)', sheet).attr('s','17');
                    // $('row:nth-child(19) c:nth-child(4)', sheet).attr('s','18');
                    // $('row:nth-child(20) c:nth-child(4)', sheet).attr('s','19');
                    // $('row:nth-child(21) c:nth-child(4)', sheet).attr('s','20');
                    // $('row:nth-child(22) c:nth-child(4)', sheet).attr('s','21');
                    // $('row:nth-child(23) c:nth-child(4)', sheet).attr('s','22');
                    // $('row:nth-child(24) c:nth-child(4)', sheet).attr('s','23');
                    // $('row:nth-child(25) c:nth-child(4)', sheet).attr('s','24');
                    // $('row:nth-child(26) c:nth-child(4)', sheet).attr('s','25');
                    // $('row:nth-child(27) c:nth-child(4)', sheet).attr('s','26');
                    // $('row:nth-child(28) c:nth-child(4)', sheet).attr('s','27');
                    // $('row:nth-child(29) c:nth-child(4)', sheet).attr('s','28');
                    // $('row:nth-child(30) c:nth-child(4)', sheet).attr('s','29');
                    // $('row:nth-child(31) c:nth-child(4)', sheet).attr('s','30');
                    // $('row:nth-child(32) c:nth-child(4)', sheet).attr('s','31');
                    // $('row:nth-child(33) c:nth-child(4)', sheet).attr('s','32');
                    // $('row:nth-child(34) c:nth-child(4)', sheet).attr('s','33');
                    // $('row:nth-child(35) c:nth-child(4)', sheet).attr('s','34');
                    // $('row:nth-child(36) c:nth-child(4)', sheet).attr('s','35');
                    // $('row:nth-child(37) c:nth-child(4)', sheet).attr('s','36');
                    // $('row:nth-child(38) c:nth-child(4)', sheet).attr('s','37');
                    // $('row:nth-child(39) c:nth-child(4)', sheet).attr('s','38');
                    // $('row:nth-child(40) c:nth-child(4)', sheet).attr('s','39');
                    // $('row:nth-child(41) c:nth-child(4)', sheet).attr('s','40');
                    // $('row:nth-child(42) c:nth-child(4)', sheet).attr('s','41');
                    // $('row:nth-child(43) c:nth-child(4)', sheet).attr('s','42');
                    // $('row:nth-child(44) c:nth-child(4)', sheet).attr('s','43');
                    // $('row:nth-child(45) c:nth-child(4)', sheet).attr('s','44');
                    // $('row:nth-child(46) c:nth-child(4)', sheet).attr('s','45');
                    // $('row:nth-child(47) c:nth-child(4)', sheet).attr('s','46');
                    // $('row:nth-child(48) c:nth-child(4)', sheet).attr('s','47');
                    // $('row:nth-child(49) c:nth-child(4)', sheet).attr('s','48');
                    // $('row:nth-child(50) c:nth-child(4)', sheet).attr('s','49');
                    // $('row:nth-child(51) c:nth-child(4)', sheet).attr('s','50');
                    // $('row:nth-child(52) c:nth-child(4)', sheet).attr('s','51');
                    // $('row:nth-child(53) c:nth-child(4)', sheet).attr('s','52');
                    // $('row:nth-child(54) c:nth-child(4)', sheet).attr('s','53');
                    // $('row:nth-child(55) c:nth-child(4)', sheet).attr('s','54');
                    // $('row:nth-child(56) c:nth-child(4)', sheet).attr('s','55');
                    // $('row:nth-child(57) c:nth-child(4)', sheet).attr('s','56');
                    // $('row:nth-child(58) c:nth-child(4)', sheet).attr('s','57');
                    // $('row:nth-child(59) c:nth-child(4)', sheet).attr('s','58');
                    // $('row:nth-child(60) c:nth-child(4)', sheet).attr('s','59');
                    // $('row:nth-child(61) c:nth-child(4)', sheet).attr('s','60');
                    // $('row:nth-child(62) c:nth-child(4)', sheet).attr('s','61');
                    // $('row:nth-child(63) c:nth-child(4)', sheet).attr('s','62');
                    // $('row:nth-child(64) c:nth-child(4)', sheet).attr('s','63');
                    // $('row:nth-child(65) c:nth-child(4)', sheet).attr('s','64');
                    // $('row:nth-child(66) c:nth-child(4)', sheet).attr('s','65');
                    // $('row:nth-child(67) c:nth-child(4)', sheet).attr('s','66');
                    // $('row:nth-child(68) c:nth-child(4)', sheet).attr('s','67');
                    // $('row:nth-child(69) c:nth-child(4)', sheet).attr('s','68');
                }
            }]
    })
}
function GetCountShipmentByShipmentStatus() {
    
    var dateF
    var dateT
    dateF = strDate
    dateT = strDate
    $.when(sys.CallAjaxasync(apiCustomer + '/shipment/GetCountShipmentByShipmentStatusBeta', {
        fromDate: dateF,
        toDate: dateT,
        senderId: senderId
    }, token)).done(function (data) {
        if (data.isSuccess) {
            $.each(data.data, function (index, result) {
                document.getElementById("Count" + result.statusCode).innerHTML = result.totalCount;
                document.getElementById("name" + result.statusCode).innerHTML = result.nameVN;
                //if (result.name == "New Request") {
                //    document.getElementById("CountRequestList").innerHTML = result.count;
                //}
                //if (result.name == "Ready To Pick") {
                //    document.getElementById("CountReadyToPickList").innerHTML = result.count;
                //}
                //if (result.name == "Pickup Complete") {
                //    document.getElementById("CountPickupCompleteList").innerHTML = result.count;
                //}
                //if (result.name == "Return Complete") {
                //    document.getElementById("CountReturnCompleteList").innerHTML = result.count;
                //}
                //if (result.name == "WaitingAcceptReturn") {
                //    document.getElementById("CountWaitingAcceptReturnList").innerHTML = result.count;
                //}
                //if (result.name == "Delivering") {
                //    document.getElementById("CountDeliveringList").innerHTML = result.count;
                //}
                //if (result.name == "Delivery Complete") {
                //    document.getElementById("CountDeliveryCompleteList").innerHTML = result.count;
                //}
                //if (result.name == "Lost Package") {
                //    document.getElementById("CountLostPackageList").innerHTML = result.count;
                //}
                //if (result.name == "Cancel") {
                //    document.getElementById("CountCancelList").innerHTML = result.count;
                //}
                //if (result.name == "Delivery Fail") {
                //    document.getElementById("CountFailList").innerHTML = result.count;
                //}
            })
        }
    });
}
function GetCountShipmentByShipmentStatusM() {
    var date = new Date();
    var strFromDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-01';
    var strToDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

    $.when(sys.CallAjaxasync(apiCustomer + '/shipment/GetCountShipmentByShipmentStatusBeta', {
        fromDate: strFromDate,
        toDate: strToDate,
        senderId: senderId
    }, token)).done(function (data) {
        if (data.isSuccess) {
            $.each(data.data, function (index, result) {
                document.getElementById("Count" + result.statusCode + "M").innerHTML = '(Tổng trong tháng: ' + result.totalCount + ')';
                //if (document.getElementById("CountAllListM")) {
                //    if (result.name == "Get All") {
                //        document.getElementById("CountAllListM").innerHTML = '(Tổng trong tháng: ' + result.count + ')';
                //    }
                //}
                //if (result.name == "New Request") {
                //    document.getElementById("CountRequestListM").innerHTML = '(Tổng trong tháng: ' + result.count + ')';
                //}
                //if (result.name == "Ready To Pick") {
                //    document.getElementById("CountReadyToPickListM").innerHTML = '(Tổng trong tháng: ' + result.count + ')';
                //}
                //if (result.name == "Return Complete") {
                //    document.getElementById("CountReturnCompleteListM").innerHTML = '(Tổng trong tháng: ' + result.count + ')';
                //}
                //if (result.name == "WaitingAcceptReturn") {
                //    document.getElementById("CountWaitingAcceptReturnListM").innerHTML = '(Tổng trong tháng: ' + result.count + ')';
                //}
                //if (result.name == "Delivering") {
                //    document.getElementById("CountDeliveringListM").innerHTML = '(Tổng trong tháng: ' + result.count + ')';
                //}
                //if (result.name == "Delivery Complete") {
                //    document.getElementById("CountDeliveryCompleteListM").innerHTML = '(Tổng trong tháng: ' + result.count + ')';
                //}
                //if (result.name == "Lost Package") {
                //    document.getElementById("CountLostPackageListM").innerHTML = '(Tổng trong tháng: ' + result.count + ')';
                //}
                //if (result.name == "Cancel") {
                //    document.getElementById("CountCancelListM").innerHTML = '(Tổng trong tháng: ' + result.count + ')';
                //}
                //if (result.name == "Pickup Complete") {
                //    document.getElementById("CountPickupCompleteListM").innerHTML = '(Tổng trong tháng: ' + result.count + ')';
                //}
                //if (result.name == "Delivery Fail") {
                //    document.getElementById("CountFailListM").innerHTML = '(Tổng trong tháng: ' + result.count + ')';
                //}
            })
        }
    });
}
function sendAcceptReturn(listShipmentId) {
    console.log(listShipmentId);
    //
    
    var obj = {}
    obj.ShipmentIds = listShipmentId;
    obj.ShipmentStatusId = 38;
    if (!$(".accept-return-note").val()) {
        $('.error-accept-return').html('Vui lòng nhập nội dung!').show()
        return
    } else {
        obj.Reason = $(".accept-return-note").val();
        obj.Note = $(".accept-return-note").val();
    }
    //
    sys.Loading()
    $.when(sys.CallAjaxPostasync(apiCustomer + '/shipment/UpdateAcceptReturn', obj, token)).done(function (data) {
        if (data.isSuccess) {
            $('.success-accept-return').html('Xác nhận chuyển hoàn thành công.').slideDown(1000).delay(700000).slideUp('slow')
            $(".accept-return-note").val("");
            listShipmentId = [];
            dtReportLoadModal.ajax.reload();
            $(".close-accept-return").click();
            GetCountShipmentByShipmentStatus();
            GetCountShipmentByShipmentStatusM();
            sys.HideLoading();
        } else {
            $('.error-accept-return').html('Xác nhân chuyển hoàn thất bại!').slideDown(1000).delay(15000).slideUp('slow')
            sys.HideLoading()
        }
    })
}
function sendContinueDelivery(listShipmentId) {
    console.log(listShipmentId);
    //
    
    var obj = {}
    obj.ShipmentIds = listShipmentId;
    obj.ShipmentStatusId = 33;
    if (!$(".continue-delivery-note").val()) {
        $('.error-continue-delivery').html('Vui lòng nhập nội dung!').show()
        return
    } else {
        obj.Reason = $(".continue-delivery-note").val();
    }
    //
    sys.Loading()
    $.when(sys.CallAjaxPostasync(apiCustomer + '/shipment/UpdateAcceptReturn', obj, token)).done(function (data) {
        if (data.isSuccess) {
            $('.success-continue-delivery').html('Xác nhận chuyển hoàn thành công.').slideDown(1000).delay(700000).slideUp('slow')
            $(".continue-delivery-note").val("");
            listShipmentId = [];
            dtReportLoadModal.ajax.reload();
            $(".close-continue-delivery").click();
            GetCountShipmentByShipmentStatus();
            GetCountShipmentByShipmentStatusM();
            sys.HideLoading();
        } else {
            $('.error-continue-delivery').html('Xác nhân chuyển hoàn thất bại!').slideDown(1000).delay(15000).slideUp('slow')
            sys.HideLoading()
        }
    })
}
//=========================================
//function CancelRequest(shipmentNumber) {
//    sys.ConfirmDialog('Cảnh báo', 'Bạn có chắc muốn hủy yêu cầu nhận hàng!', function () {
//        sys.Loading()
//        var request = {}
//        request.shipmentNumber = shipmentNumber
//        $.when(sys.CallAjaxPostasync(apiCustomer + '/requestShipment/Cancel', request, token)).done(function (data) {
//            if (data.isSuccess) {
//                dtReport.ajax.reload()
//                $('.success').html('Hủy yêu cầu thành công!').slideDown(1000).delay(3000).slideUp(2000)
//                sys.HideLoading()
//            } else {
//                $('.error').html('Hủy yêu cầu thật bại!').slideDown(1000).delay(3000).slideUp(2000)
//                sys.HideLoading()
//            }
//        })
//    })
//}
//function SendRequest(listLaingId) {
//    sys.Loading()
//    var request = {}
//    request.orderDate = sys.formatDateTimeSQL(new Date())
//    request.senderId = senderId
//    request.senderName = senderName
//    request.senderPhone = senderPhone
//    request.pickingAddress = senderAddress
//    request.fromWardId = wardSenderId
//    request.fromProvinceId = citySenderId
//    request.fromDistrictId = districtSenderId
//    request.cusNote = ''
//    request.weight = 0
//    request.totalBox = 0
//    request.fromHubId = hubSenderId
//    request.currentHubId = hubSenderId
//    request.ListShipmentId = [listLaingId]
//    request.latFrom = latFrom
//    request.lngFrom = lngFrom
//    request.currentLat = latFrom
//    request.currentLng = lngFrom
//    request.location = senderAddress
//    //
//    $.when(sys.CallAjaxPostasync(apiCustomer + '/requestshipment/CreateRequest', request, token)).done(function (data) {
//        if (data.isSuccess) {
//            $('.success').html('Gửi yêu cầu nhận hàng thành công.').slideDown(1000).delay(7000).slideUp('slow')
//            dtReportLoadModal.ajax.reload()
//            sys.HideLoading()
//        } else {
//            $('.error').html('Tạo yêu cầu nhận hàng thất bại!').slideDown(1000).delay(15000).slideUp('slow')
//            sys.HideLoading()
//        }
//    })
//}
function ViewTableData() {
    var date = new Date();
    var strDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    $('.form-starDate-loadmodal').val(strDate)
    $('.form-starDate-loadmodal').parent().parent().addClass('active')
    $('.form-EndDate-loadmodal').val(strDate)
    $('.form-EndDate-loadmodal').parent().parent().addClass('active')
    $('.btn-loadmodal').click()
}

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
            $.when(sys.CallAjaxasync(apiCustomer + '/hub/GetHubByWardId', { wardId: wardSenderId }, token)).done(function (dataH) {
                if (dataH.isSuccess && dataH.data != null) {
                    var hub = dataH.data
                    hubSenderId = hub.id
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

// Print
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
    var _this = this;
    var html = '';
    var htmlPrint = '';
    var formPrintA5 = '';
    var arrShipment = [];
    _this.item;
    if (strlading.length > 0) {
        var models = [];
        $.each(strlading, function (index, ladingId) {
            models.push(ladingId);
            // var cols = 'PaymentType,Service,PaymentType,ToHub,Structure,FromHub,Sender'
        })
        $.when(sys.CallAjaxPostasync(apiPost + '/shipment/GetShipmentToPrint', { ids: models, cols: '' }, token)).done(function (data) {
            if (data.isSuccess == true) {
                var item = data.data;
                item.map(m => {
                    arrShipment.push(m);
                })
            }
        })
    }

    $.when(sys.CallAjaxasync(apiPost + '/FormPrint/getFormPrintA5', { customerId: senderId }, token)).done(function (data) {
        if (data.isSuccess == true) {
            //$('.bb-htmlPrint').html(data.data.formPrintBody)
            htmlPrint = data.data.formPrintBody;
        }
    });
    arrShipment.map((f, index) => {
        _this.item = f;
        let templateValue = htmlPrint.replace(/{{([^}}]+)?}}/g, ($1, $2) =>
            $2.split('.').reduce((p, c) => p ? ((p[c] || p[c] == 0) ? p[c] : '') : '', _this));
        //templateValue = templateValue.replace("BBQRCODE", `<span id="QR${_this.fakeId}"></span>`);
        templateValue = templateValue.replace("BBQRCODE", `<span style="font-size:9px;">
                    <div class='bar-img' id='qrcodeTarget'> ` + sys.getQRCode(_this.item.shipmentNumber) + `</div>
                </span>`);
        //formPrintA5 += templateValue.replace("BBBARCODE", `<img id="${_this.fakeId}" />`);
        formPrintA5 += templateValue.replace("BBBARCODE", `<div style="justify-content: center;display: flex;">
                    <div style="padding: 10px 0;" id='barcodeTarget' > ` + sys.getbarcodeFlashShip(_this.item.shipmentNumber) + `</div>
                </div>`);
        if (index < arrShipment.length - 1) formPrintA5 += `<p style="page-break-before: always"></p>`;
    })
    console.log(formPrintA5);
    return formPrintA5
}
// End Print
