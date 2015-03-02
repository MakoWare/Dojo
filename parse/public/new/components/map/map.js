'use strict';
//Map Controller
var MapCtrl = function($rootScope, $scope, $location, ParseService, GlobalService){

    //Scope init
    $scope.init = function(){
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



    //Map
    $scope.initMap = function(){
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

        $("#mymap").height(455);
        $("#mymap").width(455);

    };

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

    //Init
    $scope.init();
};
