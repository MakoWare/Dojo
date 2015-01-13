'use strict';

//Facility Controller
var FacilityCtrl = function($rootScope, $scope, $location, ParseService, GlobalService, $modal){

    $scope.init = function(){
        GlobalService.showSpinner();
        $scope.$modal = $modal;
        $scope.ParseService = ParseService;
        var last = $location.url().split("/")[$location.url().split("/").length -1];

        if(last == "create"){
            $scope.action = "Create";
            $scope.title = "New Facility";
            $scope.createFacility();
        } else {
            $scope.action = "Update";
            $scope.title = "Update";
            $scope.getFacility(last);
        }
    };

    //Create Facility
    $scope.createFacility = function(){
        ParseService.createObject("Facility", function(results){
            setTimeout(function(){
                console.log(results);
                $scope.facility = results;
                $scope.setUpFacility();
            }, 500);
        });
    };

    //Get Facility
    $scope.getFacility = function(id){
        ParseService.getObjectById("Facility", id, function(results){
            if(results.id){
                console.log(results);
                $scope.facility = results;
                if(results.attributes.name){
                    $scope.fullName = results.attributes.name;
                }
                $scope.setUpFacility();
            } else {
                var newPath = "/facilities";
                $location.path(newPath);
                $scope.$apply();
            }
        });
    };

    //Setup Facility
    $scope.setUpFacility = function(){


        $scope.$broadcast("gotFacility");
        GlobalService.dismissSpinner();
    };



    //Save Facility
    $scope.saveFacility = function(){
        GlobalService.showSpinner();
        console.log("saveFacility()");


        //Set EveryThing
        var facility = $scope.facility;



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

    //Delete Facility
    $scope.deleteFacility = function(){
        GlobalService.showSpinner();
        ParseService.deleteObject($scope.facility, "Facility", function(results){
            GlobalService.dismissSpinner();
            if(results.message != null){
                alert(GlobalService.errorMessage + results.message);
            } else {
                var newPath = "/facilities" ;
                $location.path(newPath);
                $scope.$apply();
            }
        });
    };


    //Init
    $scope.init();
};
