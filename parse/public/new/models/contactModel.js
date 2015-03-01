//Contact Model
var ContactModel = EventDispatcher.extend({
    currentContact: null,
    currentHubId: null,
    contacts:null,

    //Injected by the provider
    ParseService:null,
    notifications: null,

    //Load Hubs via Parse service for the Hubs Table
    getHubsForTable: function(){
        var self = this;
	this.ParseService.getHubsForTable().then(function(results){
            self.hubs = results;
            self.notifications.notify(juke.events.HUBS_LOADED);
        });
    },

    //Get a Hub by Id
    getHubById: function(hubId){
        var self = this;
	this.ParseService.getHubById(hubId).then(function(results){
            self.currentHub = results;
            self.notifications.notify(juke.events.CURRENT_HUB_LOADED);
        });
    },

    //Create a new Hub
    createHub: function(name, password, capabilities){
        var self = this;
        this.ParseService.createHub(name, password, capabilities).then(function(result){
            self.currentHub = result;
            self.notifications.notify(juke.events.HUB_CREATED);
        });
    },

    //Save current Hub
    saveCurrentHub: function(){
        var self = this;
        return this.currentHub.save({
            success: function(result){
                self.currentHub = result;
            },
            error: function(object, error){
                alert("An Error occured: " + error.message);
            }
        });
    }



});

//Provider, as all components will use the same HubsModel instance, $inject will init once, then pull the same object from Instance Cache for all other $injects
(function (){
    var HubsModelProvider = Class.extend({
	instance: new HubsModel(),

        //Init HubsModel
	$get:['ParseService', 'Notifications', function(ParseService, Notifications){
	    this.instance.ParseService = ParseService;
            this.instance.notifications = Notifications;
	    return this.instance;
	}]
    });

    angular.module('juke.HubsModel',[])
	.provider('HubsModel',HubsModelProvider);
}());
