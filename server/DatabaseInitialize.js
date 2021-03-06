//require node modules (see package.json)
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/MessagesDb';

var messages = [
    {
        "name": "init",
        "text": [
            "This is the title of the page",
            "Sudden she seeing garret far regard. By hardly it direct if pretty up regret.",
            "Ability thought enquire settled prudent you sir. Or easy knew sold on well come year.",
            "Something consulted age extremely end procuring. Collecting preference he inquietude projection me in by."
        ],
        "images": [
            "/images/bannerO.jpg",
            "/images/bannerB.jpg"
        ],
        "template": "tempA.html",
        "dispTimeSec": 10000,
        "TimeFrame": [
            {
                "FromDate": new Date(2015,1,1),
                "ToDate": new Date(2016,12,31),
                "days": [true, true, true, true, true, true, true],
                "FromTime": new Date(1000,1,1,1,0,0),
                "ToTime": new Date(1000,1,1,23,59,0)
            }
        ],
        "screen": [0]
    },
    {
        "name": "mes1",
        "text": [
            "This is the title of the page",
            "Sudden she seeing garret far regard. By hardly it direct if pretty up regret.",
            "Ability thought enquire settled prudent you sir. Or easy knew sold on well come year.",
            "Something consulted age extremely end procuring. Collecting preference he inquietude projection me in by."
        ],
        "images": [
            "/images/bannerO.jpg",
            "/images/bannerB.jpg"
        ],
        "template": "tempA.html",
        "dispTimeSec": 2000,
        "TimeFrame": [
            {
                "FromDate": new Date(2015,1,1),
                "ToDate": new Date(2016,12,31),
                "days": [true, false,false,false,false,false,false],
                "FromTime": new Date(1000,1,1,6,0,0),
                "ToTime": new Date(1000,1,1,12,30,0)
            },
            {
                "FromDate": new Date(2015,1,1),
                "ToDate": new Date(2016,12,31),
                "days": [false, false, true, false,false, false, false],
                "FromTime": new Date(1000,1,1,13,0,0),
                "ToTime": new Date(1000,1,1,20,00,0)
            }

        ],
        "screen": [1,2]
    },
    {
        "name": "mes2",
        "text": [
            "This is the title of the page",
            "Sudden she seeing garret far regard. By hardly it direct if pretty up regret.",
            "Ability thought enquire settled prudent you sir. Or easy knew sold on well come year.",
            "Something consulted age extremely end procuring. Collecting preference he inquietude projection me in by.",
            "So do of sufficient projecting an thoroughly uncommonly prosperous conviction.",
            "Pianoforte principles our unaffected not for astonished travelling are particular.",
            "Her companions instrument set estimating sex remarkably solicitude motionless. Property men the why smallest graceful day insisted required.",
            "Inquiry justice country old placing sitting any ten age. Looking venture justice in evident in totally he do ability.",
            "Be is lose girl long of up give. Trifling wondered unpacked ye at he.",
            "In household certainty an on tolerably smallness difficult. Many no each like up be is next neat."
        ],
        "images": [
            "/images/bannerG.jpg"
        ],
        "template": "tempB.html",
        "dispTimeSec": 5000,
        "TimeFrame": [
            {
                "FromDate": new Date(2015,1,1),
                "ToDate": new Date(2016,12,31),
                "days": [true, true, true, true, true, true, true],
                "FromTime": new Date(1000,1,1,1,0,0),
                "ToTime": new Date(1000,1,1,23,59,0)
            }
        ],
        "screen": [1,3]
    },
    {
        "name": "mes3",
        "text": [
        ],
        "images": [
        ],
        "template": "tempC.html",
        "dispTimeSec": 3000,
        "TimeFrame": [
            {
                "FromDate": new Date(2015,1,1),
                "ToDate": new Date(2016,12,31),
                "days": [true, true, true, true, true, true, true],
                "FromTime": new Date(1000,1,1,1,0,0),
                "ToTime": new Date(1000,1,1,23,59,0)
            }
        ],
        "screen": [2,3]
    },
    {
        "name": "mes4",
        "text": [
            "This is the title of the page",
            "Sudden she seeing garret far regard. By hardly it direct if pretty up regret."
        ],
        "images": [
        ],
        "template": "tempA.html",
        "dispTimeSec": 4000,
        "TimeFrame": [
            {
                "FromDate": new Date(2015,1,1),
                "ToDate": new Date(2016,12,31),
                "days": [true, true, true, true, true, true, true],
                "FromTime": new Date(1000,1,1,1,0,0),
                "ToTime": new Date(1000,1,1,23,59,0)
            }
        ],
        "screen": [1]
    },
    {
        "name": "mes5",
        "text": [
            "This is the title of the page",
            "Sudden she seeing garret far regard. By hardly it direct if pretty up regret.",
            "Ability thought enquire settled prudent you sir. Or easy knew sold on well come year.",
            "Something consulted age extremely end procuring. Collecting preference he inquietude projection me in by.",
            "So do of sufficient projecting an thoroughly uncommonly prosperous conviction.",
            "Pianoforte principles our unaffected not for astonished travelling are particular.",
            "Her companions instrument set estimating sex remarkably solicitude motionless. Property men the why smallest graceful day insisted required."
        ],
        "images": [
            "/images/bannerB.jpg",
            "/images/bannerG.jpg"
        ],
        "template": "tempB.html",
        "dispTimeSec": 2000,
        "TimeFrame": [
            {
                "FromDate": new Date(2015,1,1),
                "ToDate": new Date(2016,12,31),
                "days": [true, true, true, true, true, true, true],
                "FromTime": new Date(1000,1,1,1,0,0),
                "ToTime": new Date(1000,1,1,23,59,0)
            }
        ],
        "screen": [3]
    }
];

