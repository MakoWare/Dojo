'use strict';

var MainCtrl = BaseController.extend({

    _notifications:null,
    _notesModel:null,

    init:function($scope){
	this._super($scope);
    },

    //@Override
    defineListeners:function(){
	this._super();
    },


    //@Override
    //Declare scope here
    defineScope:function(){
	//Useless... for demo purpose
	this.$scope.instance="NotesController";
    },

    //@Override
    destroy:function(){

    }
});

MainCtrl.$inject = ['$scope'];
