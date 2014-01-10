var jsfly = require('../jsfly');

jsfly.wingify(function myNameIs(jsfly, params) {
    setInterval(function () {
        console.log('Hello world!');
    }, 500);
    setTimeout(function () {
        if (params.servers.length > 0) {
            jsfly.fly({
                port: params.servers.pop(),
                params: { 
                    servers: params.servers
                }
            });
        }
    }, 1600);
}).run({
    servers: [8500, 4500, 6500, 7500, 2500, 9500, 3500, 5500, 1500]
});