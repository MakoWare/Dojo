//Nemsis Create and Update Controller
var NemsisCreateCtrl = function($scope, $location, ParseService, GlobalService){

    $scope.init = function(){
        $scope.section = {};
        $scope.tmpElements = [];
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
                $scope.canDelete = $scope.canDeleteSection($scope.section);
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
                $scope.canDelete = $scope.canDeleteSection($scope.section);
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
            elementNumbers.push(header.get('ElementNumber'));
        });
        ParseService.getNemsisElementCodes(elementNumbers, function(results){
            $scope.$apply(function(){
                $scope.nemsisElementCodes = results;
                $scope.generateElements();
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

    $scope.generateElements = function(){
        //Init the tmpElements with headers, codes, and title
        $scope.nemsisSection.get('headers').forEach(function(header){
            //Create a new Set of Elements
            var set = {};
            set.header = header;
            set.elements = [];
            set.codes = [];
            set.name = header.get('ElementNumber');
            $scope.tmpElements.push(set);

            //Get all codes for the perspective Element
            $scope.nemsisElementCodes.forEach(function(code){
                if(code.get('elementNumber') == set.name){
                    set.codes.push(code);
                }
            });

            //Determine the Partial type
            if(set.codes.length < 1){
                set.partialLocation = "partials/nemsis/elementPartials/textInput.html";
            } else {
                if(set.header.get("MaxOccurs") === "M"){
                    set.partialLocation = "partials/nemsis/elementPartials/multiSelect.html";
                } else {
                    set.partialLocation = "partials/nemsis/elementPartials/singleSelect.html";
                }
            }
        });

        //Get all of the current NemsisElements for the tmpElement
        $scope.tmpElements.forEach(function(tmpElement){
            $scope.section.get('elements').forEach(function(element){
                if(element.get('title') == tmpElement.name){
                    tmpElement.elements.push(element);
                }
            });
        });
        console.log($scope.tmpElements);
    },

    //Get Element Template ***TODO*** Fix
    $scope.getElementTemplate = function(element){
        console.log("getting template for:");
        console.log(element);
        $scope.nemsisElementCodes.forEach(function(code){
            if(code.get('elementNumber') == element.name){
                if(element.header.get('maxOccurences') == "M"){
                    console.log("MultiSelect");
                    return "partials/nemsis/elementPartials/multiSelect.html";
                } else {
                    console.log("SingleSelect");
                    return "partials/nemsis/elementPartials/singleSelect.html";
                }
            } else {
                    console.log("TextInput");
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

    //Can Delete Section  ***TODO*** add case with other sections
    $scope.canDeleteSection = function(section){
//        console.log(section.get('nemsisSection'));
        if(section.get('nemsisSection').get('min') === "0"){
            return true;
        } else {
            return false;
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

    //Add Section             ***TODO***  Add Dirty Check
    $scope.addSection = function(childSection){
        //First check if current Section is dirty
        //alert("Current Section isn't Saved, please save before adding another section");

        ParseService.createSection(childSection.get('name'), function(results){
            var childName = results.get('name');
            var childId = results.id;
            var newPath = "/configurations/nemsis/" + childName + "/" + childId;

            //Add childSection to current Section
            $scope.section.add("sections", results);
            $scope.section.save({
                success: function(result){
                    //now Change location to the child's update url
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

    //Save Section         ***TODO*** Test -may need to save elements first
    $scope.saveSection = function(){
        //Replace section.elements with tmpElements.elements
        $scope.section.set('elements', $scope.tmpElement.elements);
        $scope.section.save({
            success: function(result){
                alert("Section saved successfully");
            },
            error: function(object, error){
                alert("Error, please contact us with this error: " + error.message);
            }
        });
    },

    //Delete Section
    $scope.deleteSection = function(section){
        section.destroy({
            success: function(result){
                alert("Section successfully deleted");
            },
            error: function(object, error){
                alert("Error deleting section: " + error.message);
            }
        });
    },

    //Init Controller
    $scope.init();
};
