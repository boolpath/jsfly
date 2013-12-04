/* NODE MODULES */

/** LOCAL OBJECT 
 * @property {} - 
 */
var EXCEPTIONS = {
    'default': ['Default', 'Unhandled exception.'],
    'no options': ['No options', 'Parameter "options" in jsfly.wingify(options) must be an object.'],
    'wrong type': ['Wrong type', 'The "options.type" provided to jsfly.wingify(options) is invalid.'],
    'no code': ['No code', 'jsfly.wingify() was called without supplying a function.'],
    'no function': ['No function', 'Parameter "code" in jsfly.wingify(code) must be a function.'],
    'nostring function': ['No string code', 'The name/tag/options.name parameters supplied to jsfly.wingify(function) must be a string.'],
    'unnamed function': ['Unnamed code', 'The function supplied to jsfly.wingify(function) must be a named function or have a tag attribute.'],

    // 'wrong host': ['Wrong host', 'The "host" provided to jsfly.createServer(host, ...) is invalid.'],
    'wrong port': ['Wrong port', 'The "port" provided to jsfly.createServer(port) is invalid.'],
    'wrong onReady': ['Wrong callback', 'Parameter "onReady" provided to jsfly.createServer(..., onReady) must be a function.']

    //'new function': ['New Function', 'jsfly.wingify() must be an object.']
};

/** MODULE INTERFACE
 *@method {function} - 
 */
module.exports.throwNew = function returnExceptionObject(exceptionName) {
    var exception = EXCEPTIONS[exceptionName] || EXCEPTIONS['default'];
    
    return { 
        name:  exception[0],
        message: exception[1]
    }
};
