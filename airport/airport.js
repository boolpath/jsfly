(function parent(JSFly) {
module.JSFly = JSFly;
/*----------------------------------------------------------------------------*/
/* NODE MODULES */
var exceptions = require('../utils/exceptions');
var eventEmitter = require('events').EventEmitter;

/** LOCAL OBJECT 
 * @property {string} host - The IP address where the JSFly airport/server is running
 * @property {number} port - The port number the JSFly airport/server is listening to
 * @property {object} gates - Holds the wingified pieces of code using IDs as keys
 * @property {object} emitter - The event emitter returned after creating the airport
 * @property {object} runway - A module for granting permissions for taking off and landing
 * @property {object} tower - A module for handling communications with other airports
 */
var AIRPORT = module.AIRPORT = {
    host: undefined,
    port: undefined,
    gates: {},

    emitter: new eventEmitter()
};

AIRPORT.runway = require('./runway');
AIRPORT.tower = require('./tower');

/** MODULE INTERFACE
 * @property {object} gates - Holds the wingified pieces of code using IDs as keys
 * @property {object} runway - Grants permissions for taking off and landing
 * @method {function} create - Creates a JSFly airport/server
 * @method {function} addPlane - Assigns a gate to a JSPlane using its ID as the key
 * @method {function} requestDeparture - Requests permission to fly to another airport
 */
module.exports = {
    gates: AIRPORT.gates,
    runway: AIRPORT.runway,

    create: create,
    addPlane: addPlane,
    requestDeparture: requestDeparture
};

/*----------------------------------------------------------------------------*/

/** Creates a JSFly airport/server
 * @param {object} options - Options like the port to listen to other airports and landing requests
 * @pararm {function} onReady - The function to be called when the airport is ready
 *                              An event emitter parameter will be passed when calling this function
 */
function create(options, onReady) {
    // Validate the server options provided
    if (!validPort(options)) {
        throw exceptions.throwNew('wrong port');
    } else if (typeof onReady !== 'function') {
        throw exceptions.throwNew('wrong onReady');
    }

    // Make the control tower listen to a port according to the options parameter
    AIRPORT.tower.listen(options, function (tower) {
        onReady(AIRPORT.emitter);
        // Notify the airport module when the control tower is ready
        tower.on('ready', function () {
            AIRPORT.emitter.emit('ready');
            AIRPORT.host = options.host || 'localhost';
            AIRPORT.port = options.port;
        });
        // Route the landing event to the airport module for further handling
        tower.on('landing', function (jsPlane) {
            AIRPORT.emitter.emit('landing', jsPlane);
        });
    });
}

/** Assigns a gate to a JSPlane and adds it to the server using its ID as the key to store it on the object
 * @param {object} wingified - The JSPlane object to be added to the server
 * @param {object} options - Properties of the JSPlane such as name and type
 * @returns {boolean} added - True if the JSPlane was assigned a gate and added to the server
 */
function addPlane(wingified, options) {
    var added = false;
      
    if (!AIRPORT.gates[wingified.id]) { 
        AIRPORT.gates[wingified.id] = wingified;
        added = true;
    }

    return added;
}

/** Requests permission for a JSPlane to fly to another airport
 * @param {string} callerID - The ID of the JSPlane that wants to fly
 * @param {object} targetOptions - Properties such as host and port of the target server
 */
function requestDeparture(callerID, targetOptions) {
    // Validate the options provided to describe the target server
    if (typeof targetOptions === 'undefined' || 
        !validHost(targetOptions) ||
        !validPort(targetOptions)) {
            throw exceptions.throwNew('wrong fly');
    // Throw an exception if the requested destination server is the same current server
    } else if (targetOptions.port == AIRPORT.port && targetOptions.host == AIRPORT.host) {
        throw exceptions.throwNew('same airport');
    }

    // Request a runway for taking off and flying to the specified server
    AIRPORT.runway.request(callerID, targetOptions, function (result) {
        if (result.connected) {
            AIRPORT.runway.takeoff(AIRPORT.gates[callerID], targetOptions.params);
        } else {
            console.log('Target airport is not available.');
        }
    });
}

/*----------------------------------------------------------------------------*/

/** Validates the host specified in the options parameter
 * @param {object} options - An object containing the host to validate
 * @returns {boolean} valid - True if it's a valid host
 */
 function validHost(options) {
    var valid = true;

    if (options.host) {
        if (typeof options.host !== 'string') {
            valid = false;
        }
    } else {
        options.host = 'localhost';
    }

    return valid;
 }

 /** Validates the port specified in the options parameter
 * @param {object} options - An object containing the port to validate
 * @returns {boolean} valid - True if it's a valid port
 */
 function validPort(options) {
    var valid = true;

    if (options.port && typeof options.port !== 'number') {
        options.port = parseInt(options.port);
        if (isNaN(options.port)) {
            valid = false;
        }
    }

    return valid;
 }
 /*----------------------------------------------------------------------------*/
})(module.parent.JSFly);