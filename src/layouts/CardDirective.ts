import { MainResizedEvent, LayoutResizedEvent } from '../media/IMediaService';
import { MainBreakpointStatuses } from '../media/MediaService';

// Avoid default export
(() => {

interface ICardDirectiveAttributes extends ng.IAttributes {
    minWidth: string | number;
    minHeight: string | number;
    width: string | number;
    height: string | number;
}

class CardDirectiveLink {

    public constructor(
        private $rootScope: ng.IRootScopeService, 
        private $element: JQuery, 
        private $attrs: ICardDirectiveAttributes
    ) {
       "ngInject";
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
        const
            $mainBody = $('.pip-main-body'),
            cardContainer = $('.pip-card-container'),
            windowWidth = $('pip-main').width();
        let
            maxWidth = $mainBody.width(),
            maxHeight = $mainBody.height(),
            minWidth = this.$attrs.minWidth ? Math.floor(Number(this.$attrs.minWidth)) : null,
            minHeight = this.$attrs.minHeight ? Math.floor(Number(this.$attrs.minHeight)) : null,
            width = this.$attrs.width ? Math.floor(Number(this.$attrs.width)) : null,
            height = this.$attrs.height ? Math.floor(Number(this.$attrs.height)) : null,
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
            const space = MainBreakpointStatuses['gt-md'] ? 24 : 16;
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
        this.$element.css('max-width', maxWidth ? maxWidth + 'px' : '');
        this.$element.css('min-width', minWidth ? minWidth + 'px' : '');
        this.$element.css('width', width ? width + 'px' : '');
        this.$element.css('height', height ? height + 'px' : '');

        if (!cardContainer.hasClass('pip-outer-scroll')) {
            this.$element.css('max-height', maxHeight ? maxHeight + 'px' : '');
            this.$element.css('min-height', minHeight ? minHeight + 'px' : '');
            const
                $header = this.$element.find('.pip-header:visible'),
                $footer = this.$element.find('.pip-footer:visible'),
                $body = this.$element.find('.pip-body');
            let maxBodyHeight = maxHeight || $mainBody.height();

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
                left = cardContainer.width() / 2 - this.$element.width() / 2 - 16;
                top = Math.max(cardContainer.height() / 2 - this.$element.height() / 2 - 16, 0);
            }

            this.$element.css('left', left);
            this.$element.css('top', top);

            setTimeout(() => { this.$element.css('display', 'flex'); }, 100);
        }

        // Notify child controls that layout was resized
        this.$rootScope.$emit('pipLayoutResized');
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

})();