//Admin Controller
var AdminCtrl = function($scope, $location, GlobalService, ParseService){

    $scope.init = function(){
        $scope.agency = {};
    },

    $scope.createAgency = function(){
        ParseService.createAgency($scope.agency.name, function(results){
            console.log(results);
        });
    },

    //Init
    $scope.init();
};
