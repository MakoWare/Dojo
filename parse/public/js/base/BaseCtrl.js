//Base Controller
var BaseController = Class.extend({

    $scope:null,


    init:function(scope){
	this.$scope = scope;
	this.defineListeners();
	this.defineScope();
    },


    /**
     * Initialize listeners needs to be overrided by the subclass.
     * Don't forget to call _super() to activate
     */
    defineListeners:function(){
	this.$scope.$on('$destroy',this.destroy.bind(this));
    },


    /**
     * Use this function to define all scope objects.
     * Give a way to instantaly view whats available
     * publicly on the scope.
     */
    defineScope:function(){
	//OVERRIDE
    },



    /**
     * Triggered when controller is about
     * to be destroyed, clear all remaining values.
     */
    destroy:function(event){
	//OVERRIDE
    }
});


BaseController.$inject = ['$scope'];
