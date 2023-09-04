$(document).ready(function () {

    $("#province").on("select2:select", function (item) {
        SetValueForSelect(item.currentTarget.value);
    })

    $("#district").on("select2:select", function (item) {
        SetValueForSelect($("#province").val(), item.currentTarget.value);
    })

    $("#ward").on("select2:select", function (item) {
        SetValueForSelect($("#province").val(), $("#district").val(), item.currentTarget.value);
    })

    $("#provinceTo").on("select2:select", function (item) {
        SetValueForSelectTo(item.currentTarget.value);
    })

    $("#districtTo").on("select2:select", function (item) {
        SetValueForSelectTo($("#provinceTo").val(), item.currentTarget.value);
    })

    $("#wardTo").on("select2:select", function (item) {
        SetValueForSelectTo($("#provinceTo").val(), $("#districtTo").val(), item.currentTarget.value);
    })

    $("#sender-address").keyup(function (e) {
        if (e.keyCode == 13) {
            initMapFrom();
        }
    });
    $("#receiver-address").keyup(function (e) {
        if (e.keyCode == 13) {
            initMapTo();
        }
    });
    $('.cancel-request').on('click', function () {
        clearForm();
    });
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
    var latFrom = 0;
    var lngFrom = 0;
    var senderId = 0;
    var hubSenderId = 0;
    var wardSenderId = 0;
    var districtSenderId = 0;
    var citySenderId = 0;
    var fromStreetId;

    var wardSenderCode = 0;
    var districtSenderCode = 0;
    var citySenderCode = 0;

    var firstLoad = true;
    var latTo = 0, lngTo = 0, toHubId = null, toWardId = null, toDistrictId = null, toProvinceId = null;
    loadInfo();
    initMapFrom();
    LoadSenderForm($("#sender-address").val());
    SetValueForSelectTo(1, 0, 0);
    initMapTo();
    $("#ladingFrom").validationEngine('attach', {
        'custom_error_messages': {
            '.sender-name': {
                'required': {
                    'message': "* Ho tên người gửi không được để trống!"

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
            '.number': {
                'required': {
                    'message': "* Số kiện không được để trống!"
                },
                'min': {
                    'message': "* Số kiện phải lớn hơn 0!"
                }
            }
        },
        promptPosition: "inline"
    });




    $('#ladingFrom')
        .find('[name="province"]')
        .select2()
        // Revalidate the color when it is changed
        .change(function (e) {
            $('#ladingFrom').formValidation('revalidateField', 'province');
        })
        .end()
        .find('#district')
        .select2()
        // Revalidate the color when it is changed
        .change(function (e) {
            $('#ladingFrom').formValidation('revalidateField', 'district');
        })
        .end()
        .find('#ward')
        .select2()
        // Revalidate the color when it is changed
        .change(function (e) {
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
                                var options = validator.getFieldElements('province').val();
                                return (options != null, options >= 1);
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
                                var options = validator.getFieldElements('district').val();
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
                                var options = validator.getFieldElements('ward').val();
                                return (options >= 1);
                            }
                        }
                    }
                }
            }
        });




    $(".send-request").on("click", function () {
        sys.Loading();
        if ($('#ladingFrom').validationEngine('validate') && $('#ladingFrom').find('#province').select2()) {
            //
            var request = new Object();
            request.orderDate = sys.formatDateTimeSQL(new Date());
            request.fromStreetId = fromStreetId;
            request.senderId = senderId;
            request.senderName = $('.sender-name').val();
            request.senderPhone = $('.sender-phone').val();
            request.pickingAddress = $('.sender-address').val();
            request.fromWardId = wardSenderId;
            request.fromProvinceId = citySenderId;
            request.fromDistrictId = districtSenderId;
            request.cusNote = $('.note').val();
            if ($('.weight').val() || $('.weight').val() < 0) {
                request.weight = 0;
            } else {
                request.weight = $('.weight').val();
            }
            request.totalBox = $('.number').val();
            request.fromHubId = hubSenderId;
            //
            if ($('.receiver-name').val() && $('.receiver-phone').val() && $('.receiver-address').val()) {
                request.latTo = latTo;
                request.lngTo = lngTo;
                request.receiverName = $('.receiver-name').val();
                request.receiverPhone = $('.receiver-phone').val();
                request.shippingAddress = $('.receiver-address').val();
                request.toHubId = toHubId;
                request.toProvinceId = toProvinceId;
                request.toDistrictId = toDistrictId;
                request.toWardId = toWardId;
            }
            //request.
            request.latFrom = latFrom;
            request.lngFrom = lngFrom;
            request.currentLat = latFrom;
            request.currentLng = lngFrom;
            request.location = $('.sender-address').val();
            request.shipmentStatusId = 1;
            //
            var token = $.cookie('token');
            $.when(sys.CallAjaxPostasync(apiCustomer + "/requestshipment/Create", request, token)).done(function (data) {
                if (data.isSuccess) {
                    $(".success").html('Gửi yêu cầu nhận hàng thành công.').slideDown(1000).delay(15000).slideUp('slow');
                    clearForm();
                    sys.HideLoading();
                } else {
                    $(".error").html("Tạo yêu cầu nhận hàng thất bại!").show();
                    sys.HideLoading();
                }
            });
        } else {
            $(".error").html("Vui lòng nhập đầy đủ thông tin yêu cầu nhận hàng!").slideDown(1000).delay(3000).slideUp(2000);
            sys.HideLoading();
        }
    });

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
                SetValueForSelect(0, 0, 0);
                return;
            } else {
                LoadSenderForm(place.formatted_address, place);
            }
        });
    }


    function LoadSenderForm(addressFrom, place = null) {
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
                    address: addressFrom,
                    key: KeyGoogle
                },
                dataType: 'json',
                success: function (data, textStatus) {
                    var address = place ? place : data.results[0];
                    if (!data.results[0] || !data.results[0].geometry) {
                        //window.alert("Không tìm thấy thông tin địa chỉ: '" + addressFrom + "'");
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
                            key: KeyGoogle
                        },
                        async: true,
                        dataType: 'json',
                        success: function (data, textStatus) {
                            var addr = data.results[0].address_components;
                            var districtName, stateName, stateID, districtID, wardName, streetName;
                            for (var i = 0; i < addr.length; i++) {
                                var addressType = addr[i].types;
                                if (addressType[0] == 'administrative_area_level_1') {
                                    stateName = addr[i][componentForm[addressType[0]]];
                                }
                                if (addressType[0] == 'administrative_area_level_2') {
                                    districtName = addr[i][componentForm[addressType[0]]];
                                }
                                if (addressType[0] == 'administrative_area_level_3') {
                                    wardName = addr[i][componentForm[addressType[0]]];
                                }
                                if (addressType[0] == 'route') {
                                    streetName = addr[i][componentForm[addressType[0]]];
                                }
                            }
                            //if (!stateName || !districtName || !wardName) {
                            //    SetValueForSelect(0, 0, 0);
                            //    return;
                            //}

                            $.when(sys.CallAjaxasync(apiCustomer + '/street/getStreetByName', { name: streetName }, token)).done(function (res) {
                                console.log(res);
                                if (res.isSuccess) {
                                    fromStreetId = res.data[0].id
                                }
                            })

                            var token = $.cookie('token');
                            $.when(sys.CallAjaxasync(apiCustomer + '/province/GetProvinceByName', { name: stateName }, token)).done(function (data1) {
                                if (data1.isSuccess) {
                                    var pro = data1.data;
                                    citySenderId = pro.id;
                                    citySenderCode = pro.id;

                                    //SetValueForSelect(citySenderId);
                                    $("#province").val(pro.id).trigger("change");

                                    $.when(sys.CallAjaxasync(apiCustomer + '/district/GetDistrictByName', { name: districtName, provinceId: citySenderId }, token)).done(function (data2) {
                                        if (data2.isSuccess) {
                                            var dis = data2.data;
                                            districtSenderId = dis.id;
                                            districtSenderCode = dis.code;

                                            //SetValueForSelect(citySenderId, districtSenderId);
                                            $("#district").val(dis.code).trigger("change");

                                            $.when(sys.CallAjaxasync(apiCustomer + '/ward/GetWardByName', { name: wardName, districtId: districtSenderId }, token)).done(function (data3) {
                                                if (data3.isSuccess) {
                                                    var ward = data3.data;
                                                    wardSenderId = ward.id;
                                                    wardSenderCode = ward.code;

                                                    //SetValueForSelect(citySenderId, districtSenderId, wardSenderId);
                                                    $("#ward").val(ward.code).trigger("change");

                                                    $.when(sys.CallAjaxasync(apiCustomer + '/hub/GetHubByWardId', { wardId: wardSenderId }, token)).done(function (data4) {
                                                        if (data4.isSuccess && data4.data != null) {
                                                            var hub = data4.data;
                                                            hubSenderId = hub.id;
                                                        }
                                                    });
                                                }
                                                else {
                                                    wardSenderId = 0;
                                                    wardSenderCode = 0;
                                                }
                                            });
                                        }
                                        else {
                                            districtSenderId = 0;
                                            districtSenderCode = 0;
                                        }
                                    });
                                    SetValueForSelect(citySenderId, districtSenderId, wardSenderId);
                                    $("#province").val(citySenderId).trigger("change");
                                    $("#district").val(districtSenderId).trigger("change");
                                    $("#ward").val(wardSenderId).trigger("change");
                                }
                            });
                        }
                    });
                }
            });
        }
    }

    function initMapTo() {
        var options = {
            componentRestrictions: { 'country': ['vi', 'vn'] }
        };
        var input = document.getElementById("receiver-address");
        var autocomplete = new google.maps.places.Autocomplete(input, options);
        autocomplete.addListener('place_changed', function () {
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                //$(".error").html("Địa chỉ: '" + place.name + "' không hợp lệ.").slideDown(1000).delay(5000).slideUp('slow');
                window.alert("Không tìm thấy thông tin địa chỉ: '" + place.name + "'");
                SetValueForSelectTo(0, 0, 0);
                return;
            } else {
                LoadAddressTo(place.formatted_address);
            }
        });
    }

    function LoadAddressTo(addressTo) {
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
        if (addressTo) {
            $.ajax({
                url: 'https://maps.googleapis.com/maps/api/geocode/json',
                data: {
                    sensor: false,
                    address: addressTo,
                    key: KeyGoogle
                },
                dataType: 'json',
                success: function (data, textStatus) {
                    var address = data.results[0];
                    if (!data.results[0] || !data.results[0].geometry) {
                        //window.alert("Không tìm thấy thông tin địa chỉ: '" + addressFrom + "'");
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
                            key: KeyGoogle
                        },
                        async: true,
                        dataType: 'json',
                        success: function (data, textStatus) {
                            var addr = data.results[0].address_components;
                            var districtName = '', stateName = '', stateID = '', districtID = '', wardName = '';
                            for (var i = 0; i < addr.length; i++) {
                                var addressType = addr[i].types;
                                if (addressType[0] == 'administrative_area_level_1') {
                                    stateName = addr[i][componentForm[addressType[0]]];
                                }
                                if (addressType[0] == 'administrative_area_level_2') {
                                    districtName = addr[i][componentForm[addressType[0]]];
                                }
                                if (addressType[0] == "administrative_area_level_3") {
                                    wardName = addr[i][componentForm[addressType[0]]];
                                }
                            }
                            var token = $.cookie('token');
                            $.when(sys.CallAjaxasync(apiCustomer + '/province/GetProvinceByName', { name: stateName }, token)).done(function (data1) {
                                if (data1.isSuccess) {
                                    var pro = data1.data;
                                    toProvinceId = pro.id;
                                    $.when(sys.CallAjaxasync(apiCustomer + '/district/GetDistrictByName', { name: districtName, provinceId: toProvinceId }, token)).done(function (data2) {
                                        if (data2.isSuccess) {
                                            var dis = data2.data;
                                            toDistrictId = dis.id;
                                            $.when(sys.CallAjaxasync(apiCustomer + '/ward/GetWardByName', { name: wardName, districtId: toDistrictId }, token)).done(function (data3) {
                                                if (data3.isSuccess) {
                                                    var ward = data3.data;
                                                    toWardId = ward.id;
                                                    $.when(sys.CallAjaxasync(apiCustomer + '/hub/GetHubByWardId', { wardId: toWardId }, token)).done(function (data4) {
                                                        if (data4.isSuccess && data4.data != null) {
                                                            var hub = data4.data;
                                                            toHubId = hub.id;
                                                        } else {
                                                            toHubId = null;
                                                        }
                                                    });
                                                } else {
                                                    toWardId = null;
                                                }
                                            });
                                        } else {
                                            toDistrictId = null;
                                        }
                                    });
                                    SetValueForSelectTo(toProvinceId, toDistrictId, toWardId);
                                    $("#provinceTo").val(toProvinceId).trigger("change");
                                    $("#districtTo").val(toDistrictId).trigger("change");
                                    $("#wardTo").val(toWardId).trigger("change");
                                } else {
                                    toProvinceId = null;
                                }
                            });
                        }
                    });
                }
            });
        }
    }


    function loadInfo() {
        var token = $.cookie('token');
        $.when(sys.CallAjaxasync(apiCustomer + '/Account/GetCurrentInfo', null, token)).done(function (data) {
            if (data.isSuccess) {
                var info = data.data;
                $('.sender-name').val(info.name);
                $('.sender-phone').val(info.phoneNumber);
                $('.sender-address').val(info.address);
                $('.receiver-address-note').val(info.addressNote);
                $('.sender-company').val(info.nameEn);
                districtSenderId = info.districtId;
                citySenderId = info.provinceId;
                wardSenderId = info.wardId;
                senderId = info.id;
                $.when(sys.CallAjaxasync(apiCore + '/hub/GetHubByWardId', { wardId: wardSenderId }, token)).done(function (dataH) {
                    if (dataH.isSuccess && dataH.data != null) {
                        var hub = dataH.data;
                        hubSenderId = hub.id;
                    }
                });
            }
        });
    }

    function clearForm() {
        $('.weight').val(0);
        $('.number').val(1);
        $('.note').val('');
        loadInfo();
        LoadSenderForm($("#sender-address").val());
        $('.receiver-name').val('');
        $('.receiver-phone').val('');
        $('.receiver-address').val('');
    }


});

