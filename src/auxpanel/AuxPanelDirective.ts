'use strict';

import { MainBreakpoints } from '../media/MediaService';
import { IAuxPanelService } from './AuxPanelService';

(() => {

class AuxPanelDirectiveController {
    private _pipAuxPanel: IAuxPanelService;
    private normalSize: number = 320;
    private largeSize: number = 480;

    public constructor(pipAuxPanel: IAuxPanelService) {
        this._pipAuxPanel = pipAuxPanel;
    }

    public isGtxs():boolean {
        return Number($('body').width()) > MainBreakpoints.xs && this._pipAuxPanel.isOpen();
    }

    public isGtlg():boolean {
        return Number($('body').width()) > (MainBreakpoints.lg + (this.largeSize - this.normalSize + 20));
    }
}

function AuxPanelDirective() {
    return {
        restrict: 'E',
        replace: true,
        controller: AuxPanelDirectiveController,
        transclude: true,
        controllerAs: 'vm',
        template: '<md-sidenav class="md-sidenav-right md-whiteframe-z2 pip-auxpanel color-content-bg" ng-class="{\'pip-large\': vm.isGtlg()}"' + 
                    'md-component-id="pip-auxpanel" md-is-locked-open="vm.isGtxs()" pip-focused ng-transclude>' + 
                    '</md-sidenav>'
    }
}

angular
    .module('pipAuxPanel')
    .directive('pipAuxPanel', AuxPanelDirective);

})();