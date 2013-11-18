/* NODE MODULES */

/** LOCAL OBJECT 
 * @property {} - 
 */
var AIR = {
    
};

/** MODULE INTERFACE
 *@method {function} - Sets up the airspace by configuring the global variables and methods
 */
module.exports = {
    setup: setup
};

/*----------------------------------------------------------------------------*/

/** Sets up the airspace by configuring the global variables and methods
 *  Overrides globals like setTimeout to intercept calls to grant permissions
 *  and to avoid redefinitions by wingified code
 * @returns
 */
function setup() {
    
}
