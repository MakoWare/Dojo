//Crud Controller

var ReadCtrl = function($scope, $location, ParseService){

    $scope.init = function(){
        $scope.objects = {};
        $scope.searchParam = "";
        $scope.filterParam = "";
        $scope.objectType = $scope.getObjectType();
        $scope.getPartial();
        $scope.getObjects($scope.objectType, $scope.searchParam, $scope.filterParam);
    },

    $scope.getObjectType = function(){
        $scope.dir = $location.url().slice(1);

        //Take plurals off directory names and Capitalize First Character
        if($scope.dir.endsWith("ies")){
            return $scope.dir.charAt(0).toUpperCase() + $scope.dir.slice(1, $scope.dir.length - 3) + "y";
        } else if($scope.dir.endsWith("es")){
            return $scope.dir.charAt(0).toUpperCase() + $scope.dir.slice(1, $scope.dir.length - 2);
        } else if($scope.dir.endsWith("s")){
            return $scope.dir.charAt(0).toUpperCase() + $scope.dir.slice(1, $scope.dir.length - 1);
        } else {
            alert("An Error occured, please contact us");
            return "ERROR";
        }
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
