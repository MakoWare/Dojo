'use strict';

//Contact List Controller
var ContactListCtrl = BaseController.extend({
    init: function($scope, ContactModel, Notifications){
        console.log("ContactListCtrl");
        this.notifications = Notifications;
        this.contactModel = ContactModel;
        this.$scope = $scope;
        this._super($scope);

        this.findContactsByAgency();
    },


    defineListeners: function(){
        console.log("defining listeners");
        this.notifications.addEventListener(models.events.CONTACTS_LOADED, this.onContactsLoaded.bind(this));
        this.notifications.addEventListener(components.events.DESTROY_COMPONENT, this.destroy.bind(this));

        $("#contactList").on("remove", this.destroy.bind(this));

    },

    //On Contacts Loaded
    onContactsLoaded: function(){
        console.log("onContactsLoaded");
        this.$scope.objects = this.contactModel.contacts;
        this.$scope.$apply();
    },


    //Find Contacts
    findContactsByAgency: function(){
        this.contactModel.findContactsByAgency();
    },

    //Destroy
    destroy: function(){
        console.log("destroy");
        this.notifications.removeEventListener(models.events.CONTACTS_LOADED, this.onContactsLoaded.bind(this));
    }


});

ContactListCtrl.$inject =  ['$scope', 'ContactModel', 'Notifications'];
