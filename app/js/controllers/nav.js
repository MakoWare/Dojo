'use strict';

//Nav Controller
var NavCtrl = function($scope, $location, $route, ParseService){
    $scope.pathInit = function(path){
	var path = path.split('#')[path.split('#').length - 1].substr(1);
	$scope.path.home = false;
	$scope.path.dispatch = false;
	$scope.path.users = false;
	$scope.path.vehicles = false;
	$scope.path.pcrs = false;
	$scope.path.configuration = false;
	$scope.path.documentation = false;
	$scope.path.contact = false;
	switch (path){
	case "home":
	    $scope.path.home = true;
	    break;
	case "map":
	    $scope.path.dispatch = true;
	    break;
	case "users":
	    $scope.path.users = true;
	    break;
	case "vehicles":
	    $scope.path.vehicles = true;
	    break;
	case "pcrs":
	    $scope.path.pcrs = true;
	    break;
	case "configs":
	    $scope.path.configuration = true;
	    break;
	case "documentation":
	    $scope.path.documentation = true;
	    break;
	case "contact":
	    $scope.path.contact = true;
	    break;
	case "files":
	    $scope.path.files = true;
	    break;
	}
    };

    $scope.init = function(){
	$scope.currentUser = ParseService.getCurrentUser();
        $scope.fullPath = $location.absUrl();
        $scope.path = {};
        $scope.loggedIn = false;

	if($scope.currentUser == undefined){
	    //Get Path Info
	    $scope.pathInit($scope.fullPath);

	    //Auth here
	    //    $location.path('/');
	} else {
            $scope.loggedIn = true;
	    ParseService.hasRole('Manager', function(results){
		$scope.$apply(function(){
                    $scope.isManager = results;
		});
            });
	    ParseService.hasRole('Dispatcher', function(results){
		$scope.$apply(function(){
                    $scope.isDispatcher = results;
		});
            });
	    ParseService.hasRole('EMT', function(results){
		$scope.$apply(function(){
                    $scope.isEMT = results;
		});
            });
	    //Get Path Info
	    $scope.pathInit($scope.fullPath);
        };
    };
    //Init
    //$scope.init();
};