var templates = [
    {
        "path": "tempA.html"
    },
    {
        "path": "tempB.html"
    },
    {
        "path": "tempC.html"
    }
];

var screens = [
    {
        "number": 1,
        "location": "Beer Sheva"
    },
    {
        "number": 2,
        "location": "Tel Aviv"
    },
    {
        "number": 3,
        "location": "Rishon"
    },
    {
        "number": 0,
        "location": "Ramat Gan"
    }
];

currentDate = new Date();
dateString = currentDate.getDate() + "-" + currentDate.getMonth() + "-" + currentDate.getFullYear();
dateString = new Date(2015,1,2).getDate() + "-" + new Date(2015,1,2).getMonth() + "-" + new Date(2015,1,2).getFullYear();


var statistics = [
    {
        "screenNum": 1,
        "tempPath" : "tempA.html",
        "messageName" : "mes1",
        "displayTime" : 5000,
        "date" : new Date(2015,1,4).getDate() + "-" + new Date(2015,1,4).getMonth() + "-" + new Date(2015,1,4).getFullYear(),
        "time" : new Date(1000,1,1,23,0,0)
    },
    {
        "screenNum": 2,
        "tempPath" : "tempB.html",
        "messageName" : "mes2",
        "displayTime" : 5000,
        "date" : new Date(2015,1,5).getDate() + "-" + new Date(2015,1,5).getMonth() + "-" + new Date(2015,1,5).getFullYear(),
        "time" : new Date(1000,1,1,14,59,0)
    },
    {
        "screenNum": 3,
        "tempPath" : "tempC.html",
        "messageName" : "mes3",
        "displayTime" : 5000,
        "date" : new Date(2015,1,2).getDate() + "-" + new Date(2015,1,2).getMonth() + "-" + new Date(2015,1,2).getFullYear(),
        "time" : new Date(1000,1,1,10,0,0)
    }
];

MongoClient.connect(url, function (err, db) {

    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
        console.log('Connection established to', url);

        var messagesCollection = db.collection('messagesCollection');
	    for ( var index = 0; index <messages.length; index++){
            messagesCollection.insert(messages[index],function(err,result){
			    if (err) {
				    console.log("1 "+err);
			    } else {
				    console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
			    }
		    });
	    }

        var screensCollection = db.collection('screensCollection');
        for ( var index = 0; index <screens.length; index++){
            screensCollection.insert(screens[index],function(err,result){
                if (err) {
                    console.log("1 "+err);
                } else {
                    console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
                }
            });
        }

        var templatesCollection = db.collection('templatesCollection');
        for ( var index = 0; index <templates.length; index++){
            templatesCollection.insert(templates[index],function(err,result){
                if (err) {
                    console.log("1 "+err);
                } else {
                    console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
                }

                if (index == templates.length - 1){
                    db.close();
                    console.log("Done!");
                }
            });
        }

        var statisticsCollection = db.collection('statisticsCollection');
        for ( var index = 0; index <statistics.length; index++){
            statisticsCollection.insert(statistics[index],function(err,result){
                if (err) {
                    console.log("1 "+err);
                } else {
                    console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
                }

                if (index == statistics.length - 1){
                    db.close();
                    console.log("Done!");
                }
            });
        }
    }
});