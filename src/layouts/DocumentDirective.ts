// Avoid default export
(() => {

function documentDirective(): ng.IDirective {
    return {
        restrict: 'EA',
        link: ($scope: ng.IScope, $element: JQuery, $attrs: ng.IAttributes) => {
            $element.addClass('pip-document');
        }
    };
}

angular
    .module('pipLayout')
    .directive('pipDocument', documentDirective);

})();