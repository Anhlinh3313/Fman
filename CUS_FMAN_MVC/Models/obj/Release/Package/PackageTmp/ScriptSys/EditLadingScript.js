
var _this = this;

_this.index = 0;
_this.$template = $('.extend-container');
_this.$plcholder = $('.lading-list');
_this.$LadingId = null;
_this.$CusNameFrom = null;
_this.$PhoneFrom = null;
_this.$AddressFrom = null;
_this.$CompanyFrom = null;
_this.$CusNameTo = null;
_this.$PhoneTo = null;
_this.$AddressTo = null;
_this.$AddressNoteTo = null;
_this.$CompanyTo = null;

_this.$ToProvice = null;
_this.$ToDistrict = null;
_this.$ToWard = null;
_this.$ToPoHub = null;

_this.$FromProvice = null;
_this.$FromDistrict = null;
_this.$FromWard = null;
_this.$FromPoHub = null;

_this.CityId = null;
_this.DistrictId = null;
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

var _serverId = 0;
window.count = 0;
var ladingNumber = 0;
var ladings = [];
var latFrom = 0;
var lngFrom = 0;
var districtSenderId = $("#sender").data("district-id");
var citySenderId = $("#sender").data("city-id");
var firstLoad = true;
_this.$el = null;
var oject = {};
$(document).ready(function () {

    _LoadPayment();
    _LoadServiceGT();
    _LoadTypePack();

    initMapFrom();
    $("#ladingFrom").validationEngine('attach', {
        'custom_error_messages': {
            '.sender-name': {
                'required': {
                    'message': "* Ho tên người gửi không được bỏ trống!"

                }
            }, '.sender-phone': {
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
                'required': {
                    'message': "* COD không được để trống!"
                },
                'min': {
                    'message': "* COD phải lớn hơn 0!"
                }
            },
            '.insured': {
                'required': {
                    'message': "* Khai giá không được để trống!"
                },
                'min': {
                    'message': "* Khai giá phải lớn hơn 0!"
                }
            }
        },
        promptPosition: "inline"
    });

    $(".bt-update").on("click", function () {
        sys.Loading();
        var token = $.cookie('token');
        if ($('#ladingFrom').validationEngine('validate')) {
            //var ladingModel = GetLadingModel(_this);
            var ladingModel = oject;
            ladingModel.toProvinceId = _this.$ToProvice.val();
            ladingModel.toDistrictId = _this.$ToDistrict.val();
            ladingModel.toWardId = _this.$ToWard.val();
            ladingModel.toHubId = _this.$ToPoHub.val();
            ladingModel.DistrictTo = _this.$ToDistrict.val();

            ladingModel.fromProvinceId = _this.$FromProvice.val();
            ladingModel.fromDistrictId = _this.$FromDistrict.val();
            ladingModel.fromWardId = _this.$FromWard.val();
            ladingModel.fromHubId = _this.$FromPoHub.val();

            ladingModel.orderDate = _this.$OrderDate.val();
            ladingModel.senderId = $.cookie('userId');
            ladingModel.shipmentStatusId = _this.$Status.val();
            ladingModel.shipmentNumber = _this.$ShipmentNumber.val();

            ladingModel.Id = ladingModel.Id;
            ladingModel.pickingAddress = ladingModel.AddressFrom = $(".sender-address").val();
            ladingModel.SenderName = ladingModel.NameFrom = $(".sender-name").val();
            ladingModel.SenderPhone = ladingModel.PhoneFrom = $(".sender-phone").val();
            ladingModel.SenderCompany = ladingModel.CompanyFrom = $(".sender-company").val();
            ladingModel.CitySendId = citySenderId;
            ladingModel.LatFrom = latFrom;
            ladingModel.LngFrom = lngFrom;
            ladingModel.LatTo = _this.Lat;
            ladingModel.LngTo = _this.Lng;
            ladingModel.Weight = _this.$Weight.val();
            ladingModel.totalBox = _this.$Number.val();
            ladingModel.Noted = _this.$Noted.val();

            ladingModel.shippingAddress = _this.$AddressTo.val();
            ladingModel.receiverName = _this.$CusNameTo.val();
            ladingModel.receiverPhone = _this.$PhoneTo.val();
            ladingModel.CompanyTo = _this.$CompanyTo.val();
            ladingModel.CityRecipientId = _this.CityId;
            ladingModel.DistrictTo = _this.DistrictId;
            ladingModel.Description = _this.$Description.val();
            ladingModel.ServiceId = _this.$Service.find("option:selected").val();
            ladingModel.paymentTypeId = _this.$Payment.find("option:selected").val();

            ladingModel.AnotherServiceId = [];
            _this.$ServiceDVGT.find("option:selected").each(function () {
                switch ($(this).val()) {
                    case "40":
                        ladingModel.COD = _this.$CODDiv.find(".cod").val().replace(/\./g, '');
                        ladingModel.CODPrice = _this.$CODDiv.find(".cod-price").val().replace(/\./g, '');
                        break;
                    case "41":
                        ladingModel.PackId = _this.$DGHHDiv.find(".pack-type option:selected").val();
                        ladingModel.PackPrice = _this.$DGHHDiv.find(".pack-price").val().replace(/\./g, '');
                        break;
                    case "42":
                        ladingModel.Insured = _this.$BHHHDiv.find(".insured").val().replace(/\./g, '');
                        ladingModel.InsuredPrice = _this.$BHHHDiv.find(".insured-price").val().replace(/\./g, '');
                        break;
                }
                lading.AnotherServiceId.push({
                    ServiceId: $(this).val(),
                    ServiceCode: $(this).text()
                });
            });
            //price
            ladingModel.PriceMain = _this.$PriceMain.val().replace(/\./g, '');
            ladingModel.PPXDPercent = _this.$PPXD.val().replace(/\./g, '');
            ladingModel.PriceFar = _this.$VSVX.val().replace(/\./g, '');
            ladingModel.TotalPriceDVGT = _this.$DVGTPrice.val().replace(/\./g, '');
            ladingModel.PriceVAT = 0;
            ladingModel.PriceOther = 0;
            ladingModel.defaultPrice = _this.$Amount.val().replace(/\./g, '');
            if (ladingModel) {
                $.when(sys.CallAjaxPostasync(apiCustomer + "/shipment/update", ladingModel, token)).done(function (data) {
                    if (data.isSuccess) {
                        $(".success").html('Chỉnh sửa thông tin đơn hàng thành công').slideDown(1000).delay(5000).slideUp('slow');
                        //$('.bt-close').click();
                        //$('.btn-search').click();
                        sys.HideLoading();
                    } else {
                        $(".error").html("Lỗi trong quá trình chỉnh sửa thông tin đơn hàng!").show();
                        sys.HideLoading();
                    }
                });
            } else {
                $(".error").html("Không có đơn hàng để chỉnh sửa!").slideDown(1000).delay(3000).slideUp(2000);
                sys.HideLoading();
                return false;
            }
            sys.HideLoading();
            return false;
        } else {
            $(".error").html("Thông tin đơn hàng chưa đúng, vui lòng kiểm tra lại!").slideDown(1000).delay(3000).slideUp(2000);
            sys.HideLoading();
        }
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

    _this.$ToProvice = _this.$el.find('.toProvince');
    _this.$ToDistrict = _this.$el.find('.toDistrict');
    _this.$ToWard = _this.$el.find('.toWard');
    _this.$ToPoHub = _this.$el.find('.toPoHub');

    _this.$FromProvice = _this.$el.find('.fromProvince');
    _this.$FromDistrict = _this.$el.find('.fromDistrict');
    _this.$FromWard = _this.$el.find('.fromWard');
    _this.$FromPoHub = _this.$el.find('.fromPoHub');

    _this.$OrderDate = _this.$el.find('.orderdate');
    _this.$Status = _this.$el.find('.shipmentStatus');

    _this.$CompanyTo = _this.$el.find('.receiver-company');

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
    _this.$CODPrice = _this.$el.find('.cod-price');
    _this.$Noted = _this.$el.find('.noted');
    _this.$Description = _this.$el.find('.description');

    _this.$pack_type = _this.$el.find('.pack-type');
    _this.$pack_type.chosen();
    _this.$Weight = _this.$el.find('.weight');
    _this.$Weight.attr('id', 'weight');
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
    //
    _this.$clickPrice.on('click', checkHidePrice);
    _this.$ServiceDVGT.on('change', serviceGTChange);
    // _this.$AddressTo.on('change', addressChange);
    $(".sender-address").add(_this.$AddressTo).add(_this.$BHHHDiv.find(".insured")).add(_this.$DGHHDiv.find(".pack-type"))
        .add(_this.$CODDiv.find(".cod")).add(_this.$Weight).add(_this.$Height).add(_this.$Width)
        .add(_this.$Length).add(_this.$Number).add(_this.$Service).add(_this.$ServiceDVGT).on("change", calculator);
    initMap();
    function checkHidePrice() {
        if (_this.$el.find('.hide-price').hasClass('display-none')) {
            _this.$el.find('.hide-price').removeClass('display-none');
        } else {
            _this.$el.find('.hide-price').addClass('display-none');
        }
    }


});
function GetLadingModel(value) {
    var lading = new Object();
    lading.Id = value.$LadingId.val();
    lading.pickingAddress = lading.AddressFrom = $(".sender-address").val();
    lading.SenderName = lading.NameFrom = $(".sender-name").val();
    lading.SenderPhone = lading.PhoneFrom = $(".sender-phone").val();
    lading.SenderCompany = lading.CompanyFrom = $(".sender-company").val();
    lading.CitySendId = citySenderId;
    lading.DistrictFrom = districtSenderId;
    lading.LatFrom = latFrom;
    lading.LngFrom = lngFrom;

    lading.shippingAddress = value.$AddressTo.val();
    lading.receiverName = value.$CusNameTo.val();
    lading.receiverPhone = value.$PhoneTo.val();
    lading.CompanyTo = value.$CompanyTo.val();
    lading.CityRecipientId = value.CityId;
    lading.DistrictTo = value.DistrictId;

    lading.shippingAddress = value.$AddressTo.val();
    lading.AdressNoteTo = value.$AddressNoteTo.val();
    lading.receiverName = value.$CusNameTo.val();
    lading.receiverPhone = value.$PhoneTo.val();
    lading.CompanyTo = value.$CompanyTo.val();
    lading.LatTo = value.Lat;
    lading.LngTo = value.Lng;
    lading.Weight = value.$Weight.val();
    lading.Width = value.$Width.val();
    lading.Height = value.$Height.val();
    lading.Length = value.$Length.val();
    lading.Number = value.$Number.val();
    lading.Noted = value.$Noted.val();
    lading.Description = value.$Description.val();
    lading.ServiceId = value.$Service.find("option:selected").val();
    lading.PaymentId = value.$Payment.find("option:selected").val();
    lading.AnotherServiceId = [];
    value.$ServiceDVGT.find("option:selected").each(function () {
        switch ($(this).val()) {
            case "40":
                lading.COD = value.$CODDiv.find(".cod").val().replace(/\./g, '');
                lading.CODPrice = value.$CODDiv.find(".cod-price").val().replace(/\./g, '');
                break;
            case "41":
                lading.PackId = value.$DGHHDiv.find(".pack-type option:selected").val();
                lading.PackPrice = value.$DGHHDiv.find(".pack-price").val().replace(/\./g, '');
                break;
            case "42":
                lading.Insured = value.$BHHHDiv.find(".insured").val().replace(/\./g, '');
                lading.InsuredPrice = value.$BHHHDiv.find(".insured-price").val().replace(/\./g, '');
                break;
        }
        lading.AnotherServiceId.push({
            ServiceId: $(this).val(),
            ServiceCode: $(this).text()
        });
    });
    //price
    lading.PriceMain = value.$PriceMain.val().replace(/\./g, '');
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
            case "40":
                if ($(this).is(":selected")) {
                    _this.$CODDiv.show();
                } else {
                    _this.$CODDiv.hide()
                }
                break;
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
    if (_this.DistrictId && _this.CityId && citySenderId && districtSenderId) {
        var $lading = $.grep(ladings, function (e) { return e.index == _this.index });
        var lading = GetLadingModel($lading[0]);
        var token = $.cookie('token');
        $.when(sys.CallAjaxPostasync(apiCustomer + "/price/Calculate", lading, token)).done(function (data) {
            if (data !== null) {
                _this.$PriceMain.val(formatMoney(data.PriceMain, 0));
                _this.$OtherPrice.val(data.PriceOther);
                _this.$PPXD.val(formatMoney(data.PPXDPrice, 0));
                _this.$VSVX.val(formatMoney(data.PriceFar, 0));
                _this.$VAT.val(data.VAT);
                _this.$DVGTPrice.val(formatMoney(data.TotalDVGT, 0));
                _this.$Amount.val(formatMoney(data.Amount, 0));
                _this.$CODDiv.find(".cod-price").val(formatMoney(data.CODPrice, 0));
                _this.$BHHHDiv.find(".insured-price").val(formatMoney(data.InsuredPrice, 0));
                _this.$DGHHDiv.find(".pack-price").val(formatMoney(data.PackPrice, 0));
                data.StructureName;

            }
        });
    }
}
function initMap() {
    var options = {
        componentRestrictions: { 'country': ['vi', 'vn'] }
    };
    var input = document.getElementById($('.receiver-address').attr("id"));

    var autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            window.alert("Không tìm thấy thông tin địa chỉ: '" + place.name + "'");
            return;
        } else {
            _loadAddressTo(place.formatted_address);
        };
    });
}
function _loadAddressTo(address) {
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
            address: address
        },
        dataType: 'json',
        success: function (data, textStatus) {
            //console.log(data.results[0].address_components);
            var address = data.results[0];
            if (!data.results[0] || !data.results[0].geometry) {
                window.alert("Không tìm thấy thông tin địa chỉ: '" + address + "'");
                return;
            }
            var locationTo = data.results[0].geometry.location;
            _this.Lat = locationTo.lat;
            _this.Lng = locationTo.lng;

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
                            _LoadService(oject, _this);
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
        , async: false
    });
}
function _LoadService(value, _this) {
    var lading = GetLadingPriceModel(value);
    var html = "";
    var token = $.cookie('token');
    $.when(sys.CallAjaxPostasync(apiCustomer + '/price/GetListService', lading, token)).done(function (data) {
        if (data.isSuccess) {
            if (data.data.length > 0) {
                $.each(data.data, function (key, value) {
                    html += "<option value='" + value.id + "'>" + value.name + "</option>";
                });

            }
        }
            _this.$Service.html(html);
            _this.$Service.chosen();
            _this.$Service.trigger("chosen:updated");
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
function _LoadPayment() {
    var html = "";
    var token = $.cookie('token');
    $.when(sys.CallAjaxasync(apiCustomer + '/paymentType/getAll', null, token)).done(function (data) {
        if (data.isSuccess) {
            html += "";
            $.each(data.data, function (key, value) {
                html += "<option data='" + value.code + "' value='" + value.id + "'>" + value.name + "</option>";
            });
            $("select.servicedvgt").html(html);
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
            address: addressFrom
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
//function ViewEdit(ladingId) {
//    $('.btn-edit').click();
//    $.when(sys.CallAjaxasync('/Lading/GetLadingDetail', { id: ladingId })).done(function (data) {
//        if (data !== null) {
//            //
//            _this.$LadingId.val(data.Id);
//            _this.$CusNameFrom.val(data.NameFrom);
//            _this.$PhoneFrom.val(data.PhoneFrom);
//            _this.$AddressFrom.val(data.AddressFrom);
//            LoadSenderForm(_this.$AddressFrom.val());
//            _this.$CompanyFrom.val(data.CompanyFrom);
//            _this.$CusNameTo.val(data.NameTo);
//            _this.$PhoneTo.val(data.PhoneTo);
//            _this.$AddressTo.val(data.AddressTo);
//            _loadAddressTo(_this.$AddressTo.val());
//            _this.$AddressNoteTo.val(data.AdressNoteTo);
//            _this.$Weight.val(data.Weight);
//            _this.$Number.val(data.Number);
//            _this.$Service.val(data.ServiceId);
//            _this.$Service.trigger("chosen:updated");
//            _this.$Description.val(data.Description);
//            _this.$Noted.val(data.Noted);
//            _this.$Payment.val(data.PaymentType);
//            _this.$Payment.trigger("chosen:updated");
//            _this.$PriceMain.val(formatMoney(data.PriceMain, 0));
//            _this.$PPXD.val(formatMoney(data.PPXDPercent, 0));
//            _this.$VSVX.val(formatMoney(data.PriceFar, 0));
//            _this.$OtherPrice.val(formatMoney(data.PriceOther, 0));
//            _this.$DVGTPrice.val(formatMoney(data.TotalPriceDVGT, 0));
//            _this.$Amount.val(formatMoney(data.Amount, 0));
//            //
//            var arrayDVGT = [];
//            $.each(data.AnotherServiceId, function (index, value) {
//                arrayDVGT.push(value.ServiceId);
//            });
//            _this.$ServiceDVGT.val(arrayDVGT);
//            _this.$ServiceDVGT.multiselect('refresh');
//            serviceGTChange();
//            _this.$BHHH.val(formatMoney(data.Insured, 0));
//            _this.$BHHHPrice.val(formatMoney(data.InsuredPrice, 0));
//            _this.$DGHH.val(data.PackId);
//            _this.$DGHH.trigger("chosen:updated");
//            _this.$DGHHPrice.val(formatMoney(data.PackPrice, 0));
//            _this.$COD.val(formatMoney(data.COD, 0));
//            _this.$CODPrice.val(formatMoney(data.CODPrice, 0));
//        }
//    });
//}
function ViewEdit(shipmentNumber) {
    $('.btn-edit').click();
    var cols = 'Service,Structure,ShipmentStatus,FromHub,ToHub,ShipmentServiceDVGTs,PaymentType';
    $.when(sys.CallAjaxasync(apiCustomer + '/shipment/tracking', { shipmentNumber: shipmentNumber, cols: cols })).done(function (data) {
        if (data.isSuccess) {
            //
            oject = data.data;
            _LoadService(data.data, _this);

            _this.$LadingId.val(data.data.id);
            _this.$CusNameFrom.val(data.data.senderName);
            _this.$PhoneFrom.val(data.data.senderPhone);
            _this.$AddressFrom.val(data.data.pickingAddress);
            LoadSenderForm(_this.$AddressFrom.val());
            _this.$CompanyFrom.val(data.data.companyFrom);
            _this.$CusNameTo.val(data.data.receiverName);
            _this.$PhoneTo.val(data.data.receiverPhone);
            _this.$AddressTo.val(data.data.shippingAddress);
            _loadAddressTo(_this.$AddressTo.val());

            _this.$ToProvice.val(data.data.toProvinceId);
            _this.$ToDistrict.val(data.data.toDistrictId);
            _this.$ToWard.val(data.data.toWardId);
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
            _this.$Number.val(data.data.totalBox);
            _this.$Service.val(data.data.serviceId);
            _this.$Service.trigger("chosen:updated");
            _this.$Description.val(data.data.shipmentStatus.description);
            _this.$Noted.val(data.data.note);
            _this.$Payment.val(data.data.paymentTypeId);
            _this.$Payment.trigger("chosen:updated");
            _this.$PriceMain.val(formatMoney(data.data.defaultPrice, 0));
            _this.$PPXD.val(formatMoney(data.data.fuelPrice, 0));
            _this.$VSVX.val(formatMoney(data.data.PriceFar, 0));
            _this.$OtherPrice.val(formatMoney(data.data.PriceOther, 0));
            _this.$DVGTPrice.val(formatMoney(data.data.vatPrice, 0));
            _this.$Amount.val(formatMoney(data.data.totalPrice, 0));
            //
            var arrayDVGT = [];
            if (data.data.shipmentServiceDVGTs != null) {
                $.each(data.data.shipmentServiceDVGTs, function (index, value) {
                    arrayDVGT.push(value.ServiceId);
                });
                _this.$ServiceDVGT.val(arrayDVGT);
            }
            _this.$ServiceDVGT.multiselect('refresh');
            serviceGTChange();
            _this.$BHHH.val(formatMoney(data.data.insured, 0));
            _this.$BHHHPrice.val(formatMoney(data.data.InsuredPrice, 0));
            _this.$DGHH.val(data.data.PackId);
            _this.$DGHH.trigger("chosen:updated");
            _this.$DGHHPrice.val(formatMoney(data.data.PackPrice, 0));
            _this.$COD.val(formatMoney(data.data.COD, 0));
            _this.$CODPrice.val(formatMoney(data.data.CODPrice, 0));
        } else {
            sys.Alert("Thông báo", "Không tìm thấy thông tin mã vận đơn: " + shipmentNumber, 'Kiểm tra lại')
        }
    });
}
function DeleteLading(id) {
    sys.ConfirmDialog('Xác nhận', 'Bạn chắc muốn hủy vận đơn này?', function () {
        $.when(sys.CallAjaxPost(apiCustomer + '/shipment/delete', { id: id }, token)).done(function (data) {
            if (data) {
                $(".success").html('Đã hủy đơn hàng thành công').slideDown(1000).delay(5000).slideUp('slow');
                $('.btn-search').click();
            } else {
                sys.ErrorAlert("Hủy đơn hàng thất bại, vui lòng kiểm trả lại.");
            }
        });
    });
}
function GetLadingPriceModel(value) {
    var lading = new Object();
    //
    lading.SenderId = $.cookie('userId');
    if (districtSenderId != undefined) {
        lading.FromDistrictId = districtSenderId;
    } else {
        lading.FromDistrictId = value.fromDistrictId;
    }
    if (value.DistrictId != undefined) {
        lading.ToDistrictId = value.DistrictId;
    } else {
        lading.ToDistrictId = value.toDistrictId;
    }
    if (value.$Weight != undefined) {
        lading.Weight = value.$Weight.val();
    } else {
        lading.Weight = value.weight
    }

    if (lading.Weight == null || lading.Weight == '' || lading.Weight == 0) {
        lading.Weight = 50;
    }
    //price
    return lading;
}