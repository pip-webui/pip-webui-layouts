'use strict';

// Prevent junk from going into typescript definitions
(() => {

function AuxPanelPartDirectiveController($scope, $element, $attrs, $rootScope, pipAuxPanel) {
    "ngInject";

    var partName = '' + $attrs.pipAuxPanelPart;
    var partValue = null;

    // Break part apart
    var pos = partName.indexOf(':');
    if (pos > 0) {
        partValue = partName.substr(pos + 1);
        partName = partName.substr(0, pos);
    }

    onAuxPanelChanged(null, pipAuxPanel.config)
    $rootScope.$on('pipAuxPanelChanged', onAuxPanelChanged);

    function onAuxPanelChanged(event, config) {
        var parts = config.parts || {};
        var currentPartValue = config[partName];
        // Set visible variable to switch ngIf

        $scope.visible = partValue ? currentPartValue == partValue : currentPartValue;
    }

}

function AuxPanelPartDirective(ngIfDirective) {
    "ngInject";

    var ngIf = ngIfDirective[0];

    return {
        transclude: ngIf.transclude,
        priority: ngIf.priority,
        terminal: ngIf.terminal,
        restrict: ngIf.restrict,
        scope: true,
        link: function($scope: any, $element, $attrs) {
            // Visualize based on visible variable in scope
            $attrs.ngIf = function() { return $scope.visible };
            ngIf.link.apply(ngIf);
        },
        controller: AuxPanelPartDirectiveController
    };
}

angular
    .module('pipAuxPanel')
    .directive('pipAuxPanelPart', AuxPanelPartDirective);

})();