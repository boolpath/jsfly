#jsfly

What is JavaScript could Fly?... Live, autonomous code migration between Node.js servers.

## Usage
``` js
var jsfly = require('jsfly');
```

## User Stories

### Terminology

Migratable code: Code that can be sent to run in another server while running.
Autonomous code: Code that can request to be sent to run in another server.

Airport: A JSFly server.
Fly: Send a program to another airport.
Runway: A resource and authorization needed to take off and land.
Take off: Stop running a program that will fly to another airport.
Land: Start running a program that comes from another airport.

### a. Programmer's point of view: migratable code

1. 
In order to     create a piece of migratable code,
as a            programmer,
I want to       supply the code to be configured as migratable.
``` js
    var migratableCode = jsfly.code(someCode);
    
    migratableCode.run();   // It can be executed
    migratableCode.fly();   // It can be migrated to another server
    migratableCode.crash(); // It can be killed
```
2. 
In order to     run a program as autonomous code,
as a            programmer,
I want to       supply the code to be run autonomously.
``` js
    var autonomousCode = jsfly.run(someCode);
```

### b. Code's point of view: autonomous code

1.
In order to     be migrated,
as an           autonomous piece of code,
I want to       to ask to be migrated.
``` js
    var autonomousCode = jsfly.run(function(jsfly) {
        // Request a runway for takeoff with the destination info
        jsfly.runway(targetAirportInfo, function(authorized, authKey) {
            if(authorized) { 
                jsfly.fly(authKey);     // Request migration
            }
        });
    });
```

2.
In order to     be migrated,
as an           autonomous piece of code,
I want to       to ask to be migrated.
``` js
    var autonomousCode = jsfly.run(function(jsfly) {
        // Stop running the code when it reaches its life expectancy
        setTimeout(function() {
            jsfly.crash();              // Stop running
        }, lifeSpan);
    });
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