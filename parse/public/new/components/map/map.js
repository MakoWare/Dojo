'use strict';
//Map Controller
var MapCtrl = BaseController.extend({
    notifications: null,

    // init
    init: function($scope, $location, ParseService, GlobalService, Notifications){
        this.notifications = Notifications;
        this.$scope = $scope;
        this.$location = $location;
        this.ParseService = ParseService;
        this.initialLat = 42.8;
        this.initialLon = -73.7;
	this.geocoder = new google.maps.Geocoder();
        this._super($scope);

	this.initMap();

        ParseService.findVehiclesByAgency(function(results){
            $scope.vehicles = results;
            $scope.$apply();
        });

        //Addres TypeAhead
        $scope.addressTypeAhead = function(val){
            return GlobalService.addressTypeAhead(val);
        };
    },


    defineListeners: function(){
        this.notifications.addEventListener(components.events.COMPONENT_RESIZED, this.onComponentResize.bind(this));
    },

    onComponentResize: function(event, name){
        console.log("onComponentResize()");
        console.log(event);
        console.log(name);
        if(name == "map"){
            this.resize();
        }
    },


    //Map
    initMap: function(){
        var self = this;
	this.$scope.center = {
	    latitude: this.initialLat,
	    longitude: this.initialLon
	};

        this.$scope.options = {
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

	this.$scope.zoom = 10;
	this.$scope.markers = [];
	this.$scope.fit = true;

        $( document ).on('click', function(e){
            self.$scope.markers.forEach(function(marker){
                marker.showWindow = false;
            });
            self.$scope.$apply();
        });

        this.$scope.onMarkerClick = function(marker){
            setTimeout(function(){
                marker.showWindow = true;
                self.$scope.$apply();
            }, 0);

        };


	this.ParseService.getMarkers(function(results){
	    self.$scope.markers = results;
            self.$scope.$apply();
        });

        $("#mapbox").height(500);
        this.resize();

    },


    //Resize The Map
    resize: function(){
        console.log($("#mapbox").height());
        console.log($("#mapbox").width());
        $('.angular-google-map-container').height($("#mapbox").height() - 60);
        $('.angular-google-map-container').width($("#mapbox").width() - 25);
    }

    //Update map
    /*
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
     */

});

MapCtrl.$inject =  ['$scope', '$location', 'ParseService', 'GlobalService', 'Notifications'];
