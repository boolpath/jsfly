// CODE THAT USES THE MODULE PATTERN
// JSFly accepts functions that follow the module pattern to organize the code and use closures
var jsfly = require('../jsfly');

// You can supply a function that returns the function to be run
// The returned function's closure will continue to be available after being wingified
// Note that you must specify that the code follows the module pattern using the 'type' option
var wingified = jsfly.wingify({ type: 'module' }, function myNameIs(jsfly) {
    var timeout, interval,
        hello = 'Hello World!',
        goodbye;

    function helloWorld() {
        interval = setInterval(function () {
            console.log(hello);
        }, 1000);
    }

    return function (params) {
        goodbye = params.goodbye;
        helloWorld();
        timeout = setTimeout(function outOfFuel() {
            console.log(goodbye);
            jsfly.crash();
        }, 3500);
    }
// You can supply a parameters object when running the function
}).run({ goodbye: 'Good bye world!' });


/*OUTPUT:
Hello world!       // Every 1 second
Hello world!
Hello world!
Good bye world!    // After 3.5 seconds
*/