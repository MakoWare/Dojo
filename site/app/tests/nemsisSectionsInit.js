var NemsisSection = Parse.Object.extend("NemsisSection");
var NemsisElement = Parse.Object.extend("NemsisElement");
var NemsisHeader = Parse.Object.extend("NemsisHeader");

var initNemsisSections = function(){
    var version  = "002";
    var sections = ["dAgency", "dConfiguration", "dContact", "dCustomConfiguration", "dCustomResults", "dDevice", "dFacility", "dLocation", "dPersonnel", "dState", "dVehicle", "eAirway", "eArrest", "eCrew", "eCustomConfiguration", "eCustomResults", "eDevice", "eDispatch", "eDisposition", "eExam", "eHistory", "eInjury", "eLabs", "eMedications", "eNarrative",  "eOther", "eOutcome", "ePatient", "ePayment", "eProcedures", "eProtocols", "eRecord", "eResponse", "eScene", "eSituation", "eState", "eTimes", "eVitals"];

    sections.forEach(function(sectionName){
	//Get XML from Nemsis
	var dataUrl = "http://nemsis.org/media/XSD_v3/_nemsis_v3.3.4/3.3.4.CR1.140117/DEMEMS/DataDictionary/sections/" + sectionName + "." + version + ".xml";
	Parse.Cloud.run('getXML', {'url': dataUrl},{
	    success: function(results){
		var xmlDoc = $.parseXML(results.text);
		var xml = $(xmlDoc);
		var xmlSection = xml.find('section')[0];

		//Create 1st Level Section
		var section1 = new NemsisSection();
		section1.set('name', xmlSection.attributes.name.nodeValue);
		var promise1 = initNemsisSection(section1, xmlSection, function(results){
		    section1 = results;
		});

		//Create 2nd Level Sections
		var section2groups = [];
		for(var i = 0; i < xmlSection.childNodes.length; i++){
		    var node = xmlSection.childNodes[i];
		    if(node.nodeName == "group"){
			section2groups.push(node);
		    }
		}
		if(section2groups.length > 0){
		    //Create a new Section for each subgroup
		    section2groups.forEach(function(group){
			var section2 = new NemsisSection();
			section2.set('name', group.attributes.number.nodeValue);
			section2.set('max', group.attributes.maxOccurs.nodeValue);
			section2.set('min', group.attributes.minOccurs.nodeValue);

			//Create 3rd Level Sections
			var section3groups = [];
			for(var i = 0; i < group.childNodes.length; i++){
			    var node = group.childNodes[i];
			    if(node.nodeName == "group"){
				section3groups.push(node);
			    }
			}

			if(section3groups.length > 0){
			    //Create a new Section for each subgroup
			    section3groups.forEach(function(group){
				var section3 = new NemsisSection();
				section3.set('name', group.attributes.number.nodeValue);
				section3.set('max', group.attributes.maxOccurs.nodeValue);
				section3.set('min', group.attributes.minOccurs.nodeValue);



				//Create 4th Level Sections
				var section4groups = [];
				for(var i = 0; i < group.childNodes.length; i++){
				    var node = group.childNodes[i];
				    if(node.nodeName == "group"){
					section4groups.push(node);
				    }
				}

				if(section4groups.length > 0){
				    section4groups.forEach(function(group){
					var section4 = new NemsisSection();
					section4.set('name', group.attributes.number.nodeValue);
					section4.set('max', group.attributes.maxOccurs.nodeValue);
					section4.set('min', group.attributes.minOccurs.nodeValue);

					var promise4 = initNemsisSection(section4, group, function(results){
					    section3.add('sections', results);
					    section3.save();
					});
				    });
				}

				var promise3 = initNemsisSection(section3, group, function(results){
				    section2.add('sections', results);
				    section2.save();
				});
			    });
			}

			var promise2 = initNemsisSection(section2, group, function(results){
			    section1.add('sections', results);
			    section1.save();
			});
		    });
		}
	    },
	    error: function(error){
		console.log(error);
	    }
	});
    });
}

