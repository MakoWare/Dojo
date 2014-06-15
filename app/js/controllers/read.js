//Crud Controller

var ReadCtrl = function($scope, $location){

    $scope.init = function(){
        $scope.ObjectType = $scope.getObjectType();
        $scope.object = {};
        $scope.getPartial();
    },

    $scope.getObjectType = function(){
        $scope.dir = $location.url().slice(1);

        //Take plurals off directory names and Capitalize First Character
        if($scope.dir.endsWith("ies")){
            $scope.objectType = $scope.dir.charAt(0).toUpperCase() + $scope.dir.slice(1, $scope.dir.length - 3) + "y";
        } else if($scope.dir.endsWith("es")){
            $scope.objectType = $scope.dir.charAt(0).toUpperCase() + $scope.dir.slice(1, $scope.dir.length - 2);
        } else if($scope.dir.endsWith("s")){
            $scope.objectType = $scope.dir.charAt(0).toUpperCase() + $scope.dir.slice(1, $scope.dir.length - 1);
        }
        console.log($scope.objectType);
    },

    $scope.getPartial = function(){
        var object = $scope.objectType.charAt(0).toLowerCase() + $scope.objectType.slice(1);
        var partialLocation = $scope.dir + "/" + object + "List.html";
        return "partials/" + partialLocation;
    };

    $scope.saveObject = function(){
        console.log($scope.object);
    };


    //Init Controller
    $scope.init();
};

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
