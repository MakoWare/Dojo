//This may go in cloud code

//Utility Class for Objects
var ObjectHelper = {

    //Generics
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


    //Concrete
    //Create
    createDevice: function(agencyId, userId, callback){
        var device = Parse.Object.extend("Device");
        device.set("agencyId", agencyId);
        device.set("createdBy", userId);

    },

    createDispatch: function(agencyId, userId, callback){
        var dispatch = Parse.Object.extend("Dispatch");
        dispatch.set("agencyId", agencyId);
        dispatch.set("createdBy", userId);

    },

    createFacility: function(agencyId, userId, callback){
        var facility = Parse.Object.extend("Facility");
        facility.set("agencyId", agencyId);
        facility.set("createdBy", userId);


    },

    createPatient: function(agencyId, userId, callback){
        var patient = Parse.Object.extend("Patient");
        patient.set("agencyId", agencyId);
        patient.set("createdBy", userId);

    },

    createUser: function(agencyId, userId, callback){ //This is not like the others
        var user = Parse.Object.extend("User");
        user.set("agencyId", agencyId);
        user.set("createdBy", userId);
    },

    createVehicle: function(agencyId, userId, callback){
        var vehicle = Parse.Object.extend("Vehicle");
        vehicle.set("agencyId", agencyId);
        vehicle.set("createdBy", userId);

    }

};
