'use strict';

//Patients Controller
var PatientsCtrl = function($rootScope, $scope, $location, ParseService, GlobalService, $modal){

    $scope.init = function(){
        GlobalService.showSpinner();
        $scope.$modal = $modal;
        $scope.ParseService = ParseService;
        var last = $location.url().split("/")[$location.url().split("/").length -1];

        if(last == "create"){
            $scope.action = "Create";
            $scope.title = "New Patient";
            $scope.createPatient();
        } else {
            $scope.action = "Update";
            $scope.title = "Update";
            $scope.getPatient(last);
        }
    };

    //Create Patient
    $scope.createPatient = function(){
        ParseService.createObject("Patient", function(results){
            setTimeout(function(){  //Hack because directives need to setup listeners
                console.log(results);
                $scope.patient = results;
                $scope.setUpPatient();
            }, 500);
        });
    };

    //Get Patient
    $scope.getPatient = function(id){
        ParseService.getObjectById("Patient", id, function(results){
            if(results.id){
                console.log(results);
                $scope.patient = results;
                if(results.attributes.firstName && results.attributes.lastName){
                    $scope.fullName = results.attributes.firstName + " " + results.attributes.lastName;
                }
                $scope.setUpPatient();
            } else {
                var newPath = "/patients";
                $location.path(newPath);
                $scope.$apply();
            }
        });
    };

    //Setup Patient
    $scope.setUpPatient = function(){


        $scope.$broadcast("gotPatient");
        GlobalService.dismissSpinner();

    };



    //Save Patient
    $scope.savePatient = function(){
        console.log("savePatient()");

        GlobalService.showSpinner();
        //Set EveryThing
        var patient = $scope.patient;
        //user.set("firstName", user.attributes.firstName);
        //user.set("lastName", user.attributes.lastName);


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

    //Delete Patient
    $scope.deletePatient = function(){
        GlobalService.showSpinner();
        ParseService.deleteObject($scope.patient, "Patient", function(results){
            GlobalService.dismissSpinner();
            if(results.message != null){
                alert(GlobalService.errorMessage + results.message);
            } else {
                var newPath = "/patients" ;
                $location.path(newPath);
                $scope.$apply();
            }
        });
    };


    //Init
    $scope.init();
};
