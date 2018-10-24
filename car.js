var car = (function () {
    var car = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': "/geometry-library-master/",
        'dataType': "json",
        'success': function (data) {
            car = data;
        }
    });
    return car;
})();



var json_route_point = (function () {
    var json_route_point = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': "/admin-transit/API/JSON/route/",
        'dataType': "json",
        'success': function (data) {
            json_route_point = data;
        }
    });
    return json_route_point;
})();

var json_station = (function () {
    var station = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': "/admin-transit/API/JSON/station/",
        'dataType': "json",
        'success': function (data) {
            station = data;
        }
    });
    return station;
})();


var position = {lat: 18.787635, lng: 98.985683};
var array_result = [];
var array_marker = [];
var array_postion = [];
var array_delta = [];
var array_polygon = [];
var icon = null;
var interval = null;
var interval_car = null;
var flightAllPath = [];
var flightPath;
//First ICON
var BS_special = '/admin-transit/image/icon_station/point.png';
var array_station = [];
var icon_current = "all";
var car_realtime = null;
function initialize() {


    var latlng = new google.maps.LatLng(position.lat, position.lng);
    var myOptions = {
        zoom: 14,
        maxZoom: 19,
        minZoom: 13,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControl: false,
        mapTypeControl: false,
        // scaleControl: boolean,
        streetViewControl: false,
        // rotateControl: boolean,
        fullscreenControl: false
    };
    map = new google.maps.Map(document.getElementById("mapCanvas"), myOptions);
    info = new google.maps.InfoWindow();


    interval_car = setInterval(function() {
            var car = (function () {
                var car = null;
                $.ajax({
                    'async': false,
                    'global': false,
                    'url': "/geometry-library-master/",
                    'dataType': "json",
                    'success': function (data) {
                        car = data;
                    }
                });
                return car;
            })();
            car_realtime = car
        },
        4000);

    route("all");
}

function setMapOnCar(map) {
    for (var i = 0; i <= array_marker.length-1; i++) {
        array_marker[i].setMap(map);
    }
    array_result = [];
    array_marker = [];
    array_postion = [];
    array_delta = [];
}


function make_array_result(route,carB1,xi) {
    array_result[xi] = {
        lat: parseFloat(carB1.LaGoogle),
        lng: parseFloat(carB1.LongGoogle),
        direction: parseFloat(carB1.Direction),
        type: carB1.Detail,
        car: carB1
    };


    // if (carB1.busstop != null) {
    //
    //
    //     var car_select = [];
    //     for (var i = 0; i <= car_realtime.length - 1; i++) {
    //
    //
    //         //fix bus_stop_name
    //         if (car_realtime[i].Type == carB1.Type) {
    //             car_select.push(car_realtime[i]);
    //         }
    //
    //
    //     }
    //
    //
    //     var str = estimate_time('ท่าอากาศยานเชียงใหม่ ');
    //     var content = '';
    //
    //     for (var i = 0; i <= str.length - 1; i++) {
    //         content += "<br> สาย " + str[i].type;
    //     }
    //
    //     //estimate time
    //     // for (var i = 0; i <= car_select.length-1; i++) {
    //     //     content += "<br> เวราโดยประมาณ "+car_select[i].LaGoogle+"-"+convert_car_detail(car_select[i].Detail);
    //     // }
    //
    //
    //     for (var i = 0; i <= str.length - 1; i++) {
    //         $('#station-' + str[i].station_id + '-' + str[i].type).html(str[i].station_name + content);
    //     }
    //
    //
    // }
}

