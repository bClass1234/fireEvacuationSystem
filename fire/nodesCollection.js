var fs = require('fs');
var mongoose = require('mongoose');

// db connect
mongoose.connect('mongodb://localhost:27017/fireEvacuationSystem', { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log("mongo db connection OK.");
});


// nodes schema
var nodeSchema = mongoose.Schema({
    name : 'string',
    ip : 'string',
    category : 'string',
    location : 'string',
    sprinkler : 'string',
    firewall : 'string',
    flameSensor : 'number',
    smokeSensor : 'number',
    temperatureSensor : 'number',
    severityLevel : 'number',
    connected : [{node : 'string', dist : 'number'}]
});

var Node = mongoose.model("Node", nodeSchema);

//  모든 정보 가져오기
exports.findAllData = function() {
    Node.find({}, function(err, models){
        if(err) return console.error(err);
        fs.writeFileSync('AllData.txt', JSON.stringify(models), 'utf-8');
    })
};



// 모든 Document의 name, category, connected 가져오기
exports.findAllConnected = function() {
    Node.find({}, {"_id" : false, "name" : true, "category" : true, "connected" : true}, function(err, models){
        if(err) return console.error(err);
        fs.writeFileSync('findAllConnected.txt', JSON.stringify(models), 'utf-8');
    })
};


// 모든 Document의 name, flameSensor, smokeSensor, temperatureSensor 가져오기
exports.findAllSensorData = function() {
    Node.find({}, {"_id" : false, "name" : true, "flameSensor" : true,
                    "smokeSensor" : true, "temperatureSensor" : true}, function(err, models){
        if(err) return console.error(err);
        fs.writeFileSync('findAllSensorData.txt', JSON.stringify(models), 'utf-8');
    })
};




// 모든 Document의 severityLevel 가져오기
exports.findAllSeverityLevel = function() {
    Node.find({}, {"_id" : false, "name" : true, "severityLevel" : true}, function(err, models){
        if(err) return console.error(err);
        fs.writeFileSync('findAllSeverityLevel.txt', JSON.stringify(models), 'utf-8');
    })
};


// 특정 Document의 flameSensor 업데이트
exports.updateflameSensor = function(name, sensor) {
    Node.update({"name" : name}, {$set : {"flameSensor" : sensor}}, function(err, models){
        if(err) return console.error(err);
    })
};

// 특정 Document의 smokeSensor 업데이트
exports.updatesmokeSensor = function(name, sensor) {
    Node.update({"name" : name}, {$set : {"smokeSensor" : sensor}}, function(err, models){
        if(err) return console.error(err);
    })
};

// 특정 Document의 temperatureSensor 업데이트
exports.updatetemperatureSensor = function(name, sensor) {
    Node.update({"name" : name}, {$set : {"temperatureSensor" : sensor}}, function(err, models){
        if(err) return console.error(err);
    })
};

// 특정 Document의 Sensor 세가지, severityLevel 동시 업데이트
exports.updateAllSensor = function(name, fSensor, sSensor, tSensor, sLevel) {
    Node.updateMany({"name" : name}, {$set : {"flameSensor" : fSensor, "smokeSensor" : sSensor, "temperatureSensor" : tSensor, "severityLevel" : sLevel}}, function(err, models){
        if(err) return console.error(err);
    })
};

// 특정 Document의 severityLevel 업데이트
exports.updateseverityLevel = function(name, level) {
    Node.update({"name" : name}, {$set : {"severityLevel" : level}}, function(err, models){
        if(err) return console.error(err);
    })
};

// 모든 Document의 severityLevel 업데이트
exports.updateAllSeverityLevel = function(level) {
    Node.updateMany({}, {$set : {"severityLevel" : level}}, {"multi" : true}, function(err, models){
        if(err) return console.error(err);
    })
};
