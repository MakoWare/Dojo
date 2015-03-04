namespace('models.events').PATIENTS_LOADED = "ActivityModel.PATIENTS_LOADED";

//Patient Model
var PatientModel = EventDispatcher.extend({
    currentPatient: null,
    patients:null,

    //Injected by the provider
    ParseService:null,
    notifications: null,

    //Find Dispatches In Current User's Agency
    findPatientsByAgency: function(){
        var self = this;
	this.ParseService.findPatientsByAgency(function(results){
            self.patients = results;
            self.notifications.notify(models.events.PATIENTS_LOADED);
        });
    }


});


//Patient Model Provider - (Singlton Factory)
(function (){
    var PatientModelProvider = Class.extend({
	instance: new PatientModel(),

        //Init PatientModel
	$get:['ParseService', 'Notifications', function(ParseService, Notifications){
	    this.instance.ParseService = ParseService;
            this.instance.notifications = Notifications;
	    return this.instance;
	}]
    });

    angular.module('dojo.PatientModel',[])
	.provider('PatientModel', PatientModelProvider);
}());
