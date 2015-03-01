'use strict';

namespace('components.events').ADD_COMPONENT = "ActivityModel.ADD_COMPONENT";
namespace('components.events').REMOVE_COMPONENT = "ActivityModel.REMOVE_COMPONENT";

//SideBar Directive
var SideBarDirective = BaseDirective.extend({
    notifications: null,

    init: function($scope,  notifications){
        console.log("sidebar");
        this.notifications = notifications;
	this._super($scope);
    },

    defineListeners: function(){
        var sideBarItems = $(".sidebarItem");
        for(var i = 0; i < sideBarItems.length; i++){
            $(sideBarItems[i]).on("click", this.addComponent.bind(this));
        }
    },

    addComponent: function(event){
        var componentName = $(event.currentTarget).attr("value");
        this.notifications.notify(components.events.ADD_COMPONENT, componentName);
    }


 });


angular.module('sidebar',[])
    .directive('sidebar',['Notifications',function(Notifications){
        return {
	    restrict:'E',
	    isolate:true,
	    link: function($scope,$elm,$attrs){
		new SideBarDirective($scope, Notifications);
	    },
	    scope:true,
            templateUrl: 'components/sideBar/sideBar.html'
	};
    }]);
