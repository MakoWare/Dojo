//Nemsis Read Controller
var NemsisReadCtrl = function($scope, $location, GlobalService, ParseService){

    $scope.init = function(){
        $scope.parentSection = {};
        $scope.childSections = [];
        $scope.sectionName = $location.url().split("nemsis/")[1];
        $scope.getSection($scope.sectionName);
    };

    //Get Section
    $scope.getSection = function(sectionName){
        ParseService.getSectionByName(sectionName, function(results){
            $scope.$apply(function(){
                $scope.parentSection = results;
                $scope.childNemsisSectionName = results.get('nemsisSection').get('sections')[0].get('name');
                $scope.childSections = results.get('sections');
                ParseService.setParentSection(results);
            });
        });
    };

    //Can Add Section
    $scope.canAddSection = function(){
        if(typeof $scope.childSections  === "undefined" || $scope.childSections.length == 0){
            return true;
        }
        var cordinality = $scope.parentSection.get('nemsisSection').get('sections')[0].get("max");
        if(cordinality === "M"){
            return true;
        } else if(cordinality === 1 && $scope.childSections.length === 0){
            return true;
        } else {
            return false;
        }
    };

    //Add Section
    $scope.addSection = function(childSectionName){
        ParseService.createSection(childSectionName, function(results){
            var childName = results.get('name');
            var childId = results.id;
            var newPath = "/configurations/nemsis/" + childName + "/" + childId;

            //Add childSection to current Section
            $scope.section.add("sections", results);
            $scope.section.save({
                success: function(result){
                    //Change location to the child's update url, and engage
                    $scope.$apply(function(){
                        $location.path(newPath);
                    });
                },
                error: function(object, error){
                    alert("Error, please contact us with this error: " + error.message);
                }
            });
        });
    },



    //Init
    $scope.init();
};
