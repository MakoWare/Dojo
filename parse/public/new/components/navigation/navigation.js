'use strict';
namespace('components.events').SIDEBAR_TOGGLE = "ActivityModel.SIDEBAR_TOGGLE";

//Nav Directive
var NavDirective = BaseDirective.extend({
    notifications: null,


    init: function($scope, UserModel, ParseService, notifications){
        console.log("navigation");
        this.notifications = notifications;
        this.$scope = $scope;
        this.userModel = UserModel;
        this._super($scope);

        this.userModel.getCurrentUser();

    },

    defineListeners: function(){
        var self = this;
        $("#toggleNav").click(function(){self.toggleSideBar();});

        this.notifications.addEventListener(models.events.CURRENT_USER_LOADED, this.onCurrentUserLoaded.bind(this));

    },

    onCurrentUserLoaded: function(){
        this.$scope.username = this.userModel.currentUser.attributes.username;

    },



    logout: function(){

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
    .directive('navbar',['UserModel', 'ParseService', 'Notifications', function(UserModel, ParseService, Notifications){
	return {
	    restrict:'E',
	    isolate:true,
	    link: function($scope,$elm,$attrs){
		new NavDirective($scope, UserModel, ParseService, Notifications);
	    },
	    scope:true,
            templateUrl: "components/navigation/navigation.html"
	};
    }]);
