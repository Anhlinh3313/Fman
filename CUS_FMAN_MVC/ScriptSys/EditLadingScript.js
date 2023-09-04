var _this = this;
_this.index = 0;
_this.$template = $('.extend-container');
_this.$plcholder = $('.lading-list');
_this.$LadingId = null;
_this.$CusNameFrom = null;
_this.$PhoneFrom = null;
_this.$AddressFrom = null;
_this.$CusAddressFromSelect = null;
_this.$CompanyFrom = null;
_this.$CusNameTo = null;
_this.$PhoneTo = null;
_this.$AddressTo = null;
_this.$AddressNoteTo = null;
_this.$CompanyTo = null;
_this.$CompanyTo = null;

_this.$ToProvice = null;
_this.$ToDistrict = null;
_this.$ToWard = null;
_this.$ToPoHub = null;
_this.toHubId = 0;
_this.toHubRoutingId = 0;

_this.$FromProvice = null;
_this.$FromDistrict = null;
_this.$FromWard = null;
_this.$FromPoHub = null;

_this.CityId = null;
_this.DistrictId = null;
_this.WardId = null;
_this.$Service = null;
_this.$ServiceDVGT = null;
_this.$BHHHDiv = null;//khai giá
_this.$BHHH = null;//khai giá
_this.$BHHHPrice = null;//khai giá
_this.$DGHHDiv = null;//đóng gói
_this.$DGHH = null;//đóng gói
_this.$DGHHPrice = null;//đóng gói
_this.$CODDiv = null;//COD
_this.$COD = null;//COD
_this.$CODPrice = null;//COD
_this.$Payment = null;
_this.$ShipmentNumber = null;
_this.$Weight = null;
_this.$Height = null;
_this.$Length = null;
_this.$Width = null;
_this.$CalWidth = null;
_this.$Number = null;//Số kiện
_this.$Mass = null;//Khối lượng quy đổi
_this.Lat = 0;
_this.Lng = 0;
_this.$PriceMain = null;
_this.$DVGTPrice = null;
_this.$OtherPrice = null;
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
_this.$OrderDate = null;
_this.$Status = null;
_this.$ShopCode = null;

var _serverId = 0;
window.count = 0;
var ladingNumber = 0;
var ladings = [];
// var latFrom = 0;
// var lngFrom = 0;
// var wardSenderId = 0;
// var districtSenderId = 0;
// var citySenderId = 0;
var firstLoad = true;
_this.$el = null;
var oject = {};
_this.$shipmentId

