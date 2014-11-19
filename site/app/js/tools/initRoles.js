/*

 Initialize Roles for Dojo

 Admin - has access to everything
 Manager - has access to everything in his Agency
 Dispatcher - has access to everything in /dispatch
 EMT - has access to Ipad

*/
var initRoles = function(){
    var roleACL = new Parse.ACL();
    roleACL.setPublicReadAccess(true);


    var emt = new Parse.Role("EMT", roleACL);
    var dispatcher = new Parse.Role("Dispatcher", roleACL);
    var manager = new Parse.Role("Manager", roleACL);
    var admin = new Parse.Role("Administrator", roleACL);

    admin.save({
        success: function(admin){
            manager.getRoles().add(admin);
            manager.save({
                success: function(manager){
                    dispatcher.getRoles().add(manager);
                    dispatcher.getRoles().add(admin);
                    dispatcher.save({
                        success: function(dispatcher){
                            emt.getRoles().add(admin);
                            emt.getRoles().add(dispatcher);
                            emt.getRoles().add(manager);
                            emt.save({
                                success: function(emt){
                                    console.log("initRoles() success");
                                },
                                error: function(admin, error){
                                    console.log(error);
                                }
                            });
                        },
                        error: function(manager, error){
                            console.log(error);
                        }
                    });
                },
                error: function(dispatcher, error){
                    console.log(error);
                }
            });
        },
        error: function(emt, error){
            console.log(error);
        }
    });
};
