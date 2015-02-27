'use strict';

//Facility List Controller
var FacilityListCtrl = function($rootScope, $scope, $location, ParseService, GlobalService, $modal){
    $scope.init = function(){
        console.log("FacilityListCtrl");

        $( "#facilityList" ).resizable({
            grid: 50,
            ghost: true,
            stop: function(event, ui){
                $scope.resize();
            }
        });

        $("#facilityList").draggable({
            snap: true,
            containment: "#dashboard"
        });

        $scope.$on("dashboardResize", $scope.resize);
        $scope.resize();
    };

    $scope.resize = function(h, w){
        if(h){
            $("#facilityList").height(h);
        }
        if(w){
            $("#facilityList").width(w);
        }

        if( $("#facilityList").width() > $("#dashboard").width()){
            $("#facilityList").width($("#dashboard").width());
        }

        $("#facilityListContainer").height($("#facilityList").height());
        $("#facilityListContainer").width($("#facilityList").width());
    };

    //Toggle Component
    $scope.toggleComponent = function(){
        if(!$scope.toggleComponent.init){
            $scope.toggleComponent.init = true;
            $scope.toggleComponent.isOpen = true;
            $scope.toggleComponent.componentHeight = $("#facilityList").height();
            $scope.toggleComponent.containerHeight = $("#facilityListContainer").height();
        }

        if($scope.toggleComponent.isOpen){
            $scope.toggleComponent.componentHeight = $("#facilityList").height();
            $scope.toggleComponent.containerHeight = $("#facilityListContainer").height();
            $("#facilityList").height(60);
            $("#facilityListContainer").height(50);
            $("#facilityComponentBody").toggle();
            $scope.toggleComponent.isOpen = false;
        } else {
            $("#facilityList").height($scope.toggleComponent.componentHeight);
            $("#facilityListContainer").height($scope.toggleComponent.containerHeight);
            $("#facilityComponentBody").toggle();
            $scope.toggleComponent.isOpen = true;
        }
    };

    //Full Size Component
    $scope.fullSizeComponent = function(){
        $scope.resize($("#dashboard").height(), $("#dashboard").width());
    };

    $scope.removeComponent = function(){
        console.log("facilityList: removeComponent()");
        $rootScope.$broadcast("removeComponent", {id: "facilityList"});
    };

    //Init
    $scope.init();
};
