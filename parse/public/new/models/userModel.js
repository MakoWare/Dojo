namespace('models.events').CURRENT_USER_LOADED = "ActivityModel.CURRENT_USER_LOADED";

//User Model
var UserModel = EventDispatcher.extend({
    currentUser: null,
    currentUserId: null,
    users:null,

    //Injected by the provider
    ParseService:null,
    notifications: null,

    //Get the Current User via the ParseService
    getCurrentUser: function(){
        var self = this;
	this.currentUser = this.ParseService.getCurrentUser();
        self.notifications.notify(models.events.CURRENT_USER_LOADED);
    },

    //Logout current User
    logout: function(){
        this.ParseService.logout();
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
    var UserModelProvider = Class.extend({
	instance: new UserModel(),

        //Init UserModel
	$get:['ParseService', 'Notifications', function(ParseService, Notifications){
	    this.instance.ParseService = ParseService;
            this.instance.notifications = Notifications;
	    return this.instance;
	}]
    });

    angular.module('dojo.UserModel',[])
	.provider('UserModel', UserModelProvider);
}());
