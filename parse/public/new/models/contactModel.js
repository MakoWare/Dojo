//Contact Model
var ContactModel = EventDispatcher.extend({
    currentContact: null,
    currentHubId: null,
    contacts:null,

    //Injected by the provider
    ParseService:null,
    notifications: null,




});

//Provider, as all components will use the same HubsModel instance, $inject will init once, then pull the same object from Instance Cache for all other $injects
(function (){
    var ContactModelProvider = Class.extend({
	instance: new ContactModel(),

        //Init ContactModel
	$get:['ParseService', 'Notifications', function(ParseService, Notifications){
	    this.instance.ParseService = ParseService;
            this.instance.notifications = Notifications;
	    return this.instance;
	}]
    });

    angular.module('dojo.ContactModel',[])
	.provider('ContactModel', ContactModelProvider);
}());
