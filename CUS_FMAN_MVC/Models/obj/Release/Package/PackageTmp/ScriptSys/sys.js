var App = function () {

    var isRTL = false;
    var isIE8 = false;
    var isIE9 = false;
    var isIE10 = false;

    var assetsPath = '/';
    var globalImgPath = 'Content/images/';
    var resizeHandlers = [];
    //Method
    var getToken = function () {
        var json = Cookies.getJSON('token');
        if (json) {
            return json;
        } return null;
    };
    // Handle Select2 Dropdowns
    var handleInit = function () {

        if ($('body').css('direction') === 'rtl') {
            isRTL = true;
        }

        isIE8 = !!navigator.userAgent.match(/MSIE 8.0/);
        isIE9 = !!navigator.userAgent.match(/MSIE 9.0/);
        isIE10 = !!navigator.userAgent.match(/MSIE 10.0/);

        if (isIE10) {
            $('html').addClass('ie10'); // detect IE10 version
        }

        if (isIE10 || isIE9 || isIE8) {
            $('html').addClass('ie'); // detect IE10 version
        }
    };
    var handleSelect2 = function () {
        if ($().select2) {
            $.fn.select2.defaults.set("theme", "bootstrap");
            $('select').each(function () {
                var $this = $(this);
                $this.select2({
                    placeholder: $this.data("placeholder"),
                    width: 'auto',
                    allowClear: true
                });
            })
        }
    };
    // Handle DateTimePicker 
    var handleDateTimePicker = function () {
        if ($().datetimepicker) {
            $('.datepicker').datetimepicker({
                format: 'DD/MM/YYYY'
            });
        }
    };
    var handleAddress = function (id, position) {
        var input = document.getElementById(id);
        if (position) {
            $(input).after('<div class="current-position" title="Hiển thị vị trị hiện tại"><i class="fa fa-location-arrow"></i></div>');
            $(input).closest("div").on('click', ".current-position", function (e) {
                getPosition(e);
            });
        }
        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.addListener('place_changed', function (e) {
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                window.alert("No details available for input: '" + place.name + "'");
                return;
            }
            setGeocoder({ latlng: place.geometry.location, event: $(input) });
        });
    }
    var setGeocoder = function (options) {
        var defaults = {
            latlng: "",
            event: undefined
        }
        o = $.extend(defaults, options);
        var element;
        if (o.event) {
            element = o.event.target || o.event;
        }
        if (element) {
            var $wrapper = $(element).closest(".map-wrapper");
            var geocoder = new google.maps.Geocoder();
            if (geocoder) {
                geocoder.geocode({ 'location': o.latlng }, function (results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        var geocoder = results[0];
                        var components = geocoder.address_components;
                        var cityName = "", districtName = "";
                        $.each(components, function (i, v) {
                            if (v.types[0] === "administrative_area_level_1") {
                                cityName = v.short_name;
                            } else if (v.types[0] === "administrative_area_level_2") {
                                districtName = v.short_name;
                            }
                        });
                        if (cityName && districtName) {
                            $.when(App.handleAjaxGet({ url: "https://capi.nascoexpress.com/api/Location/GetLocaitonMapping", params: { cityName: cityName, districtName: districtName }, event: o.event })).done(function (data) {
                                if (data) {
                                    if (data.error === 0) {
                                        $wrapper.find(".city").val(data.data.cityId);
                                        $wrapper.find(".district").val(data.data.districtId);
                                        $wrapper.find(".lat").val(geocoder.geometry.location.lat());
                                        $wrapper.find(".lng").val(geocoder.geometry.location.lng());
                                        if ($(element).closest(".current-position").hasClass("current-position")) {
                                            $wrapper.find(".address").val(geocoder.formatted_address);
                                        }
                                        $wrapper.find(".address").trigger("change");
                                    }
                                }
                            });
                        }
                    }
                    else {
                        console.log("Geocoding failed: " + status);
                    }
                });
            }
        }
    }
    var getPosition = function (event) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (postition) {
                var lat = postition.coords.latitude;
                var lng = postition.coords.longitude;
                var latlng = new google.maps.LatLng(lat, lng);
                setGeocoder({ latlng: latlng, event: event });
            }, function (err) {
                if (err.code === 0) {
                    // Unknown error
                }
                if (err.code === 1) {
                    App.notify(1, "Cho phép lấy vị trí đã bị chặn.");
                }
                if (err.code === 2) {
                    App.notify(1, "Không thể xác định vị trí của bạn.");
                }
                if (err.code === 3) {
                    App.notify(1, "Time out");
                }
            });
        } else {
            App.notify(1, "Lấy vị trí hiện tại không hỗ trợ cho trình duyệt này.");
        }
    }
    var handleSearchBox = function () {

    }
    //Begin Validate
    var validateEmail = function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    //End Validate
    return {
        init: function () {
            handleDateTimePicker();
            handleSearchBox();
            handleInit();
            handleSelect2();
        },
        isRTL: function () {
            return isRTL;
        },
        initMap: function (callback) {
            if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
                url = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCfqPJqJnthPCSdgAs4pn1Gcc5RZrElg3U&libraries=places&callback=" + callback;
            }
            else {
                url = "https://maps.googleapis.com/maps/api/js?key=AIzaSyATzgv59sgNUWPRFGUJF5k8LRKJ291V0mY&libraries=places&callback=" + callback;
            }
            $.getScript(url, function (data, textStatus, jqxhr) {
                //console.log(data); // Data returned
                //console.log(textStatus); // Success
                //console.log(jqxhr.status); // 200
                //console.log("Load was performed.");
            });
        },
        handleAjaxPost: function (options) {
            var defaults = {
                url: "",
                params: {},
                async: true,
                event: undefined,
            },
                o = $.extend(defaults, options)
            var element;
            if (o.event) {
                element = o.event.target || o.event;
            }
            return $.ajax({
                url: o.url,
                type: "POST",
                data: JSON.stringify(o.params),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: o.async,
                beforeSend: function (request) {
                    if ($(element).is(":button") || $(element).hasClass("btn") || $(element).hasClass("button")) {
                        App.loadingButton(element, true);
                    } else {
                        App.blockUI({ target: $(element), animate: true });
                    }
                    if (getToken()) {
                        request.setRequestHeader("Authorization", "Bearer " + getToken());

                    }
                },
                success: function (data, textStatus, xhr) {
                    //console.log(xhr.status);

                },
                complete: function (xhr, textStatus) {
                    if ($(element).is(":button") || $(element).hasClass("btn") || $(element).hasClass("button")) {
                        App.loadingButton(element, false);
                    } else {
                        App.unblockUI(element);
                    }
                }
            });
        },
        handleAjaxGet: function (options) {
            var defaults = {
                url: "",
                params: {},
                async: true,
                event: undefined,
            },
                o = $.extend(defaults, options)
            var element;
            if (o.event) {
                element = o.event.target || o.event;
            }
            return $.ajax({
                Type: "GET",
                url: o.url,
                data: o.params,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: o.async,
                beforeSend: function (request) {
                    if ($(element).is(":button") || $(element).hasClass("btn") || $(element).hasClass("button")) {
                        App.loadingButton(element, true);
                    } else {
                        App.blockUI({ target: $(element), animate: true });
                    }
                    if (getToken()) {
                        request.setRequestHeader("Authorization", "Bearer " + getToken());

                    }
                },
                success: function (data, textStatus, xhr) {
                    //  console.log(xhr.status);
                },
                complete: function (xhr, textStatus) {
                    //console.log(xhr.status);
                    if ($(element).is(":button") || $(element).hasClass("btn") || $(element).hasClass("button")) {
                        App.loadingButton(element, false);
                    } else {
                        App.unblockUI(element);
                    }
                }
            });
        },
        loadingButton: function (button, loading) {
            if (button) {
                var $this = $(button);
                if (loading) {
                    $this.attr("data-loading-text", "<i class='fa fa-spinner fa-spin '></i>Lading");
                    $this.button('loading');
                } else {
                    $this.button('reset');
                }
            }
        },
        getViewPort: function () {
            var e = window,
                a = 'inner';
            if (!('innerWidth' in window)) {
                a = 'client';
                e = document.documentElement || document.body;
            }

            return {
                width: e[a + 'Width'],
                height: e[a + 'Height']
            };
        },
        addResizeHandler: function (func) {
            resizeHandlers.push(func);
        },
        // wrApper function to scroll(focus) to an element
        scrollTo: function (el, offeset) {
            var pos = (el && el.size() > 0) ? el.offset().top : 0;

            if (el) {
                if ($('body').hasClass('page-header-fixed')) {
                    pos = pos - $('.page-header').height();
                } else if ($('body').hasClass('page-header-top-fixed')) {
                    pos = pos - $('.page-header-top').height();
                } else if ($('body').hasClass('page-header-menu-fixed')) {
                    pos = pos - $('.page-header-menu').height();
                }
                pos = pos + (offeset ? offeset : -1 * el.height());
            }

            $('html,body').animate({
                scrollTop: pos
            }, 'slow');
        },
        validateEmail: validateEmail,

        getURLParameter: function (paramName) {
            var searchString = window.location.search.substring(1),
                i, val, params = searchString.split("&");

            for (i = 0; i < params.length; i++) {
                val = params[i].split("=");
                if (val[0] === paramName) {
                    return unescape(val[1]);
                }
            }
            return null;
        },

        blockUI: function (options) {
            options = $.extend(true, {}, options);
            var html = '';
            if (options.animate) {

                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '">' + '<div class="sk-cube-grid"><div class="sk-cube sk-cube1"></div><div class="sk-cube sk-cube2"></div> <div class="sk-cube sk-cube3"></div><div class="sk-cube sk-cube4"></div><div class="sk-cube sk-cube5"></div><div class="sk-cube sk-cube6"></div><div class="sk-cube sk-cube7"></div><div class="sk-cube sk-cube8"></div><div class="sk-cube sk-cube9"></div></div>' + '</div>';
            } else if (options.iconOnly) {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="' + this.getGlobalImgPath() + 'loading-spinner-grey.gif" align=""></div>';
            } else if (options.textOnly) {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><span>&nbsp;&nbsp;' + (options.message ? options.message : 'LOADING...') + '</span></div>';
            } else {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="' + this.getGlobalImgPath() + 'loading-spinner-grey.gif" align=""><span>&nbsp;&nbsp;' + (options.message ? options.message : 'LOADING...') + '</span></div>';
            }

            if (options.target) { // element blocking
                var el = $(options.target);
                if (el.height() <= ($(window).height())) {
                    options.cenrerY = true;
                }
                el.block({
                    message: html,
                    baseZ: options.zIndex ? options.zIndex : 1000,
                    centerY: options.cenrerY !== undefined ? options.cenrerY : false,
                    css: {
                        top: '10%',
                        border: '0',
                        padding: '0',
                        backgroundColor: 'none'
                    },
                    overlayCSS: {
                        backgroundColor: options.overlayColor ? options.overlayColor : '#555',
                        opacity: options.boxed ? 0.05 : 0.1,
                        cursor: 'wait'
                    }
                });
            } else { // page blocking
                $.blockUI({
                    message: html,
                    baseZ: options.zIndex ? options.zIndex : 1000,
                    css: {
                        border: '0',
                        padding: '0',
                        backgroundColor: 'none'
                    },
                    overlayCSS: {
                        backgroundColor: options.overlayColor ? options.overlayColor : '#555',
                        opacity: options.boxed ? 0.05 : 0.1,
                        cursor: 'wait'
                    }
                });
            }
        },

        // Wrapper function to  un-block element(finish loading)
        unblockUI: function (target) {
            if (target) {
                $(target).unblock({
                    onUnblock: function () {
                        $(target).css('position', '');
                        $(target).css('zoom', '');
                    }
                });
            } else {
                $.unblockUI();
            }
        },
        startPageLoading: function (options) {
            if (options && options.animate) {
                $('.page-spinner-bar').remove();
                $('body').append('<div class="page-spinner-bar"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
            } else {
                $('.page-loading').remove();
                $('body').append('<div class="page-loading"><img src="' + this.getGlobalImgPath() + 'loading-spinner-grey.gif"/>&nbsp;&nbsp;<span>' + (options && options.message ? options.message : 'Loading...') + '</span></div>');
            }
        },

        stopPageLoading: function () {
            $('.page-loading, .page-spinner-bar').remove();
        },

        alert: function (options) {

        },

        getAssetsPath: function () {
            return assetsPath;
        },

        setAssetsPath: function (path) {
            assetsPath = path;
        },

        setGlobalImgPath: function (path) {
            globalImgPath = path;
        },

        getGlobalImgPath: function () {
            return assetsPath + globalImgPath;
        },
        getResponsiveBreakpoint: function (size) {
            // bootstrap responsive breakpoints
            var sizes = {
                'xs': 480,     // extra small
                'sm': 768,     // small
                'md': 992,     // medium
                'lg': 1200     // large
            };

            return sizes[size] ? sizes[size] : 0;
        },
        handleAddress: handleAddress,
        notify: function (error, message) {
            var type = "info";
            if (error) {
                type = "danger";
            }
            $.notify({
                message: message
            }, {
                    type: type,
                    z_index: 100000,
                    delay: 5000,
                });
        },
        getPosition: getPosition
    };

}();

$(function () {
    App.init();
    $(document).ajaxError(function (event, jqxhr, settings, exception) {
        if (jqxhr.status === 401) {
            $.alert({
                title: 'Lỗi !',
                content: 'Vui lòng đăng nhập để sử dụng chức năng này!',
                type: 'red'
            });
            return false;
        }
    });
});
