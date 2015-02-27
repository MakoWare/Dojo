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
            grid: [ 50, 50 ]
        });

        $scope.resize();

    };

    $scope.resize = function(h, w){
        if(h){
            $("#dispatchList").height(h);
        }
        if(w){
            $("#dispatchList").width(w);
        }

        $("#dispatchListContainer").height($("#dispatchList").height());
        $("#dispatchListContainer").width($("#dispatchList").width());

    };


    $scope.toggleComponent = function(){
        $("#dispatchComponentBody").toggle();
    };


    $scope.removeComponent = function(){
        console.log("broadcast");
        $rootScope.$broadcast("removeComponent", {id: "dispatchList"});
    };

    //Init
    $scope.init();
};
