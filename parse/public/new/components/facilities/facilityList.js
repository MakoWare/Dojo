'use strict';

//Facility List Controller
var FacilityListCtrl = function($rootScope, $scope, $location, ParseService, GlobalService, $modal){
    $scope.init = function(){
        console.log("FacilityListCtrl");

        $( "#facilityListContainer" ).resizable(
            {
                grid: 100,
                animate: true,
                ghost: true
            });
    };

    $scope.toggleComponent = function(){
        $("#facilityComponentBody").toggle();
    };

    $scope.removeComponent = function(){
        console.log("facilityList: removeComponent()");
        $rootScope.$broadcast("removeComponent", {id: "facilityList"});
    };

    //Init
    $scope.init();
};
