var map,
        iconuser = '/Content/img/iconbox.png',
        iconoffice = "/content/img/office.png";
$(document).ready(function () {
    _initMap();
    $('.txt-searchM').on("change", function () {
        setMapOnAll(null);
        _GetAllDataTracking($('.txt-searchM').val().trim());
    });
    $('.bt-searchM').on("click", function () {
        setMapOnAll(null);
        _GetAllDataTracking($('.txt-searchM').val().trim());
    });
});

function _initMap() {
    map = new google.maps.Map(document.getElementById('map_canvastracking'), {
        center: { lat: 16.449840, lng: 107.562529 },
        zoom: 6,
        disableDefaultUI: false,
        scaleControl: true
    });
    _GetAllDataOffice();

};

function _GetAllDataOffice() {
    $.when(sys.CallAjaxasync("/Lading/_GetPostOffice")).done(function (data) {
        if (data !== null) {
            $.each(data, function (k, v) {
                var contenstring = "<span>Tên: " + v.POName + "</span></br> <span>ĐT: " + v.POPhone + "</span> </br>  <span>Email: " + v.POEmail + "</span>";
                _addMarker(new google.maps.LatLng(v.Lat, v.Lng), contenstring, iconoffice, 0, 1, "BƯU CỤC VIETSTAR", 2);
            });
        }
    });
}//Lấy địa chỉ bưu cục

function _GetAllDataTracking(listCode) {
    sys.Loading();
    if (listCode != null && listCode != '') {
        $.when(sys.CallAjaxasync("/Lading/_GetAllDataTracking", { listCode: listCode })).done(function (data) {
            if (data !== null) {
                $.each(data, function (k, v) {
                    var contenstring = "<span>Mã đơn hàng: " + v.Code + "</span></br> <span>Trạng thái: " + v.StatusName + "</span> </br>  <span>Chi tiết đơn hàng: " + v.Description + "</span>";
                    _addMarker(new google.maps.LatLng(v.LatFrom, v.LngFrom), contenstring, iconuser, v.Id, 10, "Double click xem chi tiết", 1);
                });

            }
        });
    }
    sys.HideLoading();
}
//lấy dât tracking
var markersArray = [];
// function addMarker Postoffice
function _addMarker(location, contentString, icon, iduser, index, name, type) {

    var marker = new google.maps.Marker({
        position: location,
        map: map,
        zIndex: index,
        title: name,
        icon: icon,
        id: iduser
    });
    if (type == 1) {
        markersArray.push(marker);
    }
    //set event
    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    map.setCenter(location);

    google.maps.event.addListener(marker, 'mouseover', function () {
        infowindow.open(map, marker);
    });

    google.maps.event.addListener(marker, 'mouseout', function () {
        infowindow.close();
    });
    google.maps.event.addListener(marker, 'click', function () {
        map.setZoom(16);
        map.setCenter(location);
        map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
    });
    google.maps.event.addListener(marker, 'dblclick', function () {
        if (iduser != null && iduser != 0 && iduser != '') {
            ViewDetail(iduser);
        }
    });
    google.maps.event.addListener(marker, 'rightclick', function () {
        map.setZoom(6);
        map.setCenter(location);
        map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
    });
};
function setMapOnAll(map) {
    for (var i = 0; i < markersArray.length; i++) {
        markersArray[i].setMap(map);
    }
}