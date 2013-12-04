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

/** 
 * @param
 * @returns
 */
function listen(port, onReady) {
    TOWER.server = net.createServer(function onNewAirport(socket) {
        var jsAirport = tcpEventEmitter.bind(socket);
        console.log('new airport connected');
    });

    TOWER.server.listen(port, function () {
        console.log('JSFly control tower listening on port '+port);
        onReady(TOWER.emitter);
        TOWER.emitter.emit('ready');
    });
}