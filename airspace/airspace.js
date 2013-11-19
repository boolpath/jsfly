/* NODE MODULES */
var exceptions = require('../exceptions');
/** LOCAL OBJECT 
 * @property {object} calls - [Array] Contains the methods to be prepended with 'jsfly.' during preprocessing
 * @method {function} prependCalls - Prepends the global calls in the code to be wingified according to the 'calls' array
 * @property {object} timeouts - Contains the timeout handlers grouped by the functions that created them
 * @property {object} intervals - Contains the interval handlers grouped by the functions that created them
 */
var AIRSPACE = {
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
    getGlobals: getGlobals
};

/*----------------------------------------------------------------------------*/

/** Sets up the airspace by configuring the global variables and methods
 *  Overrides globals like setTimeout to intercept calls to grant permissions
 *  and to avoid redefinitions by wingified code
 * @param {object} callsToPrepend - Optional array specifying the methods to be prepended with 'jsfly.' during preprocessing 
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

/** Returns the global calls that are accessible to JSFly code
 * @returns {object} globals - An object containing the global calls accessible to JSFly code
 */
function getGlobals() {
    var globals = {};

    // setTimeout
    globals.setTimeout = function(theFunction, timeout) { 
        var caller = getCaller(),
            timeoutHandler;

        if (!(AIRSPACE.timeouts[caller] instanceof Array)) {
            AIRSPACE.timeouts[caller] = [];
        }
        
        theFunction.tag = caller;
        timeoutHandler = setTimeout.call(null, theFunction, timeout);
        AIRSPACE.timeouts[caller].push(timeoutHandler);
        return timeoutHandler;
    };
    // clearTimeout
    globals.clearTimeout = function(handler) {
        var caller = getCaller(), 
            index = AIRSPACE.timeouts[caller].indexOf(handler),
            result;

        if (index >= 0) {
            result = clearInterval.call(null, handler);
            AIRSPACE.timeouts[caller][index] = undefined;
        }

        return result;
    };

    // setInterval
    globals.setInterval = function(theFunction, interval) { 
        var caller = getCaller(),
            intervalHandler;
        
        if (!(AIRSPACE.intervals[caller] instanceof Array)) {
            AIRSPACE.intervals[caller] = [];
        }
        
        theFunction.tag = caller;
        intervalHandler = setInterval.call(null, theFunction, interval);
        AIRSPACE.intervals[caller].push(intervalHandler);
        return intervalHandler;
    };
    // clearInterval
    globals.clearInterval = function(handler) {
        var caller = getCaller(), 
            index = AIRSPACE.intervals[caller].indexOf(handler),
            result;

        if (index >= 0) {
            result = clearTimeout.call(null, handler);
            AIRSPACE.intervals[caller][index] = undefined;
        }

        return result;
    }

    return globals;
}

/** Finds the caller of a function by recursively looking for a 'tag' attribute in the callers
 * @returns {string} tag - The name of top-level caller function
 */
function getCaller() {
    var theCaller = arguments.callee.caller,
        tag;
    
    while(!theCaller.tag) {
        theCaller = theCaller.caller;
    }
    
    return tag = theCaller.tag;
}
