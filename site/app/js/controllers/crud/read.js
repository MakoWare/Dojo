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
        GlobalService.showSpinner();
        ParseService.createObject(objectType, function(results){
            GlobalService.dismissSpinner();
            console.log(results);
            var objectTypeLower = objectType.charAt(0).toLowerCase() + objectType.substr(1) + "s";
            var newPath = "/" + objectTypeLower + "/" + results.id;
            console.log(newPath);
            $location.path(newPath);
            $scope.$apply();
        });

    },

    //Init
    $scope.init();
};
