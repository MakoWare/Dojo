'use strict';

//Dispatch List Controller
var DispatchListCtrl = function($rootScope, $scope, $location, ParseService, GlobalService, $modal){
    $scope.init = function(){
        console.log("DispatchListCtrl");

        $("#dispatchList").resizable({
            grid: 50,
            ghost: true,
            stop: function(event, ui){
                $scope.resize();
            }
        });

        $("#dispatchList").draggable({
            snap: true,
            containment: "#dashboard"
        });

        $scope.$on("dashboardResize", $scope.resize);
        $scope.resize();
    };

    $scope.resize = function(h, w){
        if(h){
            $("#dispatchList").height(h);
        }
        if(w){
            $("#dispatchList").width(w);
        }

        if( $("#vehicleList").width() > $("#dashboard").width()){
            $("#vehicleList").width($("#dashboard").width());
        }

        $("#dispatchListContainer").height($("#dispatchList").height());
        $("#dispatchListContainer").width($("#dispatchList").width());
    };


    //Toggle Component
    $scope.toggleComponent = function(){
        if(!$scope.toggleComponent.init){
            $scope.toggleComponent.init = true;
            $scope.toggleComponent.isOpen = true;
            $scope.toggleComponent.componentHeight = $("#dispatchList").height();
            $scope.toggleComponent.containerHeight = $("#dispatchListContainer").height();
        }

        if($scope.toggleComponent.isOpen){
            $scope.toggleComponent.componentHeight = $("#dispatchList").height();
            $scope.toggleComponent.containerHeight = $("#dispatchListContainer").height();
            $("#dispatchList").height(60);
            $("#dispatchListContainer").height(50);
            $("#dispatchComponentBody").toggle();
            $scope.toggleComponent.isOpen = false;
        } else {
            $("#dispatchList").height($scope.toggleComponent.componentHeight);
            $("#dispatchListContainer").height($scope.toggleComponent.containerHeight);
            $("#dispatchComponentBody").toggle();
            $scope.toggleComponent.isOpen = true;
        }
    };

    //Full Size Component
    $scope.fullSizeComponent = function(){
        $scope.resize($("#dashboard").height(), $("#dashboard").width());
    };

    $scope.removeComponent = function(){
        console.log("broadcast");
        $rootScope.$broadcast("removeComponent", {id: "dispatchList"});
    };

    //Init
    $scope.init();
};
