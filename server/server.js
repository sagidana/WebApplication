var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

app.use("/Bootstrap", express.static(__dirname + "/bower_components/"));
app.use(express.static(__dirname + "/public"));
app.use("/Views", express.static(__dirname + "/Views"));
app.use("/Templates", express.static(__dirname + "/Templates"));
server.listen(8080);

var _collectionName = "messagesCollection";
//require node modules (see package.json)
var mongodb = require('mongodb');
//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;
// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/MessagesDb';

console.log("Server on.");

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/Views/index.html");
});

// send the basic html
// http://localhost:8080/Edit?name=mes1
app.get('/Item', function (req, res) {
    res.sendFile(__dirname + "/Views/Item.html");
});

// send the basic html
// http://localhost:8080/Edit?name=mes1
app.get('/Create', function (req, res) {
    res.sendFile(__dirname + "/Views/Create.html");
});

// send the basic html
// http://localhost:8080/Edit?name=mes1
app.get('/Edit', function (req, res) {
    res.sendFile(__dirname + "/Views/Edit.html");
});

// send the basic html (no attention to screen id..)
// http://localhost:8080/List
app.get('/List', function (req, res) {
    res.sendFile(__dirname + "/Views/List.html");
});

// send the basic html
// http://localhost:8080/display?screen=1
app.get('/display', function (req, res) {
    console.log("display: " + req.query.screen);
    res.sendFile(__dirname + "/Views/Display.html");
});

// allow the user to add a Mes to screen i
// http://localhost:8080/update?screen=1
app.get('/update', function (req, res) {
    console.log("update: " + req.query.screen);
    res.sendFile(__dirname + "/Views/Update.html");
});


// after the user get the basic html, a get request is send with the screen id
io.sockets.on('connection', function (socket) {

    socket.on('askMessages',function(){
        getMessages(function (result) {
            var data = result;
            socket.emit('getMessages', data);
        });
    });

    socket.on('askScreens',function(){
        getScreens(function (screens) {
            socket.emit('getScreens', screens);
        });
    });

    socket.on('askTemplates',function(){
        getTemplates(function (templates) {
            socket.emit('getTemplates', templates);
        });
    });

    socket.on('askMessage',function(messageName){
        getMessage(messageName, function (message) {
            socket.emit('getMessage', message);
        });
    });

    // the server will get the data from DB and send back to user as 'result'
    socket.on('getdata', function (screenId) {

       getDataFromDb(screenId, function (result) {
            var data = result;
            //console.log("date:	"+data);
            socket.emit('displayData', data);
        });
    }); // socket on connect

    // recive new mess from the update page
    socket.on('update', function (message, screenId) {
        //console.log("message: "+JSON.stringify(message)+"\n\n\n\n");

        // add to db
        addMesToDb(message, screenId, function () {
                // emit to screen
                getDataFromDb(screenId, function (result) {
                io.sockets.emit('updateData', result);
            });
        });
    });
}); // sock.on

function addMesToDb(message, screenId, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        }
        else {
            var collection = db.collection(_collectionName);
            //console.log("Connected to Database");

            collection.insert(message, function (err, records) {
                if (err) {
                    console.log("Error: " + err);

                } else {
                    console.log("Record added: " + JSON.stringify(message) + "\n\n\n\n");
                    callback();
                    //Close connection
                    db.close();
                }
            });
        }
    });
};

function getTemplates(callback){
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        }

        var templatesCollection = db.collection("templatesCollection");
        templatesCollection.find().toArray(function (err, result) {

            if (err) {
                console.log("Error: " + err);

            } else if (result.length) {
                console.log("Sending result");
                callback(result);
            } else {
                console.log("No document(s) found");
            }

            db.close();
        });
    });
}

function getScreens(callback){
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        }

        var screensCollection = db.collection("screensCollection");
        screensCollection.find().toArray(function (err, result) {

            if (err) {
                console.log("Error: " + err);

            } else if (result.length) {
                console.log("Sending result");
                callback(result);
            } else {
                console.log("No document(s) found");
            }

            db.close();
        });
    });
}

function getMessage(messageName, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        }
        var collection = db.collection(_collectionName);

        collection.findOne({name: messageName}, function(err, message) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
            }
            else {
                callback(message);
            }
            db.close();
        });

    });
};

function getMessages(callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        }

        var collection = db.collection(_collectionName);
        collection.find().toArray(function (err, result) {

            if (err) {
                console.log("Error: " + err);

            } else if (result.length) {
                console.log("Sending result");
                callback(result);
            } else {
                console.log("No document(s) found");
            }

            db.close();
        });
    });
};

function getDataFromDb(screenId, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        }
        // add else
        var collection = db.collection(_collectionName);
        //console.log("Connected to Database");
        console.log(screenId);
        collection.find({ screen: screenId }).toArray(function (err, result) {
            if (err) {
                console.log("Error: " + err);

            } else if (result.length) {
                //console.log('Found: ', result);
                console.log("Sending result to screen: " + screenId);
                callback(result);
            } else {
                console.log("No document(s) found");
            }
            //Close connection
            db.close();
        });
    });
};