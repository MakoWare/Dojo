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
            console.log("adding component: " + args.templateUrl);
            $scope.componentsInDashboard.push(args.templateUrl);
            $("#dashboard").append($compile('<div ng-include="\'components/contacts/contactList.html\'"></div>')($scope));
        } else {
            console.log("already in the dashboard, fuck off");
        }
    };


    //Removes Component From the DashBoard
    $scope.removeComponent = function(event, args){
        console.log(args);
        console.log(event);
        console.log("removeComponent");
        var children = $("#dashboard").children();
        console.log(children);
        for(var i = 0; i < children.length; i++){
            var child = children[i];
            console.log(args.id);
            console.log($(child.firstChild).attr('id'));
            if($(child.firstChild).attr('id') == args.id){
                console.log("removing child");
                $(children).remove(children[i]);
            }
        }

        for(var j = 0; j < $scope.componentsInDashboard.length; j++){
            if($scope.componentsInDashboard[j] == args.id){
                $scope.componentsInDashboard.splice(j, 1);
            }
        }
    };


    $scope.init();
};
