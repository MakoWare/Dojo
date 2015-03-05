namespace('models.events').CURRENT_CONTACT_LOADED = "ActivityModel.CURRENT_CONTACT_LOADED";
namespace('models.events').CONTACTS_LOADED = "ActivityModel.CONTACTS_LOADED";

//Contact Model
var ContactModel = EventDispatcher.extend({
    currentContact: null,
    currentHubId: null,
    contacts:null,

    //Injected by the provider
    ParseService:null,
    notifications: null,
    agnencyModel: null,


    findContactsByAgency: function(){
        var self = this;
        this.ParseService.findContactsByAgency(function(results){
            self.contacts = results;
            self.notifications.notify(models.events.CONTACTS_LOADED);
        });
    },




});

//Provider, as all components will use the same HubsModel instance, $inject will init once, then pull the same object from Instance Cache for all other $injects
(function (){
    var ContactModelProvider = Class.extend({
	instance: new ContactModel(),

        //Init ContactModel
	$get:['AgencyModel', 'ParseService', 'Notifications', function(AgencyModel, ParseService, Notifications){
	    this.instance.agencyModel = AgencyModel;
	    this.instance.ParseService = ParseService;
            this.instance.notifications = Notifications;
	    return this.instance;
	}]
    });

    angular.module('dojo.ContactModel',[])
	.provider('ContactModel', ContactModelProvider);
}());
