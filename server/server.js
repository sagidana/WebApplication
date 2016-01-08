var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

app.use(express.static(__dirname));
server.listen(8080);

var _collectionName = "MesDB";
//require node modules (see package.json)
var mongodb = require('mongodb');
//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;
// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/MesDB';

// send the basic html (no attention to screen id..)
// http://localhost:8080/display?screen=1
app.get('/List', function (req, res) {
    console.log("display: " + req.query.screen);
    res.sendFile(__dirname + "/Views/List.html");
});

// send the basic html (no attention to screen id..)
// http://localhost:8080/display?screen=1
app.get('/display', function (req, res) {
    console.log("display: " + req.query.screen);
    res.sendFile(__dirname + "/Main.html");
});

// allow the user to add a Mes to screen i
// http://localhost:8080/update?screen=1
app.get('/update', function (req, res) {
    console.log("display: " + req.query.screen);
    res.sendFile(__dirname + "/Update.html");
});

// after the user get the basic html, a get request is send with the screen id
io.sockets.on('connection', function (socket) {

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
                //console.log("result:	"+JSON.stringify(result)+"\n\n\n\n");
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
function getDataFromDb(screenId, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        }
        // add else
        var collection = db.collection(_collectionName);
        //console.log("Connected to Database");

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