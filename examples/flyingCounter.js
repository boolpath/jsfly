var jsfly = require('../jsfly');

var flyingCounter = jsfly.wingify(function flyingCounter(jsfly, params) {
    /* Initialization stage */
    // Restore the count value sent from the previous server if applicable
    var count = (params) ? params.count || 0 : 0;
    
    setInterval(function () {
        console.log(++count);
    }, 500);
    setTimeout(function () {
        // Validate if there are more servers to visit
        if (params.servers.length > 0) {
            jsfly.fly({
                port: params.servers.pop(),
                // The current count must be sent as a parameter so that the counter is
                // initialized when the code lands and starts running on another server
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