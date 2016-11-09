'use strict';

import { MainBreakpoints } from '../media/MediaService';
import { IAuxPanelService } from './AuxPanelService';

(() => {

class AuxPanelDirectiveController {
    private _pipAuxPanel: IAuxPanelService;

    public constructor(pipAuxPanel: IAuxPanelService) {
        this._pipAuxPanel = pipAuxPanel;
    }

    public isGtxs():boolean {
        return Number($('body').width()) > MainBreakpoints.xs && this._pipAuxPanel.isOpen();
    }

    public onCloseClick() {
        this._pipAuxPanel.close();
    }
}

function AuxPanelDirective() {
    return {
        restrict: 'E',
        replace: true,
        controller: AuxPanelDirectiveController,
        controllerAs: 'vm',
        template: '<md-sidenav class="md-sidenav-right md-whiteframe-z2 pip-aux-panel color-content-bg"' + 
                    'md-component-id="pip-aux-panel" md-is-locked-open="vm.isGtxs()" pip-focused>' + 
                    '</md-sidenav>'
    }
}

angular
    .module('pipAuxPanel')
    .directive('pipAuxPanel', AuxPanelDirective);

})();