//Login Controller
var LoginCtrl = function($scope, $location, ParseService){

    //Login
    $scope.login = function(){
	ParseService.login($scope.username, $scope.password, function(user){
            if(user != undefined){
		$location.path('/map');
	    }
        });
    };


};
