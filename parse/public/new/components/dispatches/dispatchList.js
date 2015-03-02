'use strict';

//Dispatch List Controller
var DispatchListCtrl = function($rootScope, $scope, $location, ParseService, GlobalService, $modal){
    $scope.init = function(){
        console.log("DispatchListCtrl");
        //$scope.findDispatches();
    };

    //Find Contacts
    $scope.findDispatches = function(){
        ParseService.findObjectsByAgency("Dispatch", function(results){
          //  $scope.dismissSpinner();
            console.log(results);
            $scope.$apply(function(){
                $scope.objects = results;
            });
        });
    };

    //Init
    $scope.init();
};
