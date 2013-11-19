/* NODE MODULES */

/** LOCAL OBJECT 
 * @property {} - 
 */
var GLOBALS = {
    defaults: [
        'setTimeout', 
        'clearTimeout',
        'setInterval',
        'clearInterval'
    ]
};

/** MODULE INTERFACE
 * The module eports an array 
 */
module.exports = {
    defaults: GLOBALS.defaults,
    get: getGlobals
};

/*----------------------------------------------------------------------------*/

/** Returns the global calls that are accessible to JSFly code
 * @returns {object} globals - An object containing the global calls accessible to JSFly code
 */
function getGlobals(AIRSPACE) {
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