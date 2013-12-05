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
        var targetServer, 
            retry = { 
                again: true,
                attempts: 0,
                maxAttempts: 3,
                timeout: 3000
            };

        (function connect() {
            targetServer = net.connect(targetOptions, function () {
                targetAirport = tcpEventEmitter.bind(targetServer);
                reply({
                    connected: true,
                    airport: targetAirport
                });
            });
            targetServer.on('error', function (err) {
                switch (err.errno) {
                    case 'ECONNREFUSED':
                        console.log('Connection refused to', 
                                    targetOptions.host ? 'host' + targetOptions.host : 'localhost' +
                                    ':' + targetOptions.port);
                        if (++retry.attempts <= retry.maxAttempts) {   
                            setTimeout(function tryAgain() {
                                connect();
                            }, retry.timeout);
                        } else {
                            reply({
                                connected: false
                            });
                        }
                        break;
                    default:
                        console.log('Unhandle connection error', err);
                        break;
                }
            });
        })();
    }
}