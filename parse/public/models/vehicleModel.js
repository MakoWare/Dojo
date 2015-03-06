namespace('models.events').VEHICLES_LOADED = "ActivityModel.VEHICLES_LOADED";

//Vehicle Model
var VehicleModel = EventDispatcher.extend({
    currentVehicle: null,
    vehicles:null,

    //Injected by the provider
    ParseService:null,
    notifications: null,

    //Find Vehicles In Current User's Agency
    findVehiclesByAgency: function(){
        var self = this;
	this.ParseService.findVehiclesByAgency(function(results){
            self.vehicles = results;
            self.notifications.notify(models.events.VEHICLES_LOADED);
        });
    }


});


//Vehicle Model Provider - (Singlton Factory)
(function (){
    var VehicleModelProvider = Class.extend({
	instance: new VehicleModel(),

        //Init VehicleModel
	$get:['ParseService', 'Notifications', function(ParseService, Notifications){
	    this.instance.ParseService = ParseService;
            this.instance.notifications = Notifications;
	    return this.instance;
	}]
    });

    angular.module('dojo.VehicleModel',[])
	.provider('VehicleModel', VehicleModelProvider);
}());
