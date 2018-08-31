import { addResizeListener, removeResizeListener } from '../media/ResizeFunctions';
import { MainResizedEvent, LayoutResizedEvent } from '../media/IMediaService';
import { MainBreakpoints, MainBreakpointStatuses } from '../media/MediaService';

declare var Masonry: any;

interface ITilesDirectiveAttributes extends ng.IAttributes {
    columnWidth: string | number;
    pipInfinite: string | boolean | number;
}

class TilesOptions {
    gutter: number;
    isFitWidth: boolean;
    isResizeBound: boolean;
    transitionDuration: number;
}

interface ITilesControllerScope extends ng.IScope {
    tilesOptions: TilesOptions;
}

class TilesDirectiveLink {
    private _columnWidth: number;
    private _container: any;
	private _heading: any;
    private _prevContainerWidth: number;
    private _masonry: any;
    private _sizer: any;

    public constructor(
        $scope: ng.IScope,
        private $element: JQuery,
        private $attrs: ITilesDirectiveAttributes,
        private $rootScope: ng.IRootScopeService
    ) {
        "ngInject";
        this._columnWidth = $attrs.columnWidth ? Math.floor(Number($attrs.columnWidth)) : 440;
        this._container = $element.children('.pip-tiles-container');
		this._heading = $($element.children('.pip-tiles-heading')[0]);
        this._prevContainerWidth = null;
        this._masonry = Masonry.data(this._container[0]);

        // Add class to the element
        $element.addClass('pip-tiles');

        // Add resize listener
        const listener = () => { this.resize(false); };
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
        let width = this.$element.parent().width(),
            containerWidth;

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
			if (this._heading) {
				this._heading.css('width', (containerWidth + 10) + 'px');
			}
            this._container.removeClass('pip-mobile');
        } else {
            width = width - 16 * 2;
            containerWidth = width;

            this._sizer.css('width', containerWidth + 'px');
            // +10 to avoid precision related error
            this._container.css('width', (containerWidth + 10) + 'px');
			if (this._heading) {
				this._heading.css('width', (containerWidth + 10) + 'px');
			}
            this._container.addClass('pip-mobile');
        }

        // Manually call layout on tile container
        if (this._prevContainerWidth != containerWidth || force) {
            this._prevContainerWidth = containerWidth;
            this._masonry.layout();

            // Notify child controls that layout was resized
            this.$rootScope.$emit(LayoutResizedEvent, containerWidth);
        }
    }
}

function tilesDirective($rootScope: ng.IRootScopeService): ng.IDirective {
    "ngInject";

    // Converts value into boolean
    function convertToBoolean(value): boolean {
        if (value == null) return false;
        if (!value) return false;
        value = value.toString().toLowerCase();
        return value == '1' || value == 'true';
    }

    return {
        restrict: 'EA',
        scope: {
			gutter: '='
		},
        transclude: {
            'heading': '?pipTilesHeading'
        },
        template:
        ($element: JQuery, $attrs: ITilesDirectiveAttributes) => {
            if (convertToBoolean($attrs.pipInfinite)) {
                return String()
                    + '<div class="pip-tiles-heading" ng-transclude="heading"></div>'
                    + '<div masonry class="pip-tiles-container" load-images="false" preserve-order  '
                    + ' ng-transclude column-width=".pip-tile-sizer" item-selector=".pip-tile"'
                    + ' masonry-options="tilesOptions"  pip-scroll-container="\'.pip-tiles\'"'
                    + ' pip-infinite-scroll="readScroll()" >'
                    + '</div>';
            } else {
                return String()
					+ '<div class="pip-tiles-heading" ng-transclude="heading"></div>'
                    + '<div masonry class="pip-tiles-container" load-images="false" preserve-order  '
                    + ' ng-transclude column-width=".pip-tile-sizer" item-selector=".pip-tile"'
                    + ' masonry-options="tilesOptions">'
                    + '</div>';
            }
        },
        controller: ($scope: ITilesControllerScope) => {
            $scope.tilesOptions = {
                gutter: $scope.gutter || 8,//16
                isFitWidth: false,
                isResizeBound: false,
                transitionDuration: 0 // '0.2s'
            };
        },
        link: ($scope: ng.IScope, $element: JQuery, $attrs: ITilesDirectiveAttributes) => {
            new TilesDirectiveLink($scope, $element, $attrs, $rootScope);
        }
    };
}

angular
    .module('pipLayout')
    .directive('pipTiles', tilesDirective);
