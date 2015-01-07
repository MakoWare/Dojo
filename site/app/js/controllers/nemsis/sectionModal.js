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
            console.log(results);
            $scope.nemsisSection = results;
            $scope.$apply();
        });
    };

    //Update Section
    $scope.updateSection = function(){

    };


    $scope.ok = function(){
        $modalInstance.close("taco!");
    };

    $scope.cancel = function(){
        $modalInstance.dismiss('cancel');
    };


    $scope.init();
};
