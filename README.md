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

Then, what if in addition to running JavaScript code in many different environments, we could give it the ability to autonomously move from one environment to another while running?


### Mobility and Artificial Intelligence

A common feature of most intelligent species is their ability to move autonomously. Although the field of artificial intelligence covers  much more than mobility issues, providing location awareness and mobility freedom to JavaScript programs could create new ways to make progress in this exciting field.


### An analogy - Moles and burrows

Arcade whack-a-mole games create the illusion of one or more moles moving from one burrow to another by showing and hiding each burrow's mole according to a given time sequence.

<img src="https://github.com/jorgezaccaro/jsfly/blob/master/images/mole0.png?raw=true" width="435px">

Digital whack-a-mole games like [this](http://) create the same illusion by simply displaying the moles in one or more burrows according to a given time sequence.

<img src="https://github.com/jorgezaccaro/jsfly/blob/master/images/molesSlow.gif?raw=true" width="435px">

Although it's not likely to find an application in which hitting a piece of code's "head" would be useful or even fun, it is possible to consider several scenarios that would benefit from running code capable of moving from one place to another, such as locally querying unexposed, distributed databases, exploring the Web beyond HTML documents with non-HTTP crawlers and deploying propietary data processing scripts on demand.


## Examples


## Terminology

   **Airport:** A JSFly server.  
   **Runway:** A resource and authorization needed to take off and land.  

   **Wingify:** To transform a piece of regular code into migratable/autonomous code (i.e. give it wings to fly).  
   **Migratable code:** Code that can be sent to run in another server while running.  
   **Autonomous code:** Code that can decide and request when it wants to be sent to run in another server.  

   **Take off:** Stop running a program that will fly to another airport.  
   **Fly:** Travel from one airport to another airport.  
   **Land:** Start running a program that comes from another airport.  
