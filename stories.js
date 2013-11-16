// USER STORIES

// A. PROGRAMMER'S POINT OF VIEW: MIGRATABLE CODE

// 1. 
// In order to     create a piece of migratable code
// as a            programmer
// I want to       supply the code to be configured as migratable

    var migratableCode = jsfly.code(someCode);
    
    migratableCode.run();   // It can be executed
    migratableCode.fly();   // It can be migrated to another server
    migratableCode.crash(); // It can be killed

// 2. 
// In order to     run a program as autonomous code
// as a            programmer           
// I want to       supply the code to be run autonomously

    var autonomousCode = jsfly.run(someCode);


// B. CODE'S POINT OF VIEW: AUTONOMOUS CODE

// 1.
// In order to     be migrated
// as an           autonomous piece of code
// I want to       to ask to be migrated

    var autonomousCode = jsfly.run(function(jsfly) {
        // Request a runway for takeoff with the destination info
        jsfly.runway(targetAirportInfo, function(authorized, authKey) {
            if(authorized) { 
                jsfly.fly(authKey);    // Request migration
            }
        });
    });

// 2.
// In order to     be migrated
// as an           autonomous piece of code
// I want to       to ask to be migrated

    var autonomousCode = jsfly.run(function(jsfly) {
        // Stop running the code when it reaches its life expectancy
        setTimeout(function() {
            jsfly.crash();    // Stop running
        }, lifeSpan);
    });


// C. MODULE'S POINT OF VIEW: MANAGEABLE CODE

// 1.
// In order to     stop running code and send it to another airport
// as an           airport
// I want to       authorize a piece of code to takeoff

    jsfly.takeOff(migratableCode);

// 2.
// In order to     start running code received from another airport
// as an           airport
// I want to       authorize a piece of code to land

    var landedCode = jsfly.land(migratedCode);
