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
        ParseService.createObject("Vehicle", function(results){
            setTimeout(function(){  //Hack because directives need to setup listeners
                console.log(results);
                $scope.vehicle = results;
                $scope.setUpVehicle();
            }, 500);
        });
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
        //get Vehicle Types
        var query = new Parse.Query("NemsisElementCode");
        query.equalTo("elementNumber", "dVehicle.04");
        query.find({
            success: function(results){
                $scope.vehicleTypeCodes = results;
                results.forEach(function(code){
                    if(code.attributes.codeDescription == $scope.vehicle.attributes.type){
                        $scope.vehicle.attributes.type = code.attributes.code + " " + $scope.vehicle.attributes.type;
                    }
                });
            },
            error: function(error){
                alert(GlobalService.errorMessage + error.message);
            }
        });

        //get all Users
        var query = new Parse.Query("User");
        query.equalTo("agencyId", Parse.User.current().attributes.agencyId);
        query.find({
            success: function(results){
                GlobalService.dismissSpinner();
                $scope.fullUsers = results;
                $scope.users = [];
                results.forEach(function(user){
                    var userObject = {};
                    userObject.ticked = false;
                    userObject.id = user.id;
                    if(user.attributes.firstName){
                        userObject.fullName = user.attributes.firstName;
                    }
                    if(user.attributes.lastName){
                        userObject.fullName = userObject.fullName + " " + user.attributes.lastName;
                    }

                    if($scope.vehicle.attributes.crew){
                        $scope.vehicle.attributes.crew.forEach(function(crewMember){
                            if(user.id == crewMember.id){
                                userObject.ticked = true;
                            }
                        });
                    }
                    $scope.users.push(userObject);
                });

                $scope.$apply();
            },
            error: function(error){
                alert(GlobalService.errorMessage + error.message);
            }
        });

        $scope.$broadcast("gotVehicle");
    };


    //Save Vehicle
    $scope.saveVehicle = function(){
        GlobalService.showSpinner();
        console.log("saveVehicle()");

        //Set EveryThing
        var vehicle = $scope.vehicle;


        //Set dVehicle Elements
        vehicle.attributes.dVehicle.attributes.elements.forEach(function(element){
            switch (element.attributes.title){
            case "dVehicle.01":
                element.set("value", vehicle.attributes.number);
                break;
            case "dVehicle.02":
                element.set("value", vehicle.attributes.vin);
                break;
            case "dVehicle.03":
                element.set("value", vehicle.attributes.name);
                break;
            case "dVehicle.04":
                element.set("value", vehicle.attributes.type.split(" ")[0]);
                element.set("codeString", vehicle.attributes.type.split(" ")[1]);
                break;
            case "dVehicle.09":

                break;
            case "dVehicle.10":
                element.set("value", vehicle.attributes.year);
                break;
            }
        });

        //Set Vehicle Attributes
        vehicle.set("name", vehicle.attributes.name);
        vehicle.set("number", vehicle.attributes.number);
        vehicle.set("vin", vehicle.attributes.vin);
        vehicle.set("status", vehicle.attributes.status);
        vehicle.set("year", vehicle.attributes.year);
        vehicle.set("type", vehicle.attributes.type.split(" ")[1]);



        //First Save Each NemsisElement in each Section
        var sectionSavePromises = [];
        var elementSavePromises = [];

        //Elements in dVehicle.attributes.elements
        vehicle.attributes.dVehicle.attributes.elements.forEach(function(element){
            element.set("value", element.attributes.value);
            element.set("codeString", element.attributes.codeString);
            elementSavePromises.push(element.save());
        });

        //Elements in dVehicle.attributes.sections.attributes.elements
        vehicle.attributes.dVehicle.attributes.sections.forEach(function(section){
            section.attributes.elements.forEach(function(element){
                element.set("value", element.attributes.value);
                element.set("codeString", element.attributes.codeString);
                elementSavePromises.push(element.save());
            });
        });

        //After each NemsisElement has been saved, save Each Section
        Parse.Promise.when(elementSavePromises).then(function(){
            vehicle.attributes.dVehicle.attributes.sections.forEach(function(section){
                section.set("elements", section.attributes.elements);
                sectionSavePromises.push(section.save());
            });

            //After each Section has been saved, save dVehicle Section
            Parse.Promise.when(sectionSavePromises).then(function(){
                vehicle.attributes.dVehicle.set("sections", vehicle.attributes.dVehicle.attributes.sections);
                vehicle.attributes.dVehicle.set("elements", vehicle.attributes.dVehicle.attributes.elements);
                vehicle.attributes.dVehicle.save({
                    success: function(dVehicle){
                        //Now Save the User
                        vehicle.set("dVehicle", dVehicle);
                        vehicle.save({
                            success: function(vehicle){
                                GlobalService.dismissSpinner();
                                console.log(vehicle);
                                $location.path("/vehicles");
                                $scope.$apply();
                            },
                            error: function(object, error){
                                console.log(error);
                                alert(GlobalService.errorMessage + error.message);
                            }
                        });
                    },
                    error: function(object, error){
                        console.log(error);
                        alert(GlobalService.errorMessage + error.message);
                    }
                });
            });
        });

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
