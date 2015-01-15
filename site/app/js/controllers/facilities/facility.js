'use strict';

//Facility Controller
var FacilityCtrl = function($rootScope, $scope, $location, ParseService, GlobalService, $modal){

    $scope.init = function(){
        GlobalService.showSpinner();
        $scope.$modal = $modal;
        $scope.ParseService = ParseService;
        var last = $location.url().split("/")[$location.url().split("/").length -1];

        if(last == "create"){
            $scope.action = "Create";
            $scope.title = "New Facility";
            $scope.createFacility();
        } else {
            $scope.action = "Update";
            $scope.title = "Update";
            $scope.getFacility(last);
        }
    };

    //Create Facility
    $scope.createFacility = function(){
        console.log("creating");
        ParseService.createObject("Facility", function(results){
            console.log(results);
            $scope.facility = results;
            $scope.setUpFacility();
        });
    };

    //Get Facility
    $scope.getFacility = function(id){
        ParseService.getObjectById("Facility", id, function(results){
            if(results.id){
                console.log(results);
                $scope.facility = results;
                if(results.attributes.name){
                    $scope.fullName = results.attributes.name;
                }
                $scope.$apply();
                $scope.setUpFacility();
            } else {
                var newPath = "/facilities";
                $location.path(newPath);
                $scope.$apply();
            }
        });
    };

    //Setup Facility
    $scope.setUpFacility = function(){

        $scope.addressTypeAhead = function(val){
            return GlobalService.addressTypeAhead(val);
        };

        $scope.setAddress = function(item){
            //First clear everything
            $scope.facility.attributes.address = "";
            $scope.facility.attributes.city = "";
            $scope.facility.attributes.county = "";
            $scope.facility.attributes.state = "";
            $scope.facility.attributes.country = "";
            $scope.facility.attributes.zip = "";

            item.address_components.forEach(function(component){
                switch (component.types[0]) {
                case "street_number":
                    $scope.facility.attributes.address = component.long_name + " ";
                    break;
                case "route":
                    $scope.facility.attributes.address += component.long_name;
                    break;
                case "administrative_area_level_3":
                    if($scope.facility.attributes.city == ""){
                        $scope.facility.attributes.city = component.long_name;
                    }
                    break;
                case "locality":
                    if($scope.facility.attributes.city == ""){
                        $scope.facility.attributes.city = component.long_name;
                    }
                    break;
                case "administrative_area_level_2":
                    $scope.facility.attributes.county = component.long_name;
                    break;
                case "administrative_area_level_1":
                    $scope.facility.attributes.state = component.short_name;
                    break;
                case "country":
                    $scope.facility.attributes.country = component.short_name;
                    break;
                case "postal_code":
                    $scope.facility.attributes.zip = component.long_name;
                    break;
                }
            });
        };

        $scope.$broadcast("gotFacility");
        GlobalService.dismissSpinner();
    };



    //Save Facility
    $scope.saveFacility = function(){
        GlobalService.showSpinner();
        GlobalService.showSpinner();

        //Set EveryThing
        var facility = $scope.facility;

        facility.set("name", facility.attributes.name);
        facility.set("type", facility.attributes.type);
        facility.set("address", facility.attributes.address);
        facility.set("city", facility.attributes.city);
        facility.set("state", facility.attributes.state);
        facility.set("county", facility.attributes.county);
        facility.set("zip", facility.attributes.zip);
        facility.set("country", facility.attributes.country);
        facility.set("comments", facility.attributes.comments);


        //Set Nemsis Elements
        var facilityGroup = facility.attributes.dFacility;
        facilityGroup.attributes.elements.forEach(function(element){
            switch (element.attributes.title){
            case "dFacility.02":
                element.set("value", facility.get("name"));
                break;
            case "dFacility.03":

                break;
            case "dFacility.04":

                break;
            case "dFacility.05":

                break;
            case "dFacility.06":

                break;
            case "dFacility.07":
                element.set("value", facility.get("address"));
                break;
            case "dFacility.08":
                element.set("value", facility.get("city"));
                break;
            case "dFacility.09":
                element.set("value", facility.get("state"));
                break;
            case "dFacility.10":
                element.set("value", facility.get("zip"));
                break;
            case "dFacility.11":
                element.set("value", facility.get("county"));
                break;
            case "dFacility.12":
                element.set("value", facility.get("country"));
                break;
            case "dFacility.13":

                break;
            case "dFacility.14":

                break;

            };
        });

        //First Save Each NemsisElement in each Section
        var elementSavePromises = [];

        //Get NemsisElement save promises
        facility.attributes.dFacility.attributes.elements.forEach(function(element){
            elementSavePromises.push(element.save());
        });

        //After each NemsisElement has been saved
        Parse.Promise.when(elementSavePromises).then(function(){
            facility.attributes.dFacility.save({
                success: function(dFacility){

                    //Now Save the Facility
                    facility.set("dFacility", dFacility);
                    facility.save({
                        success: function(facility){
                            GlobalService.dismissSpinner();
                            var newPath = "/facilities" ;
                            $location.path(newPath);
                            $scope.$apply();
                        },
                        error: function(object, error){
                            GlobalService.dismissSpinner();
                            alert(GlobalService.errorMessage + error.message);
                            console.log(error);
                        }
                    });
                },
                error: function(object, error){
                    GlobalService.dismissSpinner();
                    alert(GlobalService.errorMessage + error.message);
                    console.log(error);
                }
            });
        });


        GlobalService.dismissSpinner();

    };

    //Delete Facility
    $scope.deleteFacility = function(){
        GlobalService.showSpinner();
        ParseService.deleteObject($scope.facility, "Facility", function(results){
            GlobalService.dismissSpinner();
            if(results.message != null){
                alert(GlobalService.errorMessage + results.message);
            } else {
                var newPath = "/facilities" ;
                $location.path(newPath);
                $scope.$apply();
            }
        });
    };


    //Init
    $scope.init();
};
