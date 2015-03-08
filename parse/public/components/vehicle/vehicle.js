'use strict';

//Vehicle Controller
var VehicleCtrl = function($rootScope, $scope, $location, ParseService, GlobalService, $modal){

    $scope.init = function(){
        GlobalService.showSpinner();
        $scope.$modal = $modal;
        $scope.ParseService = ParseService;
        var last = $location.url().split("/")[$location.url().split("/").length -1];

        if(last == "create"){
            $scope.action = "Create";
            $scope.title = "New Vehicle";
            $scope.createVehicle();
        } else {
            $scope.action = "Update";
            $scope.title = "Update";
            $scope.getVehicle(last);
        }
    };

    //Create Vehicle
    $scope.createVehicle = function(){
        $scope.vehicle =  ParseService.createObject("Vehicle");
        console.log($scope.vehicle);
        $scope.setUpVehicle();
    };

    //Get Vehicle
    $scope.getVehicle = function(id){
        ParseService.getObjectById("Vehicle", id, function(results){
            if(results.id){
                console.log(results);
                $scope.vehicle = results;
                if(results.attributes.name){
                    $scope.fullName = results.attributes.name;
                }
                $scope.setUpVehicle();
            } else {
                alert(GlobalService.errorMessage + "Could not find Vehicle");
                var newPath = "/vehicles";
                $location.path(newPath);
                $scope.$apply();
            }
        });
    };

    //Setup Vehicle
    $scope.setUpVehicle = function(){
        //get Codes for Vehicle Type
        var promises = [];
        promises.push(ParseService.findNemsisElementCodes("dVehicle.04", function(results){
            $scope.vehicleTypes = results;
            return;
        }));

        //get all Users in the Agency
        promises.push(ParseService.findUsersByAgency(function(results){
            console.log(results);
            results.forEach(function(user){
                user.ticked = false;
                user.fullName = user.attributes.firstName + " " + user.attributes.lastName;
                $scope.vehicle.attributes.crew.forEach(function(crewMember){
                    if(crewMember.id == user.id){
                        user.ticked = true;
                    }
                });
            });
            $scope.users = results;
            return;
        }));

        Parse.Promise.when(promises).then(function(){
            GlobalService.dismissSpinner();
            $scope.$apply();
        });
    };


    //Save Vehicle
    $scope.saveVehicle = function(){
        console.log("saveVehicle()");
        console.log($scope.vehicle);

        /*
        GlobalService.showSpinner();

        $scope.vehicle.attributes.crew = [];
        angular.forEach( $scope.users, function(user) {
            if (user.ticked === true) {
                $scope.vehicle.attributes.crew.push(user);
            }
        });

        ParseService.saveObject("Vehicle", $scope.vehicle, function(result){
            GlobalService.dismissSpinner();
            console.log(JSON.stringify(result));
            console.log(result);
        });

         */
    };

    //Delete Vehicle
    $scope.deleteVehicle = function(){
        if($scope.vehicle.id){
            GlobalService.showSpinner();
            ParseService.deleteObject($scope.vehicle, "Vehicle", function(results){
                GlobalService.dismissSpinner();
                if(results.message != null){
                    alert(GlobalService.errorMessage + results.message);
                } else {
                    var newPath = "/vehicles" ;
                    $location.path(newPath);
                    $scope.$apply();
                }
            });
        } else {
            var newPath = "/vehicles" ;
            $location.path(newPath);
        }
    };


    //Init
    $scope.init();
};
