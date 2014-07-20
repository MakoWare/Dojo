//Global Service
angular.module('globalService', [])
    .factory('GlobalService', function(){

        var GlobalService = {

            getObjectType: function(url){
                switch (url){
                case "devices":
                    return "Device";
                    break;
                case "dispatches":
                    return "Dispatch";
                    break;
                case "facilities":
                    return "Facility";
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
                };
                return "Error";
            }

        };
        return GlobalService;
    });
