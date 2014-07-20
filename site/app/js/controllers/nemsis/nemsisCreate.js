//Nemsis Create Controller
var NemsisCreateCtrl = function($scope, $location, ParseService, GlobalService){

    $scope.init = function(){
        $scope.object = {};
        $scope.dir = $location.url().slice(1).split("/")[0];
        $scope.nemsisObjectType = $location.url().split("nemsis/")[1].split("/")[0];

        console.log($scope);


//        $scope.createObject($scope.objectType);
//        $scope.getPartial(); //may need to go in createObject callback
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
        return "partials/nemsis/" + $scope.nemsisObjectType + "/" + $scope.nemsisObjectType + ".html";
    };

    //Init Controller
    $scope.init();
};
