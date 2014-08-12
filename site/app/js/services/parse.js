//Parse Service
angular.module('parseService', [])
    .factory('ParseService', function(){

        //Init Parse
	Parse.initialize("8vNcAs6Z0c4jyHvuW5zezUXij8DquZLeYP4pFicD", "Ipw8skfNMGvX9uGc8LHn0qCbAIhWjrZP5LEHm9vI");

	//Define Parse Objects
	var Agency = Parse.Object.extend("Agency");
	var User = Parse.Object.extend("User");
	var Role = Parse.Object.extend("Role");
	var PCR = Parse.Object.extend("PCR");
	var AgencyFile = Parse.Object.extend("AgencyFile");
	var Section = Parse.Object.extend("Section");
	var NemsisSection = Parse.Object.extend("NemsisSection");
	var Dispatch = Parse.Object.extend("Dispatch");
	var Patient = Parse.Object.extend("Patient");
	var Personnel = Parse.Object.extend("Personnel");
	var Vehicle = Parse.Object.extend("Vehicle");
	var NemsisElement = Parse.Object.extend("NemsisElement");
	var NemsisElementCode = Parse.Object.extend("NemsisElementCode");
	var NemsisHeader = Parse.Object.extend("NemsisHeader");
	var IpadConfiguration = Parse.Object.extend("IpadConfiguration");
        var ERRORMESSAGE = "An Error has occured, please contact us with this error message: ";

        //Define ACL for Parse Objects
        var acl = new Parse.ACL();
        acl.setRoleWriteAccess("Manager", true);
        acl.setRoleReadAccess("Manager", true);
        acl.setRoleWriteAccess("Dispatcher", true);
        acl.setRoleReadAccess("Dispatcher", true);
        acl.setPublicWriteAccess(false);
        acl.setPublicReadAccess(false);

        var ParseService = {

            //Nemsis Object Helpers
            //Create

            //NemsisElement
            createNemsisElement: function(){

            },

            //Section
            createSection: function(name, callback){
                var agencyId = Parse.User.current().get("agencyId");
                var userId = Parse.User.current().id;

                ObjectHelper.createSection(agencyId, userId, name, function(results){
                    callback(results);
                });
            },

            //Read
            //NemsisElement
            getNemsisElement: function(objectId, callback){
                var query = new Parse.Query("NemsisElement");
                query.get(objectId, {
                    success: function(results){
                        callback(resutlts);
                    },
                    error: function(error){
                        alert(ERRORMESSAGE + error.message);
                    }
                });
            },

            //Section
            getSection: function(objectId, callback){
                var query = new Parse.Query("Section");
                query.include("sections");
                query.include("elements");
                query.include("elements.header");
                query.include("nemsisSection");
                query.include("nemsisSection.sections");
                query.get(objectId, {
                    success: function(results){
                        callback(results);
                    },
                    error: function(object, error){
                        alert(ERRORMESSAGE + error.message);
                    }
                });
            },

            getSectionByName: function(sectionName, callback){
                var query = new Parse.Query("Section");
                query.equalTo("name", sectionName);
                query.equalTo("agencyId", Parse.User.current().get('agencyId'));
                query.include('sections');
                query.include('nemsisSection.sections.sections');
                query.first({
                    success: function(results){
                        callback(results);
                    },
                    error: function(error){
                        alert(ERRORMESSAGE + error.message);
                    }
                });
            },


            //NemsisElementCodes
            getNemsisElementCodes: function(elementNumbers, callback){
                var query = new Parse.Query("NemsisElementCodes");
                query.containedIn("elementNumber", elementNumbers);
                query.find({
                    success: function(results){
                        callback(results);
                    },
                    error: function(error){
                        alert(ERRORMESSAGE + error.message);
                    }
                });
            },

            //Parse Object Helpers
            //Create

            //Agency
            createAgency: function(name, callback){
                var userId = Parse.User.current().id;
                ObjectHelper.createAgency(name, userId, function(results){
                    callback(results);
                });
            },

            //Dispatch
            createDispatch: function(callback){

            },

            //Device
            createDevice: function(){

            },

            //Create Object
            createObject: function(objectType, callback){
                var object;
                switch(objectType) {
                case "Dispatch":
                    object = this.createDispatch(function(results){
                        callback(results);
                    });
                    break;
                }
            },

            //Get Object
            getObject: function(objectType, objectId, callback){
                var query = new Parse.Query(objectType);
                query.get(objectId, {
                    success: function(results){
                        callback(results);
                    },
                    error: function(error){
                        alert("Error: " + error.message);
                    }
                });
            },

            //Find Objects
            findObjects: function(objectType, searchParam, filterParam, callback){
                var query = new Parse.Query(objectType);
                query.find({
                    success: function(results){
                        callback(results);
                    },
                    error: function(error){
                        alert("Error: " + error.message);
                    }
                });
            },

            //Update Object
            updateObject: function(object){
                //TODO
            },

            //Delete Object
            deleteObject: function(object){
                //TODO
            },

            //Login
            login: function(username, password, callback) {
		Parse.User.logIn(username, password, {
		    success: function(user) {
			currentUser = user;
			callback(user);
		    },
		    error: function(user, error) {
			alert("Error: " + error.message);
		    }
		});
	    },

            //Logout
            logout: function(){
              Parse.User.logOut();
            },

            //Get Current User
            getCurrentUser: function(){
                return Parse.User.current();
            }

        };

        return ParseService;
    });
