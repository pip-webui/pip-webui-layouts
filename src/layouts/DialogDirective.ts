'use strict';

// Avoid default export
(() => {

function dialogDirective(): ng.IDirective {
    return {
        restrict: 'EA',
        link: ($scope: ng.IScope, $element: JQuery, $attrs: ng.IAttributes) => {
            $element.addClass('pip-dialog');
        }
    };
}

angular
    .module('pipLayout')
    .directive('pipDialog', dialogDirective);

})();