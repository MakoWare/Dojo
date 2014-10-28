//Login Controller
var LoginCtrl = function($scope, $location, ParseService){
    $scope.init = function(){
        if(Parse.User.current()){
	    $location.path('/map');
        }
    },

    //Login
    $scope.login = function(){
        ParseService.login($scope.username, $scope.password, function(user){
            if(user != undefined){
		$location.path('/map');
            }
        });
    };

    $scope.init();
};
