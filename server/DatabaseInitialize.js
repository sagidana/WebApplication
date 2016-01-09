//require node modules (see package.json)
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/MesDB';


var data = [
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
        "dispTimeSec": "10",
        "TimeFrame": [
            {
                "FromDate": "1.1.2015",
                "ToDate": "12.31.2016",
                "days": [true, true, true, true, true, true, true],
                "FromTime": "01:00",
                "ToTime": "23:59"
            }
        ],
        "screen": ["-1"]
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
        "dispTimeSec": "2000",
        "TimeFrame": [
            {
                "FromDate": "1.1.2015",
                "ToDate": "12.31.2016",
                "days": [true, false,false,false,false,false,false],
                "FromTime": "06:00",
                "ToTime": "12:00"
            },
            {
                "FromDate": "1.1.2015",
                "ToDate": "12.31.2016",
                "days": [false, false, true, false,false, false, false],
                "FromTime": "13:00",
                "ToTime": "20:00"
            }

        ],
        "screen": ["1","2"]
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
        "dispTimeSec": "5000",
        "TimeFrame": [
            {
                "FromDate": "1.1.2015",
                "ToDate": "12.31.2016",
                "days": [true, true, true, true, true, true, true],
                "FromTime": "01:00",
                "ToTime": "23:59"
            }
        ],
        "screen": ["1","3"]
    },
    {
        "name": "mes3",
        "text": [
        ],
        "images": [
        ],
        "template": "tempC.html",
        "dispTimeSec": "3000",
        "TimeFrame": [
            {
                "FromDate": "1.1.2015",
                "ToDate": "12.31.2016",
                "days": [true, true, true, true, true, true, true],
                "FromTime": "01:00",
                "ToTime": "23:59"
            }
        ],
        "screen": ["2","3"]
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
        "dispTimeSec": "4000",
        "TimeFrame": [
            {
                "FromDate": "1.1.2015",
                "ToDate": "12.31.2016",
                "days": [true, true, true, true, true, true, true],
                "FromTime": "01:00",
                "ToTime": "23:59"
            }
        ],
        "screen": ["1"]
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
        "dispTimeSec": "2000",
        "TimeFrame": [
            {
                "FromDate": "1.1.2015",
                "ToDate": "12.31.2016",
                "days": [true, true, true, true, true, true, true],
                "FromTime": "01:00",
                "ToTime": "23:59"
            }
        ],
        "screen": ["3"]
    }
];


MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {    
    console.log('Connection established to', url);

    // Get the documents collection
    var collection = db.collection('MesDB');

	for ( var i in data){
		
		//console.log( typeof data[i]);
		
		collection.insert(data[i],function(err,result){
			 if (err) {
				console.log("1 "+err);
			  } else {
				console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
			  }
			//Close connection
			if ( i == data.length){
				db.close();
				console.log("Done!");
			}
		});
	}
  }
});