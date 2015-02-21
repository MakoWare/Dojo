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
        $scope.facility = ParseService.createObject("Facility");
        console.log($scope.facility);
        $scope.setUpFacility();
    };

    //Get Facility
    $scope.getFacility = function(id){
        ParseService.getObjectById("Facility", id, function(results){
            if(results.id){
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

        var codePromises = [];
        codePromises.push(ParseService.findNemsisElementCodes("dFacility.01", function(results){
            $scope.facilityTypes = results;
        }));

        codePromises.push(ParseService.findNemsisElementCodes("dFacility.04", function(results){
            $scope.hospitalDesignations = results;
        }));

        Parse.Promise.when(codePromises).then(function(){
            GlobalService.dismissSpinner();
            $scope.$apply();
        });
    };


    //Save Facility
    $scope.saveFacility = function(){
        console.log("saveFacility");
        console.log($scope.facility);
        GlobalService.showSpinner();
        ParseService.saveObject("Facility", $scope.facility, function(result){
            GlobalService.dismissSpinner();
            console.log(result);
            $location.path("/facilities");
            $scope.$apply();
        });
    };

    //Delete Facility
    $scope.deleteFacility = function(){
        GlobalService.showSpinner();
        ParseService.deleteObject($scope.facility, "Facility", function(results){
            GlobalService.dismissSpinner();
            if(results.message != null){
                alert(GlobalService.errorMessage + results.message);
            } else {
                $location.path("/facilities");
                $scope.$apply();
            }
        });
    };


    //Init
    $scope.init();
};
