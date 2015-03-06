//Global Service
angular.module('globalService', [])
    .factory('GlobalService', function($http){

        var spinner;
        var GlobalService = {
            errorMessage: "An Error Occured, please contact us with this message: ",

            getObjectType: function(url){
                switch (url){
                case "contacts":
                    return "Contact";
                    break;
                case "devices":
                    return "Device";
                    break;
                case "dispatches":
                    return "Dispatch";
                    break;
                case "facilities":
                    return "Facility";
                    break;
                case "installations":
                    return "Installation";
                    break;
                case "patients":
                    return "Patient";
                    break;
                case "users":
                    return "User";
                    break;
                case "vehicles":
                    return "Vehicle";
                    break;
                case "pcrs":
                    return "PCR";
                    break;
                case "files":
                    return "File";
                    break;
                };
                return "Error";
            },

            showSpinner: function(element){
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
                var target = $(element);
                spinner = new Spinner(opts).spin(target);
            },

            dismissSpinner: function(){
                spinner.stop();
                $("#overlay").toggle();
            },


            addressTypeAhead: function(val) {
                return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
                    params: {
                        address: val,
                        sensor: false
                    }
                }).then(function(response){
                    return response.data.results.map(function(item){
                        return item;
                    });
                });
            }


        };
        return GlobalService;
    });
