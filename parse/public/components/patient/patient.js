'use strict';

//Patient Controller
var PatientCtrl = BaseController.extend({
    init: function($scope, $modal, PatientModel, Notifications){
        console.log("ContactCtrl");
        this.notifications = Notifications;
        this.patientModel = PatientModel;
        this.$modal = $modal;
        this.$scope = $scope;
        this._super($scope);

    },

    //Define Listeners
    defineListeners: function(){
        this.notifications.addEventListener(models.events.PATIENTS_LOADED, this.onPatientsLoaded.bind(this));
        this.$scope.patientButton = this.onPatientButtonClicked.bind(this);
        this.$scope.editPatient = this.editPatient.bind(this);
    },


    //Define Scope
    defineScope: function(){
        this.$scope.title = "Patients";
        this.$scope.buttonAction = "Add Patient";
        this.$scope.list = true;
        this.$scope.template = "/components/patient/patientList.html";
        this.patientModel.findPatientsByAgency();


        /*
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
         */
    },


    //Edit Patient Button Clicked
    editPatient: function(patient){
        this.patientModel.currentPatient = patient;
        this.$scope.template = "/components/patient/patientForm.html";
        this.$scope.list = false;
        this.$scope.title = "Update " + patient.attributes.firstName + " " + patient.attributes.lastName;
        this.$scope.buttonAction = "Back";
        this.$scope.patient = patient;
    },

    //On Patients Loaded
    onPatientsLoaded: function(){
        this.$scope.objects = this.patientModel.patients;
        this.$scope.$apply();
    },

    //On Patient Button Clicked
    onPatientButtonClicked: function(){
        if(this.$scope.list){
            this.createPatient();
        } else {
            this.back();
        }
    },

    //Create Patient
    createPatient: function(){
        this.$scope.list = false;
        this.$scope.title = "New Patient";
        this.$scope.buttonAction = "Back";
        this.$scope.template = "/components/patient/patientForm.html";
        //this.$scope.$apply();
    },

    //back
    back: function(){
        this.$scope.title = "Patients";
        this.$scope.buttonAction = "Add Patient";
        this.$scope.list = true;
        this.$scope.template = "/components/patient/patientList.html";
        this.patientModel.findPatientsByAgency();
        //this.$scope.$apply();
    }

});

PatientCtrl.$inject =  ['$scope', '$modal', 'PatientModel', 'Notifications'];
