(function parent(JSFly) {
/*----------------------------------------------------------------------------*/
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
    request: request,
    takeoff: takeoff,
    land: land
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
                maxAttempts: 1,
                timeout: 3000
            };

        (function connect() {
            targetServer = net.connect(targetOptions, function () {
                targetAirport = tcpEventEmitter.bind(targetServer);
                RUNWAY.requests[callerID] = {
                    connected: true,
                    airport: targetAirport
                };
                reply(RUNWAY.requests[callerID]);
            });
            targetServer.on('error', function (err) {
                switch (err.errno) {
                    case 'ECONNREFUSED':
                        console.log('Connection refused to', 
                                    targetOptions.host ? 'host' + targetOptions.host + ':' : 
                                    'localhost:' + targetOptions.port);

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
                        console.log('Unhandled connection error:\n', err);
                        break;
                }
            });
        })();
    }
}

/** 
 * @param
 * @returns
 */
function takeoff(jsPlane) {
    var targetAirport;
    if (RUNWAY.requests[jsPlane.id]) {
        console.log(jsPlane.name + ' is taking off.');
        targetAirport = RUNWAY.requests[jsPlane.id].airport;
        targetAirport.send('jsPlane', {
            id: jsPlane.id,
            name: jsPlane.name,
            type: jsPlane.type,
            source: jsPlane.source
        });
        targetAirport.on('landed', function () {
            jsPlane.crash();
        });
    }
}


/** 
 * @param
 * @returns
 */
 function land(jsPlane) {
    console.log(jsPlane.name + ' wants to land.');
    JSFly.aircraft.create({
        name: jsPlane.name,
        type: jsPlane.type
    }, jsPlane.source).run();
 }
 
/*----------------------------------------------------------------------------*/
})(module.parent.JSFly);