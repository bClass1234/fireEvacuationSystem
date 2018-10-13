//모듈 설정

//익스프레스 프레임워크
var express = require('express');
var app = express();
// 파일시스템 모듈
var fs = require('fs');
// 외부 서버 요청 모듈
var request = require('request');
// 배치 파일 모듈
const { spawn } = require('child_process');
// 다익스트라 알고리즘 참조, 최단 경로 화재대피 시스템 - 자체제작 모듈
var fire = require('./FireModule');
// 센서로그 모듈
var sensorLog = require('./sensorLog');

var evac = null;// 대피경로 초기화
var sensorData = null; // 센서데이터 초기화

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

// 기본 지도맵 생성
app.get('/run',function(req,res){
    fs.readFile('./img/run.png', function(error,data){
        res.writeHead(200, {'Content-Type' : 'image/png'});
        res.end(data);
    });
});

// 다익스트라 알고리즘 설정
var interval = 1000;
var flag = false;

//출발 위치 설정
app.post('/startNode', (req,res) => {
    startNodeName = req.body.startNode;
        console.log("시작 지점 설정 : "+startNodeName);
    res.send(startNodeName);
});


// 아두이노에서 sensor값 ajax 처리
app.post('/sensor', (req,res) => {
    console.log('센서값 요청중...');
    var url = 'http://192.168.20.4'; //아두이노 서버 url
        request(url, function(error, response, body){
            if(error) {console.log("센서응답실패.."); throw error; };

            var sensor = JSON.parse(body).node; // 센서값 파싱

            console.log("센서 응답성공!");
        sensorLog.set(sensor);
    res.json(sensorData);
    });
});

// 위험도 감지
function checkLevel(severityList){ 
    for(var i = 0 ; i<severityList.length-1;i++){
       
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
            bat.on('exit', (code) => { });   // 재난
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


var imgName; // 이미지 이름 선언

// 최단경로 값으로 이미지파일 불러오기
app.use('/Img', function (req,res,next){
    if(flag==false){ res.json(null) } else{
        var iPath=new Array();
    for (var i = 0 ; i<evac.path.length-1; i++){
        myMethod(evac.path[i],evac.path[i+1]);
    }
    
    function myMethod(start, end){
        
        imgName = start+"-"+end;
        
        iPath[i] = imgName;
    }
    var Path = {iPath};
       
    res.json(Path);
    next();
}
});

// Img 경로 응답
app.post('/Img',function(req,res){
    if(flag==false){ res.end(null) } else {
        for (var i = 0 ; i<evac.path.length-1; i++){
            myMethod(evac.path[i],evac.path[i+1]);
        }
    
        function myMethod(start, end){
            app.get('/'+start+"-"+end, function(req,res){
                var imgName = "./img/pathImg/"+start+"-"+end+".png";
                
                template(imgName,res);
            })
        }
    }
});

// Img 파일 응답
function template(imgName,res) { 
    fs.readFile(imgName, (err,data) => {
        res.writeHead(200, {'Content-Type' : 'image/png'});
        res.end(data);
    });
}

// 서버 생성
app.listen(3000, function(){
    console.log("start! express server is running on port 3000");

    // 해당 층 맵데이터 생성
    try{
        setTimeout(function() {
            var map = JSON.parse(fs.readFileSync('findAllConnected.txt','utf-8'));
                fire.set(map); 
        },10000);
    // 맵데이터와 센서 매칭
        setInterval(function a(){
            var b = JSON.parse(fs.readFileSync('findAllSeverityLevel.txt','utf8'));
                sensorData = fs.readFileSync(sensorLog.getAllSensorData(),'utf8');
                sensorLog.getAllSeverityLevel();
                sensorLog.getMapData();
            
                evac = checkLevel(b);
        },5000); 

    } catch(exception) {
        console.log(exception);
    }
});

// 화재 대피 종료
app.post('/safe',(req,res)=>{
    var safe = req.body.safe;
        flag = false;
        fire.reset();
    res.send(safe);
})

// 화재 시 경보음
app.get('/siren',(req,res)=>{
    console.log("사이렌");
        fs.readFile('./sound/siren.mp3', (err,data) => {
    res.end(data);
    });
});

// 제이슨데이터 판별
function isJson(json){
    try{
        JSON.parse(json);

        return false;
    }catch(exception){
        
        return true;
    }
}

// 1일 주기로 로그데이터 초기화
setInterval(function() {
    sensorLog.deleteLogFile();
}, 24 * 60 * 60 * 1000);
