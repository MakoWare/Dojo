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
        $scope.subNemsisSections.forEach(function(subNemsisSection){
            subNemsisSection.sections = [];
            subSections.forEach(function(subSection){
                if(subSection.get('name') === subNemsisSection.get('name')){
                    console.log("adding subSection to SubNemsisSection");
                    subNemsisSection.sections.push(subSection);
                }
                console.log("subNemsisSection.sections");
                console.log(subNemsisSection.sections);
            });
        });
        console.log($scope.subNemsisSections);
    };

    //Get Element Template ***TODO*** Fix
    $scope.getElementTemplate = function(element){
        $scope.nemsisElementCodes.forEach(function(code){
            if(code.get('elementNumber') == element.get('number')){
                if(element.get('header').get('maxOccurences') == "M"){
                    return "partials/nemsis/elementPartials/multiSelect.html";
                } else {
                    return "partials/nemsis/elementPartials/singleSelect.html";
                }
            } else {
                return "partials/nemsis/elementPartials/textInput.html";
            }
        });
    };


    //Can Add Section
    $scope.canAddSection = function(nemsisSection){
        if(nemsisSection.get('maxOccurence') === "M"){
            return true;
        } else {
            return false;
        }
    };

    //***TODO*** Fix
    $scope.addSection = function(parentSection, childSection){
        //First check if current Section is dirty
        alert("Current Section isn't Saved, please save before adding another section");

        ParseService.createSection(childSection.get('name'), function(results){
            $scope.$apply(function(){
                $scope.section = results;
                $scope.nemsisSection = results.get('nemsisSection');
                $scope.subNemsisSections = $scope.nemsisSection.get('sections');
                $scope.getNemsisElementCodes();
                if($scope.subNemsisSections){
                    $scope.generateSubSections();
                }

                //Add section to previous
                parentSection.add("sections", $scope.section);
            });
        });
    },

    //Save Section
    $scope.saveSection = function(){
        ParseService.saveSection($scope.section);
    };


    //Init Controller
    $scope.init();
};
