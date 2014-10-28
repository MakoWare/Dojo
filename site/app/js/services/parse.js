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
	var Facility = Parse.Object.extend("Facility");
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
            getParentSection: function(){
                console.log(this.parentSection);
                return this.parentSection;
            },

            setParentSection: function(section){
                this.parentSection = section;
                console.log(this.parentSection);
            },

            //Nemsis Object Helpers
            //NemsisElement
            createNemsisElement: function(elementNumber, callback){
                var agencyId = Parse.User.current().get("agencyId");
                var userId = Parse.User.current().id;

                //First Get the Header
                var query = new Parse.Query(NemsisHeader);
                console.log("elementnumber " + elementNumber);
                query.equalTo("ElementNumber", elementNumber);
                var promise = query.first({
                    success: function(result){
                        ObjectHelper.createNemsisElement(agencyId, userId, elementNumber, result, function(results){
                            callback(results);
                        });
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


            //Parse Object Helpers
            //Create

            //Agency
            createAgency: function(name, callback){
                var userId = Parse.User.current().id;
                ObjectHelper.createAgency(name, userId, function(results){
                    callback(results);
                });
            },


            //Create Object
            createObject: function(objectType, callback){
                var currentUser = Parse.User.current();
                ObjectHelper.createObject(objectType, currentUser.get('agencyId'), currentUser.id, callback);
            },

            //Get Object By Id
            getObjectById: function(objectType, objectId, callback){
                switch (objectType){
                case "Vehicle":
                    ParseService.getVehicleById(objectId, callback);
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
                }
            },

            getVehicleById: function(objectId, callback){
                var query = new Parse.Query(Vehicle);
                query.include("dVehicleGroup.sections.elements");
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
                query.get(objectId,{
                    success: function(result){
                        callback(result);
                    },
                    error: function(object, error){
                        callback(error);
                    }
                });
            },


            //Delete Object
            deleteObject: function(object, objectType, callback){
                ObjectHelper.deleteObject(objectType, object, callback);
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
                case "Patient":
                    ParseService.findPatientsByAgency(callback);
                    break;
                case "Facility":
                    ParseService.findFacilitiesByAgency(callback);
                    break;
                }
            },

            //Find Vehicles by AgencyId
            findVehiclesByAgency: function(callback){
                var query = new Parse.Query(Vehicle);
                query.equalTo("agencyId", Parse.User.current().get("agencyId"));
                query.include("currentDispatch");
                query.include("installation");
                query.find({
                    success: function(results){
                        callback(results);
                    },
                    error: function(error){
                        alert(ERRORMESSAGE + error.message);
                    }
                });
            },

            //Find Vehicles by AgencyId
            findPatientsByAgency: function(callback){
                var query = new Parse.Query(Patient);
                query.equalTo("agencyId", Parse.User.current().get("agencyId"));
                query.include("currentDispatch");
                query.include("ePatient");
                query.include("ePatient.sections.elements");
                query.include("ePatient.nemsisSection.sections");
                query.find({
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
                query.find({
                    success: function(results){
                        callback(results);
                    },
                    error: function(error){
                        alert(ERRORMESSAGE + error.message);
                    }
                });
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

            getCurrentUser: function(){
                return Parse.User.current();
            },

            //MAP
            getMarkers : function(callback){
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
			    var icon = ParseService.createIcon(vehicle.get('status'), vehicle.get('type'));
			    var title = vehicle.get('name');
			    var status = vehicle.get('status');
			    var dispatchId = "None";
			    var vehicleId = vehicle.id;
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
                                idKey: vehicleId,
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
