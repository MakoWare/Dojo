//Nemsis Read Controller
var NemsisReadCtrl = function($scope, $location, GlobalService, ParseService){

    $scope.init = function(){
        $scope.parentSections = {};
        $scope.childSections = [];
        $scope.sectionName = $location.url().split("nemsis/")[1];
        $scope.getSection($scope.sectionName);
    };

    //1. Get Section  ***Bugs will go away when Sections are Init with ObjectHelper
    $scope.getSection = function(sectionName){
        ParseService.getSectionByName(sectionName, function(results){
            $scope.$apply(function(){
                $scope.parentSection = results;
                $scope.childNemsisSectionName = results.get('nemsisSection').get('sections')[0].get('name');
                $scope.childSections = results.get('sections');
            });
        });
    };

    //Can Add Section
    $scope.canAddSection = function(){
        if(typeof $scope.childSections  === "undefined" || $scope.childSections.length == 0){
            return true;
        }

        console.log($scope.childSections);
        var cordinality = $scope.childSections[0].get('nemsisSection').get('maxOccurence');

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
