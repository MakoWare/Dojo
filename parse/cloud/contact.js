//Contact

var Contact  = {

    /* Update - This will be called in some Parse.onSave(), so after a User saves a Contact object

    */
    update: function(id, callback){
        var query = new Parse.Query("Contact");
        query.get(id,{
            success: function(contact){
                return contact;
            },
            error: function(error){
                callback(error);
            }
        }).then(function(contact){
            //1. Convert the contact object to the Enterprise OM
            var enterpriseContact = Contact.toEnterprise(contact);

            //2. Get the Enterprise Object to be Updated
            var query = new Parse.Query("ThePerson");
            query.equalTo("nemsisRef", contact.id);
            query.first({
                success: function(person){
                    return person;
                },
                error: function(error){
                    callback(error);
                }
            }).then(function(person){
                //3. Update the Enterprise Object - pretty much pseudo code from here on out, as I'm unsure of how "ThePerson" Class looks
                //Set the effectiveTo date of the current state
                var now = new Date();
                var currentState = person.attributes.states[0];
                currentState.effectiveTo = now;

                //Add the new updated state to the state array
                person.states.push(enterpriseContact);
                person.save({
                    success: function(person){
                        callback(person);
                    },
                    error: function(person, error){
                        callback(error);
                    }
                });
            });
        });
    },


    /* Remove - This will be called in some Parse.onSave(), i.e after a User removes a Contact

     What happens when User wants to Remove a Contact? is it still output in the Nemsis XML?

     */
    remove: function(id, callback){
        var query = new Parse.Query("ThePerson");
        query.equalTo("nemsisRef", id);
        query.first({
            success: function(person){
                return person;
            },
            error: function(error){
                callback(error);
            }
        }).then(function(person){
            //3. Update the Enterprise Object - pretty much pseudo code from here on out, as I'm unsure of how "ThePerson" Class looks            //Set the effectiveTo date of the current state
            var now = new Date();
            var currentState = person.attributes.states[0];
            currentState.effectiveTo = now;
            person.save({
                success: function(person){
                    callback(person);
                },
                error: function(person, error){
                    callback(error);
                }
            });
        });
    },



    //Convert to Enterprise
    toEnterprise: function(object, callback){
        //A terrible time here
    },

    //Convert to Nemsis
    toNemsis: function(object, callback){
        //A terrible time here
    }
};


/* When in CC

export Contact;

 */
