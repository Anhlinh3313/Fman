$(document).ready(function () {

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
    var latFrom = 0;
    var lngFrom = 0;
    var hubSenderId = 0;
    var tohub = 0;
    var wardSenderId = 0;
    var districtSenderId = 0;
    var citySenderId = 0;
    var provinceSP = 0;
    var firstLoad = true;
    _LoadPayment();
    loadInfo();
    _LoadServiceGT();
    _LoadTypePack();
    initMapFrom();
    _LoadProvince();
    LoadSenderForm($("#sender-address").val());

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

    $("#add-lading").on("click", function () {
        //GetListPayment
        sys.Loading();
        if ($('#ladingFrom').validationEngine('validate')) {
            var ladingModels = GetLadingModels();
            if (ladingModels.length) {
                var count = 0;
                ladingModels.forEach(function (item, x) {
                    var token = $.cookie('token');
                    if (item.toHubId != 0) {
                        $.when(sys.CallAjaxPostasync(apiCustomer + "/shipment/Create", item, token)).done(function (data) {
                            if (data.isSuccess) {
                                count++;
                            } else {
                                //$(".error").html("Lỗi trong quá trình tạo đơn hàng!").show();
                                //sys.HideLoading();
                            }
                        });
                        //(".success").html('Chốt đơn hàng thành công ' + count + ' trong tổng ' + ladingModels.length + ' đơn hàng.').slideDown(1000).delay(5000).slideUp('slow');
                        $(".success").html('Tạo thành công ' + ladingModels.length + ' đơn hàng.').slideDown(1000).delay(5000).slideUp('slow');
                        ladings = [];
                        $(".lading-list").empty();
                        window.count = 0;
                        $('#add-more').trigger('click');
                        sys.HideLoading();
                    }
                    $(".error").html("Địa chỉ (" + item.shippingAddress + ") hiện tại chưa hỗ trợ phát hàng cho khu vực này!").slideDown(1000).delay(3000).slideUp(2000);
                    sys.HideLoading();
                    return false;

                })
            } else {
                $(".error").html("Không có đơn hàng để tạo!").slideDown(1000).delay(3000).slideUp(2000);
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
    var Lading = function () {
        var _this = this;
        _this.$el = null;
        _this.index = 0;
        _this.$template = $('.lading-template>.extend-container');
        _this.$plcholder = $('.lading-list');
        _this.$CusNameTo = null;
        _this.$PhoneTo = null;
        _this.$AddressTo = null;
        _this.$AddressNoteTo = null;
        _this.$CompanyTo = null;
        _this.CityId = 0;
        _this.DistrictId = 0;
        _this.WardId = 0;
        _this.HubId = 0;
        _this.$Service = null;
        _this.$ServiceDVGT = null;
        _this.$BHHHDiv = null;//khai giá
        _this.$DGHHDiv = null;//đóng gói
        _this.$CODDiv = null;//COD
        _this.$Payment = null;
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

        Lading.prototype.init = function (index) {

            _this.index = index;
            _this.$el = _this.$template.clone();
            _this.$el.find('.ladingnumber').html(_this.index);
            _this.$el.appendTo(_this.$plcholder);

            _this.$CusNameTo = _this.$el.find('.receiver-name');
            _this.$CusNameTo.attr('id', 'nameto_' + index);
            _this.$PhoneTo = _this.$el.find('.receiver-phone');
            _this.$PhoneTo.attr('id', 'phoneto_' + index);
            _this.$AddressTo = _this.$el.find('.receiver-address');
            _this.$AddressTo.attr("id", "autocomplete_" + index);
            _this.$AddressNoteTo = _this.$el.find('.receiver-address-note');
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
            sys.formatNumber($(_this.$BHHHDiv).find('input'));
            _this.$DGHHDiv = _this.$el.find('.pack-div');
            sys.formatNumber($(_this.$DGHHDiv).find('input'));
            _this.$CODDiv = _this.$el.find('.cod-div');
            sys.formatNumber($(_this.$CODDiv).find('.cod'));
            _this.$Noted = _this.$el.find('.noted');
            _this.$Description = _this.$el.find('.description');
            _this.$Payment = _this.$el.find('.payment');
            _this.$Payment.chosen();

            _this.$Province = _this.$el.find('select.province');
            _this.$Province.chosen();

            _this.$District = _this.$el.find('select.district');
            _this.$District.chosen();

            _this.$Ward = _this.$el.find('select.ward');
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
            initMap();
            ValidationSelectChosen();

            $(_this.$Province).on('change', function (e) {
                var num = e.delegateTarget.length;
                var a = _this.$Province.val();
                for (var i = 1; i < num; i++) {
                    var b = e.delegateTarget[i].value
                    if (a == e.delegateTarget[i].value) {
                        var id = e.delegateTarget[i].value;
                        _this.CityId = id;
                        _LoadService(_this);
                    }
                }
            });
            $(_this.$District).on('change', function (e) {
                var a = _this.$District.val();
                var num = e.delegateTarget.length;
                for (var i = 1; i < num; i++) {
                    if (a == e.delegateTarget[i].value) {
                        var id = e.delegateTarget[i].value;
                        _this.DistrictId = id;
                        _LoadService(_this);
                    }
                }
            });
            $(_this.$Ward).on('change', function (e) {
                var num = e.delegateTarget.length;
                var a = _this.$Ward.val();
                for (var i = 1; i < num; i++) {
                    if (a == e.delegateTarget[i].value) {
                        var id = e.delegateTarget[i].value;
                        var name = e.delegateTarget[i].label;
                        getHub(id, _this);
                        getWard(name, _this.DistrictId, _this);
                        _LoadService(_this);

                    }
                }
                ladings.push(_this.HubId);
                ladings.push(_this.WardId);
            });
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
            $('.add-lading').html("Tạo (" + window.count + ") đơn hàng");
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
                    case "BHHH":
                        if ($(this).is(":selected")) {
                            _this.$BHHHDiv.show();
                        } else {
                            _this.$BHHHDiv.hide()
                        }
                        break;
                }
            });
        }

        function addressChange() {
            initMap();
        }
        var initMap = function () {
            var options = {
                componentRestrictions: { 'country': ['vi', 'vn'] }
            };
            var input = document.getElementById(_this.$AddressTo.attr("id"));

            var autocomplete = new google.maps.places.Autocomplete(input, options);
            autocomplete.addListener('place_changed', function () {
                var place = autocomplete.getPlace();
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
                            address: place.formatted_address
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
        var calculator = function () {
            if (_this.DistrictId && _this.CityId && citySenderId && districtSenderId) {
                var $lading = $.grep(ladings, function (e) { return e.index == _this.index });
                var lading = GetLadingModel($lading[0]);
                var token = $.cookie('token');
                $.when(sys.CallAjaxPostasync(apiCustomer + "/price/Calculate", lading, token)).done(function (data) {
                    if (data.isSuccess) {
                        var result = data.data;
                        _this.$PriceMain.val(formatMoney(result.defaultPrice, 0));
                        _this.$OtherPrice.val(result.otherPrice);
                        _this.$PPXD.val(formatMoney(result.fuelPrice, 0));
                        _this.$VSVX.val(formatMoney(result.PriceFar, 0));
                        _this.$VAT.val(result.vatPrice);
                        _this.$DVGTPrice.val(formatMoney(result.totalDVGT, 0));
                        _this.$Amount.val(formatMoney(result.totalPrice, 0));
                        _this.$CODDiv.find(".cod-price").val(formatMoney(result.totalDVGT, 0));
                        //_this.$BHHHDiv.find(".insured-price").val(formatMoney(result.InsuredPrice, 0));
                        //_this.$DGHHDiv.find(".pack-price").val(formatMoney(result.PackPrice, 0));
                    }
                });
            }
        }
        var bindEvents = function () {
            _this.$clickPrice.on('click', checkHidePrice);
            _this.$remove.on('click', removeMe);
            _this.$ServiceDVGT.on('change', serviceGTChange);
            _this.$Province.on('change', provinceChange);
            _this.$District.on('change', districtChange);
            _this.$AddressTo.on('change', addressChange);
            $(document).on('remove_item', removeListener);
            _this.$remove_all.on('click', removeAll);
            $(".sender-address").add(_this.$AddressTo).add(_this.$BHHHDiv.find(".insured")).add(_this.$DGHHDiv.find(".pack-type"))
                .add(_this.$CODDiv.find(".cod")).add(_this.$Weight).add(_this.$Height).add(_this.$Width)
                .add(_this.$Length).add(_this.$Number).add(_this.$Service).add(_this.$ServiceDVGT).add($(_this.$Province)).add($(_this.$District)).add($(_this.$Ward)).on("change", calculator);

            _this.$CODDiv.change(function () {
                var selected = [];
                _this.$ServiceDVGT.each(function () {
                    selected.push([$(this).val(), $(this).data('order')]);
                });
                if (_this.$CODDiv.find(".cod").val() == "" && _this.$ServiceDVGT.multiselect()) {
                    _this.$ServiceDVGT.multiselect("deselect", [3]);
                    _this.$ServiceDVGT.trigger('change');
                } else {
                    _this.$ServiceDVGT.multiselect("select", [3]);
                    _this.$ServiceDVGT.trigger('change');
                }
            })
        }


        var provinceChange = function () {
            var html = "<option value=''>Chọn quận huyện</option>";
            var token = $.cookie('token');
            $.when(sys.CallAjaxasync(apiCustomer + '/district/GetDistrictByProvince?provinceId=' + _this.$Province.val(),
                null,
                token
            )).done(function (data) {
                if (data.isSuccess) {
                    $.each(data.data, function (key, value) {
                        html += "<option  value='" + value.id + "'>" + value.name + "</option>";
                    });
                }
                _this.$District.html(html);
                _this.$District.chosen().trigger("chosen:updated");

                _this.$Ward.html("<option value=''>Chọn phường xã</option>");
                _this.$Ward.chosen().trigger("chosen:updated");
            });
        }

        var districtChange = function () {
            var html = "<option value=''>Chọn phường xã</option>";
            var token = $.cookie('token');
            $.when(sys.CallAjaxasync(apiCustomer + '/ward/GetWardByDIstrict?districtId=' + _this.$District.val(),
                null,
                token
            )).done(function (data) {
                if (data.isSuccess) {
                    $.each(data.data, function (key, value) {
                        html += "<option  value='" + value.id + "'>" + value.name + "</option>";
                    });
                }
                _this.$Ward.html(html);
                _this.$Ward.chosen().trigger("chosen:updated");
            });
        }

        function ValidationSelectChosen() {
            $('#ladingFrom')
                .find(_this.$Province)
                .chosen({
                    width: '100%',
                    inherit_select_classes: true
                })
                .on("change", function (e) {
                    $('#ladingFrom').formValidation('revalidateField', 'province');
                })
                .end()
                .find(_this.$District)
                .chosen({
                    width: '100%',
                    inherit_select_classes: true
                })
                .on("change", function (e) {
                    $('#ladingFrom').formValidation('revalidateField', 'district');
                })
                .end()
                .find(_this.$Ward)
                .chosen({
                    width: '100%',
                    inherit_select_classes: true
                })
                .on("change", function (e) {
                    $('#ladingFrom').formValidation('revalidateField', 'ward');
                })
                .end()
                .formValidation({
                    framework: 'bootstrap',
                    excluded: ':disabled',
                    fields: {
                        province: {
                            validators: {
                                callback: {
                                    message: ' ',
                                    callback: function (value, validator, $field) {
                                        // Get the selected options
                                        var options = _this.$Province.val();
                                        provinceSP = options;
                                        return (options >= 1);
                                    }
                                }
                            }
                        },
                        district: {
                            validators: {
                                callback: {
                                    message: ' ',
                                    callback: function (value, validator, $field) {
                                        // Get the selected options
                                        var options = _this.$District.val();
                                        return (options >= 1);
                                    }
                                }
                            }
                        },
                        ward: {
                            validators: {
                                callback: {
                                    message: ' ',
                                    callback: function (value, validator, $field) {
                                        // Get the selected options
                                        var options = _this.$Ward.val();
                                        return (options >= 1);
                                    }
                                }
                            }
                        },
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
                        address: addressFormat
                    },
                    async: true,
                    dataType: 'json',
                    success: function (data, textStatus) {
                        //console.log(data.results[0].address_components);
                        var address = place ? place : data.results[0];
                        if (!data.results[0] || !data.results[0].geometry) {

                            return;
                        }
                        var locationTo = data.results[0].geometry.location;
                        _this.Lat = locationTo.lat;
                        _this.Lng = locationTo.lng;
                        $.ajax({
                            url: 'https://maps.googleapis.com/maps/api/geocode/json',
                            data: {
                                sensor: false,
                                latlng: _this.Lat + ',' + _this.Lng,
                                key: 'AIzaSyATzgv59sgNUWPRFGUJF5k8LRKJ291V0mY',
                            },
                            async: true,
                            dataType: 'json',
                            success: function (data, textStatus) {
                                console.log(data);
                                var result = new Object();
                                var districtName = '', stateName = '', stateID = '', districtID = '', wardName = '';
                                var addr = data.results[0].address_components;
                                for (var i = 0; i < addr.length; i++) {
                                    //for (j = 0; j < address.address_components[i].types.length; j++) {
                                    var addressType = addr[i].types;
                                    if (addressType[0] == 'administrative_area_level_1') {
                                        stateName = addr[i][componentForm[addressType[0]]];
                                    }
                                    if (addressType[0] == 'administrative_area_level_2' || addressType[0] == 'locality') {
                                        districtName = addr[i][componentForm[addressType[0]]];
                                    }
                                    if (addressType[0] == "administrative_area_level_3") {
                                        wardName = addr[i][componentForm[addressType[0]]];
                                    }
                                    //}
                                }
                                //return result;
                                _this.$AddressTo.attr('title', stateName + ', ' + districtName);

                                var token = $.cookie('token');
                                $.when(sys.CallAjaxasync(apiCustomer + '/province/GetProvinceByName', { name: stateName }, token)).done(function (datapro) {
                                    if (datapro.isSuccess) {
                                        var pro = datapro.data;
                                        _this.CityId = pro.id;

                                        _this.$Province.val(pro.id).trigger("chosen:updated").trigger("change");

                                        $.when(sys.CallAjaxasync(apiCustomer + '/district/GetDistrictByName', { name: districtName, provinceId: _this.CityId }, token)).done(function (data1) {
                                            if (data1.isSuccess) {
                                                var dis = data1.data;
                                                _this.DistrictId = dis.id;
                                                _LoadService(_this);

                                                _this.$District.val(dis.id).trigger("chosen:updated").trigger("change");

                                                $.when(sys.CallAjaxasync(apiCustomer + '/ward/GetWardByName', { name: wardName, districtId: _this.DistrictId }, token)).done(function (data2) {
                                                    if (data2.isSuccess) {
                                                        var ward = data2.data;
                                                        _this.WardId = ward.id;
                                                        _this.$Ward.val(ward.id).trigger("chosen:updated").trigger("change");

                                                        $.when(sys.CallAjaxasync(apiCustomer + '/hub/GetHubByWardId', { wardId: _this.WardId }, token)).done(function (data3) {
                                                            if (data3.isSuccess && data3.data != null) {
                                                                var hub = data3.data;
                                                                _this.HubId = hub.id;
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
                });
            }
        }
    }

    $('#add-more').on("click", function () {
        window.count++;
        var lading = new Lading();
        lading.init(window.count);
        ladings.push(lading);
        $('.add-more').html("Thêm đơn số (" + (window.count + 1) + ")");
        $('.add-lading').html("Tạo (" + window.count + ") đơn hàng");
    });
    $('#add-more').trigger('click');
    function _LoadService(_this) {
        var lading = GetLadingPriceModel(_this);
        var html = "";
        var token = $.cookie('token');
        $.when(sys.CallAjaxPostasync(apiCustomer + '/price/GetListService', lading, token)).done(function (data) {
            if (data.isSuccess) {
                $.each(data.data, function (key, value) {
                    html += "<option value='" + value.id + "'>" + value.name + "</option>";
                });
                _this.$Service.html(html);
                _this.$Service.chosen();
                _this.$Service.trigger("chosen:updated");
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
    function _LoadPayment() {
        var html = "";
        var token = $.cookie('token');
        $.when(sys.CallAjaxasync(apiCustomer + '/paymentType/GetAll',
            null,
            token
        )).done(function (data) {
            if (data.isSuccess) {

                data.data.sort(function (a, b) {
                    return a.name > b.name;
                });

                $.each(data.data, function (key, value) {
                    html += "<option value='" + value.id + "'>" + value.name + "</option>";
                });
                $("select.payment").html(html);
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
                $.each(data.data, function (key, value) {
                    html += "<option value='" + value.id + "'>" + value.name + "</option>";
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
    function initMapFrom() {
        var options = {
            componentRestrictions: { 'country': ['vi', 'vn'] }
        };
        var input = document.getElementById("sender-address");
        var autocomplete = new google.maps.places.Autocomplete(input, options);
        autocomplete.addListener('place_changed', function () {
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                //window.alert("Không tìm thấy thông tin địa chỉ: '" + place.name + "'");
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
                    address: addressFrom
                },
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
                    $.ajax({
                        url: 'https://maps.googleapis.com/maps/api/geocode/json',
                        data: {
                            sensor: false,
                            latlng: latFrom + ',' + lngFrom,
                            key: 'AIzaSyATzgv59sgNUWPRFGUJF5k8LRKJ291V0mY',
                        },
                        async: true,
                        dataType: 'json',
                        success: function (data, textStatus) {
                            var addr = data.results[0].address_components;

                            var districtName = '', stateName = '', stateID = '', districtID = '', wardName = '';
                            //for (var i = 0; i < addr.length; i++) {
                            for (j = 0; j < addr.length; j++) {
                                var addressType = addr[j].types;
                                if (addressType[0] == 'administrative_area_level_1') {
                                    stateName = addr[j][componentForm[addressType[0]]];
                                }
                                if (addressType[0] == 'administrative_area_level_2') {
                                    districtName = addr[j][componentForm[addressType[0]]];
                                }
                                if (addressType[0] == 'administrative_area_level_3') {
                                    wardName = addr[j][componentForm[addressType[0]]];
                                }
                            }
                            //}
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
            });
        }
    }
    function GetLadingModels() {
        var ladingModels = [];
        $.each(ladings, function (index, value) {
            if (index == 0) {
                var lading = GetLadingModel(value);
                ladingModels.push(lading);
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
        lading.Weight = value.$Weight.val();
        if (lading.Weight == null || lading.Weight == '' || lading.Weight == 0) {
            lading.Weight = 50;
        }
        //price
        return lading;
    }
    function GetLadingModel(value) {
        var lading = new Object();
        lading.orderDate = sys.formatDateTimeSQL(new Date());

        lading.SenderId = $.cookie('userId');
        lading.FromDistrictId = districtSenderId
        lading.pickingAddress = lading.AddressFrom = $(".sender-address").val();
        lading.senderName = lading.NameFrom = $(".sender-name").val();
        lading.senderPhone = lading.PhoneFrom = $(".sender-phone").val();
        lading.companyFrom = lading.CompanyFrom = $(".sender-company").val();
        lading.fromProvinceId = citySenderId;
        lading.fromWardId = wardSenderId;
        lading.fromHubId = hubSenderId;
        lading.currentHubId = hubSenderId;
        lading.LatFrom = latFrom;
        lading.LngFrom = lngFrom;

        lading.shippingAddress = value.$AddressTo.val();
        lading.receiverName = value.$CusNameTo.val();
        lading.receiverPhone = value.$PhoneTo.val();
        lading.companyTo = value.$CompanyTo.val();
        lading.toProvinceId = value.CityId;
        lading.toDistrictId = value.DistrictId;
        lading.toWardId = value.WardId;
        lading.toHubId = value.HubId;

        lading.addressNoteTo = value.$AddressNoteTo.val();
        lading.LatTo = value.Lat;
        lading.LngTo = value.Lng;
        lading.Width = 0;
        lading.Height = 0;
        lading.Length = 0;
        lading.note = value.$Noted.val();
        lading.CusNote = value.$Description.val();
        lading.PaymentTypeId = value.$Payment.find("option:selected").val();
        lading.serviceDVGTIds = [];
        value.$ServiceDVGT.find("option:selected").each(function () {
            switch ($(this).attr('data')) {
                case "COD":
                    lading.COD = value.$CODDiv.find(".cod").val().replace(/\./g, '');
                    // lading.CODPrice = value.$CODDiv.find(".cod-price").val().replace(/\./g, '');
                    break;
                case "DG":
                    lading.PackId = value.$DGHHDiv.find(".pack-type option:selected").val();
                    lading.PackPrice = value.$DGHHDiv.find(".pack-price").val().replace(/\./g, '');
                    break;
                case "BHHH":
                    lading.Insured = value.$BHHHDiv.find(".insured").val().replace(/\./g, '');
                    lading.InsuredPrice = value.$BHHHDiv.find(".insured-price").val().replace(/\./g, '');
                    break;
            }
            lading.serviceDVGTIds.push($(this).val());
        });
        //;
        lading.totalBox = value.$Number.val();
        lading.Weight = value.$Weight.val();
        lading.ServiceId = value.$Service.find("option:selected").val();
        lading.shipmentStatusId = 54;//yêu cầu mới tạo
        //price

        lading.DefaultPrice = value.$PriceMain.val().replace(/\./g, '');
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
                $('.sender-name').val(info.name);
                $('.sender-phone').val(info.phoneNumber);
                $('.sender-address').val(info.address);
                $('.sender-company').val(info.nameEn);
                districtSenderId = info.districtId;
                citySenderId = info.provinceId;
                wardSenderId = info.wardId;
                latFrom = info.lat;
                lngFrom = info.lng;
                $.when(sys.CallAjaxasync(apiCustomer + '/hub/GetHubByWardId', { wardId: wardSenderId }, token)).done(function (dataH) {
                    if (dataH.isSuccess && dataH.data != null) {
                        var hub = dataH.data;
                        hubSenderId = hub.id;
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


