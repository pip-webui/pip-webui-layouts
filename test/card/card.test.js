'use strict';

suite('pipCard', function () {

    suite('directive', function () {
        var $compile,
            $rootScope,
            scope,
            element,
            template = '<pip-card></pip-card>';

        setup(module('pipLayout.Card'));

        setup(inject(function(_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        }));

        setup(function () {
            scope = $rootScope.$new();
            element = $compile(template)(scope);
            scope.$digest();
        });

        test('should add class to element', function (done) {

            assert.isTrue(element.hasClass('pip-card'));

            done();
        });


    });

});

