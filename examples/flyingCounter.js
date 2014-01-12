var jsfly = require('../jsfly');

var flyingCounter = jsfly.wingify(function myNameIs(jsfly, params) {
    // Restore the count if the code is landing from another server
    var count = (params) ? params.count || 0 : 0;
    
    setInterval(function () {
        console.log(++count);
    }, 500);
    setTimeout(function () {
        if (params.servers.length > 0) {
            jsfly.fly({
                port: params.servers.pop(),
                // The current count must be sent as a parameter
                params: {
                    count: count,
                    servers: params.servers
                }
            });
        }
    }, 1501);
});

flyingCounter.fly({
    port: 1500,
    params: {
        count: 0,
        servers: [8500, 4500, 6500, 7500, 2500, 9500, 3500, 5500]
    }
});