function SetValueForSelect(provinceId = 0, districtId = 0, wardId = 0) {
    var arrProvince = [{ id: 0, text: '--- Chọn tỉnh thành ---' }];
    var arrDistrict = [{ id: 0, text: '--- Chọn quận huyện ---' }];
    var arrWard = [{ id: 0, text: '--- Chọn phường xã ---' }];

    citySenderId = provinceId;
    districtSenderId = districtId;
    wardSenderId = wardId;

    //$("#province").select2({ data: null });
    //$("#district").select2({ data: null });
    //$("#ward").select2({ data: null });

    $("#province").empty().trigger('change');
    $("#district").empty().trigger('change');
    $("#ward").empty().trigger('change');

    GetAllProvince();
    if (provinceId == 0) {
        //$("#district").empty().trigger('change');
        //$("#ward").empty().trigger('change');
    }
    else {
        $("#province").val(provinceId).trigger("change");
        GetAllDistrictByProvinceID(provinceId);
        if (districtId == 0) {
            $("#ward").select2({
                data: arrWard
            });
        }
        else {
            $("#district").val(districtId).trigger("change");
            GetAllWardByDistriceID(districtId);
            $("#ward").val(wardId).trigger("change");
        }
    }
}

function SetValueForSelectTo(provinceId = 0, districtId = 0, wardId = 0) {
    var arrProvince = [{ id: 0, text: '--- Chọn tỉnh thành ---' }];
    var arrDistrict = [{ id: 0, text: '--- Chọn quận huyện ---' }];
    var arrWard = [{ id: 0, text: '--- Chọn phường xã ---' }];

    toProvinceId = provinceId;
    toDistrictId = districtId;
    toWardId = wardId;

    //$("#province").select2({ data: null });
    //$("#district").select2({ data: null });
    //$("#ward").select2({ data: null });

    $("#provinceTo").empty().trigger('change');
    $("#districtTo").empty().trigger('change');
    $("#wardTo").empty().trigger('change');

    GetAllProvinceTo();
    if (provinceId == 0) {
        //$("#district").empty().trigger('change');
        //$("#ward").empty().trigger('change');
    }
    else {
        $("#provinceTo").val(provinceId).trigger("change");
        GetAllDistrictByProvinceIDTo(provinceId);
        if (districtId == 0) {
            $("#wardTo").select2({
                data: arrWard
            });
        }
        else {
            $("#districtTo").val(districtId).trigger("change");
            GetAllWardByDistriceIDTo(districtId);
            $("#wardTo").val(wardId).trigger("change");
        }
    }
}

