/* NODE MODULES */

/** LOCAL OBJECT 
 * @property {} - 
 */
var JSFLY = {
    wingify: require('./wingify')
};

/** MODULE INTERFACE
 * @method {function} - 
 */
module.exports = {
    wingify: wingify
};

/*----------------------------------------------------------------------------*/

/** 
 * @param {function}
 * @returns
 */
function wingify(options, code) {
    return {
        run: function() {}
    };
}

