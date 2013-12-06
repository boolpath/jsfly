(function parent(JSFly) {
/*----------------------------------------------------------------------------*/
/* NODE MODULES */
var net = require('net');
var eventEmitter = require('events').EventEmitter;
var tcpEventEmitter = require('../../utils/events/tcpEventEmitter');

/** LOCAL OBJECT 
 * @property {} - 
 */
var TOWER = {
    host: undefined,
    port: undefined,
    server: undefined,
    emitter: new eventEmitter()
};

/** MODULE INTERFACE
 *@method {function} - 
 */
module.exports = {
    listen: listen
};

/*----------------------------------------------------------------------------*/

/** Creates a TCP server to listen to other airport requests
 * @param {object} options - Options like the port to listen on
 * @param {function} onReady - A callback to be invoked when the server is ready
 * @returns
 */
function listen(options, onReady) {
    TOWER.server = net.createServer(function onNewAirport(socket) {
        var newAirport = tcpEventEmitter.bind(socket);
        controlTraffic(newAirport);
        console.log('new airport connected');
    });
    
    TOWER.server.listen(options.port, function () {
        console.log('JSFly control tower listening on port ' + options.port);
        onReady(TOWER.emitter);
        TOWER.emitter.emit('ready');
    });
}


/** 
 * @param
 * @returns
 */
function controlTraffic(clientAirport) {
    clientAirport.on('jsPlane', function (jsPlane) {
        console.log('New jsPlane comming:', jsPlane.name);
        clientAirport.send('landed', jsPlane.id);
        JSFly.airport.runway.land(jsPlane);
    });
}
/*----------------------------------------------------------------------------*/
})(module.parent.JSFly);