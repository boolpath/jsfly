// CODE THAT USES THE MODULE PATTERN
// JSFly accepts functions that follow the module pattern to organize the code and use closures
var jsfly = require('../jsfly');

// In order to use the module pattern, you must say it explicitly by providing the {type: 'module'} object,
// or by changing the default code type using jsfly.config({type: 'module'}) before jsfly.wingify()
// Then, you can supply a function that returns the function to be run
var wingified = jsfly.wingify({type: 'module'}, function myNameIs(jsfly) {
    var timeout, interval,
        hello = 'Hello World!',
        goodbye = 'Good bye world!';

    function helloWorld() {
        interval = setInterval(function () {
            console.log(hello);
        }, 1000);
    }

    return function () {
        helloWorld();
        timeout = setTimeout(function outOfFuel() {
            console.log(goodbye);
            jsfly.crash();
        }, 3500);
    }
}).run();

/*OUTPUT:
Hello world!       // Every 1 second
Hello world!
Hello world!
Good bye world!    // After 3.5 seconds
*/