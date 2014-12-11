//Create or Update Controller
var CreateCtrl = function($scope, $location, ParseService, GlobalService){

    $scope.init = function(){
        $scope.object = {};
        $scope.hasNemsis = false;
        $scope.dir = $location.url().slice(1).split("/")[0];
        $scope.objectType = GlobalService.getObjectType($scope.dir);
        var id = $location.url().split("/")[$location.url().split("/").length - 1];
        $scope.getObject($scope.objectType, id);
    },

    //1. Get Object
    $scope.getObject = function(objectType, objectId){
        GlobalService.showSpinner();
        ParseService.getObjectById(objectType, objectId, function(results){
            console.log(results);
            if(results.id){
                $scope.$apply(function(){
                    $scope.object = results;
                    $scope.setUp();
                });
            } else {
                var objectTypeLower = objectType.charAt(0).toLowerCase() + objectType.substr(1) + "s";
                var newPath = "/" + objectTypeLower;
                $location.path(newPath);
                $scope.$apply();
            }
        });
    };

    //2. Get Partial
    $scope.getPartial = function(){
        var object = $scope.objectType.toLowerCase();
        var partialLocation = $scope.dir + "/" + object + ".html";
        return "partials/" + partialLocation;
    };

    //Save Object
    $scope.saveObject = function(){
        GlobalService.showSpinner();
        switch($scope.objectType){
        case "Contact":
            $scope.saveContact();
            break;
        case "Dispatch":
            $scope.saveDispatch();
            break;
        case "Facility":
            $scope.saveFacility();
            break;
        case "File":
            $scope.saveFile();
            break;
        case "Patient":
            $scope.savePatient();
            break;
        case "Vehicle":
            $scope.saveVehicle();
            break;
        case "User":
            $scope.saveUser();
            break;
        case "PCR":
            $scope.savePCR();
            break;
        }
    };


    //Save Contact
    $scope.saveContact = function(){
        for(var name in $scope.object.attributes) {
            $scope.object.set(name, $scope.object.attributes[name]);
        }
        var dContact = $scope.object.attributes.dContact;
        var attributes = $scope.object.attributes;

        dContact.attributes.elements.forEach(function(element){
            if(element.attributes.title == "dContact.01"){
                element.set('value', attributes.type.split(" ")[0]);
            }
            if(element.attributes.title == "dContact.02"){
                element.set('value', attributes.lastName);
            }
            if(element.attributes.title == "dContact.03"){
                element.set('value', attributes.firstName);
            }
            if(element.attributes.title == "dContact.04"){
                element.set('value', attributes.middleInitial);
            }
            if(element.attributes.title == "dContact.05"){
                element.set('value', attributes.address);
            }
            if(element.attributes.title == "dContact.06"){
                element.set('value', attributes.city);
            }
            if(element.attributes.title == "dContact.07"){
                element.set('value', attributes.state);
            }
            if(element.attributes.title == "dContact.08"){
                element.set('value', attributes.zip);
            }
            if(element.attributes.title == "dContact.09"){
                element.set('value', attributes.country);
            }
            if(element.attributes.title == "dContact.10"){
                element.set('value', attributes.phone);
            }
            if(element.attributes.title == "dContact.11"){
                element.set('value', attributes.email);
            }
        });
        dContact.attributes.sections.forEach(function(section){
            section.attributes.elements.forEach(function(element){

            });
        });

        dContact.save({
            success: function(dContact){
                $scope.object.save({
                    success: function(result){
                        GlobalService.dismissSpinner();
                        $scope.object = result;
                        $location.url("/contacts");
                        $scope.$apply();
                    },
                    error: function(object, error){
                        GlobalService.dismissSpinner();
                        alert(GlobalService.errorMessage + error.message);
                    }
                });
            },
            error: function(object, error){
                alert(GlobalService.errorMessage + error.message);
            }
        });
    },

    //Save Dispatch
    $scope.saveDispatch = function(){
        var eDispatch = $scope.object.attributes.eDispatch;
        var eTimes = $scope.object.attributes.eTimes;
        var attributes = $scope.object.attributes;

        eDispatch.attributes.elements.forEach(function(element){
            switch (element.attributes.title){
            case "eDispatch.01":
                element.set("value", $scope.object.attributes.complaint.attributes.code);
                break;
            case "eDispatch.02":
                element.set("value", $scope.object.attributes.emd.attributes.code);
                break;
            case "eDispatch.05":
                if($scope.object.attributes.priority){
                    element.set("value", $scope.object.attributes.priority.attributes.code);
                }
                break;
            }
        });

        /*
        eTimes.attributes.elements.forEach(function(element){
            switch (element.attributes.title){
            case "eTimes.01":
                element.set("value", $scope.object.attributes.complaint.attributes.code);
                break;
            case "eTimes.02":
                element.set("value", $scope.object.attributes.emb.attributes.code);
                break;
            case "eTimes.05":
                element.set("value", $scope.object.attributes.priority.attributes.code);
                break;
            }
        });
         */

        //Color Picker
        var hex = $("#colorPicker").val();
        var bigint = parseInt(hex, 16);
        var r = (bigint >> 16) & 255;
        var g = (bigint >> 8) & 255;
        var b = bigint & 255;

        $scope.object.attributes.color = "rgba(" + r + "," + g + "," + b + ", .8)";

        if($scope.object.attributes.pickUpFacility == ""){
            $scope.object.attributes.pickUpFacility = null;
        }

        if($scope.object.attributes.dropOffFacility == ""){
            $scope.object.attributes.dropOffFacility = null;
        }


        for(var name in $scope.object.attributes) {
            $scope.object.set(name, $scope.object.attributes[name]);
        }

        $scope.object.save({
            success: function(result){
                GlobalService.dismissSpinner();
                $scope.object = result;
                $location.url("/dispatches");
                $scope.$apply();
            },
            error: function(object, error){
                GlobalService.dismissSpinner();
                alert(GlobalService.errorMessage + error.message);
            }
        });
    },


    //Save Facility
    $scope.saveFacility = function(){
        for(var name in $scope.object.attributes) {
            $scope.object.set(name, $scope.object.attributes[name]);
        }
        var dFacility = $scope.object.attributes.dFacility;
        var attributes = $scope.object.attributes;
        dFacility.attributes.elements.forEach(function(element){
            if(element.attributes.title == "dFacility.01"){
                element.set('value', attributes.type.split(" ")[0]);
            }
        });

        dFacility.attributes.sections.forEach(function(section){
            section.attributes.elements.forEach(function(element){
                if(element.attributes.title == "dFacility.02"){
                    element.set('value', attributes.name);
                }
                if(element.attributes.title == "dFacility.07"){
                    element.set('value', attributes.address);
                }
                if(element.attributes.title == "dFacility.08"){
                    element.set('value', attributes.city);
                }
                if(element.attributes.title == "dFacility.09"){
                    element.set('value', attributes.state);
                }
                if(element.attributes.title == "dFacility.10"){
                    element.set('value', attributes.zip);
                }
                if(element.attributes.title == "dFacility.11"){
                    element.set('value', attributes.county);
                }
                if(element.attributes.title == "dFacility.12"){
                    element.set('value', attributes.country);
                }
            });
        });

        dFacility.save({
            success: function(dFacility){
                $scope.object.save({
                    success: function(result){
                        GlobalService.dismissSpinner();
                        $scope.object = result;
                        $location.url("/facilities");
                        $scope.$apply();
                    },
                    error: function(object, error){
                        GlobalService.dismissSpinner();
                        alert(GlobalService.errorMessage + error.message);
                    }
                });
            },
            error: function(object, error){
                alert(GlobalService.errorMessage + error.message);
            }
        });
    },

    //Save User
    $scope.saveUser = function(){
        var attributes = $scope.object.attributes;
        var dPersonnel = attributes.dPersonnel;

        var updateUser = function(){
            //Update the Role
            var roleName = $scope.object.attributes.role;
            if(roleName){
                ParseService.changeRole($scope.object, roleName, function(result){
                    ParseService.saveUser($scope.object.id, attributes.username, attributes.firstName, attributes.lastName, attributes.phone, attributes.email, attributes.active,  attributes.licensureLevel, attributes.licenseId, function(result){
                        if(result == "Success"){
                            updateDPersonnel();
                        }
                        else {
                            GlobalService.dismissSpinner();
                            alert(GlobalService.errorMessage + result.message);
                        }
                    });
                });
            } else {
                ParseService.saveUser($scope.object.id, attributes.username, attributes.firstName, attributes.lastName, attributes.phone, attributes.email, attributes.active, attributes.licensureLevel, attributes.licenseId, function(result){
                    if(result == "Success"){
                        GlobalService.dismissSpinner();
                        $location.url("/users");
                        $scope.$apply();
                    }
                    else {
                        GlobalService.dismissSpinner();
                        alert(GlobalService.errorMessage + result);
                    }
                });
            }
        };


        var updateDPersonnel = function(){
            dPersonnel.attributes.elements.forEach(function(element){
                if(element.attributes.title == "dPersonnel.09"){
                    element.set('value', attributes.phone);
                }
                if(element.attributes.title == "dPersonnel.10"){
                    element.set('value', attributes.email);
                }
            });

            dPersonnel.attributes.sections.forEach(function(section){
                section.attributes.elements.forEach(function(element){
                    console.log(element);
                    if(element.attributes.title == "dPersonnel.01"){
                        element.set('value', attributes.lastName);
                    }
                    if(element.attributes.title == "dPersonnel.02"){
                        element.set('value', attributes.firstName);
                    }
                    if(element.attributes.title == "dPersonnel.23"){
                        element.set('value', attributes.licenseId);
                    }
                    if(element.attributes.title == "dPersonnel.24"){
                        element.set('value', attributes.licensureLevel);
                    }
                });
            });

            dPersonnel.save({
                success: function(dPersonnel){
                    GlobalService.dismissSpinner();
                    $location.url("/users");
                    $scope.$apply();
                },
                error: function(object, error){
                    alert(GlobalService.errorMessage + error.message);
                }
            });
        };

        var addSections = function(){
            var dPersonnel = $scope.object.attributes.dPersonnel;
            var sectionNames = [];
            var promises = [];
            dPersonnel.attributes.sections.forEach(function(section){
                sectionNames.push(section.attributes.name);
            });

            if($.inArray("dPersonnel.NameGroup", sectionNames) == -1){
               promises.push(ParseService.createSection("dPersonnel.NameGroup", function(nameGroup){
                    dPersonnel.add("sections", nameGroup);
                }));
            }
            if($.inArray("dPersonnel.AddressGroup", sectionNames) == -1){
                promises.push(ParseService.createSection("dPersonnel.AddressGroup", function(addressGroup){
                    dPersonnel.add("sections", addressGroup);
                }));
            }
            if($.inArray("dPersonnel.LicensureGroup", sectionNames) == -1){
                promises.push(ParseService.createSection("dPersonnel.LicensureGroup", function(licenseGroup){
                    dPersonnel.add("sections", licenseGroup);
                }));
            }
            if($.inArray("dPersonnel.CertificationLevelGroup", sectionNames) == -1){
                promises.push(ParseService.createSection("dPersonnel.CertificationLevelGroup", function(certGroup){
                    dPersonnel.add("sections", certGroup);
                }));
            }

            Parse.Promise.when(promises).then(function(){
                dPersonnel.save({
                    success: function(dPersonnel){
                        //Now Update User
                        console.log(dPersonnel);
                        updateUser();
                    },
                    error: function(object, error){
                        alert(GlobalService.errorMessage + error.message);
                    }
                });
            });
        };

        addSections();
    },

    //Save PCR
    $scope.savePCR = function(){
        for(var name in $scope.object.attributes) {
            $scope.object.set(name, $scope.object.attributes[name]);
        }
        $scope.object.save({
            success: function(result){
                GlobalService.dismissSpinner();
                $scope.object = result;
                $location.url("/pcrs");
                $scope.$apply();
            },
            error: function(object, error){
                GlobalService.dismissSpinner();
                alert(GlobalService.errorMessage + error.message);
            }
        });
    },



    //Save Patient
    $scope.savePatient = function(){
        //Nemsis
        var ePatient = $scope.object.attributes.ePatient;
        var attributes = $scope.object.attributes;
        ePatient.attributes.elements.forEach(function(element){
            switch (element.attributes.title){
            case "ePatient.01":
                element.set("value", $scope.object.id);
                break;
            case "ePatient.05":
                element.set("value", attributes.address);
                break;
            case "ePatient.06":
                element.set("value", attributes.city);
                break;
            case "ePatient.07":
                element.set("value", attributes.county);
                break;
            case "ePatient.08":
                element.set("value", attributes.state);
                break;
            case "ePatient.09":
                element.set("value", attributes.zip);
                break;
            case "ePatient.10":
                element.set("value", "US"); //Hard Code for now
                break;
            case "ePatient.11":
                //element.set("value", $scope.object.id); Not Sure
                break;
            case "ePatient.12":
                element.set("value", attributes.ssn);
                break;
            case "ePatient.13":
                element.set("value", attributes.gender);
                break;
            case "ePatient.14":
                element.set("value", attributes.race);
                break;
            case "ePatient.17":
                var dob = (attributes.dob.getMonth() + 1) + "/" + attributes.dob.getDate() + "/" + attributes.dob.getFullYear();
                element.set("value", dob);
                break;
            case "ePatient.18":
                element.set("value", attributes.phone);
                break;
            case "ePatient.19":
                element.set("value", attributes.email);
                break;
            case "ePatient.20":
                //element.set("value", $scope.object.id); Not Sure
                break;
            case "ePatient.21":
                //element.set("value", $scope.object.id); Not Sure
                break;
            }
        });

        ePatient.attributes.sections.forEach(function(section){
            if(section.attributes.name == "ePatient.AgeGroup"){
                section.attributes.elements.forEach(function(element){
                    if(element.attributes.title == "ePatient.15"){
                        var ageDifMs = Date.now() - attributes.dob.getTime();
                        var ageDate = new Date(ageDifMs);
                        var age = Math.abs(ageDate.getUTCFullYear() - 1970) + "";
                        element.set("value", age);
                        $scope.object.attributes.age = age;
                    }
                    if(element.attributes.title == "ePatient.16"){
                        element.set("value", "2516009");
                    }
                });
            }
            if(section.attributes.name == "ePatient.PatientNameGroup"){
                section.attributes.elements.forEach(function(element){
                    if(element.attributes.title == "ePatient.02"){
                        element.set("value", attributes.lastName);
                    }
                    if(element.attributes.title == "ePatient.03"){
                        element.set("value", attributes.firstName);
                    }
                    if(element.attributes.title == "ePatient.04"){
                        element.set("value", attributes.middleInitial);
                    }
                });
            }
        });


        $scope.object.set("ePatient", ePatient);

        for(var name in $scope.object.attributes) {
            $scope.object.set(name, $scope.object.attributes[name]);
        }

        $scope.object.save({
            success: function(result){
                GlobalService.dismissSpinner();
                $scope.object = result;
                $location.url("/patients");
                $scope.$apply();
            },
            error: function(object, error){
                GlobalService.dismissSpinner();
                alert(GlobalService.errorMessage + error.message);
            }
        });
    },

    //Save Vehicle
    $scope.saveVehicle = function(){
        for(var name in $scope.object.attributes) {
            $scope.object.set(name, $scope.object.attributes[name]);
        }

        var attributes = $scope.object.attributes;
        var dVehicle = attributes.dVehicle;

        dVehicle.attributes.elements.forEach(function(element){
            if(element.attributes.title == "dVehicle.04"){
                element.set('value', attributes.type.split(" ")[0]);
            }
        });

        dVehicle.save({
            success: function(dVehicle){
                $scope.object.save({
                    success: function(result){
                        GlobalService.dismissSpinner();
                        $scope.object = result;
                        $location.url("/vehicles");
                        $scope.$apply();
                    },
                    error: function(object, error){
                        GlobalService.dismissSpinner();
                        alert(GlobalService.errorMessage + error.message);
                    }
                });
            },
            error: function(object, error){

            }
        });
    },

    //Save File
    $scope.saveFile = function(){
        for(var name in $scope.object.attributes) {
            $scope.object.set(name, $scope.object.attributes[name]);
        }

        var fileUploadControl = $("#upload")[0];
        if (fileUploadControl.files.length > 0) {
            var file = fileUploadControl.files[0];
            var parseFile = new Parse.File("file", file);
            $scope.object.set("file", parseFile);
        }

        $scope.object.save({
            success: function(result){
                GlobalService.dismissSpinner();
                $scope.object = result;
                $location.url("/files");
                $scope.$apply();
            },
            error: function(object, error){
                GlobalService.dismissSpinner();
                alert(GlobalService.errorMessage + error.message);
            }
        });
    },

    //Delete Object
    $scope.deleteObject = function(object){
        GlobalService.showSpinner();
        ParseService.deleteObject($scope.object, $scope.objectType, function(results){
            GlobalService.dismissSpinner();
            if(results.message != null){
                alert(GlobalService.errorMessage + results.message); //Not Sure if this is right
            } else {
                var newPath = "/" + $scope.dir;
                $location.path(newPath);
                $scope.$apply();
            }
        });
    };

    /** Begin to destroy nice and clean Controller here  **/
    $scope.setUp = function(){
        switch($scope.objectType){
        case "Contact":
            $scope.contactSetup();
            break;
        case "Dispatch":
            $scope.dispatchSetup();
            break;
        case "Facility":
            $scope.facilitySetup();
            break;
        case "Patient":
            $scope.patientSetup();
            break;

        case "Vehicle":
            $scope.vehicleSetup();
            break;
        case "User":
            $scope.userSetup();
            break;
        }

        GlobalService.dismissSpinner();
    },


    $scope.contactSetup = function(){
        $scope.hasNemsis = true;
        $scope.nemsisLocation = "dContact/" + $scope.object.attributes.dContact.id;

    },


    //Dispatch Setup
    $scope.dispatchSetup = function(){

        //Push dispatch to installation
        $scope.sendDispatch = function(){
            GlobalService.showSpinner();

            var query = new Parse.Query(Parse.Installation);
            var dispatchId = $scope.object.id;
            var installationId = $scope.object.attributes.vehicle.attributes.installation.id;
            console.log(installationId);
            query.equalTo('objectId', installationId);

            Parse.Push.send({
                where: query,
                data: {
                    dispatchId: dispatchId,
                    type: "dispatch sent"
                }
            }, {
                success: function() {
                    GlobalService.dismissSpinner();
                    alert("Dispatch Sent");

                },
                error: function(error) {
                    GlobalService.dismissSpinner();
                    alert(GlobalService.errorMessage + error.message);
                }
            });
        };




        if(!$scope.object.attributes.color){
            $scope.object.attributes.color = "FFFFFF";
        }


        $scope.patient = {};
        $scope.facility = {};

        //Get Codes
        ParseService.findNemsisElementCodes("eDispatch", function(results){
            $scope.eDispatch01 = [];
            $scope.eDispatch02 = [];
            $scope.eDispatch05 = [];

            results.forEach(function(code){
                if(code.get('elementNumber') === "eDispatch.01"){
                    $scope.eDispatch01.push(code);
                } else if(code.get('elementNumber') === "eDispatch.02"){
                    $scope.eDispatch02.push(code);
                } else if(code.get('elementNumber') === "eDispatch.05"){
                    $scope.eDispatch05.push(code);
                }
                $scope.$apply();
            });
        });

        //Get Vehicles
        ParseService.findVehiclesByAgency(function(results){
            $scope.vehicles = results;
            $scope.$apply();
        });

        //Date Pickers
        if(!$scope.object.attributes.pickUpDate){
            $scope.object.attributes.pickUpDate = new Date();
        }
        if(!$scope.object.attributes.dropOffDate){
            $scope.object.attributes.dropOffDate = new Date();
        }

        $scope.format = 'MM/dd/yyyy';
        $scope.dateOptions = {
            startingDay: 1
        };

        $scope.pickUpDateOpen = function($event) {
            $scope.pickUpDateOpened = true;
            $event.preventDefault();
            $event.stopPropagation();
        };

        $scope.dropOffDateOpen = function($event) {
            $scope.dropOffDateOpened = true;
            $event.preventDefault();
            $event.stopPropagation();
        };

        //Time Pickers
        $scope.hstep = 1;
        $scope.mstep = 1;

        //Type Aheads
        $scope.getPatients = function(name){
            return ParseService.patientsTypeAhead(name, function(results){
                return results;
            });
        };

        $scope.getFacilities = function(name){
            return ParseService.facilitiesTypeAhead(name, function(results){
                return results;
            });
        };

        $scope.addressTypeAhead = function(val){
            return GlobalService.addressTypeAhead(val);
        };

        $scope.setPickUpAddress = function(item){
            //First clear everything
            $scope.object.attributes.pickUpAddress = "";
            $scope.object.attributes.pickUpCity = "";
            $scope.object.attributes.pickUpCounty = "";
            $scope.object.attributes.pickUpState = "";
            $scope.object.attributes.pickUpCountry = "";
            $scope.object.attributes.pickUpZip = "";

            item.address_components.forEach(function(component){
                switch (component.types[0]) {
                case "street_number":
                    $scope.object.attributes.pickUpAddress = component.long_name + " ";
                    break;
                case "route":
                    $scope.object.attributes.pickUpAddress += component.long_name;
                    break;
                case "administrative_area_level_3":
                    if($scope.object.attributes.pickUpCity == ""){
                        $scope.object.attributes.pickUpCity = component.long_name;
                    }
                    break;
                case "locality":
                    if($scope.object.attributes.pickUpCity == ""){
                        $scope.object.attributes.pickUpCity = component.long_name;
                    }
                    break;
                case "administrative_area_level_2":
                    $scope.object.attributes.pickUpCounty = component.long_name;
                    break;
                case "administrative_area_level_1":
                    $scope.object.attributes.pickUpState = component.short_name;
                    break;
                case "country":
                    $scope.object.attributes.pickUpCountry = component.short_name;
                    break;
                case "postal_code":
                    $scope.object.attributes.pickUpZip = component.long_name;
                    break;
                }

            });
        };

        $scope.setDropOffAddress = function(item){
            //First clear everything
            $scope.object.attributes.dropOffAddress = "";
            $scope.object.attributes.dropOffCity = "";
            $scope.object.attributes.dropOffCounty = "";
            $scope.object.attributes.dropOffState = "";
            $scope.object.attributes.dropOffCountry = "";
            $scope.object.attributes.dropOffZip = "";

            item.address_components.forEach(function(component){
                switch (component.types[0]) {
                case "street_number":
                    $scope.object.attributes.dropOffAddress = component.long_name + " ";
                    break;
                case "route":
                    $scope.object.attributes.dropOffAddress += component.long_name;
                    break;
                case "administrative_area_level_3":
                    if($scope.object.attributes.dropOffCity == ""){
                        $scope.object.attributes.dropOffCity = component.long_name;
                    }
                    break;
                case "locality":
                    if($scope.object.attributes.dropOffCity == ""){
                        $scope.object.attributes.dropOffCity = component.long_name;
                    }
                    break;
                case "administrative_area_level_2":
                    $scope.object.attributes.dropOffCounty = component.long_name;
                    break;
                case "administrative_area_level_1":
                    $scope.object.attributes.dropOffState = component.short_name;
                    break;
                case "country":
                    $scope.object.attributes.dropOffCountry = component.short_name;
                    break;
                case "postal_code":
                    $scope.object.attributes.dropOffZip = component.long_name;
                    break;
                }
            });
        };


        $scope.setPatientInfo = function(patient){
            $scope.object.set("patient", patient);
            $scope.patient.dob =  patient.attributes.dob.getMonth() + 1 + "/" + patient.attributes.dob.getDate() + "/" + patient.attributes.dob.getFullYear();
            $scope.patient.phone = patient.attributes.phone;
            $scope.patient.email = patient.attributes.email;
            $scope.patient.age = patient.attributes.age;
        };

        $scope.setPickUpFacilityInfo = function(facility){
            $scope.object.attributes.pickUpAddress = facility.attributes.address;
            $scope.object.attributes.pickUpCity = facility.attributes.city;
            $scope.object.attributes.pickUpZip = facility.attributes.zip;
            $scope.object.attributes.pickUpState = facility.attributes.state;
            $scope.object.attributes.pickUpCounty = facility.attributes.county;
            $scope.object.attributes.pickUpCountry = facility.attributes.country;
        };

        $scope.setDropOffFacilityInfo = function(facility){
            $scope.object.attributes.dropOffAddress = facility.attributes.address;
            $scope.object.attributes.dropOffCity = facility.attributes.city;
            $scope.object.attributes.dropOffZip = facility.attributes.zip;
            $scope.object.attributes.dropOffState = facility.attributes.state;
            $scope.object.attributes.dropOffCounty = facility.attributes.county;
            $scope.object.attributes.dropOffCountry = facility.attributes.country;
        };


        if($scope.object.attributes.patient){
            $scope.setPatientInfo($scope.object.attributes.patient);
        }

        if($scope.object.attributes.pickUpFacility){
            $scope.setPickUpFacilityInfo($scope.object.attributes.pickUpFacility);
        }

        if($scope.object.attributes.dropOffFacility){
            $scope.setDropOffFacilityInfo($scope.object.attributes.dropOffFacility);
        }


        $(".pick-a-color").pickAColor({
            showSpectrum            : false,
            showSavedColors         : false,
            saveColorsPerElement    : false,
            fadeMenuToggle          : true,
            showHexInput            : false,
            showAdvanced            : false,
            showBasicColors         : true,
            allowBlank              : false,
            inlineDropdown          : true
        });

        $(".pick-a-color").val("rgba(153, 55, 35, .9)");



    },

    //Facility Setup
    $scope.facilitySetup = function(){
        $scope.hasNemsis = true;
        $scope.nemsisLocation = "dFacility/" + $scope.object.attributes.dFacility.id;

        $scope.addressTypeAhead = function(val){
            return GlobalService.addressTypeAhead(val);
        };

        $scope.setAddress = function(item){
            //First clear everything
            $scope.object.attributes.address = "";
            $scope.object.attributes.city = "";
            $scope.object.attributes.county = "";
            $scope.object.attributes.state = "";
            $scope.object.attributes.country = "";
            $scope.object.attributes.zip = "";

            item.address_components.forEach(function(component){
                switch (component.types[0]) {
                case "street_number":
                    $scope.object.attributes.address = component.long_name + " ";
                    break;
                case "route":
                    $scope.object.attributes.address += component.long_name;
                    break;
                case "administrative_area_level_3":
                    if($scope.object.attributes.city == ""){
                        $scope.object.attributes.city = component.long_name;
                    }
                    break;
                case "locality":
                    if($scope.object.attributes.city == ""){
                        $scope.object.attributes.city = component.long_name;
                    }
                    break;
                case "administrative_area_level_2":
                    $scope.object.attributes.county = component.long_name;
                    break;
                case "administrative_area_level_1":
                    $scope.object.attributes.state = component.short_name;
                    break;
                case "country":
                    $scope.object.attributes.country = component.short_name;
                    break;
                case "postal_code":
                    $scope.object.attributes.zip = component.long_name;
                    break;
                }

            });
        };


    },

    //Vehicle Setup
    $scope.vehicleSetup = function(){
        $scope.hasNemsis = true;
        $scope.nemsisLocation = "dVehicle/" + $scope.object.attributes.dVehicle.id;
    },

    //Patient Setup
    $scope.patientSetup = function(){
        //Date Picker setup
        if(!$scope.object.attributes.dob){
            $scope.object.attributes.dob = new Date();
        }
        $scope.format = 'MM/dd/yyyy';
        $scope.dateOptions = {
            startingDay: 1
        };
        $scope.open = function($event) {
            $scope.opened = true;
            $event.preventDefault();
            $event.stopPropagation();
        };

        $scope.addressTypeAhead = function(val){
            return GlobalService.addressTypeAhead(val);
        };

        $scope.setAddress = function(item){
            //First clear everything
            $scope.object.attributes.address = "";
            $scope.object.attributes.city = "";
            $scope.object.attributes.county = "";
            $scope.object.attributes.state = "";
            $scope.object.attributes.country = "";
            $scope.object.attributes.zip = "";

            item.address_components.forEach(function(component){
                switch (component.types[0]) {
                case "street_number":
                    $scope.object.attributes.address = component.long_name + " ";
                    break;
                case "route":
                    $scope.object.attributes.address += component.long_name;
                    break;
                case "administrative_area_level_3":
                    if($scope.object.attributes.city == ""){
                        $scope.object.attributes.city = component.long_name;
                    }
                    break;
                case "locality":
                    if($scope.object.attributes.city == ""){
                        $scope.object.attributes.city = component.long_name;
                    }
                case "sublocality_level_1":
                    if($scope.object.attributes.city == ""){
                        $scope.object.attributes.city = component.long_name;
                    }
                    break;
                case "administrative_area_level_2":
                    $scope.object.attributes.county = component.long_name;
                    break;
                case "administrative_area_level_1":
                    $scope.object.attributes.state = component.short_name;
                    break;
                case "country":
                    $scope.object.attributes.country = component.short_name;
                    break;
                case "postal_code":
                    $scope.object.attributes.zip = component.long_name;
                    break;
                }

            });
        };
    },

    $scope.userSetup = function(){
        $scope.hasNemsis = true;
        $scope.nemsisLocation = "dPersonnel/" + $scope.object.attributes.dPersonnel.id;

        ParseService.getNemsisElementCodes(["dPersonnel.24"], function(results){
            $scope.levels = results;
            $scope.$apply();
        });

        var agencyId = Parse.User.current().get('agencyId');
        ParseService.getRole(Parse.User.current(), function(result){
            if(result.attributes.name == "Admin"){
                $scope.roles = [
                    {name: "EMT", value: "EMT_" + agencyId},
                    {name: "Dispatcher", value: "Dispatcher_" + agencyId},
                    {name: "Manager", value: "Manager_" + agencyId},
                    {name: "Admin", value: "Admin"},
                    {name: "None", value: "None"}
                ];
            }
            else {
                $scope.roles = [
                    {name: "EMT", value: "EMT_" + agencyId},
                    {name: "Dispatcher", value: "Dispatcher_" + agencyId},
                    {name: "Manager", value: "Manager_" + agencyId},
                    {name: "None", value: "None"}
                ];
            }

            ParseService.getRole($scope.object, function(result){
                if(result){
                    $scope.object.attributes.role = result.attributes.name;
                    $scope.$apply();
                } else {
                    $scope.object.attributes.role = "None";
                    $scope.$apply();
                }
            });
        });
    },

    //Init Controller
    $scope.init();
};
