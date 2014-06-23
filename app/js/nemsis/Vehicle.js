//Utility Class for Vehicle

//Create Vehicle
function createVehicle(agencyId, userId, callback){
    var dispatch = Parse.Object.extend("Vehicle");

}


//Find Vehicles
function findVehicles(agencyId){
    var query = new Parse.Query("Vehicle");
    query.equalTo("agencyId", agencyId);



    return query;
}


//Save Vehicle
function saveVehicle(dispatch, callback){


}
