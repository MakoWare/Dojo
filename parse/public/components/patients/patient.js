'use strict';

//Patients Controller
var PatientCtrl = function($rootScope, $scope, $location, ParseService, GlobalService, $modal){

    $scope.init = function(){
        GlobalService.showSpinner();
        $scope.$modal = $modal;
        $scope.ParseService = ParseService;
        var last = $location.url().split("/")[$location.url().split("/").length -1];

        if(last == "create"){
            $scope.action = "Create";
            $scope.title = "New Patient";
            $scope.createPatient();
        } else {
            $scope.action = "Update";
            $scope.title = "Update";
            $scope.getPatient(last);
        }
    };

    //Create Patient
    $scope.createPatient = function(){
        ParseService.createObject("Patient", function(results){
            console.log(results);
            $scope.patient = results;
            $scope.setUpPatient();
        });
    };

    //Get Patient
    $scope.getPatient = function(id){
        ParseService.getObjectById("Patient", id, function(results){
            if(results.id){
                console.log(results);
                $scope.patient = results;
                if(results.attributes.firstName && results.attributes.lastName){
                    $scope.fullName = results.attributes.firstName + " " + results.attributes.lastName;
                }
                $scope.$apply();
                $scope.setUpPatient();
            } else {
                var newPath = "/patients";
                $location.path(newPath);
                $scope.$apply();
            }
        });
    };

    //Setup Patient
    $scope.setUpPatient = function(){
        //Date Picker setup
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
            $scope.patient.attributes.address = "";
            $scope.patient.attributes.city = "";
            $scope.patient.attributes.county = "";
            $scope.patient.attributes.state = "";
            $scope.patient.attributes.country = "";
            $scope.patient.attributes.zip = "";

            item.address_components.forEach(function(component){
                switch (component.types[0]) {
                case "street_number":
                    $scope.patient.attributes.address = component.long_name + " ";
                    break;
                case "route":
                    $scope.patient.attributes.address += component.long_name;
                    break;
                case "administrative_area_level_3":
                    if($scope.patient.attributes.city == ""){
                        $scope.patient.attributes.city = component.long_name;
                    }
                    break;
                case "locality":
                    if($scope.patient.attributes.city == ""){
                        $scope.patient.attributes.city = component.long_name;
                    }
                case "sublocality_level_1":
                    if($scope.patient.attributes.city == ""){
                        $scope.patient.attributes.city = component.long_name;
                    }
                    break;
                case "administrative_area_level_2":
                    $scope.patient.attributes.county = component.long_name;
                    break;
                case "administrative_area_level_1":
                    $scope.patient.attributes.state = component.short_name;
                    break;
                case "country":
                    $scope.patient.attributes.country = component.short_name;
                    break;
                case "postal_code":
                    $scope.patient.attributes.zip = component.long_name;
                    break;
                }

            });
        };


        GlobalService.dismissSpinner();
    };



    //Save Patient
    $scope.savePatient = function(){
        GlobalService.showSpinner();

        //Set EveryThing
        var patient = $scope.patient;
        patient.set("firstName", patient.attributes.firstName);
        patient.set("lastName", patient.attributes.lastName);
        patient.set("middleInitial", patient.attributes.middleInitial);
        patient.set("phone", patient.attributes.phone);
        patient.set("email", patient.attributes.email);
        patient.set("ssn", patient.attributes.ssn);
        patient.set("dob", patient.attributes.dob);
        patient.set("gender", patient.attributes.gender);
        patient.set("race", patient.attributes.race);
        patient.set("address", patient.attributes.address);
        patient.set("city", patient.attributes.city);
        patient.set("state", patient.attributes.state);
        patient.set("zip", patient.attributes.zip);
        patient.set("county", patient.attributes.county);
        patient.set("country", patient.attributes.country);
        patient.set("comments", patient.attributes.comments);

        //Set NemsisElements
        patient.attributes.ePatient.attributes.elements.forEach(function(element){
            switch (element.attributes.title){
            case "ePatient.01":
                if(patient.id){
                    element.set("value", patient.id);
                }
                break;
            case "ePatient.05":
                element.set("value", patient.attributes.address);
                break;
            case "ePatient.06":
                element.set("value", patient.attributes.city);
                break;
            case "ePatient.07":
                element.set("value", patient.attributes.county);
                break;
            case "ePatient.08":
                element.set("value", patient.attributes.state);
                break;
            case "ePatient.09":
                element.set("value", patient.attributes.zip);
                break;
            case "ePatient.10":
                element.set("value", patient.attributes.county);
                break;
            case "ePatient.11":
                //TODO
                break;
            case "ePatient.12":
                element.set("value", patient.attributes.ssn);
                break;
            case "ePatient.13":
                element.set("value", patient.attributes.gender.split(" ")[0]);
                element.set("codeString", patient.attributes.gender.split(" ")[1]);
                break;
            case "ePatient.14":
                element.set("value", patient.attributes.race.split(" ")[0]);
                element.set("codeString", patient.attributes.race.split(" ")[1]);
                break;
            case "ePatient.17":
                element.set("value", patient.attributes.dob.toISOString());
                break;
            case "ePatient.18":
                element.set("value", patient.attributes.phone);
                break;
            case "ePatient.19":
                element.set("value", patient.attributes.email);
                break;
            case "ePatient.20":
                //TODO
                break;
            case "ePatient.21":
                //TODO
                break;
            };
        });


        //Name Group
        patient.attributes.ePatient.attributes.sections.forEach(function(section){
            if(section.attributes.name == "ePatient.PatientNameGroup"){
                var hasMiddle = false;
                section.attributes.elements.forEach(function(element){
                    switch (element.attributes.title){
                    case "ePatient.02":
                        element.set("value", patient.attributes.lastName);
                        break;
                    case "ePatient.03":
                        element.set("value", patient.attributes.firstName);
                        break;
                    case "ePatient.04":
                        element.set("value", patient.attributes.middleInitial);
                        hasMiddle = true;
                        break;
                    }
                });

                if(patient.attributes.middleInitial != "" && !hasMiddle){
                    ParseService.createEmptyNemsisElement("ePatient.04", function(element){
                        element.set("value", patient.attributes.middleInitial);
                        section.attributes.elements.push(element);
                    });
                }
            } else {
                section.attributes.elements.forEach(function(element){
                    if(element.title == "ePatient.15"){
                        var ageDifMs = Date.now() - patient.attributes.dob.getTime();
                        var ageDate = new Date(ageDifMs); // miliseconds from epoch
                        var age =  Math.abs(ageDate.getUTCFullYear() - 1970);
                        element.set("value", age);
                        patient.set("age", age);
                    } else {
                        element.set("value", "2516009");
                        element.set("codeString", "Years");
                    }
                });
            }
        });

        //First Save Each NemsisElement in each Section
        var sectionSavePromises = [];
        var elementSavePromises = [];

        //Elements in ePatient.attributes.elements
        patient.attributes.ePatient.attributes.elements.forEach(function(element){
            elementSavePromises.push(element.save());
        });

        //Elements in ePatient.attributes.sections.attributes.elements
        patient.attributes.ePatient.attributes.sections.forEach(function(section){
            section.attributes.elements.forEach(function(element){
                element.set("value", element.attributes.value);
                element.set("codeString", element.attributes.codeString);
                elementSavePromises.push(element.save());
            });
        });

        //After each NemsisElement has been saved, save Each Section
        Parse.Promise.when(elementSavePromises).then(function(){
            patient.attributes.ePatient.attributes.sections.forEach(function(section){
                section.set("elements", section.attributes.elements);
                sectionSavePromises.push(section.save());
            });

            //After each Section has been saved, save ePatient Section
            Parse.Promise.when(sectionSavePromises).then(function(){
                patient.attributes.ePatient.set("sections", patient.attributes.ePatient.attributes.sections);
                patient.attributes.ePatient.set("elements", patient.attributes.ePatient.attributes.elements);
                patient.attributes.ePatient.save({
                    success: function(ePatient){
                        //Now Save the Patient
                        patient.set("ePatient", ePatient);
                        patient.save({
                            success: function(patient){
                                GlobalService.dismissSpinner();
                                var newPath = "/patients" ;
                                $location.path(newPath);
                                $scope.$apply();
                            },
                            error: function(object, error){
                                console.log(error);
                                alert(GlobalService.errorMessage + error.message);
                            }
                        });
                    },
                    error: function(object, error){
                        console.log(error);
                        alert(GlobalService.errorMessage + error.message);
                    }
                });
            });
        });

    };

    //Delete Patient
    $scope.deletePatient = function(){
        GlobalService.showSpinner();
        ParseService.deleteObject($scope.patient, "Patient", function(results){
            GlobalService.dismissSpinner();
            if(results.message != null){
                alert(GlobalService.errorMessage + results.message);
            } else {
                $location.path("/patients");
                $scope.$apply();
            }
        });
    };


    //Init
    $scope.init();
};
