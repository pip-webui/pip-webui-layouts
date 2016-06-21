'use strict';

describe('pipSplit', function () {

    describe('service', function () {
        var $rootScope,
            provider,
            service;

        beforeEach(module('pipLayout.Split', function (pipSplitProvider) {
            provider = pipSplitProvider;
        }));

        beforeEach(inject(function(_$rootScope_, pipSplit) {
            $rootScope = _$rootScope_;
            service = pipSplit;
        }));

        it('exception', function (done) {
            assert.throws(function() { provider.addTransitionSequence({}) }, /Transition sequence must be an array of state names/);
            assert.throws(function() { provider.addTransitionSequence([]) }, /Transition sequence must be an array of state names/);
            assert.doesNotThrow(function() { provider.addTransitionSequence(['state1', 'state2']) }, /Transition sequence must be an array of state names/);

            done();
        });

        it('forward transaction', function (done) {
            provider.addTransitionSequence(['state1', 'state2']);
            assert.isTrue(service.forwardTransition({name: 'state2'}, {name: 'state1'}));
            assert.isFalse(service.forwardTransition({name: 'state1'}, {name: 'state2'}));

            done();
        });


    });

});

