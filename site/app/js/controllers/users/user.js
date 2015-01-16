'use strict';
//User Controller
var UserCtrl = function($rootScope, $scope, $location, ParseService, GlobalService, $modal){

    $scope.init = function(){
        GlobalService.showSpinner();
        $scope.$modal = $modal;
        $scope.ParseService = ParseService;
        var last = $location.url().split("/")[$location.url().split("/").length -1];

        if(last == "create"){
            $scope.action = "Create";
            $scope.title = "New User";
            $scope.createUser();
        } else {
            $scope.action = "Update";
            $scope.title = "Update";
            $scope.getUser(last);
        }
    };

    //Create User
    $scope.createUser = function(){
        ParseService.createObject("User", function(results){
            setTimeout(function(){
                console.log(results);
                $scope.user = results;
                $scope.setUpUser();
            }, 500);
        });
    };

    //Get User
    $scope.getUser = function(id){
        ParseService.getObjectById("User", id, function(results){
            if(results.id){
                console.log(results);
                $scope.user = results;
                if(results.attributes.firstName && results.attributes.lastName){
                    $scope.fullName = results.attributes.firstName + " " + results.attributes.lastName;
                }
                $scope.setUpUser();
                //$scope.$broadcast("gotUser");
            } else {
                var newPath = "/users";
                $location.path(newPath);
                $scope.$apply();
            }
        });
    };

    //Setup User
    $scope.setUpUser = function(){
        $scope.dPersonnel = $scope.user.attributes.dPersonnel;

        ParseService.getNemsisElementCodes(["dPersonnel.24"], function(results){
            $scope.levels = results;
            $scope.$apply();
        });

        ParseService.getAllStates(function(results){
            $scope.states = results;
        });

        var agencyId = Parse.User.current().get('agencyId');
        ParseService.getRole(Parse.User.current(), function(result){
            if(result.attributes.name == "Admin"){
                $scope.roles = [
                    {name: "EMT", value: "EMT_" + agencyId},
                    {name: "Dispatcher", value: "Dispatcher_" + agencyId},
                    {name: "Manager", value: "Manager_" + agencyId},
                    {name: "Admin", value: "Admin"},
                    {name: "None", value: "None"}
                ];
            }
            else {
                $scope.roles = [
                    {name: "EMT", value: "EMT_" + agencyId},
                    {name: "Dispatcher", value: "Dispatcher_" + agencyId},
                    {name: "Manager", value: "Manager_" + agencyId},
                    {name: "None", value: "None"}
                ];
            }

            if($scope.user.id){
                ParseService.getRole($scope.user, function(result){
                    GlobalService.dismissSpinner();
                    if(result){
                        $scope.user.attributes.role = result.attributes.name;
                        $scope.$apply();
                    } else {
                        $scope.user.attributes.role = "None";
                        $scope.$apply();
                    }
                });
            } else {
                GlobalService.dismissSpinner();
                $scope.user.attributes.role = "None";
                $scope.$apply();
            }
        });
        $scope.$broadcast("gotUser");
    };



    //Save User
    $scope.saveUser = function(){
        console.log("saveUser()");
        GlobalService.showSpinner();
        //Set EveryThing
        var user = $scope.user;
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

    //Delete Object
    $scope.deleteUser = function(){
        GlobalService.showSpinner();
        ParseService.deleteObject($scope.user, "User", function(results){
            GlobalService.dismissSpinner();
            if(results.message != null){
                alert(GlobalService.errorMessage + results.message);
            } else {
                var newPath = "/users" ;
                $location.path(newPath);
                $scope.$apply();
            }
        });
    };


    //Init
    $scope.init();
};
