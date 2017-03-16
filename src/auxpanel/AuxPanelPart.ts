{

    class AuxPanelPartController {
        private partName: string;
        private partValue: string;
        private pos: number;

        constructor(
            private $scope: ng.IScope,
            $element: ng.IRootElementService,
            $attrs,
            $rootScope: ng.IRootScopeService,
            pipAuxPanel) {

            this.partName = '' + $attrs.pipAuxPanelPart;
            this.pos = this.partName.indexOf(':');
            if (this.pos > 0) {
                this.partValue = this.partName.substr(this.pos + 1);
                this.partName = this.partName.substr(0, this.pos);
            }

            this.onAuxPanelChanged(null, pipAuxPanel.config)
            $rootScope.$on('pipAuxPanelChanged', (event, config) => {
                this.onAuxPanelChanged(event, config);
            });

        }

        private onAuxPanelChanged(event, config) {
            let parts = config.parts || {};
            let currentPartValue = config[this.partName];
            // Set visible variable to switch ngIf

            this.$scope['visible'] = this.partValue ? currentPartValue == this.partValue : currentPartValue;
        }
    }


    function AuxPanelPartDirective(ngIfDirective) {
        "ngInject";

        let ngIf = ngIfDirective[0];

        return {
            transclude: ngIf.transclude,
            priority: ngIf.priority,
            terminal: ngIf.terminal,
            restrict: ngIf.restrict,
            scope: true,
            link: function ($scope: ng.IScope, $element, $attrs) {
                // Visualize based on visible variable in scope
                $attrs.ngIf = () => { return $scope['visible'] };
                ngIf.link.apply(ngIf);
            },
            controller: AuxPanelPartController
        };
    }

    angular
        .module('pipAuxPanel')
        .directive('pipAuxPanelPart', AuxPanelPartDirective);

}