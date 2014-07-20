//Create Controller
var CreateCtrl = function($scope, $location, ParseService, GlobalService){

    $scope.init = function(){
        $scope.object = {};
        $scope.dir = $location.url().slice(1).split("/")[0];
        $scope.objectType = GlobalService.getObjectType($scope.dir);
//        $scope.createObject($scope.objectType);
        $scope.getPartial(); //may need to go in createObject callback
    },

    //Create Object
    $scope.createObject = function(objectType){
        ParseService.createObject(objectType, function(results){
            console.log(results);
            $scope.object = results;
        });
    },

    //Save Object
    $scope.saveObject = function(){
        ParseService.saveObject($scope.object);
    };

    //Get Partial
    $scope.getPartial = function(){
        var object = $scope.objectType.charAt(0).toLowerCase() + $scope.objectType.slice(1);
        var partialLocation = $scope.dir + "/" + object + ".html";
        return "partials/" + partialLocation;
    };

    //Init Controller
    $scope.init();
};
