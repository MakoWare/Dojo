'use strict';

//Contact Controller
var ContactCtrl = BaseController.extend({
    init: function($scope, $modal, ContactModel, Notifications){
        console.log("ContactCtrl");
        this.notifications = Notifications;
        this.contactModel = ContactModel;
        this.$modal = $modal;
        this.$scope = $scope;
        this._super($scope);


        if(this.contactModel.currentContact){
            this.$scope.title = this.contactModel.currentContact.attributes.firstName;

        } else {
            this.$scope.title = "New Contact";
            this.contactModel.createContact();
        }
        //this.contactModel.findContactsByAgency();
    },

    defineListeners: function(){
        $("#contactListButton").on("click", this.onBackButtonClick.bind(this));
    },

    onBackButtonClick: function(){
        this.notifications.notify(components.events.SWAP_COMPONENT, "contactList", "/components/contacts/contactList.html");
    },

    //Create Contact
    createContact: function(){
        $scope.contact = ParseService.createObject("Contact");
        console.log($scope.contact);
        $scope.setUpContact();
    },

    //Get Contact
    getContact: function(id){
        ParseService.getObjectById("Contact", id, function(results){
            if(results.id){
                console.log(results);
                $scope.contact = results;
                if(results.attributes.firstName && results.attributes.lastName){
                    $scope.fullName = results.attributes.firstName + " " + results.attributes.lastName;
                }
                $scope.setUpContact();
            } else {
                alert(GlobalService.errorMessage + "Could not find Contact");
                var newPath = "/contacts";
                $location.path(newPath);
                $scope.$apply();
            }
        });
    },

    //Setup Contact
    setUpContact: function(){
        $scope.addressTypeAhead = function(val){
            return GlobalService.addressTypeAhead(val);
        };

        $scope.setAddress = function(item){
            //First clear everything
            $scope.contact.attributes.address = "";
            $scope.contact.attributes.city = "";
            $scope.contact.attributes.county = "";
            $scope.contact.attributes.state = "";
            $scope.contact.attributes.country = "";
            $scope.contact.attributes.zip = "";

            item.address_components.forEach(function(component){
                switch (component.types[0]) {
                case "street_number":
                    $scope.contact.attributes.address = component.long_name + " ";
                    break;
                case "route":
                    $scope.contact.attributes.address += component.long_name;
                    break;
                case "administrative_area_level_3":
                    if($scope.contact.attributes.city == ""){
                        $scope.contact.attributes.city = component.long_name;
                    }
                    break;
                case "locality":
                    if($scope.contact.attributes.city == ""){
                        $scope.contact.attributes.city = component.long_name;
                    }
                    break;
                case "administrative_area_level_2":
                    $scope.contact.attributes.county = component.long_name;
                    break;
                case "administrative_area_level_1":
                    $scope.contact.attributes.state = component.short_name;
                    break;
                case "country":
                    $scope.contact.attributes.country = component.short_name;
                    break;
                case "postal_code":
                    $scope.contact.attributes.zip = component.long_name;
                    break;
                }
            });
        };

        //get Codes for Contact Type
        ParseService.findNemsisElementCodes("dContact.01", function(results){
            $scope.contactTypes = results;
            $scope.$apply();
            GlobalService.dismissSpinner();
        });
    },

    //Add Phone
    addPhone: function(){
        var phone = {};
        phone.type = "Work";
        $scope.contact.attributes.phoneNumbers.push(phone);
    },

    //Add Email
    addEmail: function(){
        var email = {};
        email.type = "Work";
        $scope.contact.attributes.emails.push(email);
    },

    //Remove Phone
    removePhone: function(phone){
        for(var i = 0; i < $scope.contact.attributes.phoneNumbers.length; i++){
            if(phone == $scope.contact.attributes.phoneNumbers[i]){
                $scope.contact.attributes.phoneNumbers.splice(i, 1);
            }
        }
    },

    //Remove Email
    removeEmail: function(email){
        for(var i = 0; i < $scope.contact.attributes.emails.length; i++){
            if(email == $scope.contact.attributes.emails[i]){
                $scope.contact.attributes.emails.splice(i, 1);
            }
        }
    },

    //Save Contact
    saveContact: function(){
        console.log("saveContact()");
        console.log($scope.contact);

        GlobalService.showSpinner();
        ParseService.saveObject("Contact", $scope.contact, function(result){
            GlobalService.dismissSpinner();
            console.log(JSON.stringify(result));
            console.log(result);
            $location.path("/contacts");
            $scope.$apply();
        });
    },

    //Delete Contact
    deleteContact: function(){
        GlobalService.showSpinner();
        ParseService.deleteObject($scope.contact, "Contact", function(results){
            GlobalService.dismissSpinner();
            if(results.message){
                alert(GlobalService.errorMessage + results.message);
            } else {
                $location.path("/contacts");
                $scope.$apply();
            }
        });
    }

});

ContactCtrl.$inject =  ['$scope', '$modal', 'ContactModel', 'Notifications'];
