/** LOCAL OBJECT 
 * @property {object} prepend - An array containing the methods that must be prepended with 'jsfly.'
 * @property {object} redefine - An array containing the methods whose calls must be intercepted and redefined
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
 * @method {function} prepend - Returns the array of methods that must be prepended with 'jsfly.'
 * @method {function} get - Returns an object with the available global methods as its properties
 */
module.exports = {
    prepend: GLOBALS.prepend,
    get: getGlobals
};

/*----------------------------------------------------------------------------*/

/** Returns the global methods that are accessible to JSFly code after being prepended with 'jsfly.'
 * @param {object} AIRSPACE - The airspace (namespace) where the timeouts and intervals will be registered
 * @param {object} AIRPORT - The local airport whose gates contain the JSPlanes calling global methods
 * @returns {object} globals - An object containing the global calls accessible to JSFly code
 */
function getGlobals(AIRSPACE, AIRPORT) {
    var globals = {}; 

    // 1. jsfly.fly
    // The method that allows JSPlanes to autonomously request to be migrated to another server
    Object.defineProperty(globals, 'fly', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (options) {
            fly(this.id, options);
        }
    });
    // The 'fly' variable is created to hold the global #fly method
    // in order to prevent its implementation to be displayed if #toString is called
    // @param {string} id - The ID of the JSPlane calling the #fly method
    // @param {string} targetOptions - Options like host and port of the destination JSFly airport
    var fly = function (id, targetOptions) {
        var callerID = id || getCaller(),
            caller = AIRPORT.gates[callerID];

        try {
            AIRPORT.requestDeparture(callerID, targetOptions);
        } catch (e) {
            // console.log(e.name + ': ', e.message);
        }
    }

    // 2. jsfly.crash
    // The method that allows JSPlanes to autonomously request to stop running
    Object.defineProperty(globals, 'crash', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function () {
            crash(this.id);
        }
    });
    // The 'crash' variable is created to hold the global #crash method
    // in order to prevent its implementation to be displayed if #toString is called
    // @param {string} id - The ID of the JSPlane calling the #fly method
    var crash = function (id) {
        var callerID = id || getCaller(),
            caller = AIRPORT.gates[callerID];

        // If the JSPlane set up any timeouts, clear them all
        if (AIRSPACE.timeouts[callerID] instanceof Array) {
            AIRSPACE.timeouts[callerID].forEach(function (timeout) {
                clearTimeout(timeout);
            });
            AIRSPACE.timeouts[callerID] = undefined;
        }
        // If the JSPlane set up any intervals, clear them all
        if (AIRSPACE.intervals[callerID] instanceof Array) {
            AIRSPACE.intervals[callerID].forEach(function (interval) {
                clearInterval(interval);
            });
            AIRSPACE.intervals[callerID] = undefined;
        }
    }

    // setTimeout
    // Redefine the setTimeout function if it's listed in the GLOBALS.redefine array
    if (GLOBALS.redefine.indexOf('setTimeout') >= 0) {
        Object.defineProperty(globals, 'setTimeout', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: function (theFunction, timeout) { 
                var callerID = getCaller(),
                    caller = AIRPORT.gates[callerID], 
                    timeoutHandler;

                if (!caller) {
                    return;
                } else if (!(AIRSPACE.timeouts[callerID] instanceof Array)) {
                    AIRSPACE.timeouts[callerID] = [];
                }
                
                // Tag the provided callback function with the callerID
                // so that inner global calls can be tracked to the caller's ID
                theFunction.id = callerID;
                timeoutHandler = setTimeout.call(null, theFunction, timeout);
                AIRSPACE.timeouts[callerID].push(timeoutHandler);
                
                return timeoutHandler;
            }
        });
    }
    
    // clearTimeout
    // Redefine the clearTimeout function if it's listed in the GLOBALS.redefine array
    if (GLOBALS.redefine.indexOf('clearTimeout') >= 0) {
        Object.defineProperty(globals, 'clearTimeout', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: function(handler) {
                var callerID = getCaller(), result;

                if (!AIRSPACE.timeouts[callerID]) {
                    return;
                }

                var index = AIRSPACE.timeouts[callerID].indexOf(handler);

                if (index >= 0) {
                    result = clearTimeout.call(null, handler);
                    AIRSPACE.timeouts[callerID][index] = undefined;
                }

                return result;
            }
        });
    }

    // setInterval
    // Redefine the setInterval function if it's listed in the GLOBALS.redefine array
    if (GLOBALS.redefine.indexOf('setInterval') >= 0) {
        Object.defineProperty(globals, 'setInterval', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: function(theFunction, interval) { 
                var callerID = getCaller(),
                    caller = AIRPORT.gates[callerID],
                    intervalHandler;

                if (!caller) {
                    return;
                } else if (!(AIRSPACE.intervals[callerID] instanceof Array)) {
                    AIRSPACE.intervals[callerID] = [];
                }
                
                // Tag the provided callback function with the callerID
                // so that inner global calls can be tracked to the caller's ID
                theFunction.id = callerID;
                intervalHandler = setInterval.call(null, theFunction, interval);
                AIRSPACE.intervals[callerID].push(intervalHandler);

                return intervalHandler;
            }
        });
    }

    // clearInterval
    // Redefine the clearInterval function if it's listed in the GLOBALS.redefine array
    if (GLOBALS.redefine.indexOf('clearInterval') >= 0) {
        Object.defineProperty(globals, 'clearInterval', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: function(handler) {
                var callerID = getCaller(), result;

                if (!AIRSPACE.intervals[callerID]) {
                    return;
                }

                var index = AIRSPACE.intervals[callerID].indexOf(handler);

                if (index >= 0) {
                    result = clearInterval.call(null, handler);
                    AIRSPACE.intervals[callerID][index] = undefined;
                }

                return result;
            }
        });
    }

    return globals;
}

/** Finds the caller of a function by recursively looking for an 'id' attribute in the callers
 * @returns {string} id - The ID of the top-level caller function
 */
function getCaller() {
    var theCaller = arguments.callee.caller,
        id;

    while (!theCaller.id) {
        theCaller = theCaller.caller; //console.log(theCaller.toString());
    }
    id = theCaller.id;

    return id;
}