'use strict';

//Location List Controller
var LocationListCtrl = function($rootScope, $scope, $location, ParseService, GlobalService, $modal){
    $scope.init = function(){
        console.log("LocationListCtrl");

        $("#locationList").resizable({
            grid: 50,
            ghost: true,
            stop: function(event, ui){
                $scope.resize();
            }
        });

        $("#locationList").draggable({
            snap: true,
            grid: [ 50, 50 ]
        });

        $scope.resize();
    };

    $scope.resize = function(h, w){
        if(h){
            $("#locationList").height(h);
        }
        if(w){
            $("#locationList").width(w);
        }

        $("#locationListContainer").height($("#locationList").height());
        $("#locationListContainer").width($("#locationList").width());

    };

    $scope.toggleComponent = function(){

        if(!$scope.toggleComponent.init){
            $scope.toggleComponent.isOpen = true;
            $scope.toggleComponent.height = $("#locationList").height();
        }

        if($scope.toggleComponent.isOpen){
            $scope.toggleComponent.height = $("#locationList").height();
            $("#locationList").height(50);
            $scope.toggleComponent.isOpen = false;
        } else {
            $("#locationList").height($scope.toggleComponent.height);
            $scope.toggleComponent.isOpen = true;
        }

    };


    $scope.removeComponent = function(){
        console.log("broadcast");
        $rootScope.$broadcast("removeComponent", {id: "contactList"});
    };

    //Init
    $scope.init();
};
