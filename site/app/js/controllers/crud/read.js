//Read Controller
var ReadCtrl = function($scope, $location, GlobalService, ParseService){

    $scope.init = function(){
        $scope.objects = [];
        $scope.dir = $location.url().slice(1);
        $scope.objectType = GlobalService.getObjectType($scope.dir);
        $scope.getPartial();
        $scope.findObjects($scope.objectType, $scope.searchParam, $scope.filterParam);
    },

    $scope.getPartial = function(){
        var object = $scope.objectType.charAt(0).toLowerCase() + $scope.objectType.slice(1);
        var partialLocation = $scope.dir + "/" + object + "List.html";
        return "partials/" + partialLocation;
    };

    $scope.findObjects = function(objectType, searchParam, filterParam){
        ParseService.findObjects(objectType, searchParam, filterParam, function(results){
            $scope.$apply(function(){
                console.log(results);
                $scope.objects = results;
            });
        });

    };

    //Init
    $scope.init();
};
