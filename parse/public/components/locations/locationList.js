'use strict';

//Location List Controller
var LocationListCtrl = BaseController.extend({
    init: function($scope, LocationModel, Notifications){
        console.log("LocationListCtrl");
        this.notifications = Notifications;
        this.locationModel = LocationModel;
        this.$scope = $scope;
        this._super($scope);

        this.locationModel.findLocationsByAgency();
    },

    defineListeners: function(){
        this.notifications.addEventListener(models.events.LOCATIONS_LOADED, this.onLocationsLoaded.bind(this));

        $("#locationList").on("remove", this.destroy.bind(this));
    },

    //On Locations Loaded
    onLocationsLoaded: function(){
        this.$scope.objects = this.locationModel.locations;
        this.$scope.$apply();
    },

    //Destroy
    destroy: function(){
        console.log("destroy");
        this.notifications.removeEventListener(models.events.LOCATIONS_LOADED, this.onLocationsLoaded.bind(this));
    }


});

LocationListCtrl.$inject =  ['$scope', 'LocationModel', 'Notifications'];