var select_click_marker = null;
var old_marker = null;
function route(route) {
    if(select_click_marker!=null){
        select_click_marker.setMap(null);
    }

    //fisx zoom
    if(route=="all"){
        map.panTo(new google.maps.LatLng(18.779635,98.985683));
        map.setZoom(13)
    }
    if(route=="B1G"){
        map.panTo(new google.maps.LatLng(18.795200111675282,98.9846836176456 ));
        map.setZoom(15)
    }
    if(route=="B2G"){
        map.panTo(new google.maps.LatLng(18.782198989853505,98.99794445901523 ));
        map.setZoom(15)
    }
    if(route=="B3G"){
        map.panTo(new google.maps.LatLng(18.81756183185502,98.98917149228771));
        map.setZoom(14)
    }
    if(route=="R1G"){
        map.panTo(new google.maps.LatLng(18.798626904434478,98.98471332486304));
        map.setZoom(15)
    }
    if(route=="R1P"){
        map.panTo(new google.maps.LatLng(18.798626904434478,98.98471332486304));
        map.setZoom(15)
    }
    if(route=="R2B"){
        map.panTo(new google.maps.LatLng(18.771028113232145,99.01241603877679));
        map.setZoom(15)
    }
    if(route=="R3R"){
        map.panTo(new google.maps.LatLng(18.78264581773621,98.98655669839775 ));
        map.setZoom(15)
    }
    if(route=="R3Y"){
        map.panTo(new google.maps.LatLng(18.78264581773621,98.98655669839775 ));
        map.setZoom(15)
    }
    if(route=="KWG"){
        map.panTo(new google.maps.LatLng(  18.753044288561885,98.9752914205352));
        map.setZoom(12)
    }




    icon_current = route;
    clearInterval(interval);
    removeLine();
    setMapOnCar(null);


    interval = setInterval(function() {
            var xi = 0;
            $.getJSON("/geometry-library-master/", function(jsonBus1) {
                $.each(jsonBus1, function(i, carB1) {


                    //for cm transit only
                    if (carB1.Type == "minibus" || carB1.Type == "bus" || carB1.Type == "kwvan") {
                        if (convert_car_detail(carB1.Detail) == route || route == "all") {
                            make_array_result(route,carB1,xi);
                            xi++;
                        }
                        // FOR FIX R1P ONLY
                        else if(route=="R1P"){

                        if(carB1.Detail=="R1"){
                            make_array_result(route,carB1,xi);
                            xi++;
                        }

                        }

                    }


                });
            });
// console.log(array_result.length-1);
            transition(array_result);

        },
        4000);

    var x = 0;

    for (var i = 0; i <= car.length-1; i++) {
        //for cm transit only
        if(car[i].Type=="minibus"||car[i].Type=="bus"||car[i].Type=="kwvan") {
            if (convert_car_detail(car[i].Detail) == route||route=="all") {
                var positions = {lat: parseFloat(car[i].LaGoogle), lng: parseFloat(car[i].LongGoogle)};
                array_postion.push(positions);

                latlng = new google.maps.LatLng(parseFloat(car[i].LaGoogle), parseFloat(car[i].LongGoogle));
                marker = new google.maps.Marker({
                    position: latlng,
                    map: map,
                    title: "Latitude:" + position.lat + " | Longitude:" + position.lng,
                    // icon: check_direction(car[i].Direction, car[i].Detail)
                    icon: '/admin-transit/image/icon_car/'+convert_car_detail(car[i].Detail)+'.png',
                    zIndex: i
                });

                // var content = '<span id="rating' + x + '">Data Loading<span>';
                // marker['infowindow'] = new google.maps.InfoWindow({
                //     content: content
                // });
                // google.maps.event.addListener(marker, 'click', function (e) {
                //     if (old_open != null) {
                //         old_open.close()
                //     }
                //     this['infowindow'].open(map, this);
                //     old_open = this['infowindow'];
                //
                // });

                google.maps.event.addListener(marker, 'click', (function(marker, i) {
                    return function() {
                        old_marker = marker;
                        var latlng = new google.maps.LatLng(marker.position.lat(),marker.position.lng());

                        document.getElementById("estimate_box_top").style.background = "blue";
                        document.getElementById("estimate_station_name").innerHTML = car[i].Registerid+"ssssssssssssssssss"+car[i].busstop;
                        map.panTo(latlng);
                        // map.setZoom(19)

                        if (select_click_marker != null) {
                            select_click_marker.setMap(null);
                        }
                        marker_animate = new google.maps.Marker({
                            position: latlng,
                            map: map,
                            icon: '/admin-transit/image/icon_station/current_station.png',
                            zIndex: 1000
                        });
                        select_click_marker = marker_animate;

                        select_click_marker.setAnimation(google.maps.Animation.BOUNCE);
                    }
                })(marker, i));

                x++;

                array_marker.push(marker);

            }
           // FOR FIX R1P ONLY
            else if(route=="R1P"){
                if(car[i].Detail=="R1"){
                    var positions = {lat: parseFloat(car[i].LaGoogle), lng: parseFloat(car[i].LongGoogle)};
                    array_postion.push(positions);

                    latlng = new google.maps.LatLng(parseFloat(car[i].LaGoogle), parseFloat(car[i].LongGoogle));
                    marker = new google.maps.Marker({
                        position: latlng,
                        map: map,
                        title: "Latitude:" + position.lat + " | Longitude:" + position.lng,
                        // icon: check_direction(car[i].Direction, car[i].Detail)
                        icon: '/admin-transit/image/icon_car/R1P.png',
                        zIndex: i
                    });
                    // var content = '<span id="rating' + x + '">Data Loading<span>';
                    // marker['infowindow'] = new google.maps.InfoWindow({
                    //     content: content
                    // });
                    //

                    // google.maps.event.addListener(marker, 'click', function (e) {
                    //     if (old_open != null) {
                    //         old_open.close()
                    //     }
                    //     this['infowindow'].open(map, this);
                    //     old_open = this['infowindow'];
                    //
                    // });

                    google.maps.event.addListener(marker, 'click', (function(marker, i) {
                        return function() {
                            old_marker = marker;
                            var latlng = new google.maps.LatLng(marker.position.lat(),marker.position.lng());

                            document.getElementById("estimate_box_top").style.background = "blue";
                            document.getElementById("estimate_station_name").innerHTML = car[i].Registerid+"ssssssssssssssssss"+car[i].busstop;
                            map.panTo(latlng);
                            // map.setZoom(19)
                            console.log(i);
                            if (select_click_marker != null) {
                                select_click_marker.setMap(null);
                            }
                            marker_animate = new google.maps.Marker({
                                position: latlng,
                                map: map,
                                icon: '/admin-transit/image/icon_station/current_station.png',
                                zIndex: 1000
                            });
                            select_click_marker = marker_animate;

                            select_click_marker.setAnimation(google.maps.Animation.BOUNCE);
                        }
                    })(marker, i));
                    x++;
                    array_marker.push(marker);
                }

            }
        }

    }


    drawPolyLine(route);
    station(route);
}

