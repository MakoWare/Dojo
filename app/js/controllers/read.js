//Read Controller

//var ReadCtrl = function($scope, $location, ParseService, GlobalService){
var ReadCtrl = function($scope, $location, GlobalService){

    $scope.init = function(){
        $scope.objects = [];
        $scope.searchParam = "";
        $scope.predicate = "";
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
        for(var i=0; i < 10; i++){
            var object = {};
            object.attributes = {};
            object.attributes.id = i;
            object.attributes.username = "Balls Sack" + i;
            object.attributes.createdAt = new Date();
            object.attributes.role = "Dick Role" + (10 / i);
            $scope.objects.push(object);
        }
            console.log($scope.objects);

        /*
        ParseService.findObjects(objectType, searchParam, filterParam, function(results){
            console.log(results);
        });
         */

    };

    //Init
    $scope.init();
};
