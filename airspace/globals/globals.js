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
function getGlobals(AIRSPACE, AIRPORT) {
    var globals = {}; 

    // fly
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
    var fly = function (id, targetOptions) {
        var callerID = id || getCaller(),
            caller = AIRPORT.gates[callerID];

        try {
            AIRPORT.requestDeparture(callerID, targetOptions);
        } catch (e) {
            console.log(e.name + ': ', e.message);
        }
    }

    // crash
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
    var crash = function (id) {
        var callerID = id || getCaller(),
            caller = AIRPORT.gates[callerID],
            callerName = caller ? caller.name : callerID.split('_')[0];

        if (AIRSPACE.timeouts[callerID] instanceof Array) {
            AIRSPACE.timeouts[callerID].forEach(function (timeout) {
                clearTimeout(timeout);
            });
            AIRSPACE.timeouts[callerID] = undefined;
        }
        if (AIRSPACE.intervals[callerID] instanceof Array) {
            AIRSPACE.intervals[callerID].forEach(function (interval) {
                clearInterval(interval);
            });
            AIRSPACE.intervals[callerID] = undefined;
        }
    }

    // setTimeout
    if (GLOBALS.redefine.indexOf('setTimeout') >= 0) {
        Object.defineProperty(globals, 'setTimeout', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: function (theFunction, timeout) { 
                var callerID = getCaller(),
                    timeoutHandler,
                    caller = AIRPORT.gates[callerID];
                    console.log(callerID);
                if (!caller) {
                    return;
                }

                if (!(AIRSPACE.timeouts[callerID] instanceof Array)) {
                    AIRSPACE.timeouts[callerID] = [];
                }
                
                theFunction.id = callerID;
                timeoutHandler = setTimeout.call(null, theFunction, timeout);
                AIRSPACE.timeouts[callerID].push(timeoutHandler);
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
                var callerID = getCaller();

                if (!AIRSPACE.timeouts[callerID]) {
                    return;
                }

                var index = AIRSPACE.timeouts[callerID].indexOf(handler),
                    result;

                if (index >= 0) {
                    result = clearTimeout.call(null, handler);
                    AIRSPACE.timeouts[callerID][index] = undefined;
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
                var callerID = getCaller(),
                    intervalHandler;
                
                if (!(AIRSPACE.intervals[callerID] instanceof Array)) {
                    AIRSPACE.intervals[callerID] = [];
                }
                
                theFunction.id = callerID;
                intervalHandler = setInterval.call(null, theFunction, interval);
                AIRSPACE.intervals[callerID].push(intervalHandler);
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
                var callerID = getCaller();

                if (!AIRSPACE.intervals[callerID]) {
                    return;
                }

                var index = AIRSPACE.intervals[callerID].indexOf(handler),
                    result;

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

/** Finds the caller of a function by recursively looking for a 'id' attribute in the callers
 * @returns {string} id - The ID of top-level caller function
 */
function getCaller() {
    var theCaller = arguments.callee.caller,
        id;

    while(!theCaller.id) {
        theCaller = theCaller.caller; //console.log(theCaller.toString());
    }
    id = theCaller.id;
    return id;
}