(function parent(JSFly) {
/*----------------------------------------------------------------------------*/
/* NODE MODULES */
var domain = require('domain');

/** LOCAL OBJECT 
 * @property {function} newFunction - Creates a wingified code from a function that returns nothing
 * @property {function} newModule - Creates a wingified code from a function that follows the module pattern
 */
var AIRCRAFT = {
    newFunction: newFunction,
    newModule: newModule
};

/** MODULE INTERFACE
 * @method {function} create - Creates a piece of migratable/autonomous code capable of flying
 */
module.exports = {
    create: create
};

/*----------------------------------------------------------------------------*/

/** Creates a piece of migratable/autonomous code capable of flying
 * @param {object} options - Describes the attributes of the code to be wingified
 * @param {function} code - The code to be wingified
 * @returns {object} jsplane - The wingified code, a piece of migratable/autonomous code
 */
function create(options, code) {
    var jsplane;

    switch (options.type) {
    case 'function':
        jsplane = AIRCRAFT.newFunction(options, code);
        break;
    case 'module':
        jsplane = AIRCRAFT.newModule(options, code);
        break;
    default:
        break;
    }
    

    return jsplane;
}


/** Creates a wingified code from a function that returns nothing
 * @param {object} options - Describes the attributes of the code to be wingified
 * @param {function} code - A function that returns nothing
 * @returns {object} wingified - The wingified code, a piece of migratable/autonomous code
 */
function newFunction(options, code) {
    var stringFunction = JSFly.airspace.preprocess(code),   // Prepares the code to make it JSFly-ready
        jsFunction,         // The function that will be created from the supplied and preprocessed code
        wingified,          // The object that will hold the code properties and #run #fly #crash methods
        id;                 // A unique identifier of the wingified code needed to handle global calls

    try {
        // A new function will be created from the preprocessed code string with the 'jsfly' parameter
        jsFunction = new Function('jsfly', 'params', functionBody(stringFunction));
        id = options.name + '_' + (new Date()).getTime() + (Math.floor(Math.random()*1000));
        Object.defineProperty(jsFunction, 'id', { value: id });

        wingified = Object.create(null);
        Object.defineProperty(wingified, 'id', { value: id });
        Object.defineProperty(wingified, 'name', { value: options.name });
        Object.defineProperty(wingified, 'type', { value: 'function' });
        Object.defineProperty(wingified, 'source', { value: stringFunction });

        // The #run method returns the object itself so that there is no need to 
        // #wingify and #run separately in order to keep a reference to wingified
        // The function is called with 'this' set to itself to prevent global namespace clobbering
        Object.defineProperty(wingified, 'run', { 
            value: function (params, onError) { 
                run(params, onError);
                return wingified;
            } 
        });
        // The 'run' variable is created to hold the #run method of the wingified object
        // in order to prevent its implementation to be displayed if #toString is called
        // The #run function is added to a Node domain in order to catch runtime errors/exceptions
        var run = function (params) {
            JSFly.airspace.intercept(function () {
                jsFunction.call(jsFunction, JSFly.globals, params);
            })();   // Call the returned wrapper
        }

        // The #fly and #crash methods are just interfaces to JSFly's global methods
        Object.defineProperty(wingified, 'fly', {
            value: JSFly.globals.fly
        });
        Object.defineProperty(wingified, 'crash', {
            value: JSFly.globals.crash
        });

    } catch (e) {
        console.log(e);
    }

    return wingified;
}


/** Creates a wingified code from a function that follows the module pattern
 * @param {object} options - Describes the attributes of the code to be wingified
 * @param {function} code - A function that follows the module pattern
 * @returns {object} wingified - The wingified code, a piece of migratable/autonomous code
 */
function newModule(options, code) {
    var stringModule = JSFly.airspace.preprocess(code),     // Prepares the code to make it JSFly-ready
        jsModule,           // The function that will be created from the supplied (module pattern) code
        jsReturn,           // The function/object that will be returned when invoking jsModule
        jsFunction,         // The function to be run when the 'run' method is called
        wingified,          // The object that will hold the code properties and #run #fly #crash methods
        id;                 // A unique identifier of the wingified code needed to handle global calls

    try {
        // A new function will be created from the preprocessed code string with the 'jsfly' parameter
        jsModule = new Function('jsfly', 'inits', functionBody(stringModule));
        id = options.name + '_' + (new Date()).getTime() + (Math.floor(Math.random()*1000));
        Object.defineProperty(jsModule, 'id', { value: id });
        
        // jsModule must be invoked in order to obtain the actual function to be run (jsFunction)
        // The module is called with 'this' set to null to prevent global namespace clobbering
        jsReturn = jsModule.call(null, JSFly.globals, options.inits);
        if (typeof jsReturn === 'object' && typeof jsReturn.run === 'function') {
            jsFunction = jsReturn.run;
        } else if (typeof jsReturn === 'function') {
            jsFunction = jsReturn;
        }
        // The same ID is also applied to the returned function since it refers to the same supplied code
        Object.defineProperty(jsFunction, 'id', { value: id });

        wingified = Object.create(null);
        Object.defineProperty(wingified, 'id', { value: id });
        Object.defineProperty(wingified, 'name', { value: options.name });
        Object.defineProperty(wingified, 'type', { value: 'module' });
        Object.defineProperty(wingified, 'source', { value: stringModule });

        // The #run method returns the object itself so that there is no need to 
        // #wingify and #run separately in order to keep a reference to wingified
        // The function is called with 'this' set to itself to prevent global namespace clobbering
        Object.defineProperty(wingified, 'run', { 
            value: function (params) { 
                run(params);
                return wingified;
            } 
        });
        // The 'run' variable is created to hold the #run method of the wingified object
        // in order to prevent its implementation to be displayed if #toString is called
        // The #run function is added to a Node domain in order to catch runtime errors/exceptions
        var run = function (params) {
            JSFly.airspace.intercept(function () {
                jsFunction.call(jsReturn, JSFly.globals, params);
            })();   // Call the returned wrapper
        }

        // The #fly and #crash methods are just interfaces to JSFly's global methods
        Object.defineProperty(wingified, 'fly', {
            value: JSFly.globals.fly
        });
        Object.defineProperty(wingified, 'crash', {
            value: JSFly.globals.crash
        });

    } catch (e) {
        console.log(e);
    }

    return wingified;
}

/*----------------------------------------------------------------------------*/

/** Extracts the body of a function from its the string version
 * @param {string} stringFunction - The string version of a function
 * @returns {string} body - The body of the supplied string function
 */
function functionBody(stringFunction) {
    var from = stringFunction.indexOf('{') + 1, 
        to = stringFunction.lastIndexOf('}') - 1,
        body = stringFunction.slice(from, to).trim();
    return body;
}

/*----------------------------------------------------------------------------*/
})(module.parent.JSFly);
