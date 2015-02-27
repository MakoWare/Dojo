'use strict';

//Contact List Controller
var ContactListCtrl = function($rootScope, $scope, $location, ParseService, GlobalService, $modal){
    $scope.init = function(){
        console.log("ContactListCtrl");
        //$scope.showSpinner();
        $scope.objects = [];
        $scope.spinner = null;
        $scope.findContacts();

        $("#contactList").resizable({
            grid: 50,
            ghost: true,
            stop: function(event, ui){
                $scope.resize();
            }
        });

        $("#contactList").draggable({
            snap: true,
            containment: "#dashboard"
        });

        $scope.$on("dashboardResize", $scope.resize);

        $scope.resize();
    };


    //Find Contacts
    $scope.findContacts = function(){
        ParseService.findObjectsByAgency("Contact", function(results){
          //  $scope.dismissSpinner();
            console.log(results);
            $scope.$apply(function(){
                $scope.objects = results;
            });
        });
    };


    /* UI Stuff */

    //Show Spinner
    $scope.showSpinner = function(){
        var opts = {
            lines: 13, // The number of lines to draw
            length: 15, // The length of each line
            width: 10, // The line thickness
            radius: 20, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#000', // #rgb or #rrggbb or array of colors
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 999, // The z-index (defaults to 2000000000)
            top: '50%', // Top position relative to parent
            left: '50%' // Left position relative to parent
        };
        var target = $("#contactListContainer");
        $scope.spinner = new Spinner(opts).spin(target);
    };

    //Dismiss Spinner
    $scope.dismissSpinner = function(){
        $scope.spinner.stop();
        $("#overlay").toggle();
    };


    //Resize
    $scope.resize = function(h, w){
        if(h){
            $("#contactList").height(h);
        }
        if(w){
            $("#contactList").width(w);
        }

        if( $("#contactList").width() > $("#dashboard").width()){
            $("#contactList").width($("#dashboard").width());
        }

        $("#contactListContainer").height($("#contactList").height());
        $("#contactListContainer").width($("#contactList").width());

    };

    //Toggle Component
    $scope.toggleComponent = function(){
        if(!$scope.toggleComponent.init){
            $scope.toggleComponent.init = true;
            $scope.toggleComponent.isOpen = true;
            $scope.toggleComponent.componentHeight = $("#contactList").height();
            $scope.toggleComponent.containerHeight = $("#contactListContainer").height();
        }

        if($scope.toggleComponent.isOpen){
            $scope.toggleComponent.componentHeight = $("#contactList").height();
            $scope.toggleComponent.containerHeight = $("#contactListContainer").height();
            $("#contactList").height(60);
            $("#contactListContainer").height(50);
            $("#contactComponentBody").toggle();
            $scope.toggleComponent.isOpen = false;
        } else {
            $("#contactList").height($scope.toggleComponent.componentHeight);
            $("#contactListContainer").height($scope.toggleComponent.containerHeight);
            $("#contactComponentBody").toggle();
            $scope.toggleComponent.isOpen = true;
        }
    };


    //Full Size Component
    $scope.fullSizeComponent = function(){
        $scope.resize($("#dashboard").height(), $("#dashboard").width());
    };


    $scope.removeComponent = function(){
        console.log("broadcast");
        $rootScope.$broadcast("removeComponent", {id: "contactList"});
    };

    //Init
    $scope.init();
};
