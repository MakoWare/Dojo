//This *should go in cloud code

//Utility Class for Objects
var ObjectHelper = {

    //Declare Parse Objects Here
    Agency: Parse.Object.extend("Agency"),
    User: Parse.Object.extend("User"),
    Contact: Parse.Object.extend("Contact"),
    Section: Parse.Object.extend("Section"),
    NemsisSection: Parse.Object.extend("NemsisSection"),
    Dispatch: Parse.Object.extend("Dispatch"),
    Patient: Parse.Object.extend("Patient"),
    Personnel: Parse.Object.extend("Personnel"),
    Vehicle: Parse.Object.extend("Vehicle"),
    Facility: Parse.Object.extend("Facility"),
    Section: Parse.Object.extend("Section"),
    File: Parse.Object.extend("File"),
    NemsisElement: Parse.Object.extend("NemsisElement"),
    NemsisElementCode: Parse.Object.extend("NemsisElementCode"),
    NemsisHeader: Parse.Object.extend("NemsisHeader"),
    IpadConfiguration: Parse.Object.extend("IpadConfiguration"),
    ThePerson: Parse.Object.extend("ThePerson"),


    //Declare ACLs for all Objects Here
    init: function(){
        ObjectHelper.DispatchACL = new Parse.ACL();
        ObjectHelper.DispatchACL.setRoleWriteAccess("EMT", true);
        ObjectHelper.DispatchACL.setRoleReadAccess("EMT", true);

        ObjectHelper.FacilityACL = new Parse.ACL();
        ObjectHelper.FacilityACL.setRoleWriteAccess("EMT", true);
        ObjectHelper.FacilityACL.setRoleReadAccess("EMT", true);

        ObjectHelper.FileACL = new Parse.ACL();
        ObjectHelper.FileACL.setRoleWriteAccess("Manager", true);
        ObjectHelper.FileACL.setRoleReadAccess("Manager", true);

        ObjectHelper.PatientACL = new Parse.ACL();
        ObjectHelper.PatientACL.setRoleWriteAccess("EMT", true);
        ObjectHelper.PatientACL.setRoleReadAccess("EMT", true);

        ObjectHelper.UserACL = new Parse.ACL();
        ObjectHelper.UserACL.setRoleWriteAccess("Manager", true);
        ObjectHelper.UserACL.setRoleReadAccess("Manager", true);

        ObjectHelper.VehicleACL = new Parse.ACL();
        ObjectHelper.VehicleACL.setRoleWriteAccess("EMT", true);
        ObjectHelper.VehicleACL.setRoleReadAccess("EMT", true);

        ObjectHelper.PCRACL = new Parse.ACL();
        ObjectHelper.PCRACL.setRoleWriteAccess("Manager", true);
        ObjectHelper.PCRACL.setRoleReadAccess("Manager", true);

        ObjectHelper.AgencyACL = new Parse.ACL();
        ObjectHelper.AgencyACL.setRoleReadAccess("Manager", true);

        ObjectHelper.SectionACL = new Parse.ACL();
        ObjectHelper.SectionACL.setRoleReadAccess("EMT", true);
        ObjectHelper.SectionACL.setRoleWriteAccess("EMT", true);

        ObjectHelper.NemsisElementACL = new Parse.ACL();
        ObjectHelper.NemsisElementACL.setRoleReadAccess("EMT", true);
        ObjectHelper.NemsisElementACL.setRoleWriteAccess("EMT", true);
    },

    //***Generics***//


    //Create Object
    createObject: function(objectType){
        switch (objectType) {
        case "Contact":
            return this.createContact();
            break;
        case "Dispatch":
            return this.createDispatch();
            break;
        case "Facility":
            return this.createFacility();
            break;
        case "File":
            return this.createFile();
            break;
        case "Patient":
            return this.createPatient();
            break;
        case "User":
            return this.createUser();
            break;
        case "Vehicle":
            return this.createVehicle();
            break;
        }
    },

    //Delete Object
    deleteObject: function(objectType, object, callback){
        switch (objectType) {
        case "Contact":
            this.deleteContact(object, callback);
            break;
        case "Device":
            this.deleteDevice(object, callback);
            break;
        case "Dispatch":
            this.deleteDispatch(object, callback);
            break;
        case "Facility":
            this.deleteFacility(object, callback);
            break;
        case "Patient":
            this.deletePatient(object, callback);
            break;
        case "User":
            this.deleteUser(object, callback);
            break;
        case "Vehicle":
            this.deleteVehicle(object, callback);
            break;
        case "File":
            this.deleteFile(object, callback);
            break;
        case "PCR":
            this.deletePCR(object, callback);
            break;
        }
    },

    //Save Object
    saveObject: function(objectType, object, callback){
        switch (objectType) {
        case "Contact":
            return this.saveContact(object, callback);
            break;
        case "Dispatch":
            return this.saveDispatch(object, callback);
            break;
        case "Facility":
            return this.saveFacility(object, callback);
            break;
        case "File":
            return this.saveFile(object, callback);
            break;
        case "Patient":
            return this.savePatient(object, callback);
            break;
        case "User":
            return this.saveUser(object, callback);
            break;
        case "Vehicle":
            return this.saveVehicle(object, callback);
            break;
        }
    },


    /***** Create *****/
    //Create Empty Section
    createEmptySection: function(name){
        var user = Parse.User.current();
        var agencyId = user.get('agencyId');
        var section = new Parse.Object("Section");
        section.set("agencyId", agencyId);
        section.set("createdBy", user);
        section.set("name", name);
        section.set("pcrId", "");
        section.set("elements", []);
        section.set("sections", []);

        var sectionACL = new Parse.ACL();
        sectionACL.setRoleReadAccess("EMT_" + agencyId, true);
        sectionACL.setRoleWriteAccess("EMT_" + agencyId, true);
        section.setACL(sectionACL);

        return section;
    },

    //Create Empty NemsisElement
    createEmptyNemsisElement: function(elementNumber){
        var user = Parse.User.current();
        var agencyId = user.get('agencyId');

        var element = new this.NemsisElement();

        element.set("agencyId", Parse.User.current().attributes.agencyId);
        element.set("createdBy", Parse.User.current());
        element.set("title", elementNumber);
        element.set("pcrId", "");
        element.set("value", "");
        element.set("codeString", "");

        var acl = new Parse.ACL();
        acl.setRoleReadAccess("EMT_" + agencyId, true);
        acl.setRoleWriteAccess("EMT_" + agencyId, true);
        element.setACL(acl);

        return element;
    },

    //Contact
    createContact: function(){
        var user = Parse.User.current();
        var agencyId = user.get('agencyId');

        var contact = new ObjectHelper.Contact();

        contact.setACL(ObjectHelper.DispatchACL);
        contact.set("agencyId", agencyId);
        contact.set("createdBy", user);
        contact.set("lastUpdatedBy", user);
        contact.set("comments", "");
        contact.set("firstName", "");
        contact.set("lastName", "");
        contact.set("middleInitial", "");
        contact.set("type", {});
        contact.set("phoneNumbers", []);
        contact.set("emails", []);
        contact.set("address", "");
        contact.set("city", "");
        contact.set("state", "");
        contact.set("zip", "");
        contact.set("country", "");
        contact.set("county", "");
        contact.set("states", []);

        var acl = new Parse.ACL();
        acl.setRoleReadAccess("EMT_" + agencyId, true);
        acl.setRoleWriteAccess("EMT_" + agencyId, true);
        contact.setACL(acl);

        return contact;
    },


    //Dispatch
    createDispatch: function(callback){
        var user = Parse.User.current();
        var agencyId = user.get('agencyId');

        var dispatch = new ObjectHelper.Dispatch();

        dispatch.setACL(ObjectHelper.DispatchACL);
        dispatch.set("agencyId", agencyId);
        dispatch.set("createdBy", user);
        dispatch.set("lastUpdatedBy", user);
        dispatch.set("comments", "");
        dispatch.set("dropOffAddress", "");
        dispatch.set("dropOffCity", "");
        dispatch.set("dropOffCountry", "");
        dispatch.set("dropOffCounty", "");
        dispatch.set("dropOffState", "");
        dispatch.set("dropOffZip", "");
        dispatch.set("pickUpAddress", "");
        dispatch.set("pickUpCity", "");
        dispatch.set("pickUpCountry", "");
        dispatch.set("pickUpCounty", "");
        dispatch.set("pickUpState", "");
        dispatch.set("pickUpZip", "");

        var acl = new Parse.ACL();
        acl.setRoleReadAccess("EMT_" + agencyId, true);
        acl.setRoleWriteAccess("EMT_" + agencyId, true);
        dispatch.setACL(acl);

        var eDispatch = ObjectHelper.createEmptySectionSection("eDispatch");
        dispatch.attributes.eDispatch = eDispatch;

        var eTimes = ObjectHelper.createEmptySection("eTimes");
        dispatch.attributes.eTimes = eTimes;

        callback(dispatch);
    },

    //Facility
    createFacility: function(callback){
        var user = Parse.User.current();
        var agencyId = user.get('agencyId');

        var facility = new ObjectHelper.Facility();

        facility.set("agencyId", agencyId);
        facility.set("createdBy", user);
        facility.set("lastUpdatedBy", user);
        facility.set("comments", "");
        facility.set("name", "");
        facility.set("address", "");
        facility.set("city", "");
        facility.set("county", "");
        facility.set("state", "");
        facility.set("zip", "");
        facility.set("type", {});
        facility.set("states", []);
        facility.set("hospitalDesignations", []);
        facility.set("locationCode", "");
        facility.set("nationalProviderIdentifier", "");

        return facility;
    },

    //Patient
    createPatient: function(callback){
        var user = Parse.User.current();
        var agencyId = user.get('agencyId');

        var patient = new ObjectHelper.Patient();

        patient.set("agencyId", agencyId);
        patient.set("createdBy", user);
        patient.set("lastUpdatedBy", user);
        patient.set("address", "");
        patient.set("age", "");
        patient.set("city", "");
        patient.set("comments", "");
        patient.set("country", "");
        patient.set("county", "");
        patient.set("email", "");
        patient.set("firstName", "");
        patient.set("lastName", "");
        patient.set("gender", "");
        patient.set("middleInitial", "");
        patient.set("phone", "");
        patient.set("race", "");
        patient.set("ssn", "");
        patient.set("state", "");
        patient.set("zip", "");
        patient.attributes.dob = "";

        var acl = new Parse.ACL();
        acl.setRoleReadAccess("EMT_" + agencyId, true);
        acl.setRoleWriteAccess("EMT_" + agencyId, true);
        patient.setACL(acl);

        var ePatient = ObjectHelper.createEmptySection("ePatient");

        var nameGroup = ObjectHelper.createEmptySection("ePatient.PatientNameGroup");
        var nameGroupRequired = ["ePatient.02", "ePatient.03"];

        nameGroupRequired.forEach(function(title){
            nameGroup.attributes.elements.push(ObjectHelper.createEmptyNemsisElement(title));
        });

        var ageGroup = ObjectHelper.createEmptySection("ePatient.PatientAgeGroup");
        var ageGroupRequired = ["ePatient.15", "ePatient.16"];

        ageGroupRequired.forEach(function(title){
            ageGroup.attributes.elements.push(ObjectHelper.createEmptyNemsisElement(title));
        });

        ePatient.attributes.sections.push(nameGroup);
        ePatient.attributes.sections.push(ageGroup);

        patient.attributes.ePatient = ePatient;
        callback(patient);
    },

    //User
    createUser: function(callback){
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        var user = new Parse.User();
        var agencyId = user.get('agencyId');

        var rando = ObjectHelper.getRandomInt(0, 100000000);

        user.set("agencyId", agencyId);
        user.set("createdBy", Parse.User.current());
        user.set("lastUpdatedBy", Parse.User.current());
        user.set("username", "user" + rando);
        user.set("password", "password");
        user.set("active", false);

        var acl = new Parse.ACL();
        acl.setPublicReadAccess(false);
        acl.setPublicWriteAccess(false);
        acl.setRoleReadAccess("EMT_" + agencyId, true);
        user.setACL(acl);

        //Create dPersonnel.PersonnelGroup Section for User
        var dPersonnel = ObjectHelper.createEmptySection("dPersonnel.PersonnelGroup");
        user.attributes.dPersonnel =  dPersonnel;

        callback(user);
    },

    //Vehicle
    createVehicle: function(callback){
        var user = Parse.User.current();
        var agencyId = user.get('agencyId');

        var vehicle = new ObjectHelper.Vehicle();

        vehicle.set("agencyId", agencyId);
        vehicle.set("createdBy", user);
        vehicle.set("lastUpdatedBy", user);
        vehicle.set("status", "");
        vehicle.set("type", "");
        vehicle.set("name", "");
        vehicle.set("crew", []);
        vehicle.set("active", false);
        vehicle.set("currentPersonnel", []);

        var acl = new Parse.ACL();
        acl.setRoleReadAccess("EMT_" + agencyId, true);
        acl.setRoleWriteAccess("EMT_" + agencyId, true);
        vehicle.setACL(acl);

        var dVehicle = ObjectHelper.createEmptySection("dVehicle.VehicleGroup");


        var vehicleGroupRequired = ["dVehicle.01", "dVehicle.02", "dVehicle.03", "dVehicle.04"];

        vehicleGroupRequired.forEach(function(title){
            dVehicle.attributes.elements.push(ObjectHelper.createEmptyNemsisElement(title));
        });


        vehicle.attributes.dVehicle = dVehicle;
        callback(vehicle);
    },

    //Create File
    createFile: function(callback){
        var user = Parse.User.current();
        var agencyId = user.get('agencyId');

        var file = new ObjectHelper.File();
        file.set("agencyId", agencyId);
        file.set("createdBy", user);
        file.setACL(ObjectHelper.FileACL);
        file.set("name", "");
        file.set("comments", "");

        callback(file);
    },


    //Create Agency **TODO
    createAgency: function(name, callback){
        var agency = new ObjectHelper.Agency();
        agency.set("createdBy", Parse.User.current());
        agency.set("lastUpdatedBy", Parse.User.current());
        agency.set("name", name);

        //Save the new agency to give it an id
        agency.save({
            success: function(agency){

                //Create Agency ACL, Read/Write to Managers
                var agencyACL = new Parse.ACL();
                agencyACL.setRoleReadAccess("Manager_" + agency.id, true);
                agencyACL.setRoleWriteAccess("Manager_" + agency.id, true);
                agency.setACL(agencyACL);

                var sectionNames = ["dAgency", "dConfiguration", "dContact", "dCustomConfiguration", "dCustomResults", "dDevice", "dFacility", "dLocation", "dPersonnel", "dState", "dVehicle"];

                var promises = [];
                sectionNames.forEach(function(sectionName){
                    var promise = ObjectHelper.createSection(agency.id, sectionName, function(section){
                        agency.set(sectionName, section);
                    });
                    promises.push(promise);
                });
                Parse.Promise.when(promises).then(function(){
                    console.log("all Sections Added to agency");
                    agency.save({
                        success: function(agency){
                            //Create the Roles for the Agency
                            ObjectHelper.initAgencyRoles(agency.id, function(results){

                                //Create the Ipad Configuration for the Agency
                                ObjectHelper.initIpadConfiguration(agency.id, function(results){
                                    agency.set("ipadConfiguration" , results);
                                    agency.save({
                                        success: function(result){
                                            callback(result);
                                        },
                                        error: function(object, error){
                                            console.log(error);
                                            callback(error);
                                        }
                                    });
                                });
                            });
                        },
                        error: function(object, error){
                            console.log(error);
                            callback(error);
                        }
                    });
                });
            },
            error: function(object, error){
                console.log(error);
                callback(error);
            }
        });
    },


    /***** Save *****/
    //Contact
    saveContact: function(contact, callback){
        //1. Set() Everything
        var now = new Date();
        contact.set("effectiveFrom", now);
        contact.set("lastUpdatedBy", Parse.User.current());

        //2a. Update the State, if we have one
        var numberOfStates = contact.attributes.states.length;
        var currentState  = contact.attributes;
        var newState      = {};
        for(var attr in currentState){
            if(attr != "states" && attr.substr(1,1) != "$"){
                newState[attr] = currentState[attr];
            }
        }

        if(numberOfStates > 0){
            contact.attributes.states[numberOfStates -1].effectiveTo = now;
            contact.attributes.states.push(newState);
        }
        //2b. If we don't create the first one
        else {
            contact.attributes.states.push(newState);
        }

        //3. Set everything
        for(var attr in contact.attributes){
            contact.set(attr, contact.attributes[attr]);
        }


        //4. Save the Contact
        return contact.save({
            success: function(contact){
                callback(contact);
            },
            error: function(contact, error){
                callback(error);
            }
        });
    },

    //Facility
    saveFacility: function(facility, callback){
        //1. Set current state
        var now = new Date();
        facility.set("effectiveFrom", now);
        facility.set("lastUpdatedBy", Parse.User.current());

        //2a. Update the State, if we have one
        var numberOfStates = facility.attributes.states.length;
        var currentState  = facility.attributes;
        var newState      = {};
        for(var attr in currentState){
            if(attr != "states" && attr.substr(1,1) != "$"){
                newState[attr] = currentState[attr];
            }
        }

        if(numberOfStates > 0){
            facility.attributes.states[numberOfStates -1].effectiveTo = now;
            facility.attributes.states.push(newState);
        }
        //2b. If we don't create the first one
        else {
            facility.attributes.states.push(newState);
        }

        //3. Set() everything
        for(var attr in facility.attributes){
            facility.set(attr, facility.attributes[attr]);
        }

        //4. Save the Facility
        return facility.save({
            success: function(facility){
                callback(facility);
            },
            error: function(contact, error){
                callback(error);
            }
        });
    },

    //Recursive Save Section - also Adds to Parent Section if needed #Not Tested
    saveSection: function(section, parentSection, callback){
        console.log("Saving Section: " + section.attributes.name);

        //1. Recursivly Save The Sub Sections
        var subSectionSavePromises = [];
        if(section.attributes.sections){
            section.attributes.sections.forEach(function(section){
                var promise = ObjectHelper.saveSection(section, "", function(result){
                    return result;
                });
                subSectionSavePromises.push(promise);
            });
        }

        //After All SubSections have been Deleted
        return Parse.Promise.when(subSectionSavePromises).then(function(results){
            //2. Save The NemsisElements in Section
            var elementSavePromises = [];
            if(section.attributes.elements){
                section.attributes.elements.forEach(function(element){
                    element.set("value", element.attributes.value);
                    element.set("code", element.attributes.code); //When We Switch to Codes
                    elementSavePromises.push(element.save);
                });
            }

            //After All of the Nemsis Elements Have Been Saved
            return Parse.Promise.when(elementSavePromises).then(function(){
                //Now Check if the Section needs to be added to a Parent Section
                if(parentSection != ""){
                    return ObjectHelper.addToParentSection(section, parentSection, function(results){
                        //Now Save The section
                        return section.save({
                            success: function(result){
                                callback(result);
                            },
                            error: function(object, error){
                                callback(error);
                            }
                        });
                    });
                } else {
                    return section.save({
                        success: function(result){
                            callback(result);
                        },
                        error: function(object, error){
                            callback(error);
                        }
                    });
                }
            });
        });
    },

    //Save Section Helper  #Not Tested
    addToParentSection: function(section, parentSection, callback){
        //Get The Parent Section
        var query = new Parse.Query("Section");
        query.equalTo("name", parentSection);
        return query.first({
            success: function(parentSection){
                if(parentSection){
                    if(parentSection.attributes.sections){
                        var inParent = false;
                        parentSection.attributes.section.forEach(function(childSection){
                            //If the Section is already in the Parent Section, don't add it
                            if(childSection.id == section.id){
                                callback("already in parent");
                            }
                        });
                        if(!inParent){
                            parentSection.add("sections", section);
                            return parentSection.save();
                        }
                    } else {
                        console.log("parentSection.attributes.sections null?");
                        callback("parentSection.attributes.sections null?");
                    }
                } else {
                    console.log("no parent found");
                    callback("no parent found");
                }
            },
            error: function(error){
                callback(error);
                return;
            }
        });
    },


    /***** Delete *****/
    //Recursive Delete Section - also Removes Section from parent  #Not Tested
    deleteSection: function(section, callback){
        //First Recursively Delete Sub Sections
        var subSectionDeletePromises = [];

        if(section.attributes.sections){
            section.attributes.sections.forEach(function(section){
                var promise = ObjectHelper.deleteSection(section, function(result){
                    return result;
                });
                subSectionDeletePromises.push(promise);
            });
        }

        //After All SubSections have been Deleted
        return Parse.Promise.when(subSectionDeletePromises).then(function(results){
            //Check if the Section has a Parent Section
            var query = new Parse.Query("Section");
            query.equalTo("sections", section);
            return query.first({
                success: function(object){
                    return object;
                },
                error: function(error){
                    callback(error);
                }
            }).then(function(parentSection){
                //If Section Had a Parent
                if(parentSection){
                    parentSection.remove("sections", section);
                    return parentSection.save({
                        success: function(parentSection){
                            return parentSection;
                        },
                        error: function(error){
                            callback(error);
                        }
                    }).then(function(result){
                        //Now Delete all of the Nemsis Elements in the Section
                        var elementPromises = [];
                        section.attributes.elements.forEach(function(element){
                            elementPromises.push(element.delete);
                        });
                        return Parse.Promise.when(elementPromises).then(function(){
                            return section.destroy({
                                success: function(result){
                                    callback(result);
                                },
                                error: function(object, error){
                                    callback(error);
                                }
                            });
                        });
                    });
                } else {  //If Section did not have a parent
                    //Now Delete all of the Nemsis Elements in the Section
                    var elementPromises = [];
                    section.attributes.elements.forEach(function(element){
                        elementPromises.push(element.delete);
                    });
                    return Parse.Promise.when(elementPromises).then(function(){
                        return section.destroy({
                            success: function(result){
                                callback(result);
                            },
                            error: function(object, error){
                                callback(error);
                            }
                        });
                    });
                }
            });
        });
    },

    //Delete Dispatch
    deleteDispatch: function(dispatch, callback){
        return dispatch.destroy({
            success: function(result){
                callback("Successfully deleted the Disptach");
            },
            error: function(object, error){
                callback(error);
            }
        });

    },

    //Delete File
    deleteFile: function(file, callback){
        return file.destroy({
            success: function(result){
                callback("Successfully deleted the File");
            },
            error: function(object, error){
                callback(error);
            }
        });
    },

    //Delete PCR
    deleteFile: function(pcr, callback){
        pcr.destroy({
            success: function(result){
                callback("Successfully deleted the PCR");
            },
            error: function(object, error){
                callback(error);
            }
        });
    },

    //Delete Facility #Not Tested
    deleteFacility: function(facility, callback){
        //1. Delete dFacility
        var dFacility = facility.attributes.dFacility;
        return ObjectHelper.deleteSection(dFacility, function(result){
            //2. Delete the Facility
            facility.destory({
                success: function(object){
                    callback("success");
                },
                error: function(object, error){
                    callback(error);
                }
            });
        });
    },

    //Delete Contact #Tested
    deleteContact: function(contact, callback){
        //Delete dContact
        var dContact = contact.attributes.dContact;
        return ObjectHelper.deleteSection(dContact, function(result){
            //Now Delete the Contact object
            contact.destroy({
                success: function(result){
                    callback("success");
                },
                error: function(object, error){
                    callback(error);
                }
            });
        });
    },


    //Delete Patient #Not Tested
    deletePatient: function(patient, callback){
        //1. Delete ePatient
        var ePatient = patient.attributes.ePatient;
        return ObjectHelper.deleteSection(ePatient, function(results){
            //2. Delete the Patient
            patient.destroy({
                success: function(result){
                    callback("success");
                },
                error: function(object, error){
                    callback(error);
                }
            });
        });
    },

    //Delete User #Not Tested
    deleteUser: function(user, callback){
        //First Remove the PersonnelGroup from dPersonnel
        var query = new Parse.Query("Section");
        query.equalTo("agencyId", Parse.User.current().get('agencyId'));
        query.equalTo("name", "dPersonnel");
        query.first({
            success: function(dPersonnel){
                dPersonnel.remove("sections", user.get('dPersonnel'));
                dPersonnel.save({
                    success: function(dPersonnel){
                        //Now Destroy the User object from CC
                        Parse.Cloud.run('deleteUser', { id: user.id}, {
                            success: function(result) {
                                callback(result);
                            },
                            error: function(error) {
                                callback(error);
                            }
                        });
                    },
                    error: function(object, error){
                        callback(error);
                    }
                });
            },
            error: function(object, error){
                callback(error);
            }
        });
    },


    //Delete Vehicle #Not Tested
    deleteVehicle: function(vehicle, callback){
        //1. Delete  dVehicleGroup
        var dVehicleGroup = vehicle.attributes.dVehicleGroup;
        return ObjectHelper.deleteSection(dVehicleGroup, function(result){
            //2. Delete the Vehicle
            return vehicle.destroy({
                success: function(result){
                    callback("success");
                },
                error: function(object, error){
                    callback(error);
                }
            });
        });
    },


    //Init Ipad Configuration
    initIpadConfiguration: function(agencyId, callback){
        //Get EMS Data Set
        var ipad = new ObjectHelper.IpadConfiguration();
        ipad.set("agencyId", agencyId);

        var acl = new Parse.ACL();
        acl.setRoleWriteAccess("EMT" + agencyId, true);
        acl.setRoleReadAccess("EMT" + agencyId, true);

        var elements = {};
        var sectionNames = ["eAirway", "eArrest", "eCrew", "eCustomConfiguration", "eCustomResults", "eDevice", "eDispatch", "eDisposition", "eExam", "eHistory", "eInjury", "eLabs", "eMedications", "eNarrative",  "eOther", "eOutcome", "ePatient", "ePayment", "eProcedures", "eProtocols", "eRecord", "eResponse", "eScene", "eSituation", "eState", "eTimes", "eVitals"];
        var query = new Parse.Query(ObjectHelper.NemsisSection);
        query.containedIn("name", sectionNames);
        query.include("headers");
        query.include("sections.headers");
        query.include("sections.sections.headers");

        query.find({
	    success: function(results){
	        //1st
	        results.forEach(function(section){
		    if(section.get('headers') != undefined){
		        section.get('headers').forEach(function(header){
			    elements = ObjectHelper.createIpadElement(header, elements);
		        });
		    }
		    //2nd
		    if(section.get('sections') != undefined){
		        section.get('sections').forEach(function(section){
			    if(section.get('headers') != undefined){
			        section.get('headers').forEach(function(header){
				    elements = ObjectHelper.createIpadElement(header, elements);
			        });
			    }
			    //3rd
			    if(section.get('sections') != undefined){
			        section.get('sections').forEach(function(section){
				    if(section.get('headers') != undefined){
				        section.get('headers').forEach(function(header){
					    elements = ObjectHelper.createIpadElement(header, elements);
				        });
				    }
				    elements = ObjectHelper.createIpadElement(section, elements);
			        });
			    }
			    elements = ObjectHelper.createIpadElement(section, elements);
		        });
		    }
	        });
	       	ipad.set('elements', elements);
                ipad.save({
                    success: function(ipad){
	                callback(ipad);
                    },
                    error: function(ipad, error){
                        console.log(error);
                        callback(error);
                    }
                });
	    },
	    error: function(error){
	        console.log(error);
	    }
        });
    },

    createIpadElement: function(object, elements){
        if(object.get('ElementNumber') != undefined){
	    var name = object.get('ElementNumber');
	    var min = object.get('MinOccurs');
        } else {
	    var name = object.get('name');
	    var min = object.get('min');
        }
        var captured = false;
        if(min == 1){
	    captured = true;
        }
        elements[name.replace('.', '_')] = captured;

        return elements;
    },


    //Initialize Roles for an Agency
    initAgencyRoles: function(agencyId, callback){
        var roleACL = new Parse.ACL();
        roleACL.setPublicReadAccess(true);
        roleACL.setRoleWriteAccess("Admin", true);

        var emt = new Parse.Role("EMT_" + agencyId, roleACL);
        var dispatcher = new Parse.Role("Dispatcher_" + agencyId, roleACL);
        var manager = new Parse.Role("Manager_" + agencyId, roleACL);

        //Get Admin Role
        var query = new Parse.Query(Parse.Role);
        query.equalTo("name", "Admin");
        query.first({
            success: function(admin){
                if(admin){
                    manager.getRoles().add(admin);
                    manager.save({
                        success: function(manager){
                            dispatcher.getRoles().add(manager);
                            dispatcher.getRoles().add(admin);
                            dispatcher.save({
                                success: function(dispatcher){
                                    emt.getRoles().add(admin);
                                    emt.getRoles().add(dispatcher);
                                    emt.getRoles().add(manager);
                                    emt.save({
                                        success: function(emt){
                                            callback();
                                        },
                                        error: function(admin, error){
                                            console.log(error);
                                            callback(error);
                                        }
                                    });
                                },
                                error: function(dispatcher, error){
                                    console.log(error);
                                    callback(error);
                                }
                            });
                        },
                        error: function(manager, error){
                            console.log(error);
                            callback(error);
                        }
                    });
                }
            },
            error: function(error){
                console.log(error);
                callback(error);
            }
        });
    }
};
