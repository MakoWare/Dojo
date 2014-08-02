//Nemsis Create Controller
var NemsisCreateCtrl = function($scope, $location, ParseService, GlobalService){

    $scope.init = function(){
        $scope.section = {};
        $scope.dir = $location.url().slice(1).split("/")[0];
        $scope.nemsisSectionName = $location.url().split("nemsis/")[1].split("/")[0];
        $scope.createSection($scope.nemsisSectionName);
    },

    //1. Create Section
    $scope.createSection = function(sectionName){
        ParseService.createSection(sectionName, function(results){
            $scope.$apply(function(){
                $scope.section = results;
                $scope.nemsisSection = results.get('nemsisSection');
                $scope.subNemsisSections = $scope.nemsisSection.get('sections');
                $scope.getNemsisElementCodes();
                if($scope.subNemsisSections){
                    $scope.generateSubSections();
                }
            });
        });
    };

    //2. Get NemsisElementCodes for this Section
    $scope.getNemsisElementCodes = function(){
        var elementNumbers = [];
        $scope.nemsisSection.get('headers').forEach(function(header){
            elementNumbers.push(header.get('elementNumber'));
        });
        ParseService.getNemsisElementCodes(elementNumbers, function(results){
            $scope.$apply(function(){
                $scope.nemsisElementCodes = results;
            });
        });
    };

    //3. Get Partial
    $scope.getPartial = function(){
        return "partials/nemsis/" + $scope.nemsisSectionName + "/" + $scope.nemsisSectionName + ".html";
    };

    //4. Create Subsection Objects
    $scope.generateSubSections = function(){
        //Inverse the Section - NemsisSection relationship
        var subSections = $scope.section.get('sections');
        subSections.forEach(function(subSection){
            $scope.subNemsisSections.forEach(function(subNemsisSection){
                subNemsisSection.sections = [];
                if(subSection.get('name') === subNemsisSection.get('name')){
                    subNemsisSection.sections.push(subSection);
                }
            });
        });
    };

    //Get Element Template ***TODO***
    $scope.getElementTemplate = function(element){
        return "partials/nemsis/elementPartials/textInput.html";
    };

    //Can Add Section
    $scope.canAddSection = function(nemsisSection){
        if(nemsisSection.get('maxOccurence') === "M"){
            return true;
        } else {
            return false;
        }
    };

    //Add Section
    $scope.addSection = function(nemsisSection){

    };


    //Save Section
    $scope.saveSection = function(){
        ParseService.saveSection($scope.section);
    };


    //Init Controller
    $scope.init();
};