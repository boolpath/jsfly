var jsfly = require('./jsfly'),
    assert = require('assert');

describe('jsfly-api', function () {
    before(function (){
        
    })
    describe('#wingify()', function () {
        it('should return undefined', function () {
            var noSuppliedCode = jsfly.wingify();
            assert.equal(typeof noSuppliedCode, 'undefined');
        });
    });
    describe('#wingify(unnamedFunction)', function () {
        it('should return an object with a #run() method', function () {
            var unnamedCode = jsfly.wingify(function () {});
            assert.equal(typeof unnameCode, 'undefined');
        });
    });
    describe('#wingify(namedFunction)', function () {
        it('should return an object with a #run() method', function () {
            var namedCode = jsfly.wingify(function myNameIs() {});
            assert.equal(typeof namedCode, 'object');
            assert.equal(typeof namedCode.run, 'function');
        });
    });
    describe('#wingify(taggedFunction)', function () {
        it('should return an object with a #run() method', function () {
            var tagged = function () {};
            tagged.tag = 'myNameIs';
            var taggedCode = jsfly.wingify(tagged);
            assert.equal(typeof taggedCode, 'object');
            assert.equal(typeof taggedCode.run, 'function');
        });
    });
});