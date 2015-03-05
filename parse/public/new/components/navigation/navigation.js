'use strict';
namespace('components.events').SIDEBAR_TOGGLE = "ActivityModel.SIDEBAR_TOGGLE";

//Nav Directive
var NavDirective = BaseDirective.extend({
    notifications: null,


    init: function($scope, $location, UserModel, AgencyModel, Notifications){
        console.log("navigation");
        this.$scope = $scope;
        this.$location = $location;
        this.userModel = UserModel;
        this.agencyModel = AgencyModel;
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
        this.notifications.addEventListener(models.events.CURRENT_AGENCY_LOADED, this.onCurrentAgencyLoaded.bind(this));

    },


    onCurrentUserLoaded: function(){
        if(!this.userModel.currentUser){
            this.$location.url("/");
        }
        this.$scope.username = this.userModel.currentUser.attributes.username;
        this.agencyModel.getCurrentAgency(this.userModel.currentUser.attributes.agencyId);
    },

    onCurrentAgencyLoaded: function(){
        this.$scope.agencyName = this.agencyModel.currentAgency.attributes.name;
        this.$scope.$apply();
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
    .directive('navbar',['$location', 'UserModel', 'AgencyModel', 'Notifications', function($location, UserModel, AgencyModel, Notifications){
	return {
	    restrict:'E',
	    isolate:true,
	    link: function($scope,$elm,$attrs){
		new NavDirective($scope, $location,  UserModel, AgencyModel, Notifications);
	    },
	    scope:true,
            templateUrl: "components/navigation/navigation.html"
	};
    }]);
