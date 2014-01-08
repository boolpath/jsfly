// CODE THAT IS MIGRATED TO ANOTHER SERVER
// The main purpose of JSFly is to give running code the ability to be sent 
// to run on another server, either authoritatively or autonomously
var jsfly = require('../jsfly');

// You can supply any function like the ones discussed in the previous examples
var wingified = jsfly.wingify(function myNameIs(jsfly) {
    setInterval(function periodic() {
        console.log('Hello world!');
    }, 1000);
    // If the code is not migrated after 5.2 seconds, it crashes itself
    setTimeout(function outOfFuel() {
        console.log('Good bye world!');
        jsfly.crash();
    }, 5200);
}).run();

// Then, you can send the code to run on another server by calling the #fly method
// and providing the server parameters in an object
setTimeout(function migrateCode() {
    wingified.fly({ 
        host: 'localhost',  // optional for localhost
        port: 3600 
    });
}, 3100);

/*OUTPUT:
Hello world!       // Every 1 second
Hello world!
Hello world!
*/