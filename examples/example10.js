// AUTONOMOUS COUNTER THAT KEEPS ITS VALUES AFTER FLYING
// JSFly allows code to keep its state when flying to another server
var jsfly = require('../jsfly');

// You just need to supply a function that uses the params parameter
// to initialize or restore the state after landing on another server
var wingified = jsfly.wingify(function myNameIs(jsfly, params) {
    // Initialization
    var count = (params) ? params.count || 0 : 0;

    // This counter adds 1 every 1 second
    setInterval(function () {
        console.log(++count);
    }, 1000);
    // This counter flies to the JSFly airport on port 3600 after 3.1 seconds
    setTimeout(function () {
        // In order to continue counting from the last calculated number,
        // you have to send the current count as a parameter when flying
        jsfly.fly({
            port: 3600,
            params: {
                count: count 
            }
        });
    }, 3100);
}).run();


