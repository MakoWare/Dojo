//WindowCtrl for google map hack

var WindowCtrl = function($rootScope, $scope, $location){
    //view Vehicle
    $scope.viewVehicle = function(marker){
        var obj = jQuery.parseJSON(marker);
        $location.path('/vehicles/' + obj.vehicleId);
    };

    //view Dispatch
    $scope.viewDispatch = function(marker){
        var obj = jQuery.parseJSON(marker);
        $location.path('/dispatches/' + obj.dispatchId);
    };
};
