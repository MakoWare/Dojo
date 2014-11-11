//Login Controller
var LoginCtrl = function($scope, $location, ParseService, GlobalService){
    $scope.init = function(){
        if(Parse.User.current()){
	    $location.path('/map');
        }
    },

    //Login
    $scope.login = function(){
        GlobalService.showSpinner();
        ParseService.login($scope.username, $scope.password, function(results){
            GlobalService.dismissSpinner();
            if(results.id){
                console.log(results);
                if(results.attributes.active){
                    $location.path('/map');
                    $scope.$apply();
                } else {
                    alert("Your User account is not currently active, please have a manager activate your user account");
                    ParseService.logout();
                }
            } else {
                alert(results.message);
            }
        });
    };

    $scope.init();
};