function drawPolyLine(route) {

    var myTrip=new Array();



    var json_route = (function () {
        var json_route = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "/admin-transit/API/JSON/route_name/",
            'dataType': "json",
            'success': function (data) {
                json_route = data;
            }
        });
        return json_route;
    })();

    //line color
    var route_color;
    for (var i = 0; i <= json_route.length-1; i++) {

        if (route==json_route[i].route_code) {
            route_color = json_route[i].routh_color;
        }
    }

    var old_type = null;
var section_number =1;
    for (var i = 0; i <= json_route_point.length-1; i++) {

        if (json_route_point[i].type == route) {
            myTrip.push(new google.maps.LatLng(json_route_point[i].lat, json_route_point[i].lng));
            flightPath = new google.maps.Polyline({
                path: myTrip,
                strokeColor: route_color,
                strokeOpacity: 0.9,
                strokeWeight: 4
            });
            flightAllPath = [];
            flightAllPath.push(flightPath);

            if(json_route_point[i+1]!=null&&json_route_point[i+1].type==route){

                var point_a = new google.maps.LatLng(json_route_point[i].lat, json_route_point[i].lng);
                var point_b = new google.maps.LatLng(json_route_point[i + 1].lat, json_route_point[i + 1].lng);
                var lineWidth = 5; // (meters)
                var lineHeading = google.maps.geometry.spherical.computeHeading(point_a, point_b);
                var p0a = google.maps.geometry.spherical.computeOffset(point_a, lineWidth, lineHeading + 90);
                var p0b = google.maps.geometry.spherical.computeOffset(point_a, lineWidth, lineHeading - 90);
                var p1a = google.maps.geometry.spherical.computeOffset(point_b, lineWidth, lineHeading + 90);
                var p1b = google.maps.geometry.spherical.computeOffset(point_b, lineWidth, lineHeading - 90);


                // how to convert above someLine into?:
                var airway = new google.maps.Polygon({
                    paths: [p0a, p0b, p1b, p1a],
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 1,
                    fillOpacity: 0.35,
                    geodesic: true
                });




                array_polygon.push({polygon: airway,station_start: json_route_point[i].station_start ,station_end: json_route_point[i].station_end, type: json_route_point[i].type,section_number:section_number,
                    latlng: json_route_point[i].lat+","+json_route_point[i].lng});
                section_number++;
                if(json_route_point[i].station_start!=json_route_point[i+1].station_start){
                    section_number =1;
                }
            }

        }
        if (route == "all") {
            if (old_type == null) {

                old_type = json_route_point[i].type;

            }

            if (old_type != json_route_point[i].type) {
                myTrip = [];

                flightAllPath.push(flightPath);

                old_type = json_route_point[i].type;
            }


            var search = function (nameKey, myArray) {
                for (var i = 0; i <= myArray.length - 1; i++) {
                    if (myArray[i].route_code === nameKey) {
                        var check = true;
                        var route_color = myArray[i].routh_color;
                        return {
                            check: check,
                            route_color: route_color
                        };
                    }
                }
            };


            var c = search(json_route_point[i].type, json_route);


            if (c.check) {
                route_color = c.route_color;
                myTrip.push(new google.maps.LatLng(json_route_point[i].lat, json_route_point[i].lng));
            }

            flightPath = new google.maps.Polyline({
                path: myTrip,
                strokeColor: route_color,
                strokeOpacity: 0.9,
                strokeWeight: 4
            });


            // var someLine = myTrip;


                if(json_route_point[i+1]!=null&&json_route_point[i+1].type==old_type){

                    // if(i==0){
                        var point_a = new google.maps.LatLng(json_route_point[i].lat, json_route_point[i].lng);
                        var point_b = new google.maps.LatLng(json_route_point[i+1].lat, json_route_point[i+1].lng);
                        var lineWidth = 5; // (meters)
                        var lineHeading = google.maps.geometry.spherical.computeHeading(point_a, point_b);
                        var p0a = google.maps.geometry.spherical.computeOffset(point_a, lineWidth, lineHeading + 90);
                        var p0b = google.maps.geometry.spherical.computeOffset(point_a, lineWidth, lineHeading - 90);
                        var p1a = google.maps.geometry.spherical.computeOffset(point_b, lineWidth, lineHeading + 90);
                        var p1b = google.maps.geometry.spherical.computeOffset(point_b, lineWidth, lineHeading - 90);
                    // }
                    // else{
                    //     var point_a = new google.maps.LatLng(json_route_point[i-1].lat, json_route_point[i-1].lng);
                    //     var point_b = new google.maps.LatLng(json_route_point[i].lat, json_route_point[i].lng);
                    //     var lineWidth = 5; // (meters)
                    //     var lineHeading = google.maps.geometry.spherical.computeHeading(point_a, point_b);
                    //     var p0a = google.maps.geometry.spherical.computeOffset(point_a, lineWidth, lineHeading + 90);
                    //     var p0b = google.maps.geometry.spherical.computeOffset(point_a, lineWidth, lineHeading - 90);
                    //     var p1a = google.maps.geometry.spherical.computeOffset(point_b, lineWidth, lineHeading + 90);
                    //     var p1b = google.maps.geometry.spherical.computeOffset(point_b, lineWidth, lineHeading - 90);
                    // }




                        // how to convert above someLine into?:
                        var airway = new google.maps.Polygon({
                            paths: [p0a, p0b, p1b, p1a],
                            strokeColor: '#FF0000',
                            strokeOpacity: 0.8,
                            strokeWeight: 1,
                            fillOpacity: 0.35,
                            geodesic: true
                        });




                        array_polygon.push({polygon: airway,station_start: json_route_point[i].station_start ,station_end: json_route_point[i].station_end, type: json_route_point[i].type,section_number:section_number,
                        latlng: json_route_point[i].lat+","+json_route_point[i].lng});
                    section_number++;
                    if(json_route_point[i].station_start!=json_route_point[i+1].station_start){
                        section_number =1;
                    }
                }

        }

    }




        //This for last line
        flightAllPath.push(flightPath);


        for(var i = 0; i <= array_polygon.length-1; i++) {
            // if(array_polygon[i].station_start=="2"&&array_polygon[i].station_end=="3"&&array_polygon[i].type=="B1G"){
                array_polygon[i].polygon.setMap(map);
                // console.log(i,array_polygon[i].station_start,array_polygon[i].station_end,array_polygon[i].type,array_polygon[i].section_number,array_polygon[i].latlng);
            // }

        }

        //draw Line
        for(var i = 0; i <= flightAllPath.length-1; i++){
            flightAllPath[i].setMap(map);
        }




}

