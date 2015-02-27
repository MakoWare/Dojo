'use strict';

//Contact List Controller
var ContactListCtrl = function($rootScope, $scope, $location, ParseService, GlobalService, $modal){
    $scope.init = function(){
        console.log("ContactListCtrl");

        $("#contactList").resizable({
            grid: 50,
            ghost: true,
            stop: function(event, ui){
                $scope.resize();
            }
        });

        $("#contactList").draggable({
            snap: true,
            grid: [ 50, 50 ]
        });

        $scope.resize();

    };

    $scope.resize = function(h, w){
        if(h){
            $("#contactList").height(h);
        }
        if(w){
            $("#contactList").width(w);
        }

        $("#contactListContainer").height($("#contactList").height());
        $("#contactListContainer").width($("#contactList").width());

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
