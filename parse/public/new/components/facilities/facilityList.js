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
            grid: [ 50, 50 ]
        });

        $scope.resize();

    };

    $scope.resize = function(h, w){
        if(h){
            $("#facilityList").height(h);
        }
        if(w){
            $("#facilityList").width(w);
        }

        $("#facilityListContainer").height($("#facilityList").height());
        $("#facilityListContainer").width($("#facilityList").width());

    };

    $scope.toggleComponent = function(){
        $("#facilityComponentBody").toggle();
    };

    $scope.removeComponent = function(){
        console.log("facilityList: removeComponent()");
        $rootScope.$broadcast("removeComponent", {id: "facilityList"});
    };

    //Init
    $scope.init();
};