function station(route) {
    clearStation();
    var check = false;
    var x = 0;
    $.getJSON("/admin-transit/API/JSON/station/", function(jsonCM1) {

        $.each(jsonCM1, function(i, station1) {
            if(station1.type==route||route=="all"){
                // For Aj.Poon
                var icon = BS_special;

                // var marker1 = new google.maps.Marker({
                //     position: new google.maps.LatLng(station1.station_lat, station1.station_lng),
                //     map: map,
                //     title: station1.station_name,
                //     icon: icon
                // });

                if(point_active=="on"){
                    var position = new google.maps.LatLng(station1.point_lat-0.000025, station1.point_lng);
                }
                else{
                    var position = new google.maps.LatLng(station1.station_lat, station1.station_lng);
                }

                marker = new google.maps.Marker({
                    position: position,
                    map: map,
                    title: station1.station_name,
                    icon: icon,
                    zIndex: 500
                });

                var str = check_station(station1.station_name);
                var content = '';
                var res = str.split("-");
                // console.log(res[1]);
                if(res[1]!=null){
                    for (var i = 0; i <= res.length-1; i++) {
                        if(res[i-1]!=res[i]){
                            content += "<br> สาย "+res[i];
                        }
                    }
                }else{
                    content = "<br> สาย "+str;
                }

                array_station.push(marker);
                info = new google.maps.InfoWindow();
                google.maps.event.addListener(marker, 'click', (function(marker, i) {
                    return function() {
                        old_marker = null;
                        document.getElementById("estimate_box_top").style.background = "red";
                        document.getElementById("estimate_station_name").innerHTML = station1.station_name+content;
                        map.panTo(position)
                        // map.setZoom(19)





                            if (select_click_marker != null) {
                                select_click_marker.setMap(null);
                            }
                        marker_animate = new google.maps.Marker({
                            position: position,
                            map: map,
                            icon: '/admin-transit/image/icon_station/current_station.png',
                            zIndex: 1000
                        });
                        select_click_marker = marker_animate;

                        select_click_marker.setAnimation(google.maps.Animation.BOUNCE);
                        // info.setContent(station1.station_name +content);
                        //
                        // info.open(map, marker);
                    }
                })(marker, i));

                // content = '<span id="station-' + station1.station_id +'-'+station1.type+'">'+station1.station_name +content+'<span>';
                // // console.log(content);
                // marker['infowindow'] = new google.maps.InfoWindow({
                //     content: content
                // });


                // google.maps.event.addListener(marker, 'click', function (e) {
                //     if (old_open != null) {
                //         old_open.close()
                //     }
                //     this['infowindow'].open(map, this);
                //     old_open = this['infowindow'];
                //
                // });
                x++;
            }
        });

    });
}

function check_station(station_name) {
    var array = [];
    var type;

    for (var i = 0; i <= json_station.length-1; i++) {

        if(json_station[i].station_name == station_name){

            array.push(json_station[i].type);
        }
    }
    type = array.join("-");
    return type;
}


