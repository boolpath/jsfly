/* NODE MODULES */
var exceptions = require('../utils/exceptions');
var eventEmitter = require('events').EventEmitter;

/** LOCAL OBJECT 
 * @property {} - 
 */
var AIRPORT = {
    runway: require('./runway'),
    tower: require('./tower'),
    gates: {},

    emitter: new eventEmitter()
};

/** MODULE INTERFACE
 *@method {function} create - Creates a JSFly server
 */
module.exports = {
    gates: AIRPORT.gates,

    create: create,
    addPlane: addPlane,
    requestDeparture: requestDeparture
};

/*----------------------------------------------------------------------------*/

/** Creates a JSFly server
 * @param
 * @returns
 */
function create(options, onReady) {
    if (!validPort(options)) {
        throw exceptions.throwNew('wrong port');
    } else if (typeof onReady !== 'function') {
        throw exceptions.throwNew('wrong onReady');
    }

    AIRPORT.tower.listen(options, function (tower) {
        onReady(AIRPORT.emitter);
        tower.on('ready', function () {
            AIRPORT.emitter.emit('ready');
        });
    });
}

/** Adds
 * @param {object} wingified
 * @returns
 */
function addPlane(wingified, options) {
    var added = false;
      
    if (!AIRPORT.gates[wingified.id]) { 
        AIRPORT.gates[wingified.id] = wingified;
        added = true;
    }

    return added;
}

/** 
 * @param {object} wingified
 * @returns
 */
function requestDeparture(callerID, targetOptions) {
    console.log(callerID.split('_')[0] + ' wants to fly');
    if (//typeof targetOptions === 'undefined' || 
        //!validHost(targetOptions) ||
        !validPort(targetOptions)) {
            throw exceptions.throwNew('wrong fly');
    }

    AIRPORT.runway.request(callerID, targetOptions, function () {

    });
}

/*----------------------------------------------------------------------------*/

/** 
 * @param {object} options
 * @returns
 */
 function validHost(options) {
    var valid = true;

    if (options.host && typeof options.host !== 'string') {
        valid = false;
    }

    return valid;
 }

 /** 
 * @param {object} options
 * @returns
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