var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

var walk = require('walk');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/public/images');
    },
    filename: function (req, file, callback) {
        var date = new Date().getFullYear().toString() +'-'+ (new Date().getMonth()+1).toString() +'-'+ new Date().getDate().toString() +'-'+ new Date().getTime().toString();
        var name = date +'-'+ file.originalname;
        //console.log(name);
        callback(null, name); //needs to add random number + name of original file
    }
});
var upload = multer({ storage : storage}).any();

//var upload = multer({
//    dest:  __dirname + '/public/images',
//    limits: {
//        fieldNameSize: 50,
//        files: 1,
//        fields: 5,
//        fileSize: 1024 * 1024
//    },
//    onFileUploadStart: function (file) {
//        console.log('uploaading is starting ...');
//    },
//    rename: function(fieldname, filename,req,res) {
//        return 'temp';
//    },
//
//});

app.use("/Bootstrap", express.static(__dirname + "/bower_components/"));
app.use(express.static(__dirname + "/public"));
app.use("/Views", express.static(__dirname + "/Views"));
app.use("/Templates", express.static(__dirname + "/Templates"));
server.listen(8080);

var _collectionMessages = "messagesCollection";
var _collectionScreens = "screensCollection";
var _collactionTemplates = "templatesCollection";

//require node modules (see package.json)
var mongodb = require('mongodb');
//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;
// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/MessagesDb';

console.log("Server on.");

app.post('/upload',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });

    //upload
    //multer({
    //    onFileUploadComplete: function(file) {
    //        res.send();
    //    }
    //});
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/Views/index.html");
});

// send the basic html
// http://localhost:8080/Edit?name=mes1
app.get('/Item', function (req, res) {
    res.sendFile(__dirname + "/Views/Item.html");
});

app.get('/ScreensManagement', function (req, res) {
    res.sendFile(__dirname + "/Views/ScreensManagement.html");
});

app.get('/Screens', function (req, res) {
    res.sendFile(__dirname + "/Views/Screens.html");
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

    socket.on('askImages',function(){
        getImages(function (filesNames) {
            socket.emit('getImages', filesNames);
        });
    });

    socket.on('editMessage', function (message) {
        editMessage(message, function (result) {
            socket.emit('getStatus', result);
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

    socket.on('addMessage', function (message) {
        addMessage(message, function (result) {
            socket.emit('getStatus', result);
            io.sockets.emit('updateData');
        });
    });

    socket.on('addScreen', function(location){
        addScreen(location,function(result){
            socket.emit('getStatus', result);
        });
    });


    // recive new mess from the update page - not in use
    socket.on('addMessage2', function (message) {
        //console.log("message: "+JSON.stringify(message)+"\n\n\n\n");
        addMessage(message, function () {

            //getDataFromDb(screenId, function (result) {
              //  io.sockets.emit('updateData', result);
            //});

        });
    });
}); // sock.on

function addMessage(message, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        }
        else {
            var collection = db.collection(_collectionMessages);
            //console.log("Connected to Database");

            collection.insert(message, function (err, records) {
                if (err) {
                    //console.log("Error: " + err);
                    callback(err);
                } else {
                    //console.log("Record added: " + JSON.stringify(message) + "\n\n\n\n");
                    callback(records);
                }
                    //Close connection
                    db.close();

            });
        }
    });
};

function getImages(callback){
    var filesNames   = [];
// Walker options
    var walker  = walk.walk(__dirname + "/public/images", { followLinks: false });

    walker.on('file', function(root, stat, next) {
        // Add this file to the list of files
        filesNames.push("/images/"+stat.name);
        next();
    });

    walker.on('end', function() {
        callback(filesNames);
    });
}

function editMessage(message, callback) {
    delete message._id;

    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        }
        else {
            var messagesCollection = db.collection(_collectionMessages);

            messagesCollection.updateOne({
                "name": message.name
            },{
                $set : message
            }, function(err, result){

                if (err) {
                    callback(err);
                } else {
                    callback(result);
                }

                db.close();
            });
        }
    });
}

function getTemplates(callback){
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        }

        var templatesCollection = db.collection(_collactionTemplates);
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

        var screensCollection = db.collection(_collectionScreens);
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
        var collection = db.collection(_collectionMessages);

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

        var collection = db.collection(_collectionMessages);
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
        var collection = db.collection(_collectionMessages);
        //console.log("Connected to Database");

        console.log(screenId);

        collection.find({ screen: parseInt(screenId) }).toArray(function (err, result) {
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


function addScreen(location, callback){
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        }
        else {
            var collection = db.collection(_collectionScreens);

            collection.find().sort({number: -1}).limit(1).toArray(function (err, result) {
                if (err) {
                    console.log("Error: " + err);
                } else if (result.length) {

                    //console.log(result[0].number + 1);
                    var num = result[0].number + 1;

                    collection.insert({number:num, location: location}, function (err, records) {
                        if (err) {
                            //console.log("Error: " + err);
                            callback(err);
                        } else {
                            //console.log("Record added: " + JSON.stringify(message) + "\n\n\n\n");
                            callback(records);
                        }
                        //Close connection
                       // db.close();

                    });
                }
                db.close();
            });

        }

    });
};
