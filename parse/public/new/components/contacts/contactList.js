'use strict';

//Contact List Controller
var ContactListCtrl = BaseController.extend({
    init: function($scope, ContactModel, Notifications){
        console.log("ContactListCtrl");
        this.notifications = Notifications;
        this.contactModel = ContactModel;
        this.$scope = $scope;
        this._super($scope);

        this.contactModel.findContactsByAgency();
    },

    defineListeners: function(){
        this.notifications.addEventListener(models.events.CONTACTS_LOADED, this.onContactsLoaded.bind(this));
        $("#contactList").on("remove", this.destroy.bind(this));
    },

    //On Contacts Loaded
    onContactsLoaded: function(){
        this.$scope.objects = this.contactModel.contacts;
        this.$scope.$apply();
    },

    //Destroy
    destroy: function(){
        console.log("destroy");
        this.notifications.removeEventListener(models.events.CONTACTS_LOADED, this.onContactsLoaded.bind(this));
    }


});

ContactListCtrl.$inject =  ['$scope', 'ContactModel', 'Notifications'];