function estimate_time(station_name) {
    var array = [];
    // var type;

    for (var i = 0; i <= json_station.length-1; i++) {

        if(json_station[i].station_name == station_name){

            array.push({station_id:json_station[i].station_id,station_name:json_station[i].station_name, type:json_station[i].type});
        }
    }
    // type = array.join("-");
    return array;
}


function removeLine() {
    for(var i = 0; i <= flightAllPath.length-1; i++){
        flightAllPath[i].setMap(null);
    }
    for (var i = 0; i < array_polygon.length; i++) {
        array_polygon[i].polygon.setMap(null);
    }
    array_polygon =[];
    // console.log(array_polygon.length)

}
function clearStation() {
    for (var i = 0; i < array_station.length; i++) {
        array_station[i].setMap(null);
    }
    array_station = [];


}














//Load google map
google.maps.event.addDomListener(window, 'load', initialize);


var numDeltas = 1000;
var delay = 10; //milliseconds
var x = 0;
var deltaLat;
var deltaLng;

function transition(array_result){
console.log(array_result);
    x = 0;
    // console.log(array_result,array_postion);
    array_delta = [];
    for (var i = 0; i <= array_result.length-1; i++) {

        deltaLat = (array_result[i].lat - array_postion[i].lat) / numDeltas;
        deltaLng = (array_result[i].lng - array_postion[i].lng) / numDeltas;
        array_delta.push({lat: deltaLat, lng: deltaLng,car: array_result[i].car });

    }

    moveMarker();
}

function moveMarker(){

    for (var i = 0; i <= array_delta.length-1; i++) {
        // console.log(i);
        var lat = array_postion[i].lat + array_delta[i].lat;
        var lng = array_postion[i].lng + array_delta[i].lng;

        array_postion[i] = {lat: lat, lng: lng};

        var latlng = new google.maps.LatLng(array_postion[i].lat, array_postion[i].lng);
        array_marker[i].setTitle("Latitude:" + array_postion[i].lat + " | Longitude:" + array_postion[i].lng);
        array_marker[i].setPosition(latlng);
        // array_marker[i].setIcon(check_direction(array_result[i].direction,array_result[i].type));
        array_marker[i].setIcon('/admin-transit/image/icon_car/'+convert_car_detail(array_result[i].type)+'.png');

        if(old_marker==array_marker[i]){
            select_click_marker.setPosition(latlng)
            $('#estimate_station_name').html(array_delta[i].car.Registerid+"ssaaa"+array_delta[i].car.busstop);
        }


        // console.log(array_result[0]);

        //set Content Marker
        // $('#rating'+i).html("1ssss"+lat+", Lng"+lng);
    }
    if(x!=numDeltas){
        x++;
        setTimeout(moveMarker, delay);
    }
}


function check_direction(direction,type) {
    var icon_type = 'minibus';

    if(type=="R1"){
        icon_type = "R1G";
    }
    if(type=="R2"){
        icon_type = "R2P";
    }
    if(type=="R3-Y"||type=="สำรอง"){
        icon_type = "R3Y";
    }
    if(type=="R3-R"){
        icon_type = "R3R";
    }

    if(type=="B1,2"||type=="B1,6"||type=="B1,3" ||type=="B1,1"
        ||type=="B1,5"||type=="B1,4")
    {
        icon_type = "minibus";
    }
    if(type=="B2,5"||type=="B2,1"|| type=="B2,4"
        ||type=="B2,6"||type=="B2,2"||type=="B2,3")
    {
        icon_type = "minibus";
    }
    if(type=="B3,30"||type=="B3,33"||type=="B3,34"||type=="B3,37")
    {
        icon_type = "minibus";
    }
    if(type=="")
    {
        icon_type = "KWG";
    }

    const x = parseFloat(direction);
    switch (true) {
        case (x >= 5 && x <= 15):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-10.png';
            break;
        case (x >= 15 && x <= 25):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-20.png';
            break;
        case (x >= 25 && x <= 35):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-30.png';
            break;
        case (x >= 35 && x <= 45):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-40.png';
            break;
        case (x >= 45 && x <= 55):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-50.png';
            break;
        case (x >= 55 && x <= 65):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-60.png';
            break;
        case (x >= 65 && x <= 75):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-70.png';
            break;
        case (x >= 75 && x <= 85):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-80.png';
            break;
        case (x >= 85 && x <= 95):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-90.png';
            break;
        case (x >= 95 && x <= 105):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-100.png';
            break;
        case (x >= 105 && x <= 115):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-110.png';
            break;
        case (x >= 115 && x <= 125):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-120.png';
            break;
        case (x >= 125 && x <= 135):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-130.png';
            break;
        case (x >= 135 && x <= 145):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-140.png';
            break;
        case (x >= 145 && x <= 155):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-150.png';
            break;
        case (x >= 155 && x <= 165):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-160.png';
            break;
        case (x >= 165 && x <= 175):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-170.png';
            break;
        case (x >= 175 && x <= 185):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-180.png';
            break;
        case (x >= 185 && x <= 195):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-190.png';
            break;
        case (x >= 195 && x <= 205):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-200.png';
            break;
        case (x >= 205 && x <= 215):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-210.png';
            break;
        case (x >= 215 && x <= 225):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-220.png';
            break;
        case (x >= 225 && x <= 235):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-230.png';
            break;
        case (x >= 235 && x <= 245):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-240.png';
            break;
        case (x >= 245 && x <= 255):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-250.png';
            break;
        case (x >= 255 && x <= 265):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-260.png';
            break;
        case (x >= 265 && x <= 275):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-270.png';
            break;
        case (x >= 275 && x <= 285):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-280.png';
            break;
        case (x >= 285 && x <= 295):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-290.png';
            break;
        case (x >= 295 && x <= 305):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-300.png';
            break;
        case (x >= 305 && x <= 315):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-310.png';
            break;
        case (x >= 315 && x <= 325):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-320.png';
            break;
        case (x >= 325 && x <= 335):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-330.png';
            break;
        case (x >= 335 && x <= 345):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-340.png';
            break;
        case (x >= 345 && x <= 355):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-350.png';
            break;
        case (x >= 355 && x <= 360):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-360.png';
            break;
        case (x >= 0 && x <= 5):
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-360.png';
            break;
        default:
            icon = '/admin-transit/image/icon_car/degree/'+icon_type+'-360.png';
            break;
    }
    return icon;
}


