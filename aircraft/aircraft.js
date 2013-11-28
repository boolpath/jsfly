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

/** 
 * @param
 * @returns
 */
function newFunction(options, code) {
    var stringFunction = JSFly.airspace.preprocess(code),
        jsFunction,
        wingified = {};
    
    try {
        var id = options.name + '_' + (new Date()).getTime() + (Math.floor(Math.random()*1000));
        jsFunction = new Function('jsfly', 'params', functionBody(stringFunction));
        Object.defineProperty(jsFunction, 'id', { value: id });

        Object.defineProperty(wingified, 'id', { value: id });
        Object.defineProperty(wingified, 'name', { value: options.name });
        Object.defineProperty(wingified, 'type', { value: 'function' });
        Object.defineProperty(wingified, 'source', { value: stringFunction });

        Object.defineProperty(wingified, 'run', { 
            value: function(params) { 
                jsFunction.call(jsFunction, JSFly.globals, params);
                return wingified;
            } 
        });

        var fly = JSFly.globals.fly;
        Object.defineProperty(wingified, 'fly', { 
            value: function () {
                fly(id);
            }
        });
        var crash = JSFly.globals.crash;
        Object.defineProperty(wingified, 'crash', { 
            value: function () {
                crash(id);
            }
        });

    } catch (e) {
        console.log(e); //exceptions.throwNew('new function');
    }

    return wingified;
}

/** 
 * @param
 * @returns
 */
function newModule(options, code) {
    var stringModule = JSFly.airspace.preprocess(code),
        jsModule, jsReturn, jsFunction,
        wingified = {};

    try {
        var id = options.name + '_' + (new Date()).getTime() + (Math.floor(Math.random()*1000));
        jsModule = new Function('jsfly', 'params', functionBody(stringModule));
        Object.defineProperty(jsModule, 'id', { value: id });
        
        jsReturn = jsModule.call(null, JSFly.globals, options.inits);
        if (typeof jsReturn === 'object' && typeof jsReturn.run === 'function') {
            jsFunction = jsReturn.run;
        } else if (typeof jsReturn === 'function') {
            jsFunction = jsReturn;
        }
        Object.defineProperty(jsFunction, 'id', { value: id });

        Object.defineProperty(wingified, 'id', { value: id });
        Object.defineProperty(wingified, 'name', { value: options.name });
        Object.defineProperty(wingified, 'type', { value: 'module' });
        Object.defineProperty(wingified, 'source', { value: stringModule });
        
        Object.defineProperty(wingified, 'run', { 
            value: function (params) { 
                jsFunction.call(jsReturn, JSFly.globals, params);
                return wingified;
            } 
        });

        var fly = JSFly.globals.fly;
        Object.defineProperty(wingified, 'fly', { 
            value: function () {
                fly(id);
            }
        });
        var crash = JSFly.globals.crash;
        Object.defineProperty(wingified, 'crash', { 
            value: function () {
                crash(id);
            }
        });

    } catch (e) {
        console.log(e); //exceptions.throwNew('new function');
    }

    return wingified;
}

/*----------------------------------------------------------------------------*/

/** 
 * @param
 * @returns
 */
function functionBody(stringFunction) {
    var from = stringFunction.indexOf('{') + 1, 
        to = stringFunction.lastIndexOf('}') - 1;
    return stringFunction.slice(from, to).trim();
}
/*----------------------------------------------------------------------------*/
})(module.parent.JSFly);
