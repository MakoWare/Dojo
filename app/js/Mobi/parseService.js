//Parse Services
angular.module('mobiServices', ['ngResource'])
    .factory('ParseService', function($resource){

	//Init Parse
	Parse.initialize("8vNcAs6Z0c4jyHvuW5zezUXij8DquZLeYP4pFicD", "Ipw8skfNMGvX9uGc8LHn0qCbAIhWjrZP5LEHm9vI");

	//Cash current User
	var currentUser;

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

	var ParseService = {
	    name: "Parse",

            //Object Bank -All new Object initialized here
            createNemsisElement : function createNemsisElement(callback){
                var error = {};
                //First check if the user is active and valid
                if(Parse.User.current().get('active')){

                    //Second check if the user is allowed to create this type of object.
                    var isManager = false;
                    var isDispatcher = false;

                    var rolePromise1 = ParseService.hasRole("Manager", function(results){
                        isManager = results;
                    });
                    var rolePromise2 = ParseService.hasRole("Dispatcher", function(results){
                        isDispatcher = results;
                    });

                    Parse.Promise.when([rolePromise1, rolePromise2]).then(function(){
                        if(isManager || isDispatcher){
                            var acl = new Parse.ACL();
                            acl.setRoleWriteAccess("Manager", true);
                            acl.setRoleReadAccess("Manager", true);
                            acl.setRoleWriteAccess("Dispatcher", true);
                            acl.setRoleReadAccess("Dispatcher", true);
                            acl.setPublicWriteAccess(false);
                            acl.setPublicReadAccess(false);

                            var nemsisElement = new NemsisElement();
                            nemsisElement.setACL(acl);
                            nemsisElement.set('title', "");
                            nemsisElement.set('value', "");
                            nemsisElement.set('createdBy', currentUser);
                            nemsisElement.set('agencyId', currentUser.get('agencyId'));
                            nemsisElement.set('pcrId', "");

                            callback(nemsisElement);
                        } else {
                            error.message = "User does not have permissions required";
                            error.code = 2;
                            callback(error);
                        }
                    });
                } else {
                    error.message = "User is not valid";
                    error.code = 1;
                    callback(error);
                }
            },

            createSection : function createSection(callback){
                var error = {};
                //First check if the user is active and valid
                if(Parse.User.current().get('active')){

                    //Second check if the user is allowed to create this type of object.
                    var isManager = false;
                    var isDispatcher = false;

                    var rolePromise1 = ParseService.hasRole("Manager", function(results){
                        isManager = results;
                    });
                    var rolePromise2 = ParseService.hasRole("Dispatcher", function(results){
                        isDispatcher = results;
                    });

                    Parse.Promise.when([rolePromise1, rolePromise2]).then(function(){
                        if(isManager || isDispatcher){
                            var acl = new Parse.ACL();
                            acl.setRoleWriteAccess("Manager", true);
                            acl.setRoleReadAccess("Manager", true);
                            acl.setRoleWriteAccess("Dispatcher", true);
                            acl.setRoleReadAccess("Dispatcher", true);
                            acl.setPublicWriteAccess(false);
                            acl.setPublicReadAccess(false);

                            var section = new Section();
                            section.setACL(acl);
                            section.set('name', "");
                            section.set('elements', {});
                            section.set('sections', {});
                            section.set('createdBy', currentUser);
                            section.set('agencyId', currentUser.get('agencyId'));
                            section.set('pcrId', "");

                            callback(section);
                        } else {
                            error.message = "User does not have permissions required";
                            error.code = 2;
                            callback(error);
                        }
                    });

                } else {
                    error.message = "User is not valid";
                    error.code = 1;
                    callback(error);
                }
            },

	    //Role Check
	    hasRole : function hasRole(role, callback){
		var query = (new Parse.Query(Parse.Role));
		query.equalTo("name", role);
		query.equalTo("users", Parse.User.current());
		var promise = query.first().then(function(role) {
		    if (role) {
		        callback(true);
		    } else {
		        callback(false);
		    }
		});
                return promise;
	    },

	    //User
	    //Login
	    login : function login(username, password, callback) {
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
	    logout : function logout(callback) {
		Parse.User.logOut();
	    },

	    //Sign up
	    signUp : function signUp(username, password, token, callback) {
		var acl = new Parse.ACL();
		Parse.User.signUp(username, password, { ACL: acl }, {
		    success: function(user) {
			//give user a role with no permisions
			var query = new Parse.Query(Parse.Role);
			query.equalTo('name', 'None');
			query.first({
			    success: function(role){
				role.getUsers().add(user);
				role.save(null, {
				    success: function(role){
					var relation = user.relation("roles");
					relation.add(role);
					user.save(null, {
					    success: function(user){
						callback(user);
					    },
					    error: function(object, error){
						alert("Error: " + error.message);
					    }
					});
				    },
				    error: function(object, error){
					alert("Error: " + error.message);
				    }
				});
			    },
			    error: function(error){
				alert("Error: " + error.message);
			    }
			});
		    },
		    error: function(user, error) {
			alert("Error: " + error.message);
		    }
		});
	    },

	    //Get Current User
	    getCurrentUser : function getCurrentUser() {
		currentUser = Parse.User.current();
		if(currentUser) {
		    return currentUser;
		}
	    },

	    //Get User by Id
	    getUserById : function getUserById(id) {
		var query = new Parse.Query(User);
		query.get(id, {
		    success: function(user){
			return user;
		    },
		    error: function(object, error){
			alert("Error " + error.message);
		    }
		});
	    },

	    //Get Users by AgencyId
	    getUsersByAgency : function getUsersByAgency(id, callback) {
		var query = new Parse.Query(User);
		query.equalTo('agencyId', id);
		query.find({
		    success: function(results){
			callback(results);
		    },
		    error: function(error){
			alert("Error " + error.message);
		    }
		});
	    },

            //Get Agency by id
            getAgency : function getAgency(callback){
                var query = new Parse.Query(Agency);
                query.include('dPersonnel');
                query.include('dDevice');
                query.include('dVehicle');
                query.include('dFacility');
                query.get(currentUser.get('agencyId'), {
                    success: function(result){
                        callback(result);
                    },
                    error: function(error){
                        console.log("Error: " +  error.message);
                    }
                });
            },

	    //Sections
	    //Get Section by Name
	    getSectionsByName : function getSectionsByName(name, agencyId, callback){
		var query = new Parse.Query(Section);
		query.equalTo('agencyId', agencyId);
		query.equalTo('name', name);
		query.include('elements');
		query.include('headers');
		query.include('sections');
		query.include('sections.headers');
		query.include('sections.elements');
		query.include('sections.sections.elements');
		query.include('sections.sections.headers');

		query.find({
		    success: function(sections){
			callback(sections);
		    },
		    error: function(error){
			alert("Error " + error.message);
		    }
		});
	    },

	    //Get Section by Name
	    getSectionById : function getSectionById(id, callback){
		var query = new Parse.Query(Section);
		query.include('elements');
		query.include('headers');
		query.include('sections');
		query.include('sections.headers');
		query.include('sections.elements');
		query.include('sections.sections.elements');
		query.include('sections.sections.headers');
		query.get(id, {
		    success: function(results){
			callback(results);
		    },
		    error: function(object, error){
			alert("Error " + error.message);
		    }
		});
	    },


	    //Get Nemsis Section by Name
	    getNemsisSectionByName : function getNemsisSectionByName(name, callback){
		var query = new Parse.Query(NemsisSection);
		query.equalTo('name', name);
		query.include('headers');
		query.include('sections');
		query.include('sections.headers');
		query.include('sections.sections.elements');
		query.first({
		    success: function(results){
			callback(results);
		    },
		    error: function(error){
			alert("Error " + error.message);
		    }
		});
	    },

	    //Get Headers By Name
	    getHeadersByName : function getHeadersByName(name, callback){
		var query = new Parse.Query(NemsisHeader);
		query.startsWith('ElementNumber', name);
		query.find({
		    success: function(results){
			callback(results);
		    },
		    error: function(error){
			alert("Error " + error.message);
		    }
		});
	    },

	    //Get Headers By Name
	    getElementCodes : function getElementCodes(name, callback){
		var query = new Parse.Query(NemsisElementCode);
		query.startsWith('elementNumber', name);
		query.limit(1000);
		query.find({
		    success: function(results){
			callback(results);
		    },
		    error: function(error){
			alert("Error " + error.message);
		    }
		});
	    },

	    //Dispatches
	    //Get Current Dispatches
	    getDispatches : function getDispatches(agencyId, to, from, amount, callback){
		var query = new Parse.Query(Dispatch);
		query.equalTo('agencyId', agencyId);
		if(from != "all"){
		    query.greaterThan('pickUpDate', from);
		}
		if(to != "all"){
		    query.lessThan('pickUpDate', to);
		}
		query.include('patient');
		query.include('vehicle');
		query.limit(amount);
		query.find({
		    success: function(results){
			callback(results);
		    },
		    error: function(error){
			alert("Error " + error.message);
		    }
		});
	    },

	    //Get Dispatch By Id
	    getDispatchById : function getDispatchById(id, callback){
		var query = new Parse.Query(Dispatch);
		query.include('patient');
		query.include('eTimes');
		query.include('eTimes.elements');
		query.include('eDispatch');
		query.include('eDispatch.elements');
		query.include('vehicle');
		query.get(id, {
		    success: function(results){
			callback(results);
		    },
		    error: function(object, error){
			alert("Error " + error.message);
		    }
		});
	    },

	    //Vehicles
	    //Get Vehicles
	    getVehicles : function getVehicles(agencyId, callback){
		var query = new Parse.Query(Vehicle);

		query.equalTo('agencyId', agencyId);
		query.equalTo('active', true);
                query.include('dVehicle');
		query.include('installation');
		query.include('currentDispatch');
		query.include('currentDispatch.patient');
		query.find({
		    success: function(results){
			callback(results);
		    },
		    error: function(error){
			alert("Error " + error.message);
		    }
		});
	    },

	    //Get VehicleById
	    getVehicleById : function getVehicleById(id, callback){
		var query = new Parse.Query(Vehicle);
		query.include('currentDispatch');
		query.include('currentDispatch.patient');
		query.get(id, {
		    success: function(results){
			callback(results);
		    },
		    error: function(object, error){
			alert("Error " + error.message);
		    }
		});
	    },

	    //Patients
	    //Get Patients
	    getPatients : function getPatients(agencyId, callback){
		var query = new Parse.Query(Patient);
		query.equalTo('agencyId', agencyId);
		query.limit(1000);
		query.find({
		    success: function(results){
			callback(results);
		    },
		    error: function(error){
			alert("Error " + error.message);
		    }
		});
	    },

	    //Get Patient
	    getPatient : function getPatient(id, callback){
		var query = new Parse.Query(Patient);
		query.include('ePatient');
		query.include('ePatient.elements');
		query.include('ePatient.sections');
		query.include('ePatient.sections.elements');
		query.get(id,{
		    success: function(patient){
			callback(patient);
		    },
		    error: function(object, error){
			alert("Error " + error.message);
		    }
		});
	    },

	    //Get PCRs
	    getPCRs : function getPCRs(agencyId, from, to, callback){
		var query = new Parse.Query(PCR);
		query.equalTo('agencyId', agencyId);
		query.greaterThan('createdAt', from);
		query.lessThan('createdAt', to);
		query.include('user');
		query.include('device');
		query.limit(1000);
		query.find({
		    success: function(results){
			callback(results);
		    },
		    error: function(error){
			alert("Error " + error.message);
		    }
		});
	    },

	    //Get Ipad Configuration
	    getIpadConfig : function getIpadConfig(agencyId, callback){
		var query = new Parse.Query(IpadConfiguration);
		query.equalTo('agencyId', agencyId);
		query.first({
		    success: function(result){
			callback(result);
		    },
		    error: function(error){
			alert("Error " + error.message);
		    }
		});
	    },

	    //Get Files by AgencyId
	    getFilesByAgency : function getFilesByAgency(id, callback) {
		var query = new Parse.Query(AgencyFile);
		query.equalTo('agencyId', id);
		query.find({
		    success: function(results){
			callback(results);
		    },
		    error: function(error){
			alert("Error " + error.message);
		    }
		});
	    },

	    //Get Complaints
	    getComplaints : function getComplaints(callback){
		var query = new Parse.Query(NemsisElementCode);
		query.equalTo('elementNumber', 'eDispatch.01');
		query.find({
		    success: function(results){
			callback(results);
		    },
		    error: function(error){
			alert("Error " + error.message);
		    }
		});
	    },

	    //Get EMD Codes
	    getEMD : function getEMD(callback){
		var query = new Parse.Query(NemsisElementCode);
		query.equalTo('elementNumber', 'eDispatch.02');
		query.find({
		    success: function(results){
			callback(results);
		    },
		    error: function(error){
			alert("Error " + error.message);
		    }
		});
	    },

	    //Get Priority Codes
	    getPriority : function getPriority(callback){
		var query = new Parse.Query(NemsisElementCode);
		query.equalTo('elementNumber', 'eDispatch.05');
		query.find({
		    success: function(results){
			callback(results);
		    },
		    error: function(error){
			alert("Error " + error.message);
		    }
		});
	    },

	    //Maps
	    //Get markers
	    getMarkers : function getMarkers(callback){
		currentUser = Parse.User.current();
		var query = new Parse.Query(Vehicle);
		query.equalTo('agencyId', currentUser.get('agencyId'));
		query.equalTo('active', true);
		query.include('currentDispatch');
		query.find({
		    success: function(vehicles){
			var markers = [];
			vehicles.forEach(function(vehicle){
			    var latitude = parseFloat(vehicle.get('lat'));
			    var longitude = parseFloat(vehicle.get('lon'));
			    var icon = createIcon(vehicle.get('status'), vehicle.get('type'));
			    var title = vehicle.get('name');
			    var status = vehicle.get('status');
			    var dispatch = "None";
			    var vehicleId = vehicle.id;
			    if(vehicle.get('currentDispatch') != undefined){
				dispatch = vehicle.get('currentDispatch').id;
			    }
			    var marker = {
				latitude: latitude,
				longitude: longitude,
				icon : icon,
				title: title,
				status: status,
				dispatch: dispatch,
				vehicleId: vehicleId,
				animation: google.maps.Animation.DROP
			    };
			    markers.push(marker);
			});
			callback(markers);
		    },
		    error: function(error){
			alert("Error: " + error.message);
		    }
		});

	    },


	};
	return ParseService;
    });

function createIcon(status, type){
    var url;
    var size;
    if(type == "wheelchair"){
	switch(status){
	case "available":
	    url = '/app/images/wheelchairGreen.svg';
	    break;
	case "en route":
	    url = '/app/images/wheelchairGreen.svg';
	    break;
	case "unavailable":
	    url = '/app/images/wheelchairRed.svg';
	    break;
	case "waiting":
	    url = '/app/images/wheelchairYellow.svg';
	    break;
	}
    }else {
	switch(status){
	case "available":
	    url = '/app/images/ambulanceGreen.svg';
	    break;
	case "en route":
	    url = '/app/images/ambulanceYellow.svg';
	    break;
	case "unavailable":
	    url = '/app/images/ambulanceRed.svg';
	    break;
	case "waiting":
	    url = '/app/images/ambulanceYellow.svg';
	    break;
	}
    }
    var icon = {
	url : url,
    };
    return icon;
}
