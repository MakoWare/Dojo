//This may go in cloud code

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
    NemsisElement: Parse.Object.extend("NemsisElement"),
    NemsisElementCode: Parse.Object.extend("NemsisElementCode"),
    NemsisHeader: Parse.Object.extend("NemsisHeader"),

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

    createFacility: function(agencyId, userId, callback){
        var facility = new Facility();
        facility.set("agencyId", agencyId);
        facility.set("createdBy", userId);


    },

    createPatient: function(agencyId, userId, callback){
        var patient = new Patient();
        patient.set("agencyId", agencyId);
        patient.set("createdBy", userId);

    },

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

    },

    //Nemsis Objects

    //Create Section
    createSection: function(agencyId, userId, sectionName, recursive, callback){
        var section1 = new Section();
        section1.set("agencyId", agencyId);
        section1.set("createdBy", userId);
        section1.set("name", sectionName);
        section1.set("pcrId", "");
        section1.set("elements", []);
        section1.set("sections", []);

        //Get NemsisSection
        var query = new Parse.Query("NemsisSection");
        query.equalTo("name", sectionName);
        query.include("headers");
        query.include("sections.headers");
        query.include("sections.sections.headers");
        var promise1 = query.first({
            success: function(results){
                console.log(results);

            },
            error: function(error){
                console.log(error);
            }
        });

    },

    //Create NemsisElement
    createNemsisElement: function(agencyId, userId, elementNumber, callback){
        var element = new NemsisElement();
        element.set("agencyId", agencyId);
        element.set("createdBy", userId);
        element.set("elementNumber", elementNumber);
        element.set("pcrId", "");
        element.set("value", "");

        return element;
    }
};
