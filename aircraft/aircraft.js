/* NODE MODULES */

/** LOCAL OBJECT 
 * @property {} - 
 */
var AIRCRAFT = {
    
};

/** MODULE INTERFACE
 *@method {function} create - Creates a piece of migratable/autonomous code capable of flying
 */
module.exports = {
    create: create
};

/*----------------------------------------------------------------------------*/

/** Creates a piece of migratable/autonomous code capable of flying
 * @param {object} options - Describes the attributes of the code to be wingified
 * @param {function} code - The code to be wingified
 * @returns {object} jsplane - An object-like migratable/autonomous code
 */
function create(options, code) {
    var jsplane;

    jsplane = {
        run: function () {}
    };

    return jsplane;
}