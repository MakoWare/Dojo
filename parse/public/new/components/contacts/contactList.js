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
            containment: "#dashboard"
        });

        $scope.$on("dashboardResize", $scope.resize);

        $scope.resize();
    };

    $scope.resize = function(h, w){
        if(h){
            $("#contactList").height(h);
        }
        if(w){
            $("#contactList").width(w);
        }

        if( $("#contactList").width() > $("#dashboard").width()){
            $("#contactList").width($("#dashboard").width());
        }

        $("#contactListContainer").height($("#contactList").height());
        $("#contactListContainer").width($("#contactList").width());

    };

    //Toggle Component
    $scope.toggleComponent = function(){
        if(!$scope.toggleComponent.init){
            $scope.toggleComponent.init = true;
            $scope.toggleComponent.isOpen = true;
            $scope.toggleComponent.componentHeight = $("#contactList").height();
            $scope.toggleComponent.containerHeight = $("#contactListContainer").height();
        }

        if($scope.toggleComponent.isOpen){
            $scope.toggleComponent.componentHeight = $("#contactList").height();
            $scope.toggleComponent.containerHeight = $("#contactListContainer").height();
            $("#contactList").height(60);
            $("#contactListContainer").height(50);
            $("#contactComponentBody").toggle();
            $scope.toggleComponent.isOpen = false;
        } else {
            $("#contactList").height($scope.toggleComponent.componentHeight);
            $("#contactListContainer").height($scope.toggleComponent.containerHeight);
            $("#contactComponentBody").toggle();
            $scope.toggleComponent.isOpen = true;
        }
    };


    //Full Size Component
    $scope.fullSizeComponent = function(){
        $scope.resize($("#dashboard").height(), $("#dashboard").width());
    };


    $scope.removeComponent = function(){
        console.log("broadcast");
        $rootScope.$broadcast("removeComponent", {id: "contactList"});
    };

    //Init
    $scope.init();
};
