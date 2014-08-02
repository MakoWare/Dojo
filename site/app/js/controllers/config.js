//Configuration Controller
var ConfigCtrl = function($scope, $location, ParseService, GlobalService){

    $scope.init = function(){
        $scope.dAgencyId = "";
        $scope.dStateId = "";
        $scope.getSectionByName("dAgency");
        $scope.getSectionByName("dState");
    },

    //Get Odd Ball Sections, Thanks Nemsis for making sense!!!
    $scope.getSectionByName = function(sectionName){
        ParseService.getSectionByName(sectionName, function(results){
            $scope.$apply(function(){
                if(sectionName === "dAgency"){
                    $scope.dAgencyId = results.id;
                } else {
                    $scope.dStateId = results.id;
                }
            });
        });
    };

    //Get URL to Section
    $scope.getLocation = function(sectionName){
        if(sectionName === "dAgency"){
            return "#/configurations/nemsis/dAgency/" + $scope.dAgencyId;
        } else {
            return "#/configurations/nemsis/dState/" + $scope.dStateId;
        }
    };


    //Init Controller
    $scope.init();
};
