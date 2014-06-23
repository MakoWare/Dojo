//Utility Class for Dispatch

//Create Dispatch
function createDispatch(agencyId, userId, callback){
    var dispatch = Parse.Object.extend("Dispatch");

}


//Find Dispatches
function findDispatches(agencyId){
    var query = new Parse.Query("Dispatch");
    query.equalTo("agencyId", agencyId);



    return query;
}


//Save Disptach
function saveDispatch(dispatch, callback){


}
