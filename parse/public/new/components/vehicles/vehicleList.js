'use strict';

//Vehicle List Controller
var VehicleListCtrl = function($rootScope, $scope, $location, ParseService, GlobalService, $modal){
    $scope.init = function(){
        console.log("VehicleListCtrl");

        $("#vehicelList").resizable({
            grid: 50,
            ghost: true,
            stop: function(event, ui){
                $scope.resize();
            }
        });

        $("#vehicleList").draggable({
            snap: true,
            grid: [ 50, 50 ]
        });

        $scope.resize();
    };

    $scope.resize = function(h, w){
        if(h){
            $("#vehicleList").height(h);
        }
        if(w){
            $("#vehicleList").width(w);
        }

        $("#vehicleListContainer").height($("#vehicleList").height());
        $("#vehicleListContainer").width($("#vehicleList").width());

    };


    $scope.toggleComponent = function(){
        $("#vehicleComponentBody").toggle();
    };


    $scope.removeComponent = function(){
        console.log("broadcast");
        $rootScope.$broadcast("removeComponent", {id: "vehicleList"});
    };

    //Init
    $scope.init();
};
