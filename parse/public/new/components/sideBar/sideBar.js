'use strict';

//SideBar Controller
var SideBarCtrl = function($rootScope, $scope,$compile, $location, ParseService, GlobalService){

    $scope.init = function(){
        console.log("sidebar");
    };

    $scope.addComponent = function(component){
        $rootScope.$broadcast("addComponent", {componentName: component});
    };

    $scope.init();
 };

angular.module('sidebar',[])
    .directive('sidebar',['$rootScope', '$compile', '$location', 'ParseService', 'GlobalService', function($rootScope, $compile, $location, ParseService, GlobalService){
	return {
	    restrict:'A',
	    isolate:true,
	    link: function($scope,$elm,$attrs){
		new SideBarCtrl($rootScope, $scope, $compile, $location, ParseService, GlobalService);
	    },
	    scope:true,
            templateUrl: "components/sideBar/sideBar.html"
	};
    }]);
