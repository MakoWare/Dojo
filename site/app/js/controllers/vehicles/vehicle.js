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



        //First Save Each NemsisElement in each Section
        var sectionSavePromises = [];
        var elementSavePromises = [];

        //Elements in dPersonnel.attributes.elements
        $scope.user.attributes.dPersonnel.attributes.elements.forEach(function(element){
            element.set("value", element.attributes.value);
            element.set("codeString", element.attributes.codeString);
            elementSavePromises.push(element.save());
        });

        //Elements in dPersonnel.attributes.sections.attributes.elements
        $scope.user.attributes.dPersonnel.attributes.sections.forEach(function(section){
            section.attributes.elements.forEach(function(element){
                element.set("value", element.attributes.value);
                element.set("codeString", element.attributes.codeString);
                elementSavePromises.push(element.save());
            });
        });

        //After each NemsisElement has been saved, save Each Section
        Parse.Promise.when(elementSavePromises).then(function(){
            $scope.user.attributes.dPersonnel.attributes.sections.forEach(function(section){
                section.set("elements", section.attributes.elements);
                sectionSavePromises.push(section.save());
            });

            //After each Section has been saved, save dPersonnel Section
            Parse.Promise.when(sectionSavePromises).then(function(){
                $scope.user.attributes.dPersonnel.set("sections", $scope.user.attributes.dPersonnel.attributes.sections);
                $scope.user.attributes.dPersonnel.set("elements", $scope.user.attributes.dPersonnel.attributes.elements);
                $scope.user.attributes.dPersonnel.save({
                    success: function(dPersonnel){
                        //Now Save the User
                        $scope.user.set("dPersonnel", dPersonnel);
                        $scope.user.save({
                            success: function(user){
                                GlobalService.showSpinner();
                                console.log(user);

                            },
                            errror: function(object, error){
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
    };


    //Init
    $scope.init();
};
