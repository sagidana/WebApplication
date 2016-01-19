var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

var walk = require('walk');
var multer = require('multer');

// For images
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/public/images');
    },
    filename: function (req, file, callback) {
        var date = new Date().getFullYear().toString() +'-'+ (new Date().getMonth()+1).toString() +'-'+ new Date().getDate().toString() +'-'+ new Date().getTime().toString();
        var name = date +'-'+ file.originalname;
        callback(null, name);
    }
});
var upload = multer({ storage : storage}).any();

// For templates
var storageTemplate = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/Templates');
    },
    filename: function (req, file, callback) {
        var date = new Date().getFullYear().toString() +'-'+ (new Date().getMonth()+1).toString() +'-'+ new Date().getDate().toString() +'-'+ new Date().getTime().toString();
        var name = date +'-'+ file.originalname;
        //console.log(name);

        callback(null, name);
    }
});
var uploadTemplate = multer({ storage : storageTemplate}).any();

app.use("/Bootstrap", express.static(__dirname + "/bower_components/"));
app.use(express.static(__dirname + "/public"));
app.use("/Views", express.static(__dirname + "/Views"));
app.use("/Templates", express.static(__dirname + "/Templates"));
server.listen(8080);

var _collectionMessages = "messagesCollection";
var _collectionScreens = "screensCollection";
var _collectionTemplates = "templatesCollection";
var _collectionStatistics = "statisticsCollection";

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
});

app.post('/uploadTemplate',function(req,res){
    uploadTemplate(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        //console.log(req);
        res.end(req.files[0].filename);
    });
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/Views/Index.html");
});

app.get('/Index', function (req, res) {
    res.sendFile(__dirname + "/Views/Index.html");
});

app.get('/Statistics', function (req, res) {
    res.sendFile(__dirname + "/Views/Statistics.html");
});

app.get('/Item', function (req, res) {
    res.sendFile(__dirname + "/Views/Item.html");
});

app.get('/Templates', function (req, res) {
    res.sendFile(__dirname + "/Views/Templates.html");
});

app.get('/ScreensManagement', function (req, res) {
    res.sendFile(__dirname + "/Views/ScreensManagement.html");
});

app.get('/About', function (req, res) {
    res.sendFile(__dirname + "/Views/About.html");
});

app.get('/Screens', function (req, res) {
    res.sendFile(__dirname + "/Views/Screens.html");
});

app.get('/Create', function (req, res) {
    res.sendFile(__dirname + "/Views/Create.html");
});

app.get('/Edit', function (req, res) {
    res.sendFile(__dirname + "/Views/Edit.html");
});

app.get('/List', function (req, res) {
    res.sendFile(__dirname + "/Views/List.html");
});

app.get('/display', function (req, res) {
    res.sendFile(__dirname + "/Views/Display.html");
});

app.get('/update', function (req, res) {
    res.sendFile(__dirname + "/Views/Update.html");
});


// after the user get the basic html, a get request is send with the screen id
io.sockets.on('connection', function (socket) {

    socket.on('askMessages', function () {
        getMessages(function (result) {
            var data = result;
            socket.emit('getMessages', data);
        });
    });

    socket.on('askScreens', function () {
        getScreens(function (screens) {
            socket.emit('getScreens', screens);
        });
    });

    socket.on('askTemplates', function () {
        getTemplates(function (templates) {
            socket.emit('getTemplates', templates);
        });
    });

    socket.on('askMessage', function (messageName) {
        getMessage(messageName, function (message) {
            socket.emit('getMessage', message);
        });
    });

    socket.on('askImages', function () {
        getImages(function (filesNames) {
            socket.emit('getImages', filesNames);
        });
    });

    socket.on('saveTemplate',function(path){
        addTemplate(path,function(result){
            socket.emit('getStatus', result);
        });
    });

    socket.on('editMessage', function (message) {
        editMessage(message, function (result) {
            socket.emit('getStatus', result);
        });
    });

    socket.on('getdata', function (screenId) {

        getDataFromDb(screenId, function (result) {
            var data = result;
            socket.emit('displayData', data);
        });
    }); // socket on connect

    socket.on('addMessage', function (message) {
        addMessage(message, function (result) {
            socket.emit('getStatus', result);
        });
    });

    socket.on('addScreen', function (location) {
        addScreen(location, function (result) {
            socket.emit('getStatus', result);
        });
    });

    socket.on('editScreen', function (screen) {
        editScreen(screen, function (result) {
            socket.emit('getStatus', result);
        });
    });

    socket.on('deleteScreen', function (screen) {
        deleteScreen(screen, function (result) {
            socket.emit('getStatus', result);
        });
    });

    socket.on('deleteMessage', function (message) {
        deleteMessage(message, function (result) {
            socket.emit('getStatus', result);
        });
    });

    socket.on('deleteTemplate', function (template) {
        deleteTemplate(template, function (result) {
            socket.emit('getStatus', result);
        });
    });

    socket.on('writeLog',function(log){
        writeLog(log);
    });

    socket.on('askMessagesStatistics',function(){
        askMessagesStatistics(function(result){
            socket.emit('getMessagesStatistics', result);
        });
    });

    socket.on('askScreensStatistics',function(){
        askScreensStatistics(function(result){
            socket.emit('getScreensStatistics', result);
        });
    });
});

