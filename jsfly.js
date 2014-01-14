/** LOCAL OBJECT 
 * @property {object} config - Contains the default configuration to use when wingifying code
 * @property {object} types - An array containing the valid code types accepted by JSFly
 * @property {object} airport - The module in charge of creating a JSFly server and handling migration requests
 * @property {object} airspace - The module in charge of preprocessing the code to intercept global calls
 * @property {object} globals - A set of allowed global calls like #fly, #crash, #setTimeout, #setInterval
 * @property {object} aircraft - The module in charge of transforming regular code into migratable/autonomous code
 * @property {object} wingify - The module in charge of validating the parameters provided on calls to jsfly#wingify
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
JSFly.aircraft = require('./aircraft');
JSFly.wingify = require('./wingify');

/** MODULE INTERFACE
 * @method {function} wingify - Transforms a piece of code into migratable/autonomous code
 * @method {function} config - Configures the default options to use when wingifying code
 * @method {function} createAirport - Creates a JSFly server for handling migration requests
 */
module.exports = {
    wingify: wingify,
    config: config,
    createAirport: createAirport
};

/*----------------------------------------------------------------------------*/

/** Enable the creation of JSFly servers from the command line
 * Run jsfly.js from the command line and pass the port number as a parameter
 * Type 'node jsfly portNumber'
 */
var serverPort = process.argv[2];
if (serverPort) {
    serverPort = parseInt(serverPort);
    if (typeof serverPort === 'number') {
        createAirport({ port: serverPort }, function () {
            // console.log('JSFly airport created on port ' + serverPort);
        });
    }
}

/*----------------------------------------------------------------------------*/

/** Wingify === transforming a piece of code into migratable/autonomous code
 *          === to give it wings to fly from one server to another
 * @param {object} options - Describes the attributes of the code to be wingified
 * @param {function} code - The code to be wingified
 * @returns {object} wingified - A version of the original code that is able to fly
 */
function wingify(options, code) {
    var wingified;
    // Verify how many arguments were passed and rearrange them
    var args = Array.prototype.slice.call(arguments);
    if (args.length === 1) { 
        code = options;
        options = {};
    }

    try {
        // #wingify the provided code and add it to the system
        var wingifiedTemp = JSFly.wingify(options, code);
        if (wingifiedTemp && JSFly.airport.addPlane(wingifiedTemp, options)) {
            wingified = wingifiedTemp;
        }
    } catch (e) {
        handleExceptions(e);
    } finally {
        // If the code could not be wingified, return a dummy object
        if (typeof wingified === 'undefined') {
            wingified = wingifiedDummy;
        }
        return wingified;
    }
}

// An object to return every time a piece of code cannot be wingified
var wingifiedDummy = {
    canFly: false,
    run: function run() {
        console.log('Supplied code could not be wingified, so it cannot run.');
    },
    fly: function fly() {
        console.log('Supplied code could not be wingified, so it cannot fly.');
    },
    crash: function crash() {
        console.log('Supplied code could not be wingified, so it cannot crash.');
    }
}

/** Handles exceptions thrown when trying to wingify a piece of code
 * @param {object} e - Describes the thrown exception
 * @throws {object} e - The exception if it's a TypeError exception
 */
function handleExceptions(e) {
    if (e.name === 'TypeError') {
        throw e;
    }
    console.log('ERROR: ', e.name + ' -', e.message);
}

/** Configures the default options to use when wingifying code
 * @param {object} options - The options to be configured
 * @returns {boolean} configured - True if the options where configured successfully
 */
function config(options) {
    var configured = true;
    if (JSFly.types.indexOf(options.type) < 0) {
        JSFly.config['default'].codeType = options.type;
    } else {
        configured = false;
    }
    return configured;
}

/** Creates a JSFly server
 * @param {object} options - Options like the port to listen to other airports and landing requests
 * @pararm {function} onReady - The function to be called when the airport is ready
 *                              An event emitter parameter will be passed when calling this function
 */
function createAirport(options, onReady) {
    JSFly.airport.create(options, onReady);
}
