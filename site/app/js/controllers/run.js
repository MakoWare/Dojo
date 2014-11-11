//Run Controller
var RunCtrl = function($scope, $location, ParseService, GlobalService){

    $scope.init = function(){
        console.log("running");

        ParseService.changeRole(Parse.User.current(), "Admin", function(results){
            console.log(results);
        });

    },

    $scope.init();
};
