//Nemsis Read Controller
var NemsisReadCtrl = function($scope, $location, GlobalService, ParseService){

    $scope.init = function(){
        $scope.parentSections = {};
        $scope.childSections = [];
        $scope.sectionName = $location.url().split("nemsis/")[1];
        console.log($scope);
        $scope.getSection($scope.sectionName);
    };

    //1. Get Section
    $scope.getSection = function(sectionName){
        ParseService.getSectionByName(sectionName, function(results){
            $scope.$apply(function(){
                $scope.parentSection = results;
                $scope.childSections = results.get('sections');
            });
        });
    };

    //Can Add Section
    $scope.canAddSection = function(){
        var cordinality = $scope.parentSection.get('nemsisSection').get('sections')[0].get('maxOccurence');
        if(cordinality === "M"){
            return true;
        } else if(cordinality === 1 && $scope.childSections.length === 0){
            return true;
        } else {
            return false;
        }
    };


    //Init
    $scope.init();
};
