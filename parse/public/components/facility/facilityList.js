'use strict';

//Facility List Controller
var FacilityListCtrl = BaseController.extend({
    init: function($scope, FacilityModel, Notifications){
        console.log("FacilityListCtrl");
        this.notifications = Notifications;
        this.facilityModel = FacilityModel;
        this.$scope = $scope;
        this._super($scope);

        this.facilityModel.findFacilitiesByAgency();
    },

    defineListeners: function(){
        this.notifications.addEventListener(models.events.FACILITIES_LOADED, this.onFacilitiesLoaded.bind(this));

        $("#facilityList").on("remove", this.destroy.bind(this));
    },

    //On Facilities Loaded
    onFacilitiesLoaded: function(){
        console.log("onFacilitiesLoaded");
        this.$scope.objects = this.facilityModel.facilities;
        this.$scope.$apply();
    },

    //Destroy
    destroy: function(){
        console.log("destroy");
        this.notifications.removeEventListener(models.events.FACILITIES_LOADED, this.onFacilitiesLoaded.bind(this));
    }


});

FacilityListCtrl.$inject =  ['$scope', 'FacilityModel', 'Notifications'];