function GetAllProvince() {
    var token = $.cookie('token');
    $.when(sys.CallAjaxasync(apiCustomer + '/province/getProvince', null, token)).done(function (data) {
        if (data.isSuccess && data.data != null) {
            var arr = [{ id: 0, text: '--- Chọn tỉnh thành ---' }];
            data.data.forEach(function (element) {
                var obj = { id: element.id, text: element.name }
                arr.push(obj);
            });
            $("#province").select2({
                data: arr
            });
        }
    });
}

function GetAllProvinceTo() {
    var token = $.cookie('token');
    $.when(sys.CallAjaxasync(apiCustomer + '/province/getProvince', null, token)).done(function (data) {
        if (data.isSuccess && data.data != null) {
            var arr = [{ id: 0, text: '--- Chọn tỉnh thành ---' }];
            data.data.forEach(function (element) {
                var obj = { id: element.id, text: element.name }
                arr.push(obj);
            });
            $("#provinceTo").select2({
                data: arr
            });
        }
    });
}

function GetAllDistrictByProvinceID(provinceId) {
    var token = $.cookie('token');
    $.when(sys.CallAjaxasync(apiCustomer + '/district/GetDistrictByProvince?provinceId=' + provinceId, null, token)).done(function (data) {
        if (data.isSuccess && data.data != null) {
            var arr = [{ id: 0, text: '--- Chọn quận huyện ---' }];
            data.data.forEach(function (element) {
                var obj = { id: element.id, text: element.name }
                arr.push(obj);
            });
            $("#district").select2({
                data: arr
            });
        }
    });
}

