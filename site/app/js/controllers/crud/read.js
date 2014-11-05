//Read Controller
var ReadCtrl = function($scope, $location, GlobalService, ParseService){

    $scope.init = function(){
        $scope.objects = [];
        $scope.dir = $location.url().slice(1);
        $scope.objectType = GlobalService.getObjectType($scope.dir);
        $scope.getPartial();
        $scope.findObjects($scope.objectType);
        $scope.searchParam = "";
    },

    $scope.getPartial = function(){
        var object = $scope.objectType.charAt(0).toLowerCase() + $scope.objectType.slice(1);
        var partialLocation = $scope.dir + "/" + object + "List.html";
        return "partials/" + partialLocation;
    };

    $scope.findObjects = function(objectType){
        ParseService.findObjectsByAgency(objectType, function(results){
            $scope.$apply(function(){
                $scope.objects = results;
                console.log(results);
            });
        });
    };

    $scope.createObject = function(objectType){
        GlobalService.showSpinner();
        ParseService.createObject(objectType, function(results){
            GlobalService.dismissSpinner();
            console.log(results);
            var newPath = "/" + $scope.dir + "/" + results.id;
            $location.path(newPath);
            $scope.$apply();
        });
    },

    $scope.setUp = function(){
        switch($scope.objectType){
        case "Vehicle":
            $scope.setupVehicle();
            break;
        }
    },

    $scope.setUpVehicle = function(){
        var geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(40.730885,-73.997383);
        geocoder.geocode({'latLng': latlng}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    map.setZoom(11);
                    marker = new google.maps.Marker({
                        position: latlng,
                        map: map
                    });
                    infowindow.setContent(results[1].formatted_address);
                    infowindow.open(map, marker);
                } else {
                    alert('No results found');
                }
            } else {
                alert('Geocoder failed due to: ' + status);
            }
        });
    };

    //Init
    $scope.init();
};
