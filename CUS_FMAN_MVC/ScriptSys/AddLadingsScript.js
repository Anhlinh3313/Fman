var dtBoxModal;
var databoxs = [];
var listLaingIds = [];

var latFrom = 0;
var lngFrom = 0;
var senderId = 0;
var hubSenderId = 0;
var hubRoutingId = 0;
var wardSenderId = 0;
var districtSenderId = 0;
var citySenderId = 0;
var customerTypeId = 0;
var paymentTypeId = 0;
var senderName, senderPhone, senderAddress, senderCompany;
//
var dimNumClone = 0;
var dataReceiverPhoneInfo;
//
var dataOptions = [];
var priceDVGTs = [];
//
var dataSerivce;
var dataDVGT;
//
var boxDataTable;
var dataBoxDataTable = [];
//
var token = $.cookie('token');
//
var calculator;
autocompleteItems = [];
var requestShipment = {}
var listLaingId = [];

$(document).ready(function () {
    var sessionToken = new google.maps.places.AutocompleteSessionToken();
    boxDataTable = $('#box-data').DataTable({
        paging: false,
        ordering: false,
        select: false,
        bFilter: false,
        pagingType: false,
        "info": false,
        'lengthMenu': [[5, 10, 20, 100000000], [5, 10, 20, 'Tất cả']],
        'language': {
            'lengthMenu': 'Hiển thị: _MENU_ ',
            'loadingRecords': 'Loading Shipment',
            'emptyTable': 'Chưa có kiện hàng!',
            'paginate': {
                'previous': 'Trở lại', 'next': 'Tiếp theo'
            }
        },
        columns: [
            { data: 'ID' },
            { data: 'Length' },
            { data: 'Width' },
            { data: 'Height' },
            { data: 'Weight' },
            { data: 'ExcWeight' },
        ],
        columnDefs: [{
            'targets': 0,
            'render': function (data, type, full, meta) {
                var htmlButton = ''
                htmlButton += ' <button type="button" class="btn btn-xs btn-danger" onclick="removeBox($(this))">Xóa</button>'
                return htmlButton
            }
        }],
        fixedHeader: {
            footer: true
        }
    });
    //
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

    _LoadServiceGT();
    _LoadTypePack();

    _LoadProvince();
    //LoadSenderForm($("#sender-address").val());

    $("#ladingFrom").validationEngine('attach', {
        'custom_error_messages': {
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
        },
        promptPosition: "inline"
    });
    //
    $("#clear-lading").on("click", function () {
        $(".lading-list").empty()
        $('#add-more').trigger('click');
    })
    //
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
        _this.$ListPhoneTo = null;
        _this.$ShopCode = null;
        _this.$AddressTo = null;
        _this.$AddressGoogle = null;
        _this.$AddressNoteTo = null;
        _this.$CompanyTo = null;
        _this.CityId = 0;
        _this.CityName = "";
        _this.DistrictId = 0;
        _this.DistrictName = "";
        _this.WardId = 0;
        _this.WardName = "";
        _this.HubId = 0;
        _this.HubRoutingId = 0;
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
        _this.$TotalBox = null;
        _this.$Height = null;
        _this.$Length = null;
        _this.$Width = null;
        _this.$Number = null;//Số kiện
        _this.$Mass = null;//Khối lượng quy đổi
        _this.Lat = 0;
        _this.Lng = 0;
        _this.$CalWeight = null;
        _this.$ExcWeight = null;
        _this.$Dim = null;
        _this.$PriceMain = null;
        _this.$DefaultPriceP = null;
        _this.$DefaultPriceS = null;
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
            _this.$PhoneTo.attr('id', 'phoneto_' + 1);
            _this.$PhoneTo.attr('list', 'my-receiver-phone_' + 1);
            _this.$ListPhoneTo = _this.$el.find('.my-receiver-phone');
            _this.$ListPhoneTo.attr('id', 'my-receiver-phone_' + index);

            _this.$ShopCode = _this.$el.find('.shop-code');
            _this.$ShopCode.attr('id', 'shopcode_' + index);
            _this.$AddressTo = _this.$el.find('.receiver-address');
            _this.$AddressNoteTo = _this.$el.find('.receiver-address-note');
            _this.$AddressTo.attr("id", "autocomplete_" + index);

            _this.$AddressGoogle = _this.$el.find('.address-google-pac-container');
            _this.$AddressGoogle.attr("id", "address_autocomplete_" + index);

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
            //
            _this.$CalWeight = _this.$el.find('.exc-weight');
            _this.$CalWeight.attr('id', 'calWeight_' + index);
            _this.$ExcWeight = _this.$el.find('.exc-weight');
            _this.$ExcWeight.attr('id', 'excWeight_' + index);
            _this.$Weight = _this.$el.find('.weight');
            _this.$Weight.attr('id', 'weight_' + index);
            _this.$TotalBox = _this.$el.find('.total-box');
            _this.$TotalBox.attr('id', 'total-box_' + index);
            _this.$Width = _this.$el.find('.width-box');
            _this.$Width.attr('id', 'width_' + index);
            _this.$Height = _this.$el.find('.height-box');
            _this.$Height.attr('id', 'height_' + index);
            _this.$Length = _this.$el.find('.length-box');
            _this.$Length.attr('id', 'length_' + index);
            _this.$Number = _this.$el.find('.number');
            _this.$Mass = _this.$el.find('.mass');
            _this.$DVGTPrice = _this.$el.find('.dvgt-price');
            sys.formatNumber(_this.$DVGTPrice);
            _this.$PriceMain = _this.$el.find('.price-main');
            sys.formatNumber(_this.$PriceMain);
            _this.$DefaultPriceP = _this.$el.find('.default-priceP');
            sys.formatNumber(_this.$DefaultPriceP);
            _this.$DefaultPriceS = _this.$el.find('.default-priceS');
            sys.formatNumber(_this.$DefaultPriceS);
            //
            _this.$Dim = _this.$el.find('.dim');
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
            //
            loadInfo(_this);
            bindEvents();
            initMap(_this);
            _LoadStructure(_this);
            //select onchange
            _selectProvinceChange(_this);
            _selectDistrictChange(_this);
            _selectWardChange(_this);
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
            $('.add-lading').html("Tạo đơn hàng ");
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
        var calculatorCount = 0;
        calculator = function () {
            calculatorCount = 0;
            if (dataSerivce) {
                $.each(dataSerivce, function (key, value) {
                    if (_this.$Service.val() == value.id) {
                        $(".info-price-service").html(value.name);
                    }
                })
            }
            calculatorModel();
        }
        var calculatorModel = function () {
            if (_this.DistrictId && _this.CityId && citySenderId && districtSenderId && _this.$Weight.val()) {
                priceDVGTs = [];
                sys.Loading();
                var $lading = $.grep(ladings, function (e) { return e.index == _this.index });
                var lading = GetCalculatorModel($lading[0]);
                $.when(sys.CallAjaxPostasync(apiCustomer + "/price/Calculate", lading, token)).done(function (data) {
                    if (data.isSuccess) {
                        var result = data.data;
                        // _this.$CalWeight.val(result.calWeight);

                        _this.$Amount.val(formatMoney(result.totalPrice, 0));
                        $(".info-price-totalPrice").html(formatMoney(result.totalPrice, 0));
                        _this.$PriceMain.val(formatMoney(result.defaultPrice, 0));
                        $(".info-price-defaultPrice").html(formatMoney(result.defaultPrice, 0));
                        _this.$DefaultPriceP.val(formatMoney(result.defaultPriceP, 0));
                        _this.$DefaultPriceS.val(formatMoney(result.defaultPriceS, 0));
                        _this.$OtherPrice.val(result.otherPrice);
                        _this.$PPXD.val(formatMoney(result.fuelPrice, 0));
                        $(".info-price-fuelPrice").html(formatMoney(result.fuelPrice, 0));
                        _this.$VSVX.val(formatMoney(result.remoteAreasPrice, 0));
                        $(".info-price-remoteAreasPrice").html(formatMoney(result.remoteAreasPrice, 0));
                        _this.$VAT.val(result.vatPrice);
                        _this.$DVGTPrice.val(formatMoney(result.totalDVGT, 0));
                        $(".info-price-totalDVGT").html(formatMoney(result.totalDVGT, 0));
                        _this.$CODDiv.find(".cod-price").val(formatMoney(result.priceCOD, 0));
                        $(".info-price-codPrice").html(formatMoney(result.priceCOD, 0));
                        priceDVGTs = result.priceDVGTs;
                        dimNumClone = result.dim;
                        if (!(dataBoxDataTable.length > 1)) {
                            //    $(".exc-weight").val(Number(_this.$Length.val()) * Number(_this.$Width.val()) * Number(_this.$Height.val()) * dimNumClone);
                        }
                        if (result.priceDVGTs.length == 0) {
                            _this.$BHHHDiv.find(".insured-price").val(0);
                        }
                        result.priceDVGTs.forEach(function (item, x) {
                            if (item.code == "BHHH") {
                                _this.$BHHHDiv.find(".insured-price").val(formatMoney(item.totalPrice, 0));
                            }
                        });
                        sys.HideLoading();
                    } else {
                        setPriceCalculatorModel(_this)
                    }
                });
            } else {
                setPriceCalculatorModel(_this)
            }
            
        }
        function setPriceCalculatorModel(_this) {
            _this.$ExcWeight.val(0);
            _this.$Amount.val(0);
            $(".info-price-totalPrice").html(0);
            _this.$PriceMain.val(0);
            $(".info-price-defaultPrice").html(0);
            _this.$DefaultPriceP.val(0);
            _this.$DefaultPriceS.val(0);
            _this.$OtherPrice.val(0);
            _this.$PPXD.val(0);
            $(".info-price-fuelPrice").html(0);
            _this.$VSVX.val(0);
            $(".info-price-remoteAreasPrice").html(0);
            _this.$VAT.val(0);
            _this.$DVGTPrice.val(0);
            $(".info-price-totalDVGT").html(0);
            _this.$CODDiv.find(".cod-price").val(0);
            $(".info-price-codPrice").html(0);
            priceDVGTs = [];
        }
        //Change Select Address
        var _changeSelectAddress = function (_this) {
            var object = new Object();
            var data = JSON.stringify(_this.$CusAddressFromSelect.val());;
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

            //_LoadService(_this);
            calculatorModel()
        }
        //AddressChange
        function selectAddressGoogle(params) {
            _this.$AddressTo.val($(".address-description").val());
            var GMapHelper = {
                STREET_NUMBER: 'street_number',
                ROUTE: 'route',
                SUBLOCALITY_LEVEL_1: 'sublocality_level_1',
                SUBLOCALITY: 'sublocality',
                POLITICAL: 'political',
                LOCALITY: 'locality',
                ADMINISTRATIVE_AREA_LEVEL_3: 'administrative_area_level_3',
                ADMINISTRATIVE_AREA_LEVEL_2: 'administrative_area_level_2',
                ADMINISTRATIVE_AREA_LEVEL_1: 'administrative_area_level_1',
                COUNTRY: 'country',
            }
            var geocoder = new google.maps.Geocoder;
            geocoder.geocode({placeId: $("#address-place_id").val()}, (resultsAdress, status) => {
                if (status === 'OK' && resultsAdress[0]) {
                  const latlng = resultsAdress[0].geometry.location;
                  geocoder.geocode({location: latlng}, (resultsLatLng, statusLatLng) => {
                    if (status === 'OK' && resultsLatLng[0]) {
                        const results = resultsLatLng.find(f => f.types[0] === 'administrative_area_level_3');
                        let provinceName; let districtName; let wardName;
                        results.address_components.map(element => {
                            //
                            if (element.types.indexOf(GMapHelper.ADMINISTRATIVE_AREA_LEVEL_1) !== -1) {
                                provinceName = element.long_name;
                            } else if (element.types.indexOf(GMapHelper.ADMINISTRATIVE_AREA_LEVEL_2) !== -1) {
                                districtName = element.long_name;
                            } else if (element.types.indexOf(GMapHelper.LOCALITY) !== -1
                                && element.types.indexOf(GMapHelper.ADMINISTRATIVE_AREA_LEVEL_2) === -1) {
                                districtName = element.long_name;
                            } else if (element.types.indexOf(GMapHelper.ADMINISTRATIVE_AREA_LEVEL_3) !== -1) {
                                wardName = element.long_name;
                            } else if (element.types.indexOf(GMapHelper.SUBLOCALITY_LEVEL_1) !== -1) {
                                wardName = element.long_name;
                            }
                        });
                        $.when(sys.CallAjaxasync(apiCore + '/hub/GetInfoLocation', { provinceName: provinceName, districtName: districtName, wardName: wardName }, token)).done(function (dataInfoLocation) {
                            if (dataInfoLocation.isSuccess && dataInfoLocation.data != null) {
                                var infoLocation = dataInfoLocation.data;
                                _this.CityId = infoLocation.provinceId;
                                _this.$Province.val(infoLocation.provinceId).trigger("chosen:updated").trigger("change");
                                _this.DistrictId = infoLocation.districtId;
                                _this.$District.val(infoLocation.districtId).trigger("chosen:updated").trigger("change");
                                _this.WardId = infoLocation.wardId;
                                _this.$Ward.val(infoLocation.wardId).trigger("chosen:updated").trigger("change");
                                _this.HubId = infoLocation.hubId;
                                _this.Lat = results.geometry.location.lat();
                                _this.Lng = results.geometry.location.lng();

                                $.when(sys.CallAjaxasync(apiCore + '/Hub/GetInfoHubRouting', { districtId: _this.DistrictId }, null)).done(function (data) {
                                    if (data.isSuccess && data.data != null) {
                                        var hub = data.data;
                                        _this.HubId = hub.hubId;
                                        _this.HubRoutingId = hub.hubRoutingId;
                                    }
                                });
                            } else {

                            }
                        });
                    }
                  });
                }
            });
        }
        async function addressChange(_this) {
            // initMap(_this);
            // _this.$AddressGoogle.css("display", "none");
            // var options = {
            //     offset: 3,
            //     radius: 3000,
            //     componentRestrictions: { 'country': ['vi', 'vn'] }
            // };
            var input = document.getElementById(_this.$AddressTo.attr("id"));
            if (!input.value) {
                autocompleteItems = [];
                _this.$AddressGoogle.html('');
                _this.WardId = null;
                _this.$Ward.val(null).trigger("chosen:updated").trigger("change");
                _this.DistrictId = null;
                _this.$District.val(null).trigger("chosen:updated").trigger("change");
                _this.CityId = null;
                _this.$Province.val(null).trigger("chosen:updated").trigger("change");
                _this.HubId = null;
                _this.Lat = 0;
                _this.Lng = 0;
                _this.HubId = null;
                _this.HubRoutingId = null;
                calculator();
                return;
            }
            var autocomplete = new google.maps.places.AutocompleteService();
            autocomplete.getPlacePredictions({ input: input.value, componentRestrictions: {country: ['vi', 'vn']}, offset: 3, sessionToken: sessionToken}, 
            (predictions, status) => {
                autocompleteItems = [];
                var html = "";
                if (status == 'OK') {
                    predictions.forEach((prediction) => {
                        html += '<div class="address-google-pac-item pac-item" data-place_id="' + prediction.place_id + '" onclick="selectAddress($(this))"><i class="fa fa-map-pin" style="margin-right: 10px;color: #294da9;" aria-hidden="true"></i><span class="pac-item-query">' + prediction.description + '</span></div>';
                        html += '<hr class="address-hr">';
                    });
                    _this.$AddressGoogle.css("display", "block");
                    _this.$AddressGoogle.html(html);
                } else {
                    _this.$AddressGoogle.css("display", "none");
                }
            
            })
            // $.getJSON("https://maps.googleapis.com/maps/api/place/autocomplete/json",{
            //     input: input.value,
            //     sensor: false,
            //     types: 'establishment',
            //     location: '40.01496,-105.27029',
            //     radius: 10000,
            //     key: 'AIzaSyCfqPJqJnthPCSdgAs4pn1Gcc5RZrElg3U'
            // },function(places_response){
            //     //Some other code
            //     console.log(places_response);
            // });
        }
        var initMap = async function (_this) {
            console.log(sessionToken)
            _this.$AddressGoogle.css("display", "none");
            $('.address-google-pac-container-loading').css("display", "none");
            // var options = {
            //     componentRestrictions: { 'country': ['vi', 'vn'] }
            // };
            // var input = document.getElementById(_this.$AddressTo.attr("id"));

            // var autocomplete = new google.maps.places.Autocomplete(input, options);
            // autocomplete.addListener('place_changed', function () {
            //     var place = autocomplete.getPlace();
            //     if (!place.geometry) {
            //         return;
            //     } else {
            //         $.when(sys.CallAjaxasync(apiCore + '/hub/GetInfoLocationByAddress', { address: place.formatted_address }, token)).done(function (dataInfoLocation) {
            //             if (dataInfoLocation.isSuccess && dataInfoLocation.data != null) {
            //                 var infoLocation = dataInfoLocation.data;
            //                 _this.CityId = infoLocation.provinceId;
            //                 _this.$Province.val(infoLocation.provinceId).trigger("chosen:updated").trigger("change");
            //                 _this.DistrictId = infoLocation.districtId;
            //                 _this.$District.val(infoLocation.districtId).trigger("chosen:updated").trigger("change");
            //                 _this.WardId = infoLocation.wardId;
            //                 _this.$Ward.val(infoLocation.wardId).trigger("chosen:updated").trigger("change");
            //                 _this.HubId = infoLocation.hubId;
            //                 _this.Lat = place.geometry.location.lat();
            //                 _this.Lng = place.geometry.location.lng();
            //                 //_LoadService(_this);
            //                 console.log(infoLocation);

            //                 $.when(sys.CallAjaxasync(apiCore + '/Hub/GetInfoHubRouting', { districtId: _this.DistrictId }, null)).done(function (data) {
            //                     if (data.isSuccess && data.data != null) {
            //                         var hub = data.data;
            //                         _this.HubId = hub.hubId;
            //                         _this.HubRoutingId = hub.hubRoutingId;
            //                     }
            //                 });
            //             } else {

            //             }
            //         });
            //     };
            // });
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
                        provinceChange(_this);
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
                        districtChange(_this);
                        getInfoHubRouting(_this.DistrictId, 0, _this);
                        //_LoadService(_this);
                        calculatorModel()
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
                        // getHub(id, _this);
                        //_LoadService(_this);

                    }
                }
                // ladings.push(_this.HubId);
                // ladings.push(_this.WardId);
            });
        }
        var bindEvents = function () {
            _LoadService(_this);
            _LoadPayment(_this);
            _inputCODChange(_this);
            _inputBHHHChange(_this);
            _inputWeightChange(_this);
            checkNumber(_this);
            //
            SearchByPhoneNumber();
            loadNumber(_this);
            //
            _this.$clickPrice.on('click', checkHidePrice);
            _this.$remove.on('click', removeMe);
            _this.$remove_all.on('click', removeAll);
            //
            $(document).on('remove_item', removeListener);
            //
            _this.$AddressGoogle.click(function() {
                selectAddressGoogle(_this);
            })
            var timer;
            _this.$AddressTo.keydown(function () {
                $('.address-google-pac-container-loading').css("display", "block");
                clearTimeout(timer);
                timer = setTimeout(function (event) {
                    $('.address-google-pac-container-loading').css("display", "none");
                    addressChange(_this);
                }, 1500);
            });
            // _this.$AddressTo.keydown(function () {
            //     addressChange(_this);
            // }).focusout(function() {
            //     // $('.address-google-pac-container').css("display", "none");
            // })
            _this.$CusAddressFrom.on('change', function () {
                initMapFrom(_this)
            });
            _this.$CusAddressFromSelect.on('change', function () {
                _changeSelectAddress(_this)
            });
            _this.$CusAddressFrom.add(_this.$AddressTo).add(_this.$Structure).add(_this.$BHHHDiv.find(".insured")).add(_this.$DGHHDiv.find(".pack-type"))
                .add(_this.$CODDiv.find(".cod")).add(_this.$Weight).add(_this.$Height).add(_this.$Width)
                .add(_this.$Length).add(_this.$Number).add(_this.$Service).add(_this.$ServiceDVGT).add($(_this.$Ward)).on("change", calculator);
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
            _this.$Length.add(_this.$Height).add(_this.$Width).on("change", function () {
                if (_this.$Height.val() > 0 && _this.$Length.val() > 0 && _this.$Width.val() > 0) {
                    if (dataBoxDataTable.length == 0) {
                        dataBoxDataTable = [];
                        var dim = Number(_this.$Length.val()) * Number(_this.$Width.val()) * Number(_this.$Height.val()) * dimNumClone;
                        var totalWeight = 0;
                        var totalExcWeight = 0;
                        var totalCalWeight = 0;
                        boxDataTable.row.add({
                            'Length': Number(_this.$Length.val()) ? Number(_this.$Length.val()) : 0,
                            'Width': Number(_this.$Width.val()) ? Number(_this.$Width.val()) : 0,
                            'Height': Number(_this.$Height.val()) ? Number(_this.$Height.val()) : 0,
                            'Weight': Number(_this.$Weight.val()) ? Number(_this.$Weight.val()) : 0,
                            'ExcWeight': dimNumClone ? dim : Number(_this.$Weight.val()) ? Number(_this.$Weight.val()) : 0,
                            'CalWeight': Number(_this.$Weight.val()) > dim ? Number(_this.$Weight.val()) : dim,
                        }).draw(false);
                        for (let i = 0; i < boxDataTable.data().length; i++) {
                            dataBoxDataTable.push(boxDataTable.data()[i]);
                            totalWeight += boxDataTable.data()[i].Weight;
                            totalExcWeight += boxDataTable.data()[i].ExcWeight;
                            totalCalWeight += boxDataTable.data()[i].CalWeight;
                        }
                        $(".total-box").val(dataBoxDataTable.length);
                        $(".weight").val(totalWeight);
                        $(".exc-weight").val(totalExcWeight);
                        $(".total-weight").html(totalWeight);
                        $(".total-calweight").html(totalCalWeight);
                        $(".total-excWeight").html(totalExcWeight);
                        console.log(dataBoxDataTable);
                        calculator();
                    }
                }
                if (!(_this.$Height.val() > 0) && !(_this.$Length.val() > 0) && !(_this.$Width.val() > 0)) {
                    if (dataBoxDataTable.length > 0) {

                    }
                }
                if (dataBoxDataTable.length == 0) {
                    _this.$Length.attr('disabled', false);
                    _this.$Width.attr('disabled', false);
                    _this.$Height.attr('disabled', false);
                } else if (dataBoxDataTable.length > 0) {
                    _this.$Length.attr('disabled', true);
                    _this.$Width.attr('disabled', true);
                    _this.$Height.attr('disabled', true);
                }
            });
            _this.$ServiceDVGT.on("change", function () {
                var data = "";
                if (_this.$ServiceDVGT.val()) {
                    $.each(dataDVGT, function (key, value) {
                        $.each(_this.$ServiceDVGT.val(), function (x, y) {
                            if (y.toLocaleLowerCase() == value.code.toLocaleLowerCase()) {
                                if (x == 0) {
                                    data += value.name;
                                } else {
                                    data += ", " + value.name;
                                }
                            }
                        })

                        $(".info-price-shipmentDVGT").html(data);
                    })
                } else {
                    $(".info-price-shipmentDVGT").html("");
                }
            })
            //
            $("#phoneto_1").click(function () {
                $("#eac-container-phoneto_1 ul").css("display", "none");
            })
            //
            $("#phoneto_1").keyup(function (e) {
                if (_this.$PhoneTo.val().length >= 8 && _this.$PhoneTo.val().length <= 11) {
                    $("#eac-container-phoneto_1 ul").css("display", "block");
                } else {
                    $("#eac-container-phoneto_1 ul").css("display", "none");
                }
            })
            $("#phoneto_1").keydown(function (e) {
                if (_this.$PhoneTo.val().length >= 8 && _this.$PhoneTo.val().length <= 11) {
                    $("#eac-container-phoneto_1 ul").css("display", "block");
                    sys.Loading()
                    loadPhoneNumber(_this);
                } else {
                    $("#eac-container-phoneto_1 ul").css("display", "none");
                }
                // if (e.keyCode == 9 || e.keyCode == 13) {
                //     sys.Loading()
                //     loadPhoneNumber(_this);
                // }
            });
            //
            $(".info-price-list").click(function () {
                $(".btn-info-price-list").click();
            });

            $("#add-lading").on("click", function () {
                //$("#add-lading").attr("disabled", "disabled");
                //GetListPayment
                sys.Loading();
                var ladingModels = GetLadingModels();
                if (ladingModels != null || ladingModels.length > 0) {
                    console.log(ladingModels);
                    if (!validationParam(ladingModels)) {
                        sys.HideLoading();
                        return;
                    }
                    $.when(sys.CallAjaxPostasync(apiCustomer + "/shipment/Create", ladingModels, token)).done(function (data) {
                        if (data.isSuccess) {
                            sys.HideLoading();
                            $('.success').html('Tạo đơn hàng thành công! Mã yêu đơn hàng của của bạn là: ' + data.data.shipmentNumber + ".").slideDown(500).delay(15000).slideUp();
                            if (!data.data.requestShipmentId) {
                                sendRequest(data.data);
                            }
                        } else {
                            $(".error").html("Lỗi trong quá trình tạo đơn hàng!").show();
                            sys.HideLoading();
                        }
                    });
                    createOrUpdate(ladingModels);
                    loadNumber(_this);
                    if (ladingModels != null) {
                        ladings = [];
                        $(".lading-list").empty()
                        $('#add-more').trigger('click');
                        boxDataTable.row().remove().draw();
                        dataBoxDataTable = [];
                        $(".total-box").val(1);
                        $(".weight").val(0.5);
                        $(".exc-weight").val(0);
                        $(".total-weight").html(0);
                        $(".total-calweight").html(0);
                        $(".total-excWeight").html(0);
                    }
                } else {
                    $(".error").html("Không có đơn hàng để tạo!").slideDown(500).delay(15000).slideUp();
                    sys.HideLoading();
                    return false;
                }
            });
        }
        //
        $('#add-box').on('click', function () {
            if (!(_this.$Province.val() && _this.$District.val())) {
                $(".error").html("Vui lòng nhập địa chỉ lấy hàng để thực hiện thao tác này!").slideDown(500).delay(15000).slideUp();
                return false;
            }
            if (!(Number($(".box-length").val()) > 0 && Number($(".box-width").val()) > 0 && Number($(".box-height").val()) > 0)) {
                return false;
            }
            dataBoxDataTable = [];
            var dim = Number($(".box-length").val()) * Number($(".box-width").val()) * Number($(".box-height").val()) * dimNumClone;
            var totalWeight = 0;
            var totalExcWeight = 0;
            var totalCalWeight = 0;
            boxDataTable.row.add({
                'Length': Number($(".box-length").val()) ? Number($(".box-length").val()) : 0,
                'Width': Number($(".box-width").val()) ? Number($(".box-width").val()) : 0,
                'Height': Number($(".box-height").val()) ? Number($(".box-height").val()) : 0,
                'Weight': Number($(".box-weight").val()) ? Number($(".box-weight").val()) : 0,
                'ExcWeight': dimNumClone ? dim : 0,
                'CalWeight': Number($(".box-weight").val()) > dim ? Number($(".box-weight").val()) : dim,
            }).draw(false);
            for (let i = 0; i < boxDataTable.data().length; i++) {
                dataBoxDataTable.push(boxDataTable.data()[i]);
                totalWeight += boxDataTable.data()[i].Weight;
                totalExcWeight += boxDataTable.data()[i].ExcWeight;
                totalCalWeight += boxDataTable.data()[i].CalWeight;
            }
            $(".total-box").val(dataBoxDataTable.length);
            $(".weight").val(totalWeight);
            $(".exc-weight").val(totalExcWeight);
            $(".total-weight").html(totalWeight);
            $(".total-calweight").html(totalCalWeight);
            $(".total-excWeight").html(totalExcWeight);
            // if (_this.$Width.val() && _this.$Height.val() && _this.$Length.val()) {

            // }
            _this.$Width.val(boxDataTable.data()[0].Width);
            _this.$Height.val(boxDataTable.data()[0].Height);
            _this.$Length.val(boxDataTable.data()[0].Length);
            if (dataBoxDataTable.length > 0) {
                _this.$Length.attr('disabled', true);
                _this.$Width.attr('disabled', true);
                _this.$Height.attr('disabled', true);
            }
            calculator();
            $(".box-length").val(0);
            $(".box-width").val(0);
            $(".box-height").val(0);
            $(".box-weight").val(0);
        });
    }
    //
    var validationParam = function (item) {
        var messageError = "";
        var countError = 0;
        if (!item.receiverName) {
            $(".error").html(" Vui lòng nhập tên người nhận!").slideDown(500).delay(15000).slideUp();
            return false;
        }
        if (!item.receiverPhone) {
            $(".error").html(" Vui lòng nhập số điện thoại người nhận!").slideDown(500).delay(15000).slideUp();
            return false;
        }
        if (!item.shippingAddress) {
            $(".error").html(" Vui lòng nhập địa chỉ người nhận!").slideDown(500).delay(15000).slideUp();
            return false;
        }
        if (!item.toProvinceId) {
            $(".error").html("Vui lòng chọn địa chỉ theo GoogleMaps hoặc chọn tỉnh thàn!").slideDown(500).delay(15000).slideUp();
            return false;
        }
        if (!item.toDistrictId) {
            $(".error").html("Vui lòng chọn quận huyện!").slideDown(500).delay(15000).slideUp();
            return false;
        }
        if (!item.Content) {
            $(".error").html("Vui lòng nhập nội dung hàng hóa!").slideDown(500).delay(15000).slideUp();
            return false;
        }
        if (!item.Weight) {
            $(".error").html("Vui lòng nhập khối lượng hàng hóa!").slideDown(500).delay(15000).slideUp();
            return false;
        }
        if (item.Width != 0 || item.Height != 0 || item.Length != 0) {
            if (!(item.Width != 0 && item.Height != 0 && item.Length != 0)) {
                if (item.Length == 0) {
                    messageError += "[Chiều dài] ";
                    sys.HideLoading();
                    countError++;
                }
                if (item.Width == 0) {
                    messageError += "[Chiều rộng] ";
                    sys.HideLoading();
                    countError++;
                }
                if (item.Height == 0) {
                    messageError += "[Chiều cao] ";
                    sys.HideLoading();
                    countError++;
                }
                if (countError > 0) {
                    $(".error").html(messageError + " gói hàng không được để trống!").slideDown(500).delay(15000).slideUp();
                    return false;
                }
            }
        }
        if (!Number(item.totalPrice)) {
            $(".error").html("Không tìm thấy mức giá cho dịch vụ này, Vui lòng chọn dịch vụ khách!").slideDown(500).delay(15000).slideUp();
            return false;
        }
        return true;
    }
    //
    var createOrUpdate = function (item) {
        var CustomerInfoLog = new Object();
        CustomerInfoLog.name = item.receiverName;
        CustomerInfoLog.phoneNumber = item.receiverPhone;
        CustomerInfoLog.Address = item.shippingAddress;
        CustomerInfoLog.AddressNote = item.addressNoteTo;
        CustomerInfoLog.ProvinceId = item.toProvinceId;
        CustomerInfoLog.DistrictId = item.toDistrictId;
        CustomerInfoLog.WardId = item.toWardId;

        $.when(sys.CallAjaxPostasync(apiCustomer + "/CustomerInfoLog/CreateOrUpdate", CustomerInfoLog, token)).done(function (data) {
            if (data.isSuccess) {
                sys.HideLoading();
                SearchByPhoneNumber();
            }
        });
    };
    //
    var SearchByPhoneNumber = function (_this) {
        var userId = $.cookie('userId');
        dataReceiverPhoneInfo = null;
        html = ""
        dataOptions = []
        $.when(sys.CallAjaxasync(apiCustomer + '/CustomerInfoLog/Search',
            { text: 0, senderId: userId, cols: null },
            token
        )).done(function (data) {
            if (data.isSuccess) {
                const results = data.data.sort((x, y) => sys.BoDauTiengViet(y.name) > sys.BoDauTiengViet(x.name) ? -1 : 1);
                $.each(results, function (key, value) {
                    dataOptions.push({ phoneNumber: value.phoneNumber, name: value.name });
                });
                dataReceiverPhoneInfo = results;
            }
        });
    };
    //
    var checkNumber = function (_this) {
        $("#phoneto_1").add($("#weight_1")).add($("#length_1")).add($("#width_1")).add($("#height_1")).add(_this.$CODDiv.find(".cod")).add(_this.$BHHHDiv.find(".insured")).keypress(function (evt) {
            var charCode = (evt.which) ? evt.which : event.keyCode
            if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode == 190)
                return false;
            return true;
        })
    };
    //
    var loadNumber = function (_this) {
        var options = {
            data: dataOptions,
            getValue: function (element) {
                return element.phoneNumber;
            },
            template: {
                type: "description",
                fields: {
                    description: "name"
                }
            },
            list: {
                maxNumberOfElements: 8,
                match: {
                    enabled: true
                },
                sort: {
                    enabled: true
                }
            },

        };
        $("#" + _this.$PhoneTo.attr("id")).easyAutocomplete(options);
    };
    //
    var loadPhoneNumber = function (_this) {
        if (dataReceiverPhoneInfo != null) {
            $.each(dataReceiverPhoneInfo, function (index, value) {
                if (value.phoneNumber == _this.$PhoneTo.val()) {
                    _this.$CusNameTo.val(value.name);
                    _this.$AddressTo.val(value.address);
                    _this.$AddressNoteTo.val(value.addressNote);

                    _this.CityId = value.provinceId;
                    _this.DistrictId = value.districtId;
                    _this.WardId = value.wardId;

                    _this.$Province.val(_this.CityId).trigger("chosen:updated").trigger("change");
                    _this.$District.val(_this.DistrictId).trigger("chosen:updated").trigger("change");
                    _this.$Ward.val(_this.WardId).trigger("chosen:updated").trigger("change");
                    getInfoHubRouting(value.districtId, 0, _this)
                    return false;
                } else {
                    _this.$CusNameTo.val("");
                    _this.$AddressTo.val("");
                    _this.$AddressNoteTo.val("");

                    _this.CityId = null;
                    _this.DistrictId = null;
                    _this.WardId = null;

                    _this.$Province.val("").trigger("chosen:updated").trigger("change");
                    _this.$District.val("").trigger("chosen:updated").trigger("change");
                    _this.$Ward.val("").trigger("chosen:updated").trigger("change");
                    _this.HubId = null;
                    _this.HubRoutingId = null;
                }
            })
            sys.HideLoading();
        } else {
            _this.$CusNameTo.val("");
            _this.$AddressTo.val("");
            _this.$AddressNoteTo.val("");
            _this.CityId = "";
            _this.DistrictId = "";
            _this.WardId = "";
            _this.$Province.val("").trigger("chosen:updated").trigger("change");
            _this.$District.val("").trigger("chosen:updated").trigger("change");
            _this.$Ward.val("").trigger("chosen:updated").trigger("change");
            sys.HideLoading();
        }
    }
    // events
    ////============Event OnChange====================

    //Location onChange
    var provinceChange = function (_this) {
        var html = "<option value=''>Chọn quận huyện</option>";
        $.when(sys.CallAjaxasync(apiCustomer + '/district/GetDistrictByProvince?provinceId=' + _this.$Province.val(),
            null,
            token
        )).done(function (data) {
            if (data.isSuccess) {
                const results = data.data.sort((x, y) => sys.BoDauTiengViet(y.name) > sys.BoDauTiengViet(x.name) ? -1 : 1);
                $.each(results, function (key, value) {
                    html += "<option value='" + value.id + "'>" + value.name + "</option>";
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
        $.when(sys.CallAjaxasync(apiCustomer + '/ward/GetWardByDIstrict?districtId=' + _this.$District.val(),
            null,
            token
        )).done(function (data) {
            if (data.isSuccess) {
                const results = data.data.sort((x, y) => sys.BoDauTiengViet(y.name) > sys.BoDauTiengViet(x.name) ? -1 : 1);
                $.each(results, function (key, value) {
                    html += "<option value='" + value.id + "'>" + value.name + "</option>";
                });
            }
            _this.$Ward.html(html);
            _this.$Ward.chosen().trigger("chosen:updated");
        });
    }
    //Weight
    var _inputWeightChange = function (_this) {
        _this.$Weight.change(function () {
            var selected = [];
            //_this.$ServiceDVGT.each(function () {
            //    selected.push([$(this).val(), $(this).data('order')]);
            //});
            if (Number(_this.$Weight.val().replace(/\./g, '')) > 100) {
                _this.$ServiceDVGT.multiselect("select", [2]);
                $('li.NHH').addClass('disabled');
                _this.$ServiceDVGT.trigger('change');
            } else {
                _this.$ServiceDVGT.multiselect("deselect", [2]);
                $('li.NHH').removeClass('disabled');
                _this.$ServiceDVGT.trigger('change');
            }
        })
    }
    //COD input onchange
    var _inputCODChange = function (_this) {
        _this.$CODDiv.find(".cod").change(function () {
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
            _LoadPayment(_this);
        })
    }
    //BHHH input onchange
    var _inputBHHHChange = function (_this) {
        _this.$BHHHDiv.find(".insured").change(function () {
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
        $('.add-lading').html("Tạo đơn hàng ");
        $('.add-lading-create').html("Tạo (" + window.count + ") đơn hàng và yêu cầu lấy hàng");
    });
    $('#add-more').trigger('click');
    function _LoadService(_this) {
        dataSerivce = null;
        var html = "";

        sys.Loading();
        $.when(sys.CallAjaxasync(apiCustomer + '/Service/GetListService', null, token)).done(function (data) {
            if (data.isSuccess) {
                dataSerivce = data.data;
                const results = dataSerivce.sort((x, y) => y.id > x.id ? -1 : 1);
                $.each(results, function (key, value) {
                    html += "<option value='" + value.id + "' data-code='" + value.code + "'>" + value.name + "</option>";
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

        sys.Loading();
        $.when(sys.CallAjaxasync(apiPost + '/Structure/GetAll', null, token)).done(function (data) {
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

        $.when(sys.CallAjaxasync(apiCustomer + '/Service/GetListServiceSub', null, token)).done(function (data) {
            if (data.isSuccess) {
                dataDVGT = data.data;
                html += "";
                $.each(dataDVGT, function (key, value) {
                    html += "<option class='" + value.code + "' data-id='" + value.id + "'data-code='" + value.code.toLocaleLowerCase() + "' data-oracleCode='" + (value.vseOracleCode ? value.vseOracleCode.toLocaleLowerCase() : '') + "' value='" + value.code.toLocaleLowerCase() + "'>" + value.name + "</option>";
                });
                $("select.servicedvgt").html(html);
            }
        });
    }
    function _LoadPayment(_this) {
        var html = "";

        $.when(sys.CallAjaxasync(apiCustomer + '/paymentType/GetAll',
            null,
            token
        )).done(function (data) {
            if (data.isSuccess) {
                //data.data.sort(function (a, b) {
                //    return a.name > b.name;
                //});
                $.each(data.data, function (key, value) {
                    if (customerTypeId != 1) {
                        if (value.id != 4) {
                            html += "<option data='" + value.code + "' value='" + value.id + "'>" + value.name + "</option>";
                        }
                    }
                    else {
                        if (_this.$CODDiv.find(".cod").val() != "" || _this.$CODDiv.find(".cod").val() != 0) {
                            if (value.id != 4) {
                                html += "<option value='" + value.id + "'>" + value.name + "</option>";
                            }
                        } else {
                            if (value.id == 1 || value.id == 3) {
                                html += "<option value='" + value.id + "'>" + value.name + "</option>";
                            }
                        }
                    }
                });
                _this.$Payment.html(html);
                _this.$Payment.chosen();
                _this.$Payment.trigger("chosen:updated");
                if (paymentTypeId) {
                    _this.$Payment.val(paymentTypeId).trigger("chosen:updated").trigger("change");
                }
            }
        });
    }

    function _LoadProvince() {
        var html = "";

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
                $("select.province").html(html);
            }
        });
    }

    function _LoadTypePack() {
        var html = "";

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
                    $.when(sys.CallAjaxasync(apiCore + '/Hub/GetInfoHubRouting', { districtId: districtSenderId }, null)).done(function (data) {
                        if (data.isSuccess && data.data != null) {
                            var hub = data.data;
                            hubSenderId = hub.hubId;
                            hubRoutingId = hub.hubRoutingId;
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
                ladingModels = lading;
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
        shipment.Weight = value.$CalWeight.val() > value.$Weight.val() ? formatNumberFloat(value.$CalWeight.val()) : value.$Weight.val();
        shipment.CalWeight = value.$CalWeight.val() > value.$Weight.val() ? formatNumberFloat(value.$CalWeight.val()) : value.$Weight.val();
        shipment.StructureId = value.$Structure.find("option:selected").val();
        shipment.TotalItem = value.$Number.val();
        shipment.TotalBox = value.$TotalBox.val() ? value.$TotalBox.val() : 1;
        shipment.Length = value.$Length.val() ? value.$Length.val() : 0;
        shipment.Width = value.$Width.val() ? value.$Width.val() : 0;
        shipment.Height = value.$Height.val() ? value.$Height.val() : 0;
        shipment.priceBox = dataBoxDataTable;
        shipment.serviceDVGTIds = shipment.serviceDVGTIds ? shipment.serviceDVGTIds : [];
        //shipment.ServiceId = shipment.ServiceId ? shipment.ServiceId : [];
        value.$ServiceDVGT.find("option:selected").each(function () {
            switch ($(this).attr('data-code').toLocaleUpperCase()) {
                case "COD":
                    shipment.COD = Number(value.$CODDiv.find(".cod").val().replace(/\./g, ''));
                    break;
                case "BHHH":
                    shipment.Insured = Number(value.$BHHHDiv.find(".insured").val().replace(/\./g, ''));
                    break;
                case "BH":
                    shipment.Insured = Number(value.$BHHHDiv.find(".insured").val().replace(/\./g, ''));
                    break;
            }
            shipment.serviceDVGTIds.push(Number($(this).attr('data-id')));
            //shipment.ServiceId.push(Number($(this).val()));
        });
        //;
        shipment.COD = shipment.COD ? shipment.COD : 0;
        shipment.Insured = shipment.Insured ? shipment.Insured : Number(value.$BHHHDiv.find(".insured").val().replace(/\./g, ''));
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
        lading.fromHubRoutingId = hubRoutingId;
        lading.currentHubId = hubSenderId;
        lading.LatFrom = latFrom;
        lading.LngFrom = lngFrom;

        if (value.$AddressTo.val() != "" && value.$AddressTo.val() != undefined) {
            lading.shippingAddress = value.$AddressTo.val();
        } else {
            //lading.shippingAddress = "Phường " + value.WardName + ", Quận " + value.DistrictName + ", " + value.CityName;
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
        lading.toHubRoutingId = value.HubRoutingId;

        lading.addressNoteTo = value.$AddressNoteTo.val();
        lading.LatTo = value.Lat;
        lading.LngTo = value.Lng;

        lading.Length = value.$Length.val() != 0 || value.$Length.val() != "0" ? Number(value.$Length.val()) : null;
        lading.Width = value.$Width.val() != 0 || value.$Width.val() != "0" ? Number(value.$Width.val()) : null;
        lading.Height = value.$Height.val() != 0 || value.$Height.val() != "0" ? Number(value.$Height.val()) : null;
        lading.CalWeight = Number(value.$CalWeight.val()) != 0 ? value.$CalWeight.val() : 0;

        lading.CusNote = value.$Noted.val();
        lading.note = value.$Noted.val();
        lading.Content = value.$Description.val();
        lading.PaymentTypeId = value.$Payment.find("option:selected").val();
        lading.StructureId = value.$Structure.find("option:selected").val();
        lading.priceDVGTs = [];
        lading.PriceListDVGT = [];
        lading.serviceDVGTIds = [];
        //lading.ServiceId = [];
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
        //;
        lading.COD = lading.COD ? lading.COD : 0;
        lading.Insured = lading.Insured ? lading.Insured : 0;
        //
        //lading.insured = value.$BHHHDiv.find(".insured").val() != "" ? value.$BHHHDiv.find(".insured").val().replace(/\./g, '') : 0;
        lading.totalBox = value.$TotalBox.val() ? value.$TotalBox.val() : 1;
        lading.Weight = value.$Weight.val();
        lading.ServiceId = value.$Service.find("option:selected").val();
        lading.shipmentStatusId = 54;//yêu cầu mới tạo
        //price
        if (value.$PriceMain.val().replace(/\./g, '')) {
            lading.DefaultPrice = value.$PriceMain.val().replace(/\./g, '');
        } else {
            //lading.DefaultPrice = (value.$Service.find("option:selected")[0] ? value.$Service.find("option:selected")[0].attributes[0].value : 0);
        }
        if (value.$DefaultPriceP.val().replace(/\./g, '')) {
            lading.defaultPriceP = value.$DefaultPriceP.val().replace(/\./g, '');
        }
        if (value.$DefaultPriceS.val().replace(/\./g, '')) {
            lading.defaultPriceS = value.$DefaultPriceS.val().replace(/\./g, '');
        }
        lading.fuelPrice = value.$PPXD.val().replace(/\./g, '');
        lading.remoteAreasPrice = value.$VSVX.val().replace(/\./g, '');
        lading.totalDVGT = value.$DVGTPrice.val().replace(/\./g, '');
        lading.priceCOD = value.$CODDiv.find(".cod-price").val().replace(/\./g, '');
        lading.VATPrice = 0;
        lading.OtherPrice = 0;
        lading.totalPrice = value.$Amount.val().replace(/\./g, '');
        lading.totalPriceSYS = value.$Amount.val().replace(/\./g, '');
        lading.priceDVGTs = priceDVGTs;
        lading.boxes = dataBoxDataTable;
        return lading;
    }
    function loadInfo(_this) {

        var html = "";
        $.when(sys.CallAjaxasync(apiCustomer + '/Account/GetCurrentInfo', null, token)).done(function (data) {
            if (data.isSuccess) {
                var info = data.data;
                senderId = info.id;
                senderName = info.name;
                senderPhone = info.phoneNumber;
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
                customerTypeId = info.customerTypeId;
                paymentTypeId = info.paymentTypeId;
                if (districtSenderId) {
                    $.when(sys.CallAjaxasync(apiCore + '/Hub/GetInfoHubRouting', { districtId: districtSenderId }, null)).done(function (data) {
                        if (data.isSuccess && data.data != null) {
                            var hub = data.data;
                            hubSenderId = hub.hubId;
                            hubRoutingId = hub.hubRoutingId;
                        }
                    });
                }
                html += "<option data-representativeName='" + senderName + "'data-phoneNumber='" + senderPhone + "'data-provinceId='" + citySenderId + "'data-districtId='" + districtSenderId + "'data-wardId='" + wardSenderId + "' value='" + JSON.stringify(info) + "'>" + senderAddress + "</option>"
                $.when(sys.CallAjaxasync(apiCRM + '/CusDepartment/GetByCustomerId', { customerId: senderId }, token)).done(function (department) {
                    if (department.isSuccess && department.data != null) {
                        var dep = department.data;
                        department = dep;
                        $.each(department, function (key, value) {
                            html += "<option data-representativeName='" + value.representativeName + "'data-phoneNumber='" + value.phoneNumber + "'data-provinceId='" + value.provinceId + "'data-districtId='" + value.districtId + "'data-wardId='" + value.wardId + "' value='" + JSON.stringify(value) + "'>" + value.address + "</option>";
                        });
                        _this.$CusAddressFromSelect.html(html);
                        _this.$CusAddressFromSelect.chosen();
                        _this.$CusAddressFromSelect.trigger("chosen:updated");
                    }
                });
            }
        });
    }
    function getHub(wardId, _this) {
        if (wardId) {
            $.when(sys.CallAjaxasync(apiCustomer + '/hub/GetHubByWardId', { wardId: wardId }, token)).done(function (data) {
                if (data.isSuccess && data.data != null) {
                    var hub = data.data;
                    _this.HubId = hub.id;
                    return hub.id;
                }
            });
        }
    }
    function getInfoHubRouting(districtId, weight, _this) {
        if (districtId) {
            $.when(sys.CallAjaxasync(apiCore + '/Hub/GetInfoHubRouting', { districtId: districtId, weight: weight }, null)).done(function (data) {
                if (data.isSuccess && data.data != null) {
                    var hub = data.data;
                    _this.HubId = hub.hubId;
                    _this.HubRoutingId = hub.hubRoutingId;
                }
            });
        }
    }
});
function AddBox() {
    $('.btn-load-modal').click()
}
function removeBox(evt) {
    dataBoxDataTable = [];
    var dim = Number($(".box-length").val()) * Number($(".box-width").val()) * Number($(".box-height").val()) * dimNumClone;
    var totalWeight = 0;
    var totalExcWeight = 0;
    var totalCalWeight = 0;

    boxDataTable.row(evt.parents("tr")).remove().draw();

    for (let i = 0; i < boxDataTable.data().length; i++) {
        dataBoxDataTable.push(boxDataTable.data()[i]);
        totalWeight += boxDataTable.data()[i].Weight;
        totalExcWeight += boxDataTable.data()[i].ExcWeight;
        totalCalWeight += boxDataTable.data()[i].CalWeight;
    }
    $(".total-box").val(dataBoxDataTable.length);
    $(".weight").val(totalWeight);
    $(".exc-weight").val(totalExcWeight);
    $(".total-weight").html(totalWeight);
    $(".total-calweight").html(totalCalWeight);
    $(".total-excWeight").html(totalExcWeight);
    console.log(dataBoxDataTable);
    calculator();
    if (dataBoxDataTable.length == 0) {
        $("#length_1").attr("disabled", false);
        $("#width_1").attr("disabled", false);
        $("#height_1").attr("disabled", false);
        $("#length_1").val(0)
        $("#width_1").val(0)
        $("#height_1").val(0)
    } else if (dataBoxDataTable.length > 0) {
        $("#length_1").val(dataBoxDataTable[0].Length)
        $("#width_1").val(dataBoxDataTable[0].Width)
        $("#height_1").val(dataBoxDataTable[0].Height)
    }
}
function selectAddress(_this) {
    $("#address-description").val(_this[0].innerText);
    $("#address-place_id").val(_this[0].getAttribute("data-place_id"));
    $('.address-google-pac-container').css("display", "none");
    $('.address-google-pac-container').html('');
}

function sendRequest(data) {
    sys.Loading()
    requestShipment.orderDate = sys.formatDateTimeSQL(new Date())
    requestShipment.senderId = senderId
    requestShipment.cusNote = data.cusNote;
    requestShipment.weight = data.weight;
    requestShipment.totalBox = data.totalBox;
    //
    requestShipment.fromProvinceId = data.fromProvinceId;
    requestShipment.fromDistrictId = data.fromDistrictId;
    requestShipment.fromWardId = data.fromWardId;
    requestShipment.latFrom = data.latFrom;
    requestShipment.lngFrom = data.lngFrom;
    requestShipment.currentLat = data.latFrom;
    requestShipment.currentLng = data.lngFrom;
    requestShipment.pickingAddress = data.pickingAddress;
    //
    requestShipment.ListShipmentId = [data.id];
    
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
    requestShipment.fromHubId = data.fromHubId ? data.fromHubId : null;
    requestShipment.currentHubId = data.fromHubId ? data.fromHubId : null;
    requestShipment.fromHubRoutingId = data.fromHubRoutingId ? data.fromHubRoutingId : null;
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