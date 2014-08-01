//Nemsis Read Controller
var NemsisReadCtrl = function($scope, $location, GlobalService, ParseService){

    $scope.init = function(){
        $scope.sections = {};
        $scope.sectionName = $location.url().split("nemsis/")[1];
        console.log($scope);
        $scope.getSection($scope.sectionName);
    };

    //1. Get Section
    $scope.getSection = function(sectionName){
        ParseService.getSectionByName(sectionName, function(results){
            $scope.$apply(function(){
                $scope.sections = results.get('sections');
            });
        });
    };


    //Init
    $scope.init();
};
