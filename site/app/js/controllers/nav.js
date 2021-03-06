'use strict';

//Nav Controller
var NavCtrl = function($scope, $location, ParseService, GlobalService){

    $scope.init = function(){
        $scope.dir = $location.url().slice(1).split("/")[0];
	$scope.currentUser = ParseService.getCurrentUser();
        $scope.path = {};
        $scope.loggedIn = false;
        $scope.role = "";

	if(!$scope.currentUser){
            if($scope.dir == "documentation" || $scope.dir == "contact"){

            } else {
                $location.url("/");
            }
	} else {
            $scope.loggedIn = true;
            ParseService.getRole(ParseService.getCurrentUser(), function(result){
                if(result){
                    $scope.role = result.get('name').split("_")[0];
                    $scope.$apply();
                }
            });
        }
    };

    $scope.logout = function(){
        ParseService.logout();
        $location.url("/");
    };

    $scope.$on('$routeChangeSuccess', function(next, current) {
        $scope.init();
    });

};

angular.module('navigation',[])
    .directive('navigation',['$location', 'ParseService', 'GlobalService', function($location, ParseService, GlobalService){
	return {
	    restrict:'A',
	    isolate:true,
	    link: function($scope,$elm,$attrs){
		new NavCtrl($scope, $location, ParseService, GlobalService);
	    },
	    scope:true,
            templateUrl: "partials/nav.html"
	};
    }]);
