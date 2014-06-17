//Update Controller

var UpdateCtrl = function($scope, $location, ParseService, GlobalService){

    $scope.init = function(){
        $scope.object = {};
        $scope.searchParam = "";
        $scope.filterParam = "";
        $scope.dir = $location.url().slice(1).split("/")[0];
        $scope.objectType = GlobalService.getObjectType($scope.dir);
        $scope.getPartial();
//        $scope.getObject($scope.objectType, $location.url().split("/")[$location.url().length]);
    },

    $scope.getPartial = function(){
        var object = $scope.objectType.charAt(0).toLowerCase() + $scope.objectType.slice(1);
        var partialLocation = $scope.dir + "/" + object + "List.html";
        return "partials/" + partialLocation;
    };

    $scope.getObject = function(objectType, objectId){
        ParseService.getObject(objectType,objectId, function(results){
            console.log(results);
        });
    };

    $scope.updateObject = function(object){
        ParseService.getObject(object, function(results){
            console.log(results);
        });
    };

    $scope.deleteObject = function(object){
        ParseService.deleteObject(object, function(results){
            console.log(results);
        });
    };

    //Init
    $scope.init();
};
