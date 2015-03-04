namespace('models.events').DISPATCHES_LOADED = "ActivityModel.DISPATCHES_LOADED";

//Dispatch Model
var DispatchModel = EventDispatcher.extend({
    currentDispatch: null,
    dispatches:null,

    //Injected by the provider
    ParseService:null,
    notifications: null,

    //Find Dispatches In Current User's Agency
    findDispatchesByAgency: function(){
        var self = this;
	this.ParseService.findDispatchesByAgency(function(results){
            self.dispatches = results;
            self.notifications.notify(models.events.DISPATCHES_LOADED);
        });
    }


});


//Dispatch Model Provider - (Singlton Factory)
(function (){
    var DispatchModelProvider = Class.extend({
	instance: new DispatchModel(),

        //Init DispatchModel
	$get:['ParseService', 'Notifications', function(ParseService, Notifications){
	    this.instance.ParseService = ParseService;
            this.instance.notifications = Notifications;
	    return this.instance;
	}]
    });

    angular.module('dojo.DispatchModel',[])
	.provider('DispatchModel', DispatchModelProvider);
}());
