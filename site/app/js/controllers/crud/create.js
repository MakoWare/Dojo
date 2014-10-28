//Create or Update Controller
var CreateCtrl = function($scope, $location, ParseService, GlobalService){

    $scope.init = function(){
        $scope.object = {};
        $scope.dir = $location.url().slice(1).split("/")[0];
        $scope.objectType = GlobalService.getObjectType($scope.dir);
        var id = $location.url().split("/")[$location.url().split("/").length - 1];
        $scope.getObject($scope.objectType, id);
    },

    //1. Get Object
    $scope.getObject = function(objectType, objectId){
        ParseService.getObjectById(objectType, objectId, function(results){
            console.log(results);
            if(results){
                $scope.$apply(function(){
                    $scope.object = results;
                    $scope.setUp();
                });
            } else {
                var objectTypeLower = objectType.charAt(0).toLowerCase() + objectType.substr(1) + "s";
                var newPath = "/" + objectTypeLower;
                $location.path(newPath);
                $scope.$apply();
            }
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
        GlobalService.showSpinner();
        switch($scope.objectType){
        case "Dispatch":
            $scope.saveDispatch();
            break;
        case "Facility":
            $scope.saveFacility();
            break;
        case "Patient":
            $scope.savePatient();
            break;

        case "Vehicle":
            $scope.saveVehicle();
            break;
        }
    };


    //Save Dispatch
    $scope.saveDispatch = function(){
        $scope.object.save({
            success: function(result){
                GlobalService.dismissSpinner();
                $scope.object = result;
                console.log(result);
                alert("Object Updated Successfully");
            },
            error: function(object, error){
                GlobalService.dismissSpinner();
                alert(GlobalService.errorMessage + error.message);
            }
        });
    },


    //Save Facility
    $scope.saveFacility = function(){
        $scope.object.save({
            success: function(result){
                GlobalService.dismissSpinner();
                $scope.object = result;
                console.log(result);
                alert("Object Updated Successfully");
            },
            error: function(object, error){
                GlobalService.dismissSpinner();
                alert(GlobalService.errorMessage + error.message);
            }
        });
    },

    //Save Patient
    $scope.savePatient = function(){
        for(var name in $scope.object.attributes) {
            $scope.object.set(name, $scope.object.attributes[name]);
        }
        $scope.object.save({
            success: function(result){
                GlobalService.dismissSpinner();
                $scope.object = result;
                console.log(result);
                alert("Object Updated Successfully");
            },
            error: function(object, error){
                GlobalService.dismissSpinner();
                alert(GlobalService.errorMessage + error.message);
            }
        });
    },

    //Save Vehicle
    $scope.saveVehicle = function(){
        for(var name in $scope.object.attributes) {
            $scope.object.set(name, $scope.object.attributes[name]);
        }
        $scope.object.save({
            success: function(result){
                GlobalService.dismissSpinner();
                $scope.object = result;
                console.log(result);
                alert("Object Updated Successfully");
            },
            error: function(object, error){
                GlobalService.dismissSpinner();
                alert(GlobalService.errorMessage + error.message);
            }
        });
    },

    //Delete Object
    $scope.deleteObject = function(object){
        GlobalService.showSpinner();
        ParseService.deleteObject($scope.object, $scope.objectType, function(results){
            GlobalService.dismissSpinner();
            if(typeof results == "error"){
                alert(GlobalService.errorMessage + results.errorMessage); //Not Sure if this is right
            } else {
                alert("Object deleted Successfully");
                var objectTypeLower = $scope.objectType.charAt(0).toLowerCase() + $scope.objectType.substr(1) + "s";
                var newPath = "/" + objectTypeLower;
                $location.path(newPath);
                $scope.$apply();
            }
        });
    };

    /** Begin to destroy nice and clean Controller here  **/
    $scope.setUp = function(){
        switch($scope.objectType){
        case "Dispatch":
            $scope.dispatchSetup();
            break;
        case "Facility":
            //$scope.facilitySetup();
            break;
        case "Patient":
            $scope.patientSetup();
            break;

        case "Vehicle":
            //$scope.vehicleSetup();
            break;
        }
    },

    //Dispatch Setup
    $scope.dispatchSetup = function(){
        ParseService.findNemsisElementCodes("eDispatch", function(results){
            $scope.eDispatch01 = [];
            $scope.eDispatch02 = [];
            $scope.eDispatch05 = [];

            results.forEach(function(code){
                if(code.get('elementNumber') === "eDispatch.01"){
                    $scope.eDispatch01.push(code);
                } else if(code.get('elementNumber') === "eDispatch.02"){
                    $scope.eDispatch02.push(code);
                } else if(code.get('elementNumber') === "eDispatch.05"){
                    $scope.eDispatch05.push(code);
                }
            });
            console.log($scope);
        });
    },


    //Patient Setup
    $scope.patientSetup = function(){
        //Date Picker setup
        if(!$scope.object.attributes.dob){
            $scope.object.attributes.dob = new Date();
        }
        $scope.format = 'MM/dd/yyyy';
        $scope.dateOptions = {
            startingDay: 1
        };
        $scope.open = function($event) {
            $scope.opened = true;
            $event.preventDefault();
            $event.stopPropagation();
        };
    },

    //Init Controller
    $scope.init();
};
