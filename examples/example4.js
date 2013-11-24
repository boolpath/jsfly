// MIGRATABLE CODE WITH TIMEOUTS AND INTERVALS
// JSFly can stop running a wingified piece of code if you call the crash() method on it
// JSFly automatically clears all timeouts and intervals when crashing a function
var jsfly = require('../jsfly');

// First, define a function that calls the setTimeout and setInterval functions
var crashableHelloWorld = jsfly.wingify(function crashableHelloWorld() {
    setInterval(function () {
        console.log('Hello world periodic!');
    }, 1000);
    setTimeout(function () {
        console.log('Hello world delayed!');
    }, 3200);
});

// Then, call the run() method to execute the migratable function
crashableHelloWorld.run();

// Finally, call the crash() method on crashableHelloWorld to stop running it
setTimeout(function () {
    crashableHelloWorld.crash();
}, 5100);       // ***CASE A***
// }, 3100);       // ***CASE B***


/*OUTPUT CASE A:
Hello world periodic!       // Every 1 second
Hello world periodic!
Hello world periodic!
Hello world delayed!        // After 3.2 seconds
Hello world periodic!
Hello world periodic!
*/

/*OUTPUT CASE B: Timeout is cleared before expiring so it does not log
Hello world periodic!       // Every 1 second
Hello world periodic!
Hello world periodic!
*/