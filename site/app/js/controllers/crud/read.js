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
            $scope.attribute = "";

            $scope.format = 'MM/dd/yyyy';
            $scope.dateOptions = {
                startingDay: 1
            };

            $scope.startDateOpen = function($event) {
                $scope.startDateOpened = true;
                $event.preventDefault();
                $event.stopPropagation();
            };

            $scope.endDateOpen = function($event) {
                $scope.endDateOpened = true;
                $event.preventDefault();
                $event.stopPropagation();
            };

        } else {
            $location.url("/");
        }
    },

    $scope.getPartial = function(){
        if(ParseService.getCurrentUser()){
            var object = $scope.objectType.toLowerCase();
            var partialLocation = $scope.dir + "/" + object + "List.html";
            return "partials/" + partialLocation;
        }
    };

    $scope.findObjects = function(objectType){
        ParseService.findObjectsByAgency(objectType, function(results){
            GlobalService.dismissSpinner();
            console.log(results);
            $scope.$apply(function(){
                $scope.objects = results;
                $scope.setUp();
            });
        });
    };


    //On every change
    $scope.searchObjects = function(){
        console.log("Searching");
        console.log($scope.attribute);

        var query = new Parse.Query($scope.objectType);
        query.include("priority");

        console.log($scope.startDate);
        console.log($scope.endDate);
        var dateAttributes = ["pickUpDate", "dropOffDate", "createdAt", "dob"];
        var isDate = false;


        if($.inArray($scope.attribute, dateAttributes) > -1){
            isDate = true;
        }

        if($scope.searchParam != "" && $scope.attribute != "" && !isDate){
            query.startsWith($scope.attribute, $scope.searchParam);
        }

        if($scope.attribute != "" &&  isDate ){
            if($scope.endDate){
                query.lessThan($scope.attribute, $scope.endDate);
            }
            if($scope.startDate){
                query.greaterThan($scope.attribute, $scope.startDate);
            }
        } else {
            if($scope.endDate){
                query.lessThan('createdAt', $scope.endDate);
            }
            if($scope.startDate){
                query.greaterThan('createdAt', $scope.startDate);
            }
        }

        console.log(query);
        query.find({
            success: function(results){
                console.log(results);
                $scope.objects = results;
                $scope.$apply();
            },
            error: function(error){
                alert(GlobalService.errorMessage + error.message);
                console.log(error);
            }
        });
        /*
        ParseService.findObjectsByAgency(objectType, function(results){
            GlobalService.dismissSpinner();
            $scope.$apply(function(){
                $scope.objects = results;
                $scope.setUp();
                console.log(results);
            });
        });
         */
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
        case "Dispatch":
            $scope.setUpDispatch();
            break;
        case "Patient":
            $scope.setUpPatient();
            break;
        case "Facility":
            $scope.setUpFacility();
            break;
        case "User":
            $scope.setUpUser();
            break;
        case "PCR":
            $scope.setUpPCR();
            break;
        case "File":
            $scope.setUpFile();
            break;
        }
    },


    $scope.setUpDispatch = function(){
        $scope.attributes = [
            {name: "Object Id", value: "objectId"},
            {name: "Pick Up Date", value: "pickUpDate"},
            {name: "Pick Up Address", value: "pickUpAddress"},
            {name: "Drop Off Date", value: "dropOffDate"},
            {name: "Drop Off Address", value: "dropOffAddress"},
            {name: "Status", value: "status"},
            {name: "Complaint", value: "complaint"},
            {name: "Priority", value: "priority"}
        ];
    },

    $scope.setUpFacility = function(){
        $scope.attributes = [
            {name: "Object Id", value: "objectId"},
            {name: "Name", value: "name"},
            {name: "Address", value: "address"},
            {name: "Type", value: "type"}
        ];
    },

    $scope.setUpPatient = function(){
        $scope.attributes = [
            {name: "Object Id", value: "objectId"},
            {name: "First Name", value: "firstName"},
            {name: "Last Name", value: "lastName"},
            {name: "Address", value: "address"},
            {name: "comments", value: "comments"}
        ];
    },

    $scope.setUpPCR = function(){
        $scope.attributes = [
            {name: "Object Id", value: "objectId"},
            {name: "Name", value: "name"},
            {name: "Status", value: "status"}
        ];
    },

    $scope.setUpFile = function(){
        $scope.attributes = [
            {name: "Object Id", value: "objectId"},
            {name: "Name", value: "name"}
        ];
    },

    $scope.setUpVehicle = function(){
        $scope.attributes = [
            {name: "Object Id", value: "objectId"},
            {name: "Name", value: "name"},
            {name: "Status", value: "status"},
            {name: "Type", value: "type"}
        ];

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
        $scope.attributes = [
            {name: "Object Id", value: "objectId"},
            {name: "First Name", value: "firstName"},
            {name: "Last Name", value: "lastName"},
            {name: "Username", value: "username"}
        ];

        $scope.objects.forEach(function(user){
            ParseService.getRole(user, function(result){
                if(result){
                    user.attributes.role = result.attributes.name.split("_")[0];
                    $scope.$apply();
                }
            });
        });
    };

    //Init
    $scope.init();
};