function convert_car_detail(Detail) {
    var car_type = '';
    if(Detail=="R1"){
        car_type = "R1G";
    }
    if(Detail=="R2"){
        car_type = "R2B";
    }
    if(Detail=="R3-Y"||Detail=="สำรอง"){
        car_type = "R3Y";
    }
    if(Detail=="R3-R"){
        car_type = "R3R";
    }

    if(Detail=="B1,2"||Detail=="B1,6"||Detail=="B1,3" ||Detail=="B1,1"
        ||Detail=="B1,5"||Detail=="B1,4")
    {
        car_type = "B1G";
    }
    if(Detail=="B2,5"||Detail=="B2,1"|| Detail=="B2,4"
        ||Detail=="B2,6"||Detail=="B2,2"||Detail=="B2,3")
    {
        car_type = "B2G";
    }
    if(Detail=="B3,30"||Detail=="B3,33"||Detail=="B3,34"||Detail=="B3,37")
    {
        car_type = "B3G";
    }
    if(Detail=="")
    {
        car_type = "KWG";
    }

    return car_type;
}


var point_active = "on";
function icon_off(){
    if(document.getElementById("busstop").innerHTML=="Enable Bus Stop"){
    document.getElementById("busstop").className = "btn btn-danger";
    document.getElementById("busstop").innerHTML = "Disable Bus Stop";
    }else{
        document.getElementById("busstop").className = "btn btn-success";
        document.getElementById("busstop").innerHTML = "Enable Bus Stop";
    }
    setMapOnCar(null);
    if(BS_special == '/admin-transit/image/icon_station/R3R_busstop.png'){
        BS_special = '/admin-transit/image/icon_station/point.png';
        point_active = "on";
    }else{
        BS_special = '/admin-transit/image/icon_station/R3R_busstop.png'
        point_active = "off";
    }
    check_station();
    array_marker = [];
    // station(icon_current);
    route(icon_current);

}

function stationClear(){


    setMapOnCar(null);
    clearStation();
    removeLine();
    array_marker = [];
    clearInterval(interval);
}





