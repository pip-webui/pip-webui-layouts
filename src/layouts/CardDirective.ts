'use strict';

import { MainResizedEvent, LayoutResizedEvent, MainBreakpointStatuses } from '../media/MediaService';

export const __ = null;

class CardDirectiveLink {
    private _element: any;
    private _attrs: any;
    private _rootScope: ng.IRootScopeService;

    public constructor($rootScope: ng.IRootScopeService, $element: any, $attrs: any) {
        this._element = $element;
        this._rootScope = $rootScope;
        this._attrs = $attrs;

        // Add class to the element
        $element.addClass('pip-card');

        let listener = () => { this.resize(); }

        // Resize every time window is resized
        $rootScope.$on(MainResizedEvent, listener);

        // Resize right away to avoid flicking
        this.resize();

        // Resize the element right away
        setTimeout(listener, 100);
    }

    private resize() {
        var
            $mainBody = $('.pip-main-body'),
            cardContainer = $('.pip-card-container'),
            windowWidth = $('pip-main').width(),
            maxWidth = $mainBody.width(),
            maxHeight = $mainBody.height(),
            minWidth = this._attrs.minWidth ? Math.floor(this._attrs.minWidth) : null,
            minHeight = this._attrs.minHeight ? Math.floor(this._attrs.minHeight) : null,
            width = this._attrs.width ? Math.floor(this._attrs.width) : null,
            height = this._attrs.height ? Math.floor(this._attrs.height) : null,
            left, top;

        // Full-screen on phone
        if (MainBreakpointStatuses.xs) {
            minWidth = null;
            minHeight = null;
            width = null;
            height = null;
            maxWidth = null;
            maxHeight = null;
        }
        // Card view with adjustable margins on tablet and desktop
        else {
            // Set margin and maximum dimensions
            var space = MainBreakpointStatuses['gt-md'] ? 24 : 16;
            maxWidth -= space * 2;
            maxHeight -= space * 2;

            // Set minimum dimensions
            minWidth = minWidth ? Math.min(minWidth, maxWidth) : null;
            minHeight = minHeight ? Math.min(minHeight, maxHeight) : null;

            // Set regular dimensions
            width = width ? Math.min(width, maxWidth) : null;
            height = height ? Math.min(height, maxHeight) : null;
        }

        // Set dimensions
        this._element.css('max-width', maxWidth ? maxWidth + 'px' : '');
        this._element.css('min-width', minWidth ? minWidth + 'px' : '');
        this._element.css('width', width ? width + 'px' : '');
        this._element.css('height', height ? height + 'px' : '');

        if (!cardContainer.hasClass('pip-outer-scroll')) {
            this._element.css('max-height', maxHeight ? maxHeight + 'px' : '');
            this._element.css('min-height', minHeight ? minHeight + 'px' : '');
            var
                $header = this._element.find('.pip-header:visible'),
                $footer = this._element.find('.pip-footer:visible'),
                $body = this._element.find('.pip-body'),
                maxBodyHeight = maxHeight || $mainBody.height();

            if ($header.length > 0)
                maxBodyHeight -= $header.outerHeight(true);
            if ($footer.length > 0)
                maxBodyHeight -= $footer.outerHeight(true);

            $body.css('max-height', maxBodyHeight + 'px');
        } else {
            cardContainer.addClass('pip-scroll');
            if (MainBreakpointStatuses.xs) {
                left = 0;
                top = 0;
            } else {
                left = cardContainer.width() / 2 - this._element.width() / 2 - 16;
                top = Math.max(cardContainer.height() / 2 - this._element.height() / 2 - 16, 0);
            }

            this._element.css('left', left);
            this._element.css('top', top);

            setTimeout(() => { this._element.css('display', 'flex'); }, 100);
        }

        // Notify child controls that layout was resized
        this._rootScope.$emit('pipLayoutResized');
    }
}

function cardDirective($rootScope: ng.IRootScopeService) {
    "ngInject";

    return {
        restrict: 'EA',
        link: ($scope, $element, $attrs) => {
            new CardDirectiveLink($rootScope, $element, $attrs);
        }
    }
}


angular
    .module('pipLayout')
    .directive('pipCard', cardDirective);

