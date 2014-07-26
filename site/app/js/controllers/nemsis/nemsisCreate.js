//Nemsis Create Controller
var NemsisCreateCtrl = function($scope, $location, ParseService, GlobalService){

    $scope.init = function(){
        $scope.section = {};
        $scope.dir = $location.url().slice(1).split("/")[0];
        $scope.nemsisSectionName = $location.url().split("nemsis/")[1].split("/")[0];

        $scope.createSection($scope.nemsisSectionName);
    },

    //Create Section
    $scope.createSection = function(sectionName){
        ParseService.createSection(sectionName, function(results){
            $scope.$apply(function(){
                console.log(results);
                $scope.section = results;
            });
        });
    },

    //Save Section
    $scope.saveSection = function(){
        ParseService.saveSection($scope.section);
    };

    //Get Partial
    $scope.getPartial = function(){
        return "partials/nemsis/" + $scope.nemsisSectionName + "/" + $scope.nemsisSectionName + ".html";
    };

    //Init Controller
    $scope.init();
};