//Init a NemsisSection
var initNemsisSection = function(section, xml, callback){
    var elementNumbers = [];
    for(var i = 0; i < xml.childNodes.length; i++){
	var node = xml.childNodes[i];
    	if(node.nodeName == "element"){
	    elementNumbers.push(node.attributes.number.nodeValue);
	}
    }
    var query = new Parse.Query(NemsisHeader);
    query.containedIn('ElementNumber', elementNumbers);
    var promise = query.find({
	success: function(results){
	    return results;
	},
	error: function(error){
	    console.log(error);
	}
    }).then(function(results){
	if(results.length > 0){
	    section.set('headers', results);
	} else {
            var headers = [];
            section.set('headers', headers);
        }
	section.save(null, {
	    success: function(result){
		callback(result);
	    },
	    error: function(object, error){
		console.log(error);
	    }
	});
    })
    return promise;
}

//Init a Section
var initSection = function(name){
    var query = new Parse.Query(NemsisSection);
    query.equalTo("name", name);
    query.include("headers");
    query.include("sections.headers");
    query.include("sections.sections.headers");
    return query.find({
        success: function(results){
            return results;
        },
        error: function(error){
            console.log(error);
        }
    });
}

//Init single Section
var initSingleSection = function(name){
   var query = new Parse.Query(NemsisSection);
    query.equalTo("name", name);
    query.include("headers");
    return query.find({
        success: function(results){
            return results;
        },
        error: function(error){
            console.log(error);
        }
    });
}

//Fill NemsisElements
var fillElements = function(nemsisSection, agencyId){
    if(nemsisSection.get('headers') != undefined){
        nemsisSection.get('headers').forEach(function(header){
            var element = new NemsisElement();
            element.set('title', header.get('ElementNumber'));
            element.set('agencyId', agencyId);
            nemsisSection.add('elements', element);
        });
    }
    if(nemsisSection.get('sections') != undefined){
        nemsisSection.get('sections').forEach(function(nemsisSection){
            if(nemsisSection.get('headers') != undefined){
                nemsisSection.get('headers').forEach(function(header){
                    var element = new NemsisElement();
                    element.set('title', header.get('ElementNumber'));
                    element.set('agencyId', agencyId);
                    nemsisSection.add('elements', element);
                });
            }
            if(nemsisSection.get('sections') != undefined){
                nemsisSection.get('sections').forEach(function(nemsisSection){
                    if(nemsisSection.get('headers') != undefined){
                        nemsisSection.get('headers').forEach(function(header){
                            var element = new NemsisElement();
                            element.set('title', header.get('ElementNumber'));
                            element.set('agencyId', agencyId);
                            nemsisSection.add('elements', element);
                        });
                    }
                });
            }
        });
    }
    return nemsisSection;
}

//Convert a NemsisSection to a Section
var convertNemsisSection = function(nemsisSection, agencyId){
    var section = new Section();
    section.set('agencyId', agencyId);
    section.set('elements', nemsisSection.get('elements'));
    section.set('headers', nemsisSection.get('headers'));
    section.set('name', nemsisSection.get('name'));
    section.set('max', nemsisSection.get('max'));
    section.set('min', nemsisSection.get('min'));

    if(nemsisSection.get('sections') != undefined){
        nemsisSection.get('sections').forEach(function(nemsisSection1){
            var section1 = new Section();
            if(nemsisSection1.get('sections') != undefined){
                nemsisSection1.get('sections').forEach(function(nemsisSection2){
                    var section2 = new Section();
                    section2.set('sections', nemsisSection2.get('sections'));
                    section2.set('elements', nemsisSection2.get('elements'));
                    section2.set('headers', nemsisSection2.get('headers'));
                    section2.set('name', nemsisSection2.get('name'));
                    section2.set('max', nemsisSection2.get('max'));
                    section2.set('min', nemsisSection2.get('min'));
		    section2.set('agencyId', agencyId);
                    section2.save().then(function(section2){
                        section1.add('sections', section2);
                    });
                });
            }
            section1.set('elements', nemsisSection1.get('elements'));
            section1.set('headers', nemsisSection1.get('headers'));
            section1.set('name', nemsisSection1.get('name'));
            section1.set('max', nemsisSection1.get('max'));
            section1.set('min', nemsisSection1.get('min'));
	    section1.set('agencyId', agencyId);
            section1.save().then(function(section1){
                section.add('sections', section1);
            });
        });
    }
    return section;
}
