//Run Controller
var RunCtrl = function($scope, $location, ParseService, GlobalService){

    $scope.init = function(){
        console.log("running");


        ObjectHelper.createAgency("Best Medical", function(result){
            console.log(result);
        });

    },

    $scope.init();
};
