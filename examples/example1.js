var jsfly = require('../jsfly');

// Provide a named function 'myNameIs' 
// The parameter 'jsfly' will be provided when calling the function
// to allow it to autonomously request to fly and crash
jsfly.wingify(function myNameIs(jsfly) {
    var st1, it1;
    
    // Start printing 'Hello JSFly' every 1 second
    it1 = setInterval(function () {
        console.log('Hello JSFly');
    }, 1000);

    // After 3.1 seconds clear the interval and request to be crashed
    st1 = setTimeout(function () {
        console.log('Good bye JSFly');
        clearInterval(it1);
        jsfly.crash();
    }, 3100);
}).run();

/* OUTPUT:
Hello JSFly
Hello JSFly
Hello JSFly
Good bye JSFly
myNameIs wants to fly
*/