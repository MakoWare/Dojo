'use strict';

//Patient List Controller
var PatientListCtrl = function($rootScope, $scope, $location, ParseService, GlobalService, $modal){
    $scope.init = function(){
        console.log("PatientListCtrl");

        $("#patientList").resizable({
            grid: 50,
            ghost: true,
            stop: function(event, ui){
                $scope.resize();
            }
        });

        $("#patientList").draggable({
            snap: true,
            containment: "#dashboard"
        });

        $scope.$on("dashboardResize", $scope.resize);
        $scope.resize();
    };

    $scope.resize = function(h, w){
        if(h){
            $("#patientList").height(h);
        }
        if(w){
            $("#patientList").width(w);
        }

        if( $("#patientList").width() > $("#dashboard").width()){
            $("#patientList").width($("#dashboard").width());
        }

        $("#patientListContainer").height($("#patientList").height());
        $("#patientListContainer").width($("#patientList").width());

    };

    $scope.toggleComponent = function(){
        if(!$scope.toggleComponent.init){
            $scope.toggleComponent.init = true;
            $scope.toggleComponent.isOpen = true;
            $scope.toggleComponent.componentHeight = $("#patientList").height();
            $scope.toggleComponent.containerHeight = $("#patientListContainer").height();
        }

        if($scope.toggleComponent.isOpen){
            $scope.toggleComponent.componentHeight = $("#patientList").height();
            $scope.toggleComponent.containerHeight = $("#patientListContainer").height();
            $("#patientList").height(60);
            $("#patientListContainer").height(50);
            $("#patientComponentBody").toggle();
            $scope.toggleComponent.isOpen = false;
        } else {
            $("#patientList").height($scope.toggleComponent.componentHeight);
            $("#patientListContainer").height($scope.toggleComponent.containerHeight);
            $("#patientComponentBody").toggle();
            $scope.toggleComponent.isOpen = true;
        }
    };


    //Full Size Component
    $scope.fullSizeComponent = function(){
        $scope.resize($("#dashboard").height(), $("#dashboard").width());
    };

    $scope.removeComponent = function(){
        console.log("broadcast");
        $rootScope.$broadcast("removeComponent", {id: "patientList"});
    };

    //Init
    $scope.init();
};
