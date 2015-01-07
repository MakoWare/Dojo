var SectionDirective = function($scope, $elm, $attrs){

    var init = function(){
        $scope.templatePath = $attrs.templatepath;
        $scope.sectionName = $attrs.sectionname;
        $scope.header = $attrs.header;
        $scope.sections = [];
        $scope.$modal = $scope.$parent.$modal;
        $scope.ParseService = $scope.$parent.ParseService;

        $scope.$on('gotUser', function(event, args) {
            $scope.parentSection = $scope.$parent.user.attributes.dPersonnel;

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
                ParseService: function(){ return $scope.ParseService;}
            }
        });

        modalInstance.result.then(function(results) {
            console.log(results);
        }, function () {
            console.log("modal dismissed");
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
