'use strict';

//Facility Controller
var FacilityCtrl = BaseController.extend({
    init: function($scope, FacilityModel, Notifications){
        console.log("FacilityListCtrl");
        this.notifications = Notifications;
        this.facilityModel = FacilityModel;
        this.$scope = $scope;
        this._super($scope);
    },

    //Define Listeners
    defineListeners: function(){
        this.notifications.addEventListener(models.events.FACILITIES_LOADED, this.onFacilitiesLoaded.bind(this));

        $("#facilityList").on("remove", this.destroy.bind(this));
    },

    //Define Scope
    defineScope: function(){
        this.$scope.title = "Facilities";
        this.$scope.buttonAction = "Create Facility";
        this.$scope.list = true;
        this.$scope.template = "/components/facility/facilityList.html";
        this.facilityModel.findFacilitiesByAgency();
    },


    //On Facilities Loaded
    onFacilitiesLoaded: function(){
        console.log("onFacilitiesLoaded");
        this.$scope.objects = this.facilityModel.facilities;
        this.$scope.$apply();
    },

    //Edit Facility
    editFacility: function(facility){
        this.facilityModel.currentFacility = facility;
        this.$scope.template = "/components/facility/facilityForm.html";
        this.$scope.list = false;
        this.$scope.title = "Update " + facility.attributes.name;
        this.$scope.buttonAction = "Back";
        this.$scope.facility = facility;
    },

    //On Facility Button Clicked
    onFacilityButtonClicked: function(){
        if(this.$scope.list){
            this.createFacility();
        } else {
            this.back();
        }
    },

    //Create Facility
    createFacility: function(){
        this.$scope.list = false;
        this.$scope.title = "New Facility";
        this.$scope.buttonAction = "Back";
        this.$scope.template = "/components/facility/facilityForm.html";
        this.$scope.$apply();
    },

    //back
    back: function(){
        this.$scope.title = "Facilities";
        this.$scope.buttonAction = "Create Facility";
        this.$scope.list = true;
        this.$scope.template = "/components/facility/facilityList.html";
        this.facilityModel.findFacilitiesByAgency();
        this.$scope.$apply();
    },


    //Destroy
    destroy: function(){
        console.log("destroy");
        this.notifications.removeEventListener(models.events.FACILITIES_LOADED, this.onFacilitiesLoaded.bind(this));
    }


});

FacilityCtrl.$inject =  ['$scope', 'FacilityModel', 'Notifications'];
