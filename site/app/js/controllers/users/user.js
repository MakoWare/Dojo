'use strict';
//Map Controller
var UserCtrl = function($rootScope, $scope, $location, ParseService, GlobalService, $modal){

    $scope.init = function(){
        GlobalService.showSpinner();
        $scope.$modal = $modal;
        $scope.ParseService = ParseService;
        var last = $location.url().split("/")[$location.url().split("/").length -1];

        if(last == "create"){
            $scope.action = "Create";
            $scope.createNewUser();
        } else {
            $scope.action = "Update";
            $scope.getUser(last);
        }
    };

    //Create User
    $scope.createUser = function(){
        ParseService.createObject("User", function(results){
            if(results.id){
                console.log(results);
                $scope.user = results;
                $scope.setUpUser();
            } else {
                var newPath = "/users";
                $location.path(newPath);
                $scope.$apply();
            }
        });
    };

    //Get User
    $scope.getUser = function(id){
        ParseService.getObjectById("User", id, function(results){
            if(results.id){
                console.log(results);
                $scope.user = results;
                $scope.setUpUser();
                //console.log($rootScope);
                $scope.$broadcast("gotUser");
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
        });
    };



    //Save User
    $scope.saveUser = function(){

        console.log($scope.user);

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
