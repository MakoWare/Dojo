namespace('models.events').CURRENT_LOCATION_LOADED = "ActivityModel.CURRENT_LOCATON_LOADED";
namespace('models.events').LOCATIONS_LOADED = "ActivityModel.LOCATIONS_LOADED";

//Location Model
var LocationModel = EventDispatcher.extend({
    currentLocation: null,
    locations:null,

    //Injected by the provider
    ParseService:null,
    notifications: null,

    findLocationsByAgency: function(){
        var self = this;
        this.ParseService.findLocationsByAgency(function(results){
            self.locations = results;
            self.notifications.notify(models.events.LOCATIONS_LOADED);
        });
    },
});

//Provider, as all components will use the same HubsModel instance, $inject will init once, then pull the same object from Instance Cache for all other $injects
(function (){
    var LocationModelProvider = Class.extend({
	instance: new LocationModel(),

        //Init LocationModel
	$get:['ParseService', 'Notifications', function(ParseService, Notifications){
	    this.instance.ParseService = ParseService;
            this.instance.notifications = Notifications;
	    return this.instance;
	}]
    });

    angular.module('dojo.LocationModel',[])
	.provider('LocationModel', LocationModelProvider);
}());
