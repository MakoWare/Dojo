namespace('models.events').FACILITIES_LOADED = "ActivityModel.FACILITIES_LOADED";

//Facility Model
var FacilityModel = EventDispatcher.extend({
    currentFacility: null,
    currentFacilityId: null,
    facilities:null,

    //Injected by the provider
    ParseService:null,
    notifications: null,

    //Find Facacilities In Current User's Agency
    findFacilitiesByAgency: function(){
        var self = this;
	this.ParseService.findFacilitiesByAgency(function(results){
            self.facilities = results;
            self.notifications.notify(models.events.FACILITIES_LOADED);
        });
    },
});


//Facility Model Provider - (Singlton Factory)
(function (){
    var FacilityModelProvider = Class.extend({
	instance: new FacilityModel(),

        //Init FacailityModel
	$get:['ParseService', 'Notifications', function(ParseService, Notifications){
	    this.instance.ParseService = ParseService;
            this.instance.notifications = Notifications;
	    return this.instance;
	}]
    });

    angular.module('dojo.FacilityModel',[])
	.provider('FacilityModel', FacilityModelProvider);
}());
