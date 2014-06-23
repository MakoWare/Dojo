//Utility Class for User

//Create User
function createUser(agencyId, userId, callback){
    var user = Parse.Object.extend("User");

}


//Find Users
function findUsers(agencyId){
    var query = new Parse.Query("User");
    query.equalTo("agencyId", agencyId);



    return query;
}


//Save User
function saveUser(user, callback){


}
