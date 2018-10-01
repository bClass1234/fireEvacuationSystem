## Arduino Configuration

### Hardware List
* Arduino UNO - Sensor node 
* WeMos D1 R1(ESP8266) - Wifi Communication Node 
* DHT11 - Temparature, Humidity Sensor
* Octopus MQ-5 - Gas and Smoke Sensor 
* Sunfounder Flame sensor
* BreadBoard
* Jumper wires
* USB type b cable or power connector 

### Wiring 
* Arduino UNO - Sensor node
  - A0 - Gas sensor S
  - A1 - Flame Sensor A0
  - A5 - Temp. sensor SCL
  - A6 - Temp. sensor SDA
  - D7 - Flame Sensor D0 
  - D0(RX) - Communication node(WeMos D1 R1) D1(TX)
  - D1(TX) - Communication node(WeMos D1 R1) D0(RX)
  - 5v - Communication node(WeMos D1 R1) 5v
  - GND - Communication node(WeMos D1 R1) GND

* Gas sensor
  - G - Sensor node(Arduino UNO) GND
  - V - Sensor node(Arduino UNO) 5v
  - S - Sensor node(Arduino UNO) A0

* Flame sensor 
  - GND - Sensor node(Arduino UNO) GND
  - VCC -  Sensor node(Arduino UNO) 5v
  - D0 - Sensor node(Arduino UNO) D7
  - A0 - Sensor node(Arduino UNO) A1

* Temp. & Humi. sensor 
  - '+' - Sensor node(Arduino UNO) 5v
  - '-' - Sensor node(Arduino UNO) GND
  - SCL - Sensor node(Arduino UNO) A5
  - SDA - Sensor node(Arduino UNO) A6

* WeMos D1 R1(ESP8266) - Wifi communication node
  - D0(RX) - Sensor node(Arduino UNO) D1(TX)
  - D1(TX) - Sensor node(Arduino UNO) D0(RX)

### Board setup and upload source
* Install Arduino IDE 
  - Download here : https://www.arduino.cc/en/Main/Software

* WeMos D1 R1 setup
  - Driver download (CH340G) : https://wiki.wemos.cc/downloads
Note : Linux driver is not supported for WeMos D1 R1. 

* Add Board Manager in Arduino IDE
  - Add this : http://arduino.esp8266.com/versions/2.3.0/package_esp8266com_index.json
  - In Board Manager menu, search ESP8366 and install v2.3.0.

* Sensor node upload  
  - source file name:  SensorNode.ino
  - Board : Ardunio UNO 

* Communication node compiling 
  - source file name: CommNode.ino
  - Board : WeMos D1(Retired) 
  - Upload speed : 115200
  - Frequency : 80 MHz 
  - Flash Size : 4M(3M SPIFFS)

before upload, Some variable have to be changed. 

[code]
const char* ssid = "your wifi ssid ";
const char* password = "your wifi password";
String nodeName = "node name(location name recommended)";
[/code]

* CAUTION: before uploading, ensure disconnect TX, RX between sensor node and communication node. It may occur unexpedted compiling result. 

