'use strict';
namespace('components.events').SIDEBAR_TOGGLE = "ActivityModel.SIDEBAR_TOGGLE";

//Nav Directive
var NavDirective = BaseDirective.extend({
    notifications: null,


    init: function($scope, $location, UserModel, Notifications){
        console.log("navigation");
        this.$scope = $scope;
        this.$location = $location;
        this.userModel = UserModel;
        this.notifications = Notifications;
        this._super($scope);

        this.userModel.getCurrentUser();
        setTimeout(function(){
            $("#toggleNav").trigger("click");
        }, 200);
    },

    defineListeners: function(){
        var self = this;
        $("#toggleNav").click(function(){self.toggleSideBar();});
        $("#logOutButton").click(function(){self.logout();});
        this.notifications.addEventListener(models.events.CURRENT_USER_LOADED, this.onCurrentUserLoaded.bind(this));



    },

    onCurrentUserLoaded: function(){
        if(!this.userModel.currentUser){
            this.$location.url("/");
        }
        this.$scope.username = this.userModel.currentUser.attributes.username;
    },

    logout: function(){
        this.userModel.logout();
        this.$location.url("/");
        this.$scope.$apply();
    },

    toggleSideBar: function(){
        $("body").toggleClass("sidebar-collapse");
        $.AdminLTE.layout.fixSidebar();
        $("#componentContainer").trigger('resize');

        this.notifications.notify(components.events.SIDEBAR_TOGGLE);
    }
});

angular.module('navbar',[])
    .directive('navbar',['$location', 'UserModel', 'Notifications', function($location, UserModel, Notifications){
	return {
	    restrict:'E',
	    isolate:true,
	    link: function($scope,$elm,$attrs){
		new NavDirective($scope, $location,  UserModel, Notifications);
	    },
	    scope:true,
            templateUrl: "components/navigation/navigation.html"
	};
    }]);
