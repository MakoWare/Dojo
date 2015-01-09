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
    createObject: function(objectType, agencyId, userId, callback){
        switch (objectType) {
        case "Contact":
            this.createContact(agencyId, userId, callback);
            break;
        case "Dispatch":
            this.createDispatch(agencyId, userId, callback);
            break;
        case "Facility":
            this.createFacility(agencyId, userId, callback);
            break;
        case "File":
            this.createFile(agencyId, userId, callback);
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


    //**Create**//

    //Contact
    createContact: function(agencyId, userId, callback){
        var contact = new ObjectHelper.Contact();
        contact.setACL(ObjectHelper.DispatchACL);
        contact.set("agencyId", agencyId);
        contact.set("createdBy", Parse.User.current());
        contact.set("comments", "");
        contact.set("firstName", "");
        contact.set("lastName", "");
        contact.set("middleInitial", "");
        contact.set("type", "");
        contact.set("phone", "");
        contact.set("email", "");
        contact.set("address", "");
        contact.set("city", "");
        contact.set("state", "");
        contact.set("zip", "");
        contact.set("country", "");
        contact.set("county", "");


        var acl = new Parse.ACL();
        acl.setRoleReadAccess("EMT_" + agencyId, true);
        acl.setRoleWriteAccess("EMT_" + agencyId, true);
        contact.setACL(acl);

        ObjectHelper.createSection(agencyId, "dContact.ContactInfoGroup", function(dContact){
            contact.set("dContact", dContact);
            var query = new Parse.Query("Section");
            query.equalTo("name", "dContact");
            query.equalTo("agencyId", Parse.User.current().get('agencyId'));
            query.first({
                success: function(result){
                    result.add("sections", dContact);
                    result.save({
                        success: function(result){
                            contact.save({
                                success: function(contact){
                                    callback(contact);
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
                error: function(error){
                    callback(error);
                }
            });
        });
    },


    //Dispatch
    createDispatch: function(agencyId, userId, callback){
        var dispatch = new ObjectHelper.Dispatch();
        dispatch.setACL(ObjectHelper.DispatchACL);
        dispatch.set("agencyId", agencyId);
        dispatch.set("createdBy", Parse.User.current());
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

        ObjectHelper.createSection(agencyId, "eDispatch", function(results){
            dispatch.set("eDispatch", results);
            ObjectHelper.createSection(agencyId, "eTimes", function(results){
                dispatch.set('eTimes', results);
                dispatch.save({
                    success: function(dispatch){
                        callback(dispatch);
                    },
                    error: function(object, error){
                        callback(error);
                    }
                });
            });
        });
    },

    //Facility
    createFacility: function(agencyId, userId, callback){
        var facility = new ObjectHelper.Facility();
        var dFacilityGroup;
        facility.set("agencyId", agencyId);
        facility.set("createdBy", Parse.User.current());
        facility.set("comments", "");
        facility.set("name", "");
        facility.set("address", "");
        facility.set("city", "");
        facility.set("county", "");
        facility.set("state", "");
        facility.set("zip", "");
        facility.set("type", "");

        ObjectHelper.createSection(agencyId, "dFacilityGroup", function(results){
            dFacilityGroup = results;
            ObjectHelper.createSection(agencyId,  "dFacility.FacilityGroup", function(results){
                dFacilityGroup.add("sections", results);

                var query = new Parse.Query("Section");
                query.equalTo("name", "dFacility");
                query.equalTo("agencyId", Parse.User.current().get('agencyId'));
                query.first({
                    success: function(result){
                        result.add("sections", dFacilityGroup);
                        result.save({
                            success: function(result){
                                facility.set("dFacility", dFacilityGroup);
                                facility.save({
                                    success: function(facility){
                                        callback(facility);
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
                    error: function(error){
                        callback(error);
                    }
                });
            });
        });
    },

    //Patient
    createPatient: function(agencyId, userId, callback){
        var patient = new ObjectHelper.Patient();
        var ePatient;
        patient.set("agencyId", agencyId);
        patient.set("createdBy", Parse.User.current());
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

        var acl = new Parse.ACL();
        acl.setRoleReadAccess("EMT_" + agencyId, true);
        acl.setRoleWriteAccess("EMT_" + agencyId, true);
        patient.setACL(acl);

        ObjectHelper.createSection(agencyId, "ePatient", function(results){
            ePatient = results;
            ObjectHelper.createSection(agencyId, "ePatient.PatientNameGroup", function(results){
                ePatient.add("sections", results);
                patient.set("ePatient", ePatient);
                patient.save({
                    success: function(patient){
                        callback(patient);
                    },
                    error: function(object, error){
                        callback(error);
                    }
                });
            });
        });
    },

    //User
    createUser: function(agencyId, userId, callback){
        var user = new Parse.User();
        var rando = ObjectHelper.getRandomInt(0, 100000000);
        user.set("agencyId", agencyId);
        user.set("createdBy", Parse.User.current());
        user.set("username", "user" + rando);
        user.set("password", "password");
        user.set("active", false);

        var acl = new Parse.ACL();
        acl.setPublicReadAccess(false);
        acl.setPublicWriteAccess(false);
        acl.setRoleReadAccess("EMT_" + agencyId, true);
        user.setACL(acl);

        //Create dPersonnel.PersonnelGroup Section for User
        var promise = ObjectHelper.createSection(agencyId, "dPersonnel.PersonnelGroup",  function(dPersonnel){
            user.set("dPersonnel", dPersonnel);

            //Add PersonnelGroup Section to Agency's dPersonnel
            var query = new Parse.Query("Section");
            query.equalTo("name", "dPersonnel");
            query.equalTo("agencyId", Parse.User.current().get('agencyId'));
            query.first({
                success: function(result){
                    result.add('sections', dPersonnel);
                    result.save({
                        success: function(result){
                            user.save(null, {
                                success: function(user) {
                                    callback(user);
                                },
                                error: function(user, error) {
                                    callback(error);
                                }
                            });
                        },
                        error: function(object, error){
                            callback(error);
                        }
                    });
                },
                error: function(error){
                    callback(error);
                }
            });
        });
    },

    //Vehicle
    createVehicle: function(agencyId, userId, callback){
        var vehicle = new ObjectHelper.Vehicle();
        vehicle.set("agencyId", agencyId);
        vehicle.set("createdBy", Parse.User.current());
        vehicle.set("status", "");
        vehicle.set("type", "");
        vehicle.set("name", "");
        vehicle.set("active", false);
        vehicle.set("currentPersonnel", []);

        var acl = new Parse.ACL();
        acl.setRoleReadAccess("EMT_" + agencyId, true);
        acl.setRoleWriteAccess("EMT_" + agencyId, true);
        vehicle.setACL(acl);

        ObjectHelper.createSection(agencyId, "dVehicle.VehicleGroup", function(results){
            var dVehicleGroup = results;
            vehicle.set("dVehicle", dVehicleGroup);

            var query = new Parse.Query("Section");
            query.equalTo("agencyId", agencyId);
            query.equalTo("name", "dVehicle");
            query.first({
                success: function(result){
                    return result;
                },
                error: function(error){
                    console.log(error);
                    callback(error);
                }
            }).then(function(result){
                result.add("sections", dVehicleGroup);
                result.save({
                    success: function(result){
                        return result;
                    },
                    error: function(error){
                        console.log(error);
                        callback(error);
                    }
                }).then(function(results){
                    vehicle.save({
                        success: function(results){
                            callback(results);
                        },
                        error: function(object, error){
                            console.log(error);
                            callback(error);
                        }
                    });
                });
            });
        });
    },

    //Create File
    createFile: function(agencyId, userId, callback){
        var file = new ObjectHelper.File();
        file.set("agencyId", agencyId);
        file.set("createdBy", Parse.User.current());
        file.setACL(ObjectHelper.FileACL);
        file.set("name", "");
        file.set("comments", "");
        file.save({
            success: function(result){
                callback(result);
            },
            error: function(object, error){
                callback(error);
            }
        });
    },

    //Nemsis Objects
    //Create Section   *Think I got it, boss ass async function
    createSection: function(agencyId,  sectionName, callback){
        var section = new this.Section();
        section.set("agencyId", agencyId);
        section.set("createdBy", Parse.User.current());
        section.set("name", sectionName);
        section.set("pcrId", "");
        section.set("elements", []);
        section.set("sections", []);

        var sectionACL = new Parse.ACL();
        sectionACL.setRoleReadAccess("EMT_" + agencyId, true);
        sectionACL.setRoleWriteAccess("EMT_" + agencyId, true);
        section.setACL(sectionACL);

        var subSections = [];
        var subSectionPromises = [];
        var finalPromise;

        //Get NemsisSection
        var query = new Parse.Query("NemsisSection");
        console.log(sectionName);
        query.equalTo("name", sectionName);
        query.include("headers");
        query.include("sections");
        return query.first({
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
                var promise = ObjectHelper.createNemsisElement(agencyId,  elementHeader.get('ElementNumber'), elementHeader, function(results){
                    section.add('elements', results);
                });
                promises.push(promise);
            });

            return Parse.Promise.when(promises).then(function(){
                return;
            });
        }).then(function(){
            //Check if sub Sections are required
            var requiredSubSectionNames = [];
            if(section.get('nemsisSection').get('sections')){
                section.get('nemsisSection').get('sections').forEach(function(section){
                    if(section.get('min')  == 1){
                        requiredSubSectionNames.push(section.get('name'));
                    }
                });
            }
            //Create required sub Sections Recursively
            requiredSubSectionNames.forEach(function(sectionName){
                subSectionPromises.push(ObjectHelper.createSection(agencyId, sectionName, function(result){
                    console.log("subSection created: " + sectionName);
                    subSections.push(result);
                }));
            });
        }).then(function(){
            return Parse.Promise.when(subSectionPromises).then(function(){
                return;
            });
        }).then(function(){
            console.log("all subsections created for: " + sectionName);
            section.set('sections', subSections);
            return section.save({
                success: function(result){
                    return (result);
                },
                error: function(object, error){
                    callback(error);
                }
            }).then(function(result){
                callback(result);
            });
        });
    },

    //Create NemsisElement
    createNemsisElement: function(agencyId, elementNumber, header, callback){
        var element = new this.NemsisElement();
        element.set("agencyId", Parse.User.current().attributes.agencyId);
        element.set("createdBy", Parse.User.current());
        element.set("title", elementNumber);
        element.set("pcrId", "");
        element.set("value", "");

        var acl = new Parse.ACL();
        acl.setRoleReadAccess("EMT_" + agencyId, true);
        acl.setRoleWriteAccess("EMT_" + agencyId, true);
        element.setACL(acl);

        //All elements are need references to their NemsisHeaders
        if(header != ""){ //May have broke everything
            element.set('header', header);
            element.save({
                success: function(result){
                    callback(element);
                },
                error: function(object, error){
                    callback(error);
                }
            });
        } else {
            console.log("getting header for element");
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
    createAgency: function(name, callback){
        var agency = new ObjectHelper.Agency();
        agency.set("createdBy", Parse.User.current());
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


    //***Delete****
    //TODO ***Check for cross matches between things like Vehicle on a deleted Dispatch
    deleteSection: function(section, callback){
        //First Remove from Parent Section
        var query = new Parse.Query("Section");
        query.equalTo("sections", section); //not sure if this is right
        query.first({
            success: function(object){
                return object;
            },
            error: function(error){
                callback(error);
            }
        }).then(function(parentSection){
            parentSection.remove("sections", section); //not sure if this is right
            parentSection.save({
                success: function(object){
                    return;
                },
                error: function(object, error){
                    callback(error);
                }
            }).then(function(){
                //Now Delete the Section object
                section.destroy({
                    success: function(result){
                        callback(result);
                    },
                    error: function(object, error){
                        callback(error);
                    }
                });
            });

        });
    },

    deleteInstallation: function(installation, callback){
        //First Remove the dDevice Section
        var query = new Parse.Query("Section");
        query.equalTo("name", "dDevice");
        query.containedIn("sections", installation.get("dDevice")); //not sure if this is right
        query.first({
            success: function(object){
                return object;
            },
            error: function(error){
                callback(error);
            }
        }).then(function(parentSection){
            parentSection.remove("sections", installation.get("dDeviceGroup")); //not sure if this is right
            parentSection.save({
                success: function(object){
                    return;
                },
                error: function(object, error){
                    callback(error);
                }
            }).then(function(){
                //Now Delete the Installation object
                installation.destroy({
                    success: function(result){
                        callback("Successfully deleted the Installation");
                    },
                    error: function(object, error){
                        callback(error);
                    }
                });
            });

        });
    },

    //Delete Dispatch
    deleteDispatch: function(dispatch, callback){
        dispatch.destroy({
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
        file.destroy({
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

    //Delete Facility
    deleteFacility: function(facility, callback){
        var query = new Parse.Query("Section");
        console.log(facility);
        query.equalTo("name", "dFacility");
        console.log(facility.get("dFacility"));
        query.equalTo("sections", facility.get("dFacility"));
        console.log(query);
        query.first({
            success: function(object){
                return object;
            },
            error: function(error){
                callback(error);
            }
        }).then(function(parentSection){
            parentSection.remove("sections", facility.get("dFacility")); //not sure if this is right
            parentSection.save({
                success: function(object){
                    return;
                },
                error: function(object, error){
                    callback(error);
                }
            }).then(function(){
                //Now Delete the Facility object
                facility.destroy({
                    success: function(result){
                        callback("Successfully deleted the Facility");
                    },
                    error: function(object, error){
                        callback(error);
                    }
                });
            });
        });
    },

    //Delete Contact
    deleteContact: function(contact, callback){
        var query = new Parse.Query("Section");
        query.equalTo("name", "dContact");
        query.equalTo("sections", contact.get("dContact"));
        query.first({
            success: function(object){
                return object;
            },
            error: function(error){
                callback(error);
            }
        }).then(function(parentSection){
            parentSection.remove("sections", contact.get("dContact"));
            parentSection.save({
                success: function(object){
                    return;
                },
                error: function(object, error){
                    callback(error);
                }
            }).then(function(){
                //Now Delete the Facility object
                contact.destroy({
                    success: function(result){
                        callback("Successfully deleted the Contact");
                    },
                    error: function(object, error){
                        callback(error);
                    }
                });
            });
        });
    },


    deletePatient: function(patient, callback){
        patient.destroy({
            success: function(result){
                callback("Successfully deleted the Patient");
            },
            error: function(object, error){
                callback(error);
            }
        });
    },

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

    deleteVehicle: function(vehicle, callback){
        //First Remove the dVehicle Section
        var query = new Parse.Query("Section");
        query.equalTo("name", "dVehicle");
        query.equalTo("sections", vehicle.get("dVehicleGroup")); //not sure if this is right
        query.first({
            success: function(results){
                return results;
                console.log(results);
            },
            error: function(error){
                console.log(error);
                callback(error.message);
            }
        }).then(function(parentSection){
            console.log(parentSection);
            parentSection.remove("sections", vehicle.get("dVehicle")); //not sure if this is right
            parentSection.save({
                success: function(object){
                    return;
                },
                error: function(object, error){
                    callback(error.message);
                }
            }).then(function(){
                //Now Delete the Device object
                vehicle.destroy({
                    success: function(result){
                        callback("Successfully deleted the Vehicle");
                    },
                    error: function(object, error){
                        callback(error.message);
                    }
                });
            });

        });
    },

    getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
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

    },


    createEmptySection: function(name, callback){
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

        callback(section);

    }



};