function GetAllDistrictByProvinceIDTo(provinceId) {
    var token = $.cookie('token');
    $.when(sys.CallAjaxasync(apiCustomer + '/district/GetDistrictByProvince?provinceId=' + provinceId, null, token)).done(function (data) {
        if (data.isSuccess && data.data != null) {
            var arr = [{ id: 0, text: '--- Chọn quận huyện ---' }];
            data.data.forEach(function (element) {
                var obj = { id: element.id, text: element.name }
                arr.push(obj);
            });
            $("#districtTo").select2({
                data: arr
            });
        }
    });
}

function GetAllWardByDistriceID(districtId) {
    var token = $.cookie('token');
    $.when(sys.CallAjaxasync(apiCustomer + '/ward/GetWardByDIstrict?districtId=' + districtId, null, token)).done(function (data) {
        if (data.isSuccess && data.data != null) {
            var arr = [{ id: 0, text: '--- Chọn phường xã ---' }];
            data.data.forEach(function (element) {
                var obj = { id: element.id, text: element.name }
                arr.push(obj);
            });
            $("#ward").select2({
                data: arr
            });
        }
    });
}

function GetAllWardByDistriceIDTo(districtId) {
    var token = $.cookie('token');
    $.when(sys.CallAjaxasync(apiCustomer + '/ward/GetWardByDIstrict?districtId=' + districtId, null, token)).done(function (data) {
        if (data.isSuccess && data.data != null) {
            var arr = [{ id: 0, text: '--- Chọn phường xã ---' }];
            data.data.forEach(function (element) {
                var obj = { id: element.id, text: element.name }
                arr.push(obj);
            });
            $("#wardTo").select2({
                data: arr
            });
        }
    });
}

function getHub(wardId) {
    var token = $.cookie('token');
    $.when(sys.CallAjaxasync(apiCustomer + '/hub/GetHubByWardId', { wardId: wardId }, token)).done(function (data) {
        if (data.isSuccess && data.data != null) {
            var hub = data.data;
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

function getWard(name, districtId) {
    var token = $.cookie('token');
    $.when(sys.CallAjaxasync(apiCustomer + '/ward/GetWardByName', { name: name, districtId: districtId }, token)).done(function (data) {
        if (data.isSuccess) {
            var ward = data.data;
            return ward.id;
        }
    });
}


