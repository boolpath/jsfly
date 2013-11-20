/* NODE MODULES */

/** LOCAL OBJECT 
 * @property {} - 
 */
var GLOBALS = {
    prepend: [
        'setTimeout',
        'clearTimeout',
        'setInterval',
        'clearInterval'
    ],
    redefine: [
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
    prepend: GLOBALS.prepend,
    get: getGlobals
};

/*----------------------------------------------------------------------------*/

/** Returns the global calls that are accessible to JSFly code
 * @returns {object} globals - An object containing the global calls accessible to JSFly code
 */
function getGlobals(AIRSPACE) {
    var globals = {}; 

    Object.defineProperty(globals, 'fly', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function () {
            var callerID = getCaller(),
                caller = AIRSPACE.airport.gates[callerID];

            console.log(caller.name + ' wants to fly.');
        }
    });

    // setTimeout
    if (GLOBALS.redefine.indexOf('setTimeout') >= 0) {
        Object.defineProperty(globals, 'setTimeout', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: function (theFunction, timeout) { 
                var caller = getCaller(),
                    timeoutHandler;

                if (!(AIRSPACE.timeouts[caller] instanceof Array)) {
                    AIRSPACE.timeouts[caller] = [];
                }
                
                theFunction.id = caller;
                timeoutHandler = setTimeout.call(null, theFunction, timeout);
                AIRSPACE.timeouts[caller].push(timeoutHandler);
                return timeoutHandler;
            }
        });
    }
    
    // clearTimeout
    if (GLOBALS.redefine.indexOf('clearTimeout') >= 0) {
        Object.defineProperty(globals, 'clearTimeout', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: function(handler) {
                var caller = getCaller(), 
                    index = AIRSPACE.timeouts[caller].indexOf(handler),
                    result;

                if (index >= 0) {
                    result = clearTimeout.call(null, handler);
                    AIRSPACE.timeouts[caller][index] = undefined;
                }

                return result;
            }
        });
    }

    // setInterval
    if (GLOBALS.redefine.indexOf('setInterval') >= 0) {
        Object.defineProperty(globals, 'setInterval', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: function(theFunction, interval) { 
                var caller = getCaller(),
                    intervalHandler;
                
                if (!(AIRSPACE.intervals[caller] instanceof Array)) {
                    AIRSPACE.intervals[caller] = [];
                }
                
                theFunction.id = caller;
                intervalHandler = setInterval.call(null, theFunction, interval);
                AIRSPACE.intervals[caller].push(intervalHandler);
                return intervalHandler;
            }
        });
    }
    // clearInterval
    if (GLOBALS.redefine.indexOf('clearInterval') >= 0) {
        Object.defineProperty(globals, 'clearInterval', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: function(handler) {
                var caller = getCaller(), 
                    index = AIRSPACE.intervals[caller].indexOf(handler),
                    result;

                if (index >= 0) {
                    result = clearInterval.call(null, handler);
                    AIRSPACE.intervals[caller][index] = undefined;
                }

                return result;
            }
        });
    }

    return globals;
}

/** Finds the caller of a function by recursively looking for a 'id' attribute in the callers
 * @returns {string} id - The ID of top-level caller function
 */
function getCaller() {
    var theCaller = arguments.callee.caller,
        id;
    
    while(!theCaller.id) {
        theCaller = theCaller.caller;
    }
    
    return id = theCaller.id;
}