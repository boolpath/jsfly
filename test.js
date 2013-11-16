var jsfly = require('./jsfly'),
    assert = require('assert');

describe('jsfly-api', function () {
    before(function (){
        
    })
    describe('#code()', function () {
        it('should return an object with a #run() method', function () {
            var migratableCode = jsfly.wingify();
            assert.equal(typeof migratableCode, 'object');
            assert.equal(typeof migratableCode.run, 'function');
        });
    });
});