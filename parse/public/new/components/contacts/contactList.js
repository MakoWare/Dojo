'use strict';

//Contact List Controller
var ContactListCtrl = BaseController.extend({
    init: function($scope, ParseService, Notifications){
        console.log("ContactListCtrl");
        this.notifications = Notifications;
        this.$scope = $scope;
        this.ParseService = ParseService;
        this._super($scope);

        this.findContacts();
    },


    defineListeners: function(){

    },


    //Find Contacts
    findContacts: function(){
        var self = this;
        this.ParseService.findObjectsByAgency("Contact", function(results){
            console.log(results);
            self.$scope.$apply(function(){
                self.$scope.objects = results;
            });
        });
    },

});

ContactListCtrl.$inject =  ['$scope', 'ParseService', 'Notifications'];
