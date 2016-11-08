(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).layouts = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
angular.module('pipLayout', ['wu.masonry']);
require('./media/MediaService');
require('./media/ResizeFunctions');
require('./layouts/MainDirective');
require('./layouts/CardDirective');
require('./layouts/DialogDirective');
require('./layouts/DocumentDirective');
require('./layouts/SimpleDirective');
require('./layouts/TilesDirective');
require('./layouts/AuxiliaryPanel');
__export(require('./media/MediaService'));
__export(require('./media/ResizeFunctions'));
},{"./layouts/AuxiliaryPanel":2,"./layouts/CardDirective":3,"./layouts/DialogDirective":4,"./layouts/DocumentDirective":5,"./layouts/MainDirective":6,"./layouts/SimpleDirective":7,"./layouts/TilesDirective":8,"./media/MediaService":9,"./media/ResizeFunctions":10}],2:[function(require,module,exports){
'use strict';
var MediaService_1 = require('../media/MediaService');
var AuxiliaryService = (function () {
    AuxiliaryService.$inject = ['$rootScope', '$compile', '$mdSidenav'];
    function AuxiliaryService($rootScope, $compile, $mdSidenav) {
        this._$rootScope = $rootScope;
        this._$compile = $compile;
        this._$mdSidenav = $mdSidenav;
        this.opened = false;
        this.popoverTemplate = "<div ng-controller='params.controller' class='for-scope'>" +
            "<div ng-if='params.templateUrl' class='flex layout-column' ng-include='params.templateUrl'></div>";
        "</div>";
    }
    AuxiliaryService.prototype.show = function (p) {
        var _this = this;
        if (this.opened)
            return;
        var scope, params, content;
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
            this._$mdSidenav('pip-aux-panel', true).then(function (instance) {
                instance.open();
                _this.opened = true;
            });
        }
        catch (e) {
            this._$mdSidenav('pip-aux-panel').open();
            this.opened = true;
        }
    };
    AuxiliaryService.prototype.hide = function () {
        $(this.element.children()[1]).remove();
        this.opened = false;
        this._$mdSidenav('pip-aux-panel').close();
    };
    AuxiliaryService.prototype.isOpen = function () {
        return this.opened;
    };
    return AuxiliaryService;
}());
var AuxiliaryPanelController = (function () {
    AuxiliaryPanelController.$inject = ['pipAuxPanel'];
    function AuxiliaryPanelController(pipAuxPanel) {
        this._pipAuxPanel = pipAuxPanel;
    }
    AuxiliaryPanelController.prototype.isGtxs = function () {
        return Number($('body').width()) > MediaService_1.MainBreakpoints.xs && this._pipAuxPanel.isOpen();
    };
    AuxiliaryPanelController.prototype.onCloseClick = function () {
        this._pipAuxPanel.hide();
    };
    return AuxiliaryPanelController;
}());
function auxiliaryPanelDirective() {
    return {
        restrict: 'E',
        replace: true,
        controller: AuxiliaryPanelController,
        controllerAs: 'vm',
        template: '<md-sidenav class="md-sidenav-right md-whiteframe-z2 pip-aux-panel color-content-bg"' +
            'md-component-id="pip-aux-panel" md-is-locked-open="vm.isGtxs()" pip-focused>' +
            '<div class="close-button" ng-click="vm.onCloseClick()" ><md-icon md-svg-icon="icons:cross"></md-icon></div></md-sidenav>'
    };
}
angular
    .module('pipLayout')
    .directive('pipAuxPanel', auxiliaryPanelDirective)
    .service('pipAuxPanel', AuxiliaryService);
},{"../media/MediaService":9}],3:[function(require,module,exports){
'use strict';
var MediaService_1 = require('../media/MediaService');
(function () {
    cardDirective.$inject = ['$rootScope'];
    var CardDirectiveLink = (function () {
        function CardDirectiveLink($rootScope, $element, $attrs) {
            var _this = this;
            this._element = $element;
            this._rootScope = $rootScope;
            this._attrs = $attrs;
            $element.addClass('pip-card');
            var listener = function () { _this.resize(); };
            $rootScope.$on(MediaService_1.MainResizedEvent, listener);
            this.resize();
            setTimeout(listener, 100);
        }
        CardDirectiveLink.prototype.resize = function () {
            var _this = this;
            var $mainBody = $('.pip-main-body'), cardContainer = $('.pip-card-container'), windowWidth = $('pip-main').width(), maxWidth = $mainBody.width(), maxHeight = $mainBody.height(), minWidth = this._attrs.minWidth ? Math.floor(this._attrs.minWidth) : null, minHeight = this._attrs.minHeight ? Math.floor(this._attrs.minHeight) : null, width = this._attrs.width ? Math.floor(this._attrs.width) : null, height = this._attrs.height ? Math.floor(this._attrs.height) : null, left, top;
            if (MediaService_1.MainBreakpointStatuses.xs) {
                minWidth = null;
                minHeight = null;
                width = null;
                height = null;
                maxWidth = null;
                maxHeight = null;
            }
            else {
                var space = MediaService_1.MainBreakpointStatuses['gt-md'] ? 24 : 16;
                maxWidth -= space * 2;
                maxHeight -= space * 2;
                minWidth = minWidth ? Math.min(minWidth, maxWidth) : null;
                minHeight = minHeight ? Math.min(minHeight, maxHeight) : null;
                width = width ? Math.min(width, maxWidth) : null;
                height = height ? Math.min(height, maxHeight) : null;
            }
            this._element.css('max-width', maxWidth ? maxWidth + 'px' : '');
            this._element.css('min-width', minWidth ? minWidth + 'px' : '');
            this._element.css('width', width ? width + 'px' : '');
            this._element.css('height', height ? height + 'px' : '');
            if (!cardContainer.hasClass('pip-outer-scroll')) {
                this._element.css('max-height', maxHeight ? maxHeight + 'px' : '');
                this._element.css('min-height', minHeight ? minHeight + 'px' : '');
                var $header = this._element.find('.pip-header:visible'), $footer = this._element.find('.pip-footer:visible'), $body = this._element.find('.pip-body'), maxBodyHeight = maxHeight || $mainBody.height();
                if ($header.length > 0)
                    maxBodyHeight -= $header.outerHeight(true);
                if ($footer.length > 0)
                    maxBodyHeight -= $footer.outerHeight(true);
                $body.css('max-height', maxBodyHeight + 'px');
            }
            else {
                cardContainer.addClass('pip-scroll');
                if (MediaService_1.MainBreakpointStatuses.xs) {
                    left = 0;
                    top = 0;
                }
                else {
                    left = cardContainer.width() / 2 - this._element.width() / 2 - 16;
                    top = Math.max(cardContainer.height() / 2 - this._element.height() / 2 - 16, 0);
                }
                this._element.css('left', left);
                this._element.css('top', top);
                setTimeout(function () { _this._element.css('display', 'flex'); }, 100);
            }
            this._rootScope.$emit('pipLayoutResized');
        };
        return CardDirectiveLink;
    }());
    function cardDirective($rootScope) {
        "ngInject";
        return {
            restrict: 'EA',
            link: function ($scope, $element, $attrs) {
                new CardDirectiveLink($rootScope, $element, $attrs);
            }
        };
    }
    angular
        .module('pipLayout')
        .directive('pipCard', cardDirective);
})();
},{"../media/MediaService":9}],4:[function(require,module,exports){
'use strict';
(function () {
    function dialogDirective() {
        return {
            restrict: 'EA',
            link: function ($scope, $element, $attrs) {
                $element.addClass('pip-dialog');
            }
        };
    }
    angular
        .module('pipLayout')
        .directive('pipDialog', dialogDirective);
})();
},{}],5:[function(require,module,exports){
'use strict';
(function () {
    function documentDirective() {
        return {
            restrict: 'EA',
            link: function ($scope, $element, $attrs) {
                $element.addClass('pip-document');
            }
        };
    }
    angular
        .module('pipLayout')
        .directive('pipDocument', documentDirective);
})();
},{}],6:[function(require,module,exports){
'use strict';
var ResizeFunctions_1 = require('../media/ResizeFunctions');
var MediaService_1 = require('../media/MediaService');
(function () {
    var MainDirectiveController = (function () {
        MainDirectiveController.$inject = ['$scope', '$element', '$rootScope', '$timeout'];
        function MainDirectiveController($scope, $element, $rootScope, $timeout) {
            var _this = this;
            this._element = $element;
            this._rootScope = $rootScope;
            this._timeout = $timeout;
            $element.addClass('pip-main');
            var listener = function () { _this.resize(); };
            ResizeFunctions_1.addResizeListener($element[0], listener);
            $scope.$on('$destroy', function () {
                ResizeFunctions_1.removeResizeListener($element[0], listener);
            });
            this.updateBreakpointStatuses();
        }
        MainDirectiveController.prototype.updateBreakpointStatuses = function () {
            var _this = this;
            var width = this._element.innerWidth();
            var body = $('body');
            MediaService_1.MainBreakpointStatuses.update(MediaService_1.MainBreakpoints, width);
            $.each(MediaService_1.MainBreakpointStatuses, function (breakpoint, status) {
                if (_.isBoolean(status))
                    body[status ? 'addClass' : 'removeClass']('pip-' + breakpoint);
            });
            this._timeout(function () {
                _this._rootScope.$apply();
            });
        };
        MainDirectiveController.prototype.resize = function () {
            this.updateBreakpointStatuses();
            this._rootScope.$emit(MediaService_1.MainResizedEvent, MediaService_1.MainBreakpointStatuses);
        };
        return MainDirectiveController;
    }());
    var MainBodyDirectiveLink = (function () {
        function MainBodyDirectiveLink($scope, $element) {
            $element.addClass('pip-main-body');
        }
        return MainBodyDirectiveLink;
    }());
    function mainDirective() {
        return {
            restrict: 'EA',
            controller: MainDirectiveController,
            controllerAs: 'vm'
        };
    }
    function mainBodyDirective() {
        return {
            restrict: 'EA',
            link: MainBodyDirectiveLink
        };
    }
    angular
        .module('pipLayout')
        .directive('pipMain', mainDirective)
        .directive('pipMainBody', mainBodyDirective);
})();
},{"../media/MediaService":9,"../media/ResizeFunctions":10}],7:[function(require,module,exports){
'use strict';
(function () {
    function simpleDirective() {
        return {
            restrict: 'EA',
            link: function ($scope, $element, $attrs) {
                $element.addClass('pip-simple');
            }
        };
    }
    angular
        .module('pipLayout')
        .directive('pipSimple', simpleDirective);
})();
},{}],8:[function(require,module,exports){
'use strict';
tilesDirective.$inject = ['$rootScope'];
var ResizeFunctions_1 = require('../media/ResizeFunctions');
var MediaService_1 = require('../media/MediaService');
var TilesDirectiveLink = (function () {
    function TilesDirectiveLink($scope, $element, $rootScope, $attrs) {
        var _this = this;
        this._element = $element;
        this._rootScope = $rootScope;
        this._attrs = $attrs;
        this._columnWidth = $attrs.columnWidth ? Math.floor($attrs.columnWidth) : 440,
            this._container = $element.children('.pip-tiles-container'),
            this._prevContainerWidth = null,
            this._masonry = Masonry.data(this._container[0]);
        $element.addClass('pip-tiles');
        var listener = function () { _this.resize(false); };
        ResizeFunctions_1.addResizeListener($element[0], listener);
        $scope.$on('$destroy', function () {
            ResizeFunctions_1.removeResizeListener($element[0], listener);
        });
        this._sizer = $('<div class="pip-tile-sizer"></div>');
        this._sizer.appendTo(this._container);
        $rootScope.$on(MediaService_1.MainResizedEvent, function () { _this.resize(false); });
        this.resize(true);
    }
    TilesDirectiveLink.prototype.resize = function (force) {
        var width = this._element.parent().width();
        var containerWidth;
        console.log();
        if (MediaService_1.MainBreakpointStatuses['gt-xs'] && (width - 36) > this._columnWidth) {
            width = width - 24 * 2;
            var columns = Math.floor(width / this._columnWidth);
            containerWidth = (this._columnWidth + 16) * columns - 16;
            if (containerWidth > width) {
                columns--;
                containerWidth = (this._columnWidth + 16) * columns - 16;
            }
            if (columns < 1) {
                containerWidth = width;
                this._sizer.css('width', containerWidth + 'px');
            }
            else {
                this._sizer.css('width', this._columnWidth + 'px');
            }
            this._container.css('width', (containerWidth + 10) + 'px');
            this._container.removeClass('pip-mobile');
        }
        else {
            width = width - 16 * 2;
            containerWidth = width;
            this._sizer.css('width', containerWidth + 'px');
            this._container.css('width', (containerWidth + 10) + 'px');
            this._container.addClass('pip-mobile');
        }
        if (this._prevContainerWidth != containerWidth || force) {
            this._prevContainerWidth = containerWidth;
            this._masonry.layout();
            this._rootScope.$emit(MediaService_1.LayoutResizedEvent);
        }
    };
    return TilesDirectiveLink;
}());
function tilesDirective($rootScope) {
    "ngInject";
    function convertToBoolean(value) {
        if (value == null)
            return false;
        if (!value)
            return false;
        value = value.toString().toLowerCase();
        return value == '1' || value == 'true';
    }
    return {
        restrict: 'EA',
        scope: false,
        transclude: true,
        template: function ($element, $attrs) {
            if (convertToBoolean($attrs.pipInfinite)) {
                return String()
                    + '<div masonry class="pip-tiles-container" load-images="false" preserve-order  '
                    + ' ng-transclude column-width=".pip-tile-sizer" item-selector=".pip-tile"'
                    + ' masonry-options="tilesOptions"  pip-scroll-container="\'.pip-tiles\'"'
                    + ' pip-infinite-scroll="readScroll()" >'
                    + '</div>';
            }
            else {
                return String()
                    + '<div masonry class="pip-tiles-container" load-images="false" preserve-order  '
                    + ' ng-transclude column-width=".pip-tile-sizer" item-selector=".pip-tile"'
                    + ' masonry-options="tilesOptions">'
                    + '</div>';
            }
        },
        controller: ['$scope', function ($scope) {
            $scope.tilesOptions = {
                gutter: 8,
                isFitWidth: false,
                isResizeBound: false,
                transitionDuration: 0
            };
        }],
        link: function ($scope, $element, $attrs) {
            new TilesDirectiveLink($scope, $element, $rootScope, $attrs);
        }
    };
}
angular
    .module('pipLayout')
    .directive('pipTiles', tilesDirective);
},{"../media/MediaService":9,"../media/ResizeFunctions":10}],9:[function(require,module,exports){
'use strict';
var MediaBreakpoints = (function () {
    function MediaBreakpoints(xs, sm, md, lg) {
        this.xs = xs;
        this.sm = sm;
        this.md = md;
        this.lg = lg;
    }
    return MediaBreakpoints;
}());
exports.MediaBreakpoints = MediaBreakpoints;
var MediaBreakpointStatuses = (function () {
    function MediaBreakpointStatuses() {
    }
    MediaBreakpointStatuses.prototype.update = function (breakpoints, width) {
        if (breakpoints == null)
            return;
        this.width = width;
        this['xs'] = width <= breakpoints.xs;
        this['gt-xs'] = width > breakpoints.xs;
        this['sm'] = width > breakpoints.xs && width <= breakpoints.sm;
        this['gt-sm'] = width > breakpoints.sm;
        this['md'] = width > breakpoints.sm && width <= breakpoints.md;
        this['gt-md'] = width > breakpoints.md;
        this['lg'] = width > breakpoints.md && width <= breakpoints.lg;
        this['gt-lg'] = width > breakpoints.lg;
        this['xl'] = this['gt-lg'];
    };
    return MediaBreakpointStatuses;
}());
exports.MediaBreakpointStatuses = MediaBreakpointStatuses;
exports.MainResizedEvent = 'pipMainResized';
exports.LayoutResizedEvent = 'pipLayoutResized';
exports.MainBreakpoints = new MediaBreakpoints(639, 1110, 1220, 1599);
exports.MainBreakpointStatuses = new MediaBreakpointStatuses();
var MediaProvider = (function () {
    function MediaProvider() {
    }
    Object.defineProperty(MediaProvider.prototype, "breakpoints", {
        get: function () {
            return exports.MainBreakpoints;
        },
        set: function (value) {
            exports.MainBreakpoints = value;
        },
        enumerable: true,
        configurable: true
    });
    MediaProvider.prototype.$get = function () {
        var service = function (size) {
            return exports.MainBreakpointStatuses[size];
        };
        Object.defineProperty(service, 'breakpoints', {
            get: function () { return exports.MainBreakpoints; },
            set: function (value) {
                exports.MainBreakpoints = value || new MediaBreakpoints(639, 1110, 1220, 1599);
                exports.MainBreakpointStatuses.update(exports.MainBreakpoints, exports.MainBreakpointStatuses.width);
            }
        });
        Object.defineProperty(service, 'width', {
            get: function () {
                return exports.MainBreakpointStatuses.width;
            }
        });
        return service;
    };
    return MediaProvider;
}());
angular
    .module('pipLayout')
    .provider('pipMedia', MediaProvider);
},{}],10:[function(require,module,exports){
'use strict';
var attachEvent = document.attachEvent;
var isIE = navigator.userAgent.match(/Trident/);
function requestFrame(callback) {
    var frame = window.requestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.webkitRequestAnimationFrame
        || function (callback) {
            return window.setTimeout(callback, 20);
        };
    return frame(callback);
}
function cancelFrame() {
    var cancel = window.cancelAnimationFrame
        || window.mozCancelAnimationFrame
        || window.webkitCancelAnimationFrame
        || window.clearTimeout;
    return function (id) {
        return cancel(id);
    };
}
function resizeListener(event) {
    var win = event.target || event.srcElement;
    if (win.__resizeRAF__)
        cancelFrame();
    win.__resizeRAF__ = requestFrame(function () {
        var trigger = win.__resizeTrigger__;
        trigger.__resizeListeners__.forEach(function (fn) {
            fn.call(trigger, event);
        });
    });
}
function loadListener(event) {
    this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__;
    this.contentDocument.defaultView.addEventListener('resize', resizeListener);
}
function addResizeListener(element, listener) {
    if (!element.__resizeListeners__) {
        element.__resizeListeners__ = [];
        if (attachEvent) {
            element.__resizeTrigger__ = element;
            element.attachEvent('onresize', resizeListener);
        }
        else {
            if (getComputedStyle(element).position == 'static')
                element.style.position = 'relative';
            var obj = element.__resizeTrigger__ = document.createElement('object');
            obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
            obj.__resizeElement__ = element;
            obj.onload = loadListener;
            obj.type = 'text/html';
            if (isIE)
                element.appendChild(obj);
            obj.data = 'about:blank';
            if (!isIE)
                element.appendChild(obj);
        }
    }
    element.__resizeListeners__.push(listener);
}
exports.addResizeListener = addResizeListener;
function removeResizeListener(element, listener) {
    if (listener)
        element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(listener), 1);
    if (!element.__resizeListeners__.length) {
        if (attachEvent)
            element.detachEvent('onresize', resizeListener);
        else {
            element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', resizeListener);
            element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__);
        }
    }
}
exports.removeResizeListener = removeResizeListener;
},{}]},{},[1])(1)
});


//# sourceMappingURL=pip-webui-layouts.js.map
