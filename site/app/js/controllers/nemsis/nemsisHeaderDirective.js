var NemsisHeaderDirective = function($scope, $elm, $attrs){

    var init = function(){
        $scope.nemsisHeader = $scope.$parent.nemsisHeader;
        $scope.section = $scope.$parent.$parent.section;
        $scope.determineElementType();
        $scope.fillMissingElements();
    };

    $scope.determineElementType = function(){
        if($scope.nemsisHeader.attributes.codes.length > 0){
            if($scope.nemsisHeader.attributes.MaxOccurs == "1"){
                $scope.elementPartialPath = "partials/nemsisElementPartials/singleSelect.html";
            } else {
                $scope.elementPartialPath = "partials/nemsisElementPartials/multiSelect.html";
            }
        } else {
            $scope.elementPartialPath = "partials/nemsisElementPartials/textInput.html";
        }

    };


    $scope.fillMissingElements = function(){
        var hasElement = false;
        $scope.nemsisHeader.attributes.elements = [];
        $scope.section.attributes.elements.forEach(function(element){
            if(element.attributes.title == $scope.nemsisHeader.attributes.ElementNumber){
                $scope.nemsisHeader.attributes.elements.push(element);
                hasElement = true;
            }
        });
        if(!hasElement){
            var element = new Parse.Object("NemsisElement");
            var user = Parse.User.current();
            var agencyId = user.get('agencyId');
            element.set("agencyId", agencyId);
            element.set("createdBy", user);
            element.set("title", $scope.nemsisHeader.attributes.ElementNumber);
            element.set("pcrId", "");
            element.set("value", "");

            var acl = new Parse.ACL();
            acl.setRoleReadAccess("EMT_" + agencyId, true);
            acl.setRoleWriteAccess("EMT_" + agencyId, true);
            element.setACL(acl);

            $scope.section.add('elements', element);
            $scope.nemsisHeader.attributes.elements.push(element);
        }
    };


    init();
};


angular.module('dojo.header',[])
    .directive('header',  function(){
        var templatePath = "partials/header.html";
        return {
            restrict: 'E',
	    isolate:true,
	    link: function($scope,$elm,$attrs, $modal){
		new NemsisHeaderDirective($scope, $elm, $attrs);
	    },
            templateUrl: templatePath,
	    scope:true
	};
    });
