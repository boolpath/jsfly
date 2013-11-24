// MIGRATABLE CODE WITH TIMEOUTS
// JSFly accepts functions that use setTimeout
var jsfly = require('../jsfly');

// First, define a function that calls the setTimeout function
function helloWorldDelayed() {
    setTimeout(function () {
        console.log('Hello world!');
    }, 1000);
}

// Then, call JSFly's wingify method and pass the function defined above
var migratableHelloWorldDelayed = jsfly.wingify(helloWorldDelayed);

// Finally, call the run() method to execute the migratable function
migratableHelloWorldDelayed.run();


/*OUTPUT:
Hello world!    // After 1 second
*/