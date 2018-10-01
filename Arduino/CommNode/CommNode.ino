#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>

const char* ssid = "ji-test";
const char* password = "03041116";
String nodeName = "EXIT1";

ESP8266WebServer server(80);

//const int led = 13;

// Variable for Serial Stream
char buffer[10]; //buffer size : 10
char bufferIdx = 0;

int flameA = 0;
int flameD = 0;
int gas = 0;
double humidity = 0.00;
double temparature = 0.00;

String serialRead() {
  while(Serial.available()) {
    buffer[bufferIdx] = Serial.read();
    bufferIdx++;
  }
  String readStr(buffer);
  bufferIdx = 0 ;

  //buffer flushing
  for(int i=0;i<10;i++) {
    buffer[i] = 0;
  }
  
  return readStr;
}

void serialSensor() {
  Serial.println('t'); // request temparature to sensor node
  delay(50);
  temparature = atof(serialRead().c_str()); //receieve temp sensor value 
//  Serial.println(temparature);
  
  Serial.println('h'); // request humidity to sensor node
  delay(50);
  humidity = atof(serialRead().c_str()); // receieve humidity sensor value
//  Serial.println(humidity);
  
  Serial.println('F');
  delay(50);
  flameD = serialRead().toInt();
//  Serial.println(flameD);
  
  Serial.println('f');
  delay(50);
  flameA = serialRead().toInt();
//  Serial.println(flameA);
  
  Serial.println('g');
  delay(50);
  gas = serialRead().toInt();
//  Serial.println(gas);
  
}


void handleRoot() {
  serialSensor();
//  digitalWrite(led, 1);
  String message = String("{ \"node\" : {") +
                 " \"name\" : \"" + nodeName + "\"" +
                 ", \"ip\" : \"" + WiFi.localIP().toString().c_str() + "\"" +
                 ", \"temp\" : " + temparature +  
                 ", \"humidity\" : " + humidity +
                 ", \"flameD\" : " + flameD +
                 ", \"flameA\" : " + flameA +
                 ", \"gas\" : " + gas +
                 " }" +
                 " }";
  server.send(200, "application/json", message);
//  digitalWrite(led, 0);
}

void handleNotFound() {
//  digitalWrite(led, 1);
  String message = "File Not Found\n\n";
  message += "URI: ";
  message += server.uri();
  message += "\nMethod: ";
  message += (server.method() == HTTP_GET) ? "GET" : "POST";
  message += "\nArguments: ";
  message += server.args();
  message += "\n";
  for (uint8_t i = 0; i < server.args(); i++) {
    message += " " + server.argName(i) + ": " + server.arg(i) + "\n";
  }
  server.send(404, "application/json", message);
//  digitalWrite(led, 0);
}

void setup(void) {
//  pinMode(led, OUTPUT);
//  digitalWrite(led, 0);
  Serial.begin(9600);
  WiFi.begin(ssid, password);
  Serial.println("");

  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  if (MDNS.begin("esp8266")) {
    Serial.println("MDNS responder started");
  }

  server.on("/", handleRoot);

  server.on("/inline", []() {
    server.send(200, "text/plain", "this works as well");
  });

  server.onNotFound(handleNotFound);

  server.begin();
  Serial.println("HTTP server started");

}

void loop(void) {
  server.handleClient();
}
