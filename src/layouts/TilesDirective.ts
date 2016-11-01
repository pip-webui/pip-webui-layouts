'use strict';

<<<<<<< HEAD
=======
export const __ = null;

import { addResizeListener, removeResizeListener } from '../media/ResizeFunctions';
>>>>>>> 783f58fcb6edb1cf369c2fd92263751f62d0e9ae
import { MainResizedEvent, LayoutResizedEvent, MainBreakpoints, MainBreakpointStatuses } from '../media/MediaService';

declare var Masonry: any;

class TilesDirectiveLink {
    private _element: any;
    private _attrs: any;
    private _rootScope: ng.IRootScopeService;
    private _columnWidth: number;
    private _container: any;
    private _prevContainerWidth: number;
    private _masonry: any;
    private _sizer: any;

    public constructor($scope: ng.IScope, $element: any, $rootScope: ng.IRootScopeService, $attrs: any) {
        this._element = $element;
        this._rootScope = $rootScope;
        this._attrs = $attrs;

        this._columnWidth = $attrs.columnWidth ? Math.floor($attrs.columnWidth) : 440,
        this._container = $element.children('.pip-tiles-container'),
        this._prevContainerWidth = null,
        this._masonry = Masonry.data(this._container[0]);
        
        // Add class to the element
        $element.addClass('pip-tiles');

        // Add resize listener
        let listener = () => { this.resize(false); };
        addResizeListener($element[0], listener);

        // Unbind when scope is removed
        $scope.$on('$destroy', () => {
            removeResizeListener($element[0], listener);
        });

        // Insert sizer
        this._sizer = $('<div class="pip-tile-sizer"></div>');
        this._sizer.appendTo(this._container);

        // Resize every time window is resized
        $rootScope.$on(MainResizedEvent, () => { this.resize(false); });

        // Resize the element right away
        this.resize(true);
    }

    private resize(force: boolean) {
        let width = this._element.parent().width();
        let containerWidth;
        
        console.log();

        if (MainBreakpointStatuses['gt-xs'] && (width - 36) > this._columnWidth) {
            width = width - 24 * 2;

            let columns = Math.floor(width / this._columnWidth);
            containerWidth = (this._columnWidth + 16) * columns - 16;

            if (containerWidth > width) {
                columns--;
                containerWidth = (this._columnWidth + 16) * columns - 16;
            }

            if (columns < 1) {
                containerWidth = width;
                this._sizer.css('width', containerWidth + 'px');
            } else {
                this._sizer.css('width', this._columnWidth + 'px');
            }

            // +10 to avoid precision related error
            this._container.css('width', (containerWidth + 10) + 'px');
            this._container.removeClass('pip-mobile');
        } else {
            width = width - 16 * 2;
            containerWidth = width;

            this._sizer.css('width', containerWidth + 'px');
            // +10 to avoid precision related error
            this._container.css('width', (containerWidth + 10) + 'px');
            this._container.addClass('pip-mobile');
        }

        // Manually call layout on tile container
        if (this._prevContainerWidth != containerWidth || force) {
            this._prevContainerWidth = containerWidth;
            this._masonry.layout();

            // Notify child controls that layout was resized
            this._rootScope.$emit(LayoutResizedEvent);
        }
    }
}

function tilesDirective($rootScope: ng.IRootScopeService) {
    "ngInject";

    // Converts value into boolean
    function convertToBoolean(value) {
        if (value == null) return false;
        if (!value) return false;
        value = value.toString().toLowerCase();
        return value == '1' || value == 'true';
    }

    return {
        restrict: 'EA',
        scope: false,
        transclude: true,
        template:
            ($element: any, $attrs: any) => {
                if (convertToBoolean($attrs.pipInfinite)) {
                    return String()
                    + '<div masonry class="pip-tiles-container" load-images="false" preserve-order  '
                    + ' ng-transclude column-width=".pip-tile-sizer" item-selector=".pip-tile"'
                    + ' masonry-options="tilesOptions"  pip-scroll-container="\'.pip-tiles\'"'
                    + ' pip-infinite-scroll="readScroll()" >'
                    + '</div>';
                } else {
                    return String()
                        + '<div masonry class="pip-tiles-container" load-images="false" preserve-order  '
                        + ' ng-transclude column-width=".pip-tile-sizer" item-selector=".pip-tile"'
                        + ' masonry-options="tilesOptions">'
                        + '</div>';
                }
            },
        controller: ($scope: any) => {
            $scope.tilesOptions = {
                gutter: 8,//16
                isFitWidth: false,
                isResizeBound: false,
                transitionDuration: 0 // '0.2s'
            };
        },
        link: ($scope, $element, $attrs) => {
            new TilesDirectiveLink($scope, $element, $rootScope, $attrs);
        } 
    };
}

angular
    .module('pipLayout')
    .directive('pipTiles', tilesDirective);
