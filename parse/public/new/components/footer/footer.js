'use strict';

//Footer Controller
var FooterCtrl = function($scope){

};

angular.module('footer',[])
    .directive('footer',function(){
	return {
	    restrict:'A',
	    isolate:true,
	    link: function($scope,$elm,$attrs){
		new FooterCtrl($scope);
	    },
	    scope:true,
            templateUrl: "components/footer/footer.html"
	};
    });
