//Admin Controller
var AdminCtrl = function($scope, $location, GlobalService, ParseService){


    //Create Test "Users"
    $scope.createTestObjects = function(){
        //Test, Using Token object because it's blank already.
        var testObject = new Parse.Object("Token");

        //Set up user POJO
        var user = {};
        user.name = "tyler";
        user.phoneNumbers = [];

        //Phone numbers
        var phoneNumber1 = 5555;
        var phoneType1 = "mobile";

        var phoneNumber2 = 7777;
        var phoneType2 = "home";

        //Need to assoc type with #, so you need an object
        var phoneGroup1 = {};
        phoneGroup1.number = phoneNumber1;
        phoneGroup1.type = phoneType1;

        var phoneGroup2 = {};
        phoneGroup2.number = phoneNumber2;
        phoneGroup2.type = phoneType2;

        user.phoneNumbers.push(phoneGroup1);
        user.phoneNumbers.push(phoneGroup2);


        //Set test data
        testObject.set("name", user.name);
        testObject.set("phoneNumbers", user.phoneNumbers);

        console.log("user");
        console.log(user);

        console.log("testObject");
        console.log(testObject);

        testObject.save({
            success: function(result){
                console.log(result);
            },
            error: function(object, error){
                console.log(error);
            }
        });
    };



    /*Test One - Find a User with a specific phone number.

     Result - Fail
     Reason - Dot notation can only be used on objects, so because the data is stored in arrays it is no longer queryable
     */
    $scope.queryTestObjects = function(){
        var query = new Parse.Query("Token"); //Pretend Token is User Object
        query.equalTo("phoneNumbers.number", "5555");
        query.find({
            success: function(result){
                console.log(result);
            },
            error: function(error){
                console.log(error);
            }
        });

    };


    //$scope.queryTestObjects();
    //$scope.createTestObjects();

};
