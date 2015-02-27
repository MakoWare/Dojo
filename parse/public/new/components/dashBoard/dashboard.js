'use strict';

//DashBoard Controller
var DashBoardCtrl = function($scope, $compile, $location, ParseService, GlobalService){

    $scope.init = function(){
        console.log("dashboard");
        $scope.$on("addComponent", $scope.addComponent);
        $scope.$on("removeComponent", $scope.removeComponent);
        $scope.componentsInDashboard = [];

//        $( "#dashboard" ).sortable();
//        $( "#dashboard" ).disableSelection();

    };

    //Adds a Component to the DashBoard
    $scope.addComponent = function(event, args){
        if($.inArray(args.templateUrl, $scope.componentsInDashboard) == -1){
            $scope.componentsInDashboard.push(args.templateUrl);
            var id = args.templateUrl.split("/")[args.templateUrl.split("/").length - 1];
            var divString = '<div id="' + id + '" ng-include="\'' + args.templateUrl + '.html\'"></div>';
            $("#dashboard").append($compile(divString)($scope));
        } else {
            console.log("already in the dashboard, fuck off");
        }
    };


    //Removes Component From the DashBoard
    $scope.removeComponent = function(event, args){
        var children = $("#dashboard").children();
        for(var i = 0; i < children.length; i++){
            var child = children[i];
            if($(child).attr('id') == args.id){
                $(child).detach();
            }
        }

        for(var j = 0; j < $scope.componentsInDashboard.length; j++){
            var currentComponent = $scope.componentsInDashboard[j].split("/")[$scope.componentsInDashboard[j].split("/").length -1];
            if(currentComponent == args.id){
                $scope.componentsInDashboard.splice(j, 1);
            }
        }
    };


    $scope.init();
};
