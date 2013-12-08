// AUTONOMOUS CODE THAT FLIES FROM ANOTHER SERVER
// JSFly offers the #createAirport method that creates a server
// that is capable of receiving code from another server and running it
var jsfly = require('../jsfly');

// The #createAirport method receives an options parameter with the desired port
var options = {
    port: '3600'
};

// A callback must be supplied to receive the 'airport' object 
// in order to start handling JSFly events
jsfly.createAirport(options, function (airport) {
    // The 'ready' event is emitted when the server is created
    airport.on('ready', function () {
        console.log('JSFly airport ready.');
    });
    // The 'newJSPlane' event is emitted each time a new piece of code is received
    airport.on('newJSPlane', function (jsPlane) {
        console.log(jsPlane.name + ' is running here now!');
    });
});

/*OUTPUT:
myNameIs is running here now!
Hello world!       // Every 1 second
Hello world!
Hello world!
Same airport:  Departure and target airport are the same. Denied permission to fly.
Hello world!
Hello world!
Good bye world!    // After 5.2 seconds 
*/