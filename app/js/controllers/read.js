//Crud Controller

var CrudCtrl = function($scope, $location){

    $scope.init = function(){
        $scope.object = $location.url().split('/')[1];
        console.log($scope);
    },

    $scope.getPartial = function(){
        return "partials/home.html";
    };

    $scope.init();

};
