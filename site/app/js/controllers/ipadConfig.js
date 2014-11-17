//Ipad Configurations Controller
var IpadConfigCtrl = function($scope, $location, ParseService, GlobalService){

    $scope.init = function(){
        GlobalService.showSpinner();

        $scope.getIpadConfig();
    },

    $scope.getIpadConfig = function(){
        ParseService.getIpadConfig(function(result){
            if(result.id){
                $scope.config = result;
                ParseService.getAllNemsisHeaders(function(results){
                    if(results.length > 0){
                        $scope.headers = results;
                        $scope.headers.forEach(function(header){
                            var elementNumber = header.attributes.ElementNumber.replace(".", "_");
                            header.capturing = $scope.config.attributes.elements[elementNumber];
                        });
                        $scope.$apply();
                        GlobalService.dismissSpinner();
                    } else {
                        alert(GlobalService.errorMessage + results.message);
                    }

                });
            } else {
                alert(GlobalService.errorMessage + result.message);
            }
        });
    },

    $scope.save = function(){
        GlobalService.showSpinner();
        $scope.headers.forEach(function(header){
            var elementNumber = header.attributes.ElementNumber.replace(".", "_");
            $scope.config.attributes.elements[elementNumber] = header.capturing;
        });
        $scope.config.set('elements', $scope.config.attributes.elements);
        $scope.config.save({
            success: function(config){
                GlobalService.dismissSpinner();
                $location.url("/configurations");
                $scope.$apply();
            },
            error: function(object, error){
                GlobalService.dismissSpinner();
                alert(GlobalService.errorMessage + error.message);
            }
        });
    },
    $scope.init();
};
