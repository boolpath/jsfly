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

Where the options parameter is an object describing the (target) JSFly server such as:
``` js
var options = {
    port: 3600
};
```

## Why JSFly?

JavaScript is everywhere now. Browsers, servers, desktops, mobile devices, robots. That is great! And it will be taken to even more places for sure. However, once JavaScript code is running on a given environment, it is constrained to continue running on that environment with the same available data and processing resources.

Although this constraint is not a problem for conventional applications whose location and allocation of resources are predefined and controlled authoritatively, it does create some barriers when considering different programming paradigms that would give applications the autonomy to decide where to run and look for less described, unexposed, unindexed data.

Then, what if in addition to running JavaScript code in many different environments, we could give it the ability to autonomously move from one environment to another while running? JSFly can be used for writing code capable of migrating autonomously between Node.js servers, and exploring scenarios that would benefit from running code capable of moving from one place to another, such as locally querying unexposed, distributed databases, exploring the Web beyond HTML documents with non-HTTP crawlers and deploying propietary data processing scripts on demand.


## Examples

### 1. Flying "Hello World!"

JSFly servers (aka 'airports') can be created from the command line by providing a port number as a parameter:
``` js
node jsfly 3600
```  

JSFly clients (aka 'JSPlanes') are created by providing a function to the #wingify method. Then the jsfly#fly method can be used autonomously by the code in order to migrate to another server:
``` js
jsfly.wingify(function myNameIs(jsfly, params) {
    // Hello world!
    setInterval(function () {
        console.log('Hello world!');
    }, 1000);
    // After 3.1 seconds, fly to another server
    setTimeout(function () {
        jsfly.fly({
            port: params.targetPort,
            params: params
        });
    }, 3100);
}).run({ targetPort: 3600 });
```  

The result of running this JSPlane is displayed below:

![alt tag](https://github.com/jorgezaccaro/jsfly/blob/master/images/flyingHelloWorld.gif?raw=true)

### 2. Flying "Hello World!" grid

``` js
jsfly.wingify(function myNameIs(jsfly, params) {
    setInterval(function () {
        console.log('Hello world!');

        if (params.servers.length > 0) {
            jsfly.fly({
                port: params.servers.pop(),
                params: { 
                    servers: params.servers
                }
            });
        }
    }, 1000);
}).run({
    servers: [8600, 4600, 6600, 7600, 2600, 9600, 3600, 5600, 1600]
});
```  

### 3. Flying counter


## Terminology

   **Airport:** A JSFly server.  
   **Runway:** A resource and authorization needed to take off and land.  

   **Wingify:** To transform a piece of regular code into migratable/autonomous code (i.e. give it wings to fly).  
   **Migratable code:** Code that can be sent to run in another server while running.  
   **Autonomous code:** Code that can decide and request when it wants to be sent to run in another server.  

   **Take off:** Stop running a program that will fly to another airport.  
   **Fly:** Travel from one airport to another airport.  
   **Land:** Start running a program that comes from another airport.  
