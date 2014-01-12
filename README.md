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
            console.log(jsPlane.name + " running here now.");
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

Then, what if in addition to running JavaScript code in many different environments, we could give it the ability to autonomously move from one environment to another while running? JSFly can be used for writing code capable of migrating autonomously between Node.js servers, and exploring scenarios that would benefit from running code capable of moving from one place to another, such as locally querying unexposed, distributed databases, and exploring the Web beyond HTML documents with non-HTTP crawlers.


## Examples

### 1. Flying "Hello World!"

JSFly servers (aka 'airports') can be created from the command line by providing a port number as a parameter:
``` js
node jsfly 3600
```  

JSFly clients (aka 'JSPlanes') are created by providing a function to the #wingify method. Then the jsfly#fly method can be used autonomously by the code in order to migrate to another server:
``` js
jsfly.wingify(function flyingHelloWorld(jsfly, params) {
    // Hello world!
    setInterval(function () {
        console.log('Hello world!');
    }, 1000);
    // After 3.1 seconds, fly to another server
    setTimeout(function () {
        jsfly.fly({
            port: 3600
        });
    }, 3100);
}).run();
```  

The result of running this JSPlane is displayed below:

![alt tag](https://github.com/jorgezaccaro/jsfly/blob/master/images/flyingHelloWorld.gif?raw=true)

### 2. Flying "Hello World!" grid

Digital whack-a-mole games like [Cogniter's](http://www.cogniter.com/iphone-app-development-india.aspx) iPhone app create the illusion of a mole moving from one burrow to another by displaying the mole in different burrows according to a given time sequence.

<img src="https://github.com/jorgezaccaro/jsfly/blob/master/images/molesSlow.gif?raw=true" width="435px">

Similarly, JSFly creates the ilussion that flying code keeps running when traveling from one server to another by stopping the sent code and running the received code in a coordinated fashion. The console outputs and the corresponding code of a "Hello world!" logger that travels through a grid of servers are shown below.

![alt tag](https://github.com/jorgezaccaro/jsfly/blob/master/images/helloWorldGrid.gif?raw=true)

``` js
jsfly.wingify(function helloWorldGrid(jsfly, params) {
    setInterval(function () {
        console.log('Hello world!');
    }, 500);
    setTimeout(function () {
        jsfly.fly({
            port: params.servers.pop(),
            // The array of servers must be sent as a parameter so that the code
            // knows where to go next when landing and running on another server
            params: { 
                servers: params.servers
            }
        });
    }, 1501);
}).run({
    servers: [8500, 4500, 6500, 7500, 2500, 9500, 3500, 5500, 1500]
});
```  

In order to let the code be aware of the servers to visit, an object containing an array with the target server ports is passed as a parameter when running the code for the first time. Each time the jsfly#fly method is called, a target port is popped out of the params.servers array, and the array with the remaining ports is sent with the flying code so that it can be passed again as a parameter when landing and running the code on the destination server.

### 3. Flying counter

``` js
var flyingCounter = jsfly.wingify(function myNameIs(jsfly, params) {
    // Restore the count if the code is landing from another server
    var count = (params) ? params.count || 0 : 0;
    
    setInterval(function () {
        console.log(++count);
    }, 500);
    setTimeout(function () {
        if (params.servers.length > 0) {
            jsfly.fly({
                port: params.servers.pop(),
                // The current count must be sent as a parameter
                params: {
                    count: count,
                    servers: params.servers
                }
            });
        }
    }, 1501);
});
```

``` js
flyingCounter.fly({
    port: 1500,
    params: {
        count: 0,
        servers: [8500, 4500, 6500, 7500, 2500, 9500, 3500, 5500]
    }
});
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
