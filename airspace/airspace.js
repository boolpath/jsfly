/* NODE MODULES */
var exceptions = require('../exceptions');
/** LOCAL OBJECT 
 * @property {} - 
 */
var AIRSPACE = {
    calls: []
};

/** MODULE INTERFACE
 *@method {function} - Sets up the airspace by configuring the global variables and methods
 */
module.exports = {
    setup: setup,
    prependCalls: prependCalls,
    getGlobals: getGlobals
};

/*----------------------------------------------------------------------------*/

/** Sets up the airspace by configuring the global variables and methods
 *  Overrides globals like setTimeout to intercept calls to grant permissions
 *  and to avoid redefinitions by wingified code
 * @returns
 */
function setup(callsToPrepend) {
    var prependCalls = callsToPrepend || [
        'setTimeout', 
        'clearTimeout',
        'setInterval',
        'clearInterval'
    ];

    prependCalls.forEach(function (call) {
        AIRSPACE.calls.push(call);
    });
}

/** 
 * @param
 * @returns
 */
function prependCalls(rawFunction) {
    var stringFunction = rawFunction.toString().trim();
    AIRSPACE.calls.forEach(function(call) {
        stringFunction = stringFunction.replace(call, 'jsfly.'+call);
    });
    return stringFunction;
}

/** 
 * @param
 * @returns
 */
function getGlobals() {
    var globals = {};

    globals.setTimeout = setTimeout;

    return globals;
}
