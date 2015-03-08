'use strict';

//Vehicle List Controller
var VehicleListCtrl = BaseController.extend({
    init: function($scope, VehicleModel, Notifications){
        console.log("VehicleListCtrl");
        this.notifications = Notifications;
        this.vehicleModel = VehicleModel;
        this.$scope = $scope;
        this._super($scope);

        this.vehicleModel.findVehiclesByAgency();
    },

    defineListeners: function(){
        this.notifications.addEventListener(models.events.VEHICLES_LOADED, this.onVehiclesLoaded.bind(this));

        $("#vehicleList").on("remove", this.destroy.bind(this));
    },

    //On Vehicles Loaded
    onVehiclesLoaded: function(){
        this.$scope.objects = this.vehicleModel.vehicles;
        this.$scope.$apply();
    },

    //Destroy
    destroy: function(){
        console.log("destroy");
        this.notifications.removeEventListener(models.events.VEHICLES_LOADED, this.onVehiclesLoaded.bind(this));
    }


});

VehicleListCtrl.$inject =  ['$scope', 'VehicleModel', 'Notifications'];