$(document).ready(function () {

    _LoadPayment();
    _LoadServiceGT();
    _LoadTypePack();
    _LoadStructure();

    _LoadProvince();

    initMapFrom();

    $("#ladingFrom").validationEngine('attach', {
        'custom_error_messages': {
            // '.sender-name': {
            //     'required': {
            //         'message': "* Ho tên người gửi không được bỏ trống!"

            //     }
            // }, '.sender-phone': {
            //     'required': {
            //         'message': "* Số điện thoại gửi được để trống!"
            //     }
            // },
            // '.sender-address': {
            //     'required': {
            //         'message': "* Địa chỉ gửi không được để trống!"
            //     }
            // },
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
            '.receiver-address': {
                'required': {
                    'message': "* Địa chỉ nhận không được để trống!"
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
            // '.number': {
            //     'required': {
            //         'message': "* Số kiện không được để trống!"
            //     },
            //     'min': {
            //         'message': "* Số kiện phải lớn hơn 0!"
            //     }
            // },
            // '.length': {
            //     'required': {
            //         'message': "* Chiều dài không được để trống!"
            //     },
            //     'min': {
            //         'message': "* Chiều dài phải lớn hơn 0!"
            //     }
            // },
            // '.height': {
            //     'required': {
            //         'message': "* Chiều cao không được để trống!"
            //     },
            //     'min': {
            //         'message': "* Chiều cao phải lớn hơn 0!"
            //     }
            // },
            // '.width': {
            //     'required': {
            //         'message': "* Chiều rộng không được để trống!"
            //     },
            //     'min': {
            //         'message': "* Chiều rộng phải lớn hơn 0!"
            //     }
            // },
            // '.cod': {
            //     'required': {
            //         'message': "* COD không được để trống!"
            //     },
            //     'min': {
            //         'message': "* COD phải lớn hơn 0!"
            //     }
            // },
            // '.insured': {
            //     'required': {
            //         'message': "* Khai giá không được để trống!"
            //     },
            //     'min': {
            //         'message': "* Khai giá phải lớn hơn 0!"
            //     }
            // }
        },
        promptPosition: "inline"

    });

    _this.$el = _this.$template;
    _this.$LadingId = _this.$el.find('.ladingid');
    _this.$CusNameFrom = _this.$el.find('.sender-name');
    _this.$PhoneFrom = _this.$el.find('.sender-phone');
    _this.$AddressFrom = _this.$el.find('.sender-address');
    _this.$CompanyFrom = _this.$el.find('.sender-company');
    _this.$CusNameTo = _this.$el.find('.receiver-name');
    _this.$CusNameTo.attr('id', 'nameto');
    _this.$PhoneTo = _this.$el.find('.receiver-phone');
    _this.$PhoneTo.attr('id', 'phoneto');
    _this.$AddressTo = _this.$el.find('.receiver-address');
    _this.$AddressNoteTo = _this.$el.find('.receiver-address-note');
    _this.$AddressTo.attr("id", "autocomplete");

    _this.$CusAddressFromSelect = _this.$el.find('.sender-address-select');
    _this.$CusAddressFromSelect.chosen()

    _this.$ToProvice = _this.$el.find('.toProvince');
    _this.$ToProvice.chosen();
    _this.$ToDistrict = _this.$el.find('.toDistrict');
    _this.$ToDistrict.chosen();
    _this.$ToWard = _this.$el.find('.toWard');
    _this.$ToWard.chosen();
    _this.$ToPoHub = _this.$el.find('.toPoHub');

    _this.$FromProvice = _this.$el.find('.fromProvince');
    _this.$FromDistrict = _this.$el.find('.fromDistrict');
    _this.$FromWard = _this.$el.find('.fromWard');
    _this.$FromPoHub = _this.$el.find('.fromPoHub');

    _this.$OrderDate = _this.$el.find('.orderdate');
    _this.$Status = _this.$el.find('.shipmentStatus');

    _this.$CompanyTo = _this.$el.find('.receiver-company');
    //
    _this.$Structure = _this.$el.find('.structure');
    _this.$Structure.chosen();
    //
    _this.$Service = _this.$el.find('.service');
    _this.$Service.chosen();
    _this.$Payment = _this.$el.find('.payment');
    _this.$Payment.chosen();
    _this.$ShipmentNumber = _this.$el.find('.shipmentNumber');
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
    sys.formatNumber($(_this.$BHHHDiv).find('input'));
    _this.$BHHH = _this.$BHHHDiv.find('.insured');
    _this.$BHHHPrice = _this.$BHHHDiv.find('.insured-price');
    _this.$DGHHDiv = _this.$el.find('.pack-div');
    sys.formatNumber($(_this.$DGHHDiv).find('input'));
    _this.$DGHH = _this.$el.find('.pack-type');
    _this.$DGHHPrice = _this.$el.find('.pack-price');
    _this.$CODDiv = _this.$el.find('.cod-div');
    sys.formatNumber($(_this.$CODDiv).find('input'));
    _this.$COD = _this.$el.find('.cod');
    // _this.$CODPrice = _this.$el.find('.cod-price');
    _this.$Noted = _this.$el.find('.noted');
    _this.$Description = _this.$el.find('.description');

    _this.$pack_type = _this.$el.find('.pack-type');
    _this.$pack_type.chosen();
    _this.$CalWeight = _this.$el.find('.cal-weight');
    _this.$CalWeight.attr('id', 'calWeight');
    _this.$Weight = _this.$el.find('.weight');
    _this.$Weight.attr('id', 'weight');
    _this.$Width = _this.$el.find('.width-box');
    _this.$Height = _this.$el.find('.height-box');
    _this.$Length = _this.$el.find('.length-box');
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
    _this.$ShopCode = _this.$el.find('.shop-code');
    //
    _this.$clickPrice.on('click', checkHidePrice);
    _this.$ServiceDVGT.on('change', serviceGTChange);
    // _this.$AddressTo.on('change', addressChange);
    $(".sender-address").add(_this.$AddressTo).add(_this.$BHHHDiv.find(".insured")).add(_this.$DGHHDiv.find(".pack-type"))
        .add(_this.$CODDiv.find(".cod")).add(_this.$Weight).add(_this.$Height).add(_this.$Width)
        .add(_this.$Length).add(_this.$Number).add(_this.$Service).add(_this.$ServiceDVGT).on("change", calculator);

    initMap(_this);
    function checkHidePrice() {
        if (_this.$el.find('.hide-price').hasClass('display-none')) {
            _this.$el.find('.hide-price').removeClass('display-none');
        } else {
            _this.$el.find('.hide-price').addClass('display-none');
        }
    }

    $(".bt-update").on("click", function () {
        sys.Loading();
        _this.$Service = _this.$el.find('.service');
        _this.$Service.chosen();
        var token = $.cookie('token');
        //var ladingModel = GetLadingModel(_this);
        var ladingModel = oject;
        //
        ladingModel.id = ladingModel.id;
        ladingModel.orderDate = _this.$OrderDate.val();
        ladingModel.shipmentNumber = _this.$ShipmentNumber.val();
        ladingModel.senderId = $.cookie('userId');
        ladingModel.shipmentStatusId = _this.$Status.val();
        //sender
        ladingModel.senderName = $(".sender-name").val();
        ladingModel.senderPhone = $(".sender-phone").val();
        ladingModel.companyFrom = $(".sender-company").val();

        ladingModel.pickingAddress = $(".sender-address").val();
        // ladingModel.fromProvinceId = _this.$FromProvice.val();
        // ladingModel.fromDistrictId = _this.$FromDistrict.val();
        // ladingModel.fromWardId = _this.$FromWard.val();
        // ladingModel.fromHubId = _this.$FromPoHub.val();
        //
        ladingModel.fromDistrictId = districtSenderId;
        ladingModel.fromProvinceId = citySenderId;
        ladingModel.fromWardId = wardSenderId;
        ladingModel.fromHubId = hubSenderId;
        ladingModel.currentHubId = hubSenderId;
        ladingModel.fromHubRoutingId = hubRoutingId;
        //
        ladingModel.latFrom = latFrom;
        ladingModel.lngFrom = lngFrom;
        //receiver
        ladingModel.receiverName = _this.$CusNameTo.val();
        ladingModel.receiverPhone = _this.$PhoneTo.val();
        ladingModel.companyTo = _this.$CompanyTo.val();
        ladingModel.addressNoteTo = _this.$AddressNoteTo.val();

        ladingModel.shippingAddress = _this.$AddressTo.val();
        ladingModel.toProvinceId = _this.$ToProvice.val();
        ladingModel.toDistrictId = _this.$ToDistrict.val();
        ladingModel.toWardId = _this.$ToWard.val();
        ladingModel.toHubId = _this.toHubId;
        ladingModel.toHubRoutingId = _this.toHubRoutingId;

        ladingModel.latTo = _this.Lat;
        ladingModel.lngTo = _this.Lng;
        //
        ladingModel.weight = _this.$Weight.val();
        ladingModel.calWeight = _this.$CalWeight.val();
        ladingModel.width = _this.$Width.val() ? _this.$Width.val() : 0;
        ladingModel.length = _this.$Length.val() ? _this.$Length.val() : 0;
        ladingModel.height = _this.$Height.val() ? _this.$Height.val() : 0;
        ladingModel.totalBox = _this.$Number.val() ? _this.$Number.val() : 1;

        ladingModel.note = _this.$Noted.val();
        ladingModel.content = _this.$Description.val();

        ladingModel.serviceId = _this.$Service.find("option:selected").val();
        ladingModel.paymentTypeId = _this.$Payment.find("option:selected").val();
        ladingModel.structureId = _this.$Structure.find("option:selected").val();
        //
        ladingModel.serviceDVGTIds = [];
        _this.$ServiceDVGT.find("option:selected").each(function () {
            switch ($(this).attr('data-code').toLocaleUpperCase()) {
                case "COD":
                    ladingModel.cod = Number(_this.$CODDiv.find(".cod").val().replace(/\./g, ''));
                    break;
                case "BHHH":
                    ladingModel.insured = Number(_this.$BHHHDiv.find(".insured").val().replace(/\./g, ''));
                    break;
                case "BH":
                    ladingModel.insured = Number(_this.$BHHHDiv.find(".insured").val().replace(/\./g, ''));
                    break;
            }
            ladingModel.serviceDVGTIds.push(Number($(this).attr('data-id')));
        });
        
        ladingModel.cod = Number(_this.$CODDiv.find(".cod").val().replace(/\./g, ''));
        ladingModel.insured = Number(_this.$BHHHDiv.find(".insured").val().replace(/\./g, ''));
        //price
        ladingModel.priceMain = _this.$PriceMain.val().replace(/\./g, '');
        ladingModel.pPXDPercent = _this.$PPXD.val().replace(/\./g, '');
        ladingModel.priceFar = _this.$VSVX.val().replace(/\./g, '');
        ladingModel.totalPriceDVGT = _this.$DVGTPrice.val().replace(/\./g, '');
        ladingModel.priceVAT = 0;
        ladingModel.priceOther = 0;
        ladingModel.defaultPrice = _this.$Amount.val().replace(/\./g, '');
        //
        if (ladingModel) {
            console.log(ladingModel);
            
            $.when(sys.CallAjaxPostasync(apiCustomer + "/shipment/update", ladingModel, token)).done(function (data) {
                if (data.isSuccess) {
                    $(".success").html('Chỉnh sửa thông tin đơn hàng thành công').slideDown(1000).delay(5000).slideUp('slow');
                    //$('.bt-close').click();
                    //$('.btn-search').click();
                    sys.HideLoading();
                    dtReport.ajax.reload();
                } else {
                    $(".error").html("Lỗi trong quá trình chỉnh sửa thông tin đơn hàng!").show();
                    sys.HideLoading();
                }
            });
            
            sys.HideLoading();
            return false;
        } else {
            $(".error").html("Không có đơn hàng để chỉnh sửa!").slideDown(1000).delay(3000).slideUp(2000);
            sys.HideLoading();
            return false;
        }
    });

    _this.$ToProvice.on('change', function() {
        _LoadDistrictByProvince(_this.$ToProvice.val());
    })
    _this.$ToDistrict.on('change', function() {
        _LoadWardByDistrict(_this.$ToDistrict.val());
        getInfoHubRouting(_this.$ToDistrict.val(), 0, _this);
        calculator();
    })
    _this.$CusAddressFromSelect.on('change', function () {
        _changeSelectAddress(_this)
    });
    _this.$CODDiv.find(".cod").on('change', function () {
        _inputCODChange(_this)
    });
    _this.$BHHHDiv.find(".insured").on('change', function () {
        _inputBHHHChange(_this)
    });
    
    var _changeSelectAddress = function (_this) {
        var object = new Object();
        var data = JSON.stringify(_this.$CusAddressFromSelect.find("option:selected").attr('data-value'));;
        var dataPar = JSON.parse(JSON.parse(data));

        var representativename = dataPar.representativeName ? dataPar.representativeName : dataPar.name;
        var phonenumber = dataPar.phoneNumber;
        var provinceid = dataPar.provinceId;
        var districtid = dataPar.districtId;
        var wardid = dataPar.wardId;
        var address = dataPar.address;
        var lat = dataPar.lat;
        var lng = dataPar.lng;

        senderName = representativename;
        senderPhone = phonenumber;
        senderAddress = address;
        districtSenderId = districtid;
        citySenderId = provinceid;
        wardSenderId = wardid;
        senderAddress = address;
        latFrom = lat;
        lngFrom = lng;
        if (districtSenderId) {
            $.when(sys.CallAjaxasync(apiCore + '/Hub/GetInfoHubRouting', { districtId: districtSenderId }, null)).done(function (data) {
                if (data.isSuccess && data.data != null) {
                    var hub = data.data;
                    hubSenderId = hub.hubId;
                    hubRoutingId = hub.hubRoutingId;
                }
            });
        }

        $('.sender-name').val(representativename);
        $('.sender-phone').val(phonenumber);
        $('.sender-address').val(address);
        console.log(dataPar);
        //_LoadService(_this);
        calculator()
    }
    var _inputCODChange = function (_this) {
        var selected = [];
        _this.$ServiceDVGT.each(function () {
            selected.push([$(this).val(), $(this).data('order')]);
        });
        if (_this.$CODDiv.find(".cod").val() == "" && _this.$ServiceDVGT.multiselect() || _this.$CODDiv.find(".cod").val() == 0) {
            _this.$ServiceDVGT.multiselect("deselect", ['cod']);
            $('li.COD').removeClass('disabled');
            _this.$ServiceDVGT.trigger('change');
        } else {
            _this.$ServiceDVGT.multiselect("select", ['cod']);
            $('li.COD').addClass('disabled');
            _this.$ServiceDVGT.trigger('change');
        }
    }
    
    var _inputBHHHChange = function (_this) {
        var selected = [];
        _this.$ServiceDVGT.each(function () {
            selected.push([$(this).val(), $(this).data('order')]);
        });
        if (Number(_this.$BHHHDiv.find(".insured").val().replace(/\./g, '')) > 3000000) {
            _this.$ServiceDVGT.multiselect("select", ['bhhh', 'bh']);
            $('li.BHHH').addClass('disabled');
            _this.$ServiceDVGT.trigger('change');
        } else {
            _this.$ServiceDVGT.multiselect("deselect", ['bhhh', 'bh']);
            $('li.BHHH').removeClass('disabled');
            _this.$ServiceDVGT.trigger('change');
        }
    }
    
});
function GetLadingModel(value) {
    var lading = new Object();
    lading.Id = value.$LadingId.val();
    lading.pickingAddress = lading.AddressFrom = $(".sender-address").val();
    lading.senderName = lading.NameFrom = $(".sender-name").val();
    lading.senderPhone = lading.PhoneFrom = $(".sender-phone").val();
    lading.senderCompany = lading.CompanyFrom = $(".sender-company").val();

    lading.fromDistrictId = districtSenderId;
    lading.fromProvinceId = citySenderId;
    lading.fromWardId = wardSenderId;
    lading.fromHubId = hubSenderId;
    lading.currentHubId = hubSenderId;

    lading.latFrom = latFrom;
    lading.lngFrom = lngFrom;

    lading.shippingAddress = value.$AddressTo.val();
    lading.receiverName = value.$CusNameTo.val();
    lading.receiverPhone = value.$PhoneTo.val();
    lading.CompanyTo = value.$CompanyTo.val();
    lading.CityRecipientId = value.CityId;

    lading.toProvinceId = value.$ToProvice.val();
    lading.toDistrictId = value.$ToDistrict.val() ? value.$ToDistrict.val() : 0;
    lading.toWardId = value.$ToWard.val();
    lading.toHubId = value.toHubId;

    lading.shippingAddress = value.$AddressTo.val();
    lading.adressNoteTo = value.$AddressNoteTo.val();
    lading.receiverName = value.$CusNameTo.val();
    lading.receiverPhone = value.$PhoneTo.val();
    lading.companyTo = value.$CompanyTo.val();
    lading.latTo = value.Lat;
    lading.lngTo = value.Lng;
    lading.weight = value.$Weight.val() ? value.$Weight.val() : 0;
    lading.width = value.$Width.val() ? value.$Width.val() : 0;
    lading.height = value.$Height.val() ? value.$Height.val() : 0;
    lading.length = value.$Length.val() ? value.$Length.val() : 0;
    lading.number = value.$Number.val() ? value.$Number.val() : 0;
    lading.noted = value.$Noted.val();
    lading.description = value.$Description.val();
    lading.serviceId = value.$Service.find("option:selected").val() ? value.$Service.find("option:selected").val(): 0;
    lading.paymentId = value.$Payment.find("option:selected").val();
    lading.anotherServiceId = [];
    lading.serviceDVGTIds = [];
    value.$ServiceDVGT.find("option:selected").each(function () {
        switch ($(this).attr('data-code').toLocaleUpperCase()) {
            case "COD":
                lading.COD = Number(value.$CODDiv.find(".cod").val().replace(/\./g, ''));
                break;
            case "BHHH":
                lading.Insured = Number(value.$BHHHDiv.find(".insured").val().replace(/\./g, ''));
                break;
            case "BH":
                lading.Insured = Number(value.$BHHHDiv.find(".insured").val().replace(/\./g, ''));
                break;
        }
        lading.serviceDVGTIds.push(Number($(this).attr('data-id')));
    });
    //price
    lading.priceMain = value.$PriceMain.val().replace(/\./g, '');
    lading.PPXDPercent = value.$PPXD.val().replace(/\./g, '');
    lading.PriceFar = value.$VSVX.val().replace(/\./g, '');
    lading.TotalPriceDVGT = value.$DVGTPrice.val().replace(/\./g, '');
    lading.PriceVAT = 0;
    lading.PriceOther = 0;
    lading.Amount = value.$Amount.val().replace(/\./g, '');
    return lading;
}
function serviceGTChange() {
    //$('.btn-edit').click();

    _this.$ServiceDVGT.find("option").each(function () {
        switch ($(this).val()) {
            // case "40":
            //     if ($(this).is(":selected")) {
            //         _this.$CODDiv.show();
            //     } else {
            //         _this.$CODDiv.hide()
            //     }
            //     break;
            case "41":
                if ($(this).is(":selected")) {
                    _this.$DGHHDiv.show();
                } else {
                    _this.$DGHHDiv.hide()
                }
                break;
            case "42":
                if ($(this).is(":selected")) {
                    _this.$BHHHDiv.show();
                } else {
                    _this.$BHHHDiv.hide()
                }
                break;
        }
    });
}
function calculator() {
    if (citySenderId && districtSenderId && _this.$ToDistrict.val() && _this.$Service.val()) {
        // var $lading = $.grep(ladings, function (e) { return e.index == _this.index });
        var lading = GetLadingModel(_this);
        var token = $.cookie('token');
        $(".message_error").hide();
        $.when(sys.CallAjaxPostasync(apiCustomer + "/price/Calculate", lading, token)).done(function (data) {
            if (data.isSuccess) {
                _this.$PriceMain.val(formatMoney(data.data.defaultPrice, 0));
                _this.$OtherPrice.val(data.data.otherPrice);
                _this.$PPXD.val(formatMoney(data.data.fuelPrice, 0));
                _this.$VSVX.val(formatMoney(data.data.remoteAreasPrice, 0));
                _this.$VAT.val(data.data.vatPrice);
                _this.$DVGTPrice.val(formatMoney(data.data.totalDVGT, 0));
                _this.$Amount.val(formatMoney(data.data.totalPrice, 0));

                //_this.$CODDiv.find(".cod-price").val(formatMoney(data.totalDVGT, 0));
                //_this.$BHHHDiv.find(".insured-price").val(formatMoney(data.InsuredPrice, 0));
                //_this.$DGHHDiv.find(".pack-price").val(formatMoney(data.PackPrice, 0));
                // data.StructureName;
            } else {
                _this.$PriceMain.val(0);
                _this.$OtherPrice.val(0);
                _this.$PPXD.val(0);
                _this.$VSVX.val(0);
                _this.$VAT.val(0);
                _this.$DVGTPrice.val(0);
                _this.$Amount.val(0);
                $(".message_error").stop().slideDown(); 
                $(".message_error").html('Địa chỉ "Giao hàng" hoặc "Gửi hàng" chưa hỗ trợ, Vui lòng liên hệ với chăm sóc khách hàng để được hỗ trợ!').slideDown(500).delay(15000).slideUp();
            }
        });
    }
}
function initMap(_this) {
    var options = {
        componentRestrictions: { 'country': ['vi', 'vn'] }
    };
    var input = document.getElementById(_this.$AddressTo.attr("id"));

    var autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            return;
        } else {
            $.when(sys.CallAjaxasync(apiCore + '/hub/GetInfoLocationByAddress', { address: place.formatted_address }, token)).done(function (dataInfoLocation) {
                if (dataInfoLocation.isSuccess && dataInfoLocation.data != null) {
                    var infoLocation = dataInfoLocation.data;
                    _this.CityId = infoLocation.provinceId;
                    _this.$ToProvice.val(infoLocation.provinceId).trigger("chosen:updated").trigger("change");
                    _LoadDistrictByProvince(_this.CityId);
                    _this.DistrictId = infoLocation.districtId;
                    _this.$ToDistrict.val(infoLocation.districtId).trigger("chosen:updated").trigger("change");
                    _LoadWardByDistrict(_this.DistrictId);
                    _this.WardId = infoLocation.wardId;
                    _this.$ToWard.val(infoLocation.wardId).trigger("chosen:updated").trigger("change");
                    _this.HubId = infoLocation.hubId;
                    _this.Lat = place.geometry.location.lat();
                    _this.Lng = place.geometry.location.lng();
                    //_LoadService(_this);
                    console.log(infoLocation);
                    
                    $.when(sys.CallAjaxasync(apiCore + '/Hub/GetInfoHubRouting', { districtId: _this.DistrictId }, null)).done(function (data) {
                        if (data.isSuccess && data.data != null) {
                            var hub = data.data;
                            _this.toHubId = hub.hubId;
                            _this.toHubRoutingId = hub.hubRoutingId;
                        }
                    });
                } else {

                }
            });
        };
    });
}
function _LoadServiceGT() {
    var html = "";
    var token = $.cookie('token');

    $.when(sys.CallAjaxasync(apiCustomer + '/Service/GetListServiceSub', null, token)).done(function (data) {
        if (data.isSuccess) {
            dataDVGT = data.data;
            html += "";
            $.each(dataDVGT, function (key, value) {
                html += "<option class='" + value.code + "' data-id='" + value.id + "'data-code='" + value.code.toLocaleLowerCase() + "' data-oracleCode='" + (value.vseOracleCode ? value.vseOracleCode.toLocaleLowerCase(): '') + "' value='" + value.code.toLocaleLowerCase() + "'>" + value.name + "</option>";
            });
            $("select.servicedvgt").html(html);
        }
    });
}
function _LoadPayment() {
    var html = "";
    var token = $.cookie('token');
    $.when(sys.CallAjaxasync(apiCustomer + '/paymentType/getAll', null, token)).done(function (data) {
        if (data.isSuccess) {
            html += "";
            $.each(data.data, function (key, value) {
                html += "<option data='" + value.code + "' value='" + value.id + "'>" + value.name + "</option>";
            });
            $("select.payment").html(html);
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
function initMapFrom() {
    var options = {
        componentRestrictions: { 'country': ['vi', 'vn'] }
    };
    var input = document.getElementById("sender-address");
    var autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            window.alert("Không tìm thấy thông tin địa chỉ: '" + place.name + "'");
            return;
        } else {
            LoadSenderForm(place.formatted_address);
        }
    });
}
function LoadSenderForm(addressFrom) {
    var componentForm = {
        street_number: 'short_name',
        route: 'short_name',//đường
        locality: 'short_name',
        sublocality_level_1: 'short_name',//phường xã
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
            address: addressFrom,
            key: KeyGoogle
        },
        dataType: 'json',
        success: function (data, textStatus) {
            //console.log(data.results[0].address_components);
            var address = data.results[0];
            if (!data.results[0] || !data.results[0].geometry) {
                window.alert("Không tìm thấy thông tin địa chỉ: '" + addressFrom + "'");
                return;
            }
            var locationTo = data.results[0].geometry.location;
            latFrom = locationTo.lat;
            lngFrom = locationTo.lng;

            //UpdateAmount();
            //
            var districtName = '', stateName = '', stateID = '', districtID = '', wardName = '';
            for (var i = 0; i < address.address_components.length; i++) {
                for (j = 0; j < address.address_components[i].types.length; j++) {
                    var addressType = address.address_components[i].types[j];
                    if (addressType == 'administrative_area_level_1') {
                        stateName = address.address_components[i][componentForm[addressType]];
                    }
                    if (addressType == 'administrative_area_level_2') {
                        districtName = address.address_components[i][componentForm[addressType]];
                    }
                    if (addressType == "sublocality_level_1") {
                        wardName = address.address_components[i][componentForm[addressType]];
                    }
                }
            }
            //$.when(sys.CallAjaxasync(apiCustomer + "/Lading/GetStateIDAndDistrictID", { stateName: stateName, districtName: districtName })).done(function (data) {
            //    if (data !== null) {
            //        citySenderId = data.StateID;
            //        districtSenderId = data.DistrictID;
            //    }
            //});
            var token = $.cookie('token');
            $.when(sys.CallAjaxasync(apiCustomer + '/province/GetProvinceByName', { name: stateName }, token)).done(function (data1) {
                if (data1.isSuccess) {
                    var pro = data1.data;
                    citySenderId = pro.id;
                    $.when(sys.CallAjaxasync(apiCustomer + '/district/GetDistrictByName', { name: districtName, provinceId: citySenderId }, token)).done(function (data2) {
                        if (data2.isSuccess) {
                            var dis = data2.data;
                            districtSenderId = dis.id;
                            $.when(sys.CallAjaxasync(apiCustomer + '/ward/GetWardByName', { name: wardName, districtId: districtSenderId }, token)).done(function (data3) {
                                if (data3.isSuccess) {
                                    var ward = data3.data;
                                    wardSenderId = ward.id;
                                    $.when(sys.CallAjaxasync(apiCustomer + '/hub/GetHubByWardId', { wardId: wardSenderId }, token)).done(function (data4) {
                                        if (data4.isSuccess && data4.data != null) {
                                            var hub = data4.data;
                                            hubSenderId = hub.id;
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}
function ViewEdit(shipmentNumber) {
    $('.btn-edit').click();
    var token = $.cookie('token');
    var cols = 'Service,Structure,ShipmentStatus,FromHub,ToHub,ShipmentServiceDVGTs,PaymentType';
    $.when(sys.CallAjaxasync(apiCustomer + '/shipment/TrackingBoth', { shipmentNumber: shipmentNumber, cols: cols }, token)).done(function (data) {
        if (data.isSuccess) {
            //
            oject = data.data;

            _this.$LadingId.val(data.data.id);
            _this.$CusNameFrom.val(data.data.senderName);
            _this.$PhoneFrom.val(data.data.senderPhone);
            _this.$AddressFrom.val(data.data.pickingAddress);
            _this.$CusAddressFromSelect.chosen().val(data.data.pickingAddress).trigger("chosen:updated");
            // LoadSenderForm(_this.$AddressFrom.val());
            _this.$CompanyFrom.val(data.data.companyFrom);
            _this.$CusNameTo.val(data.data.receiverName);
            _this.$PhoneTo.val(data.data.receiverPhone);
            _this.$AddressTo.val(data.data.shippingAddress);
            initMap(_this);

            _this.$ToProvice.val(data.data.toProvinceId);
            _this.$ToProvice.trigger("chosen:updated");
            _LoadDistrictByProvince(data.data.toProvinceId);

            _this.$ToDistrict.val(data.data.toDistrictId);
            _this.$ToDistrict.trigger("chosen:updated");
            _LoadWardByDistrict(data.data.toDistrictId);

            _this.$ToWard.val(data.data.toWardId);
            _this.$ToWard.trigger("chosen:updated");

            _this.$ToPoHub.val(data.data.toHubId);

            _this.$FromProvice.val(data.data.fromProvinceId);
            _this.$FromDistrict.val(data.data.fromDistrictId);
            _this.$FromWard.val(data.data.fromWardId);
            _this.$FromPoHub.val(data.data.fromHubId);

            _this.$OrderDate.val(data.data.orderDate);
            _this.$Status.val(data.data.shipmentStatusId);
            _this.$ShipmentNumber.val(data.data.shipmentNumber);

            _this.$AddressNoteTo.val(data.data.addressNoteTo);
            _this.$Weight.val(data.data.weight);
            _this.$CalWeight.val(data.data.calWeight);
            _this.$Width.val(data.data.width);
            _this.$Height.val(data.data.height);
            _this.$Length.val(data.data.length);
            _this.$Number.val(data.data.totalBox);

            _this.$Description.val(data.data.content);
            _this.$Noted.val(data.data.note);
            _this.$Payment.val(data.data.paymentTypeId);
            _this.$Payment.trigger("chosen:updated");
            _this.$VAT.val(formatMoney(data.data.vatPrice, 0));
            _this.$PriceMain.val(formatMoney(data.data.defaultPrice, 0));
            _this.$PPXD.val(formatMoney(data.data.fuelPrice, 0));
            _this.$VSVX.val(formatMoney(data.data.remoteAreasPrice, 0));
            _this.$OtherPrice.val(formatMoney(data.data.otherPrice, 0));
            _this.$DVGTPrice.val(formatMoney(data.data.totalDVGT, 0));
            _this.$Amount.val(formatMoney(data.data.totalPrice, 0));
            _this.$ShopCode.val(data.data.shopCode);
            //
            var arrayDVGT = [];
            if (data.data.shipmentServiceDVGTs != null) {
                $.each(data.data.shipmentServiceDVGTs, function (index, value) {
                    arrayDVGT.push(value.serviceDVGTId);
                });
                _this.$ServiceDVGT.val(arrayDVGT);
            }
            _this.$ServiceDVGT.multiselect('refresh');
            serviceGTChange();
            _this.$BHHH.val(formatMoney(data.data.insured, 0));
            if (data.data.insured > 3000000) {
                _this.$ServiceDVGT.multiselect("select", ['bhhh', 'bh']);
                $('li.BHHH').addClass('disabled');
                _this.$ServiceDVGT.trigger('change');
            }
            _this.$BHHHPrice.val(formatMoney(data.data.InsuredPrice, 0));
            _this.$DGHH.val(data.data.packageId);
            _this.$DGHH.trigger("chosen:updated");
            _this.$COD.val(formatMoney(data.data.cod, 0));
            if (data.data.cod) {
                _this.$ServiceDVGT.multiselect("select", ['cod']);
                $('li.COD').addClass('disabled');
                _this.$ServiceDVGT.trigger('change');
            }
            _this.$Service.val(data.data.serviceId);
            _LoadService(data.data, _this);
            _this.$Service.trigger("chosen:updated");
            _this.$Structure.val(data.data.structureId);
            _this.$Structure.trigger("chosen:updated");
            _this.toHubRoutingId = data.data.toHubRoutingId;
            hubRoutingId = data.data.fromHubRoutingId;
            _this.toHubId = data.data.toHubId;

        } else {
            sys.Alert("Thông báo", "Không tìm thấy thông tin mã vận đơn: " + shipmentNumber, 'Kiểm tra lại')
        }
    });
}

function _LoadService(this_) {
    var lading = GetLadingPriceModel(this_);
    var html = "";
    var token = $.cookie('token');
    $.when(sys.CallAjaxPostasync(apiCustomer + '/price/GetListService', lading, token)).done(function (data) {
        if (data.isSuccess) {
            $.each(data.data, function (key, value) {
                html += "<option value='" + value.id + "' data-price='" + value.price + "'>" + value.name + "</option>";
            });
            _this.$Service.html(html);
            _this.$Service.chosen();
            _this.$Service.trigger("chosen:updated");

            //_this.$Service.val(_serverId);
            //_this.$Service.trigger("chosen:updated");
            calculator();
        }
    });
}

function DeleteLading(id) {
    _this.$shipmentId = id;
    $.createDialog({
        attachAfter: '.message-dialog',
        title: 'Bạn chắc muốn hủy vận đơn này?',
        accept: 'Xác nhận',
        refuse: 'Không',
        acceptStyle: 'red',
        refuseStyle: 'gray',
        acceptAction: deleteShipment
    });
    $.showDialog();
    //sys.ConfirmDialog('Xác nhận', 'Bạn chắc muốn hủy vận đơn này?', function () {
    //    $.when(sys.CallAjaxPost(apiCustomer + '/shipment/delete', { id: id }, token)).done(function (data) {
    //        if (data) {
    //            $(".success").html('Đã hủy đơn hàng thành công').slideDown(1000).delay(5000).slideUp('slow');
    //            $('.btn-search').click();
    //        } else {
    //            sys.ErrorAlert("Hủy đơn hàng thất bại, vui lòng kiểm trả lại.");
    //        }
    //    });
    //});
}
function deleteShipment() {
    $(".success").stop().slideDown();
    $.when(sys.CallAjaxPost(apiCustomer + '/shipment/delete', { id: _this.$shipmentId }, token)).done(function (data) {
        if (data) {
            $(".success").html('Đã hủy đơn hàng thành công').slideDown(500).delay(3000).slideUp();
            //$('.btn-search').click();
            dtReport.ajax.reload();
        } else {
            $(".message_error").stop().slideDown(); 
            $(".message_error").html('Hủy đơn hàng thất bại, vui lòng kiểm tra lại.').slideDown(500).delay(3000).slideUp();
        }
    });
}


function GetLadingPriceModel(value) {
    var lading = new Object();
    //
    lading.SenderId = $.cookie('userId');
    if (districtSenderId) {
        lading.FromDistrictId = districtSenderId;
    } else {
        lading.FromDistrictId = value.fromDistrictId ? value.fromDistrictId : value.$FromDistrict;
    }
    if (value.$Weight) {
        lading.Weight = value.$Weight.val();
    } else {
        lading.Weight = value.weight
    }
    lading.FromWardId = value.fromWardId ? value.fromWardId : value.$FromWard.val();
    lading.ToDistrictId = value.toDistrictId ? value.toDistrictId : value.$ToDistrict.val();

    if (lading.Weight == null || lading.Weight == '' || lading.Weight == 0) {
        lading.Weight = 1;
    }
    //price
    return lading;
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
                html += "<option value='" + value.id + "'>" + value.name + "</option>";
            });
            $("select.toProvince").html(html);
            $("select.toProvince").chosen();
            $("select.toProvince").trigger("chosen:updated");
        }
    });
}
async function _LoadDistrictByProvince(provinceId) {
    var html = "<option value=''>Chọn quận huyện</option>";
    var token = $.cookie('token');
    await $.when(sys.CallAjaxasync(apiCustomer + '/district/GetDistrictByProvince?provinceId=' + provinceId,
        null,
        token
    )).done(function (data) {
        if (data.isSuccess) {
            const results = data.data.sort((x, y) => sys.BoDauTiengViet(y.name) > sys.BoDauTiengViet(x.name) ? -1 : 1);
            $.each(results, function (key, value) {
                html += "<option value='" + value.id + "'>" + value.name + "</option>";
            });
        }
        $("select.toDistrict").html(html);
        $("select.toDistrict").chosen();
        $("select.toDistrict").trigger("chosen:updated");
    });
}
async function _LoadWardByDistrict(districtId) {
    var html = "<option value=''>Chọn phường xã</option>";
    var token = $.cookie('token');
    await $.when(sys.CallAjaxasync(apiCustomer + '/ward/GetWardByDistrict?districtId=' + districtId,
        null,
        token
    )).done(function (data) {
        if (data.isSuccess) {
            const results = data.data.sort((x, y) => sys.BoDauTiengViet(y.name) > sys.BoDauTiengViet(x.name) ? -1 : 1);
            $.each(results, function (key, value) {
                html += "<option value='" + value.id + "'>" + value.name + "</option>";
            });
        }
        $("select.toWard").html(html);
        $("select.toWard").chosen();
        $("select.toWard").trigger("chosen:updated");
    });
}
function _LoadStructure() {
    var html = "";
    var token = $.cookie('token');
    $.when(sys.CallAjaxasync(apiPost + '/Structure/GetAll', null, token)).done(function (data) {
        if (data.isSuccess) {
            $.each(data.data, function (key, value) {
                html += "<option value='" + value.id + "' data-name='" + value.name + "'>" + value.name + "</option>";
            });
            $("select.structure").html(html);
            $("select.structure").chosen();
            $("select.structure").trigger("chosen:updated");
        }
    });
}

function getInfoHubRouting(districtId, weight, _this) {
    if (districtId) {
        $.when(sys.CallAjaxasync(apiCore + '/Hub/GetInfoHubRouting', { districtId: districtId, weight: weight }, null)).done(function (data) {
            if (data.isSuccess && data.data != null) {
                var hub = data.data;
                _this.toHubId = hub.hubId;
                _this.toHubRoutingId = hub.hubRoutingId;
            }
        });
    }
}