//Parse Service
angular.module('parseService', [])
    .factory('ParseService', function(){

        //Init Parse
	Parse.initialize("8vNcAs6Z0c4jyHvuW5zezUXij8DquZLeYP4pFicD", "Ipw8skfNMGvX9uGc8LHn0qCbAIhWjrZP5LEHm9vI");
        //Init ObjectHelper
        ObjectHelper.init();

	//Define Parse Objects
	var Agency = Parse.Object.extend("Agency");
	var User = Parse.Object.extend("User");
	var Person = Parse.Object.extend("Person");
	var Role = Parse.Object.extend("Role");
	var PCR = Parse.Object.extend("PCR");
	var AgencyFile = Parse.Object.extend("AgencyFile");
	var Section = Parse.Object.extend("Section");
	var NemsisSection = Parse.Object.extend("NemsisSection");
	var Dispatch = Parse.Object.extend("Dispatch");
	var Facility = Parse.Object.extend("Facility");
	var File = Parse.Object.extend("File");
	var Patient = Parse.Object.extend("Patient");
	var Personnel = Parse.Object.extend("Personnel");
	var Vehicle = Parse.Object.extend("Vehicle");
	var Installation = Parse.Object.extend("Installation");
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

        var parentSection = null;

        var ParseService = {
            //Login
            login: function(username, password, callback) {
		Parse.User.logIn(username, password, {
		    success: function(user) {
			callback(user);
		    },
		    error: function(user, error) {
                        callback(error);
		    }
		});
	    },

            //Logout
            logout: function(callback){
                Parse.User.logOut();
            },

            getCurrentUser: function(){
                return Parse.User.current();
            },

            //Nemsis Object Helpers
            //NemsisElement
            createNemsisElement: function(elementNumber, callback){
                var agencyId = Parse.User.current().get("agencyId");
                var userId = Parse.User.current().id;

                //First Get the Header
                var query = new Parse.Query(NemsisHeader);
                query.equalTo("ElementNumber", elementNumber);
                var promise = query.first({
                    success: function(header){
                        ObjectHelper.createNemsisElement(agencyId, elementNumber, header, callback);
                    },
                    error: function(error){
                        console.log(error);
                        callback(error);
                    }
                });

                return promise;
            },

            //Section
            createSection: function(name, callback){
                var agencyId = Parse.User.current().get("agencyId");
                var userId = Parse.User.current().id;

                ObjectHelper.createSection(agencyId, name, function(results){
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
                    error: function(object, error){
                        alert(ERRORMESSAGE + error.message);
                    }
                });
            },

            //Section
            getSection: function(objectId, callback){
                var query = new Parse.Query("Section");
                query.include("sections");
                query.include("sections.nemsisSection.headers");
                query.include("elements");
                query.include("elements.header");
                query.include("nemsisSection");
                query.include("nemsisSection.sections");
                query.include("nemsisSection.headers");
                query.get(objectId, {
                    success: function(results){
                        callback(results);
                    },
                    error: function(error){
                        callback(error);
                    }
                });
            },

            getSectionByName: function(sectionName, callback){
                var query = new Parse.Query("Section");
                query.equalTo("name", sectionName);
                query.equalTo("agencyId", Parse.User.current().get('agencyId'));
                query.include('sections');
                query.include("nemsisSection");
                query.include("nemsisSection.headers");
                query.include("nemsisSection.sections");
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


            //Get NemsisElementCodes
            getNemsisElementCodes: function(elementNumbers, callback){
                var query = new Parse.Query(NemsisElementCode);
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


            //Get NemsisSection
            getNemsisSelction: function(name, callback){
                var query = new Parse.Query("NemsisSection");
                query.containedIn("name", name);
                query.find({
                    success: function(results){
                        callback(results);
                    },
                    error: function(error){
                        callback(error);
                    }
                });
            },


            //Has sibling
            hasSiblingSection: function(section, callback){
                var query = new Parse.Query(Section);
                query.equalTo('name', section.get('name'));
                query.equalTo('agencyId', section.get('agencyId'));
                query.count({
                    success: function(number){
                        if(number > 1){
                            callback(true);
                        } else {
                            callback(false);
                        }
                    },
                    error: function(error){
                        alert(ERRORMESSAGE + error.message);
                    }
                });
            },


            //Create Agency
            createAgency: function(name, callback){
                /*
                var userId = Parse.User.current().id;
                ObjectHelper.createAgency(name, userId, function(results){
                    callback(results);
                });
                 */
            },

            //Create Object
            createObject: function(objectType){
                return ObjectHelper.createObject(objectType);
            },


            //Get Ipad Configuration
            getIpadConfig: function(callback){
                var query = new Parse.Query(IpadConfiguration);
                query.equalTo("agencyId", Parse.User.current().get('agencyId'));
                query.first({
                    success: function(result){
                        callback(result);
                    },
                    error: function(error){
                        callback(error);
                    }
                });
            },

            //Get All States
            getAllStates: function(callback){
                var query = new Parse.Query("AllStates");
                query.find({
                    success: function(results){
                        callback(results);
                    },
                    error: function(error){
                        callback(error);
                    }
                });
            },


            //Get All NemsisHeaders
            getAllNemsisHeaders: function(callback){
                var query = new Parse.Query(NemsisHeader);
                query.limit(1000);
                query.equalTo("DatasetName", "EMSDataSet");
                query.ascending("ElementNumber");
                query.find({
                    success: function(results){
                        callback(results);
                    },
                    error: function(error){
                        callback(error);
                    }
                });
            },

            //Get Object By Id
            getObjectById: function(objectType, objectId, callback){
                switch (objectType){
                case "Vehicle":
                    ParseService.getVehicleById(objectId, callback);
                    break;
                case "Contact" :
                    ParseService.getContactById(objectId, callback);
                    break;
                case "Dispatch" :
                    ParseService.getDispatchById(objectId, callback);
                    break;
                case "Patient":
                    ParseService.getPatientById(objectId, callback);
                    break;
                case "Facility":
                    ParseService.getFacilityById(objectId, callback);
                    break;
                case "File":
                    ParseService.getFileById(objectId, callback);
                    break;
                case "User":
                    ParseService.getUserById(objectId, callback);
                    break;
                case "PCR":
                    ParseService.getPCRById(objectId, callback);
                    break;
                }
            },

            getVehicleById: function(objectId, callback){
                var query = new Parse.Query(Vehicle);
                query.include("dVehicle.elements");
                query.include("dVehicle.sections.elements");
                query.get(objectId,{
                    success: function(result){
                        callback(result);
                    },
                    error: function(object, error){
                        callback(error);
                    }
                });
            },

            getContactById: function(objectId, callback){
                var query = new Parse.Query(Person);
                query.include("type");
                query.get(objectId,{
                    success: function(result){
                        callback(result);
                    },
                    error: function(object, error){
                        callback(error);
                    }
                });
            },


            getPatientById: function(objectId, callback){
                var query = new Parse.Query(Patient);
                query.include("ePatient.sections.elements");
                query.include("ePatient.elements");
                query.get(objectId,{
                    success: function(result){
                        callback(result);
                    },
                    error: function(error){
                        callback(error);
                    }
                });
            },

            getDispatchById: function(objectId, callback){
                var query = new Parse.Query(Dispatch);
                query.include("patient");
                query.include("vehicle");
                query.include("priority");
                query.include("emd");
                query.include("complaint");
                query.include("eDispatch.elements");
                query.include("eTimes.elements");
                query.include("pickUpFacility");
                query.include("dropOffFacility");

                query.get(objectId,{
                    success: function(result){
                        callback(result);
                    },
                    error: function(object, error){
                        callback(error);
                    }
                });
            },

            getFacilityById: function(objectId, callback){
                var query = new Parse.Query(Facility);
                query.include("type");
                query.get(objectId,{
                    success: function(result){
                        callback(result);
                    },
                    error: function(object, error){
                        callback(error);
                    }
                });
            },

            getFileById: function(objectId, callback){
                var query = new Parse.Query(File);
                query.get(objectId,{
                    success: function(result){
                        callback(result);
                    },
                    error: function(object, error){
                        callback(error);
                    }
                });
            },

            getUserById: function(objectId, callback){
                var query = new Parse.Query(User);
                query.include("dPersonnel.elements");
                query.include("dPersonnel.sections.elements");
                query.get(objectId,{
                    success: function(result){
                        callback(result);
                    },
                    error: function(object, error){
                        callback(error);
                    }
                });
            },

            getPCRById: function(objectId, callback){
                var query = new Parse.Query(PCR);
                query.include("demDataSet");
                query.include("emsDataSet");
                query.get(objectId,{
                    success: function(result){
                        callback(result);
                    },
                    error: function(object, error){
                        callback(error);
                    }
                });
            },


            //Get a User's Role
            getRole: function(user, callback){
                var query = new Parse.Query(Parse.Role);
                query.equalTo("users", user);
                query.first({
                    success: function(result){
                        callback(result);
                    },
                    error: function(object, error){
                        callback(false);
                    }
                });
            },


            //Has Role
            hasRole: function(roleName, callback){
                var query = (new Parse.Query(Parse.Role));
                query.equalTo("name", roleName);
                query.equalTo("users", Parse.User.current());
                query.first().then(function(adminRole) {
                    if (adminRole) {
                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            },

            //Change Role
            changeRole: function(user, newRole, callback){
                //First Find all Roles the User currently Has
                var query = new Parse.Query(Parse.Role);
                query.equalTo("users", user);
                query.find({
                    success: function(results){
                        if(results){
                            var promises = [];
                            results.forEach(function(role){
                                role.getUsers().remove(user);
                                promises.push(role.save());
                            });
                            Parse.Promise.when(promises).then(function(){
                                if(newRole != "None"){
                                    ParseService.addRole(newRole, user, callback);
                                } else {
                                    callback();
                                }
                            });
                        }
                    },
                    error: function(error){
                        callback(error);
                    }
                });
            },

            //Add a User to a Role
            addRole: function(roleName, user, callback){
                var query = new Parse.Query(Parse.Role);
                query.equalTo("name", roleName);
                query.first({
                    success: function(result){
                        result.getUsers().add(user);
                        result.save({
                            success: function(result){
                                callback(result);
                            },
                            error: function(object, error){
                                callback(error);
                            }
                        });
                    },
                    error: function(object, error){
                        callback(false);
                    }
                });
            },


            //Create Empty Section
            createEmptySection: function(name, callback){
                callback(ObjectHelper.createEmptySection(name));
            },

            //Create Empty NemsisElement
            createEmptyNemsisElement: function(name, callback){
                ObjectHelper.createEmptyNemsisElement(name, callback);
            },



            //ConstructNemsisSection
            constructNemsisSection: function(name, callback){
                var query = new Parse.Query("NemsisSection");
                query.equalTo("name", name);
                query.include("headers");
                query.first({
                    success: function(result){
                        var nemsisSection = result;
                        var elementNames = [];
                        result.attributes.headers.forEach(function(header){
                            elementNames.push(header.attributes.ElementNumber);
                        });
                        var query = new Parse.Query("NemsisElementCode");
                        query.containedIn("elementNumber", elementNames);
                        query.find({
                            success: function(results){
                                nemsisSection.attributes.headers.forEach(function(header){
                                    header.attributes.codes = [];
                                    results.forEach(function(code){
                                        if(code.attributes.elementNumber == header.attributes.ElementNumber){
                                            header.attributes.codes.push(code);
                                        }
                                    });
                                });
                                callback(nemsisSection);
                            },
                            error: function(error){
                                callback(error);
                            }
                        });
                    },
                    error: function(error){
                        callback(error);
                    }
                });
            },


            //Update User
            saveUser: function(userId, username, firstName, lastName, phone, email, active, licensureLevel, licenseId, callback){
                Parse.Cloud.run('modifyUser', { id: userId, username: username, firstName: firstName, lastName: lastName, phone: phone, email: email, active: active, licensureLevel: licensureLevel, licenseId: licenseId}, {
                    success: function(result) {
                        callback(result);
                    },
                    error: function(error) {
                        callback(error);
                    }
                });
            },

            /** Save Object **/
            saveObject: function(objectType, object, callback){
                return ObjectHelper.saveObject(objectType, object, callback);
            },


            //Delete Object
            deleteObject: function(object, objectType, callback){
                return ObjectHelper.deleteObject(objectType, object, callback);
            },



            deleteSection: function(section, callback){
                ObjectHelper.deleteSection(section, callback);
            },

            //Find Objects
            findObjectsByAgency: function(objectType, callback){
                switch (objectType){
                case "Vehicle":
                    ParseService.findVehiclesByAgency(callback);
                    break;
                case "Dispatch" :
                    ParseService.findDispatchesByAgency(callback);
                    break;
                case "Contact" :
                    ParseService.findContactsByAgency(callback);
                    break;
                case "Patient":
                    ParseService.findPatientsByAgency(callback);
                    break;
                case "Facility":
                    ParseService.findFacilitiesByAgency(callback);
                    break;
                case "File":
                    ParseService.findFilesByAgency(callback);
                    break;
                case "PCR":
                    ParseService.findPCRsByAgency(callback);
                    break;
                case "User":
                    ParseService.findUsersByAgency(callback);
                    break;
                }
            },

            //Find Vehicles by AgencyId
            findVehiclesByAgency: function(callback){
                var query = new Parse.Query(Vehicle);
                query.equalTo("agencyId", Parse.User.current().get("agencyId"));
                query.include("currentDispatch");
                query.include("installation");
                query.include("crew");
                query.find({
                    success: function(results){
                        callback(results);
                    },
                    error: function(error){
                        alert(ERRORMESSAGE + error.message);
                    }
                });
            },

            //Find Patients by AgencyId
            findPatientsByAgency: function(callback){
                var query = new Parse.Query(Patient);
                query.equalTo("agencyId", Parse.User.current().get("agencyId"));
                query.include("currentDispatch");
                query.include("ePatient");
                query.include("ePatient.sections.elements");
                query.include("ePatient.nemsisSection.sections");
                return query.find({
                    success: function(results){
                        callback(results);
                    },
                    error: function(error){
                        alert(ERRORMESSAGE + error.message);
                    }
                });
            },

            //Find Facilities by AgencyId
            findFacilitiesByAgency: function(callback){
                var query = new Parse.Query(Facility);
                query.equalTo("agencyId", Parse.User.current().get("agencyId"));
                query.include("type");
                query.find({
                    success: function(results){
                        callback(results);
                    },
                    error: function(error){
                        alert(ERRORMESSAGE + error.message);
                    }
                });
            },

            //Find Dispatches by AgencyId
            findDispatchesByAgency: function(callback){
                var query = new Parse.Query(Dispatch);
                query.equalTo("agencyId", Parse.User.current().get("agencyId"));
                query.include("vehicle");
                query.include("patient");
                query.include("priority");
                query.include("emd");
                query.include("complaint");
                query.include("pickUpFacility");
                query.include("dropOffFacility");
                query.find({
                    success: function(results){
                        callback(results);
                    },
                    error: function(error){
                        alert(ERRORMESSAGE + error.message);
                    }
                });
            },

            //Find Files by AgencyId
            findFilesByAgency: function(callback){
                var query = new Parse.Query(File);
                query.equalTo("agencyId", Parse.User.current().get("agencyId"));
                query.find({
                    success: function(results){
                        callback(results);
                    },
                    error: function(error){
                        alert(ERRORMESSAGE + error.message);
                    }
                });
            },

            //Find PCRs by AgencyId
            findPCRsByAgency: function(callback){
                var query = new Parse.Query(PCR);
                query.equalTo("agencyId", Parse.User.current().get("agencyId"));
                //query.include("user");
                query.include("device");
                query.find({
                    success: function(results){
                        callback(results);
                    },
                    error: function(error){
                        alert(ERRORMESSAGE + error.message);
                    }
                });
            },

            //Find Contacts by Agency
            findContactsByAgency: function(callback){
                var query = new Parse.Query(Person);
                query.equalTo("agencyId", Parse.User.current().get("agencyId"));
                query.equalTo("effectiveTo", null);
                query.equalTo("classType", "contact");
                query.include("type");
                query.find({
                    success: function(results){
                        callback(results);
                    },
                    error: function(error){
                        alert(ERRORMESSAGE + error.message);
                    }
                });
            },

            //Find Users by AgencyId
            findUsersByAgency: function(callback){
                var query = new Parse.Query(User);
                query.equalTo("agencyId", Parse.User.current().get("agencyId"));
                query.find({
                    success: function(results){
                        callback(results);
                    },
                    error: function(error){
                        alert(ERRORMESSAGE + error.message);
                    }
                });
            },

            //Patients TypeAhead
            patientsTypeAhead: function(searchParam, callback){
                var firstName = searchParam.split(" ")[0];
                var lastName  = searchParam.split(" ")[1];
                var ssn  = searchParam.split(" ")[2];

                var upperQuery = new Parse.Query(Patient);
	        var lowerQuery = new Parse.Query(Patient);
	        lowerQuery.startsWith('firstName', firstName);
	        upperQuery.startsWith('firstName', (firstName.charAt(0).toUpperCase() + firstName.slice(1)));

                if(lastName){
	            lowerQuery.startsWith('lastName', lastName);
	            upperQuery.startsWith('lastName', (lastName.charAt(0).toUpperCase() + lastName.slice(1)));
                }

	        var query = Parse.Query.or(lowerQuery, upperQuery);

                if(ssn){
                    query.startsWith('ssn', ssn);
                }


	        query.equalTo("agencyId", Parse.User.current().get("agencyId"));
                query.include("currentDispatch");
                query.include("ePatient");
                query.include("ePatient.sections.elements");
                query.include("ePatient.nemsisSection.sections");
                query.limit(1000);
                return query.find({
                    success: function(results){
                        callback(results);
                    },
                    error: function(error){
                        alert(ERRORMESSAGE + error.message);
                    }
                });
            },

            //Facilites TypeAhead
            facilitiesTypeAhead: function(searchParam, callback){
                var upperQuery = new Parse.Query(Facility);
	        var lowerQuery = new Parse.Query(Facility);
	        lowerQuery.startsWith('name', searchParam);
	        upperQuery.startsWith('name', (searchParam.charAt(0).toUpperCase() + searchParam.slice(1)));

	        var query = Parse.Query.or(lowerQuery, upperQuery);
	        query.equalTo("agencyId", Parse.User.current().get("agencyId"));
                query.include("dFacility");
                query.limit(1000);
                return query.find({
                    success: function(results){
                        callback(results);
                    },
                    error: function(error){
                        alert(ERRORMESSAGE + error.message);
                    }
                });
            },

            //Get NemsisElementCodes
            findNemsisElementCodes: function(sectionName, callback){
                var query = new Parse.Query(NemsisElementCode);
                query.startsWith("elementNumber", sectionName);
                return query.find({
                    success: function(results){
                        callback(results);
                    },
                    error: function(error){
                        alert(ERRORMESSAGE + error.message);
                    }
                });
            },

            //MAP
            getMarkers : function(callback){
		currentUser = Parse.User.current();
		var query = new Parse.Query(Vehicle);
		query.equalTo('agencyId', currentUser.get('agencyId'));
		query.equalTo('active', true);
		query.include('currentDispatch');
		query.include('crew');
		query.find({
		    success: function(vehicles){
			var markers = [];
			vehicles.forEach(function(vehicle){
			    var latitude = parseFloat(vehicle.get('lat'));
			    var longitude = parseFloat(vehicle.get('lon'));
			    var icon = ParseService.createIcon(vehicle.get('status'), vehicle.get('type'));
			    var title = vehicle.get('name');
			    var status = vehicle.get('status');
			    var dispatchId = "None";
			    var vehicleId = vehicle.id;
                            var crew = vehicle.get('crew');
			    if(vehicle.get('currentDispatch') != undefined){
				dispatchId = vehicle.get('currentDispatch').id;
			    }
			    var marker = {
				latitude: latitude,
				longitude: longitude,
				icon : icon,
				title: title,
				status: status,
				dispatchId: dispatchId,
				vehicleId: vehicleId,
                                crew: crew,
                                idKey: vehicleId,
				animation: google.maps.Animation.DROP
			    };
                            console.log(marker);
			    markers.push(marker);
			});
			callback(markers);
		    },
		    error: function(error){
			alert("Error: " + error.message);
		    }
		});
	    },

            createIcon: function(status, type){
                var url;
                var size;
                if(type == "wheelchair"){
	            switch(status){
	            case "available":
	                url = 'images/wheelchairGreen.svg';
	                break;
	            case "en route":
	                url = 'images/wheelchairGreen.svg';
	                break;
	            case "unavailable":
	                url = 'images/wheelchairRed.svg';
	                break;
	            case "waiting":
	                url = 'images/wheelchairYellow.svg';
	                break;
	            }
                }else {
	            switch(status){
	            case "available":
	                url = 'images/ambulanceGreen.svg';
	                break;
	            case "en route":
	                url = 'images/ambulanceYellow.svg';
	                break;
	            case "unavailable":
	                url = 'images/ambulanceRed.svg';
	                break;
	            case "waiting":
	                url = 'images/ambulanceYellow.svg';
	                break;
	            }
                }
                var icon = {
	            url : url,
                };
                return icon;
            }
        };
        return ParseService;
    });
