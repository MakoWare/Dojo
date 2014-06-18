//Read Controller

//var ReadCtrl = function($scope, $location, ParseService, GlobalService){
var ReadCtrl = function($scope, $location, GlobalService){

    $scope.init = function(){
        $scope.objects = {};
        $scope.searchParam = "";
        $scope.filterParam = "";
        $scope.dir = $location.url().slice(1);
        $scope.objectType = GlobalService.getObjectType($scope.dir);
        console.log($scope.objectType);
        $scope.getPartial();
//        $scope.findObjects($scope.objectType, $scope.searchParam, $scope.filterParam);
    },

    $scope.getPartial = function(){
        var object = $scope.objectType.charAt(0).toLowerCase() + $scope.objectType.slice(1);
        var partialLocation = $scope.dir + "/" + object + "List.html";
        return "partials/" + partialLocation;
    };

    $scope.findObjects = function(objectType, searchParam, filterParam){
        ParseService.findObjects(objectType, searchParam, filterParam, function(results){
            console.log(results);
        });
    };

    //Init
    $scope.init();
};
