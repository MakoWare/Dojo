'use strict';

//Facility List Controller
var FacilityListCtrl = function($rootScope, $scope, $location, ParseService, GlobalService, $modal){
    $scope.init = function(){
        console.log("FacilityListCtrl");
        $scope.findFacilities();
    };

    //Find Facilities
    $scope.findFacilities = function(){
        ParseService.findObjectsByAgency("Facility", function(results){
            console.log(results);
            $scope.$apply(function(){
                $scope.objects = results;
            });
        });
    };



    //Init
    $scope.init();
};
