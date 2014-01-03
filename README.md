# What if JavaScript could fly...?
![alt tag](https://github.com/jorgezaccaro/jsfly/blob/master/jsfly_logo.png?raw=true)

### Write code capable of migrating autonomously between Node.js servers using JSFly.  


## Usage
``` js
var jsfly = require('jsfly');
```

* Clients
``` js
    jsfly.wingify(function yourCode(jsfly) {
        // Your code goes here
            console.log('Hello world!');
        // When some condition is met (e.g. time, event), fly to another server
            jsfly.fly(options);
    }).run();
```

* Servers
``` js
    jsfly.createAirport(options, function (airport) {
        airport.on('landing', function (jsPlane) {
            console.log(jsPlane.name + ": I'm here now!");
        });
    });
```  

Where the options parameter is an object describing the (target) JSFly server:
``` js
var options = {
    port: 3600
};
```

## Terminology

   **Airport:** A JSFly server.  
   **Runway:** A resource and authorization needed to take off and land.  

   **Wingify:** To transform a piece of regular code into migratable/autonomous code (i.e. give it wings to fly).  
   **Migratable code:** Code that can be sent to run in another server while running.  
   **Autonomous code:** Code that can decide and request when it wants to be sent to run in another server.  

   **Take off:** Stop running a program that will fly to another airport.  
   **Fly:** Travel from one airport to another airport.  
   **Land:** Start running a program that comes from another airport.  


## User Stories 

### a. Programmer's point of view: migratable code

1. 
In order to     create a piece of migratable code,
as a            programmer,
I want to       supply the code to be configured as migratable.
``` js
    var migratableCode = jsfly.wingify(someCode);
    
    migratableCode.run();   // It can be executed
    migratableCode.fly();   // It can be migrated to another server
    migratableCode.crash(); // It can be killed
```  

2. 
In order to     run a program as autonomous code,
as a            programmer,
I want to       supply the code to be run autonomously.

``` js
    var autonomousCode = jsfly.wingify(someCode).run();
```

Although it is possible to explicitly fly and crash an autonomous piece of code, there is no need to do it because the code itself is supossed to request those methods autonomously.

### b. Code's point of view: autonomous code

1.
In order to     fly to another server,
as an           autonomous piece of code,
I want to       ask to be migrated.
``` js
    var autonomousCode = jsfly.wingify(function (jsfly) {
        // Request a runway for takeoff with the destination info
        jsfly.runway(targetAirportInfo, function (authorized, authKey) {
            if(authorized) { 
                jsfly.fly(authKey);     // Request migration
            }
        });
    }).run();
```  

2.
In order to     stop running,
as an           autonomous piece of code,
I want to       ask to be stopped (i.e. crash).
``` js
    var autonomousCode = jsfly.wingify(function (jsfly) {
        // Stop running the code when it reaches its life expectancy
        setTimeout(function () {
            jsfly.crash();              // Stop running
        }, lifeSpan);
    }).run();
```

### c. Module's point of view: manageable code

1.
In order to     stop running code and send it to another airport,
as an           airport,
I want to       authorize a piece of code to take off.
``` js
    jsfly.takeOff(migratableCode);
```  

2.
In order to     start running code received from another airport,
as an           airport,
I want to       authorize a piece of code to land.
``` js
    var landedCode = jsfly.land(migratedCode);
```
