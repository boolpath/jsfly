/* NODE MODULES */
var net = require('net');
var tcpEventEmitter = require('../../utils/events/tcpEventEmitter');

/** LOCAL OBJECT 
 * @property {} - 
 */
var RUNWAY = {
    requests: []
};

/** MODULE INTERFACE
 *@method {function} - 
 */
module.exports = {
    request: request
};

/*----------------------------------------------------------------------------*/

/** 
 * @param
 * @returns
 */
function request(callerID, targetOptions, reply) {
    if (typeof RUNWAY.requests[callerID] === 'undefined') {
        var targetAirport = net.connect(targetOptions, function () {
            targetAirport = tcpEventEmitter.bind(targetAirport);
        });
        targetAirport.on('error', function (err) {
            switch (err.errno) {
                case 'ECONNREFUSED':
                    console.log('Connection refused to', 
                                targetOptions.host ? 'host' + targetOptions.host + ':' : 'localhost:' +
                                targetOptions.port);
                    break;
                default:
                    console.log('Unhandle connection error', err);
                    break;
            }
        });
    }
}