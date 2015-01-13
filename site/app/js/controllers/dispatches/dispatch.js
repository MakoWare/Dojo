'use strict';

//Dispatch Controller
var DispatchCtrl = function($rootScope, $scope, $location, ParseService, GlobalService, $modal){

    $scope.init = function(){
        GlobalService.showSpinner();
        $scope.$modal = $modal;
        $scope.ParseService = ParseService;
        var last = $location.url().split("/")[$location.url().split("/").length -1];

        if(last == "create"){
            $scope.action = "Create";
            $scope.title = "New Dispatch";
            $scope.createContact();
        } else {
            $scope.action = "Update";
            $scope.title = "Update Dispatch";
            $scope.getContact(last);
        }
    };

    //Create Dispatch
    $scope.createDispatch = function(){
        ParseService.createObject("Dispatch", function(results){
            setTimeout(function(){
                console.log(results);
                $scope.dispatch = results;
                $scope.setUpDispatch();
            }, 500);
        });
    };

    //Get Dispatch
    $scope.getDispatch = function(id){
        ParseService.getObjectById("Dispatch", id, function(results){
            if(results.id){
                console.log(results);
                $scope.dispatch = results;
                $scope.setUpDispatch();
            } else {
                var newPath = "/dispatches";
                $location.path(newPath);
                $scope.$apply();
            }
        });
    };

    //Setup Dispatch
    $scope.setUpDispatch = function(){


        GlobalService.dismissSpinner();
    };



    //Save Dispatch
    $scope.saveDispatch = function(){
        console.log("saveDispatch()");
        GlobalService.showSpinner();

        //Set EveryThing
        var dispatch = $scope.dispatch;

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

    //Delete Contact
    $scope.deleteDispatch = function(){
        GlobalService.showSpinner();
        ParseService.deleteObject($scope.dispatch, "Dispatch", function(results){
            GlobalService.dismissSpinner();
            if(results.message != null){
                alert(GlobalService.errorMessage + results.message);
            } else {
                var newPath = "/dispatch" ;
                $location.path(newPath);
                $scope.$apply();
            }
        });
    };


    //Init
    $scope.init();
};
