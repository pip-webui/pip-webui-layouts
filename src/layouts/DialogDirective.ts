'use strict';

export const __ = null;

function dialogDirective() {
    return {
        restrict: 'EA',
        link: ($scope, $element, $attrs) => {
            $element.addClass('pip-dialog');
        }
    };
}

angular
    .module('pipLayout')
    .directive('pipDialog', dialogDirective);
