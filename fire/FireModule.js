module.exports.set = set;
module.exports.checkExit = checkExit;
module.exports.removeNode= removeNode;
module.exports.reBuild = reBuild;
module.exports.reset = reset;

var Graph = require('node-dijkstra');

var route = new Graph();// 노드 그래프 (초기화후 remove호출하여 상태변경)
var exitArr = new Array();//출구 정보 배열
var disNode = new Array();// 비활성화 노드 배열

var mapData;

function reset(){
  for(var i = 0 ; i<mapData.length ; i++){
    var obj = {};
    for(var j = 0 ;j<mapData[i].connected.length;j++){
      var node = map[i].connected[j];
      var name ={node}.node.node;
      var dist ={node}.node.dist;
      obj[name] = dist;
    }
    route.addNode(mapData[i].name, obj);
    if((mapData[i].category) == ('exit')){
      exitArr.push(mapData[i]);
    }
  }
}

function set(map){
  mapData = map;
  // ---------------------맵 정보 초기화 -----------------
  for(var i = 0 ; i<map.length ; i++){
    var obj = {};
    for(var j = 0 ;j<map[i].connected.length;j++){
      var node = map[i].connected[j];
      var name ={node}.node.node;
      var dist ={node}.node.dist;
      obj[name] = dist;
  }
    route.addNode(map[i].name, obj);
    if((map[i].category) == ('exit')){
      exitArr.push(map[i]);
    }
  }
}

function reBuild(nodeName){

   for(var i = 0 ; i<mapData.length ; i++){
    var obj = {};
    for(var j = 0 ;j<mapData[i].connected.length;j++){
      var node = mapData[i].connected[j];
      var name ={node}.node.node;
      var dist ={node}.node.dist;
      obj[name] = dist;
  }
    route.addNode(mapData[i].name, obj);
    if((mapData[i].category) == ('exit')){
      exitArr.push(mapData[i]);
    }
  }
  for(var i = 0; i<disNode.length;i++){
    if(nodeName == disNode[i]){
      var count = i;
    }
    else{
      removeNode(disNode[i]);
    }
    disNode.splice(count,1);
  }
}


function checkExit(startNodeName){
  var lowestPath = null;
  var lowestDist = 100000;

  for(var i=0;i<exitArr.length;i++){
      var res = route.path(startNodeName, exitArr[i].name ,{cost : true});
      if(lowestDist > res.cost ){
        lowestDist = res.cost;
        lowestPath = res.path;
      }
  }
  if(lowestPath == null){
    return "탈출구가 없습니다.";
  }
  else{
    var ret = {};
    ret['path'] = lowestPath;
    ret['dist'] = lowestDist;
    return ret;
  }
}

function removeNode(nodeName){
    disNode.push(nodeName);
    route.removeNode(nodeName);
    for(var i = 0; i < exitArr.length; i++){
      if(exitArr[i].name == nodeName) {
        exitArr.splice(i,1);
      }
      else if(exitArr[i].connected[0].node == nodeName){
        exitArr.splice(i,1);
      }
    }
}
