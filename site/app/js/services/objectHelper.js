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
    Facility: Parse.Object.extend("Facility"),
    Section: Parse.Object.extend("Section"),
    File: Parse.Object.extend("File"),
    NemsisElement: Parse.Object.extend("NemsisElement"),
    NemsisElementCode: Parse.Object.extend("NemsisElementCode"),
    NemsisHeader: Parse.Object.extend("NemsisHeader"),

    //***Generics***//
    //Create Object
    createObject: function(objectType, agencyId, userId, callback){
        switch (objectType) {
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


    //**Create**//

    //Dispatch
    createDispatch: function(agencyId, userId, callback){
        var dispatch = new ObjectHelper.Dispatch();
        dispatch.set("agencyId", agencyId);
        dispatch.set("createdBy", userId);
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

        ObjectHelper.createSection(agencyId, userId, "eDispatch", function(results){
            dispatch.set("eDispatch", results);
            ObjectHelper.createSection(agencyId, userId, "eTimes", function(results){
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
        facility.set("createdBy", userId);
        facility.set("comments", "");
        facility.set("name", "");
        facility.set("address", "");
        facility.set("city", "");
        facility.set("county", "");
        facility.set("state", "");
        facility.set("zip", "");
        facility.set("type", "");

        ObjectHelper.createSection(agencyId, userId, "dFacilityGroup", function(results){
            dFacilityGroup = results;
            ObjectHelper.createSection(agencyId, userId, "dFacility.FacilityGroup", function(results){
                dFacilityGroup.add("sections", results);

                var query = new Parse.Query("Section");
                query.equalTo("name", "dFacility");
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
        patient.set("createdBy", userId);
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

        ObjectHelper.createSection(agencyId, userId, "ePatient", function(results){
            ePatient = results;
            ObjectHelper.createSection(agencyId, userId, "ePatient.PatientNameGroup", function(results){
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
    createUser: function(agencyId, userId, callback){ //This is not like the others
        var user = new ObjectHelper.User();
        user.set("agencyId", agencyId);
        user.set("createdBy", userId);

        var promise = this.createSection(agencyId, userId, "dPersonnel",  function(results){

        });

        promise.then(function(results){
            user.set("section", results);
            callback(user);
        });
    },

    //Vehicle
    createVehicle: function(agencyId, userId, callback){
        var vehicle = new ObjectHelper.Vehicle();
        vehicle.set("agencyId", agencyId);
        vehicle.set("createdBy", userId);
        vehicle.set("status", "");
        vehicle.set("type", "");
        vehicle.set("name", "");
        vehicle.set("active", false);
        vehicle.set("currentPersonnel", []);

        ObjectHelper.createSection(agencyId, userId, "dVehicle.VehicleGroup", function(results){
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
        file.set("createdBy", userId);
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
    createSection: function(agencyId, userId, sectionName, callback){
        var section = new this.Section();
        section.set("agencyId", agencyId);
        section.set("createdBy", userId);
        section.set("name", sectionName);
        section.set("pcrId", "");
        section.set("elements", []);
        section.set("sections", []);

        var subSections = [];
        var subSectionPromises = [];

        //Get NemsisSection
        var query = new Parse.Query("NemsisSection");
        query.equalTo("name", sectionName);
        query.include("headers");
        query.include("sections");
        var promise1 = query.first({
            success: function(results){
                return results;
            },
            error: function(error){
                console.log(error);
            }
        });

        var promise2 = promise1.then(function(results){
            section.set("nemsisSection", results);

            //create NemsisElements for each of the headers
            var elementHeaders =  results.get('headers') || [];

            var nemsisElements = [];
            var promises = [];
            elementHeaders.forEach(function(elementHeader){
                var promise = ObjectHelper.createNemsisElement(agencyId, userId, elementHeader.get('ElementNumber'), elementHeader, function(results){
                    section.add('elements', results);
                });
                promises.push(promise);
            });
            Parse.Promise.when(promises).then(function(){
                return;
            });
        });
        var promise3 = promise2.then(function(){

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
            //Why can NemsisElement be serialized and not Section? fuck Parse
            requiredSubSectionNames.forEach(function(sectionName){
                subSectionPromises.push(ObjectHelper.createSection(agencyId, userId, sectionName, function(result){
                    subSections.push(result);
                    return result;
                }));
            });
            Parse.Promise.when(subSectionPromises).then(function(){
                section.set('sections', subSections);
                section.save({
                    success: function(result){
                        callback(result);
                    },
                    error: function(object, error){
                        callback(error);
                    }
                });
            });
        });

        return promise3;

        /*
        var promise4 = promise3.then(function(){
            console.log("in promise 4");
            Parse.Object.saveAll(subSections, {
                success: function(results){
                    return results;
                },
                error: function(object, error){
                    callback(error);
                }
            });
        });

         return promise4.then(function(results){
            section.set('sections', results);
            section.save({
                success: function(result){
                    callback(result);
                },
                error: function(object, error){
                    callback(error);
                }
            });
        });
         */
    },

    //Create NemsisElement
    createNemsisElement: function(agencyId, userId, elementNumber, header, callback){
        var element = new this.NemsisElement();
        element.set("agencyId", agencyId);
        element.set("createdBy", userId);
        element.set("title", elementNumber);
        element.set("pcrId", "");
        element.set("value", "");

        //All elements are need references to their NemsisHeaders
        if(header != ""){ //May have broke everything
            element.set('header', header);
            callback(element);
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
    createAgency: function(name, userId, callback){
        var agency = new this.Agency();
        agency.set("createdBy", userId);
        agency.set("name", name);

        //Save the new agency to give it an id
        agency.save({
            success: function(agency){
                var sectionNames = ["dAgency", "dConfiguration", "dContact", "dCustomConfiguration", "dCustomResults", "dDevice", "dFacility", "dLocation", "dPersonnel", "dState", "dVehicle"];

                var promises = [];
                sectionNames.forEach(function(sectionName){
                    var promise = ObjectHelper.createSection(agency.id, agency.get("createdBy"), sectionName, function(section){
                        agency.set(sectionName, section);
                    });
                    promises.push(promise);
                });
                Parse.Promise.when(promises).then(function(){
                    agency.save({
                        success: function(results){
                            callback(results);
                        },
                        error: function(object, error){
                            callback(error);
                        }
                    });
                });
            },
            error: function(object, error){
                callback(error);
            }
        });
    },


    //***Delete****
    //TODO ***Check for cross matches between things like Vehicle on a deleted Dispatch
    deleteSection: function(section, callback){
        //First Remove from Parent Section
        var query = new Parse.Query("Section");
        query.containedIn("sections", section); //not sure if this is right
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
                        callback("Successfully deleted the Section");
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
        query.equalTo("name", "dFacility");
        query.containedIn("sections", facility.get("dFacility"));
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
        user.destroy({
            success: function(result){
                callback("Successfully deleted the User");
            },
            error: function(object, error){
                callback(error.message);
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
    }


};
