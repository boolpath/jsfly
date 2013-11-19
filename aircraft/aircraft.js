(function parent(JSFly) {
/*----------------------------------------------------------------------------*/
/* NODE MODULES */

/** LOCAL OBJECT 
 * @property {} - 
 */
var AIRCRAFT = {
    newFunction: newFunction,
    newModule: newModule
};

/** MODULE INTERFACE
 *@method {function} create - Creates a piece of migratable/autonomous code capable of flying
 */
module.exports = {
    create: create
};

/*----------------------------------------------------------------------------*/

/** Creates a piece of migratable/autonomous code capable of flying
 * @param {object} options - Describes the attributes of the code to be wingified
 * @param {function} code - The code to be wingified
 * @returns {object} jsplane - An object-like migratable/autonomous code
 */
function create(options, code) {
    var jsplane;

    switch (options.type) {
    case "function":
        jsplane = AIRCRAFT.newFunction(options, code);
        break;
    case "module":
        jsplane = AIRCRAFT.newModule(options, code);
        break;
    default:
        break;
    }
    

    return jsplane;
}

/** 
 * @param
 * @returns
 */
function newFunction(options, code) {
    var stringFunction = JSFly.airspace.preprocess(code),
        jsFunction,
        wingified = {};
    
    try {
        jsFunction = new Function('jsfly', 'params', functionBody(stringFunction));

        var id = options.name + '_' + (new Date()).getTime() + (Math.floor(Math.random()*1000));
        jsFunction.id = id;

        Object.defineProperty(wingified, 'id', { value: id });
        Object.defineProperty(wingified, 'name', { value: options.name });
        Object.defineProperty(wingified, 'type', { value: 'function' });
        Object.defineProperty(wingified, 'run', { 
            value: function(params) { 
                jsFunction.call(jsFunction, JSFly.globals, params);
            } 
        });
    } catch (e) {
        throw e; //exceptions.throwNew('new function');
    }

    return wingified;
}

/** 
 * @param
 * @returns
 */
function newModule(options, code) {
    return {
        run: function () {}
    };
}

/** 
 * @param
 * @returns
 */
function functionBody(stringFunction) {
    var from = stringFunction.indexOf("{") + 1, 
        to = stringFunction.lastIndexOf("}") - 1;
    return stringFunction.slice(from, to).trim();
}
/*----------------------------------------------------------------------------*/
})(module.parent.JSFly);
