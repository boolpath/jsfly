(function parent(JSFly) {
/*----------------------------------------------------------------------------*/
/* NODE MODULES */
var net = require('net');
var eventEmitter = require('events').EventEmitter;
var tcpEventEmitter = require('../../utils/events/tcpEventEmitter');

/** LOCAL OBJECT
 * @property {string} host - The IP address where the JSFly airport/server is running
 * @property {number} port - The port number the JSFly airport/server is listening to
 * @property {object} server - Holds the TCP server object created with the #listen method
 * @property {emitter} - The event emitter returned after creating the control tower
 */
var TOWER = {
    host: undefined,
    port: undefined,
    server: undefined,
    emitter: new eventEmitter()
};

/** MODULE INTERFACE
 *@method {function} listen - Creates a server that listens on a given port 
 */
module.exports = {
    listen: listen
};

/*----------------------------------------------------------------------------*/

/** Creates a TCP server to listen to other airport requests
 * @param {object} options - Options like the port to listen to
 * @param {function} onReady - A callback to invoke when the server is ready
 * @returns
 */
function listen(options, onReady) {
    TOWER.server = net.createServer(function onNewAirport(socket) {
        var newAirport = tcpEventEmitter.bind(socket);
        controlTraffic(newAirport);
        // console.log('New airport connected on port ' + socket.remotePort);
    });
    
    TOWER.server.listen(options.port, function () {
        // console.log('JSFly control tower listening on port ' + options.port);
        onReady(TOWER.emitter);
        TOWER.emitter.emit('ready');
    });
}


/** Handles communications and landing requests from other airports
 * @param {object} clientAirport - The socket created to communicate with a client airport
 */
function controlTraffic(clientAirport) {
    // On incoming JSPlanes, allow them to land, notify the sender airport
    // and emit the landing event for the airport to handle it
    clientAirport.on('jsPlane', function (jsPlane) {
        // console.log('New jsPlane comming:', jsPlane.name);
        clientAirport.send('landed', jsPlane.id);
        JSFly.airport.runway.land(jsPlane);
        TOWER.emitter.emit('landing', jsPlane);
    });
}
/*----------------------------------------------------------------------------*/
})(module.parent.JSFly);