function route_user(route) {
    if(select_click_marker!=null){
        select_click_marker.setMap(null);
    }


    if(route=="minibus"){
        map.panTo(new google.maps.LatLng(18.80338182420389,98.9843096591029 ));
        map.setZoom(14)
    }
    if(route=="bus"){
        map.panTo(new google.maps.LatLng(18.786823397713526,98.99519092035939));
        map.setZoom(14)
    }
    if(route=="van"){
        map.panTo(new google.maps.LatLng(  18.753044288561885,98.9752914205352));
        map.setZoom(12)
    }



    icon_current = route;

    clearInterval(interval);
    removeLine();
    setMapOnCar(null);


    interval = setInterval(function() {
            var xi = 0;
            $.getJSON("/geometry-library-master/", function(jsonBus1) {
                $.each(jsonBus1, function(i, carB1) {
if(route=="van"){
    route = "kwvan";
}



                    //for cm transit only
                    if (carB1.Type == "minibus" || carB1.Type == "bus" || carB1.Type == "kwvan") {
                        if (carB1.Type == route) {

                            array_result[xi] = {
                                lat: parseFloat(carB1.LaGoogle),
                                lng: parseFloat(carB1.LongGoogle),
                                direction: parseFloat(carB1.Direction),
                                type: carB1.Detail,
                                busstop: carB1.busstop,
                                car_content: '' +
                                    '<div id="content">' +
                                    '<h2 style="color: blue">' + carB1.Registerid + '</h2>' +
                                    '</div> <hr> ' +
                                    'สาย: ' + carB1.Detail + '<br>' +
                                    'ข้อมูลล่าสุด:' + carB1.Date + ':' + carB1.Time + '<br>' +
                                    'ข้อมูลผู้ขับ: ' + carB1.DriverName + ' สถานะ: ' + carB1.StatusLogInOut + '<hr>' +
                                    'เครื่องยนต์: ' + carB1.CM_Engine + '<br>' +
                                    'แบตเตอร์รี่: ' + carB1.CM_Battery + '<br>' +
                                    'น้ำมัน: ' + carB1.Fuel + '<br>' +
                                    'อุณหภูมิ: ' + '' + '<br>' +
                                    'เซ็นเซอร์ฝุ่นละออง: ' + carB1.SensorPM + '<hr>' +
                                    'GSM: ' + '' + '<br>' +
                                    'GPS: ' + '' + '<br>' +
                                    'สถานะ: ' + carB1.SignalFall + '<hr>' +
                                    'ตำแหน่ง: ' + '' + '<br>' +
                                    'พิกัด: (' + carB1.LaGoogle + ',' + carB1.LongGoogle + ') <hr>' +
                                    'ประเภทรถ: ' + carB1.Type + '<br>' +
                                    'สถาณีต่อไป: ' + carB1.busstop + '<br>' +
                                    'ระยะเวลา: ' + carB1.datetime_busstop + ' นาที <br>'
                            };
                            xi++;

                            // if (carB1.busstop != null) {
                            //
                            //
                            //     var car_select = [];
                            //     for (var i = 0; i <= car_realtime.length - 1; i++) {
                            //
                            //
                            //         //fix bus_stop_name
                            //         if (car_realtime[i].Type == carB1.Type) {
                            //             car_select.push(car_realtime[i]);
                            //         }
                            //
                            //
                            //     }
                            //
                            //
                            //     var str = estimate_time('ท่าอากาศยานเชียงใหม่ ');
                            //     var content = '';
                            //
                            //     for (var i = 0; i <= str.length - 1; i++) {
                            //         content += "<br> สาย " + str[i].type;
                            //     }
                            //
                            //     //estimate time
                            //     // for (var i = 0; i <= car_select.length-1; i++) {
                            //     //     content += "<br> เวราโดยประมาณ "+car_select[i].LaGoogle+"-"+convert_car_detail(car_select[i].Detail);
                            //     // }
                            //
                            //
                            //     for (var i = 0; i <= str.length - 1; i++) {
                            //         $('#station-' + str[i].station_id + '-' + str[i].type).html(str[i].station_name + content);
                            //     }
                            //
                            //
                            // }
                        }

                    }

                });
            });

            transition(array_result);

        },
        4000);

    var x = 0;
    var old_open = null;
    for (var i = 0; i <= car.length-1; i++) {
        //for cm transit only
        if(car[i].Type=="minibus"||car[i].Type=="bus"||car[i].Type=="kwvan") {
            if(route=="van"){
                route = "kwvan";
            }

            if (car[i].Type == route) {

                var positions = {lat: parseFloat(car[i].LaGoogle), lng: parseFloat(car[i].LongGoogle)};
                array_postion.push(positions);

                latlng = new google.maps.LatLng(parseFloat(car[i].LaGoogle), parseFloat(car[i].LongGoogle));
                marker = new google.maps.Marker({
                    position: latlng,
                    map: map,
                    title: "Latitude:" + position.lat + " | Longitude:" + position.lng,
                    // icon: check_direction(car[i].Direction, car[i].Detail)
                    icon: '/admin-transit/image/icon_car/'+convert_car_detail(car[i].Detail)+'.png',
                    zIndex: i
                });
                // var content = '<span id="rating' + x + '">Data Loading<span>';
                // marker['infowindow'] = new google.maps.InfoWindow({
                //     content: content
                // });
                //

                // google.maps.event.addListener(marker, 'click', function (e) {
                //     if (old_open != null) {
                //         old_open.close()
                //     }
                //     this['infowindow'].open(map, this);
                //     old_open = this['infowindow'];
                //
                // });

                google.maps.event.addListener(marker, 'click', (function(marker, i) {
                    return function() {
                        old_marker = marker;
                        var latlng = new google.maps.LatLng(marker.position.lat(),marker.position.lng());

                        document.getElementById("estimate_box_top").style.background = "blue";
                        document.getElementById("estimate_station_name").innerHTML = car[i].Registerid+"ssssssssssssssssss"+car[i].busstop;
                        map.panTo(latlng);
                        // map.setZoom(19)
                        console.log(i);
                        if (select_click_marker != null) {
                            select_click_marker.setMap(null);
                        }
                        marker_animate = new google.maps.Marker({
                            position: latlng,
                            map: map,
                            icon: '/admin-transit/image/icon_station/current_station.png',
                            zIndex: 1000
                        });
                        select_click_marker = marker_animate;

                        select_click_marker.setAnimation(google.maps.Animation.BOUNCE);
                    }
                })(marker, i));
                x++;
                array_marker.push(marker);


                array_marker.push(marker);

            }
        }

    }


    drawPolyLine_user(route);
    station_user(route);
}

