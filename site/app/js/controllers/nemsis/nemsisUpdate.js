//Nemsis Update Controller
var NemsisUpdateCtrl = function($scope, $location, ParseService, GlobalService){

    $scope.init = function(){
        $scope.section = {};
        $scope.dir = $location.url().slice(1).split("/")[0];
        $scope.sectionId = $location.url().slice(1).split("/")[0]; //Fix

        $scope.getSection($scope.sectionId);
    },

    //1. Get Section
    $scope.getSection = function(sectionId){
        ParseService.getSection(sectionId, function(results){
            console.log(results);
            $scope.section = results;
        });
    };

    $scope.updateSection = function(section){
        ParseService.saveSection(section, function(results){
            console.log(results);
        });
    };

    $scope.deleteSection = function(section){
        ParseService.deleteSection(section, function(results){
            console.log(results);
        });
    };

    //Init
    $scope.init();
};
