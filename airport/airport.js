/* NODE MODULES */

/** LOCAL OBJECT 
 * @property {} - 
 */
var AIRPORT = {
    gates: {}
};

/** MODULE INTERFACE
 *@method {function} create - Creates a JSFly server
 */
module.exports = {
    createServer: createServer,
    addPlane: addPlane,

    gates: AIRPORT.gates
};

/*----------------------------------------------------------------------------*/

/** Creates a JSFly server
 * @param
 * @returns
 */
function createServer() {
    
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