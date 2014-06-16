//Update Controller

var UpdateCtrl = function($scope, $location, ParseService, GlobalService){

    $scope.init = function(){
        $scope.objects = {};
        $scope.searchParam = "";
        $scope.filterParam = "";
        $scope.dir = $location.url().slice(1).split("/")[0];
        $scope.objectType = GlobalService.getObjectType($scope.dir);
        $scope.getPartial();
        $scope.getObjects($scope.objectType, $scope.searchParam, $scope.filterParam);
    },

    $scope.getPartial = function(){
        var object = $scope.objectType.charAt(0).toLowerCase() + $scope.objectType.slice(1);
        var partialLocation = $scope.dir + "/" + object + "List.html";
        return "partials/" + partialLocation;
    };

    $scope.getObjects = function(objectType, searchParam, filterParam){
        ParseService.getObjects(objectType, searchParam, filterParam, function(results){
            console.log(results);
        });
    };

    //Init
    $scope.init();
};

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
