//Nemsis Create and Update Controller
var NemsisCreateCtrl = function($scope, $location,  ParseService, GlobalService){

    $scope.init = function(){
        if(ParseService.getCurrentUser()){
            $scope.section = {};
            $scope.tmpElements = [];
            $scope.canDelete = false;
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
        } else {
            $location.url("/");
        }
    },

    //1a. Create a Section
    $scope.createSection = function(sectionName){
        GlobalService.showSpinner();
        ParseService.createSection(sectionName, function(results){
            GlobalService.dismissSpinner();
            $scope.$apply(function(){
                $scope.section = results;
                $scope.nemsisSection = results.get('nemsisSection');
                $scope.subNemsisSections = $scope.nemsisSection.get('sections');
                $scope.getNemsisElementCodes();
                $scope.canDeleteSection($scope.section);
                if($scope.subNemsisSections){
                    $scope.generateSubSections();
                }
            });
        });
    },

    //1b. Update a Section
    $scope.getSection = function(sectionId){
        GlobalService.showSpinner();
        ParseService.getSection(sectionId, function(results){
            GlobalService.dismissSpinner();
            if(results){
                $scope.$apply(function(){
                    $scope.section = results;
                    $scope.nemsisSection = results.get('nemsisSection');
                    $scope.subNemsisSections = $scope.nemsisSection.get('sections');
                    $scope.getNemsisElementCodes();
                    $scope.canDeleteSection($scope.section);
                    if($scope.subNemsisSections){
                        $scope.generateSubSections();
                    }
                });
            } else {
                alert("Could not Find this Section, please contact us");
                var newPathArray = $location.url().split("/");
                var newPath = "/" + newPathArray[1] + "/" + newPathArray[2] + "/" + newPathArray[3];
                $location.url(newPath);
                $scope.$apply();
            }
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
            if(subSections){
                subSections.forEach(function(subSection){
                    if(subSection.get('name') === subNemsisSection.get('name')){
                        subNemsisSection.sections.push(subSection);
                    }
                });
            }
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
                //Flatten codes, because people can't write angular directives correctly
                code.codeDescription = code.get('codeDescription');
                code.value = code.get('code');
                code.name = code.get('elementName');
                code.elementNumber = code.get('elementNumber');
                code.ticked = false;

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

                tmpElement.codes.forEach(function(code){
                    if(element.get('value') === code.value && element.get('title') === code.elementNumber){
                        code.ticked = true;
                    }
                });
            });
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
                //Check if there is already one
                $scope.section.get('sections').forEach(function(section){
                    if(section.get('name') === nemsisSection.get('name')){
                        return false;
                    }
                });
                return true;
            }
        }
    },

    //Can Delete Section  ***TODO*** add case with other sections
    $scope.canDeleteSection = function(section){
        if(section.get('nemsisSection').get('min') === "0"){
            $scope.canDelete = true;
        } else {
            //Check for sibling sections
            ParseService.hasSiblingSection(section, function(result){
                $scope.$apply(function(){
                    $scope.canDelete = result;
                });
            });
        }
    },

    $scope.elementChanged = function(element){
//        console.log(element);
    },


    $scope.addElement = function(tmpElement){
        GlobalService.showSpinner();
        ParseService.createNemsisElement(tmpElement.elements[0].attributes.title, function(result){
            GlobalService.dismissSpinner();
            tmpElement.elements.push(result);
            $scope.$apply();
        });
    },

    //Can Add Element         ***Fix***
    $scope.canAddElement = function(element){
        if(element.header.attributes.MaxOccurs == "M"){
            return true;
        } else {
            return false;
        }
    },

    //Can Delete Element      ***TODO***
    $scope.canDeleteElement = function(parentSection, element){

    },

    //Add Section
    $scope.addSection = function(childSection){
        GlobalService.showSpinner();
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
                    GlobalService.dismissSpinner();
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

    //Save Section
    $scope.saveSection = function(){
        GlobalService.showSpinner();
        //Replace section.elements with tmpElements.elements
        var elements = [];
        var promises = [];
        $scope.tmpElements.forEach(function(tmpElement){
            tmpElement.codes.forEach(function(code){
                if(code.ticked == true){
                    //Check if There is already an element holding this value
                    var needToCreate = true;
                    tmpElement.elements.forEach(function(element){
                        if(element.get('value') == code.value){
                            needToCreate = false;
                        }
                    });
                    //If No corresponding NemsisElement, Create it
                    if(needToCreate){
                        var createPromise = ParseService.createNemsisElement(code.elementNumber, function(results){
                            var element = results;
                            element.set('value', code.value);
                            tmpElement.elements.push(element);
                        });
                        promises.push(createPromise);
                    }
                } else {
                    //Check if There is a NemsisElement that should be deleted
                    for(var i = 0; i < tmpElement.elements.length; i++){
                        var element = tmpElement.elements[i];
                        if(element.get('value') == code.value && element.get('title') === code.elementNumber && element.get('header').get('MaxOccurs') === "M"){
                            var deletePromise = element.destroy({
                                success: function(result){

                                },
                                error: function(object, error){
                                    alert("An Error occurred, please contact us with this error: " + error.message);
                                }
                            });
                            promises.push(deletePromise);
                            tmpElement.elements.splice(i, 1);
                        }
                    };
                }
            });
        });

        //After we have Created/Deleted all of the elements
        Parse.Promise.when(promises).then(function(){
            $scope.tmpElements.forEach(function(tmpElement){
                tmpElement.elements.forEach(function(elem){
                    elements.push(elem);
                });
            });

            //Set value, to switch dirty flag
            elements.forEach(function(element){
                element.set('value', element.attributes.value);
            });
            console.log(elements);

            Parse.Object.saveAll(elements,{
                success: function(results){
                    $scope.section.set('elements', results);
                    $scope.section.save({
                        success: function(result){
                            GlobalService.dismissSpinner();
                            alert("Section saved successfully");
                        },
                        error: function(object, error){
                            alert("Error, please contact us with this error: " + error.message);
                        }
                    });
                },
                error: function(error){
                    console.log(error);
                    alert("Error saving section: " + error.message);
                }
            });
        });
    },


    $scope.deleteSection = function(section){
        GlobalService.showSpinner();
        ParseService.deleteSection(section, function(result){
            GlobalService.dismissSpinner();
            console.log(result);
            if(result.message){

            } else {
                var newPathArray = $location.url().split("/");
                var newPath = "/configurations";
                $location.url(newPath);
                $scope.$apply();
            }
        });
    },


    //Init Controller
    $scope.init();
};
