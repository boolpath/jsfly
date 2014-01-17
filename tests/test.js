var jsfly = require('../jsfly'),
    assert = require('assert');

describe('jsfly-api', function () {
    before(function (){
        
    })
    describe('#wingify()', function () {
        it('should return undefined', function () {
            var noSuppliedCode = jsfly.wingify();
            assert.equal(noSuppliedCode.canFly, false);
        });
    });
    describe('#wingify(string)', function () {
        it('should return undefined', function () {
            // Only functions can be wingified, not strings
            var noSuppliedCode = jsfly.wingify('function () {}');
            assert.equal(noSuppliedCode.canFly, false);
        });
    });
    describe('#wingify(anonymousFunction)', function () {
        it('should return undefined', function () {
            // Only named functions can be wingified
            console.log('anonymousFunction');
            var unnamedCode = jsfly.wingify(function () {});
            assert.equal(unnamedCode.canFly, false);
        });
    });
    describe('#wingify(namedFunction)', function () {
        it('should return an object with a #run() method', function () {
            var namedCode = jsfly.wingify(function myNameIs() {});
            assert.equal(typeof namedCode, 'object');
            assert.equal(typeof namedCode.run, 'function');
        });
    });
    describe('#wingify(stringTaggedFunction)', function () {
        it('should return an object with a #run() method', function () {
            // Anonymous functions can be wingified if a 'tag' attribute is provided
            var tagged = function () {};
            tagged.tag = 'myNameIs2';
            var taggedCode = jsfly.wingify(tagged);
            assert.equal(typeof taggedCode, 'object');
            assert.equal(typeof taggedCode.run, 'function');
        });
    });
    describe('#wingify(noStringTaggedFunction)', function () {
        it('should return an object with a #run() method', function () {
            // Anonymous functions can be tagged only with string names
            var tagged = function () {};
            tagged.tag = 1; // tags must be strings!
            var taggedCode = jsfly.wingify(tagged);
            assert.equal(taggedCode.canFly, false);
        });
    });
    describe('#wingify(optionsNamedFunction)', function () {
        it('should return an object with a #run() method', function () {
            // Anonymous functions can be passed with an options.name parameter
            var options = {
                name: 'myNameIs3'
            };
            var unnamedCode = jsfly.wingify(options, function () {});
            assert.equal(typeof unnamedCode, 'object');
            assert.equal(typeof unnamedCode.run, 'function');
        });
    });
});