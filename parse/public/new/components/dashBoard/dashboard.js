'use strict';

//DashBoard Controller
var DashBoardCtrl = function($scope, $compile, $location, ParseService, GlobalService){

    $scope.init = function(){
        console.log("dashboard");
        $scope.$on("addComponent", $scope.addComponent);
        $scope.$on("removeComponent", $scope.removeComponent);
        $scope.componentsInDashboard = [];

    };

    //Adds a Component to the DashBoard
    $scope.addComponent = function(event, args){
        if($.inArray(args.templateUrl, $scope.componentsInDashboard) == -1){
            $scope.componentsInDashboard.push(args.templateUrl);
            var id = args.templateUrl.split("/")[args.templateUrl.split("/").length - 1];
            console.log("add Component id: " + id);
            var divString = '<div id="' + id + '" ng-include="\'' + args.templateUrl + '.html\'"></div>';
            $("#dashboard").append($compile(divString)($scope));
        } else {
            console.log("already in the dashboard, fuck off");
        }
    };


    //Removes Component From the DashBoard
    $scope.removeComponent = function(event, args){
        console.log("removeComponent");
        var children = $("#dashboard").children();
        console.log(children);
        for(var i = 0; i < children.length; i++){
            var child = children[i];
            console.log($(child).attr('id'));
            if($(child).attr('id') == args.id){
                console.log("removing child");
                $(child).detach();
//                $("#dashboard").children().slice(i).detach();
            }
        }

        for(var j = 0; j < $scope.componentsInDashboard.length; j++){
            var currentComponent = $scope.componentsInDashboard[j].split("/")[$scope.componentsInDashboard[j].split("/").length -1];
            console.log(currentComponent);
            console.log($scope.componentsInDashboard[j]);
            if(currentComponent == args.id){
                $scope.componentsInDashboard.splice(j, 1);
            }
        }
    };


    $scope.init();
};