function drawPolyLine_user(route) {
    flightAllPath = [];
    var myTrip=new Array();



    var json_route = (function () {
        var json_route = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "/admin-transit/API/JSON/route_name/",
            'dataType': "json",
            'success': function (data) {
                json_route = data;
            }
        });
        return json_route;
    })();

    //line color
    var route_color;
    for (var i = 0; i <= json_route.length-1; i++) {

        if (route==json_route[i].route_code) {
            route_color = json_route[i].routh_color;
        }
    }

    var old_type = null;
    $.getJSON("/admin-transit/API/JSON/route/", function(jsonCM1) {
        $.each(jsonCM1, function(i, polyline) {
            var car_type = null
            if(polyline.type.charAt(0)=="R"){
                car_type = "bus"
            }
            if(polyline.type.charAt(0)=="B"){
                car_type = "minibus"
            }
            if(polyline.type.charAt(0)=="K"){
                car_type = "kwvan"
            }

            if(route==car_type){

                if(old_type==null){

                    old_type = polyline.type;

                }

                if(old_type!=polyline.type){

                    myTrip = [];
                    old_type = polyline.type;

                    flightAllPath.push(flightPath);
                }



                var search = function(nameKey, myArray) {
                    for (var i=0; i <= myArray.length-1; i++) {
                        if (myArray[i].route_code === nameKey) {
                            var check = true;
                            var route_color = myArray[i].routh_color;
                            return {
                                check: check,
                                route_color: route_color
                            };
                        }
                    }
                };

                var c = search(polyline.type,json_route);


                if(c.check){
                    route_color= c.route_color;
                    myTrip.push(new google.maps.LatLng(polyline.lat,polyline.lng));

                }

                flightPath = new google.maps.Polyline({
                    path: myTrip,
                    strokeColor: route_color,
                    strokeOpacity: 0.9,
                    strokeWeight: 4
                });


            }

        });
        //This for last line
        flightAllPath.push(flightPath);

        //draw Line
        for(var i = 0; i <= flightAllPath.length-1; i++){
            flightAllPath[i].setMap(map);
        }



    });

}

function station_user(route) {
    clearStation();
    var check = false;
    var x = 0;
    var old_open = null;
    $.getJSON("/admin-transit/API/JSON/station/", function(jsonCM1) {

        $.each(jsonCM1, function(i, station1) {
            var car_type = null
            if(station1.type.charAt(0)=="R"){
                car_type = "bus"
            }
            if(station1.type.charAt(0)=="B"){
                car_type = "minibus"
            }
            if(station1.type.charAt(0)=="K"){
                car_type = "kwvan"
            }

            if(route==car_type){
                // For Aj.Poon
                var icon = BS_special;


                if(point_active=="on"){
                    var position = new google.maps.LatLng(station1.point_lat-0.000025, station1.point_lng);
                }
                else{
                    var position = new google.maps.LatLng(station1.station_lat, station1.station_lng);
                }

                marker = new google.maps.Marker({
                    position: position,
                    map: map,
                    title: station1.station_name,
                    icon: icon,
                    zIndex: 500
                });

                var str = check_station(station1.station_name);
                var content = '';
                var res = str.split("-");
                // console.log(res[1]);
                if(res[1]!=null){
                    for (var i = 0; i <= res.length-1; i++) {
                        if(res[i-1]!=res[i]){
                            content += "<br> สาย "+res[i];
                        }
                    }
                }else{
                    content = "<br> สาย "+str;
                }

                array_station.push(marker);
                // info = new google.maps.InfoWindow();
                // google.maps.event.addListener(marker1, 'click', (function(marker1, i) {
                //     return function() {
                //         info.setContent(station1.station_name +content);
                //
                //         info.open(map, marker1);
                //     }
                // })(marker1, i));

                google.maps.event.addListener(marker, 'click', (function(marker, i) {
                    return function() {
                        old_marker = null;
                        document.getElementById("estimate_box_top").style.background = "red";
                        document.getElementById("estimate_station_name").innerHTML = station1.station_name+content;
                        map.panTo(position)
                        // map.setZoom(19)





                        if (select_click_marker != null) {
                            select_click_marker.setMap(null);
                        }
                        marker_animate = new google.maps.Marker({
                            position: position,
                            map: map,
                            icon: '/admin-transit/image/icon_station/current_station.png',
                            zIndex: 1000
                        });
                        select_click_marker = marker_animate;

                        select_click_marker.setAnimation(google.maps.Animation.BOUNCE);
                        // info.setContent(station1.station_name +content);
                        //
                        // info.open(map, marker);
                    }
                })(marker, i));

                // content = '<span id="station-' + station1.station_id +'-'+station1.type+'">'+station1.station_name +content+'<span>';
                // // console.log(content);
                // marker['infowindow'] = new google.maps.InfoWindow({
                //     content: content
                // });


                // google.maps.event.addListener(marker, 'click', function (e) {
                //     if (old_open != null) {
                //         old_open.close()
                //     }
                //     this['infowindow'].open(map, this);
                //     old_open = this['infowindow'];
                //
                // });
                x++;

            }
        });

    });
}