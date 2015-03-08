'use strict';

//Dispatch Controller
var DispatchCtrl = BaseController.extend({

    init: function($scope, $modal, DispatchModel, Notifications){
        console.log("ContactCtrl");
        this.notifications = Notifications;
        this.dispatchModel = DispatchModel;
        this.$modal = $modal;
        this.$scope = $scope;
        this._super($scope);


    },

    //Define Listeners
    defineListeners: function(){
        this.notifications.addEventListener(models.events.DISPATCHES_LOADED, this.onDispatchesLoaded.bind(this));

        $("#dispatchButton").on("click", this.onDispatchButtonClicked.bind(this));
        this.$scope.editDispatch = this.editDispatch.bind(this);
    },

    //Setup Dispatch
    defineScope: function(){
        this.$scope.title = "Dispatches";
        this.$scope.buttonAction = "Create Dispatch";
        this.$scope.list = true;
        this.$scope.template = "/components/dispatch/dispatchList.html";
        this.dispatchModel.findDispatchesByAgency();

        /*
        //Get Codes for Selects
        var promises = [];
        promises.push(ParseService.findNemsisElementCodes("eDispatch.01", function(results){
            $scope.complaints = results;
        }));

        promises.push(ParseService.findNemsisElementCodes("eDispatch.02", function(results){
            $scope.emds = results;
        }));

        promises.push(ParseService.findNemsisElementCodes("eDispatch.05", function(results){
            $scope.priorities = results;
        }));

        //Set up type Aheads
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

        Parse.Promise.when(promises).then(function(){
            $scope.$apply();
            GlobalService.dismissSpinner();
        });
        */
    },

    //Edit Dispatch Button Clicked
    editDispatch: function(dispatch){
        console.log("editDispatch");
        this.dispatchModel.currentDispatch = dispatch;
        this.$scope.template = "/components/dispatch/dispatchForm.html";
        this.$scope.list = false;
        this.$scope.title = "Update " + dispatch.attributes.firstName;
        this.$scope.buttonAction = "Back";
        this.$scope.dispatch = this.dispatchModel.currentDispatch;
    },

    //On Contact Button Clicked
    onDispatchButtonClicked: function(){
        if(this.$scope.list){
            this.createDispatch();
        } else {
            this.back();
        }
    },

    //create Dispatch
    createDispatch: function(){
        this.$scope.list = false;
        this.$scope.title = "New Dispatch";
        this.$scope.buttonAction = "Back";
        this.$scope.template = "/components/dispatch/dispatchForm.html";
        this.$scope.$apply();
    },

    //back
    back: function(){
        this.$scope.title = "Dispatches";
        this.$scope.buttonAction = "Create Dispatch";
        this.$scope.list = true;
        this.$scope.template = "/components/dispatch/dispatchList.html";
        this.dispatchModel.findDispatchesByAgency();
        this.$scope.$apply();
    },


    //On Dispatches Loaded
    onDispatchesLoaded: function(){
        this.$scope.objects = this.dispatchModel.dispatches;
        this.$scope.$apply();
    },

    //Destroy
    destroy: function(){
        console.log("destroy");
        this.notifications.removeEventListener(models.events.DISPATCHES_LOADED, this.onDispatchesLoaded.bind(this));
    },



    //Save Dispatch
    saveDispatch: function(){
        console.log("saveDispatch()");
        console.log($scope.dispatch);


        /*
        GlobalService.showSpinner();
        ParseService.saveObject("Dispatch", $scope.dispatch, function(result){
            GlobalService.dismissSpinner();
            console.log(JSON.stringify(result));
            console.log(result);
            $location.path("/dispatch");
            $scope.$apply();
        });
         */

    },

    //Delete Dispatch
    deleteDispatch: function(){
        /*
        GlobalService.showSpinner();
        ParseService.deleteObject($scope.dispatch, "Dispatch", function(results){
            GlobalService.dismissSpinner();
            if(results.message != null){
                alert(GlobalService.errorMessage + results.message);
            } else {
                var newPath = "/dispatch" ;
                $location.path(newPath);
                $scope.$apply();
            }
        });
         */
    }
});

DispatchCtrl.$inject =  ['$scope', '$modal', 'DispatchModel', 'Notifications'];
