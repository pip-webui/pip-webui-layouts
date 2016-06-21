'use strict';

describe('pipCard', function () {

    describe('directive', function () {
        var $compile,
            $rootScope,
            scope,
            element,
            template = '<pip-card></pip-card>';

        beforeEach(module('pipLayout.Card'));

        beforeEach(inject(function(_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        }));

        beforeEach(function () {
            scope = $rootScope.$new();
            element = $compile(template)(scope);
            scope.$digest();
        });

        it('should add class to element', function (done) {

            assert.isTrue(element.hasClass('pip-card'));

            done();
        });


    });

});

