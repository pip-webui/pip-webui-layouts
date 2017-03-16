'use strict';

import { MainBreakpoints } from '../media/MediaService';
import { IAuxPanelService } from './AuxPanelService';

(() => {

    class AuxPanelDirectiveController {
        private normalSize: number = 320;
        private largeSize: number = 480;

        public constructor(private pipAuxPanel: IAuxPanelService) { }

        public isGtxs(): boolean {
            return Number($('body').width()) > MainBreakpoints.xs && this.pipAuxPanel.isOpen();
        }

        public isGtlg(): boolean {
            return Number($('body').width()) > (MainBreakpoints.lg + this.largeSize);
        }
    }

    const AuxPanel: ng.IComponentOptions = {

        controller: AuxPanelDirectiveController,
        transclude: true,
        template: '<md-sidenav class="md-sidenav-right md-whiteframe-z2 pip-auxpanel color-content-bg" ng-class="{\'pip-large\': $ctrl.isGtlg()}"' +
        'md-component-id="pip-auxpanel" md-is-locked-open="$ctrl.isGtxs()" pip-focused ng-transclude>' +
        '</md-sidenav>'
    }

    angular
        .module('pipAuxPanel')
        .component('pipAuxPanel', AuxPanel);

})();