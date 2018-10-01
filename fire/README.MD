# ServerSide JS module

## fireModule.js
<pre><code>var fire = require('FireModule.js')</code></pre>

+ fireModule.js included modules(refered each APIs )
 - node-dijkstra

### fire.set(map)

- Description
  - extract entire Map Data's node information and initialize Graph object.
  - If exit node, save at data pool.
  
- Property    : 	map
- Type        : 	JSON Array
- Return      : 	void

- map	:  [	{ "name"	: String,
		          "category"	: String,
		          "connected"	: JSON Array - [ {"node": String , "dist": Number } ]
		        },
		        {...}
	       ]

### fire.reset()

- Description
  - Return from evacuation state to normal state and reload map data.
  
- Return      : 	void

### fire.checkExit(startNodeName)

- Description
  - Return exit location and distnace from received Node.
  - if there is no avaiable path to exit, return message "there is no path".
  
- Property    : 	startNodeName
- Type        : 	String
- Return      : 	JsonObject or String



### fire.removeNode(removeNodeName)

- Description
  - Delete saved MapData node.
  - Save deleted node in data pool.
  
- Property    : 	removeNodeName
- Type        : 	String
- Return      : 	void




### fire.reBuild(reBuildNodeName)
- Description
  - rebuild MapData and delete nodes except delivered node(s).
  
- Property    : 	reBuildNodeName
- Type        :		String
- Return      : 	void


## SensorLog.js

<pre><code>var sensorLog = require('sensorLog.js')</code></pre>

+ sensorLog.js included modules(refered each APIs )
 - nodesCollection.js
 - logger.js


### sensorLog.set(sensor)

- Description
  - loggin sensor data to file and database.
  
- Property    : 	sensor
- Type        : 	JSON Object
- Return      : 	void


### sensorLog.getAllSeverityLevel()

- Description
  - Call findfAllSeverityLevel in
  - nodesCollection.js and return file name
  
- Return      : 	String


### sensorLog.getMapData()

- Description
  - Call findAllConnected in nodesCollection.js and return file name.
  
- Return      :   String


### sensorLog.setSeverityLevel()

- Description
  - Initialize assessed severity level at interated sensor information in database.
  
- Type        : 	void
- Return      : 	String


### sensorLog.deleteLogFile()

- Description : 	Delete old logs(1 week) if exist.

- Return      : 	void




### sensorLog.sevrityLevelClac(sensor)

- Description
  - calculate and return severity level via sensor data.
  
- Property    : 	sensor
- Type        : 	JSON Object
- Return      : 	Number


### sensorLog.timeStampFormat()

- Description
  - return current time with designed format ('YYYY-MM-DD HH:mm:ss.SSS ZZ') - 24H.
  
- Return      : 	String



### sensorLog.sensorLog(sensor,sLevel)

- Description
  - called from set() function. call info() function from logger.js.
  
- Property    : 	sensor, sLevel
- Type        : 	JSON Object, Number
- Return      : 	void


### sensorLog.sensorUpdate(sensor, sLevel)

- Description
  - called from set() function. call updateAllSensor form nodesCollection.js.
  
- Property    : 	sensor, sLevel
- Type        : 	JSON Object, Number
- Return      : 	void


## logger.js
<pre><code>var logger = require('./logger.js')</code></pre>

+ logger.js included modules(refered each APIs )
  - winston
  - winston-daily-rotate-file

- Description
  - Generate log file daily via winston and winston-daily-rotate-file.
  - createdapp_YYYY-MM-DD.log/exception_YYYY-MM-DD.log file in logs directory.
  - info and higher level logs are recorded with their log level.
  - Max size of log file is 50MB. If the size is overflowed, make another files(MAX: 100).

- log level
  - debug:0 > info:1 > notice:2 > warning:3 > error:4 > crit:5 > alert:6 > emerg:7



## nodesCollection.js

<pre><code>var nodes = require("./nodesCollection.js")</code></pre>

+ nodesCollection.js included modules(refered each APIs )
  - mongoose

+ mongoDB
   - DataBase : fireEvacuationSystem
   - Collection : nodes

- nodes's Schema

<pre><code>nodes {
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
    connected : [{node : 'string', dist : 'number'},{...}]
}</code></pre>


### nodes.findAllData()

- Description
  - Find all document in nodes collection and save to 'AllData.txt'.
  
- Return      : void

### nodes.findAllConnected()

- Description
  - Find name, category, connected from all document in node collection and save to 'findAllConnected.txt'.
  
- Return      : void

### nodes.findAllSensorData()

- Description
  - Find name, flameSensor, smokeSensor, temperatureSensor from all document in node collection and save to 'findAllSensorData.txt'.
  
- Return      : void

### nodes.findAllSeverityLevel()
- Description
  - Find name, category, connected from all document in node collection and save to 'findAllConnected.txt'.
- Return      : void

### nodes.updateflameSensor(nodeName, flameSensor)

- Description
  - Update flameSensor from document of which name equals 'nodeName' in node collection.
  
- Property
  - nodeName - node name for update
  - flameSensor - flame sensor value
- Type        : String, Number
- Return      : void

### nodes.updatesmokeSensor(nodeName, smokeSensor)

- Description
  - Update smokeSensor from document of which name equals 'nodeName' in node collection.
  
- Property
  - nodeName - node name for update
  - smokeSensor - smoke sensor value
- Type        : String, Number
- Return      : void

### nodes.updatetemperatureSensor(nodeName, temperatureSensor)

- Description
  - Update temperatureSensor from document of which name equals 'nodeName' in node collection.
  
- Property
  - nodeName - node name for update
  - temperatureSensor - temperature sensor value
- Type        : String, Number
- Return      : void

### nodes.updateAllSensor(nodeName, flameSensor, smokeSensor, temperatureSensor, severityLevel)

- Description
  - Update flameSensor, smokeSensor, temperatureSensor, severityLevel from document of which name equals 'nodeName' in node collection.
  
- Property
  - nodeName - node name for update
  - flameSensor - flame sensor value
  - smokeSensor - smoke sensor value
  - temperatureSensor - temperture sensor value
  - severityLevel - severity level
- Type        : String, Number, Number, Number, Number
- Return      : void

### nodes.updateseverityLevel(nodeName, severityLevel)

- Description
  - Update severityLevel from document of which name equals 'nodeName' in node collection.
  
- Property
  - nodeName - node name for update
  - severityLevel - severity level
- Type        : String, Number
- Return      : void

### nodes.updateAllSeverityLevel(severityLevel)

- Description
  - Update severityLevel from all document in node collection.
  
- Property
  - severityLevel - severity level
- Type        : Number
- Return      : void

## Included NPM packages

1. express
  - https://www.npmjs.com/package/express
  - web(HTTP) server module

2. request
  - https://www.npmjs.com/package/request
  - Simplified HTTP client

3. bodyParser
  - https://www.npmjs.com/package/body-parser
  - parse parameters from POST request data

4. node-dijkstra
  - https://www.npmjs.com/package/node-dijkstra
  - Implementation of Dijkstra's shortest path argorithm for NodeJs
  - Used for find out best evacutation path in the project.

5. moment
  - https://www.npmjs.com/package/moment
  - module for timestamping

6. winston
  - https://www.npmjs.com/package/winston
  - data logger

7. winston-daily-rotate-file
  - https://www.npmjs.com/package/winston-daily-rotate-file
  - transport winston logs to a rotating file.

8. mongoose
  - https://www.npmjs.com/package/mongoose
  - MongoDB object modeling tool.
