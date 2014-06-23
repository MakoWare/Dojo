//Utility Class for Device

//Create Device
function createDevice(agencyId, userId, callback){
    var device = Parse.Object.extend("Device");

}


//Find Devices
function findDevices(agencyId){
    var query = new Parse.Query("Device");
    query.equalTo("agencyId", agencyId);


    return query;
}


//Save Device
function saveDevice(dispatch, callback){


}
