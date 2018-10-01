//모듈 설정
var express = require('express');
var fs = require('fs');
var request = require('request');
var app = express();

const { spawn } = require('child_process');





var fire = require('./FireModule');
var sensorLog = require('./sensorLog');
var evac = null;// 대피경로

var sensorData = null;

//HTML 바디 파서
var bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));

//DB Load
//-----------------
sensorLog.setSeverityLevel();
sensorLog.getAllSensorData();
sensorLog.getAllSeverityLevel();
sensorLog.getMapData();

// root path 설정
app.get('/', function(req,res){
    res.sendFile(__dirname + "/public/main.html");
});

app.get('/form',function(req,res){
    res.sendFile(__dirname + "/public/form.html");
})


// 기본 지도맵 생성
app.get('/run',function(req,res){
    fs.readFile('./img/run.png', function(error,data){
        res.writeHead(200, {'Content-Type' : 'image/png'});
        res.end(data);
    });
});
var sensor = "";
// 아두이노에서 sensor값 ajax 처리
app.post('/sensor', (req,res) => {
    console.log('센서값 요청중...');
   var url = 'http://192.168.20.4';
    request(url, function(error, response, body){
    if(error) {console.log("센서응답실패.."); throw error; };

    

    //console.log(body);
    var sensor = JSON.parse(body).node;

    
    console.log("센서 응답성공!");
    sensorLog.set(sensor);
    res.json(sensorData);
    });
});

app.post('/safe',(req,res)=>{
    console.log(req.body.safe);
    var safe = req.body.safe;
    flag = false;
    fire.reset();
    res.send(safe);
})

app.get('/siren',(req,res)=>{
    console.log("사이렌");
    fs.readFile('./sound/siren.mp3', (err,data) => {
        res.end(data);
    });
});

// 다익스트라 알고리즘 설정
var interval = 1000;
var flag = false;

//출발 위치 설정
var startNodeName = 'officeroom1'; // 폼데이터로 받아오기

app.post('/startNode', (req,res) => {
   startNodeName = req.body.startNode;
   console.log("시작 지점 설정 : "+startNodeName);
   res.send(startNodeName);
});

// Map 정보 읽은 Json 파일 읽은 후 파싱
// 맵 정보 초기화 (서버 로드될때 1번 실행)

//sensorLog.set(sensor);

//위험도 체크
// function a(severityLevel){
//     sensorLog.getAllSeverityLevel();
//     sensorLog.getMapData();
//     setTimeout(function() {
//         console.log(checkLevel(severityLevel));
//     }, 6000);

// }
function checkLevel(severityList){ 
    for(var i = 0 ; i<severityList.length-1;i++){
        //경고메세지 출력
        // console.log(severityList[i].severityLevel);
        if(severityList[i].severityLevel<5){ // 정상
            continue;
        
        }else if(severityList[i].severityLevel<10){ // 주의
            
        //다익스트라 알고리즘 시작
        }else if(severityList[i].severityLevel<15){ // 위험
            const bat = spawn('cmd.exe', ['/c', 'fire.bat pi3']);
            bat.on('exit', (code) => {
                
              });
            flag = true;
            fire.removeNode(severityList[i].name);
        }
        else{      
            const bat = spawn('cmd.exe', ['/c', 'fire.bat pi3']);
            bat.on('exit', (code) => {
                
              });                                // 재난
            flag = true;
            fire.removeNode(severityList[i].name);
        }
    }
    if(flag){
        console.log(fire.checkExit(startNodeName));
         return fire.checkExit(startNodeName)} // 시작지점 (변수처리,폼데이터)
    else{
        console.log("상태값 : 정상");
        return null;
    }
}


//--------------------

// 다익스트라 알고리즘에서 받아온 최단경로 값으로 이미지라우팅 응답
// evacuation 
// evac = { path: [ 'B', 'C', 'EXIT3' ], dist: 9 };

var imgName;




// 최단경로 값으로 이미지파일 불러오기


app.use('/Img', function (req,res,next){
    // console.log(flag);
    if(flag==false){ res.json(null) } else{
        var iPath=new Array();
    // console.log("미들웨어")
    for (var i = 0 ; i<evac.path.length-1; i++){
        myMethod(evac.path[i],evac.path[i+1]);
    }
    
    function myMethod(start, end){
        
        imgName = start+"-"+end;
        
        iPath[i] = imgName;
        //  console.log(imgName);
    }
        //console.log(iPath)
        var Path = {iPath};
        // console.log(Path);
       
    res.json(Path);
    next();
}
});

// Img 경로 응답
app.post('/Img',function(req,res){
    if(flag==false){ res.end(null) } else {
    // console.log("실제 이미지 라우팅")
    for (var i = 0 ; i<evac.path.length-1; i++){
        myMethod(evac.path[i],evac.path[i+1]);
    }
    
        function myMethod(start, end){
            app.get('/'+start+"-"+end, function(req,res){
                var imgName = "./img/pathImg/"+start+"-"+end+".png";
                    // console.log(imgName);
                
                template(imgName,res);
          })
    }
}
});



// 이미지파일 읽어와서 Sensor.html로 응답
function template(imgName,res) { 
    fs.readFile(imgName, (err,data) => {
        res.writeHead(200, {'Content-Type' : 'image/png'});
        res.end(data);
    });
}
//위험
// { "node" : { "name" : "A" ,"ip" : "192.168.1.2", "temp" : 58.26, "humidity" : 52.18, "flameD" : 1, "flameA" : 21, "gas" : 160} }
//정상
// { "node" : { "name" : "A" ,"ip" : "192.168.0.24","temp" : 38.20, "humidity" : 49.20, "flameD" : 0, "flameA" : 700, "gas" : 300 } }

// 서버 생성
app.listen(3000, function(){
    console.log("start! express server is running on port 3000");

    
    try{
        // setInterval(a(JSON.parse(fs.readFileSync('findAllSeverityLevel.txt','utf8'))),1000);
        setTimeout(function() {
        var map = JSON.parse(fs.readFileSync('findAllConnected.txt','utf-8'));
        fire.set(map); 
        },10000);

        setInterval(function a(){
            var b = JSON.parse(fs.readFileSync('findAllSeverityLevel.txt','utf8'));
            sensorData = fs.readFileSync(sensorLog.getAllSensorData(),'utf8');
            // console.log(sensorData);
            // console.log(isJson(sensorData));
            sensorLog.getAllSeverityLevel();
            sensorLog.getMapData();
            
            evac = checkLevel(b);
            
        
        },5000); 
    } catch(exception) {
        console.log(exception);
    }
});




function isJson(json){
    try{
        JSON.parse(json);
        return false;
    }catch(exception){
        return true;
    }
}

setInterval(function() {
    sensorLog.deleteLogFile();
}, 24 * 60 * 60 * 1000);
