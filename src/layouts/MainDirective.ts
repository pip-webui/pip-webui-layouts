'use strict';

import { addResizeListener, removeResizeListener } from '../media/ResizeFunctions';
import { MainBreakpoints, MainBreakpointStatuses, MainResizedEvent } from '../media/MediaService'; 

// Avoid default export
(() => {

class MainDirectiveController {
    private _element: any;
    private _rootScope: ng.IRootScopeService;
    private _timeout: ng.ITimeoutService;
    private _container: any;

    public constructor(
        $scope: ng.IScope, 
        $element: any, 
        $rootScope: ng.IRootScopeService,
        $timeout: ng.ITimeoutService,
        $attrs: any
    ) {
        this._element = $element;        
        this._rootScope = $rootScope;
        this._timeout = $timeout;
        this._container = $attrs.pipContainer ? $($attrs.pipContainer) : $element;

        // Add CSS class
        $element.addClass('pip-main');

        // Add resize listener
        let listener = () => { this.resize(); };
        addResizeListener(this._container[0], listener);

        // Unbind when scope is removed
        $scope.$on('$destroy', () => {
            removeResizeListener(this._container[0], listener);
        });

        // Perform initial calculations
        this.updateBreakpointStatuses();
    }

    private updateBreakpointStatuses() {
        let width = this._container.innerWidth();
        let body = $('body');

        MainBreakpointStatuses.update(MainBreakpoints, width);

        $.each(MainBreakpointStatuses, (breakpoint, status) => {
            if (_.isBoolean(status))
                body[status ? 'addClass': 'removeClass']('pip-' + breakpoint);
        });

        this._timeout(() => {
            this._rootScope.$apply();
        });
    }
    
    private resize() {
        this.updateBreakpointStatuses();
        this._rootScope.$emit(MainResizedEvent, MainBreakpointStatuses);
    }
}

class MainBodyDirectiveLink {
    public constructor(
        $scope: ng.IScope, 
        $element: any
    ) {
        // Add CSS class
        $element.addClass('pip-main-body');
    }
}

function mainDirective() {
    return {
        restrict: 'EA',
        controller: MainDirectiveController,
        controllerAs: 'vm' 
    }
}

function mainBodyDirective() {
    return {
        restrict: 'EA',
        link: MainBodyDirectiveLink
    }
}

angular
    .module('pipLayout')
    .directive('pipMain', mainDirective)
    .directive('pipMainBody', mainBodyDirective);

})();