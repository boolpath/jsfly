/* NODE MODULES */

/** LOCAL OBJECT 
 * @property {} - 
 */
var EXCEPTIONS = {
    'default': ['Default', 'Unhandled exception.'],
    'no code': ['No code', 'jsfly.wingify() was called without supplying a function.'],
    'no function': ['No function', 'Parameter "code" in jsfly.wingify(code) must be a function.'],
    'unnamed function': ['Unnamed code', 'The function supplied to jsfly.wingify(function) must be a named function or have a tag attribute.'],
    'unnamed function': ['Unnamed code', 'The function supplied to jsfly.wingify(function) must be a named function or have a tag attribute.']
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
