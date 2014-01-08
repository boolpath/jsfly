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
                                    targetOptions.host + ':' + targetOptions.port);

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
function takeoff(jsPlane, params) {
    var targetAirport;
    if (RUNWAY.requests[jsPlane.id]) {
        // console.log(jsPlane.name + ' is taking off.');
        targetAirport = RUNWAY.requests[jsPlane.id].airport;
        targetAirport.send('jsPlane', {
            id: jsPlane.id,
            name: jsPlane.name,
            type: jsPlane.type,
            source: jsPlane.source,
            params: params
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
    var newJSPlane,
        options = {
            name: jsPlane.name,
            type: jsPlane.type
        };
    
    newJSPlane = JSFly.aircraft.create(options, jsPlane.source);

    if (newJSPlane) {
        JSFly.airport.addPlane(newJSPlane, options);
        newJSPlane.run(jsPlane.params);
        // console.log(jsPlane.name + ' just landed.\n');

        return newJSPlane;
    }
 }

/*----------------------------------------------------------------------------*/
})(module.parent.JSFly);