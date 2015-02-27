'use strict';
//Map Controller
var MapCtrl = function($rootScope, $scope, $location, ParseService, GlobalService){

    //Map
    $scope.initMap = function(){
        $("#map").resizable(
            {
                grid: 50,
                ghost: true,
                stop: function( event, ui ) {
                    $scope.resize();
                }
            });

        $("#map").draggable({
            snap: true,
            grid: [ 50, 50 ]
        });


	$scope.center = {
	    latitude: $scope.initialLat,
	    longitude: $scope.initialLon
	};

        $scope.options = {
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL,
                position: google.maps.ControlPosition.RIGHT_CENTER
            },
            panControlOptions: {
                position: google.maps.ControlPosition.TOP_RIGHT
            },
            streetViewControlOptions: {
                position: google.maps.ControlPosition.RIGHT_TOP
            }

        };

	$scope.zoom = 10;
	$scope.markers = [];
	$scope.fit = true;

        $( document ).on('click', function(e){
            $scope.markers.forEach(function(marker){
                marker.showWindow = false;
            });
            $scope.$apply();
        });

        $scope.onMarkerClick = function(marker){
            setTimeout(function(){
                marker.showWindow = true;
                $scope.$apply();
            }, 0);

        };


	ParseService.getMarkers(function(results){
	    $scope.markers = results;
            $scope.$apply();
        });


        $scope.resize(400);
    };

    $scope.resize = function(h, w){
        if(h){
            $("#map").height(h);
        }
        if(w){
            $("#map").width(w);
        }

        $("#mapContainer").height($("#map").height());
        $("#mapContainer").width($("#map").width());

	var mapElement = $('.angular-google-map-container');
	var height = $("#map").height() - 60;
	var width = $("#map").width() - 20;
	mapElement.height(height);
	mapElement.width(width);
    };



    $scope.toggleComponent = function(){
        $("#mapComponentBody").toggle();
    };


    $scope.removeComponent = function(){
        console.log("broadcast");
        $rootScope.$broadcast("removeComponent", {id: "map"});
    };


    //resize map
    $scope.resizeMap = function(){
    };

    $("#map").resize(function(){
        $scope.resizeMap();
    });

    //Update map
    $scope.centerHome = function(){
        $scope.centerMap($scope.initialLat, $scope.initialLon);
    };

    //Search Map
    $scope.searchMap = function(){
        $scope.geocoder.geocode({address: $scope.searchAddress}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    $scope.$apply(function(){
                        $scope.centerMap(results[0].geometry.location.k, results[0].geometry.location.B);
                    });
                } else {
                    alert('No results found');
                }
            } else {
                alert('Geocoder failed due to: ' + status);
            }
        });
    };

    //Center Map
    $scope.centerMap = function(lat, lon){
        $scope.center = {
            latitude: lat,
	    longitude: lon
	};

    },

    //Scope init
    $scope.init = function(){
	$scope.currentUser = ParseService.getCurrentUser();
	if($scope.currentUser == undefined){
	    $location.path('/');
	}

        $scope.initialLat = 42.8;
        $scope.initialLon = -73.7;
	$scope.geocoder = new google.maps.Geocoder();
	$scope.initMap();

        ParseService.findVehiclesByAgency(function(results){
            $scope.vehicles = results;
            $scope.$apply();
        });

        //Addres TypeAhead
        $scope.addressTypeAhead = function(val){
            return GlobalService.addressTypeAhead(val);
        };

    };
    //Init
    $scope.init();
};
