'use strict';

// Avoid default export
(() => {

function simpleDirective() {
    return {
        restrict: 'EA',
        link: ($scope, $element, $attrs) => {
            $element.addClass('pip-simple');
        }
    };
}

angular
    .module('pipLayout')
    .directive('pipSimple', simpleDirective);

})();