(function parent(JSFly) {
/*----------------------------------------------------------------------------*/
/* NODE MODULES */
var net = require('net');
var tcpEventEmitter = require('../../utils/events/tcpEventEmitter');

/** LOCAL OBJECT 
 * @property {object} requests - Holds the existing takeoff permission requests
 */
var RUNWAY = {
    requests: {}
};

/** MODULE INTERFACE
 *@method {function} request - Creates a connection to the target airport
 *@method {function} takeoff - Stops running a JSPlane and sends it to another airport
 *@method {function} land - Receives a JSPlane from another airport and starts running it
 */
module.exports = {
    request: request,
    takeoff: takeoff,
    land: land
};

/*----------------------------------------------------------------------------*/

/** Creates a connection to the target airport
 * @param {string} callerID - The ID of the JSPlane requesting permission to fly
 * @param {object} targetOptions - Options like host and port of the destination server
 * @param {function} reply - A callback to invoke when the connection is established
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
            // Try to connect to the target server
            targetServer = net.connect(targetOptions, function () {
                // If the connection is successful, register the request and invoke the callback
                targetAirport = tcpEventEmitter.bind(targetServer);
                RUNWAY.requests[callerID] = {
                    connected: true,
                    airport: targetAirport
                };
                reply(RUNWAY.requests[callerID]);
            });
            targetServer.on('error', function (err) {
                switch (err.errno) {
                // In case the connection attempt is refused, 
                // wait and try again according to the 'retry' object above
                case 'ECONNREFUSED':
                    console.log('Connection refused to', 
                                targetOptions.host + ':' + targetOptions.port);

                    // Keep retrying to connect until the attempts limit is reached
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

/** Stops running a JSPlane and sends it to another airport
 * @param {object} jsPlane - The JSPlane that wants to take off and fly to another airport
 * @param {object} params - The initialization parameters that will be used when running the JSPlane on the destination server
 */
function takeoff(jsPlane, params) {
    var targetAirport;
    // If the JSPlane has previously requested permission to fly, proceed to send it to the target airport
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
        // When the target airport notifies that it the JSPlane landed, stop running it
        targetAirport.on('landed', function () {
            jsPlane.crash();
        });
    }
}

/** Receives a JSPlane from another airport and starts running it
 * @param {object} jsPlane - The JSPlane flying from another airport that wants to land
 * @returns {object} newJSPlane - The JSPlane created from the received JSPlane's source code
 */
 function land(jsPlane) {
    var newJSPlane,
        options = {
            name: jsPlane.name,
            type: jsPlane.type
        };
    
    newJSPlane = JSFly.aircraft.create(options, jsPlane.source);

    // If a new JSPlane could be created, add it to the airport, 
    // start running it and return a reference to its object
    if (newJSPlane) {
        JSFly.airport.addPlane(newJSPlane, options);
        // The initialization parameters are passed when running the landed code
        newJSPlane.run(jsPlane.params);
        // console.log(jsPlane.name + ' just landed.\n');
        return newJSPlane;
    }
 }

/*----------------------------------------------------------------------------*/
})(module.parent.JSFly);