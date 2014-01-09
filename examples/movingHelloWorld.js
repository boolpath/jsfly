var jsfly = require('../jsfly');

jsfly.wingify(function myNameIs(jsfly, params) {
    // Hello world!
    setInterval(function () {
        console.log('Hello world!');
    }, 1000);
    // After 3.1 seconds, fly to another server
    setTimeout(function () {
        jsfly.fly({
            port: params.targetPort,
            params: params
        });
    }, 3100);
}).run({ targetPort: 3600 });