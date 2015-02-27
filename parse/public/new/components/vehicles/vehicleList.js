'use strict';

//Vehicle List Controller
var VehicleListCtrl = function($rootScope, $scope, $location, ParseService, GlobalService, $modal){
    $scope.init = function(){
        console.log("VehicleListCtrl");

        $("#vehicleList").resizable({
            grid: 50,
            ghost: true,
            stop: function(event, ui){
                $scope.resize();
            }
        });

        $("#vehicleList").draggable({
            snap: true,
            containment: "#dashboard"
        });

        $scope.$on("dashboardResize", $scope.resize);
        $scope.resize();
    };

    $scope.resize = function(h, w){
        if(h){
            $("#vehicleList").height(h);
        }
        if(w){
            $("#vehicleList").width(w);
        }

        if( $("#vehicleList").width() > $("#dashboard").width()){
            $("#vehicleList").width($("#dashboard").width());
        }

        $("#vehicleListContainer").height($("#vehicleList").height());
        $("#vehicleListContainer").width($("#vehicleList").width());

    };


    $scope.toggleComponent = function(){
        if(!$scope.toggleComponent.init){
            $scope.toggleComponent.init = true;
            $scope.toggleComponent.isOpen = true;
            $scope.toggleComponent.componentHeight = $("#vehicleList").height();
            $scope.toggleComponent.containerHeight = $("#vehicleListContainer").height();
        }

        if($scope.toggleComponent.isOpen){
            $scope.toggleComponent.componentHeight = $("#vehicleList").height();
            $scope.toggleComponent.containerHeight = $("#vehicleListContainer").height();
            $("#vehicleList").height(60);
            $("#vehicleListContainer").height(50);
            $("#vehicleComponentBody").toggle();
            $scope.toggleComponent.isOpen = false;
        } else {
            $("#vehicleist").height($scope.toggleComponent.componentHeight);
            $("#vehicleListContainer").height($scope.toggleComponent.containerHeight);
            $("#vehicleComponentBody").toggle();
            $scope.toggleComponent.isOpen = true;
        }
    };

    //Full Size Component
    $scope.fullSizeComponent = function(){
        $scope.resize($("#dashboard").height(), $("#dashboard").width());
    };


    $scope.removeComponent = function(){
        console.log("broadcast");
        $rootScope.$broadcast("removeComponent", {id: "vehicleList"});
    };

    //Init
    $scope.init();
};
