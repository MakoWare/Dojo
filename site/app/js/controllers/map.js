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
	    latitude: 42.8,
	    longitude: -73.7
	};
	$scope.zoom = 11;
	$scope.markers = [];
	$scope.fit = true;
    	$scope.resizeMap();

	ParseService.getMarkers(function(results){
	    $scope.$apply(function(){
		$scope.markers = results;
		console.log(results);
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

    //update map
    $scope.updateMap = function(){
	$scope.geocoder.geocode( { 'address': $scope.map.address}, function(results, status) {
	    if (status == google.maps.GeocoderStatus.OK) {
		var lat = results[0].geometry.location.d;
		var lon = results[0].geometry.location.e;

		$scope.$apply(function(){
		    $scope.center = {
			latitude: lat,
			longitude: lon
		    };
		});
	    } else {
		alert('Geocode was not successful for the following reason: ' + status);
	    }
	});
    };

    //view Vehicle
    $scope.viewVehicle = function(){
	console.log('hi');
	console.log('viewVehicle');
	console.log(vehicleId);
    };

    //view Dispatch
    $scope.viewDispatch = function(){
	console.log('hi');
	console.log('viewVehicle');
	console.log(dispatchId);
    };

    //Scope init
    $scope.init = function(){
	$scope.currentUser = ParseService.getCurrentUser();
	if($scope.currentUser == undefined){
	    $location.path('/');
	}

	$scope.geocoder = new google.maps.Geocoder();
	$scope.initMap();
    };
    //Init
    $scope.init();
};
