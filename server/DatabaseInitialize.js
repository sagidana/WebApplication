//require node modules (see package.json)
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/MesDB';


var data = [
    {
        "name": "init",
        "text": {
            "text1": "This is the title of the page",
            "text2": "Sudden she seeing garret far regard. By hardly it direct if pretty up regret.",
            "text3": "Ability thought enquire settled prudent you sir. Or easy knew sold on well come year.",
            "text4": "Something consulted age extremely end procuring. Collecting preference he inquietude projection me in by.",
            "text5": "",
            "text6": "",
            "text7": "",
            "text8": "",
            "text9": "",
            "text10": ""
        },
        "img": {
            "image1": "/images/bannerO.jpg",
            "image2": "/images/bannerB.jpg",
            "image3": "",
            "image4": "",
            "image5": ""
        },
        "template": "tempA.html",
        "dispTimeSec": "10",
        "TimeFreame": [
            {
                "FromDate": "1.1.2015",
                "ToDate": "12.31.2016",
                "days": [ "0", "1", "2", "3", "4", "5", "6" ],
                "FromTime": "01:00",
                "ToTime": "23:59"
            }
        ],
        "screen": ["-1"]
    },
    {
        "name": "mes1",
        "text": {
            "text1": "This is the title of the page",
            "text2": "Sudden she seeing garret far regard. By hardly it direct if pretty up regret.",
            "text3": "Ability thought enquire settled prudent you sir. Or easy knew sold on well come year.",
            "text4": "Something consulted age extremely end procuring. Collecting preference he inquietude projection me in by.",
            "text5": "",
            "text6": "",
            "text7": "",
            "text8": "",
            "text9": "",
            "text10": ""
        },
        "img": {
            "image1": "/images/bannerO.jpg",
            "image2": "/images/bannerB.jpg",
            "image3": "",
            "image4": "",
            "image5": ""
        },
        "template": "tempA.html",
        "dispTimeSec": "2000",
        "TimeFreame": [
            {
                "FromDate": "1.1.2015",
                "ToDate": "12.31.2016",
                "days": ["1"],
                "FromTime": "06:00",
                "ToTime": "12:00"
            },
            {
                "FromDate": "1.1.2015",
                "ToDate": "12.31.2016",
                "days": [ 3 ],
                "FromTime": "13:00",
                "ToTime": "20:00"
            }

        ],
        "screen": ["1","2"]
    },
    {
        "name": "mes2",
        "text": {
            "text1": "This is the title of the page",
            "text2": "Sudden she seeing garret far regard. By hardly it direct if pretty up regret.",
            "text3": "Ability thought enquire settled prudent you sir. Or easy knew sold on well come year.",
            "text4": "Something consulted age extremely end procuring. Collecting preference he inquietude projection me in by.",
            "text5": "So do of sufficient projecting an thoroughly uncommonly prosperous conviction.",
            "text6": "Pianoforte principles our unaffected not for astonished travelling are particular.",
            "text7": "Her companions instrument set estimating sex remarkably solicitude motionless. Property men the why smallest graceful day insisted required.",
            "text8": "Inquiry justice country old placing sitting any ten age. Looking venture justice in evident in totally he do ability.",
            "text9": "Be is lose girl long of up give. Trifling wondered unpacked ye at he.",
            "text10": "In household certainty an on tolerably smallness difficult. Many no each like up be is next neat."
        },
        "img": {
            "image1": "/images/bannerG.jpg",
            "image2": "",
            "image3": "",
            "image4": "",
            "image5": ""
        },
        "template": "tempB.html",
        "dispTimeSec": "5000",
        "TimeFreame": [
            {
                "FromDate": "1.1.2015",
                "ToDate": "12.31.2016",
                "days": ["0", "1", "2", "3", "4", "5", "6"],
                "FromTime": "01:00",
                "ToTime": "23:59"
            }
        ],
        "screen": ["1","3"]
    },
    {
        "name": "mes3",
        "text": {
            "text1": "",
            "text2": "",
            "text3": "",
            "text4": "",
            "text5": "",
            "text6": "",
            "text7": "",
            "text8": "",
            "text9": "",
            "text10": ""
        },
        "img": {
            "image1": "",
            "image2": "",
            "image3": "",
            "image4": "",
            "image5": ""
        },
        "template": "tempC.html",
        "dispTimeSec": "3000",
        "TimeFreame": [
            {
                "FromDate": "1.1.2015",
                "ToDate": "12.31.2016",
                "days": ["0", "1", "2", "3", "4", "5", "6"],
                "FromTime": "01:00",
                "ToTime": "23:59"
            }
        ],
        "screen": ["2","3"]
    },
    {
        "name": "mes4",
        "text": {
            "text1": "This is the title of the page",
            "text2": "Sudden she seeing garret far regard. By hardly it direct if pretty up regret.",
            "text3": "",
            "text4": "",
            "text5": "",
            "text6": "",
            "text7": "",
            "text8": "",
            "text9": "",
            "text10": ""
        },
        "img": {
            "image1": "",
            "image2": "",
            "image3": "",
            "image4": "",
            "image5": ""
        },
        "template": "tempA.html",
        "dispTimeSec": "4000",
        "TimeFreame": [
            {
                "FromDate": "1.1.2015",
                "ToDate": "12.31.2016",
                "days": ["0", "1", "2", "3", "4", "5", "6"],
                "FromTime": "01:00",
                "ToTime": "23:59"
            }
        ],
        "screen": ["1"]
    },
    {
        "name": "mes5",
        "text": {
            "text1": "This is the title of the page",
            "text2": "Sudden she seeing garret far regard. By hardly it direct if pretty up regret.",
            "text3": "Ability thought enquire settled prudent you sir. Or easy knew sold on well come year.",
            "text4": "Something consulted age extremely end procuring. Collecting preference he inquietude projection me in by.",
            "text5": "So do of sufficient projecting an thoroughly uncommonly prosperous conviction.",
            "text6": "Pianoforte principles our unaffected not for astonished travelling are particular.",
            "text7": "Her companions instrument set estimating sex remarkably solicitude motionless. Property men the why smallest graceful day insisted required.",
            "text8": "",
            "text9": "",
            "text10": ""
        },
        "img": {
            "image1": "/images/bannerB.jpg",
            "image2": "/images/bannerG.jpg",
            "image3": "",
            "image4": "",
            "image5": ""
        },
        "template": "tempB.html",
        "dispTimeSec": "2000",
        "TimeFreame": [
            {
                "FromDate": "1.1.2015",
                "ToDate": "12.31.2016",
                "days": ["0", "1", "2", "3", "4", "5", "6"],
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