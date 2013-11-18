(function parent(JSFly) {
module.JSFly = JSFly;

/*----------------------------------------------------------------------------*/
/* NODE MODULES */
var exceptions = require('../exceptions');
/** LOCAL OBJECT 
 * @property {} - 
 */
var WINGIFY = {
    validate: validate,
    aircraft: require('../aircraft')
};

/** MODULE INTERFACE
 * This module only exposes one function that can be called by invoking the module directly
 */
module.exports = wingify;


/*----------------------------------------------------------------------------*/


/** Wingify === transforming a piece of code into migratable/autonomous code
 *          === to give it wings to fly from one server to another
 * @param {object} options - Describes the attributes of the code to be wingified
 * @param {function} code - The code to be wingified
 * @returns {object} wingified - A version of the original code that is able to fly
 */
function wingify(options, code) {
    // Validate the supplied code and options and return if invalid
    if (!WINGIFY.validate(options, code)) { return; }
    // Create a migratable/autonomous piece of code
    var wingified = WINGIFY.aircraft.create(options, code);

    return wingified;
}


/** Validates the code to be wingified according to the specified options
 * @param {object} options - Describes the attributes of the code to be wingified
 * @param {function} code - The code to be wingified
 * @returns {boolean}
 */
function validate(options, code) {
    var valid = true, codeName;

    if (!code) {
        throw exceptions.throwNew('no code'); 
    } else if (typeof code !== 'function') { 
        throw exceptions.throwNew('no function'); 
    }

    codeName = code.name || code.tag || options.name;
    if (typeof codeName !== 'string') {
        throw exceptions.throwNew('nostring function');  
    } else if (!codeName || codeName === '' || codeName.trim() === '') { 
        throw exceptions.throwNew('unnamed function'); 
    }

    if (typeof options !== 'object') {
        throw exceptions.throwNew('no options');
    } else if (typeof options.type === 'undefined') {
        options.type = JSFly.config['default'].codeType;
    } else if (typeof options.type !== 'string' || JSFly.types.indexOf(options.type) < 0) {
        throw exceptions.throwNew('wrong type');
    } 

    options.name = options.name || codeName;

    return valid;
}
/*----------------------------------------------------------------------------*/
})(module.parent.JSFly);
