//Section Modal

var SectionModalCtrl = function($scope, $modalInstance, title, action, sectionName, ParseService, section, delim){

    $scope.init = function(){
        $scope.section = section;
        $scope.title = title;
        $scope.action = action;
        $scope.delim = delim;

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
            console.log("got nemsissection");
            ParseService.createEmptySection(sectionName, function(results){
                console.log("got section");
                console.log(results);
                $scope.section = results;
                $scope.$apply();
            });
        });
    };

    //Update Section
    $scope.updateSection = function(){
        console.log("sectionModal: update section");
        ParseService.constructNemsisSection(sectionName, function(results){
            $scope.nemsisSection = results;
            $scope.$apply();
        });

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
