import { addResizeListener, removeResizeListener } from '../media/ResizeFunctions';
import { MainResizedEvent } from '../media/IMediaService'; 
import { MainBreakpoints, MainBreakpointStatuses } from '../media/MediaService'; 

// Avoid default export
(() => {

interface IMainDirectiveAttributes extends ng.IAttributes {
    pipContainer: string;
}

class MainDirectiveController implements ng.IController {
    private _container: any;

    public constructor(
        private $scope: ng.IScope, 
        private $element: angular.IRootElementService, 
        private $rootScope: ng.IRootScopeService,
        private $timeout: ng.ITimeoutService,
        private $attrs: IMainDirectiveAttributes
    ) {
        this._container = $attrs.pipContainer ? $($attrs.pipContainer) : $element;

        // Add CSS class
        $element.addClass('pip-main');

        // Add resize listener
        const listener = () => { this.resize(); };
        addResizeListener(this._container[0], listener);

        // Unbind when scope is removed
        $scope.$on('$destroy', () => {
            removeResizeListener(this._container[0], listener);
        });

        // Perform initial calculations
        this.updateBreakpointStatuses();
    }

    private updateBreakpointStatuses() {
        const width = this._container.innerWidth();
        const body = $('body');

        MainBreakpointStatuses.update(MainBreakpoints, width);

        $.each(MainBreakpointStatuses, (breakpoint, status) => {
            if (_.isBoolean(status)) {
                body[status ? 'addClass': 'removeClass']('pip-' + breakpoint);
            }
        });

        this.$timeout(() => {
            this.$rootScope.$apply();
        });
    }
    
    private resize() {
        this.updateBreakpointStatuses();
        this.$rootScope.$emit(MainResizedEvent, MainBreakpointStatuses);
    }
}

class MainBodyDirectiveLink {
    public constructor(
        $scope: ng.IScope, 
        $element: angular.IRootElementService
    ) {
        // Add CSS class
        $element.addClass('pip-main-body');
    }
}

function mainDirective(): ng.IDirective {
    return {
        restrict: 'EA',
        controller: MainDirectiveController,
        controllerAs: 'vm' 
    }
}

function mainBodyDirective(): ng.IDirective {
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