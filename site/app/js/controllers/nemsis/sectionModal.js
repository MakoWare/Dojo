//Section Modal

var SectionModalCtrl = function($scope, $modalInstance, title, action, sectionName, ParseService){

    $scope.init = function(){
        $scope.title = title;
        $scope.action = action;

        if(action == "Create"){
            $scope.createSection();
        } else {
            $scope.updateSection();
        }

    };

    //Create Section
    $scope.createSection = function(){
        ParseService.constructNemsisSection(sectionName, function(results){
            $scope.nemsisSection = results;
            ParseService.createEmptySection(sectionName, function(results){
                $scope.section = results;
                $scope.$apply();
            });
        });
    };

    //Update Section
    $scope.updateSection = function(){

    };


    //Done Button
    $scope.done = function(){
        $modalInstance.close($scope.section);
    };


    $scope.cancel = function(){
        $modalInstance.close();
    };


    $scope.init();
};
