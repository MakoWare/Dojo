var SectionDirective = function($scope, $elm, $attrs){

    var init = function(){
        $scope.templatePath = "partials/sectionTemplate.html";
        $scope.sectionName = $attrs.sectionname;
        $scope.header = $attrs.header;
        $scope.delim = $attrs.delim;
        $scope.sections = [];
        $scope.$modal = $scope.$parent.$modal;
        $scope.ParseService = $scope.$parent.ParseService;


        $scope.ParseService.constructNemsisSection($scope.sectionName, function(results){
            $scope.nemsisSection = results;
            $scope.convertSectionsForTable();
            $scope.$apply();
        });

        //For Users
        $scope.$on('gotUser', function(event, args) {
            $scope.parentSection = $scope.$parent.user.attributes.dPersonnel;
            $scope.parentSection.attributes.sections.forEach(function(section){
                if(section.attributes.name == $scope.sectionName){
                    $scope.sections.push(section);
                }
            });
        });

        //For Contacts
        $scope.$on('gotContact', function(event, args) {
            $scope.parentSection = $scope.$parent.contact.attributes.dContact;
            $scope.parentSection.attributes.sections.forEach(function(section){
                if(section.attributes.name == $scope.sectionName){
                    $scope.sections.push(section);
                }
            });
        });

        //For Vehicles
        $scope.$on('gotVehicle', function(event, args) {
            $scope.parentSection = $scope.$parent.vehicle.attributes.dVehicle;
            $scope.parentSection.attributes.sections.forEach(function(section){
                if(section.attributes.name == $scope.sectionName){
                    $scope.sections.push(section);
                }
            });
        });



    };

    $scope.addSection = function(){
        var modalInstance = $scope.$modal.open({
            templateUrl: 'partials/sectionModal.html',
            controller: 'SectionModalCtrl',
            size: 'lg',
            resolve: {
                title: function(){ return $scope.header;},
                action: function(){ return "Create";},
                sectionName: function(){ return $scope.sectionName;},
                ParseService: function(){ return $scope.ParseService;},
                section: function(){return ;},
                delim: function(){return $scope.delim;}
            }
        });

        modalInstance.result.then(function(results) {
            if(results){
                $scope.sections.push(results);
                $scope.parentSection.attributes.sections.push(results);
                $scope.convertSectionsForTable();
            }
        }, function () {
            console.log("modal dismissed");
        });
    };

    $scope.updateSection = function(section){
        var modalInstance = $scope.$modal.open({
            templateUrl: 'partials/sectionModal.html',
            controller: 'SectionModalCtrl',
            size: 'lg',
            resolve: {
                title: function(){ return $scope.header;},
                action: function(){ return "Update";},
                sectionName: function(){ return $scope.sectionName;},
                ParseService: function(){ return $scope.ParseService;},
                section: function(){return section;},
                delim: function(){return $scope.delim;}
            }
        });

        modalInstance.result.then(function(results) {
            if(results){
                console.log(results);
                console.log($scope.sections);
                $scope.convertSectionsForTable();
            }
        }, function () {
            console.log("modal dismissed");
        });
    };

    //Delete Section
    $scope.deleteSection = function(section){
        console.log($scope.sections);
        console.log(section);
        console.log("deleteSection");


        if(section.id){
            console.log("has id");
            $scope.parentSection.remove("sections", section);
            $scope.parentSection.save({
                success: function(object){
                    console.log(object);
                    section.destroy({
                        success: function(result){
                            var index = $scope.sections.indexOf(section);
                            console.log(index);
                            $scope.sections.splice(index, 1);
                            console.log($scope.sections);
                            $scope.$apply();
                        },
                        error: function(object,  error){
                            console.log(error);
                        }
                    });
                },
                error: function(object, error){
                    console.log(error);
                }
            });
        } else {
            $scope.parentSection.remove("sections", section);
            var index = $scope.sections.indexOf(section);
            $scope.sections.splice(index, 1);
            //$scope.$apply();
        }
    };

    $scope.convertSectionsForTable = function(){
        $scope.sections.forEach(function(section){
            section.values = [];
            $scope.nemsisSection.attributes.headers.forEach(function(header){
                var valueArray = [];
                section.attributes.elements.forEach(function(element){
                    if(element.attributes.title == header.attributes.ElementNumber){
                        if(element.attributes.codeString != ""){
                            valueArray.push(element.attributes.codeString);
                        } else {
                            valueArray.push(element.attributes.value);
                        }
                    }
                });
                section.values.push(valueArray);
            });
            console.log(section);
        });

    };


    init();
};


angular.module('dojo.section',[])
    .directive('section',  function(){
        var templatePath = "partials/section.html";
        return {
	    isolate:true,
	    link: function($scope,$elm,$attrs, $modal){
		new SectionDirective($scope, $elm, $attrs);
	    },
	    scope:true,
            templateUrl: templatePath
	};
    });
