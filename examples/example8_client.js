// AUTONOMOUS CODE THAT FLIES TO ANOTHER SERVER
// JSFly allows code to autonomously decide when it wants to fly
// and request to be migrated to another server
var jsfly = require('../jsfly');

// You can supply any function that calls jsfly.fly()
// after some time delay or when a given condition is met
var wingified = jsfly.wingify(function myNameIs(jsfly) {
    setInterval(function () {
        console.log('Hello world!');
    }, 1000);
    // After 3.1 seconds, autonomously request to fly to another server
    setTimeout(function () {
        jsfly.fly({ 
            port: 3600
        });
    }, 3100);
    // If the code cannot fly after 5.2 seconds, it crashes itself
    setTimeout(function () {
        console.log('Good bye world!');
        jsfly.crash();
    }, 5200);
}).run();

/*OUTPUT:
Hello world!       // Every 1 second
Hello world!
Hello world!
*/