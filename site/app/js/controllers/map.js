'use strict';
//Map Controller
var MapCtrl = function($rootScope, $scope, $location, ParseService){

    //Tool bar
    var height = $(window).height();
    var width = $(window).width();
    var wh = 'width=' + width + ", height=" + height;

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
    	$scope.resizeMap();

	ParseService.getMarkers(function(results){
	    $scope.$apply(function(){
		$scope.markers = results;
	    });
	});
    };

    //resize map
    $scope.resizeMap = function(){
	var mapElement = $('.angular-google-map-container');
	var height = $(window).height() - 52;
	var width = $(window).width();
	mapElement.height(height);
	mapElement.width(width);
    };

    $(window).resize(function(){
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
            console.log(results);
            $scope.vehicles = results;
            $scope.$apply();
        });


    };
    //Init
    $scope.init();
};
