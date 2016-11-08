'use strict';

import { MainBreakpoints } from '../media/MediaService';

class AuxiliaryService {
    private popoverTemplate: string;
    private _$rootScope: ng.IRootScopeService;
    private _$compile: ng.ICompileService;
    private _$mdSidenav: angular.material.ISidenavService;
    private opened: boolean;
    private element: any;

    public constructor(
        $rootScope: ng.IRootScopeService,
        $compile: ng.ICompileService,
        $mdSidenav: angular.material.ISidenavService
    ) {
        this._$rootScope = $rootScope;
        this._$compile = $compile;
        this._$mdSidenav = $mdSidenav;
        this.opened = false;

        this.popoverTemplate = "<div ng-controller='params.controller' class='for-scope'>" +
                                    "<div ng-if='params.templateUrl' class='flex layout-column' ng-include='params.templateUrl'></div>"
                                "</div>";
    }

    public show(p: any) {
        if (this.opened) return;

        let scope, params, content;

        this.element = $('md-sidenav.pip-aux-panel');
        scope = this._$rootScope.$new();
        params = p && _.isObject(p) ? p : {};
        scope.params = params;
        scope.locals = params.locals;
        content = this._$compile(this.popoverTemplate)(scope);
        this.element.append(content);
        scope = _.defaultsDeep(scope, this.element.find('.for-scope').scope());

        if (params.template) {
            $(this.element.children()[1]).append(this._$compile(params.template)(scope));
        }
        
        try {
            this._$mdSidenav('pip-aux-panel', true).then((instance: any) => {
                instance.open();
                this.opened = true;
            });
        } catch(e) {
            this._$mdSidenav('pip-aux-panel').open();
            this.opened = true;
        }
    }

    public hide() {
        $(this.element.children()[1]).remove();
        this.opened = false;
        this._$mdSidenav('pip-aux-panel').close();
    }

    public isOpen():boolean {
        return this.opened;
    }
}

class AuxiliaryPanelController {
    private _pipAuxPanel: AuxiliaryService;

    public constructor(pipAuxPanel: AuxiliaryService) {
        this._pipAuxPanel = pipAuxPanel;
    }

    public isGtxs():boolean {
        return Number($('body').width()) > MainBreakpoints.xs && this._pipAuxPanel.isOpen();
    }

    public onCloseClick() {
        this._pipAuxPanel.hide();
    }
}

function auxiliaryPanelDirective() {
    return {
        restrict: 'E',
        replace: true,
        controller: AuxiliaryPanelController,
        controllerAs: 'vm',
        template: '<md-sidenav class="md-sidenav-right md-whiteframe-z2 pip-aux-panel color-content-bg"' + 
                    'md-component-id="pip-aux-panel" md-is-locked-open="vm.isGtxs()" pip-focused>' + 
                    '<div class="close-button" ng-click="vm.onCloseClick()" ><md-icon md-svg-icon="icons:cross"></md-icon></div></md-sidenav>'
    }
}

angular
    .module('pipLayout')
    .directive('pipAuxPanel', auxiliaryPanelDirective)
    .service('pipAuxPanel', AuxiliaryService);
