//Component Box
var ComponentBoxDirective = BaseDirective.extend({
    notifications: null,

    init: function($scope, $timeout, notifications){
        console.log("ComponentBoxDirective");
        this.notifications = notifications;
        this.$scope = $scope;
        this.name = $scope.name;
        this.$timeout = $timeout;
        this._super($scope);
    },

    defineListeners: function(){
        var self = this;
        this.$timeout(function(){
            $("#" + self.name + "Remove").click(function(event){
                self.removeComponent();
            });
        });
    },

    removeComponent: function(){
        this.notifications.notify(components.events.REMOVE_COMPONENT, this.name);
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
