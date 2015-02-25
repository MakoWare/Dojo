'use strict';

//Contact List Controller
var ContactListCtrl = function($rootScope, $scope, $location, ParseService, GlobalService, $modal){
    $scope.init = function(){
        console.log("ContactListCtrl");
        $scope.dragInit();
    };

    $scope.dragInit = function(){
        $( "#contactListContainer" ).draggable({ containment: "#componentContainer", axis: "y", scroll: false });
    };

    $scope.removeComponent = function(){
        console.log("broadcast");
        $rootScope.$broadcast("removeComponent", {id: "contactList"});
    };

    //Init
    $scope.init();
};
