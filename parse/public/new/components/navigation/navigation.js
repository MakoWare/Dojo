'use strict';
namespace('components.events').SIDEBAR_TOGGLE = "ActivityModel.SIDEBAR_TOGGLE";

//Nav Directive
var NavDirective = BaseDirective.extend({
    notifications: null,

    init: function($scope, ParseService, notifications){
        console.log("navigation");
        this.notifications = notifications;
        this.$scope = $scope;
        this._super($scope);

    },

    defineListeners: function(){
        var self = this;
        $("#toggleNav").click(function(){self.toggleSideBar();});
    },

    logout: function(){
        ParseService.logout();
        $location.url("/");
    },

    toggleSideBar: function(){
        $("body").toggleClass("sidebar-collapse");
        $.AdminLTE.layout.fixSidebar();
        $("#componentContainer").trigger('resize');
        this.notifications.notify(components.events.SIDEBAR_TOGGLE);
    }
});

angular.module('navbar',[])
    .directive('navbar',['ParseService', 'Notifications', function(ParseService, Notifications){
	return {
	    restrict:'E',
	    isolate:true,
	    link: function($scope,$elm,$attrs){
		new NavDirective($scope, ParseService, Notifications);
	    },
	    scope:true,
            templateUrl: "components/navigation/navigation.html"
	};
    }]);
