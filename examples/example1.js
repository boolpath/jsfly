// MIGRATABLE CODE
// With JSFly, you can configure any JavaScript function to be migratable
var jsfly = require('../jsfly');

// First, define the function you want to configure as migratable code
function helloWorld() {
    console.log('Hello world!');
}

// Then, call JSFly's wingify method and pass the function defined above
var migratableHelloWorld = jsfly.wingify(helloWorld);

// Finally, call the run() method to execute the migratable function
migratableHelloWorld.run();


/*OUTPUT:
Hello world!
*/
