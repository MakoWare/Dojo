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
                $scope.setSingleSelect();
            } else {
                $scope.elementPartialPath = "partials/nemsisElementPartials/multiSelect.html";
            }
        } else {
            $scope.elementPartialPath = "partials/nemsisElementPartials/textInput.html";
        }

    };

    $scope.setSingleSelect = function(){
        console.log("setting select");
        $scope.nemsisHeader.attributes.elements = [];
        $scope.section.attributes.elements.forEach(function(element){
            if(element.attributes.title == $scope.nemsisHeader.attributes.ElementNumber){
                $scope.nemsisHeader.attributes.elements.push(element);
            }
        });

        if($scope.nemsisHeader.attributes.elements.length > 0){
            console.log("in");
            $scope.nemsisHeader.attributes.codes.forEach(function(code){
                if($scope.nemsisHeader.attributes.elements[0].attributes.value == code.attributes.code){
                    $scope.nemsisHeader.attributes.code = code;
                }
            });
        }
    };

    $scope.singleSelectChanged = function(element, nemsisHeader){
        element.set("value", nemsisHeader.attributes.code.attributes.code);
        element.set("codeString", nemsisHeader.attributes.code.attributes.codeDescription);
        console.log(element);

    };

    $scope.fillMissingElements = function(){
        var hasElement = false;
        if(!$scope.nemsisHeader.attributes.elements){
            $scope.nemsisHeader.attributes.elements = [];
        }
        $scope.section.attributes.elements.forEach(function(element){
            if(element.attributes.title == $scope.nemsisHeader.attributes.ElementNumber){
                $scope.nemsisHeader.attributes.elements.push(element);
                hasElement = true;
            }
        });
        if(!hasElement){
            $scope.addElement();
        }
    };

    //Can Add Element
    $scope.canAddElement = function(){
        if($scope.nemsisHeader.attributes.MaxOccurs == "1"){
            return false;
        } else {
            return true;
        }
    };

    //Can Add Element
    $scope.canDeleteElement = function(){
        if($scope.nemsisHeader.attributes.elements.length < 1){
            return true;
        } else {
            return false;
        }
    };

    //Is element Required
    $scope.isElementRequired = function(){
        var usage = $scope.nemsisHeader.attributes.Usage;
        if(usage == "Mandatory" ){
            return true;
        } else {
            return false;
        }
    };

    //Add Element
    $scope.addElement = function(){
        var element = new Parse.Object("NemsisElement");
        var user = Parse.User.current();
        var agencyId = user.get('agencyId');
        element.set("agencyId", agencyId);
        element.set("createdBy", user);
        element.set("title", $scope.nemsisHeader.attributes.ElementNumber);
        element.set("pcrId", "");
        element.set("value", "");
        element.set("codeString", "");

        var acl = new Parse.ACL();
        acl.setRoleReadAccess("EMT_" + agencyId, true);
        acl.setRoleWriteAccess("EMT_" + agencyId, true);
        element.setACL(acl);

        $scope.section.add('elements', element);
        $scope.nemsisHeader.attributes.elements.push(element);
    };


    //Delete Element
    $scope.deleteElement = function(element){
        $scope.section.remove('elements', element);
        $scope.nemsisHeader.attributes.elements.pop(element); //Not sure how to pop spec ele
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
