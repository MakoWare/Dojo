//Nemsis Update Controller
var NemsisUpdateCtrl = function($scope, $location, ParseService, GlobalService){

    $scope.init = function(){
        $scope.section = {};
        $scope.dir = $location.url().slice(1).split("/")[0];
        $scope.sectionId = $location.url().split("/")[$location.url().split("/").length - 1];
        $scope.getSection($scope.sectionId);
    },

    //1. Get Section
    $scope.getSection = function(sectionId){
        ParseService.getSection(sectionId, function(results){
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


    //4. Create Subsection Objects
    $scope.generateSubSections = function(){
        //Inverse the Section - NemsisSection relationship
        var subSections = $scope.section.get('sections');
        $scope.subNemsisSections.forEach(function(subNemsisSection){
            subNemsisSection.sections = [];
            subSections.forEach(function(subSection){
                if(subSection.get('name') === subNemsisSection.get('name')){
                    subNemsisSection.sections.push(subSection);
                }
            });
        });
    };

    //Can Add Section
    $scope.canAddSection = function(nemsisSection){
        if(typeof nemsisSection.get !== "function"){
            return false;
        } else {
            if(nemsisSection.get('max') === "M"){
                return true;
            } else {
                return false;
            }
        }
    };

    //Can Delete Section
    $scope.canDeleteSection = function(nemsisSection){
        if(typeof nemsisSection.get !== "function"){
            return false;
        } else {
            if(nemsisSection.get('max') === "0"){
                return true;
            } else {
                return false;
            }
        }
    };

    //Get Element Template ***TODO***
    $scope.getElementTemplate = function(element){
        return "partials/nemsis/elementPartials/textInput.html";
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
