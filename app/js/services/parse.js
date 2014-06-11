//Parse Services
angular.module('dojoServices', ['ngResource'])
    .factory('ParseService', function($resource){

        /*
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

        //Define ACL for Parse Objects
        var acl = new Parse.ACL();
        acl.setRoleWriteAccess("Manager", true);
        acl.setRoleReadAccess("Manager", true);
        acl.setRoleWriteAccess("Dispatcher", true);
        acl.setRoleReadAccess("Dispatcher", true);
        acl.setPublicWriteAccess(false);
        acl.setPublicReadAccess(false);

        var ParseService = {


            //Object Factory
            createNemsisElement : function(){
                var nemsisElement = new NemsisElement();
                nemsisElement.setACL(acl);
                nemsisElement.set('title', "");
                nemsisElement.set('value', "");
                nemsisElement.set('createdBy', currentUser);
                nemsisElement.set('agencyId', currentUser.get('agencyId'));
                nemsisElement.set('pcrId', "");

                return(nemsisElement);
            },

            createSection : function(){
                var section = new Section();
                section.setACL(acl);
                section.set('name', "");
                section.set('elements', {});
                section.set('sections', {});
                section.set('createdBy', currentUser);
                section.set('agencyId', currentUser.get('agencyId'));
                section.set('pcrId', "");

                return section;
            },

            //Login
            login : function(username, password, callback) {
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
            logout : function(){
              Parse.User.logOut();
            }
        };
*/
    });
