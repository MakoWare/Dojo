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
        ParseService.createObject("Contact", function(results){
            setTimeout(function(){
                console.log(results);
                $scope.contact = results;
                $scope.setUpContact();
            }, 500);
        });
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
        //get Contact Types
        var query = new Parse.Query("NemsisElementCode");
        query.equalTo("elementNumber", "dContact.01");
        query.find({
            success: function(results){
                $scope.contactTypeCodes = results;
                results.forEach(function(code){
                    if(code.attributes.codeDescription == $scope.contact.attributes.type){
                        $scope.contact.attributes.type = code.attributes.code + " " + $scope.contact.attributes.type;
                        $scope.$apply();
                    }
                });
            },
            error: function(error){
                alert(GlobalService.errorMessage + error.message);
            }
        });
        $scope.$broadcast("gotContact");
        GlobalService.dismissSpinner();
    };


    //Save Contact
    $scope.saveContact = function(){
        console.log("saveContact()");
        GlobalService.showSpinner();

        var contact = $scope.contact;

        //Set EveryThing in dContact
        contact.attributes.dContact.attributes.elements.forEach(function(element){
            switch(element.attributes.title){
            case "dContact.01":
                element.set("value", contact.attributes.type);
                break;
            case "dContact.02":
                element.set("value", contact.attributes.lastName);
                break;
            case "dContact.03":
                element.set("value", contact.attributes.firstName);
                break;
            case "dContact.04":
                element.set("value", contact.attributes.middleInitial);
                break;
            case "dContact.05":
                element.set("value", contact.attributes.address);
                break;
            case "dContact.06":
                element.set("value", contact.attributes.city);
                break;
            case "dContact.07":
                element.set("value", contact.attributes.state);
                break;
            case "dContact.08":
                element.set("value", contact.attributes.zip);
                break;
            case "dContact.09":
                element.set("value", contact.attributes.country);
                break;
            case "dContact.10":
                element.set("value", contact.attributes.phone);
                break;
            case "dContact.11":
                element.set("value", contact.attributes.email);
                break;
            case "dContact.12":
                element.set("value", contact.attributes.web);
                break;
            }
        });

        //Set Everything in contact
        contact.set("firstName", contact.attributes.firstName);
        contact.set("middleInitial", contact.attributes.middleInitial);
        contact.set("lastName", contact.attributes.lastName);
        contact.set("phone", contact.attributes.phone);
        contact.set("email", contact.attributes.email);
        contact.set("type", contact.attributes.type.substr(contact.attributes.type.indexOf(" ") + 1));
        contact.set("address", contact.attributes.address);
        contact.set("city", contact.attributes.city);
        contact.set("state", contact.attributes.state);
        contact.set("country", contact.attributes.country);
        contact.set("zip", contact.attributes.zip);


        //First Save Each NemsisElement in each Section
        var sectionSavePromises = [];
        var elementSavePromises = [];

        //Elements in dContact.attributes.elements
        contact.attributes.dContact.attributes.elements.forEach(function(element){
            element.set("value", element.attributes.value);
            element.set("codeString", element.attributes.codeString);
            elementSavePromises.push(element.save());
        });

        //Elements in dContact.attributes.sections.attributes.elements
        contact.attributes.dContact.attributes.sections.forEach(function(section){
            section.attributes.elements.forEach(function(element){
                element.set("value", element.attributes.value);
                element.set("codeString", element.attributes.codeString);
                elementSavePromises.push(element.save());
            });
        });

        //After each NemsisElement has been saved, save Each Section
        Parse.Promise.when(elementSavePromises).then(function(){
            contact.attributes.dContact.attributes.sections.forEach(function(section){
                section.set("elements", section.attributes.elements);
                sectionSavePromises.push(section.save());
            });

            //After each Section has been saved, save dContact Section
            Parse.Promise.when(sectionSavePromises).then(function(){
                contact.attributes.dContact.set("sections", contact.attributes.dContact.attributes.sections);
                contact.attributes.dContact.set("elements", contact.attributes.dContact.attributes.elements);
                contact.attributes.dContact.save({
                    success: function(dContact){
                        //Now Save the Contact
                        contact.set("dContact", dContact);
                        contact.save({
                            success: function(contact){
                                GlobalService.showSpinner();
                                console.log(contact);
                                $location.path("/contacts");
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
