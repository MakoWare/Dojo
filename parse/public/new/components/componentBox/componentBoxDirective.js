//Component Box
var ComponentBoxDirective = BaseDirective.extend({
    notifications: null,

    init: function($scope, $timeout, notifications){
        console.log("ComponentBoxDirective");
        this.notifications = notifications;
        this.$scope = $scope;
        this.name = $scope.name;
        this.setUpComponent();
        this.$timeout = $timeout;
        this._super($scope);



    },

    setUpComponent: function(){
        switch(this.name){
        case "contactList":
            this.$scope.componentHeaderUrl = "/components/contacts/contactListHeader.html";
            break;
        case "dispatchList":
            this.$scope.componentHeaderUrl = "/components/dispatches/dispatchListHeader.html";
            break;

        }


    },

    defineListeners: function(){
        var self = this;
        this.$scope.removeComponent = function(){ self.removeComponent();};
        this.$scope.minComponent = function(){ self.minComponent();};
        this.$scope.maxComponent = function(){ self.maxComponent();};

        this.$timeout(function(){
            $("#" + self.name + "box").resizable({
                grid: 50,
                ghost: true,
                stop: function(event, ui){
                    //$scope.resize();
                }
            });

            $("#" + self.name + "box").draggable({
                snap: true,
                containment: "#dashboard"
            });
        });
    },

    //Notify to Remove
    removeComponent: function(){
        this.notifications.notify(components.events.REMOVE_COMPONENT, this.name);
    },

    //Minimize the Component
    minComponent: function(){
        console.log("min");
    },

    //Maximize the Component
    maxComponent: function(){
        console.log("max");

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
