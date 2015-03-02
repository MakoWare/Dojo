'use strict';

//Contact List Controller
var ContactListCtrl = function($rootScope, $scope, $location, ParseService, GlobalService, $modal){
    $scope.init = function(){
        console.log("ContactListCtrl");
        $scope.findContacts();
    };


    //Find Contacts
    $scope.findContacts = function(){
        ParseService.findObjectsByAgency("Contact", function(results){
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
