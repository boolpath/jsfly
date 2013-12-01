/* NODE MODULES */

/** LOCAL OBJECT 
 * @property {function} wingify - The module in charge of transforming regular code into migratable/autonomous code.
 * @property {object} config - Contains the default configuration to use when wingifying code.
 * @property {object} types - An array containing the valid code types accepted by JSFly. 
 */
var JSFly = module.JSFly = {
    config: {
        'default': {
            codeType: 'function'
        }
    },
    types: ['function', 'module']
};

JSFly.airport = require('./airport');
JSFly.airspace = require('./airspace');
JSFly.airspace.setup();
JSFly.globals = JSFly.airspace.getGlobals();
JSFly.wingify = require('./wingify');

/** MODULE INTERFACE
 * @method {function} wingify - Transforms a piece of code into migratable/autonomous code
 * @method {function} config - Configures the default options to use when wingifying code
 */
module.exports = {
    wingify: wingify,
    config: config,
    createServer: createServer
};


/*----------------------------------------------------------------------------*/


/** Wingify === transforming a piece of code into migratable/autonomous code
 *          === to give it wings to fly from one server to another
 * @param {object} options - Describes the attributes of the code to be wingified
 * @param {function} code - The code to be wingified
 * @returns {object} wingified - A version of the original code that is able to fly
 */
function wingify(options, code) {
    var wingified;
    // Verify how many arguments were passed and rearraged them
    var args = [].slice.call(arguments);
    if (args.length === 1) { 
        code = options;
        options = {};
    }

    try {
        var wingifiedTemp = JSFly.wingify(options, code);
        if (JSFly.airport.addPlane(wingifiedTemp, options)) {
            wingified = wingifiedTemp;
        }
    } catch (e) {
        handleExceptions(e);
    } finally {
        if (typeof wingified === 'undefined') {
            wingified = wingifiedDummy;
        }
        return wingified;
    }
}

// An object to return every time a piece of code cannot be wingified
var wingifiedDummy = {
    run: function () {
        console.log('Supplied code could not be wingified.');
    },
    fly: function () {
        console.log('Supplied code could not be wingified, so it cannot fly.');
    },
    crash: function () {
        console.log('Supplied code could not be wingified, so it cannot crash.');
    }
}

/** Handles exceptions thrown when trying to wingify a piece of code
 * @param {object} e - Describes the exception thrown
 * @returns
 */
function handleExceptions(e) {
    if (e.name === 'TypeError') {
        throw e;
    }
    console.log('ERROR: ', e.name+' -', e.message);
}


/** Configures the default options to use when wingifying code
 * @param {object} options - The options to be configured
 * @returns {boolean} configured - True if the options where configured successfully
 */
function config(options) {
    var configured = true;
    if(JSFly.types.indexOf(options.type) < 0) {
        JSFly.config['default'].codeType = options.type;
    }
    else {
        configured = false;
    }
    return configured;
}


/** Creates a JSFly server
 * @param {string} host - 
 * @param {string} port - 
 * @returns 
 */
function createServer(host, port) {

}