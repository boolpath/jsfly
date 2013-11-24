// AUTONOMOUS CODE THAT CRASHES ITSELF
// JSFly wingified pieces of code are called JSPlanes
// JSPlanes can crash themselves by calling the crash() method on the 'jsfly' parameter
var jsfly = require('../jsfly');

// When code is meant to run autonomously, there is no need to store the return value
// of jsfly.wingify() in a variable, since it can be run immediately **, and it is expected 
// to call 'jsfly.crash()' when it wants to stop running. *** 
// The 'jsfly' parameter must be declared when defining the function 
jsfly.wingify(function crashableHelloWorld(jsfly) {
    var timeout, interval;
    interval = setInterval(function () {
        console.log('Hello world periodic!');
    }, 1000);

    // After 3.1 seconds clear the interval and request to be crashed
    timeout = setTimeout(function () {
        console.log('Hello world delayed!');
        clearInterval(interval);
        jsfly.crash();  // *** Asks JSFly to stop running the function 'crashableHelloWorld'
    }, 3100);
// ** Call the run() method to start running the code immediately
}).run();


/*OUTPUT:
Hello world periodic!       // Every 1 second
Hello world periodic!
Hello world periodic!
Hello world delayed!        // After 3.1 seconds
*/