function addMessage(message, callback) {
    for(var i=0; i<message.TimeFrame.length; i++)
        delete message.TimeFrame[i].$$hashKey;

    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        }
        else {
            var collection = db.collection(_collectionMessages);

            collection.insert(message, function (err, records) {
                if (err) {
                    callback(err);
                } else {
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

        var templatesCollection = db.collection(_collectionTemplates);
        templatesCollection.find().toArray(function (err, result) {

            if (err) {
                console.log("Error: " + err);

            } else if (result.length) {
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

        collection.find({ screen: parseInt(screenId) }).toArray(function (err, result) {
            if (err) {
                console.log("Error: " + err);

            } else if (result.length) {
                callback(result);
            } else {
                console.log("No document(s) found");
            }
            //Close connection
            db.close();
        });
    });
};

function editScreen(screen, callback){
    delete screen._id;
    delete screen.$$hashKey;

    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        }
        else {
            var collection = db.collection(_collectionScreens);

            collection.updateOne({
                "number": screen.number
            },{
                $set : screen
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
                    var num = result[0].number + 1;

                    collection.insert({number:num, location: location}, function (err, records) {
                        if (err) {
                            callback(err);
                        } else {
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

function deleteScreen(screen,callback){

    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        }
        else {
            var collection = db.collection(_collectionScreens);

            // .remove( { type : "food" }, 1 )
            collection.deleteOne({
                "number": screen.number,
                "location": screen.location
            },
            function(err, result){
                if (err) {
                    callback(err);
                } else {
                    callback(result);
                }
                db.close();
            });
        }
    });
};

function deleteMessage(message,callback){

    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        }
        else {
            var collection = db.collection(_collectionMessages);

            // .remove( { type : "food" }, 1 )
            collection.deleteOne({
                    "name": message.name
                },
                function(err, result){
                    if (err) {
                        callback(err);
                    } else {
                        callback(result);
                    }
                    db.close();
                });
        }
    });
};

function deleteTemplate(template, callback){
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        }
        else {
            var collection = db.collection(_collectionTemplates);

            // .remove( { type : "food" }, 1 )
            collection.deleteOne({
                    "path": template.path
                },
                function(err, result){
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

function addTemplate(path,callback){
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        }
        else {
            var collection = db.collection(_collectionTemplates);

            collection.insert({path:path}, function (err, records) {
                if (err) {
                    callback(err);
                } else {
                    callback(records, path);
                }
                //Close connection
                db.close();

            });
        }
    });
};

function writeLog(log){

    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        }
        else {
            var collection = db.collection(_collectionStatistics);

            collection.insert(log, function (err, records) {
                if (err) {
                   console.log("Error: " + err);
                }

                db.close();
            });
        }
    });

};

function askMessagesStatistics(callback){
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        }
        var collection = db.collection(_collectionStatistics);

        collection.aggregate([
            {
                $match:{}
            },
            {
                $group: {
                    _id: {
                        'Date': '$date',
                        'Message': '$messageName'
                    },
                    displayCount: {$sum: 1}
                }
            },
            {
                $group: {
                    _id: '$_id.Date',
                    Messages: {
                        $push: {
                            Message: '$_id.Message',
                            displayCount: '$displayCount'
                        }
                    },
                    messagesCount: {$sum: 1}
                }
            },
        ]).toArray(function(err, results){
            callback(results);

            db.close();
        });
    });
};

function askScreensStatistics(callback){
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        }
        var collection = db.collection(_collectionStatistics);

        collection.aggregate([
            {
                $match:{}
            },
            {
                $group: {
                    _id: {
                        'Date': '$date',
                        'Screen': '$screenNum'
                    },
                    messagesDisplayed: {$sum: 1}
                }
            },
            {
                $group: {
                    _id: '$_id.Date',
                    Screens: {
                        $push: {
                            Screen: '$_id.Screen',
                            messagesDisplayed: '$messagesDisplayed'
                        }
                    },
                    screensCount: {$sum: 1}
                }
            },
        ]).toArray(function(err, results){
            callback(results);

            db.close();
        });
    });
};





