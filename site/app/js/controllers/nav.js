'use strict';

//Nav Controller
var NavCtrl = function($scope, $location, $route, ParseService){

    $scope.init = function(){
        $scope.dir = $location.url().slice(1).split("/")[0];

	$scope.currentUser = ParseService.getCurrentUser();
        $scope.path = {};
        $scope.loggedIn = false;
        $scope.role = "";

	if($scope.currentUser == undefined){


	} else {
            $scope.loggedIn = true;
            $scope.role = ParseService.getCurrentUser().get('type');
        }
    };

    $scope.logout = function(){
        ParseService.logout();
        $location.url("/");
    };


    //Init
    $scope.init();
};
