//Nemsis Create and Update Controller
var NemsisCreateCtrl = function($scope, $location, ParseService, GlobalService){

    $scope.init = function(){
        $scope.section = {};
        $scope.dir = $location.url().slice(1).split("/")[0];
        $scope.nemsisSectionName = $location.url().split("nemsis/")[1].split("/")[0];

        $scope.sectionId = $location.url().split("/")[$location.url().split("/").length - 1];
        if($scope.sectionId == "add"){
            $scope.type = "Create";
            $scope.createSection($scope.nemsisSectionName);
        } else {
            $scope.type = "Update";
            $scope.getSection($scope.sectionId);
        }
    },

    //1a. Create Section
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
    },

    //1b. Get Section
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
    },

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
    },


    //3. Create Subsection Objects
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
    },

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
    },

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
    },

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
    },

    //Can Add Element         ***TODO***
    $scope.canAddElement = function(parentSection, element){

    },

    //Can Delete Section      ***TODO***
    $scope.canDeleteElement = function(parentSection, element){

    },

    //Add Element             ***TODO***
    $scope.addElement = function(parentSection, element){

    },

    //Add Section             ***TODO*** Fix
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
    },

    //Delete Section
    $scope.deleteSection = function(section){
        ParseService.deleteSection(section, function(results){
            console.log(results);
        });
    },


    //Init Controller
    $scope.init();
};
