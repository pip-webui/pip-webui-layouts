(() => {

function simpleDirective(): ng.IDirective {
    return {
        restrict: 'EA',
        link: ($scope: ng.IScope, $element: JQuery, $attrs: ng.IAttributes) => {
            $element.addClass('pip-simple');
        }
    };
}

angular
    .module('pipLayout')
    .directive('pipSimple', simpleDirective);

})();