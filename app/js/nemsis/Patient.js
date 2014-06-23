//Utility Class for Patient

//Create Patient
function createPatient(agencyId, userId, callback){
    var patient = Parse.Object.extend("Patient");

}


//Find Patients
function findPatients(agencyId){
    var query = new Parse.Query("Patient");
    query.equalTo("agencyId", agencyId);



    return query;
}


//Save Patient
function savePatient(patient, callback){


}
