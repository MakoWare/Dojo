//Login Controller
var LoginCtrl = function($rootScope, $scope, $location, ParseService, GlobalService){
    //Login
    $scope.login = function(){
	ParseService.login($scope.username, $scope.password, function(user){
            if(user != undefined){
		ParseService.hasRole("Manager", function(result){
		    if(result){
			$scope.$apply(function(){
			    $location.path('/home');
			});
		    }
		});
		ParseService.hasRole("Dispatcher", function(result){
		    if(result){
			$scope.$apply(function(){
			    $location.path('/home');
			});
		    }
		});
		ParseService.hasRole("EMT", function(result){
		    if(result){
			$scope.$apply(function(){
			    $location.path('/home');
			});
		    }
		});
		ParseService.hasRole("None", function(result){
		    if(result){
			$scope.$apply(function(){
			    $location.path('/wait');
			});
		    }
		});
            }
        });
    };
};
