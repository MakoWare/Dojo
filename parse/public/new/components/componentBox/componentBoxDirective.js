//Component Box
namespace('components.events').COMPONENT_RESIZED = "ActivityModel.COMPONENT_RESIZED";

var ComponentBoxDirective = BaseDirective.extend({
    notifications: null,

    init: function($scope, $timeout, notifications){
        console.log("ComponentBoxDirective");
        this.notifications = notifications;
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.name = $scope.name;
        this.setUpComponent();
        this.state = "down";
        this._super($scope);
    },

    setUpComponent: function(){
        switch(this.name){
        case "contactList":
            this.$scope.componentHeaderUrl = "/components/contacts/contactListHeader.html";
            this.$scope.componentBodyUrl = "/components/contacts/contactListBody.html";
            break;
        case "dispatchList":
            this.$scope.componentHeaderUrl = "/components/dispatches/dispatchListHeader.html";
            this.$scope.componentBodyUrl = "/components/dispatches/dispatchListBody.html";
            break;
        case "facilityList":
            this.$scope.componentHeaderUrl = "/components/facilities/facilityListHeader.html";
            this.$scope.componentBodyUrl = "/components/facilities/facilityListBody.html";
            break;
        case "locationList":
            this.$scope.componentHeaderUrl = "/components/locations/locationListHeader.html";
            this.$scope.componentBodyUrl = "/components/locations/locationListBody.html";
            break;
        case "map":
            this.$scope.componentHeaderUrl = "/components/map/mapHeader.html";
            this.$scope.componentBodyUrl = "/components/map/mapBody.html";
            break;
        case "patientList":
            this.$scope.componentHeaderUrl = "/components/patients/patientListHeader.html";
            this.$scope.componentBodyUrl = "/components/patients/patientListBody.html";
            break;
        case "vehicleList":
            this.$scope.componentHeaderUrl = "/components/vehicles/vehicleListHeader.html";
            this.$scope.componentBodyUrl = "/components/vehicles/vehicleListBody.html";
            break;
        }
    },

    defineListeners: function(){
        var self = this;
        this.$scope.removeComponent = function(){ self.removeComponent();};
        this.$scope.minComponent = function(){ self.minComponent();};
        this.$scope.maxComponent = function(){ self.maxComponent();};

        this.notifications.addEventListener(components.events.SIDEBAR_TOGGLE, this.onSideBarToggle.bind(this));

        this.$timeout(function(){
            $("#" + self.name + "box").resizable({
                grid: 50,
                ghost: true,
                stop: function(event, ui){
                    self.notifications.notify(components.events.COMPONENT_RESIZED, self.name);
                }
            });

            $("#" + self.name + "box").draggable({
                snap: true,
                containment: "#dashboard"
            });
        });

        $("#" + self.name).resize(function(){
            self.notifications.notify(components.events.COMPONENT_RESIZED, self.name);
        });

    },

    //On SideBar Toggle
    onSideBarToggle: function(){
        this.notifications.notify(components.events.COMPONENT_RESIZED, this.name);
    },

    //Notify to Remove
    removeComponent: function(){
        this.notifications.notify(components.events.REMOVE_COMPONENT, this.name);
    },

    //Minimize the Component
    minComponent: function(){
        if(this.state == "down"){
            this.minComponent.previousHeight = $("#" + this.name + "box").height();
            $('#' + this.name + 'body').toggle();
            $("#" + this.name + "box").height(50);
            $("#" + this.name + "box").resizable('destroy');
            this.state = 'up';
        } else {
            $('#' + this.name + 'body').toggle();
            $("#" + this.name + "box").height(this.minComponent.previousHeight);
            $("#" + this.name + "box").resizable();
            this.state = 'down';
        }
    },

    //Maximize the Component
    maxComponent: function(){
        console.log("max");
        $("#" + this.name + "box").height($('#dashboard').height());
        $("#" + this.name + "box").width($('#dashboard').width());
        this.notifications.notify(components.events.COMPONENT_RESIZED, this.name);
    }



});

angular.module('componentBox',[])
    .directive('componentBox',['$timeout', 'Notifications', function($timeout, Notifications){
        return {
	    restrict:'E',
	    isolate:true,
	    link: function($scope,$elm,$attrs){
		new ComponentBoxDirective($scope, $timeout, Notifications);
	    },
	    scope: { name: '@name' },
            templateUrl: 'components/componentBox/componentBox.html'
	};
    }]);
