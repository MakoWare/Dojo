'use strict';

//SideBar Controller
var SideBarCtrl = function($scope, $location, ParseService, GlobalService){
    $scope.init = function(){
        console.log("sidebar");
    };

    $scope.init();
 };

angular.module('sidebar',[])
    .directive('sidebar',['$location', 'ParseService', 'GlobalService', function($location, ParseService, GlobalService){
	return {
	    restrict:'A',
	    isolate:true,
	    link: function($scope,$elm,$attrs){
		new SideBarCtrl($scope, $location, ParseService, GlobalService);
	    },
	    scope:true,
            templateUrl: "components/sideBar/sideBar.html"
	};
    }]);
