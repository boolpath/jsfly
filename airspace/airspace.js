/* NODE MODULES */
var exceptions = require('../utils/exceptions');
/** LOCAL OBJECT 
 * @property {object} calls - [Array] Contains the methods to be prepended with 'jsfly.' during preprocessing
 * @method {function} prependCalls - Prepends the global calls in the code to be wingified according to the 'calls' array
 * @property {object} timeouts - Contains the timeout handlers grouped by the functions that created them
 * @property {object} intervals - Contains the interval handlers grouped by the functions that created them
 */
var AIRSPACE = {
    globals: require('./globals'),

    calls: [],
    prependCalls: prependCalls,

    timeouts: {},
    intervals: {}
};

/** MODULE INTERFACE
 *@method {function} setup - Sets up the airspace by configuring the global variables and methods
 *@method {function} preprocess - Prepares the code to make it JSFly-ready by applying some transformations 
 *                                (e.g. prepending 'jsfly.' to calls like setTimeout and setInterval)
 *@method {function} getGlobals - Returns the global calls that are accessible to JSFly code
 */
module.exports = {
    setup: setup,
    preprocess: preprocess,
    getGlobals: function() { 
        return AIRSPACE.globals.get(AIRSPACE);
    }
};

/*----------------------------------------------------------------------------*/

/** Sets up the airspace by configuring the global variables and methods
 *  Overrides globals like setTimeout to intercept calls to grant permissions
 *  and to avoid redefinitions by wingified code
 * @param {object} callsToPrepend - Optional array specifying the methods to be prepended with 'jsfly.' during preprocessing 
 * @returns
 */
function setup(callsToPrepend) {
    if(callsToPrepend) {
        AIRSPACE.globals.defaults = callsToPrepend;
    }
    var prependCalls = AIRSPACE.globals.prepend;

    prependCalls.forEach(function (call) {
        AIRSPACE.calls.push(call);
    });
}

/** Prepares the code to make it JSFly-ready by applying some transformations 
 *  (e.g. prepending 'jsfly.' to calls like setTimeout and setInterval)
 * @param {function} code - The code to be preprocessed
 * @returns {string} processedCode - A string version of the preprocessed code
 */
function preprocess(code) {
    var processedCode;
    // Prepend global method calls with 'jsfly.'
    processedCode = AIRSPACE.prependCalls(code);
    
    return processedCode;
}
/** Prepends global method calls with 'jsfly.'
 * @param {function} rawFunction - The function to be preprocessed
 * @returns {string} stringFunction - A string version of the function with prepended calls
 */
function prependCalls(rawFunction) {
    var stringFunction = rawFunction.toString().trim();
    AIRSPACE.calls.forEach(function(call) {
        stringFunction = stringFunction.replace(call, 'jsfly.'+call);
    });
    return stringFunction;
}
