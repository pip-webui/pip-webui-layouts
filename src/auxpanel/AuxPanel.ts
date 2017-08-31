import { MainBreakpoints } from '../media/MediaService';
import { IAuxPanelService } from './IAuxPanelService';

{
    class AuxPanelDirectiveController {
        private normalSize: number = 320;
        private largeSize: number = 480;
        private _debounceBodySize: Function;
        private gtxs: boolean;
        private gtlg: boolean;

        public constructor(private pipAuxPanel: IAuxPanelService) {
            "ngInject";

            this._debounceBodySize = _.debounce(() => {
                let bodySize: number = Number($('body').width());
                this.gtxs = bodySize > MainBreakpoints.xs && this.pipAuxPanel.isOpen();
                this.gtlg = bodySize > (MainBreakpoints.lg + this.largeSize);
            }, 50);

            this._debounceBodySize();
        }

        public isGtxs(): boolean {
            this._debounceBodySize();
            return this.gtxs;
        }

        public isGtlg(): boolean {
            this._debounceBodySize();
            return this.gtlg;
        }
    }

    const AuxPanel: ng.IComponentOptions = {

        controller: AuxPanelDirectiveController,
        transclude: true,
        template: '<md-sidenav class="md-sidenav-right md-whiteframe-z2 pip-auxpanel color-content-bg" ng-class="{\'pip-large\': $ctrl.isGtlg()}"' +
        'md-component-id="pip-auxpanel" md-is-locked-open="$ctrl.isGtxs()" ng-transclude><div pip-focused></div>' +
        '</md-sidenav>'
    }

    angular
        .module('pipAuxPanel')
        .component('pipAuxPanel', AuxPanel);

}