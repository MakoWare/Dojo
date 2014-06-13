//Create Controller

var CreateCtrl = function($scope, $location){

    $scope.init = function(){
        $scope.ObjectType = $scope.getObjectType();
        $scope.getPartial();
    },

    $scope.getObjectType = function(){
        $scope.objectType  = $location.url().substr(1).split("/")[0].substr(0, $location.url().substr(1).split("/")[0].length - 1);
        $scope.objectType  = $scope.objectType.charAt(0).toUpperCase() + $scope.objectType.substr(1, $scope.objectType.length);
    },

    $scope.getPartial = function(){
        var nemsisPartial = "create" + $scope.objectType;
        return "partials/nemsis/" + nemsisPartial + ".html";
    };

    //Init Controller
    $scope.init();

};
