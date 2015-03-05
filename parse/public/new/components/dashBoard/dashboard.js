'use strict';

namespace('components.events').COMPONENT_ADDED = "ActivityModel.COMPONENT_ADDED";
namespace('components.events').COMPONENT_REMOVED = "ActivityModel.COMPONENT_REMOVED";
namespace('components.events').DASHBOARD_RESIZED = "ActivityModel.DASHBOARD_RESIZED";

//DashBoard Controller
var DashBoardDirective = BaseDirective.extend({
    notifications: null,
    components: [],

    init: function($scope, $elm, $attrs, $compile, notifications){
        console.log("dashboard");
        this.notifications = notifications;
        this.$compile = $compile;
        this.$scope = $scope;
	this._super($scope);

        this.resize();
    },

    //Called on super();
    defineListeners: function(){
        this.notifications.addEventListener(components.events.ADD_COMPONENT, this.addComponent.bind(this));
        this.notifications.addEventListener(components.events.REMOVE_COMPONENT, this.removeComponent.bind(this));

        var self = this;
        $("#componentContainer").on("resize", function(){
            self.resize();
        });
    },

    resize: function(){
        var style = window.getComputedStyle(document.getElementById("componentContainer"), null);
        $("#dashboard").height($("#componentContainer").height() -20);
        $("#dashboard").width(style.getPropertyValue("width") -20);
        this.notifications.notify(components.events.DASHBOARD_RESIZED);
    },

    //Adds a Component to the DashBoard
    addComponent: function(event, args){
        if($.inArray(args, this.components) == -1){
            var el = "<component-box id='" + args + "' name='" + args + "'></component-box>";
            var componentBox = this.$compile(el)(this.$scope);
            $("#dashboard").append(componentBox);
            this.components.push(args);
        } else {
            console.log("already in the dashboard, fuck off");
        }
    },


    //Removes Component From the DashBoard
    removeComponent: function(event, name){
        var children = $("#dashboard").children();
        for(var i = 0; i < children.length; i++){
            var child = children[i];
            if($(child).attr('id') == name){
                $(child).remove();
            }
        }

        for(var j = 0; j < this.components.length; j++){
            var currentComponent = this.components[j].split("/")[this.components[j].split("/").length -1];
            if(currentComponent == name){
                this.components.splice(j, 1);
            }
        }
    }
});


angular.module('dashboard',[])
    .directive('dashboard',['$compile', 'Notifications',function($compile, Notifications){
        return {
	    restrict:'E',
	    isolate:true,
	    link: function($scope,$elm,$attrs){
		new DashBoardDirective($scope,$elm, $attrs, $compile, Notifications);
	    },
	    scope:true,
            templateUrl: 'components/dashboard/dashboard.html'
	};
    }]);
