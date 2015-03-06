//Component Box
namespace('components.events').COMPONENT_RESIZED = "ActivityModel.COMPONENT_RESIZED";
namespace('components.events').SWAP_COMPONENT = "ActivityModel.SWAP_COMPONENT";

var ComponentBoxDirective = BaseDirective.extend({
    notifications: null,

    init: function($scope, $timeout, notifications){
        console.log("ComponentBoxDirective");
        this.notifications = notifications;
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.name = $scope.name;
        this.setUpComponent();
        this.min = false;
        this.max = false;
        this._super($scope);
    },

    setUpComponent: function(){
        switch(this.name){
        case "contactList":
            this.$scope.componentUrl = "/components/contacts/contactList.html";
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

        this.notifications.addEventListener(components.events.SWAP_COMPONENT, this.swapComponent.bind(this));

        this.$timeout(function(){
            $("#" + self.name + "box").resizable({
                grid: 50,
                ghost: true,
                stop: function(event, ui){
                    self.resize();
                }
            });

            $("#" + self.name + "box").draggable({
                snap: true,
                containment: "#dashboard"
            });
        });
    },

    //Swap Component
    swapComponent: function(event, name, componentUrl){
        if(this.name == name){
            console.log("swapping component");
            this.$scope.componentUrl = componentUrl;
            this.$scope.$apply();
        }
    },


    //Resize the Component Box
    resize: function(){
        console.log("componentBoxDirective: resize()");
        console.log("box height: " + $("#" + this.name + "box").height());
        console.log("box width: " + $("#" + this.name + "box").width());

        console.log("box body: " + $("#" + this.name + "Body").height());
        console.log("box body: " + $("#" + this.name + "Body").width());

        //Set Body equal to Box - some
        $("#" + this.name + "Body").height($("#" + this.name + "box").height() - 50);
        $("#" + this.name + "Body").width($("#" + this.name + "box").width() - 20);
        $("#" + this.name + "Body").trigger('resize');
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
        if(!this.min){
            this.minComponent.previousHeight = $("#" + this.name + "box").height();
            $('#' + this.name + 'Body').toggle();
            $("#" + this.name + "box").height(50);
            //$("#" + this.name + "box").resizable('destroy');
            this.min = true;
        } else {
            $('#' + this.name + 'Body').toggle();
            $("#" + this.name + "box").height(this.minComponent.previousHeight);
            //$("#" + this.name + "box").resizable();
            this.min = false;
        }
    },

    //Maximize the Component
    maxComponent: function(){
        if(!this.max){
            this.maxComponent.previousHeight = $("#" + this.name + "box").height();
            this.maxComponent.previousWidth = $("#" + this.name + "box").width();
            $("#" + this.name + "box").height($('#dashboard').height());
            $("#" + this.name + "box").width($('#dashboard').width());
            this.resize();
            this.max = true;
        } else {
            $("#" + this.name + "box").height(this.maxComponent.previousHeight);
            $("#" + this.name + "box").width(this.maxComponent.previousWidth);
            this.max = false;
            this.resize();
        }
    },


    //Destroy
    destroy: function(){
        console.log("componentBoxDirective:  destory()");
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
