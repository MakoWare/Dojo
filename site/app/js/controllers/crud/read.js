//Read Controller
var ReadCtrl = function($scope, $location, GlobalService, ParseService){

    $scope.init = function(){
        $scope.objects = [];
        $scope.dir = $location.url().slice(1);
        $scope.objectType = GlobalService.getObjectType($scope.dir);
        $scope.getPartial();
        $scope.findObjects($scope.objectType);
    },

    $scope.getPartial = function(){
        var object = $scope.objectType.charAt(0).toLowerCase() + $scope.objectType.slice(1);
        var partialLocation = $scope.dir + "/" + object + "List.html";
        return "partials/" + partialLocation;
    };

    $scope.findObjects = function(objectType){
        ParseService.findObjectsByAgency(objectType, function(results){
            $scope.$apply(function(){
                $scope.objects = results;
                console.log(results);
            });
        });
    };

    $scope.createObject = function(objectType){
        ParseService.createObject(objectType, function(results){
            var objectTypeLower = objectType.charAt[0].toLowerCase() + objectType.split(1);
            var newPath = "/" + objectTypeLower + "/" + results.id;
            $location.path(newPath);
        });
    },

    //Init
    $scope.init();
};
