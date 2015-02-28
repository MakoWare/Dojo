//Component Box
var ComponentBoxDirective = function(){
    console.log("ComponentBoxDirective");

};

angular.module('componentBox',[])
    .directive('componentBox',[function(){
        return {
	    restrict:'E',
	    isolate:true,
	    link: function($scope,$elm,$attrs){
		new ComponentBoxDirective($scope,$elm, $attrs);
	    },
	    scope:true
	};
    }]);
