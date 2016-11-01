'use strict';

export const __ = null;

function documentDirective() {
    return {
        restrict: 'EA',
        link: ($scope, $element, $attrs) => {
            $element.addClass('pip-document');
        }
    };
}

angular
    .module('pipLayout')
    .directive('pipDocument', documentDirective);
