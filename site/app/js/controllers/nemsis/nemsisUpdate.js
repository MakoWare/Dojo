//Nemsis Update Controller
var NemsisUpdateCtrl = function($scope, $location, ParseService, GlobalService){

    $scope.init = function(){
        console.log($scope);
        $scope.section = {};
        $scope.dir = $location.url().slice(1).split("/")[0];
        $scope.sectionId = $location.url().split("/")[$location.url().split("/").length - 1];

        $scope.getSection($scope.sectionId);
    },

    //1. Get Section
    $scope.getSection = function(sectionId){
        ParseService.getSection(sectionId, function(results){
            $scope.$apply(function(){
                console.log(results);
                $scope.section = results;
            });
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
