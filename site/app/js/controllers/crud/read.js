//Read Controller
var ReadCtrl = function($scope, $location, GlobalService, ParseService){

    $scope.init = function(){
        if(ParseService.getCurrentUser()){
            GlobalService.showSpinner();
            $scope.objects = [];
            $scope.dir = $location.url().slice(1);
            $scope.objectType = GlobalService.getObjectType($scope.dir);
            $scope.getPartial();
            $scope.findObjects($scope.objectType);
            $scope.searchParam = "";
        } else {
            $location.url("/");
        }
    },

    $scope.getPartial = function(){
        if(ParseService.getCurrentUser()){
            var object = $scope.objectType.charAt(0).toLowerCase() + $scope.objectType.slice(1);
            var partialLocation = $scope.dir + "/" + object + "List.html";
            return "partials/" + partialLocation;
        }
    };

    $scope.findObjects = function(objectType){
        ParseService.findObjectsByAgency(objectType, function(results){
            GlobalService.dismissSpinner();
            $scope.$apply(function(){
                $scope.objects = results;
                $scope.setUp();
                console.log(results);
            });
        });
    };


    //On every change
    $scope.searchObjects = function(){
        ParseService.findObjectsByAgency(objectType, function(results){
            GlobalService.dismissSpinner();
            $scope.$apply(function(){
                $scope.objects = results;
                $scope.setUp();
                console.log(results);
            });
        });
    },

    $scope.createObject = function(objectType){
        GlobalService.showSpinner();
        ParseService.createObject(objectType, function(results){
            if(results.id){
                GlobalService.dismissSpinner();
                console.log(results);
                var newPath = "/" + $scope.dir + "/" + results.id;
                $location.path(newPath);
                $scope.$apply();
            } else {
                GlobalService.dismissSpinner();
                alert(GlobalService.errorMessage + results.message);
            }
        });
    },

    $scope.setUp = function(){
        switch($scope.objectType){
        case "Vehicle":
            $scope.setUpVehicle();
            break;
        case "User":
            $scope.setUpUser();
            break;
        }
    },

    $scope.setUpVehicle = function(){
        var geocoder = new google.maps.Geocoder();
        $scope.objects.forEach(function(vehicle){
            var latlng = new google.maps.LatLng(vehicle.attributes.lat, vehicle.attributes.lon);
            geocoder.geocode({'latLng': latlng}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        console.log(results);
                        vehicle.attributes.currentAddress = results[0].formatted_address;
                        $scope.$apply();
                    } else {
                        alert('No results found');
                    }
                } else {
                    alert('Geocoder failed due to: ' + status);
                }
            });
        });
    };

    $scope.setUpUser = function(){
        $scope.objects.forEach(function(user){
            ParseService.getRole(user, function(result){
                if(result){
                    user.attributes.role = result.attributes.name;
                    $scope.$apply();
                }
            });
        });
    };

    //Init
    $scope.init();
};
