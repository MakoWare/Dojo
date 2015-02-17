Parse.Cloud.define("getXML", function(request, response) {
    var url = request.params.url;
    console.log(url);
    var promise = Parse.Cloud.httpRequest({
        method:'GET',
        url:url,
	success: function(results){
            response.success(results);
	},
	error: function(error){
	    response.error(error);
	}
    });
});




//Update A User
Parse.Cloud.define("modifyUser", function(request, response) {
    if (!request.user) {
        response.error("Must be signed in to call this Cloud Function.");
        return;
    }

    var query = new Parse.Query(Parse.Role);
    query.equalTo("users", request.user);
    query.first({
        success: function(result){
            var role = result.get('name').split("_")[0];
            if(role == "Manager" || role == "Admin"){
                Parse.Cloud.useMasterKey();

                var query = new Parse.Query(Parse.User);
                query.equalTo("objectId", request.params.id);
                query.first({
                    success: function(user) {
                        user.set("username", request.params.username);
                        user.set("firstName", request.params.firstName);
                        user.set("lastName", request.params.lastName);
                        user.set("phone", request.params.phone);
                        user.set("active", request.params.active);
                        user.set("licensureLevel", request.params.licensureLevel);
                        user.set("licenseId", request.params.licenseId);
                        user.setEmail(request.params.email);
                        user.save(null, {
                            success: function(anotherUser) {
                                response.success("Success");
                            },
                            error: function(gameScore, error) {
                                response.error(error);
                            }
                        });
                    },
                    error: function(error) {
                        response.error(error);
                    }
                });
            } else {
                response.error("Not Authorized");
            }
        },
        error: function(object, error){
            response.error(error);
        }
    });

});


Parse.Cloud.define("deleteUser", function(request, response) {
    if (!request.user) {
        response.error("Must be signed in to call this Cloud Function.");
        return;
    }

    var query = new Parse.Query(Parse.Role);
    query.equalTo("users", request.user);
    query.first({
        success: function(result){
            var role = result.get('name').split("_")[0];
            if(role == "Manager" || role == "Admin"){
                Parse.Cloud.useMasterKey();

                var query = new Parse.Query(Parse.User);
                query.equalTo("objectId", request.params.id);
                query.first({
                    success: function(user) {
                        user.destroy({
                            success: function(deletedUser) {
                                response.success("Success");
                            },
                            error: function(gameScore, error) {
                                response.error(error);
                            }
                        });
                    },
                    error: function(error) {
                        response.error(error);
                    }
                });
            } else {
                response.error("Not Authorized");
            }
        },
        error: function(object, error){
            response.error(error);
        }
    });

});
