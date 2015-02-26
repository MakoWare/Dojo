'use strict';

//Contact List Controller
var ContactListCtrl = function($rootScope, $scope, $location, ParseService, GlobalService, $modal){
    $scope.init = function(){
        console.log("ContactListCtrl");

        $( "#contactListContainer" ).resizable(
            {
                grid: 100,
                animate: true,
                ghost: true
            });

    };

    $scope.toggleComponent = function(){
        $("#contactComponentBody").toggle();
    };


    $scope.removeComponent = function(){
        console.log("broadcast");
        $rootScope.$broadcast("removeComponent", {id: "contactList"});
    };

    //Init
    $scope.init();
};
