//This *should go in cloud code

//Utility Class for Objects
var ObjectHelper = {

    //Declare Parse Objects Here
    Agency: Parse.Object.extend("Agency"),
    User: Parse.Object.extend("User"),
    Section: Parse.Object.extend("Section"),
    NemsisSection: Parse.Object.extend("NemsisSection"),
    Dispatch: Parse.Object.extend("Dispatch"),
    Patient: Parse.Object.extend("Patient"),
    Personnel: Parse.Object.extend("Personnel"),
    Vehicle: Parse.Object.extend("Vehicle"),
    Section: Parse.Object.extend("Section"),
    NemsisElement: Parse.Object.extend("NemsisElement"),
    NemsisElementCode: Parse.Object.extend("NemsisElementCode"),
    NemsisHeader: Parse.Object.extend("NemsisHeader"),

    //***Generics***//
    //Create Object
    createObject: function(objectType, agencyId, userId, callback){
        switch (objectType) {
        case "Device":
            this.createDevice(agencyId, userId, callback);
            break;
        case "Dispatch":
            this.createDispatch(agencyId, userId, callback);
            break;
        case "Facility":
            this.createFacility(agencyId, userId, callback);
            break;
        case "Patient":
            this.createPatient(agencyId, userId, callback);
            break;
        case "User":
            this.createUser(agencyId, userId, callback);
            break;
        case "Vehicle":
            this.createVehicle(agencyId, userId, callback);
            break;
        }
    },

    //Save Object
    saveObject: function(object, callback){
        switch (object.type) {      //This is wrong
        case "Device":
            this.saveDevice(object);
            break;
        case "Dispatch":
            this.saveDispatch(object);
            break;
        case "Facility":
            this.saveFacility(object);
            break;
        case "Patient":
            this.savePatient(object);
            break;
        case "User":
            this.saveUser(object);
            break;
        case "Vehicle":
            this.saveVehicle(object);
            break;
        }
    },

    //Find Objects
    findObjects: function(objectType, query, callback){
        query.find({
            success: function(results){
                callback(results);
            },
            error: function(error){
                callback(error);
            }
        });
    },


    //***Concrete***//
    //**Create**//

    //Device
    createDevice: function(agencyId, userId, callback){
        var device = new Device();
        device.set("agencyId", agencyId);
        device.set("createdBy", userId);

        var promise = this.createSection(agencyId, userId, "dDevice", true, function(results){

        });

        promise.then(function(results){
            device.set("section", results);
            callback(device);
        });
    },

    //Dispatch
    createDispatch: function(agencyId, userId, callback){
        var dispatch = new Dispatch();
        dispatch.set("agencyId", agencyId);
        dispatch.set("createdBy", userId);

        var promise = this.createSection(agencyId, userId, "eDispatch", true, function(results){

        });

        promise.then(function(results){
            dispatch.set("section", results);
            callback(dispatch);
        });

    },

    //Facility
    createFacility: function(agencyId, userId, callback){
        var facility = new Facility();
        facility.set("agencyId", agencyId);
        facility.set("createdBy", userId);

    },

    //Patient
    createPatient: function(agencyId, userId, callback){
        var patient = new Patient();
        patient.set("agencyId", agencyId);
        patient.set("createdBy", userId);

    },

    //User
    createUser: function(agencyId, userId, callback){ //This is not like the others
        var user = new User();
        user.set("agencyId", agencyId);
        user.set("createdBy", userId);

        var promise = this.createSection(agencyId, userId, "dPersonnel", true, function(results){

        });

        promise.then(function(results){
            user.set("section", results);
            callback(user);
        });
    },

    //Vehicle
    createVehicle: function(agencyId, userId, callback){
        var vehicle = new Vehicle();
        vehicle.set("agencyId", agencyId);
        vehicle.set("createdBy", userId);

        var promise = this.createSection(agencyId, userId, "dVehicle", true, function(results){

        });

        promise.then(function(results){
            vehicle.set("section", results);
            callback(vehicle);
        });
    },

    //Nemsis Objects
    //Create Section   ***Fix - Needs to Look at NemsisSection to see if subsections are mandatory
    createSection: function(agencyId, userId, sectionName, callback){
        var section = new this.Section();
        section.set("agencyId", agencyId);
        section.set("createdBy", userId);
        section.set("name", sectionName);
        section.set("pcrId", "");
        section.set("elements", []);
        section.set("sections", []);

        //Get NemsisSection
        var query = new Parse.Query("NemsisSection");
        query.equalTo("name", sectionName);
        query.include("headers");
        query.include("sections");
        var promise = query.first({
            success: function(results){
                return results;
            },
            error: function(error){
                console.log(error);
            }
        }).then(function(results){
            section.set("nemsisSection", results);

            //create NemsisElements for each of the headers
            var elementHeaders =  results.get('headers') || [];

            var nemsisElements = [];
            var promises = [];
            elementHeaders.forEach(function(elementHeader){
                var promise = ObjectHelper.createNemsisElement(agencyId, userId, elementHeader.get('ElementNumber'), elementHeader, function(results){
                    //nemsisElements.push(results);
                    section.add('elements', results);
                });
                promises.push(promise);
            });

            Parse.Promise.when(promises).then(function(results){
                //section.set('elements', nemsisElements);

                //Check if sub Sections are required
                var requiredSubSectionNames = [];
                section.get('nemsisSection').get('sections').forEach(function(section){
                    if(section.get('minOccurence' === 1)){
                        requiredSubSectionNames.push(section.get('name'));
                    }
                });

                //Create required sub Sections Recursively
                var promises = [];
                requiredSubSectionNames.forEach(function(sectionName){
                    var promise = ObjectHelper.createSection(agencyId, userId, sectionName, function(result){
                        section.add('sections', result);
                    });
                    promises.push(promise);
                });

                Parse.Promise.when(promises).then(function(){
                    callback(section);
                });
            });
        });
    },

    //Create NemsisElement
    createNemsisElement: function(agencyId, userId, elementNumber, header, callback){
        var element = new this.NemsisElement();
        element.set("agencyId", agencyId);
        element.set("createdBy", userId);
        element.set("title", elementNumber);
        element.set("pcrId", "");
        element.set("value", "");

        //All elements are going to have references to their NemsisHeaders
        if(header){
            element.set('header', header);
            callback(element);
        } else {
            var query = new Parse.Query("NemsisHeader");
            query.equalTo("ElementNumber", elementNumber);
            query.first({
                success: function(result){
                    element.set(header, result);
                    callback(element);
                },
                error: function(error){
                    console.log(error);
                    callback(error);
                }
            });
        }
    },

    //Create Agency ***Wow, look how much code this is, fucking awesome, and easy to extend
    createAgency: function(userId, callback){
        var agency = new Agency();
        agency.set("createdBy", userId);

        //Save the new agency to give it an id
        agency.save({
            success: function(agency){
                var sectionNames = ["dAgency", "dConfiguration", "dContact", "dCustomConfiguration", "dCustomResults", "dDevice", "dFacility", "dLocation", "dPersonnel", "dState", "dVehicle"];

                var promises = [];
                sectionNames.forEach(function(sectionName){
                    var promise = ObjectHelper.createSection(agency.id, agency.get("createdBy"), sectionName, function(section){
                        agency.set('sectionName', section);
                    });
                    promises.push(promise);
                });

                Parse.Promise.when(promises).then(function(){
                    callback(agency);
                });
            },
            error: function(object, error){
                callback(error);
            }
        });
    },

    //Save
    saveDevice: function(device){

    },

    saveDispatch: function(dispatch){

    },

    saveFacility: function(facility){

    },

    savePatient: function(user){

    },

    saveUser: function(user){ //This is not like the others

    },

    saveVehicle: function(vehicle){

    }

};
