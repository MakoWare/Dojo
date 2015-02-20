'use strict';

//Contact Controller
var ContactCtrl = function($rootScope, $scope, $location, ParseService, GlobalService, $modal){

    $scope.init = function(){
        GlobalService.showSpinner();
        $scope.$modal = $modal;
        $scope.ParseService = ParseService;
        var last = $location.url().split("/")[$location.url().split("/").length -1];

        if(last == "create"){
            $scope.action = "Create";
            $scope.title = "New Contact";
            $scope.createContact();
        } else {
            $scope.action = "Update";
            $scope.title = "Update";
            $scope.getContact(last);
        }
    };

    //Create Contact
    $scope.createContact = function(){
        $scope.contact = ParseService.createObject("Contact");
        $scope.setUpContact();
    };

    //Get Contact
    $scope.getContact = function(id){
        ParseService.getObjectById("Contact", id, function(results){
            if(results.id){
                console.log(results);
                $scope.contact = results;
                if(results.attributes.firstName && results.attributes.lastName){
                    $scope.fullName = results.attributes.firstName + " " + results.attributes.lastName;
                }
                $scope.setUpContact();
            } else {
                var newPath = "/contacts";
                $location.path(newPath);
                $scope.$apply();
            }
        });
    };

    //Setup Contact
    $scope.setUpContact = function(){
        //get Codes for Contact Type
        ParseService.findNemsisElementCodes("dContact.01", function(results){
            $scope.contactTypes = results;
            $scope.$apply();
            GlobalService.dismissSpinner();
        });
    };

    //Add Phone
    $scope.addPhone = function(){
        var phone = {};
        phone.type = "Work";
        $scope.contact.attributes.phoneNumbers.push(phone);
    },

    //Add Email
    $scope.addEmail = function(){
        var email = {};
        email.type = "Work";
        $scope.contact.attributes.emails.push(email);
    },

    //Remove Phone
    $scope.removePhone = function(phone){
        for(var i = 0; i < $scope.contact.attributes.phoneNumbers.length; i++){
            if(phone == $scope.contact.attributes.phoneNumbers[i]){
                $scope.contact.attributes.phoneNumbers.splice(i, 1);
            }
        }
    },

    //Remove Email
    $scope.removeEmail = function(email){
        for(var i = 0; i < $scope.contact.attributes.emails.length; i++){
            if(email == $scope.contact.attributes.emails[i]){
                $scope.contact.attributes.emails.splice(i, 1);
            }
        }
    },


    //Save Contact
    $scope.saveContact = function(){
        console.log("saveContact()");
        console.log($scope.contact);

        GlobalService.showSpinner();
        ParseService.saveObject("Contact", $scope.contact, function(result){
            GlobalService.dismissSpinner();
            console.log(JSON.stringify(result));
            console.log(result);
        });
    };

    //Delete Contact
    $scope.deleteContact = function(){
        GlobalService.showSpinner();
        ParseService.deleteObject($scope.contact, "Contact", function(results){
            GlobalService.dismissSpinner();
            if(results.message != null){
                alert(GlobalService.errorMessage + results.message);
            } else {
                var newPath = "/contacts" ;
                $location.path(newPath);
                $scope.$apply();
            }
        });
    };


    //Init
    $scope.init();
};
