var dtBoxModal;
var databoxs = [];
var listLaingIds = [];

var listLadings = [];

var latFrom = 0;
var lngFrom = 0;
var senderId = 0;
var hubSenderId = 0;
var department = 0;
var wardSenderId = 0;
var districtSenderId = 0;
var citySenderId = 0;
var senderName, senderPhone, senderAddress, senderCompany;
$(document).ready(function () {
    //
    var t = $('#box-data').DataTable({
        ordering: true,
        bFilter: true,
        pagingType: 'full_numbers',
        'lengthMenu': [[5, 10, 20, 100000000], [5, 10, 20, 'Tất cả']],
        'language': {
            'lengthMenu': 'Hiển thị: _MENU_ ',
            'emptyTable': 'Chưa có kiện hàng!',
            'paginate': {
                'previous': 'Trở lại', 'next': 'Tiếp theo'
            }
        },
    });
    var ds = $('#data-shipment').DataTable({
        ordering: true,
        bFilter: true,
        pagingType: 'full_numbers',
        'lengthMenu': [[5, 10, 20, 100000000], [5, 10, 20, 'Tất cả']],
        'language': {
            'lengthMenu': 'Hiển thị: _MENU_ ',
            'emptyTable': 'Chưa có dữ liệu trong danh sách!',
            'paginate': {
                'previous': 'Trở lại', 'next': 'Tiếp theo'
            }
        },
    });

    $('#add-box').on('click', function () {
        t.row.add([
            $(".box-length").val(),
            $(".box-width").val(),
            $(".box-height").val(),
            $(".box-weight").val(),
            0,
            0
        ]).draw(false);
    });
    // Automatically add a first row of data
    //$('#add-box').click();
    //
    $('#ladingFrom').on('keyup keypress', function (e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13) {
            e.preventDefault();
            return false;
        }
    });

    var d = new Date();
    $('.form-starDate').datetimepicker({
        defaultDate: d,
    });
    window.count = 0;
    var ladingNumber = 0;
    var ladings = [];

    var tohub = 0;
    var provinceSP = 0;
    var districtSP = 0;
    var wardSP = 0;

    var firstLoad = true;

    loadInfo();

    _LoadServiceGT();
    _LoadTypePack();

    _LoadProvince();
    //LoadSenderForm($("#sender-address").val());

    $("#ladingFrom").validationEngine('attach', {
        'custom_error_messages': {
            // '.province': {
            //     'required': {
            //         'message': "* Tỉnh thành không được để trống!"
            //     }
            // },
            // '.district': {
            //     'required': {
            //         'message': "* Quận huyện không được để trống!"
            //     }
            // },
            // '.ward': {
            //     'required': {
            //         'message': "* Phường xã không được để trống!"
            //     },
            // },
            '.sender-name': {
                'required': {
                    'message': "* Ho tên người gửi không được bỏ trống!"
                }
            },
            '.sender-phone': {
                'required': {
                    'message': "* Số điện thoại gửi được để trống!"
                }
            },
            '.sender-address': {
                'required': {
                    'message': "* Địa chỉ gửi không được để trống!"
                }
            },
            '.receiver-name': {
                'required': {
                    'message': "* Ho tên người nhận không được bỏ trống!"

                }
            },
            '.receiver-phone': {
                'required': {
                    'message': "* Số điện thoại nhận được để trống!"
                }
            },
            '.weight': {
                'required': {
                    'message': "* Trọng lượng không được để trống!"
                },
                'min': {
                    'message': "* Trọng lượng phải lớn hơn 0!"
                }
            },
            '.number': {
                'required': {
                    'message': "* Số kiện không được để trống!"
                },
                'min': {
                    'message': "* Số kiện phải lớn hơn 0!"
                }
            },
            '.length': {
                'required': {
                    'message': "* Chiều dài không được để trống!"
                },
                'min': {
                    'message': "* Chiều dài phải lớn hơn 0!"
                }
            },
            '.height': {
                'required': {
                    'message': "* Chiều cao không được để trống!"
                },
                'min': {
                    'message': "* Chiều cao phải lớn hơn 0!"
                }
            },
            '.width': {
                'required': {
                    'message': "* Chiều rộng không được để trống!"
                },
                'min': {
                    'message': "* Chiều rộng phải lớn hơn 0!"
                }
            },
            '.cod': {
                'min': {
                    'message': "* COD phải lớn hơn 0!"
                }
            },
            '.description': {
                'required': {
                    'message': "* Nội dung hàng hóa không được để trống!"
                },
            },
            //'.insured': {
            //    //'required': {
            //    //    'message': "* Khai giá không được để trống!"
            //    //},
            //    //'min': {
            //    //    'message': "* Khai giá phải lớn hơn 0!"
            //    //}
            //}
        },
        promptPosition: "inline"
    });
    //Add row in table shipment
    var countShipment = 0;
    $("#add-shipment").on("click", function () {
        sys.Loading();
        if ($('#ladingFrom').validationEngine('validate')) {
            var ladingModels = GetLadingModels();
            countShipment++;
            ladingModels[0].fakeShipmentId = countShipment;
            ladingModels.forEach(function (item, x) {
                ds.row.add([
                    '<button type="button" data-id=' + item.fakeShipmentId + ' class="btn btn-xs btn-danger btn-delete-row">Xóa</button>',
                    item.fakeShipmentId,
                    item.shopCode,
                    item.shipmentStatusId == 54 ? "Yêu cầu mới" : item.shipmentStatusId,
                    item.COD ? item.COD : 0,
                    item.TotalPrice,
                    item.receiverName,
                    item.receiverPhone,
                    item.addressNoteTo,
                    item.shippingAddress,
                    item.Content,
                    item.note,
                    item.PaymentTypeId,
                    item.orderDate,
                    item.Weight,
                ]).draw(false);
                ladings = [];
                $(".lading-list").empty()
                $('#add-more').trigger('click');
                $(".success").html('Tạo thành công ' + ladingModels.length + ' đơn hàng tạm.').slideDown(1000).delay(15000).slideUp('slow');
            })
        } else {
            $(".error").html("Vui lòng nhập đầy đủ thông để tạo đơn hàng!").slideDown(1000).delay(13000).slideUp(2000);
            sys.HideLoading();
            return false;
        }
    });
    //Delete row in table shipment
    $('#data-shipment tbody').on('click', 'button.btn-delete-row', function (e) {
        var data = [];
        var _this = $(this)[0];
        listLadings.forEach(function (item, x) {
            var data = [];
            if (_this.dataset.id != item.fakeShipmentId.toString()) {
                data.push(item);
            }
        });
        listLadings = data;
        ds.row($(this).parents('tr')).remove().draw();
    });
    //
    $("#add-lading").on("click", function () {
        var token = $.cookie('token');
        //GetListPayment
        sys.Loading();
        var ladingModels = listLadings;
        if (ladingModels.length) {
            var count = 0;
            ladingModels.forEach(function (item, x) {

                $.when(sys.CallAjaxPostasync(apiCustomer + "/shipment/Create", item, token)).done(function (data) {
                    if (data.isSuccess) {
                        var id = data.data.id;
                        count++;
                        listLaingIds.push(Number(id));
                        sys.HideLoading();
                    } else {
                        $(".error").html("Lỗi trong quá trình tạo đơn hàng!").show();
                        sys.HideLoading();
                    }
                });
                if (ladingModels.length > 1) {
                    ladings = [];
                }
            })
        } else {
            $(".error").html("Không có đơn hàng để tạo!").slideDown(1000).delay(13000).slideUp(2000);
            sys.HideLoading();
            return false;
        }
        if (listLaingIds.length > 0) {
            var request = {}
            request.orderDate = sys.formatDateTimeSQL(new Date())
            request.senderId = senderId;
            request.senderName = senderName;
            request.senderPhone = senderPhone ? senderPhone : 0;
            request.pickingAddress = senderAddress;
            request.fromWardId = wardSenderId;
            request.fromProvinceId = citySenderId;
            request.fromDistrictId = districtSenderId;
            request.cusNote = '';
            request.weight = 0;
            request.totalBox = 0;
            request.fromHubId = hubSenderId;
            request.currentHubId = hubSenderId;
            request.ListShipmentId = listLaingIds;
            request.latFrom = latFrom;
            request.lngFrom = lngFrom;
            request.currentLat = latFrom;
            request.currentLng = lngFrom;
            request.location = senderAddress;
            $.when(sys.CallAjaxPostasync(apiCustomer + '/requestshipment/CreateRequest', request, token)).done(function (data) {
                if (data.isSuccess) {
                    $('.success').html('Gửi yêu cầu nhận hàng thành công! Mã yêu cầu vận đơn của bạn là: ' + data.data.shipmentNumber + ".").slideDown(1000).delay(7000).slideUp('slow');
                    ds.clear().draw();
                    listLadings = [];
                    listLaingIds = [];
                    sys.HideLoading()
                } else {
                    $('.error').html('Tạo yêu cầu nhận hàng thất bại!').slideDown(1000).delay(15000).slideUp('slow')
                    sys.HideLoading()
                }
            })
        }
    });
    var Lading = function () {
        var _this = this;
        _this.$el = null;
        _this.index = 0;
        _this.$template = $('.lading-template>.extend-container');
        _this.$plcholder = $('.lading-list');
        //
        _this.$CusNameFrom = null;
        _this.$CusPhoneFrom = null;
        _this.$CusAddressFrom = null;
        _this.$CusAddressFromSelect = null;
        //
        _this.$CusNameTo = null;
        _this.$PhoneTo = null;
        _this.$ShopCode = null;
        _this.$AddressTo = null;
        _this.$AddressNoteTo = null;
        _this.$CompanyTo = null;
        _this.CityId = 0;
        _this.CityName = "";
        _this.DistrictId = 0;
        _this.DistrictName = "";
        _this.WardId = 0;
        _this.WardName = "";
        _this.HubId = 0;
        _this.$Service = null;
        _this.$ServiceDVGT = null;
        _this.$BHHHDiv = null;//khai giá
        _this.$DGHHDiv = null;//đóng gói
        _this.$CODDiv = null;//COD
        _this.$Payment = null;
        _this.$PaymentCOD = null;
        _this.$Province = null;
        _this.$District = null;
        _this.$Ward = null;
        _this.$Weight = null;
        _this.$Height = null;
        _this.$Length = null;
        _this.$Width = null;
        _this.$Number = null;//Số kiện
        _this.$Mass = null;//Khối lượng quy đổi
        _this.Lat = 0;
        _this.Lng = 0;
        _this.$PriceMain = null;
        _this.$DVGTPrice = null;
        _this.$OtherPrice = null;
        _this.$VAT = null;
        _this.$PPXD = null;
        _this.$VSVX = null;
        _this.$Amount = null;
        _this.$Noted = null;
        _this.$Description = null;
        _this.$remove = null;
        _this.isRemove = false;
        _this.$pack_type = null;
        _this.$clickPrice = null;
        _this.$remove_all = null;
        _this.$CheckBoxVSVX = null;
        _this.$lblCheckbox = null;
        _this.$SenderCode = null;
        _this.$ReceiverCode = null;
        _this.$Structure = null;
        _this.$PaymentCodeType = null;
        _this.$LocationDiv = null;
        _this.$ShowLocation = null;

        _this.$TotalReceivables == null;

        Lading.prototype.init = function (index) {
            //
            _this.index = index;
            _this.$el = _this.$template.clone();
            _this.$el.find('.ladingnumber').html(_this.index);
            _this.$el.appendTo(_this.$plcholder);
            //
            _this.$SenderCode = _this.$el.find('.sender-code');
            _this.$SenderCode.chosen();
            //
            _this.$ReceiverCode = _this.$el.find('.receiver-code');
            _this.$ReceiverCode.chosen();
            //
            _this.$Structure = _this.$el.find('.structure');
            _this.$Structure.chosen();
            //
            _this.$PaymentCodeType = _this.$el.find('.payment-cod-type');
            _this.$PaymentCodeType.chosen();
            //
            _this.$LocationDiv = _this.$el.find('.div-location');
            _this.$ShowLocation = _this.$el.find('.check-show-location');
            //
            _this.$CusNameFrom = _this.$el.find('.sender-name');
            _this.$CusNameFrom.attr('id', 'namefrom_' + index);
            _this.$CusPhoneFrom = _this.$el.find('.sender-phone');
            _this.$CusPhoneFrom.attr('id', 'phonefrom_' + index);
            _this.$CusAddressFrom = _this.$el.find('.sender-address');
            _this.$CusAddressFrom.attr('id', 'addressfrom_' + index);

            _this.$CusAddressFromSelect = _this.$el.find('.sender-address-select');
            _this.$CusAddressFromSelect.chosen()
            //
            _this.$CusNameTo = _this.$el.find('.receiver-name');
            _this.$CusNameTo.attr('id', 'nameto_' + index);
            _this.$PhoneTo = _this.$el.find('.receiver-phone');
            _this.$PhoneTo.attr('id', 'phoneto_' + index);
            _this.$ShopCode = _this.$el.find('.shop-code');
            _this.$ShopCode.attr('id', 'shopcode_' + index);
            _this.$AddressTo = _this.$el.find('.receiver-address');
            _this.$AddressNoteTo = _this.$el.find('.receiver-address-note');
            _this.$AddressTo.attr("id", "autocomplete_" + index);

            _this.$Noted = _this.$el.find('.noted');
            _this.$Noted.attr("id", "noted_" + index);

            _this.$TotalReceivables = _this.$el.find('.total-receivables');
            _this.$TotalReceivables.attr("id", "totalReceivables_" + index);


            _this.$CompanyTo = _this.$el.find('.receiver-company');

            _this.$Service = _this.$el.find('.service');
            _this.$Service.chosen();
            _this.$ServiceDVGT = _this.$el.find('.servicedvgt');
            _this.$ServiceDVGT.multiselect({
                numberDisplayed: 1,
                includeSelectAllOption: false,
                enableCaseInsensitiveFiltering: false,
                maxHeight: 200,
                nonSelectedText: 'Chọn dịch vụ gia tăng',
                allSelectedText: 'Chọn tất cả',
                nSelectedText: ' DVGT được chọn!',
                selectAllText: "Chọn tất cả"
            });
            _this.$BHHHDiv = _this.$el.find('.insured-div');
            sys.formatNumber($(_this.$BHHHDiv).find('.insured'));
            sys.formatNumber($(_this.$BHHHDiv).find('.insured-price'));
            _this.$DGHHDiv = _this.$el.find('.pack-div');
            sys.formatNumber($(_this.$DGHHDiv).find('input'));
            _this.$CODDiv = _this.$el.find('.cod-div');
            sys.formatNumber($(_this.$CODDiv).find('.cod'));
            sys.formatNumber($(_this.$CODDiv).find('.cod-price'));
            _this.$Noted = _this.$el.find('.noted');
            _this.$Description = _this.$el.find('.description');
            //
            _this.$Payment = _this.$el.find('.payment');
            _this.$Payment.chosen();
            //
            _this.$PaymentCOD = _this.$el.find('.payment-cod-type');
            _this.$PaymentCOD.chosen();

            _this.$CheckBoxVSVX = _this.$el.find('.checkbox-vsvx');
            _this.$CheckBoxVSVX.attr("id", "checkbox_" + index);
            _this.$lblCheckbox = _this.$el.find('.lbl-checkbox');
            _this.$lblCheckbox.attr("id", "lblcheckbox_" + index);

            _this.$Province = _this.$el.find('.province');
            _this.$Province.chosen();

            _this.$District = _this.$el.find('.district');
            _this.$District.chosen();

            _this.$Ward = _this.$el.find('.ward');
            _this.$Ward.chosen();

            _this.$pack_type = _this.$el.find('.pack-type');
            _this.$pack_type.chosen();
            _this.$Weight = _this.$el.find('.weight');
            _this.$Weight.attr('id', 'weight_' + index);
            _this.$Width = _this.$el.find('.width');
            _this.$Height = _this.$el.find('.height');
            _this.$Length = _this.$el.find('.length');
            _this.$Number = _this.$el.find('.number');
            _this.$Mass = _this.$el.find('.mass');
            _this.$DVGTPrice = _this.$el.find('.dvgt-price');
            sys.formatNumber(_this.$DVGTPrice);
            _this.$PriceMain = _this.$el.find('.price-main');
            sys.formatNumber(_this.$PriceMain);
            _this.$OtherPrice = _this.$el.find('.other-price');
            _this.$VAT = _this.$el.find('.vat');
            _this.$PPXD = _this.$el.find('.ppxd-price');
            sys.formatNumber($(_this.$PPXD));
            _this.$VSVX = _this.$el.find('.price-far');
            sys.formatNumber(_this.$VSVX);
            _this.$Amount = _this.$el.find('.amount');
            sys.formatNumber(_this.$Amount);

            _this.$remove = _this.$el.find(".remove-lading");
            _this.$clickPrice = _this.$el.find('.detail-price');
            _this.$remove_all = _this.$el.find('.remove-all');
            bindEvents();
            initMap(_this);
            ValidationSelectChosen(_this);
            _LoadStructure(_this);
            //select onchange
            _selectProvinceChange(_this);
            _selectDistrictChange(_this);
            _selectWardChange(_this);
            //
            $(_this.$ShowLocation).on("change", function (e) {
                if (_this.$ShowLocation[0].checked) {
                    _this.$LocationDiv.show();
                } else {
                    _this.$LocationDiv.hide();
                }
            })
        }

        var checkHidePrice = function () {
            if (_this.$el.find('.hide-price').hasClass('display-none')) {
                _this.$el.find('.hide-price').removeClass('display-none');
            } else {
                _this.$el.find('.hide-price').addClass('display-none');
            }
        }
        var removeMe = function () {
            $(document).trigger('remove_item', [_this.index]);
            _this.$el.remove();
            window.count--;
            _this.isRemove = true;
            ladings.pop(_this);
            $('.add-more').html("Thêm đơn số (" + (window.count + 1) + ")");
            //$('.add-lading').html("Tạo (" + window.count + ") đơn hàng");
            $('.add-lading').html("Lưu đơn hàng và yêu cầu lấy hàng");
            $('.add-lading-create').html("Tạo (" + window.count + ") đơn hàng và yêu cầu lấy hàng");
        }
        var removeAll = function () {
            _this.$ServiceDVGT.find('option').each(function () {
                if ($(this).prop("selected")) {
                    $(this).prop("selected", false);
                }
            });
            _this.$ServiceDVGT.multiselect("refresh");
            _this.$ServiceDVGT.trigger('change');
        }
        var updateIndex = function () {
            _this.index--;
            _this.$el.find('.ladingnumber').html(_this.index);
        }
        var removeListener = function (event, param) {
            if (_this.index > param) {
                updateIndex();
            }

        };
        var serviceGTChange = function () {
            _this.$ServiceDVGT.find("option").each(function () {
                switch ($(this).attr('data')) {
                    //case "COD":
                    //    if ($(this).is(":selected")) {
                    //        _this.$CODDiv.show();
                    //    } else {
                    //        _this.$CODDiv.hide()
                    //    }
                    //    break;
                    case "DG":
                        if ($(this).is(":selected")) {
                            _this.$DGHHDiv.show();
                        } else {
                            _this.$DGHHDiv.hide()
                        }
                        break;
                    //case "BHHH":
                    //    if ($(this).is(":selected")) {
                    //        _this.$BHHHDiv.show();
                    //    } else {
                    //        _this.$BHHHDiv.hide()
                    //    }
                    //    break;
                }
            });
        }

        var calculator = function () {
            if (_this.DistrictId && _this.CityId && citySenderId && districtSenderId && _this.$Weight.val()) {
                var $lading = $.grep(ladings, function (e) { return e.index == _this.index });
                //var lading = GetLadingModel($lading[0]);
                var lading = GetCalculatorModel($lading[0]);
                var token = $.cookie('token');
                $.when(sys.CallAjaxPostasync(apiCustomer + "/price/Calculate", lading, token)).done(function (data) {
                    if (data.isSuccess) {
                        var result = data.data;
                        _this.$PriceMain.val(formatMoney(result.defaultPrice, 0));
                        _this.$OtherPrice.val(result.otherPrice);
                        _this.$PPXD.val(formatMoney(result.fuelPrice, 0));
                        _this.$VSVX.val(formatMoney(result.remoteAreasPrice, 0));
                        _this.$VAT.val(result.vatPrice);
                        _this.$DVGTPrice.val(formatMoney(result.totalDVGT, 0));
                        _this.$Amount.val(formatMoney(result.totalPrice, 0));
                        if (result.priceDVGTs.length == 0) {
                            _this.$CODDiv.find(".cod-price").val(0);
                            _this.$BHHHDiv.find(".insured-price").val(0);
                        }
                        result.priceDVGTs.forEach(function (item, x) {
                            if (item.code == "COD") {
                                _this.$CODDiv.find(".cod-price").val(formatMoney(item.totalPrice, 0));
                            }
                            if (item.code == "BHHH") {
                                _this.$BHHHDiv.find(".insured-price").val(formatMoney(item.totalPrice, 0));
                            }
                        });

                        //_this.$DGHHDiv.find(".pack-price").val(formatMoney(result.PackPrice, 0));
                        if (_this.$VSVX.val() != 0) {
                            _this.$lblCheckbox.css("display", "block");
                            _LoadPayment(_this);
                        }
                        else {
                            _this.$lblCheckbox.css("display", "none");
                            //_this.$CheckBoxVSVX[0].checked = false;
                            _LoadPayment(_this);
                        }
                        calculatorReceivables();
                    }
                });
            }
        }
        var calculatorReceivables = function () {
            if (_this.$Payment.val() == 1 && _this.$PaymentCOD.val() == 2) {
                var totalReceivables = Number(Number(_this.$CODDiv.find(".cod-price").val()) + Number(_this.$Amount.val()) + Number(_this.$CODDiv.find(".cod").val()));
                console.log(totalReceivables);
                _this.$TotalReceivables.val(totalReceivables);
            }
            else {
                _this.$TotalReceivables.val(0);
            }
        }

        var bindEvents = function () {
            _LoadPayment(_this);
            //_LoadPaymentCOD(_this);
            _this.$clickPrice.on('click', checkHidePrice);
            _this.$remove.on('click', removeMe);
            //_this.$ServiceDVGT.on('change', serviceGTChange);
            // _this.$Province.on('change', provinceChange);
            // _this.$District.on('change', districtChange);
            _this.$AddressTo.on('change', function () {
                addressChange(_this)
            });
            _this.$CusAddressFrom.on('change', function () {
                initMapFrom(_this)
            });
            $(document).on('remove_item', removeListener);
            _this.$remove_all.on('click', removeAll);
            _this.$Weight.on("change", function () {
                _LoadService(_this);
            });
            _this.$CusAddressFrom.add(_this.$AddressTo).add(_this.$BHHHDiv.find(".insured")).add(_this.$DGHHDiv.find(".pack-type"))
                .add(_this.$CODDiv.find(".cod")).add(_this.$Weight).add(_this.$Height).add(_this.$Width)
                .add(_this.$Length).add(_this.$Number).add(_this.$Service).add(_this.$ServiceDVGT).add($(_this.$Ward)).on("change", calculator);

            _inputCODChange(_this);
            _inputBHHHChange(_this);

            //_this.$ShopCode.change(function () {
            //    _LoadPayment(_this);
            //});

            //_this.$CheckBoxVSVX.change(function () {
            //    _LoadPayment(_this);
            //})
            _this.$Payment.change(function () {
                console.log(_this.$Payment.val());
                if (_this.$Payment.val() == 1 || _this.$Payment.val() == 4) {
                    _this.$PaymentCOD.chosen().val(2);
                }
                else if (_this.$Payment.val() == 2 || _this.$Payment.val() == 3) {
                    _this.$PaymentCOD.chosen().val(1);
                }
                _this.$PaymentCOD.trigger("chosen:updated");
            })
            //$("#add-box").click(function () {
            //    var data = param();
            //    databoxs.push(data);
            //    dtBoxModal.ajax.reload()
            //});

            _this.$Payment.add(_this.$PaymentCOD).add(_this.$CODDiv.find(".cod-price")).on("change", calculatorReceivables);
        }

        function ValidationSelectChosen(_this) {
            $('#ladingFrom')
                .find(_this.$Province)
                .chosen({
                    width: '100%',
                    inherit_select_classes: true
                })
                .on("change", function (e) {
                    // $('#ladingFrom').formValidation('revalidateField', 'province');
                })
                .end()
                .find(_this.$District)
                .chosen({
                    width: '100%',
                    inherit_select_classes: true
                })
                .on("change", function (e) {
                    // $('#ladingFrom').formValidation('revalidateField', 'district');
                })
                .end()
                .find(_this.$Ward)
                .chosen({
                    width: '100%',
                    inherit_select_classes: true
                })
                .on("change", function (e) {
                    // $('#ladingFrom').formValidation('revalidateField', 'ward');
                })
                .end()
                .formValidation({
                    framework: 'bootstrap',
                    excluded: ':disabled',
                    fields: {
                        // province: {
                        //     validators: {
                        //         callback: {
                        //             message: 'Tỉnh thành không được để trống!',
                        //             callback: function (value, validator, $field) {
                        //                 _this.$Province.chosen().trigger("chosen:updated");
                        //                 // Get the selected options
                        //                 var options = _this.$Province.val();
                        //                 provinceSP = options;
                        //                 return (options >= 1);
                        //             }
                        //         }
                        //     }
                        // },

                        // district: {
                        //     validators: {
                        //         callback: {
                        //             message: 'Quận huyện không được để trống!',
                        //             callback: function (value, validator, $field) {
                        //                 _this.$District.chosen().trigger("chosen:updated");
                        //                 // Get the selected options
                        //                 var options = _this.$District.val();
                        //                 districtSP = options;
                        //                 return (options >= 1);
                        //             }
                        //         }
                        //     }
                        // },

                        // ward: {
                        //     validators: {
                        //         callback: {
                        //             message: 'Phường xã đang trống!',
                        //             callback: function (value, validator, $field) {
                        //                 _this.$Ward.chosen().trigger("chosen:updated");
                        //                 // Get the selected options
                        //                 var options = _this.$Ward.val();
                        //                 wardSP = options;
                        //                 return (options >= 1);
                        //             }
                        //         }
                        //     }
                        // },
                    }
                });
        }

        function LoadSenderTo(addressFormat, _this, place) {
            var componentForm = {
                street_number: 'short_name',
                route: 'short_name',//đường
                locality: 'short_name',
                sublocality_level_1: 'short_name',//phường xã
                administrative_area_level_3: 'short_name',//phường xã
                administrative_area_level_2: 'short_name',//Quận huyện
                administrative_area_level_1: 'short_name',//Tỉnh thành
                country: 'short_name',//Quốc gia
                postal_code: 'short_name'
            };
            //
            if (addressFormat) {
                $.ajax({
                    url: 'https://maps.googleapis.com/maps/api/geocode/json',
                    data: {
                        sensor: false,
                        address: addressFormat,
                        key: KeyGoogle
                    },
                    async: true,
                    dataType: 'json',
                    success: function (data, textStatus) {
                        var lat = 0, lng = 0, district_name = '', state_name = '', ward_name = '';
                        var address = place ? place : data.results[0];
                        if (!data.results[0] || !data.results[0].geometry) {

                            return;
                        }
                        var locationTo = data.results[0].geometry.location;
                        _this.Lat = locationTo.lat;
                        _this.Lng = locationTo.lng;

                        const results = data.results.sort((x, y) => y.address_components.length - x.address_components.length);
                        const dataAddress = results[0];
                        let findTypeWard = dataAddress.address_components.filter(x => x.types.find(y => y == "sublocality_level_1"))[0];
                        if (!findTypeWard) {
                            for (const item in results) {
                                if (results.hasOwnProperty(item)) {
                                    const element = results[item];
                                    let typeWard = element.address_components.filter(x => x.types.find(y => y == "sublocality_level_1"))[0];
                                    if (typeWard) {
                                        dataAddress.address_components.push(typeWard);
                                        break;
                                    }
                                }
                            }
                        }
                        var addr = dataAddress.address_components;
                        for (var i = 0; i < addr.length; i++) {
                            for (j = 0; j < addr[i].types.length; j++) {
                                var addressType = addr[i].types;
                                if (addressType[j] == 'administrative_area_level_1') {
                                    state_name = addr[i][componentForm[addressType[j]]];
                                }
                                if (addressType[j] == 'administrative_area_level_2' || addressType[j] == 'locality') {
                                    district_name = addr[i][componentForm[addressType[j]]];
                                }
                                if (addressType[j] == "sublocality_level_1" || addressType[j] == "administrative_area_level_3") {
                                    ward_name = addr[i][componentForm[addressType[j]]];
                                }
                            }
                        }

                        if (ward_name == "" || district_name == "") {
                            _this.$LocationDiv.show();
                            _this.$ShowLocation[0].checked = true;
                        }
                        var district_id = 0, state_id = 0; ward_id = 0; hub_id = 0;
                        var provinceId = "null"; districtId = "null"; wardId = "null"; countryId = "null";
                        var token = $.cookie('token');
                        $.when(sys.CallAjaxasync(apiCore + '/hub/GetInfoLocation', { provinceName: state_name, districtName: district_name, wardName: ward_name, provinceId: provinceId, districtId: districtId, wardId: wardId, countryId: countryId }, token)).done(function (dataInfoLocation) {
                            if (dataInfoLocation.isSuccess && dataInfoLocation.data != null) {
                                var infoLocation = dataInfoLocation.data;
                                hub_id = infoLocation.hubId;
                                state_id = infoLocation.provinceId;
                                district_id = infoLocation.districtId;
                                ward_id = infoLocation.wardId;

                                _this.CityId = state_id;
                                _this.$Province.val(state_id).trigger("chosen:updated").trigger("change");
                                ValidationSelectChosen(_this)
                                _this.DistrictId = district_id;
                                _this.$District.val(district_id).trigger("chosen:updated").trigger("change");

                                _this.WardId = ward_id;
                                _this.$Ward.val(ward_id).trigger("chosen:updated").trigger("change");

                                _this.HubId = hub_id;

                                if (_this.WardId == "0") {
                                    _LoadService(_this);
                                }
                            }
                        });
                    }
                });
            }
        }
    }
    ////============Event OnChange====================
    //AddressChange
    function addressChange(_this) {
        initMap(_this);
    }
    var initMap = function (_this) {
        var options = {
            componentRestrictions: { 'country': ['vi', 'vn'] }
        };
        var input = document.getElementById(_this.$AddressTo.attr("id"));

        var autocomplete = new google.maps.places.Autocomplete(input, options);
        autocomplete.addListener('place_changed', function () {
            // var place = autocomplete.getPlace();
            let place = autocomplete.getPlace();
            if (!place.geometry) {
                //$(".error").html("Không tìm thấy địa chỉ cho: '" + place.name + "'").slideDown(1000).delay(5000).slideUp('slow');
                //window.alert("Không tìm thấy thông tin địa chỉ: '" + place.name + "'");
                // _this.$Province.val("").trigger("chosen:updated").trigger("change");
                return;
            } else {
                var componentForm = {
                    street_number: 'short_name',
                    route: 'short_name',//đường
                    locality: 'short_name',
                    sublocality_level_1: 'short_name',//phường xã
                    administrative_area_level_3: 'short_name',//phường xã
                    administrative_area_level_2: 'short_name',//Quận huyện
                    administrative_area_level_1: 'short_name',//Tỉnh thành
                    country: 'short_name',//Quốc gia
                    postal_code: 'short_name'
                };
                //
                $.ajax({
                    url: 'https://maps.googleapis.com/maps/api/geocode/json',
                    data: {
                        sensor: false,
                        latlng: place.geometry.location.lat() + "," + place.geometry.location.lng(),
                        // address: place.formatted_address,
                        key: KeyGoogle
                    },
                    async: true,
                    dataType: 'json',
                    success: function (data, textStatus) {
                        var address = data.results[0];
                        if (!data.results[0] || !data.results[0].geometry) {
                            //window.alert("Không tìm thấy thông tin địa chỉ: '" + place.formatted_address + "'");
                            return;
                        }
                        var locationTo = data.results[0].geometry.location;
                        LoadSenderTo(address.formatted_address, _this, place);
                    }
                });
            };
        });
    }
    //Location onChange
    var provinceChange = function (_this) {
        var html = "<option value=''>Chọn quận huyện</option>";
        var token = $.cookie('token');
        $.when(sys.CallAjaxasync(apiCustomer + '/district/GetDistrictByProvince?provinceId=' + _this.$Province.val(),
            null,
            token
        )).done(function (data) {
            if (data.isSuccess) {
                const results = data.data.sort((x, y) => sys.BoDauTiengViet(y.name) > sys.BoDauTiengViet(x.name) ? -1 : 1);
                $.each(results, function (key, value) {
                    html += "<option value='" + value.id + "'>" + value.code + " - " + value.name + "</option>";
                });
            }
            _this.$District.html(html);
            _this.$District.chosen().trigger("chosen:updated");

            _this.$Ward.html("<option value=''>Chọn phường xã</option>");
            _this.$Ward.chosen().trigger("chosen:updated");
        });
    }
    var districtChange = function (_this) {
        var html = "<option value=''>Chọn phường xã</option>";
        var token = $.cookie('token');
        $.when(sys.CallAjaxasync(apiCustomer + '/ward/GetWardByDIstrict?districtId=' + _this.$District.val(),
            null,
            token
        )).done(function (data) {
            if (data.isSuccess) {
                const results = data.data.sort((x, y) => sys.BoDauTiengViet(y.name) > sys.BoDauTiengViet(x.name) ? -1 : 1);
                $.each(results, function (key, value) {
                    html += "<option value='" + value.id + "'>" + value.code + " - " + value.name + "</option>";
                });
            }
            _this.$Ward.html(html);
            _this.$Ward.chosen().trigger("chosen:updated");
        });
    }
    //Location select onchange
    var _selectProvinceChange = function (_this) {
        $(_this.$Province).on('change', function (e) {
            var num = e.delegateTarget.length;
            var a = _this.$Province.val();
            for (var i = 1; i < num; i++) {
                var b = e.delegateTarget[i].value
                if (a == e.delegateTarget[i].value) {
                    var id = e.delegateTarget[i].value;
                    var name = e.delegateTarget[i].text;
                    _this.CityId = id;
                    _this.CityName = name;
                    provinceChange();
                }
            }
        });
    }
    var _selectDistrictChange = function (_this) {
        $(_this.$District).on('change', function (e) {
            var a = _this.$District.val();
            var num = e.delegateTarget.length;
            for (var i = 1; i < num; i++) {
                if (a == e.delegateTarget[i].value) {
                    var id = e.delegateTarget[i].value;
                    var name = e.delegateTarget[i].text;
                    _this.DistrictId = id;
                    _this.DistrictName = name;
                    districtChange();
                    _LoadService(_this);
                }
            }
        });
    }
    var _selectWardChange = function (_this) {
        $(_this.$Ward).on('change', function (e) {
            var num = e.delegateTarget.length;
            var a = _this.$Ward.val();
            for (var i = 0; i < num; i++) {
                if (a == e.delegateTarget[i].value) {
                    var id = e.delegateTarget[i].value;
                    var name = e.delegateTarget[i].text;
                    _this.WardId = id;
                    _this.WardName = name;
                    //getWard(name, _this.DistrictId, _this);
                    getHub(id, _this);
                    _LoadService(_this);

                }
            }
            // ladings.push(_this.HubId);
            // ladings.push(_this.WardId);
        });
    }
    //COD input onchange
    var _inputCODChange = function (_this) {
        _this.$CODDiv.find(".cod").change(function () {
            var selected = [];
            _this.$ServiceDVGT.each(function () {
                selected.push([$(this).val(), $(this).data('order')]);
            });
            if (_this.$CODDiv.find(".cod").val() == "" && _this.$ServiceDVGT.multiselect() || _this.$CODDiv.find(".cod").val() == 0) {
                _this.$ServiceDVGT.multiselect("deselect", [3]);
                _this.$ServiceDVGT.trigger('change');
            } else {
                _this.$ServiceDVGT.multiselect("select", [3]);
                _this.$ServiceDVGT.trigger('change');
            }
        })
    }
    //BHHH input onchange
    var _inputBHHHChange = function (_this) {
        _this.$BHHHDiv.find(".insured").change(function () {
            var selected = [];
            //_this.$ServiceDVGT.each(function () {
            //    selected.push([$(this).val(), $(this).data('order')]);
            //});
            if (Number(_this.$BHHHDiv.find(".insured").val().replace(/\./g, '')) > 3000000) {
                _this.$ServiceDVGT.multiselect("select", [4]);
                _this.$ServiceDVGT.trigger('change');
            } else {
                _this.$ServiceDVGT.multiselect("deselect", [4]);
                _this.$ServiceDVGT.trigger('change');
            }
        })
    }
    //
    $('#add-more').on("click", function () {
        window.count++;
        var lading = new Lading();
        lading.init(window.count);
        ladings.push(lading);
        $('.add-more').html("Thêm đơn số (" + (window.count + 1) + ")");
        //$('.add-lading').html("Tạo (" + window.count + ") đơn hàng");
        $('.add-lading').html("Lưu đơn hàng và yêu cầu lấy hàng");
        $('.add-lading-create').html("Tạo (" + window.count + ") đơn hàng và yêu cầu lấy hàng");
    });
    $('#add-more').trigger('click');
    function _LoadService(_this) {
        var lading = GetLadingPriceModel(_this);
        var html = "";
        var token = $.cookie('token');
        sys.Loading();
        $.when(sys.CallAjaxPostasync(apiCustomer + '/price/GetListService', lading, token)).done(function (data) {
            if (data.isSuccess) {
                $.each(data.data, function (key, value) {
                    html += "<option value='" + value.id + "' data-price='" + value.price + "' data-name='" + value.name + "'>" + value.name + " - " + formatMoney(value.price, 0) + "</option>";
                });
                _this.$Service.html(html);
                _this.$Service.chosen();
                _this.$Service.trigger("chosen:updated");
                sys.HideLoading();
            }
        });
    }
    function _LoadStructure(_this) {
        var html = "";
        var token = $.cookie('token');
        sys.Loading();
        $.when(sys.CallAjaxasync(apiCustomer + '/Structure/GetAll', null, token)).done(function (data) {
            if (data.isSuccess) {
                $.each(data.data, function (key, value) {
                    html += "<option value='" + value.id + "' data-name='" + value.name + "'>" + value.name + "</option>";
                });
                _this.$Structure.html(html);
                _this.$Structure.chosen();
                _this.$Structure.trigger("chosen:updated");
                sys.HideLoading();
            }
        });
    }
    function _LoadServiceGT() {
        var html = "";
        var token = $.cookie('token');
        $.when(sys.CallAjaxasync(apiCustomer + '/serviceDVGT/getAll', null, token)).done(function (data) {
            if (data.isSuccess) {
                html += "";
                $.each(data.data, function (key, value) {
                    html += "<option data='" + value.code + "' value='" + value.id + "'>" + value.name + "</option>";
                });
                $("select.servicedvgt").html(html);
            }
        });
    }
    function _LoadPaymentCOD(_this) {
        var html = "";
        var token = $.cookie('token');
        $.when(sys.CallAjaxasync(apiPost + '/PaymentCODType/GetAll', null, token)).done(function (data) {
            if (data.isSuccess) {
                html += "";
                $.each(data.data, function (key, value) {
                    html += "<option data='" + value.code + "' value='" + value.id + "'>" + value.name + "</option>";
                });
                console.log(html)
                _this.$PaymentCOD.html(html);
                if (_this.$Payment.val() == 1 || _this.$Payment.val() == 4) {
                    _this.$PaymentCOD.chosen().val(2);
                }
                else if (_this.$Payment.val() == 2 || _this.$Payment.val() == 3) {
                    _this.$PaymentCOD.chosen().val(1);
                }
                _this.$PaymentCOD.trigger("chosen:updated");
            }
        });
    }
    function _LoadPayment(_this) {
        var html = "";
        var token = $.cookie('token');
        $.when(sys.CallAjaxasync(apiCustomer + '/paymentType/GetAll',
            null,
            token
        )).done(function (data) {
            if (data.isSuccess) {
                //data.data.sort(function (a, b) {
                //    return a.name > b.name;
                //});
                //$.each(data.data, function (key, value) {
                //    if (_this.$ShopCode.val() != "") {
                //        html += "<option value='" + value.id + "'>" + value.name + "</option>";
                //    }
                //    else {
                //        if (_this.$VSVX.val() != "0" && _this.$VSVX.val() != "") {
                //            if (_this.$CheckBoxVSVX[0].checked) {
                //                if (value.id == 1 || value.id == 3) {
                //                    html += "<option value='" + value.id + "'>" + value.name + "</option>";
                //                }
                //            }
                //            else {
                //                if (value.id == 3) {
                //                    html += "<option value='" + value.id + "'>" + value.name + "</option>";
                //                }
                //            }
                //        }
                //        else {
                //            if (value.id == 1 || value.id == 3) {
                //                html += "<option value='" + value.id + "'>" + value.name + "</option>";
                //            }
                //        }
                //    }
                //});
                $.each(data.data, function (key, value) {
                    if (value.id != 4) {
                        html += "<option data='" + value.code + "' value='" + value.id + "'>" + value.name + "</option>";
                    }
                });
                _this.$Payment.html(html);
                _this.$Payment.chosen();
                _this.$Payment.trigger("chosen:updated");
            }
        });
    }

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
                    html += "<option value='" + value.id + "'>" + value.code + " - " + value.name + "</option>";
                });
                $("select.province").html(html);
            }
        });
    }

    function _LoadTypePack() {
        var html = "";
        var token = $.cookie('token');
        $.when(sys.CallAjaxasync(apiCustomer + '/packType/getAll', null, token)).done(function (data) {
            if (data.isSuccess) {
                $.each(data.data, function (key, value) {
                    html += "<option value='" + value.id + "'>" + value.name + "</option>";
                });
                $("select.pack-type").html(html);
            }
        });
    }
    function initMapFrom(_this) {
        var options = {
            componentRestrictions: { 'country': ['vi', 'vn'] }
        };
        var input = document.getElementById(_this.$CusAddressFrom.attr("id"));
        var autocomplete = new google.maps.places.Autocomplete(input, options);
        autocomplete.addListener('place_changed', function () {
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                //window.alert("Không tìm thấy thông tin địa chỉ: '" + place.name + "'");
                return;
            } else {
                LoadSenderForm(place.formatted_address, place);
            }
        });
    }
    function LoadSenderForm(addressFrom, place) {
        var componentForm = {
            street_number: 'short_name',
            route: 'short_name',//đường
            locality: 'short_name',
            sublocality_level_1: 'short_name',//phường xã
            administrative_area_level_3: 'short_name',//phường xã
            administrative_area_level_2: 'short_name',//Quận huyện
            administrative_area_level_1: 'short_name',//Tỉnh thành
            country: 'short_name',//Quốc gia
            postal_code: 'short_name'
        };
        //
        if (addressFrom) {
            $.ajax({
                url: 'https://maps.googleapis.com/maps/api/geocode/json',
                data: {
                    sensor: false,
                    latlng: place.geometry.location.lat() + "," + place.geometry.location.lng(),
                    // address: place.formatted_address,
                    key: KeyGoogle
                },
                async: true,
                dataType: 'json',
                success: function (data, textStatus) {
                    var address = data.results[0];
                    if (!data.results[0] || !data.results[0].geometry) {
                        window.alert("Không tìm thấy thông tin địa chỉ: '" + addressFrom + "'");
                        return;
                    }
                    var locationTo = data.results[0].geometry.location;
                    latFrom = locationTo.lat;
                    lngFrom = locationTo.lng;
                    var lat = 0, lng = 0, district_name = '', state_name = '', ward_name = '';
                    var address = place ? place : data.results[0];
                    if (!data.results[0] || !data.results[0].geometry) {

                        return;
                    }
                    var locationTo = data.results[0].geometry.location;
                    //_this.Lat = locationTo.lat;
                    //_this.Lng = locationTo.lng;

                    const results = data.results.sort((x, y) => y.address_components.length - x.address_components.length);
                    const dataAddress = results[0];
                    let findTypeWard = dataAddress.address_components.filter(x => x.types.find(y => y == "sublocality_level_1"))[0];
                    if (!findTypeWard) {
                        for (const item in results) {
                            if (results.hasOwnProperty(item)) {
                                const element = results[item];
                                let typeWard = element.address_components.filter(x => x.types.find(y => y == "sublocality_level_1"))[0];
                                if (typeWard) {
                                    dataAddress.address_components.push(typeWard);
                                    break;
                                }
                            }
                        }
                    }
                    var addr = dataAddress.address_components;
                    for (var i = 0; i < addr.length; i++) {
                        for (j = 0; j < addr[i].types.length; j++) {
                            var addressType = addr[i].types;
                            if (addressType[j] == 'administrative_area_level_1') {
                                state_name = addr[i][componentForm[addressType[j]]];
                            }
                            if (addressType[j] == 'administrative_area_level_2' || addressType[j] == 'locality') {
                                district_name = addr[i][componentForm[addressType[j]]];
                            }
                            if (addressType[j] == "sublocality_level_1" || addressType[j] == "administrative_area_level_3") {
                                ward_name = addr[i][componentForm[addressType[j]]];
                            }
                        }
                    }
                    var district_id = 0, state_id = 0; ward_id = 0; hub_id = 0;
                    var provinceId = "null"; districtId = "null"; wardId = "null"; countryId = "null";
                    var token = $.cookie('token');
                    $.when(sys.CallAjaxasync(apiCore + '/hub/GetInfoLocation', { provinceName: state_name, districtName: district_name, wardName: ward_name, provinceId: provinceId, districtId: districtId, wardId: wardId, countryId: countryId }, token)).done(function (dataInfoLocation) {
                        if (dataInfoLocation.isSuccess && dataInfoLocation.data != null) {
                            var infoLocation = dataInfoLocation.data;
                            hub_id = infoLocation.hubId;
                            state_id = infoLocation.provinceId;
                            district_id = infoLocation.districtId;
                            ward_id = infoLocation.wardId;

                            hubSenderId = hub_id;
                            citySenderId = state_id;
                            districtSenderId = district_id;
                            wardSenderId = ward_id;
                        }
                    });
                }
            });
        }
    }
    function GetLadingModels() {
        var ladingModels = [];
        $.each(ladings, function (index, value) {
            if (index >= 0) {
                var lading = GetLadingModel(value);
                ladingModels.push(lading);
                listLadings.push(lading);
            }
        });
        return ladingModels;
    }
    function GetLadingPriceModel(value) {
        var lading = new Object();
        //
        lading.SenderId = $.cookie('userId');
        lading.FromDistrictId = districtSenderId;
        lading.ToDistrictId = value.DistrictId;
        lading.FromWardId = wardSenderId;

        if (value.$Weight.val() != null && value.$Weight.val() != '' && value.$Weight.val() != 0) {
            lading.Weight = value.$Weight.val();
        }
        //price
        return lading;
    }
    function GetCalculatorModel(value) {
        var shipment = new Object();
        shipment.SenderId = $.cookie('userId');
        shipment.FromProvinceId = citySenderId;
        shipment.FromDistrictId = districtSenderId;
        shipment.ServiceId = value.$Service.find("option:selected").val();;
        shipment.ToDistrictId = value.DistrictId;
        shipment.Weight = value.$Weight.val();
        shipment.StructureId = value.$Structure.find("option:selected").val();
        shipment.TotalItem = value.$Number.val();
        shipment.serviceDVGTIds = shipment.serviceDVGTIds ? shipment.serviceDVGTIds : [];
        value.$ServiceDVGT.find("option:selected").each(function () {
            switch ($(this).attr('data')) {
                case "COD":
                    shipment.COD = value.$CODDiv.find(".cod").val().replace(/\./g, '');
                    break;
                case "BHHH":
                    shipment.Insured = value.$BHHHDiv.find(".insured").val().replace(/\./g, '');
                    //shipment.InsuredPrice = value.$BHHHDiv.find(".insured-price").val().replace(/\./g, '');
                    break;
            }
            shipment.serviceDVGTIds.push($(this).val());
        });
        //shipment.PriceServiceId = $.cookie('userId');
        return shipment;
    }
    function GetLadingModel(value) {
        var lading = new Object();
        lading.orderDate = sys.formatDateTimeSQL(new Date());
        lading.fakeShipmentId =
            lading.SenderId = $.cookie('userId');
        lading.FromDistrictId = districtSenderId
        lading.pickingAddress = lading.AddressFrom = value.$CusAddressFrom.val();
        lading.senderName = lading.NameFrom = $(".sender-name").val();
        lading.senderPhone = lading.PhoneFrom = $(".sender-phone").val();
        lading.companyFrom = lading.CompanyFrom = $(".sender-company").val();
        lading.fromProvinceId = citySenderId;
        if (wardSenderId != null) {
            lading.fromWardId = wardSenderId;
        } else {
            lading.fromWardId = 0;
        }
        lading.fromHubId = hubSenderId;
        lading.currentHubId = hubSenderId;
        lading.LatFrom = latFrom;
        lading.LngFrom = lngFrom;

        if (value.$AddressTo.val() != "" && value.$AddressTo.val() != undefined) {
            lading.shippingAddress = value.$AddressTo.val();
        } else {
            lading.shippingAddress = "Phường " + value.WardName + ", Quận " + value.DistrictName + ", " + value.CityName;
        }
        lading.receiverName = value.$CusNameTo.val();
        lading.receiverPhone = value.$PhoneTo.val();
        lading.shopCode = value.$ShopCode.val();
        lading.companyTo = value.$CompanyTo.val();
        lading.toProvinceId = value.CityId;
        lading.toDistrictId = value.DistrictId;
        if (value.WardId == "0") {
            lading.toWardId = null;
        } else {
            lading.toWardId = value.WardId;
        }

        lading.toHubId = value.HubId;

        lading.addressNoteTo = value.$AddressNoteTo.val();
        lading.LatTo = value.Lat;
        lading.LngTo = value.Lng;
        lading.Width = 0;
        lading.Height = 0;
        lading.Length = 0;
        lading.CusNote = value.$Noted.val();
        lading.note = value.$Noted.val();
        lading.Content = value.$Description.val();
        lading.PaymentTypeId = value.$Payment.find("option:selected").val();
        lading.StructureId = value.$Structure.find("option:selected").val();
        lading.priceDVGTs = [];
        lading.PriceListDVGT = [];
        lading.serviceDVGTIds = [];
        value.$ServiceDVGT.find("option:selected").each(function () {
            switch ($(this).attr('data')) {
                case "COD":
                    // var token = $.cookie('token');
                    // $.when(sys.CallAjaxasync(apiCustomer + '/serviceDVGT/getAll', null, token)).done(function (data) {
                    //     if (data.isSuccess) {
                    //         $.each(data.data, function (key, value) {
                    //             if (value.code == "COD") {
                    //                 data= value;
                    //             }
                    //         });
                    //     }
                    // });
                    lading.COD = value.$CODDiv.find(".cod").val().replace(/\./g, '');
                    break;
                case "DG":
                    lading.PackId = value.$DGHHDiv.find(".pack-type option:selected").val();
                    lading.PackPrice = value.$DGHHDiv.find(".pack-price").val().replace(/\./g, '');
                    break;
                case "BHHH":
                    lading.Insured = value.$BHHHDiv.find(".insured").val().replace(/\./g, '');
                    //lading.InsuredPrice = value.$BHHHDiv.find(".insured-price").val().replace(/\./g, '');
                    break;
            }
            lading.serviceDVGTIds.push($(this).val());
        });
        //;
        lading.insured = value.$BHHHDiv.find(".insured").val().replace(/\./g, '');
        lading.totalBox = value.$Number.val();
        lading.Weight = value.$Weight.val();
        lading.ServiceId = value.$Service.find("option:selected").val();
        lading.shipmentStatusId = 54;//yêu cầu mới tạo
        //price
        if (value.$PriceMain.val().replace(/\./g, '')) {
            lading.DefaultPrice = value.$PriceMain.val().replace(/\./g, '');
        } else {
            //lading.DefaultPrice = (value.$Service.find("option:selected")[0] ? value.$Service.find("option:selected")[0].attributes[0].value : 0);
        }
        lading.FuelPrice = value.$PPXD.val().replace(/\./g, '');
        lading.RemoteAreasPrice = value.$VSVX.val().replace(/\./g, '');
        lading.TotalDVGT = value.$DVGTPrice.val().replace(/\./g, '');
        lading.VATPrice = 0;
        lading.OtherPrice = 0;
        lading.TotalPrice = value.$Amount.val().replace(/\./g, '');
        return lading;
    }
    function loadInfo() {
        var token = $.cookie('token');
        $.when(sys.CallAjaxasync(apiCustomer + '/Account/GetCurrentInfo', null, token)).done(function (data) {
            if (data.isSuccess) {
                var info = data.data;
                senderId = info.id;
                senderName = info.name;
                senderPhone = info.senderName;
                senderAddress = info.senderAddress;
                senderCompany = info.senderCompany;
                $('.sender-name').val(info.name);
                $('.sender-phone').val(info.phoneNumber);
                $('.sender-address').val(info.address);
                $('.sender-company').val(info.nameEn);
                districtSenderId = info.districtId;
                citySenderId = info.provinceId;
                wardSenderId = info.wardId;
                senderAddress = info.address;
                latFrom = info.lat;
                lngFrom = info.lng;
                $.when(sys.CallAjaxasync(apiCustomer + '/hub/GetHubByWardId', { wardId: wardSenderId }, token)).done(function (dataH) {
                    if (dataH.isSuccess && dataH.data != null) {
                        var hub = dataH.data;
                        hubSenderId = hub.id;
                    }
                });
                $.when(sys.CallAjaxasync(apiCRM + '/CusDepartment/GetByCustomerId', { customerId: senderId }, token)).done(function (department) {
                    if (department.isSuccess && department.data != null) {
                        var dep = department.data;
                        department = hub.id;
                    }
                });
            }
        });
    }
    function getHub(wardId, _this) {
        var token = $.cookie('token');
        $.when(sys.CallAjaxasync(apiCustomer + '/hub/GetHubByWardId', { wardId: wardId }, token)).done(function (data) {
            if (data.isSuccess && data.data != null) {
                var hub = data.data;
                _this.HubId = hub.id;
                return hub.id;
            }
        });
    }

    function getProvinceId(name) {
        var token = $.cookie('token');
        $.when(sys.CallAjaxasync(apiCustomer + '/province/GetProvinceByName', { name: name }, token)).done(function (data) {
            if (data.isSuccess) {
                var pro = data.data;
                return pro.id;
            }
        });
    }

    function getDistrictId(name, provinceId, _this, _thisService) {
        var token = $.cookie('token');
        $.when(sys.CallAjaxasync(apiCustomer + '/district/GetDistrictByName', { name: name, provinceId: provinceId }, token)).done(function (data) {
            if (data.isSuccess) {
                if (_this && _thisService) {
                    _LoadService(_this, _thisService)
                }
                var dis = data.data;
                return dis.id;
            }
        });
    }

    function getWard(name, districtId, _this) {
        var token = $.cookie('token');
        $.when(sys.CallAjaxasync(apiCustomer + '/ward/GetWardByName', { name: name, districtId: districtId }, token)).done(function (data) {
            if (data.isSuccess) {
                var ward = data.data;
                _this.WardId = ward.id;
                return ward.id;
            }
        });
    }
});

function sendRequestAddLading(listLaingId) {
    sys.Loading();
    var token = $.cookie('token');
    var request = new Object();
    request.orderDate = sys.formatDateTimeSQL(new Date());;
    request.senderId = senderId;
    request.senderName = senderName;
    request.senderPhone = senderPhone ? senderPhone : 0;
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
    var token = $.cookie('token');
    $.when(sys.CallAjaxPostasync(apiCustomer + "/requestshipment/CreateRequest", request, token)).done(function (data) {
        if (data.isSuccess) {
            $(".success").html('Gửi yêu cầu nhận hàng thành công.').slideDown(1000).delay(7000).slideUp('slow');
            sys.HideLoading();
        } else {
            $(".error").html("Tạo yêu cầu nhận hàng thất bại!").slideDown(1000).delay(15000).slideUp('slow');
            sys.HideLoading();
        }
    });
}
function AddBox() {
    $('.btn-load-modal').click()
}
