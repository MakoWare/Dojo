'use strict';

//Vehicle Controller
var VehicleCtrl = BaseController.extend({
    init: function($scope, VehicleModel, Notifications){
        console.log("VehicleListCtrl");
        this.notifications = Notifications;
        this.vehicleModel = VehicleModel;
        this.$scope = $scope;
        this._super($scope);


    },

    //Define Listeners
    defineListeners: function(){
        this.notifications.addEventListener(models.events.VEHICLES_LOADED, this.onVehiclesLoaded.bind(this));
        this.$scope.vehicleButton = this.onVehicleButtonClicked.bind(this);
        this.$scope.editVehicle = this.editVehicle.bind(this);
    },

    //Define Scope
    defineScope: function(){
        this.$scope.title = "Vehicles";
        this.$scope.buttonAction = "Create Vehicle";
        this.$scope.list = true;
        this.$scope.template = "/components/vehicle/vehicleList.html";
        this.vehicleModel.findVehiclesByAgency();
        /*
        //get Codes for Vehicle Type
        var promises = [];
        promises.push(ParseService.findNemsisElementCodes("dVehicle.04", function(results){
            $scope.vehicleTypes = results;
            return;
        }));

        //get all Users in the Agency
        promises.push(ParseService.findUsersByAgency(function(results){
            console.log(results);
            results.forEach(function(user){
                user.ticked = false;
                user.fullName = user.attributes.firstName + " " + user.attributes.lastName;
                $scope.vehicle.attributes.crew.forEach(function(crewMember){
                    if(crewMember.id == user.id){
                        user.ticked = true;
                    }
                });
            });
            $scope.users = results;
            return;
        }));

        Parse.Promise.when(promises).then(function(){
            GlobalService.dismissSpinner();
            $scope.$apply();
        });
        */
    },

    //On Vehicles Loaded
    onVehiclesLoaded: function(){
        this.$scope.objects = this.vehicleModel.vehicles;
        this.$scope.$apply();
    },

    //Edit Vehicle
    editVehicle: function(vehicle){
        this.vehicleModel.currentVehicle = vehicle;
        this.$scope.template = "/components/vehicle/vehicleForm.html";
        this.$scope.list = false;
        this.$scope.title = "Update " + vehicle.attributes.name;
        this.$scope.buttonAction = "Back";
        this.$scope.vehicle = vehicle;
    },

    //On Vehicle Button Clicked
    onVehicleButtonClicked: function(){
        if(this.$scope.list){
            this.createVehicle();
        } else {
            this.back();
        }
    },

    //create Vehicle
    createVehicle: function(){
        this.$scope.list = false;
        this.$scope.title = "New Vehicle";
        this.$scope.buttonAction = "Back";
        this.$scope.template = "/components/vehicle/vehicleForm.html";
        //this.$scope.$apply();
    },

    //back
    back: function(){
        this.$scope.title = "Vehicles";
        this.$scope.buttonAction = "Add Vehicle";
        this.$scope.list = true;
        this.$scope.template = "/components/vehicle/vehicleList.html";
        this.vehicleModel.findVehiclesByAgency();
        //this.$scope.$apply();
    },



    //Destroy
    destroy: function(){
        console.log("destroy");
        this.notifications.removeEventListener(models.events.VEHICLES_LOADED, this.onVehiclesLoaded.bind(this));
    }

});

VehicleCtrl.$inject =  ['$scope', 'VehicleModel', 'Notifications'];
