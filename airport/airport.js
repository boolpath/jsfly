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
    create: create,
    addPlane: addPlane,

    gates: AIRPORT.gates
};

/*----------------------------------------------------------------------------*/

/** Creates a JSFly server
 * @param
 * @returns
 */
function create(port, onReady) {
    if (typeof port !== 'number') {
        port = parseInt(port);
        if (isNaN(port)) {
            throw exceptions.throwNew('wrong port');
        }
    } else if (typeof onReady !== 'function') {
        throw exceptions.throwNew('wrong onReady');
    }

    AIRPORT.tower.listen(port, function (tower) {
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