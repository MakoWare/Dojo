'use strict';

//Nav Controller
var NavCtrl = function($scope, $location, $route){
//var NavCtrl = function($scope, $location, $route, ParseService){

    $scope.init = function(){
        $scope.dir = $location.url().slice(1).split("/")[0];

        //Do Auth in this controller
        //Maybe make a API call to get Role or Routes?

        /*
	$scope.currentUser = ParseService.getCurrentUser();
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
         */
    };

    //Init
    $scope.init();
};
