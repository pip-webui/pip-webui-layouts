import { MainBreakpoints } from '../media/MediaService';
import { IAuxPanelService } from './IAuxPanelService';

{
    class AuxPanelDirectiveController {
        private normalSize: number = 320;
        private largeSize: number = 480;
        private _debounceBodySize: Function;
        private gtxs: boolean = null;
        private gtlg: boolean = null;

        public constructor(private pipAuxPanel: IAuxPanelService) {
            "ngInject";

            this._debounceBodySize = _.debounce(() => {
                let bodySize: number = Number($('body').width());
                this.gtxs = bodySize > MainBreakpoints.xs && this.pipAuxPanel.isOpen();
                this.gtlg = bodySize > (MainBreakpoints.lg + this.largeSize)  && this.pipAuxPanel.isOpen();
            }, 10);

            this._debounceBodySize();
        }

        public isGtxs(): boolean {
            // if (this.gtxs != null) {
            //     this._debounceBodySize();
            //     return this.gtxs;
            // } else {
            //     let bodySize: number = Number($('body').width());
            //     this.gtxs = bodySize > MainBreakpoints.xs && this.pipAuxPanel.isOpen();

            //     return this.gtxs;
            // }
            if (!this.pipAuxPanel.isOpen()) return false;

            let bodySize: number = Number($('body').width());

            return bodySize > MainBreakpoints.xs;
        }

        public isGtlg(): boolean {
            // if (this.gtxs != null) {
            //     this._debounceBodySize();
            //     return this.gtlg;
            // } else {
            //     let bodySize: number = Number($('body').width());
            //     this.gtlg = bodySize > (MainBreakpoints.lg + this.largeSize)  && this.pipAuxPanel.isOpen();
                
            //     return this.gtlg;
            // }            
            if (!this.pipAuxPanel.isOpen()) return false;

            let bodySize: number = Number($('body').width());
            
            return bodySize > (MainBreakpoints.lg + this.largeSize);
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