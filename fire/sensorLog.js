module.exports.set = set;
module.exports.getMapData = getMapData;
module.exports.getAllSeverityLevel = getAllSeverityLevel;
module.exports.setSeverityLevel = setSeverityLevel;
module.exports.getAllSensorData = getAllSensorData;


var nodes = require('./nodesCollection.js');
var logger = require('./logger.js');
var moment = require('moment');

function timeStampFormat() {
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS ZZ');
};

function set(sensor){
      var sLevel = severityLevelCalc(sensor);
      sensorLog(sensor, sLevel);
      sensorUpdate(sensor, sLevel);
}

function sensorLog(sensor, sLevel){
  logger.info("updateAllSensor : { name : " + sensor.name + ", flameSensor : " +
  sensor.flameA + ", smokeSensor : " +
  sensor.gas + ", temperatureSensor : " + sensor.temp + ", severityLevel : " + sLevel + "}",
   {"timestamp" : timeStampFormat()});
}

function sensorUpdate(sensor, sLevel){
  nodes.updateAllSensor(sensor.name, sensor.flameA, sensor.gas, sensor.temp, sLevel);
}

function severityLevelCalc(sensor){
  return ((sensor.temp* 10) + sensor.gas + 1024 - sensor.flameA)/100;
}

function getAllSeverityLevel() {
    nodes.findAllSeverityLevel();
    return "findAllSeverityLevel.txt";
}

function getMapData() {
    nodes.findAllConnected();
    return "findAllConnected.txt";
}

function setSeverityLevel(){
    nodes.updateAllSeverityLevel(1);
}

exports.deleteLogFile = function() {
    var date = new Date();
    var beforeDate = new Date(Date.parse(date) - 7 * 1000 * 60 * 60 * 24);
    var formattedDate = moment(beforeDate).format('YYYY-MM-DD');

    var logFile = "./logs/app_" + formattedDate + ".log";
    var exceptionFile = "./logs/exception_" + formattedDate + ".log";

    if(statPath(logFile)) {
        fs.unlinkSync(logFile);
    } else {
        console.log("로그파일 없음");
    }

    if(statPath(exceptionFile)) {
        fs.ublinkSync(exceptionFile);
    } else {
        console.log("예외파일 없음");
    }
}

function statPath(path) {
  try {
    return fs.statSync(path);
  } catch (ex) {}
  return false;
}

function getAllSensorData() {
    nodes.findAllSensorData();
    return "findAllSensorData.txt";
}
