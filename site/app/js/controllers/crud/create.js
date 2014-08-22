//Create or Update Controller
var CreateCtrl = function($scope, $location, ParseService, GlobalService){

    $scope.init = function(){
        $scope.object = {};
        $scope.dir = $location.url().slice(1).split("/")[0];
        $scope.objectType = GlobalService.getObjectType($scope.dir);
        var end = $location.url().split("/")[$location.url().split("/").length - 1];

        if(end == "add"){
            $scope.type = "Create";
            $scope.createObject($scope.objectType);
        } else {
            $scope.type = "Update";
            $scope.getObject($scope.objectType, end);
        }

        //$scope.getPartial(); //may need to go in createObject callback
    },

    //1a. Create Object
    $scope.createObject = function(objectType){
        ParseService.createObject(objectType, function(results){
            console.log(results);
            $scope.object = results;
        });
    },

    //1b. Get Object
    $scope.getObject = function(objectType, objectId){
        ParseService.getObject(objectType,objectId, function(results){
            console.log(results);
        });
    };

    //2. Get Partial
    $scope.getPartial = function(){
        var object = $scope.objectType.charAt(0).toLowerCase() + $scope.objectType.slice(1);
        var partialLocation = $scope.dir + "/" + object + ".html";
        return "partials/" + partialLocation;
    };

    //Save Object
    $scope.saveObject = function(){
        ParseService.saveObject($scope.object);
    };

    //Delete Object
    $scope.deleteObject = function(object){
        object.destroy({
            success: function(results){
                alert("Delete Successful");
            },
            error: function(object, error){
                alert("Error, please contact us with this message: " + error.message);
            }
        });
    };

    //Init Controller
    $scope.init();
};
