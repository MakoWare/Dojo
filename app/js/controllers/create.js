//Create Controller

var CreateCtrl = function($scope, $location, GlobalService){

    $scope.init = function(){
        $scope.object = {};
        $scope.dir = $location.url().slice(1).split("/")[0];
        $scope.objectType = GlobalService.getObjectType($scope.dir);
        $scope.getPartial();
        console.log(GlobalService);
    },

    $scope.getPartial = function(){
        var object = $scope.objectType.charAt(0).toLowerCase() + $scope.objectType.slice(1);
        var partialLocation = $scope.dir + "/" + object + ".html";
        return "partials/" + partialLocation;
    };

    $scope.saveObject = function(){
        console.log($scope.object);
    };

    //Init Controller
    $scope.init();
};
