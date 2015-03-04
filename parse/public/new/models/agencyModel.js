namespace('models.events').AGENCIES_LOADED = "ActivityModel.AGENCIES_LOADED";

//Agency Model
var AgencyModel = EventDispatcher.extend({
    currentAgency: null,
    agencies:null,

    //Injected by the provider
    ParseService:null,
    notifications: null,

    //Find Agencies
    findAllAgencies: function(){
        var self = this;
	this.ParseService.findAllAgencies(function(results){
            self.agencies = results;
            self.notifications.notify(models.events.AGENCIES_LOADED);
        });
    }


});


//Agency Model Provider - (Singlton Factory)
(function (){
    var AgencyModelProvider = Class.extend({
	instance: new AgencyModel(),

        //Init Agency Model
	$get:['ParseService', 'Notifications', function(ParseService, Notifications){
	    this.instance.ParseService = ParseService;
            this.instance.notifications = Notifications;
	    return this.instance;
	}]
    });

    angular.module('dojo.AgencyModel',[])
	.provider('AgencyModel', AgencyModelProvider);
}());
