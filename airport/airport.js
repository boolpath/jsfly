/* NODE MODULES */

/** LOCAL OBJECT 
 * @property {} - 
 */
var AIRPORT = {
    functions: {},
    modules: {}
};

/** MODULE INTERFACE
 *@method {function} create - Creates a JSFly server
 */
module.exports = {
    createServer: createServer,
    addPlane: addPlane
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
    var id = wingified.name + '_' + (new Date()).getTime(),
        added = false;

    Object.defineProperty(wingified, 'id', { value: id });
    
    switch (options.type) {
    case 'function':   
        if (!AIRPORT.functions[id]) { 
            AIRPORT.functions[id] = wingified;
            added = true;
        }
        break;
    case 'module':

        break;
    default:
        break;
    }
    
    return added;
}