var BaseController = Class.extend({
    $scope:null,

    init:function($scope){
	this.$scope = $scope;
	this.defineListeners();
	this.defineScope();
    },

    defineListeners:function(){
	this.$scope.$on('$destroy',this.destroy.bind(this));
    },

    defineScope:function(){
	//OVERRIDE : Create all scope properties here to keep track of them.
    },

    destroy:function(event){
	//OVERRIDE : Remove all listeners, all timeouts and intervals
    }
});

BaseController.$inject = ['$scope'];
