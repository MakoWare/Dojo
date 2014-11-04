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
        var object = $scope.objectType.charAt(0).toLowerCase() + $scope.objectType.slice(1);
        var partialLocation = $scope.dir + "/" + object + ".html";
        return "partials/" + partialLocation;
    };

    //Save Object
    $scope.saveObject = function(){
        GlobalService.showSpinner();
        switch($scope.objectType){
        case "Dispatch":
            $scope.saveDispatch();
            break;
        case "Facility":
            $scope.saveFacility();
            break;
        case "Patient":
            $scope.savePatient();
            break;

        case "Vehicle":
            $scope.saveVehicle();
            break;
        }
    };

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


        for(var name in $scope.object.attributes) {
            $scope.object.set(name, $scope.object.attributes[name]);
        }

        $scope.object.save({
            success: function(result){
                GlobalService.dismissSpinner();
                $scope.object = result;
                console.log(result);
                alert("Object Updated Successfully");
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
        $scope.object.save({
            success: function(result){
                GlobalService.dismissSpinner();
                $scope.object = result;
                console.log(result);
                alert("Object Updated Successfully");
                $location.url("/facilites");
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
                console.log(result);
                alert("Object Updated Successfully");
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
        $scope.object.save({
            success: function(result){
                GlobalService.dismissSpinner();
                $scope.object = result;
                console.log(result);
                alert("Object Updated Successfully");
                $location.url("/vehicles");
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
            if(typeof results == "error"){
                alert(GlobalService.errorMessage + results.errorMessage); //Not Sure if this is right
            } else {
                alert("Object deleted Successfully");
                var newPath = "/" + $scope.dir;
                $location.path(newPath);
                $scope.$apply();
            }
        });
    };

    /** Begin to destroy nice and clean Controller here  **/
    $scope.setUp = function(){
        switch($scope.objectType){
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
        }

        GlobalService.dismissSpinner();
    },

    //Dispatch Setup
    $scope.dispatchSetup = function(){
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
        $scope.dispatch = {};
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
                console.log(results);
                return results;
            });
        };

        $scope.getFacilities = function(name){
            return ParseService.facilitiesTypeAhead(name, function(results){
                console.log(results);
                return results;
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
        };

        $scope.setDropOffFacilityInfo = function(facility){
            $scope.object.attributes.dropOffAddress = facility.attributes.address;
            $scope.object.attributes.dropOffCity = facility.attributes.city;
            $scope.object.attributes.dropOffZip = facility.attributes.zip;
            $scope.object.attributes.dropOffState = facility.attributes.state;
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
    },

    //Facility Setup
    $scope.facilitySetup = function(){
        $scope.hasNemsis = true;
        $scope.nemsisLocation = "dFacility/" + $scope.object.attributes.dFacility.id;
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
    },

    //Init Controller
    $scope.init();
};
