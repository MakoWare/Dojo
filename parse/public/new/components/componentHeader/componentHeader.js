'use strict';

//Component Header Controller
var ComponentHeaderCtrl = function($scope, $location, ParseService, GlobalService){

    $scope.init = function(){
        console.log("componentHeader");
    };

    $scope.init();

};

angular.module('componentheader',[])
    .directive('componentheader',['$location', 'ParseService', 'GlobalService', function($location, ParseService, GlobalService){
	return {
	    restrict:'A',
	    isolate:true,
	    link: function($scope,$elm,$attrs){
		new ComponentHeaderCtrl($scope, $location, ParseService, GlobalService);
	    },
	    scope:true,
            templateUrl: "components/componentHeader/componentHeader.html"
	};
    }]);
