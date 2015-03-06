'use strict';

//Dispatch List Controller
var DispatchListCtrl = BaseController.extend({

    init: function($scope, DispatchModel, Notifications){
        console.log("DispatchListCtrl");
        this.notifications = Notifications;
        this.dispatchModel = DispatchModel;
        this.$scope = $scope;
        this._super($scope);

        this.dispatchModel.findDispatchesByAgency();
    },

    defineListeners: function(){
        this.notifications.addEventListener(models.events.DISPATCHES_LOADED, this.onDispatchesLoaded.bind(this));

        $("#dispatchList").on("remove", this.destroy.bind(this));
    },

    //On Dispatches Loaded
    onDispatchesLoaded: function(){
        this.$scope.objects = this.dispatchModel.dispatches;
        this.$scope.$apply();
    },

    //Destroy
    destroy: function(){
        console.log("destroy");
        this.notifications.removeEventListener(models.events.DISPATCHES_LOADED, this.onDispatchesLoaded.bind(this));
    }


});

DispatchListCtrl.$inject =  ['$scope', 'DispatchModel', 'Notifications'];
