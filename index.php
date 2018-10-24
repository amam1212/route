<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>CM - Transit</title>

    <!-- Bootstrap Core CSS -->
    <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">

    <!-- MetisMenu CSS -->
    <link href="vendor/metisMenu/metisMenu.min.css" rel="stylesheet">



    <!-- Morris Charts CSS -->
    <link href="vendor/morrisjs/morris.css" rel="stylesheet">

    <!-- Custom Fonts -->
    <link href="vendor/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

    <script src="vendor/jquery/jquery.min.js"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCCeIm4Qr_eDTBDnE55Q1DJbZ4qXZLYjss&libraries=geometry"></script>

    <script src="car.js"></script>

    <style>
        #mapCanvas{
            width: 100%;
            height: 100vh;
        }


        #over_map { position: absolute; top: 87%; width: 99vw; text-align: center; z-index: 99; }

        #head_map { position: absolute; top: 2vh; width: 99vw; text-align: center; z-index: 99; }

        .btn{
            font-size: 30px;
        }

        #estimate {
            position: fixed;
            z-index: 100;
            top: 0;
            left: 0;
            padding: 10px;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            color: white;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            width: 100%;
            text-align: center;
            text-align: center;
        }

        #estimate_box {
            width: 405px;
            background: #fff;
            display: inline-block;
            -webkit-box-shadow: 0 1px 6px -3px #000;
            -moz-box-shadow: 0 1px 6px -3px #000;
            box-shadow: 0 1px 6px -3px #000;
            position: relative;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            font-size: 0;
            -webkit-border-radius: 3px;
            -moz-border-radius: 3px;
            border-radius: 3px;
        }

        #estimate_box_top {
            height: 60px;
            position: relative;
            border-radius: 3px 3px 0 0;
            text-shadow: 0 1px 1px rgba(0, 0, 0, 0.6);
        }

        /*.bgcolor_4 {*/
            /*background: rgb(0,168,186);*/
        /*}*/

        #estimate_station_name {
            font-size: 12px;
            color: #000;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            bottom: 6px;
            left: 80px;
            right: 10px;
            text-align: center;
            border-top: 1px solid #eee;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            height: 28px;
            line-height: 28px;
            padding: 0 10px;
        }


        #estimate_route {
            position: absolute;
            font-size: 20px;
            width: 80px;
            height: 48px;
            font-weight: bold;
            top: 7px;
            line-height: 24px;
            border-right: 1px solid #eee;
        }

        #estimate_time {
            position: absolute;
            right: 0;
            top: 0;
            left: 80px;
            bottom: 0;
            font-size: 27px;
        }

        #estimate_time_value {
            display: inline-block;
            font-size: 39px;
            width: 110px;
        }


        /*.btn.btn-R1G{*/
            /*background-color: white;*/
            /*font-size: 20px;*/

            /*color:#339999;*/
            /*border: 1px solid #339999 ;*/
            /*padding-left: 15px;*/
            /*padding-right: 15px;*/
        /*}*/
        /*.btn.btn-R1G:active, .btn.btn-R1G:hover,.btn.btn-R1G:focus{*/
            /*background-color: #339999;*/
            /*color:white;*/
        /*}*/



    </style>

    <script>
        var route_name = (function () {
            var route_name = null;
            $.ajax({
                'async': false,
                'global': false,
                'url': "/admin-transit/API/JSON/route_name/",
                'dataType': "json",
                'success': function (data) {
                    route_name = data;
                }
            });
            return route_name;
        })();




        var style = document.createElement('style');
        style.type = 'text/css';


        var str = "";
        for (var i = 0; i <= route_name.length-1; i++) {
            str += '.btn.btn-'+route_name[i].route_code+'{\n' +
                '            background-color: white;\n' +
                '            font-size: 20px;\n' +
                '\n' +
                '            color:'+route_name[i].routh_color+';\n' +
                '            border: 1px solid '+route_name[i].routh_color+' ;\n' +
                '            padding-left: 15px;\n' +
                '            padding-right: 15px;\n' +
                '        }';

            str += '  .btn.btn-'+route_name[i].route_code+':active, .btn.btn-'+route_name[i].route_code+':hover,.btn.btn-'+route_name[i].route_code+':focus{\n' +
                '            background-color: '+route_name[i].routh_color+';\n' +
                '            color:white;\n' +
                '        }\n'
        }

        style.innerHTML = str;
        document.getElementsByTagName('head')[0].appendChild(style);
    </script>
</head>
<body>

<div id="head_map">
    <div class="row" style="justify-content: center; margin-top: 1vh;">
        <div id="estimate">
            <div id="estimate_box">
                <div id="estimate_box_top" style="background: rgb(0,168,186);">
                    <div id="estimate_route"><span id="estimate_route_label">สาย4</span><br><span id="estimate_bus">no.18</span></div>
                    <div id="estimate_time" style="">
                        <span id="estimate_station_label">จะมาถึงเวลา</span>
                        <span id="estimate_time_value">15:15</span>
                        <span id="estimate_time_label"> น.</span>
                    </div>

                </div>
                <div id="estimate_station_name">สถานีถัดไป "คณะนิติศาสตร์ "
                </div>

            </div>
        </div>
    </div>
</div>

    <div id="mapCanvas"></div>
    <div id="over_map">
        <div class="row" style="justify-content: center; margin-bottom: 1vh;">
            <button onclick="type_car('all')" class="btn btn-success type-car" >ทั้งหมด</button>
            <button onclick="type_car('minibus')" class="btn btn-success type-car" >รถเทศบาล</button>
            <button onclick="type_car('bus')" class="btn btn-success type-car">RTC</button>
            <button onclick="type_car('van')" class="btn btn-success type-car">รถขวัญเวียง</button>
        </div>
        <div class="row">
            <?php
            $url = 'http://www.cmtransit.com/API/route_name'; // path to your JSON file
            $data = file_get_contents($url); // put the contents of the file into a variable
            $json = json_decode($data); // decode the JSON feed
            foreach ($json as $value) {
//                if ($value->type_car == "minibus") {}
                 ?>
                <button id="<?=$value->route_code?>" onclick="route('<?=$value->route_code?>','<?=$value->routh_color?>')" class="btn btn-<?=$value->route_code?>"><?=$value->route_code?></button>
                <?php
            }
            ?>
        </div>
    </div>

    </div>

<script>
function type_car(type) {
    if("all"==type){
        route('all');
    }else{
        route_user(type);
    }

    for (var i = 0; i <= route_name.length-1; i++) {
        document.getElementById(route_name[i].route_code).style.display = "inline";
        if (route_name[i].type_car!=type) {
            document.getElementById(route_name[i].route_code).style.display = "none";
        }

        if ("all"==type) {
            console.log()
            document.getElementById(route_name[i].route_code).style.display = "none";
        }
    }
}

// function before_send(route_code,color){
//     route(route_code);
//     document.getElementById("estimate_box_top").style.background = color;
// }


</script>

</body>

</html>
