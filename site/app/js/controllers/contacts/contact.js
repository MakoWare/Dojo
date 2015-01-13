'use strict';

//Contact Controller
var ContactCtrl = function($rootScope, $scope, $location, ParseService, GlobalService, $modal){

    $scope.init = function(){
        GlobalService.showSpinner();
        $scope.$modal = $modal;
        $scope.ParseService = ParseService;
        var last = $location.url().split("/")[$location.url().split("/").length -1];

        if(last == "create"){
            $scope.action = "Create";
            $scope.title = "New Contact";
            $scope.createContact();
        } else {
            $scope.action = "Update";
            $scope.title = "Update";
            $scope.getContact(last);
        }
    };

    //Create Contact
    $scope.createContact = function(){
        ParseService.createObject("Contact", function(results){
            setTimeout(function(){
                console.log(results);
                $scope.contact = results;
                $scope.setUpContact();
            }, 500);
        });
    };

    //Get Contact
    $scope.getContact = function(id){
        ParseService.getObjectById("Contact", id, function(results){
            if(results.id){
                console.log(results);
                $scope.contact = results;
                if(results.attributes.firstName && results.attributes.lastName){
                    $scope.fullName = results.attributes.firstName + " " + results.attributes.lastName;
                }
                $scope.setUpContact();
            } else {
                var newPath = "/contacts";
                $location.path(newPath);
                $scope.$apply();
            }
        });
    };

    //Setup Contact
    $scope.setUpContact = function(){


        $scope.$broadcast("gotContact");
        GlobalService.dismissSpinner();

    };



    //Save Contact
    $scope.saveContact = function(){
        console.log("saveContact()");
        GlobalService.showSpinner();
        //Set EveryThing
        var contact = $scope.contact;
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

    //Delete Contact
    $scope.deleteContact = function(){
        GlobalService.showSpinner();
        ParseService.deleteObject($scope.contact, "Contact", function(results){
            GlobalService.dismissSpinner();
            if(results.message != null){
                alert(GlobalService.errorMessage + results.message);
            } else {
                var newPath = "/contact" ;
                $location.path(newPath);
                $scope.$apply();
            }
        });
    };


    //Init
    $scope.init();
};
