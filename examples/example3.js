// MIGRATABLE CODE WITH INTERVALS
// JSFly accepts functions that use setInterval
var jsfly = require('../jsfly');

// First, define a function that calls the setInterval function
function helloWorldPeriodic() {
    setInterval(function () {
        console.log('Hello world!');
    }, 1000);
}

// Then, call JSFly's wingify method and pass the function defined above
var migratableHelloWorldPeriodic = jsfly.wingify(helloWorldPeriodic);

// Finally, call the run() method to execute the migratable function
migratableHelloWorldPeriodic.run();


/*OUTPUT:
Hello world!
Hello world!
Hello world!    // Every 1 second
...             // Keeps logging until the interval is cleared or the process is killed
*/