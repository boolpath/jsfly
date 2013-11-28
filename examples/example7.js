// CODE THAT USES THE MODULE PATTERN
// JSFly accepts functions that follow the module pattern to organize the code and use closures
var jsfly = require('../jsfly');

// You can also supply a function that returns an object with a 'run' method
// This is useful if you want to expose certain functionality 
// or if you prefer to call helper methods using this(**self) instead of using closure
var wingified = jsfly.wingify({type: 'module'}, function myNameIs(jsfly) {
    var timeout, interval,
        hello = 'Hello World!',
        goodbye = 'Good bye world!';

    function helloWorld() {
        interval = setInterval(function () {
            console.log(hello);
        }, 1000);
    }

    return {
        run: function () {
            // ** 'self' must be used to keep 'this' throughout different function scopes
            var self = this;

            helloWorld();

            timeout = setTimeout(function outOfFuel() {
                self.yell(goodbye);
                jsfly.crash();
            }, 3500);
        },
        yell: function (m) {
            console.log(m.toUpperCase());
        }
    }
}).run();

/*OUTPUT:
Hello world!       // Every 1 second
Hello world!
Hello world!
GOOD BYE WORLD!    // After 3.5 seconds
*/