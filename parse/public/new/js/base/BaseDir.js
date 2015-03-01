//Base Directive
var BaseDirective = Class.extend({

    $scope:null,

    init:function(scope){
	this.$scope = scope;
	this.defineListeners();
    },

    defineListeners:function(){
	this.$scope.$on('$destroy',this.destroy.bind(this));
    },

    destroy:function(event){

    }
});
