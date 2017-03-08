(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).layouts = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var MediaService_1 = require("../media/MediaService");
(function () {
    var AuxPanelDirectiveController = (function () {
        AuxPanelDirectiveController.$inject = ['pipAuxPanel'];
        function AuxPanelDirectiveController(pipAuxPanel) {
            this.normalSize = 320;
            this.largeSize = 480;
            this._pipAuxPanel = pipAuxPanel;
        }
        AuxPanelDirectiveController.prototype.isGtxs = function () {
            return Number($('body').width()) > MediaService_1.MainBreakpoints.xs && this._pipAuxPanel.isOpen();
        };
        AuxPanelDirectiveController.prototype.isGtlg = function () {
            return Number($('body').width()) > (MediaService_1.MainBreakpoints.lg + this.largeSize);
        };
        return AuxPanelDirectiveController;
    }());
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
        };
    }
    angular
        .module('pipAuxPanel')
        .directive('pipAuxPanel', AuxPanelDirective);
})();
},{"../media/MediaService":12}],2:[function(require,module,exports){
'use strict';
(function () {
    AuxPanelPartDirectiveController.$inject = ['$scope', '$element', '$attrs', '$rootScope', 'pipAuxPanel'];
    AuxPanelPartDirective.$inject = ['ngIfDirective'];
    function AuxPanelPartDirectiveController($scope, $element, $attrs, $rootScope, pipAuxPanel) {
        "ngInject";
        var partName = '' + $attrs.pipAuxPanelPart;
        var partValue = null;
        var pos = partName.indexOf(':');
        if (pos > 0) {
            partValue = partName.substr(pos + 1);
            partName = partName.substr(0, pos);
        }
        onAuxPanelChanged(null, pipAuxPanel.config);
        $rootScope.$on('pipAuxPanelChanged', onAuxPanelChanged);
        function onAuxPanelChanged(event, config) {
            var parts = config.parts || {};
            var currentPartValue = config[partName];
            $scope.visible = partValue ? currentPartValue == partValue : currentPartValue;
        }
    }
    function AuxPanelPartDirective(ngIfDirective) {
        "ngInject";
        var ngIf = ngIfDirective[0];
        return {
            transclude: ngIf.transclude,
            priority: ngIf.priority,
            terminal: ngIf.terminal,
            restrict: ngIf.restrict,
            scope: true,
            link: function ($scope, $element, $attrs) {
                $attrs.ngIf = function () { return $scope.visible; };
                ngIf.link.apply(ngIf);
            },
            controller: AuxPanelPartDirectiveController
        };
    }
    angular
        .module('pipAuxPanel')
        .directive('pipAuxPanelPart', AuxPanelPartDirective);
})();
},{}],3:[function(require,module,exports){
'use strict';
hookAuxPanelEvents.$inject = ['$rootScope', 'pipAuxPanel'];
exports.AuxPanelChangedEvent = 'pipAuxPanelChanged';
exports.AuxPanelStateChangedEvent = 'pipAuxPanelStateChanged';
exports.OpenAuxPanelEvent = 'pipOpenAuxPanel';
exports.CloseAuxPanelEvent = 'pipCloseAuxPanel';
var AuxPanelConfig = (function () {
    function AuxPanelConfig() {
    }
    return AuxPanelConfig;
}());
exports.AuxPanelConfig = AuxPanelConfig;
var AuxPanelService = (function () {
    function AuxPanelService(config, $rootScope, $mdSidenav) {
        this.id = 'pip-auxpanel';
        this._config = config;
        this._rootScope = $rootScope;
        this._sidenav = $mdSidenav;
    }
    Object.defineProperty(AuxPanelService.prototype, "config", {
        get: function () {
            return this._config;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuxPanelService.prototype, "classes", {
        get: function () {
            return this._config.classes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuxPanelService.prototype, "parts", {
        get: function () {
            return this._config.parts;
        },
        set: function (value) {
            this._config.parts = value || {};
            this.sendConfigEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuxPanelService.prototype, "state", {
        get: function () {
            return this._state;
        },
        set: function (value) {
            this._state = value || {};
            this._rootScope.$broadcast(exports.AuxPanelStateChangedEvent, value);
        },
        enumerable: true,
        configurable: true
    });
    AuxPanelService.prototype.isOpen = function () {
        return this._sidenav(this.id).isOpen();
    };
    AuxPanelService.prototype.open = function () {
        this._sidenav(this.id).open();
    };
    AuxPanelService.prototype.close = function () {
        this._sidenav(this.id).close();
    };
    AuxPanelService.prototype.toggle = function () {
        this._sidenav(this.id).toggle();
    };
    AuxPanelService.prototype.addClass = function () {
        var _this = this;
        var classes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            classes[_i] = arguments[_i];
        }
        _.each(classes, function (c) {
            _this._config.classes.push(c);
        });
        this.sendConfigEvent();
    };
    AuxPanelService.prototype.removeClass = function () {
        var _this = this;
        var classes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            classes[_i] = arguments[_i];
        }
        _.each(classes, function (c) {
            _this._config.classes = _.reject(_this._config.classes, function (cc) { return cc == c; });
        });
        this.sendConfigEvent();
    };
    AuxPanelService.prototype.part = function (part, value) {
        this._config.parts[part] = value;
        this.sendConfigEvent();
    };
    AuxPanelService.prototype.sendConfigEvent = function () {
        this._rootScope.$emit(exports.AuxPanelChangedEvent, this._config);
    };
    return AuxPanelService;
}());
var AuxPanelProvider = (function () {
    function AuxPanelProvider() {
        this._config = {
            parts: {},
            classes: [],
            type: 'sticky',
            state: null
        };
    }
    Object.defineProperty(AuxPanelProvider.prototype, "config", {
        get: function () {
            return this._config;
        },
        set: function (value) {
            this._config = value || new AuxPanelConfig();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuxPanelProvider.prototype, "parts", {
        get: function () {
            return this._config.parts;
        },
        set: function (value) {
            this._config.parts = value || {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuxPanelProvider.prototype, "type", {
        get: function () {
            return this._config.type;
        },
        set: function (value) {
            this._config.type = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuxPanelProvider.prototype, "classes", {
        get: function () {
            return this._config.classes;
        },
        set: function (value) {
            this._config.classes = value || [];
        },
        enumerable: true,
        configurable: true
    });
    AuxPanelProvider.prototype.addClass = function () {
        var _this = this;
        var classes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            classes[_i] = arguments[_i];
        }
        _.each(classes, function (c) {
            _this._config.classes.push(c);
        });
    };
    AuxPanelProvider.prototype.removeClass = function () {
        var _this = this;
        var classes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            classes[_i] = arguments[_i];
        }
        _.each(classes, function (c) {
            _this._config.classes = _.reject(_this._config.classes, function (cc) { return cc == c; });
        });
    };
    AuxPanelProvider.prototype.part = function (part, value) {
        this._config.parts[part] = value;
    };
    AuxPanelProvider.prototype.open = function () {
        this._service.open();
    };
    AuxPanelProvider.prototype.close = function () {
        this._service.close();
    };
    AuxPanelProvider.prototype.toggle = function () {
        this._service.toggle();
    };
    AuxPanelProvider.prototype.$get = ['$rootScope', '$mdSidenav', function ($rootScope, $mdSidenav) {
        "ngInject";
        if (this._service == null)
            this._service = new AuxPanelService(this._config, $rootScope, $mdSidenav);
        return this._service;
    }];
    return AuxPanelProvider;
}());
function hookAuxPanelEvents($rootScope, pipAuxPanel) {
    $rootScope.$on(exports.OpenAuxPanelEvent, function () { pipAuxPanel.open(); });
    $rootScope.$on(exports.CloseAuxPanelEvent, function () { pipAuxPanel.close(); });
}
angular
    .module('pipAuxPanel')
    .provider('pipAuxPanel', AuxPanelProvider)
    .run(hookAuxPanelEvents);
},{}],4:[function(require,module,exports){
'use strict';
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
angular.module('pipAuxPanel', ['ngMaterial']);
require("./AuxPanelService");
require("./AuxPanelPartDirective");
require("./AuxPanelDirective");
__export(require("./AuxPanelService"));
},{"./AuxPanelDirective":1,"./AuxPanelPartDirective":2,"./AuxPanelService":3}],5:[function(require,module,exports){
'use strict';
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
angular.module('pipLayout', ['wu.masonry', 'pipMedia', 'pipAuxPanel']);
require("./media/index");
require("./layouts/MainDirective");
require("./layouts/CardDirective");
require("./layouts/DialogDirective");
require("./layouts/DocumentDirective");
require("./layouts/SimpleDirective");
require("./layouts/TilesDirective");
require("./auxpanel/index");
__export(require("./media/index"));
},{"./auxpanel/index":4,"./layouts/CardDirective":6,"./layouts/DialogDirective":7,"./layouts/DocumentDirective":8,"./layouts/MainDirective":9,"./layouts/SimpleDirective":10,"./layouts/TilesDirective":11,"./media/index":14}],6:[function(require,module,exports){
'use strict';
var MediaService_1 = require("../media/MediaService");
(function () {
    cardDirective.$inject = ['$rootScope'];
    var CardDirectiveLink = (function () {
        function CardDirectiveLink($rootScope, $element, $attrs) {
            var _this = this;
            this.$rootScope = $rootScope;
            this.$element = $element;
            this.$attrs = $attrs;
            $element.addClass('pip-card');
            var listener = function () { _this.resize(); };
            $rootScope.$on(MediaService_1.MainResizedEvent, listener);
            this.resize();
            setTimeout(listener, 100);
        }
        CardDirectiveLink.prototype.resize = function () {
            var _this = this;
            var $mainBody = $('.pip-main-body'), cardContainer = $('.pip-card-container'), windowWidth = $('pip-main').width();
            var maxWidth = $mainBody.width(), maxHeight = $mainBody.height(), minWidth = this.$attrs.minWidth ? Math.floor(Number(this.$attrs.minWidth)) : null, minHeight = this.$attrs.minHeight ? Math.floor(Number(this.$attrs.minHeight)) : null, width = this.$attrs.width ? Math.floor(Number(this.$attrs.width)) : null, height = this.$attrs.height ? Math.floor(Number(this.$attrs.height)) : null, left, top;
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
            this.$element.css('max-width', maxWidth ? maxWidth + 'px' : '');
            this.$element.css('min-width', minWidth ? minWidth + 'px' : '');
            this.$element.css('width', width ? width + 'px' : '');
            this.$element.css('height', height ? height + 'px' : '');
            if (!cardContainer.hasClass('pip-outer-scroll')) {
                this.$element.css('max-height', maxHeight ? maxHeight + 'px' : '');
                this.$element.css('min-height', minHeight ? minHeight + 'px' : '');
                var $header = this.$element.find('.pip-header:visible'), $footer = this.$element.find('.pip-footer:visible'), $body = this.$element.find('.pip-body');
                var maxBodyHeight = maxHeight || $mainBody.height();
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
                    left = cardContainer.width() / 2 - this.$element.width() / 2 - 16;
                    top = Math.max(cardContainer.height() / 2 - this.$element.height() / 2 - 16, 0);
                }
                this.$element.css('left', left);
                this.$element.css('top', top);
                setTimeout(function () { _this.$element.css('display', 'flex'); }, 100);
            }
            this.$rootScope.$emit('pipLayoutResized');
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
},{"../media/MediaService":12}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
'use strict';
var ResizeFunctions_1 = require("../media/ResizeFunctions");
var MediaService_1 = require("../media/MediaService");
(function () {
    var MainDirectiveController = (function () {
        MainDirectiveController.$inject = ['$scope', '$element', '$rootScope', '$timeout', '$attrs'];
        function MainDirectiveController($scope, $element, $rootScope, $timeout, $attrs) {
            var _this = this;
            this.$scope = $scope;
            this.$element = $element;
            this.$rootScope = $rootScope;
            this.$timeout = $timeout;
            this.$attrs = $attrs;
            this._container = $attrs.pipContainer ? $($attrs.pipContainer) : $element;
            $element.addClass('pip-main');
            var listener = function () { _this.resize(); };
            ResizeFunctions_1.addResizeListener(this._container[0], listener);
            $scope.$on('$destroy', function () {
                ResizeFunctions_1.removeResizeListener(_this._container[0], listener);
            });
            this.updateBreakpointStatuses();
        }
        MainDirectiveController.prototype.updateBreakpointStatuses = function () {
            var _this = this;
            var width = this._container.innerWidth();
            var body = $('body');
            MediaService_1.MainBreakpointStatuses.update(MediaService_1.MainBreakpoints, width);
            $.each(MediaService_1.MainBreakpointStatuses, function (breakpoint, status) {
                if (_.isBoolean(status)) {
                    body[status ? 'addClass' : 'removeClass']('pip-' + breakpoint);
                }
            });
            this.$timeout(function () {
                _this.$rootScope.$apply();
            });
        };
        MainDirectiveController.prototype.resize = function () {
            this.updateBreakpointStatuses();
            this.$rootScope.$emit(MediaService_1.MainResizedEvent, MediaService_1.MainBreakpointStatuses);
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
            restrict: 'EAC',
            controller: MainDirectiveController,
            controllerAs: 'vm'
        };
    }
    function mainBodyDirective() {
        return {
            restrict: 'EAC',
            link: MainBodyDirectiveLink
        };
    }
    angular
        .module('pipLayout')
        .directive('pipMain', mainDirective)
        .directive('pipMainBody', mainBodyDirective);
})();
},{"../media/MediaService":12,"../media/ResizeFunctions":13}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
'use strict';
var ResizeFunctions_1 = require("../media/ResizeFunctions");
var MediaService_1 = require("../media/MediaService");
var TilesOptions = (function () {
    function TilesOptions() {
    }
    return TilesOptions;
}());
var TilesDirectiveLink = (function () {
    function TilesDirectiveLink($scope, $element, $rootScope, $attrs) {
        var _this = this;
        this.$element = $element;
        this.$rootScope = $rootScope;
        this.$attrs = $attrs;
        this._columnWidth = $attrs.columnWidth ? Math.floor(Number($attrs.columnWidth)) : 440,
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
        var width = this.$element.parent().width(), containerWidth;
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
            this.$rootScope.$emit(MediaService_1.LayoutResizedEvent);
        }
    };
    return TilesDirectiveLink;
}());
function tilesDirective() {
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
        link: TilesDirectiveLink
    };
}
angular
    .module('pipLayout')
    .directive('pipTiles', tilesDirective);
},{"../media/MediaService":12,"../media/ResizeFunctions":13}],12:[function(require,module,exports){
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
exports.MainBreakpoints = new MediaBreakpoints(639, 716, 1024, 1439);
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
                exports.MainBreakpoints = value || new MediaBreakpoints(639, 716, 1024, 1439);
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
    .module('pipMedia')
    .provider('pipMedia', MediaProvider);
},{}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
'use strict';
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
angular.module('pipMedia', []);
require("./MediaService");
require("./ResizeFunctions");
__export(require("./MediaService"));
__export(require("./ResizeFunctions"));
},{"./MediaService":12,"./ResizeFunctions":13}]},{},[5])(5)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXV4cGFuZWwvQXV4UGFuZWxEaXJlY3RpdmUudHMiLCJzcmMvYXV4cGFuZWwvQXV4UGFuZWxQYXJ0RGlyZWN0aXZlLnRzIiwic3JjL2F1eHBhbmVsL0F1eFBhbmVsU2VydmljZS50cyIsInNyYy9hdXhwYW5lbC9pbmRleC50cyIsInNyYy9pbmRleC50cyIsInNyYy9sYXlvdXRzL0NhcmREaXJlY3RpdmUudHMiLCJzcmMvbGF5b3V0cy9EaWFsb2dEaXJlY3RpdmUudHMiLCJzcmMvbGF5b3V0cy9Eb2N1bWVudERpcmVjdGl2ZS50cyIsInNyYy9sYXlvdXRzL01haW5EaXJlY3RpdmUudHMiLCJzcmMvbGF5b3V0cy9TaW1wbGVEaXJlY3RpdmUudHMiLCJzcmMvbGF5b3V0cy9UaWxlc0RpcmVjdGl2ZS50cyIsInNyYy9tZWRpYS9NZWRpYVNlcnZpY2UudHMiLCJzcmMvbWVkaWEvUmVzaXplRnVuY3Rpb25zLnRzIiwic3JjL21lZGlhL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsWUFBWSxDQUFDO0FBRWIsc0RBQXdEO0FBR3hELENBQUM7SUFFRDtRQUtJLHFDQUFtQixXQUE2QjtZQUh4QyxlQUFVLEdBQVcsR0FBRyxDQUFDO1lBQ3pCLGNBQVMsR0FBVyxHQUFHLENBQUM7WUFHNUIsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7UUFDcEMsQ0FBQztRQUVNLDRDQUFNLEdBQWI7WUFDSSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLDhCQUFlLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDeEYsQ0FBQztRQUVNLDRDQUFNLEdBQWI7WUFDSSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxL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QUMsaUJBQWlCLEdBQUcsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ2hGLENBQUM7SUFDTCxDQUFDO0FBQ0wsQ0FBQztBQVRELG9EQVNDOztBQzNFRCxZQUFZLENBQUM7Ozs7QUFFYixPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUUvQiwwQkFBd0I7QUFDeEIsNkJBQTJCO0FBRTNCLG9DQUErQjtBQUMvQix1Q0FBa0MiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0IHsgTWFpbkJyZWFrcG9pbnRzIH0gZnJvbSAnLi4vbWVkaWEvTWVkaWFTZXJ2aWNlJztcclxuaW1wb3J0IHsgSUF1eFBhbmVsU2VydmljZSB9IGZyb20gJy4vQXV4UGFuZWxTZXJ2aWNlJztcclxuXHJcbigoKSA9PiB7XHJcblxyXG5jbGFzcyBBdXhQYW5lbERpcmVjdGl2ZUNvbnRyb2xsZXIge1xyXG4gICAgcHJpdmF0ZSBfcGlwQXV4UGFuZWw6IElBdXhQYW5lbFNlcnZpY2U7XHJcbiAgICBwcml2YXRlIG5vcm1hbFNpemU6IG51bWJlciA9IDMyMDtcclxuICAgIHByaXZhdGUgbGFyZ2VTaXplOiBudW1iZXIgPSA0ODA7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHBpcEF1eFBhbmVsOiBJQXV4UGFuZWxTZXJ2aWNlKSB7XHJcbiAgICAgICAgdGhpcy5fcGlwQXV4UGFuZWwgPSBwaXBBdXhQYW5lbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaXNHdHhzKCk6Ym9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIE51bWJlcigkKCdib2R5Jykud2lkdGgoKSkgPiBNYWluQnJlYWtwb2ludHMueHMgJiYgdGhpcy5fcGlwQXV4UGFuZWwuaXNPcGVuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlzR3RsZygpOmJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBOdW1iZXIoJCgnYm9keScpLndpZHRoKCkpID4gKE1haW5CcmVha3BvaW50cy5sZyArIHRoaXMubGFyZ2VTaXplKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gQXV4UGFuZWxEaXJlY3RpdmUoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgcmVwbGFjZTogdHJ1ZSxcclxuICAgICAgICBjb250cm9sbGVyOiBBdXhQYW5lbERpcmVjdGl2ZUNvbnRyb2xsZXIsXHJcbiAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcclxuICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgdGVtcGxhdGU6ICc8bWQtc2lkZW5hdiBjbGFzcz1cIm1kLXNpZGVuYXYtcmlnaHQgbWQtd2hpdGVmcmFtZS16MiBwaXAtYXV4cGFuZWwgY29sb3ItY29udGVudC1iZ1wiIG5nLWNsYXNzPVwie1xcJ3BpcC1sYXJnZVxcJzogdm0uaXNHdGxnKCl9XCInICsgXHJcbiAgICAgICAgICAgICAgICAgICAgJ21kLWNvbXBvbmVudC1pZD1cInBpcC1hdXhwYW5lbFwiIG1kLWlzLWxvY2tlZC1vcGVuPVwidm0uaXNHdHhzKClcIiBwaXAtZm9jdXNlZCBuZy10cmFuc2NsdWRlPicgKyBcclxuICAgICAgICAgICAgICAgICAgICAnPC9tZC1zaWRlbmF2PidcclxuICAgIH1cclxufVxyXG5cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgncGlwQXV4UGFuZWwnKVxyXG4gICAgLmRpcmVjdGl2ZSgncGlwQXV4UGFuZWwnLCBBdXhQYW5lbERpcmVjdGl2ZSk7XHJcblxyXG59KSgpOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8vIFByZXZlbnQganVuayBmcm9tIGdvaW5nIGludG8gdHlwZXNjcmlwdCBkZWZpbml0aW9uc1xyXG4oKCkgPT4ge1xyXG5cclxuZnVuY3Rpb24gQXV4UGFuZWxQYXJ0RGlyZWN0aXZlQ29udHJvbGxlcigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICRyb290U2NvcGUsIHBpcEF1eFBhbmVsKSB7XHJcbiAgICBcIm5nSW5qZWN0XCI7XHJcblxyXG4gICAgdmFyIHBhcnROYW1lID0gJycgKyAkYXR0cnMucGlwQXV4UGFuZWxQYXJ0O1xyXG4gICAgdmFyIHBhcnRWYWx1ZSA9IG51bGw7XHJcblxyXG4gICAgLy8gQnJlYWsgcGFydCBhcGFydFxyXG4gICAgdmFyIHBvcyA9IHBhcnROYW1lLmluZGV4T2YoJzonKTtcclxuICAgIGlmIChwb3MgPiAwKSB7XHJcbiAgICAgICAgcGFydFZhbHVlID0gcGFydE5hbWUuc3Vic3RyKHBvcyArIDEpO1xyXG4gICAgICAgIHBhcnROYW1lID0gcGFydE5hbWUuc3Vic3RyKDAsIHBvcyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25BdXhQYW5lbENoYW5nZWQobnVsbCwgcGlwQXV4UGFuZWwuY29uZmlnKVxyXG4gICAgJHJvb3RTY29wZS4kb24oJ3BpcEF1eFBhbmVsQ2hhbmdlZCcsIG9uQXV4UGFuZWxDaGFuZ2VkKTtcclxuXHJcbiAgICBmdW5jdGlvbiBvbkF1eFBhbmVsQ2hhbmdlZChldmVudCwgY29uZmlnKSB7XHJcbiAgICAgICAgdmFyIHBhcnRzID0gY29uZmlnLnBhcnRzIHx8IHt9O1xyXG4gICAgICAgIHZhciBjdXJyZW50UGFydFZhbHVlID0gY29uZmlnW3BhcnROYW1lXTtcclxuICAgICAgICAvLyBTZXQgdmlzaWJsZSB2YXJpYWJsZSB0byBzd2l0Y2ggbmdJZlxyXG5cclxuICAgICAgICAkc2NvcGUudmlzaWJsZSA9IHBhcnRWYWx1ZSA/IGN1cnJlbnRQYXJ0VmFsdWUgPT0gcGFydFZhbHVlIDogY3VycmVudFBhcnRWYWx1ZTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIEF1eFBhbmVsUGFydERpcmVjdGl2ZShuZ0lmRGlyZWN0aXZlKSB7XHJcbiAgICBcIm5nSW5qZWN0XCI7XHJcblxyXG4gICAgdmFyIG5nSWYgPSBuZ0lmRGlyZWN0aXZlWzBdO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHJhbnNjbHVkZTogbmdJZi50cmFuc2NsdWRlLFxyXG4gICAgICAgIHByaW9yaXR5OiBuZ0lmLnByaW9yaXR5LFxyXG4gICAgICAgIHRlcm1pbmFsOiBuZ0lmLnRlcm1pbmFsLFxyXG4gICAgICAgIHJlc3RyaWN0OiBuZ0lmLnJlc3RyaWN0LFxyXG4gICAgICAgIHNjb3BlOiB0cnVlLFxyXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZTogYW55LCAkZWxlbWVudCwgJGF0dHJzKSB7XHJcbiAgICAgICAgICAgIC8vIFZpc3VhbGl6ZSBiYXNlZCBvbiB2aXNpYmxlIHZhcmlhYmxlIGluIHNjb3BlXHJcbiAgICAgICAgICAgICRhdHRycy5uZ0lmID0gZnVuY3Rpb24oKSB7IHJldHVybiAkc2NvcGUudmlzaWJsZSB9O1xyXG4gICAgICAgICAgICBuZ0lmLmxpbmsuYXBwbHkobmdJZik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjb250cm9sbGVyOiBBdXhQYW5lbFBhcnREaXJlY3RpdmVDb250cm9sbGVyXHJcbiAgICB9O1xyXG59XHJcblxyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdwaXBBdXhQYW5lbCcpXHJcbiAgICAuZGlyZWN0aXZlKCdwaXBBdXhQYW5lbFBhcnQnLCBBdXhQYW5lbFBhcnREaXJlY3RpdmUpO1xyXG5cclxufSkoKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5leHBvcnQgbGV0IEF1eFBhbmVsQ2hhbmdlZEV2ZW50ID0gJ3BpcEF1eFBhbmVsQ2hhbmdlZCc7XHJcbmV4cG9ydCBsZXQgQXV4UGFuZWxTdGF0ZUNoYW5nZWRFdmVudCA9ICdwaXBBdXhQYW5lbFN0YXRlQ2hhbmdlZCc7XHJcbmV4cG9ydCBsZXQgT3BlbkF1eFBhbmVsRXZlbnQgPSAncGlwT3BlbkF1eFBhbmVsJztcclxuZXhwb3J0IGxldCBDbG9zZUF1eFBhbmVsRXZlbnQgPSAncGlwQ2xvc2VBdXhQYW5lbCc7XHJcblxyXG5leHBvcnQgY2xhc3MgQXV4UGFuZWxDb25maWcge1xyXG4gICAgcGFydHM6IGFueTtcclxuICAgIGNsYXNzZXM6IHN0cmluZ1tdO1xyXG4gICAgc3RhdGU6IGFueTtcclxuICAgIHR5cGU6IHN0cmluZztcclxufSBcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUF1eFBhbmVsU2VydmljZSB7XHJcbiAgICByZWFkb25seSBjb25maWc6IEF1eFBhbmVsQ29uZmlnO1xyXG4gICAgcmVhZG9ubHkgY2xhc3Nlczogc3RyaW5nW107XHJcbiAgICBwYXJ0czogYW55O1xyXG4gICAgc3RhdGU6IGFueTsgICAgXHJcblxyXG4gICAgaXNPcGVuKCk6IGJvb2xlYW47XHJcbiAgICBvcGVuKCk6IHZvaWQ7XHJcbiAgICBjbG9zZSgpOiB2b2lkO1xyXG4gICAgdG9nZ2xlKCk6IHZvaWQ7XHJcbiAgXHJcbiAgICBhZGRDbGFzcyguLi5jbGFzc2VzOiBzdHJpbmdbXSk6IHZvaWQ7XHJcbiAgICByZW1vdmVDbGFzcyguLi5jbGFzc2VzOiBzdHJpbmdbXSk6IHZvaWQ7XHJcbiBcclxuICAgIHBhcnQocGFydDogc3RyaW5nLCB2YWx1ZTogYW55KTogdm9pZDtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQXV4UGFuZWxQcm92aWRlciBleHRlbmRzIG5nLklTZXJ2aWNlUHJvdmlkZXIge1xyXG4gICAgY29uZmlnOiBBdXhQYW5lbENvbmZpZztcclxuICAgIHBhcnRzOiBhbnk7XHJcbiAgICB0eXBlOiBzdHJpbmc7XHJcbiAgICBjbGFzc2VzOiBzdHJpbmdbXTtcclxuXHJcbiAgICBvcGVuKCk6IHZvaWQ7XHJcbiAgICBjbG9zZSgpOiB2b2lkO1xyXG4gICAgdG9nZ2xlKCk6IHZvaWQ7XHJcblxyXG4gICAgYWRkQ2xhc3MoLi4uY2xhc3Nlczogc3RyaW5nW10pOiB2b2lkO1xyXG4gICAgcmVtb3ZlQ2xhc3MoLi4uY2xhc3Nlczogc3RyaW5nW10pOiB2b2lkO1xyXG5cclxuICAgIHBhcnQocGFydDogc3RyaW5nLCB2YWx1ZTogYW55KTogdm9pZDtcclxufVxyXG5cclxuY2xhc3MgQXV4UGFuZWxTZXJ2aWNlIGltcGxlbWVudHMgSUF1eFBhbmVsU2VydmljZSB7XHJcbiAgICBwcml2YXRlIF9jb25maWc6IEF1eFBhbmVsQ29uZmlnO1xyXG4gICAgcHJpdmF0ZSBfc3RhdGU6IGFueTtcclxuICAgIHByaXZhdGUgX3Jvb3RTY29wZTogbmcuSVJvb3RTY29wZVNlcnZpY2U7XHJcbiAgICBwcml2YXRlIF9zaWRlbmF2OiBuZy5tYXRlcmlhbC5JU2lkZW5hdlNlcnZpY2U7XHJcbiAgICBwcml2YXRlIGlkID0gJ3BpcC1hdXhwYW5lbCc7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGNvbmZpZzogQXV4UGFuZWxDb25maWcsICRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlLCAkbWRTaWRlbmF2OiBuZy5tYXRlcmlhbC5JU2lkZW5hdlNlcnZpY2UpIHtcclxuICAgICAgICB0aGlzLl9jb25maWcgPSBjb25maWc7XHJcbiAgICAgICAgdGhpcy5fcm9vdFNjb3BlID0gJHJvb3RTY29wZTtcclxuICAgICAgICB0aGlzLl9zaWRlbmF2ID0gJG1kU2lkZW5hdjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGNvbmZpZygpOiBBdXhQYW5lbENvbmZpZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbmZpZztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGNsYXNzZXMoKTogc3RyaW5nW10ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb25maWcuY2xhc3NlcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHBhcnRzKCk6IGFueSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbmZpZy5wYXJ0cztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHBhcnRzKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICB0aGlzLl9jb25maWcucGFydHMgPSB2YWx1ZSB8fCB7fTtcclxuICAgICAgICB0aGlzLnNlbmRDb25maWdFdmVudCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc3RhdGUoKTogYW55IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBzdGF0ZSh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgdGhpcy5fc3RhdGUgPSB2YWx1ZSB8fCB7fTtcclxuICAgICAgICB0aGlzLl9yb290U2NvcGUuJGJyb2FkY2FzdChBdXhQYW5lbFN0YXRlQ2hhbmdlZEV2ZW50LCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlzT3BlbigpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2lkZW5hdih0aGlzLmlkKS5pc09wZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb3BlbigpIHtcclxuICAgICAgICB0aGlzLl9zaWRlbmF2KHRoaXMuaWQpLm9wZW4oKTtcclxuICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICBwdWJsaWMgY2xvc2UoKSB7XHJcbiAgICAgICAgdGhpcy5fc2lkZW5hdih0aGlzLmlkKS5jbG9zZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0b2dnbGUoKSB7XHJcbiAgICAgICAgdGhpcy5fc2lkZW5hdih0aGlzLmlkKS50b2dnbGUoKTtcclxuICAgIH1cclxuICBcclxuICAgIHB1YmxpYyBhZGRDbGFzcyguLi5jbGFzc2VzOiBzdHJpbmdbXSk6IHZvaWQge1xyXG4gICAgICAgIF8uZWFjaChjbGFzc2VzLCAoYykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9jb25maWcuY2xhc3Nlcy5wdXNoKGMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuc2VuZENvbmZpZ0V2ZW50KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbW92ZUNsYXNzKC4uLmNsYXNzZXM6IHN0cmluZ1tdKTogdm9pZCB7XHJcbiAgICAgICAgXy5lYWNoKGNsYXNzZXMsIChjKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZy5jbGFzc2VzID0gXy5yZWplY3QodGhpcy5fY29uZmlnLmNsYXNzZXMsIChjYykgPT4gY2MgPT0gYyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zZW5kQ29uZmlnRXZlbnQoKTtcclxuICAgIH1cclxuIFxyXG4gICAgcHVibGljIHBhcnQocGFydDogc3RyaW5nLCB2YWx1ZTogYW55KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fY29uZmlnLnBhcnRzW3BhcnRdID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5zZW5kQ29uZmlnRXZlbnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNlbmRDb25maWdFdmVudCgpIHtcclxuICAgICAgICB0aGlzLl9yb290U2NvcGUuJGVtaXQoQXV4UGFuZWxDaGFuZ2VkRXZlbnQsIHRoaXMuX2NvbmZpZyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIEF1eFBhbmVsUHJvdmlkZXIgaW1wbGVtZW50cyBJQXV4UGFuZWxQcm92aWRlciB7XHJcbiAgICBwcml2YXRlIF9jb25maWc6IEF1eFBhbmVsQ29uZmlnID0ge1xyXG4gICAgICAgIHBhcnRzOiB7fSxcclxuICAgICAgICBjbGFzc2VzOiBbXSxcclxuICAgICAgICB0eXBlOiAnc3RpY2t5JyxcclxuICAgICAgICBzdGF0ZTogbnVsbFxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIF9zZXJ2aWNlOiBBdXhQYW5lbFNlcnZpY2U7XHJcblxyXG4gICAgcHVibGljIGdldCBjb25maWcoKTogQXV4UGFuZWxDb25maWcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb25maWc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBjb25maWcodmFsdWU6IEF1eFBhbmVsQ29uZmlnKSB7XHJcbiAgICAgICAgdGhpcy5fY29uZmlnID0gdmFsdWUgfHwgbmV3IEF1eFBhbmVsQ29uZmlnKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBwYXJ0cygpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb25maWcucGFydHM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBwYXJ0cyh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgdGhpcy5fY29uZmlnLnBhcnRzID0gdmFsdWUgfHwge307XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB0eXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbmZpZy50eXBlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgdHlwZSh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5fY29uZmlnLnR5cGUgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGNsYXNzZXMoKTogc3RyaW5nW10ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb25maWcuY2xhc3NlcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IGNsYXNzZXModmFsdWU6IHN0cmluZ1tdKSB7XHJcbiAgICAgICAgdGhpcy5fY29uZmlnLmNsYXNzZXMgPSB2YWx1ZSB8fCBbXTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQ2xhc3MoLi4uY2xhc3Nlczogc3RyaW5nW10pOiB2b2lkIHtcclxuICAgICAgICBfLmVhY2goY2xhc3NlcywgKGMpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fY29uZmlnLmNsYXNzZXMucHVzaChjKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlQ2xhc3MoLi4uY2xhc3Nlczogc3RyaW5nW10pOiB2b2lkIHtcclxuICAgICAgICBfLmVhY2goY2xhc3NlcywgKGMpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fY29uZmlnLmNsYXNzZXMgPSBfLnJlamVjdCh0aGlzLl9jb25maWcuY2xhc3NlcywgKGNjKSA9PiBjYyA9PSBjKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuIFxyXG4gICAgcHVibGljIHBhcnQocGFydDogc3RyaW5nLCB2YWx1ZTogYW55KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fY29uZmlnLnBhcnRzW3BhcnRdID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9wZW4oKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fc2VydmljZS5vcGVuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsb3NlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3NlcnZpY2UuY2xvc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdG9nZ2xlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3NlcnZpY2UudG9nZ2xlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljICRnZXQoJHJvb3RTY29wZTogbmcuSVJvb3RTY29wZVNlcnZpY2UsICRtZFNpZGVuYXY6IG5nLm1hdGVyaWFsLklTaWRlbmF2U2VydmljZSkge1xyXG4gICAgICAgIFwibmdJbmplY3RcIjtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3NlcnZpY2UgPT0gbnVsbClcclxuICAgICAgICAgICAgdGhpcy5fc2VydmljZSA9IG5ldyBBdXhQYW5lbFNlcnZpY2UodGhpcy5fY29uZmlnLCAkcm9vdFNjb3BlLCAkbWRTaWRlbmF2KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlcnZpY2U7XHJcbiAgICB9ICAgICBcclxufVxyXG5cclxuZnVuY3Rpb24gaG9va0F1eFBhbmVsRXZlbnRzKCRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlLCBwaXBBdXhQYW5lbDogSUF1eFBhbmVsU2VydmljZSkge1xyXG4gICAgJHJvb3RTY29wZS4kb24oT3BlbkF1eFBhbmVsRXZlbnQsICgpID0+IHsgcGlwQXV4UGFuZWwub3BlbigpOyB9KTtcclxuICAgICRyb290U2NvcGUuJG9uKENsb3NlQXV4UGFuZWxFdmVudCwgKCkgPT4geyBwaXBBdXhQYW5lbC5jbG9zZSgpOyB9KTtcclxufVxyXG5cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgncGlwQXV4UGFuZWwnKVxyXG4gICAgLnByb3ZpZGVyKCdwaXBBdXhQYW5lbCcsIEF1eFBhbmVsUHJvdmlkZXIpXHJcbiAgICAucnVuKGhvb2tBdXhQYW5lbEV2ZW50cyk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdwaXBBdXhQYW5lbCcsIFsnbmdNYXRlcmlhbCddKTtcclxuXHJcbmltcG9ydCAnLi9BdXhQYW5lbFNlcnZpY2UnO1xyXG5pbXBvcnQgJy4vQXV4UGFuZWxQYXJ0RGlyZWN0aXZlJztcclxuaW1wb3J0ICcuL0F1eFBhbmVsRGlyZWN0aXZlJztcclxuXHJcbmV4cG9ydCAqIGZyb20gJy4vQXV4UGFuZWxTZXJ2aWNlJzsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncGlwTGF5b3V0JywgWyd3dS5tYXNvbnJ5JywgJ3BpcE1lZGlhJywgJ3BpcEF1eFBhbmVsJ10pO1xyXG5cclxuaW1wb3J0ICcuL21lZGlhL2luZGV4JztcclxuXHJcbmltcG9ydCAnLi9sYXlvdXRzL01haW5EaXJlY3RpdmUnO1xyXG5pbXBvcnQgJy4vbGF5b3V0cy9DYXJkRGlyZWN0aXZlJztcclxuaW1wb3J0ICcuL2xheW91dHMvRGlhbG9nRGlyZWN0aXZlJztcclxuaW1wb3J0ICcuL2xheW91dHMvRG9jdW1lbnREaXJlY3RpdmUnO1xyXG5pbXBvcnQgJy4vbGF5b3V0cy9TaW1wbGVEaXJlY3RpdmUnO1xyXG5pbXBvcnQgJy4vbGF5b3V0cy9UaWxlc0RpcmVjdGl2ZSc7XHJcbmltcG9ydCAnLi9hdXhwYW5lbC9pbmRleCc7XHJcblxyXG5leHBvcnQgKiBmcm9tICcuL21lZGlhL2luZGV4JztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0IHsgTWFpblJlc2l6ZWRFdmVudCwgTGF5b3V0UmVzaXplZEV2ZW50LCBNYWluQnJlYWtwb2ludFN0YXR1c2VzIH0gZnJvbSAnLi4vbWVkaWEvTWVkaWFTZXJ2aWNlJztcclxuXHJcbi8vIEF2b2lkIGRlZmF1bHQgZXhwb3J0XHJcbigoKSA9PiB7XHJcblxyXG5pbnRlcmZhY2UgSUNhcmREaXJlY3RpdmVBdHRyaWJ1dGVzIGV4dGVuZHMgbmcuSUF0dHJpYnV0ZXMge1xyXG4gICAgbWluV2lkdGg6IHN0cmluZyB8IG51bWJlcjtcclxuICAgIG1pbkhlaWdodDogc3RyaW5nIHwgbnVtYmVyO1xyXG4gICAgd2lkdGg6IHN0cmluZyB8IG51bWJlcjtcclxuICAgIGhlaWdodDogc3RyaW5nIHwgbnVtYmVyO1xyXG59XHJcblxyXG5jbGFzcyBDYXJkRGlyZWN0aXZlTGluayB7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgJHJvb3RTY29wZTogbmcuSVJvb3RTY29wZVNlcnZpY2UsIFxyXG4gICAgICAgIHByaXZhdGUgJGVsZW1lbnQ6IEpRdWVyeSwgXHJcbiAgICAgICAgcHJpdmF0ZSAkYXR0cnM6IElDYXJkRGlyZWN0aXZlQXR0cmlidXRlc1xyXG4gICAgKSB7XHJcblxyXG4gICAgICAgIC8vIEFkZCBjbGFzcyB0byB0aGUgZWxlbWVudFxyXG4gICAgICAgICRlbGVtZW50LmFkZENsYXNzKCdwaXAtY2FyZCcpO1xyXG5cclxuICAgICAgICBsZXQgbGlzdGVuZXIgPSAoKSA9PiB7IHRoaXMucmVzaXplKCk7IH1cclxuXHJcbiAgICAgICAgLy8gUmVzaXplIGV2ZXJ5IHRpbWUgd2luZG93IGlzIHJlc2l6ZWRcclxuICAgICAgICAkcm9vdFNjb3BlLiRvbihNYWluUmVzaXplZEV2ZW50LCBsaXN0ZW5lcik7XHJcblxyXG4gICAgICAgIC8vIFJlc2l6ZSByaWdodCBhd2F5IHRvIGF2b2lkIGZsaWNraW5nXHJcbiAgICAgICAgdGhpcy5yZXNpemUoKTtcclxuXHJcbiAgICAgICAgLy8gUmVzaXplIHRoZSBlbGVtZW50IHJpZ2h0IGF3YXlcclxuICAgICAgICBzZXRUaW1lb3V0KGxpc3RlbmVyLCAxMDApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVzaXplKCkge1xyXG4gICAgICAgIGNvbnN0XHJcbiAgICAgICAgICAgICRtYWluQm9keSA9ICQoJy5waXAtbWFpbi1ib2R5JyksXHJcbiAgICAgICAgICAgIGNhcmRDb250YWluZXIgPSAkKCcucGlwLWNhcmQtY29udGFpbmVyJyksXHJcbiAgICAgICAgICAgIHdpbmRvd1dpZHRoID0gJCgncGlwLW1haW4nKS53aWR0aCgpO1xyXG4gICAgICAgIGxldFxyXG4gICAgICAgICAgICBtYXhXaWR0aCA9ICRtYWluQm9keS53aWR0aCgpLFxyXG4gICAgICAgICAgICBtYXhIZWlnaHQgPSAkbWFpbkJvZHkuaGVpZ2h0KCksXHJcbiAgICAgICAgICAgIG1pbldpZHRoID0gdGhpcy4kYXR0cnMubWluV2lkdGggPyBNYXRoLmZsb29yKE51bWJlcih0aGlzLiRhdHRycy5taW5XaWR0aCkpIDogbnVsbCxcclxuICAgICAgICAgICAgbWluSGVpZ2h0ID0gdGhpcy4kYXR0cnMubWluSGVpZ2h0ID8gTWF0aC5mbG9vcihOdW1iZXIodGhpcy4kYXR0cnMubWluSGVpZ2h0KSkgOiBudWxsLFxyXG4gICAgICAgICAgICB3aWR0aCA9IHRoaXMuJGF0dHJzLndpZHRoID8gTWF0aC5mbG9vcihOdW1iZXIodGhpcy4kYXR0cnMud2lkdGgpKSA6IG51bGwsXHJcbiAgICAgICAgICAgIGhlaWdodCA9IHRoaXMuJGF0dHJzLmhlaWdodCA/IE1hdGguZmxvb3IoTnVtYmVyKHRoaXMuJGF0dHJzLmhlaWdodCkpIDogbnVsbCxcclxuICAgICAgICAgICAgbGVmdCwgdG9wO1xyXG5cclxuICAgICAgICAvLyBGdWxsLXNjcmVlbiBvbiBwaG9uZVxyXG4gICAgICAgIGlmIChNYWluQnJlYWtwb2ludFN0YXR1c2VzLnhzKSB7XHJcbiAgICAgICAgICAgIG1pbldpZHRoID0gbnVsbDtcclxuICAgICAgICAgICAgbWluSGVpZ2h0ID0gbnVsbDtcclxuICAgICAgICAgICAgd2lkdGggPSBudWxsO1xyXG4gICAgICAgICAgICBoZWlnaHQgPSBudWxsO1xyXG4gICAgICAgICAgICBtYXhXaWR0aCA9IG51bGw7XHJcbiAgICAgICAgICAgIG1heEhlaWdodCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIENhcmQgdmlldyB3aXRoIGFkanVzdGFibGUgbWFyZ2lucyBvbiB0YWJsZXQgYW5kIGRlc2t0b3BcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gU2V0IG1hcmdpbiBhbmQgbWF4aW11bSBkaW1lbnNpb25zXHJcbiAgICAgICAgICAgIGNvbnN0IHNwYWNlID0gTWFpbkJyZWFrcG9pbnRTdGF0dXNlc1snZ3QtbWQnXSA/IDI0IDogMTY7XHJcbiAgICAgICAgICAgIG1heFdpZHRoIC09IHNwYWNlICogMjtcclxuICAgICAgICAgICAgbWF4SGVpZ2h0IC09IHNwYWNlICogMjtcclxuXHJcbiAgICAgICAgICAgIC8vIFNldCBtaW5pbXVtIGRpbWVuc2lvbnNcclxuICAgICAgICAgICAgbWluV2lkdGggPSBtaW5XaWR0aCA/IE1hdGgubWluKG1pbldpZHRoLCBtYXhXaWR0aCkgOiBudWxsO1xyXG4gICAgICAgICAgICBtaW5IZWlnaHQgPSBtaW5IZWlnaHQgPyBNYXRoLm1pbihtaW5IZWlnaHQsIG1heEhlaWdodCkgOiBudWxsO1xyXG5cclxuICAgICAgICAgICAgLy8gU2V0IHJlZ3VsYXIgZGltZW5zaW9uc1xyXG4gICAgICAgICAgICB3aWR0aCA9IHdpZHRoID8gTWF0aC5taW4od2lkdGgsIG1heFdpZHRoKSA6IG51bGw7XHJcbiAgICAgICAgICAgIGhlaWdodCA9IGhlaWdodCA/IE1hdGgubWluKGhlaWdodCwgbWF4SGVpZ2h0KSA6IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBTZXQgZGltZW5zaW9uc1xyXG4gICAgICAgIHRoaXMuJGVsZW1lbnQuY3NzKCdtYXgtd2lkdGgnLCBtYXhXaWR0aCA/IG1heFdpZHRoICsgJ3B4JyA6ICcnKTtcclxuICAgICAgICB0aGlzLiRlbGVtZW50LmNzcygnbWluLXdpZHRoJywgbWluV2lkdGggPyBtaW5XaWR0aCArICdweCcgOiAnJyk7XHJcbiAgICAgICAgdGhpcy4kZWxlbWVudC5jc3MoJ3dpZHRoJywgd2lkdGggPyB3aWR0aCArICdweCcgOiAnJyk7XHJcbiAgICAgICAgdGhpcy4kZWxlbWVudC5jc3MoJ2hlaWdodCcsIGhlaWdodCA/IGhlaWdodCArICdweCcgOiAnJyk7XHJcblxyXG4gICAgICAgIGlmICghY2FyZENvbnRhaW5lci5oYXNDbGFzcygncGlwLW91dGVyLXNjcm9sbCcpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQuY3NzKCdtYXgtaGVpZ2h0JywgbWF4SGVpZ2h0ID8gbWF4SGVpZ2h0ICsgJ3B4JyA6ICcnKTtcclxuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5jc3MoJ21pbi1oZWlnaHQnLCBtaW5IZWlnaHQgPyBtaW5IZWlnaHQgKyAncHgnIDogJycpO1xyXG4gICAgICAgICAgICBjb25zdFxyXG4gICAgICAgICAgICAgICAgJGhlYWRlciA9IHRoaXMuJGVsZW1lbnQuZmluZCgnLnBpcC1oZWFkZXI6dmlzaWJsZScpLFxyXG4gICAgICAgICAgICAgICAgJGZvb3RlciA9IHRoaXMuJGVsZW1lbnQuZmluZCgnLnBpcC1mb290ZXI6dmlzaWJsZScpLFxyXG4gICAgICAgICAgICAgICAgJGJvZHkgPSB0aGlzLiRlbGVtZW50LmZpbmQoJy5waXAtYm9keScpO1xyXG4gICAgICAgICAgICBsZXQgbWF4Qm9keUhlaWdodCA9IG1heEhlaWdodCB8fCAkbWFpbkJvZHkuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoJGhlYWRlci5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAgbWF4Qm9keUhlaWdodCAtPSAkaGVhZGVyLm91dGVySGVpZ2h0KHRydWUpO1xyXG4gICAgICAgICAgICBpZiAoJGZvb3Rlci5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAgbWF4Qm9keUhlaWdodCAtPSAkZm9vdGVyLm91dGVySGVpZ2h0KHRydWUpO1xyXG5cclxuICAgICAgICAgICAgJGJvZHkuY3NzKCdtYXgtaGVpZ2h0JywgbWF4Qm9keUhlaWdodCArICdweCcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNhcmRDb250YWluZXIuYWRkQ2xhc3MoJ3BpcC1zY3JvbGwnKTtcclxuICAgICAgICAgICAgaWYgKE1haW5CcmVha3BvaW50U3RhdHVzZXMueHMpIHtcclxuICAgICAgICAgICAgICAgIGxlZnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgdG9wID0gMDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxlZnQgPSBjYXJkQ29udGFpbmVyLndpZHRoKCkgLyAyIC0gdGhpcy4kZWxlbWVudC53aWR0aCgpIC8gMiAtIDE2O1xyXG4gICAgICAgICAgICAgICAgdG9wID0gTWF0aC5tYXgoY2FyZENvbnRhaW5lci5oZWlnaHQoKSAvIDIgLSB0aGlzLiRlbGVtZW50LmhlaWdodCgpIC8gMiAtIDE2LCAwKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5jc3MoJ2xlZnQnLCBsZWZ0KTtcclxuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5jc3MoJ3RvcCcsIHRvcCk7XHJcblxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgdGhpcy4kZWxlbWVudC5jc3MoJ2Rpc3BsYXknLCAnZmxleCcpOyB9LCAxMDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gTm90aWZ5IGNoaWxkIGNvbnRyb2xzIHRoYXQgbGF5b3V0IHdhcyByZXNpemVkXHJcbiAgICAgICAgdGhpcy4kcm9vdFNjb3BlLiRlbWl0KCdwaXBMYXlvdXRSZXNpemVkJyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNhcmREaXJlY3RpdmUoJHJvb3RTY29wZTogbmcuSVJvb3RTY29wZVNlcnZpY2UpIHtcclxuICAgIFwibmdJbmplY3RcIjtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIGxpbms6ICgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMpID0+IHtcclxuICAgICAgICAgICAgbmV3IENhcmREaXJlY3RpdmVMaW5rKCRyb290U2NvcGUsICRlbGVtZW50LCAkYXR0cnMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ3BpcExheW91dCcpXHJcbiAgICAuZGlyZWN0aXZlKCdwaXBDYXJkJywgY2FyZERpcmVjdGl2ZSk7XHJcblxyXG59KSgpOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8vIEF2b2lkIGRlZmF1bHQgZXhwb3J0XHJcbigoKSA9PiB7XHJcblxyXG5mdW5jdGlvbiBkaWFsb2dEaXJlY3RpdmUoKTogbmcuSURpcmVjdGl2ZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIGxpbms6ICgkc2NvcGU6IG5nLklTY29wZSwgJGVsZW1lbnQ6IEpRdWVyeSwgJGF0dHJzOiBuZy5JQXR0cmlidXRlcykgPT4ge1xyXG4gICAgICAgICAgICAkZWxlbWVudC5hZGRDbGFzcygncGlwLWRpYWxvZycpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ3BpcExheW91dCcpXHJcbiAgICAuZGlyZWN0aXZlKCdwaXBEaWFsb2cnLCBkaWFsb2dEaXJlY3RpdmUpO1xyXG5cclxufSkoKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG4vLyBBdm9pZCBkZWZhdWx0IGV4cG9ydFxyXG4oKCkgPT4ge1xyXG5cclxuZnVuY3Rpb24gZG9jdW1lbnREaXJlY3RpdmUoKTogbmcuSURpcmVjdGl2ZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIGxpbms6ICgkc2NvcGU6IG5nLklTY29wZSwgJGVsZW1lbnQ6IEpRdWVyeSwgJGF0dHJzOiBuZy5JQXR0cmlidXRlcykgPT4ge1xyXG4gICAgICAgICAgICAkZWxlbWVudC5hZGRDbGFzcygncGlwLWRvY3VtZW50Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgncGlwTGF5b3V0JylcclxuICAgIC5kaXJlY3RpdmUoJ3BpcERvY3VtZW50JywgZG9jdW1lbnREaXJlY3RpdmUpO1xyXG5cclxufSkoKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgeyBhZGRSZXNpemVMaXN0ZW5lciwgcmVtb3ZlUmVzaXplTGlzdGVuZXIgfSBmcm9tICcuLi9tZWRpYS9SZXNpemVGdW5jdGlvbnMnO1xyXG5pbXBvcnQgeyBNYWluQnJlYWtwb2ludHMsIE1haW5CcmVha3BvaW50U3RhdHVzZXMsIE1haW5SZXNpemVkRXZlbnQgfSBmcm9tICcuLi9tZWRpYS9NZWRpYVNlcnZpY2UnOyBcclxuXHJcbi8vIEF2b2lkIGRlZmF1bHQgZXhwb3J0XHJcbigoKSA9PiB7XHJcblxyXG5pbnRlcmZhY2UgSU1haW5EaXJlY3RpdmVBdHRyaWJ1dGVzIGV4dGVuZHMgbmcuSUF0dHJpYnV0ZXMge1xyXG4gICAgcGlwQ29udGFpbmVyOiBzdHJpbmc7XHJcbn1cclxuXHJcbmNsYXNzIE1haW5EaXJlY3RpdmVDb250cm9sbGVyIGltcGxlbWVudHMgbmcuSUNvbnRyb2xsZXIge1xyXG4gICAgcHJpdmF0ZSBfY29udGFpbmVyOiBhbnk7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgJHNjb3BlOiBuZy5JU2NvcGUsIFxyXG4gICAgICAgIHByaXZhdGUgJGVsZW1lbnQ6IGFuZ3VsYXIuSVJvb3RFbGVtZW50U2VydmljZSwgXHJcbiAgICAgICAgcHJpdmF0ZSAkcm9vdFNjb3BlOiBuZy5JUm9vdFNjb3BlU2VydmljZSxcclxuICAgICAgICBwcml2YXRlICR0aW1lb3V0OiBuZy5JVGltZW91dFNlcnZpY2UsXHJcbiAgICAgICAgcHJpdmF0ZSAkYXR0cnM6IElNYWluRGlyZWN0aXZlQXR0cmlidXRlc1xyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5fY29udGFpbmVyID0gJGF0dHJzLnBpcENvbnRhaW5lciA/ICQoJGF0dHJzLnBpcENvbnRhaW5lcikgOiAkZWxlbWVudDtcclxuXHJcbiAgICAgICAgLy8gQWRkIENTUyBjbGFzc1xyXG4gICAgICAgICRlbGVtZW50LmFkZENsYXNzKCdwaXAtbWFpbicpO1xyXG5cclxuICAgICAgICAvLyBBZGQgcmVzaXplIGxpc3RlbmVyXHJcbiAgICAgICAgY29uc3QgbGlzdGVuZXIgPSAoKSA9PiB7IHRoaXMucmVzaXplKCk7IH07XHJcbiAgICAgICAgYWRkUmVzaXplTGlzdGVuZXIodGhpcy5fY29udGFpbmVyWzBdLCBsaXN0ZW5lcik7XHJcblxyXG4gICAgICAgIC8vIFVuYmluZCB3aGVuIHNjb3BlIGlzIHJlbW92ZWRcclxuICAgICAgICAkc2NvcGUuJG9uKCckZGVzdHJveScsICgpID0+IHtcclxuICAgICAgICAgICAgcmVtb3ZlUmVzaXplTGlzdGVuZXIodGhpcy5fY29udGFpbmVyWzBdLCBsaXN0ZW5lcik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIFBlcmZvcm0gaW5pdGlhbCBjYWxjdWxhdGlvbnNcclxuICAgICAgICB0aGlzLnVwZGF0ZUJyZWFrcG9pbnRTdGF0dXNlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlQnJlYWtwb2ludFN0YXR1c2VzKCkge1xyXG4gICAgICAgIGNvbnN0IHdpZHRoID0gdGhpcy5fY29udGFpbmVyLmlubmVyV2lkdGgoKTtcclxuICAgICAgICBjb25zdCBib2R5ID0gJCgnYm9keScpO1xyXG5cclxuICAgICAgICBNYWluQnJlYWtwb2ludFN0YXR1c2VzLnVwZGF0ZShNYWluQnJlYWtwb2ludHMsIHdpZHRoKTtcclxuXHJcbiAgICAgICAgJC5lYWNoKE1haW5CcmVha3BvaW50U3RhdHVzZXMsIChicmVha3BvaW50LCBzdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgaWYgKF8uaXNCb29sZWFuKHN0YXR1cykpIHtcclxuICAgICAgICAgICAgICAgIGJvZHlbc3RhdHVzID8gJ2FkZENsYXNzJzogJ3JlbW92ZUNsYXNzJ10oJ3BpcC0nICsgYnJlYWtwb2ludCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy4kdGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSByZXNpemUoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVCcmVha3BvaW50U3RhdHVzZXMoKTtcclxuICAgICAgICB0aGlzLiRyb290U2NvcGUuJGVtaXQoTWFpblJlc2l6ZWRFdmVudCwgTWFpbkJyZWFrcG9pbnRTdGF0dXNlcyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIE1haW5Cb2R5RGlyZWN0aXZlTGluayB7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoXHJcbiAgICAgICAgJHNjb3BlOiBuZy5JU2NvcGUsIFxyXG4gICAgICAgICRlbGVtZW50OiBhbmd1bGFyLklSb290RWxlbWVudFNlcnZpY2VcclxuICAgICkge1xyXG4gICAgICAgIC8vIEFkZCBDU1MgY2xhc3NcclxuICAgICAgICAkZWxlbWVudC5hZGRDbGFzcygncGlwLW1haW4tYm9keScpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBtYWluRGlyZWN0aXZlKCk6IG5nLklEaXJlY3RpdmUge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXN0cmljdDogJ0VBQycsXHJcbiAgICAgICAgY29udHJvbGxlcjogTWFpbkRpcmVjdGl2ZUNvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nIFxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBtYWluQm9keURpcmVjdGl2ZSgpOiBuZy5JRGlyZWN0aXZlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQUMnLFxyXG4gICAgICAgIGxpbms6IE1haW5Cb2R5RGlyZWN0aXZlTGlua1xyXG4gICAgfVxyXG59XHJcblxyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdwaXBMYXlvdXQnKVxyXG4gICAgLmRpcmVjdGl2ZSgncGlwTWFpbicsIG1haW5EaXJlY3RpdmUpXHJcbiAgICAuZGlyZWN0aXZlKCdwaXBNYWluQm9keScsIG1haW5Cb2R5RGlyZWN0aXZlKTtcclxuXHJcbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy8gQXZvaWQgZGVmYXVsdCBleHBvcnRcclxuKCgpID0+IHtcclxuXHJcbmZ1bmN0aW9uIHNpbXBsZURpcmVjdGl2ZSgpOiBuZy5JRGlyZWN0aXZlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgbGluazogKCRzY29wZTogbmcuSVNjb3BlLCAkZWxlbWVudDogSlF1ZXJ5LCAkYXR0cnM6IG5nLklBdHRyaWJ1dGVzKSA9PiB7XHJcbiAgICAgICAgICAgICRlbGVtZW50LmFkZENsYXNzKCdwaXAtc2ltcGxlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgncGlwTGF5b3V0JylcclxuICAgIC5kaXJlY3RpdmUoJ3BpcFNpbXBsZScsIHNpbXBsZURpcmVjdGl2ZSk7XHJcblxyXG59KSgpOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCB7IGFkZFJlc2l6ZUxpc3RlbmVyLCByZW1vdmVSZXNpemVMaXN0ZW5lciB9IGZyb20gJy4uL21lZGlhL1Jlc2l6ZUZ1bmN0aW9ucyc7XHJcbmltcG9ydCB7IE1haW5SZXNpemVkRXZlbnQsIExheW91dFJlc2l6ZWRFdmVudCwgTWFpbkJyZWFrcG9pbnRzLCBNYWluQnJlYWtwb2ludFN0YXR1c2VzIH0gZnJvbSAnLi4vbWVkaWEvTWVkaWFTZXJ2aWNlJztcclxuXHJcbmRlY2xhcmUgdmFyIE1hc29ucnk6IGFueTtcclxuXHJcbmludGVyZmFjZSBJVGlsZXNEaXJlY3RpdmVBdHRyaWJ1dGVzIGV4dGVuZHMgbmcuSUF0dHJpYnV0ZXMge1xyXG4gICAgY29sdW1uV2lkdGg6IHN0cmluZyB8IG51bWJlcjtcclxuICAgIHBpcEluZmluaXRlOiBzdHJpbmcgfCBib29sZWFuIHwgbnVtYmVyO1xyXG59XHJcblxyXG5jbGFzcyBUaWxlc09wdGlvbnMge1xyXG4gICAgZ3V0dGVyOiBudW1iZXI7XHJcbiAgICBpc0ZpdFdpZHRoOiBib29sZWFuO1xyXG4gICAgaXNSZXNpemVCb3VuZDogYm9vbGVhbjtcclxuICAgIHRyYW5zaXRpb25EdXJhdGlvbjogbnVtYmVyO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgSVRpbGVzQ29udHJvbGxlclNjb3BlIGV4dGVuZHMgbmcuSVNjb3BlIHtcclxuICAgIHRpbGVzT3B0aW9uczogVGlsZXNPcHRpb25zO1xyXG59XHJcblxyXG5jbGFzcyBUaWxlc0RpcmVjdGl2ZUxpbmsge1xyXG4gICAgcHJpdmF0ZSBfY29sdW1uV2lkdGg6IG51bWJlcjtcclxuICAgIHByaXZhdGUgX2NvbnRhaW5lcjogYW55O1xyXG4gICAgcHJpdmF0ZSBfcHJldkNvbnRhaW5lcldpZHRoOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9tYXNvbnJ5OiBhbnk7XHJcbiAgICBwcml2YXRlIF9zaXplcjogYW55O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgICAgICAkc2NvcGU6IG5nLklTY29wZSwgXHJcbiAgICAgICAgcHJpdmF0ZSAkZWxlbWVudDogSlF1ZXJ5LCBcclxuICAgICAgICBwcml2YXRlICRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlLCBcclxuICAgICAgICBwcml2YXRlICRhdHRyczogSVRpbGVzRGlyZWN0aXZlQXR0cmlidXRlc1xyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5fY29sdW1uV2lkdGggPSAkYXR0cnMuY29sdW1uV2lkdGggPyBNYXRoLmZsb29yKE51bWJlcigkYXR0cnMuY29sdW1uV2lkdGgpKSA6IDQ0MCxcclxuICAgICAgICB0aGlzLl9jb250YWluZXIgPSAkZWxlbWVudC5jaGlsZHJlbignLnBpcC10aWxlcy1jb250YWluZXInKSxcclxuICAgICAgICB0aGlzLl9wcmV2Q29udGFpbmVyV2lkdGggPSBudWxsLFxyXG4gICAgICAgIHRoaXMuX21hc29ucnkgPSBNYXNvbnJ5LmRhdGEodGhpcy5fY29udGFpbmVyWzBdKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBBZGQgY2xhc3MgdG8gdGhlIGVsZW1lbnRcclxuICAgICAgICAkZWxlbWVudC5hZGRDbGFzcygncGlwLXRpbGVzJyk7XHJcblxyXG4gICAgICAgIC8vIEFkZCByZXNpemUgbGlzdGVuZXJcclxuICAgICAgICBjb25zdCBsaXN0ZW5lciA9ICgpID0+IHsgdGhpcy5yZXNpemUoZmFsc2UpOyB9O1xyXG4gICAgICAgIGFkZFJlc2l6ZUxpc3RlbmVyKCRlbGVtZW50WzBdLCBsaXN0ZW5lcik7XHJcblxyXG4gICAgICAgIC8vIFVuYmluZCB3aGVuIHNjb3BlIGlzIHJlbW92ZWRcclxuICAgICAgICAkc2NvcGUuJG9uKCckZGVzdHJveScsICgpID0+IHtcclxuICAgICAgICAgICAgcmVtb3ZlUmVzaXplTGlzdGVuZXIoJGVsZW1lbnRbMF0sIGxpc3RlbmVyKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gSW5zZXJ0IHNpemVyXHJcbiAgICAgICAgdGhpcy5fc2l6ZXIgPSAkKCc8ZGl2IGNsYXNzPVwicGlwLXRpbGUtc2l6ZXJcIj48L2Rpdj4nKTtcclxuICAgICAgICB0aGlzLl9zaXplci5hcHBlbmRUbyh0aGlzLl9jb250YWluZXIpO1xyXG5cclxuICAgICAgICAvLyBSZXNpemUgZXZlcnkgdGltZSB3aW5kb3cgaXMgcmVzaXplZFxyXG4gICAgICAgICRyb290U2NvcGUuJG9uKE1haW5SZXNpemVkRXZlbnQsICgpID0+IHsgdGhpcy5yZXNpemUoZmFsc2UpOyB9KTtcclxuXHJcbiAgICAgICAgLy8gUmVzaXplIHRoZSBlbGVtZW50IHJpZ2h0IGF3YXlcclxuICAgICAgICB0aGlzLnJlc2l6ZSh0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlc2l6ZShmb3JjZTogYm9vbGVhbikge1xyXG4gICAgICAgIGxldCB3aWR0aCA9IHRoaXMuJGVsZW1lbnQucGFyZW50KCkud2lkdGgoKSxcclxuICAgICAgICAgICAgY29udGFpbmVyV2lkdGg7XHJcblxyXG4gICAgICAgIGlmIChNYWluQnJlYWtwb2ludFN0YXR1c2VzWydndC14cyddICYmICh3aWR0aCAtIDM2KSA+IHRoaXMuX2NvbHVtbldpZHRoKSB7XHJcbiAgICAgICAgICAgIHdpZHRoID0gd2lkdGggLSAyNCAqIDI7XHJcblxyXG4gICAgICAgICAgICBsZXQgY29sdW1ucyA9IE1hdGguZmxvb3Iod2lkdGggLyB0aGlzLl9jb2x1bW5XaWR0aCk7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lcldpZHRoID0gKHRoaXMuX2NvbHVtbldpZHRoICsgMTYpICogY29sdW1ucyAtIDE2O1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbnRhaW5lcldpZHRoID4gd2lkdGgpIHtcclxuICAgICAgICAgICAgICAgIGNvbHVtbnMtLTtcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lcldpZHRoID0gKHRoaXMuX2NvbHVtbldpZHRoICsgMTYpICogY29sdW1ucyAtIDE2O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY29sdW1ucyA8IDEpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lcldpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zaXplci5jc3MoJ3dpZHRoJywgY29udGFpbmVyV2lkdGggKyAncHgnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NpemVyLmNzcygnd2lkdGgnLCB0aGlzLl9jb2x1bW5XaWR0aCArICdweCcpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyArMTAgdG8gYXZvaWQgcHJlY2lzaW9uIHJlbGF0ZWQgZXJyb3JcclxuICAgICAgICAgICAgdGhpcy5fY29udGFpbmVyLmNzcygnd2lkdGgnLCAoY29udGFpbmVyV2lkdGggKyAxMCkgKyAncHgnKTtcclxuICAgICAgICAgICAgdGhpcy5fY29udGFpbmVyLnJlbW92ZUNsYXNzKCdwaXAtbW9iaWxlJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgd2lkdGggPSB3aWR0aCAtIDE2ICogMjtcclxuICAgICAgICAgICAgY29udGFpbmVyV2lkdGggPSB3aWR0aDtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3NpemVyLmNzcygnd2lkdGgnLCBjb250YWluZXJXaWR0aCArICdweCcpO1xyXG4gICAgICAgICAgICAvLyArMTAgdG8gYXZvaWQgcHJlY2lzaW9uIHJlbGF0ZWQgZXJyb3JcclxuICAgICAgICAgICAgdGhpcy5fY29udGFpbmVyLmNzcygnd2lkdGgnLCAoY29udGFpbmVyV2lkdGggKyAxMCkgKyAncHgnKTtcclxuICAgICAgICAgICAgdGhpcy5fY29udGFpbmVyLmFkZENsYXNzKCdwaXAtbW9iaWxlJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBNYW51YWxseSBjYWxsIGxheW91dCBvbiB0aWxlIGNvbnRhaW5lclxyXG4gICAgICAgIGlmICh0aGlzLl9wcmV2Q29udGFpbmVyV2lkdGggIT0gY29udGFpbmVyV2lkdGggfHwgZm9yY2UpIHtcclxuICAgICAgICAgICAgdGhpcy5fcHJldkNvbnRhaW5lcldpZHRoID0gY29udGFpbmVyV2lkdGg7XHJcbiAgICAgICAgICAgIHRoaXMuX21hc29ucnkubGF5b3V0KCk7XHJcblxyXG4gICAgICAgICAgICAvLyBOb3RpZnkgY2hpbGQgY29udHJvbHMgdGhhdCBsYXlvdXQgd2FzIHJlc2l6ZWRcclxuICAgICAgICAgICAgdGhpcy4kcm9vdFNjb3BlLiRlbWl0KExheW91dFJlc2l6ZWRFdmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB0aWxlc0RpcmVjdGl2ZSgpOiBuZy5JRGlyZWN0aXZlIHtcclxuICAgIFwibmdJbmplY3RcIjtcclxuXHJcbiAgICAvLyBDb252ZXJ0cyB2YWx1ZSBpbnRvIGJvb2xlYW5cclxuICAgIGZ1bmN0aW9uIGNvbnZlcnRUb0Jvb2xlYW4odmFsdWUpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGlmICghdmFsdWUpIHJldHVybiBmYWxzZTtcclxuICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICByZXR1cm4gdmFsdWUgPT0gJzEnIHx8IHZhbHVlID09ICd0cnVlJztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHNjb3BlOiBmYWxzZSxcclxuICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxyXG4gICAgICAgIHRlbXBsYXRlOlxyXG4gICAgICAgICAgICAoJGVsZW1lbnQ6IEpRdWVyeSwgJGF0dHJzOiBJVGlsZXNEaXJlY3RpdmVBdHRyaWJ1dGVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY29udmVydFRvQm9vbGVhbigkYXR0cnMucGlwSW5maW5pdGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFN0cmluZygpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsgJzxkaXYgbWFzb25yeSBjbGFzcz1cInBpcC10aWxlcy1jb250YWluZXJcIiBsb2FkLWltYWdlcz1cImZhbHNlXCIgcHJlc2VydmUtb3JkZXIgICdcclxuICAgICAgICAgICAgICAgICAgICAgICAgKyAnIG5nLXRyYW5zY2x1ZGUgY29sdW1uLXdpZHRoPVwiLnBpcC10aWxlLXNpemVyXCIgaXRlbS1zZWxlY3Rvcj1cIi5waXAtdGlsZVwiJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICArICcgbWFzb25yeS1vcHRpb25zPVwidGlsZXNPcHRpb25zXCIgIHBpcC1zY3JvbGwtY29udGFpbmVyPVwiXFwnLnBpcC10aWxlc1xcJ1wiJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICArICcgcGlwLWluZmluaXRlLXNjcm9sbD1cInJlYWRTY3JvbGwoKVwiID4nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsgJzwvZGl2Pic7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTdHJpbmcoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICArICc8ZGl2IG1hc29ucnkgY2xhc3M9XCJwaXAtdGlsZXMtY29udGFpbmVyXCIgbG9hZC1pbWFnZXM9XCJmYWxzZVwiIHByZXNlcnZlLW9yZGVyICAnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsgJyBuZy10cmFuc2NsdWRlIGNvbHVtbi13aWR0aD1cIi5waXAtdGlsZS1zaXplclwiIGl0ZW0tc2VsZWN0b3I9XCIucGlwLXRpbGVcIidcclxuICAgICAgICAgICAgICAgICAgICAgICAgKyAnIG1hc29ucnktb3B0aW9ucz1cInRpbGVzT3B0aW9uc1wiPidcclxuICAgICAgICAgICAgICAgICAgICAgICAgKyAnPC9kaXY+JztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICBjb250cm9sbGVyOiAoJHNjb3BlOiBJVGlsZXNDb250cm9sbGVyU2NvcGUpID0+IHtcclxuICAgICAgICAgICAgJHNjb3BlLnRpbGVzT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIGd1dHRlcjogOCwvLzE2XHJcbiAgICAgICAgICAgICAgICBpc0ZpdFdpZHRoOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGlzUmVzaXplQm91bmQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbkR1cmF0aW9uOiAwIC8vICcwLjJzJ1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbGluazogVGlsZXNEaXJlY3RpdmVMaW5rXHJcbiAgICB9O1xyXG59XHJcblxyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdwaXBMYXlvdXQnKVxyXG4gICAgLmRpcmVjdGl2ZSgncGlwVGlsZXMnLCB0aWxlc0RpcmVjdGl2ZSk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmV4cG9ydCBjbGFzcyBNZWRpYUJyZWFrcG9pbnRzIHtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgICAgICB4czogbnVtYmVyLCBzbTogbnVtYmVyLCBtZDogbnVtYmVyLCBsZzogbnVtYmVyXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLnhzID0geHM7XHJcbiAgICAgICAgdGhpcy5zbSA9IHNtO1xyXG4gICAgICAgIHRoaXMubWQgPSBtZDtcclxuICAgICAgICB0aGlzLmxnID0gbGc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHhzOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgc206IG51bWJlcjtcclxuICAgIHB1YmxpYyBtZDogbnVtYmVyO1xyXG4gICAgcHVibGljIGxnOiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBNZWRpYUJyZWFrcG9pbnRTdGF0dXNlcyB7XHJcbiAgICBwdWJsaWMgd2lkdGg6IG51bWJlcjtcclxuICAgIHB1YmxpYyAneHMnOiBib29sZWFuO1xyXG4gICAgcHVibGljICdndC14cyc6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgJ3NtJzogYm9vbGVhbjtcclxuICAgIHB1YmxpYyAnZ3Qtc20nOiBib29sZWFuO1xyXG4gICAgcHVibGljICdtZCc6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgJ2d0LW1kJzogYm9vbGVhbjtcclxuICAgIHB1YmxpYyAnbGcnOiBib29sZWFuO1xyXG4gICAgcHVibGljICdndC1sZyc6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgJ3hsJzogYm9vbGVhbjtcclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKGJyZWFrcG9pbnRzOiBNZWRpYUJyZWFrcG9pbnRzLCB3aWR0aDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKGJyZWFrcG9pbnRzID09IG51bGwpIHJldHVybjtcclxuXHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHRoaXNbJ3hzJ10gPSB3aWR0aCA8PSBicmVha3BvaW50cy54cztcclxuICAgICAgICB0aGlzWydndC14cyddID0gd2lkdGggPiBicmVha3BvaW50cy54cztcclxuICAgICAgICB0aGlzWydzbSddID0gd2lkdGggPiBicmVha3BvaW50cy54cyAmJiB3aWR0aCA8PSBicmVha3BvaW50cy5zbTtcclxuICAgICAgICB0aGlzWydndC1zbSddID0gd2lkdGggPiBicmVha3BvaW50cy5zbTtcclxuICAgICAgICB0aGlzWydtZCddID0gd2lkdGggPiBicmVha3BvaW50cy5zbSAmJiB3aWR0aCA8PSBicmVha3BvaW50cy5tZDtcclxuICAgICAgICB0aGlzWydndC1tZCddID0gd2lkdGggPiBicmVha3BvaW50cy5tZDtcclxuICAgICAgICB0aGlzWydsZyddID0gd2lkdGggPiBicmVha3BvaW50cy5tZCAmJiB3aWR0aCA8PSBicmVha3BvaW50cy5sZztcclxuICAgICAgICB0aGlzWydndC1sZyddID0gd2lkdGggPiBicmVha3BvaW50cy5sZztcclxuICAgICAgICB0aGlzWyd4bCddID0gdGhpc1snZ3QtbGcnXTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGxldCBNYWluUmVzaXplZEV2ZW50OiBzdHJpbmcgPSAncGlwTWFpblJlc2l6ZWQnO1xyXG5leHBvcnQgbGV0IExheW91dFJlc2l6ZWRFdmVudDogc3RyaW5nID0gJ3BpcExheW91dFJlc2l6ZWQnO1xyXG5cclxuZXhwb3J0IGxldCBNYWluQnJlYWtwb2ludHM6IE1lZGlhQnJlYWtwb2ludHMgPSBuZXcgTWVkaWFCcmVha3BvaW50cyg2MzksIDcxNiwgMTAyNCwgMTQzOSk7XHJcbmV4cG9ydCBsZXQgTWFpbkJyZWFrcG9pbnRTdGF0dXNlczogTWVkaWFCcmVha3BvaW50U3RhdHVzZXMgPSBuZXcgTWVkaWFCcmVha3BvaW50U3RhdHVzZXMoKTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSU1lZGlhU2VydmljZSB7XHJcbiAgICAoYnJlYWtwb2ludDogc3RyaW5nKTogYm9vbGVhbjtcclxuICAgIGJyZWFrcG9pbnRzOiBNZWRpYUJyZWFrcG9pbnRzO1xyXG4gICAgd2lkdGg6IG51bWJlcjtcclxufSBcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSU1lZGlhUHJvdmlkZXIgZXh0ZW5kcyBuZy5JU2VydmljZVByb3ZpZGVyIHtcclxuICAgIGJyZWFrcG9pbnRzOiBNZWRpYUJyZWFrcG9pbnRzO1xyXG59XHJcblxyXG5jbGFzcyBNZWRpYVByb3ZpZGVyIGltcGxlbWVudHMgSU1lZGlhUHJvdmlkZXIge1xyXG4gICAgcHVibGljIGdldCBicmVha3BvaW50cygpOiBNZWRpYUJyZWFrcG9pbnRzIHtcclxuICAgICAgICByZXR1cm4gTWFpbkJyZWFrcG9pbnRzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgYnJlYWtwb2ludHModmFsdWU6IE1lZGlhQnJlYWtwb2ludHMpIHtcclxuICAgICAgICBNYWluQnJlYWtwb2ludHMgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgJGdldCgpIHtcclxuICAgICAgICBjb25zdCBzZXJ2aWNlID0gZnVuY3Rpb24oc2l6ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWFpbkJyZWFrcG9pbnRTdGF0dXNlc1tzaXplXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzZXJ2aWNlLCAnYnJlYWtwb2ludHMnLCB7XHJcbiAgICAgICAgICAgIGdldDogKCkgPT4geyByZXR1cm4gTWFpbkJyZWFrcG9pbnRzOyB9LFxyXG4gICAgICAgICAgICBzZXQ6ICh2YWx1ZSkgPT4geyBcclxuICAgICAgICAgICAgICAgIE1haW5CcmVha3BvaW50cyA9IHZhbHVlIHx8IG5ldyBNZWRpYUJyZWFrcG9pbnRzKDYzOSwgNzE2LCAxMDI0LCAxNDM5KTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgTWFpbkJyZWFrcG9pbnRTdGF0dXNlcy51cGRhdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgTWFpbkJyZWFrcG9pbnRzLCBcclxuICAgICAgICAgICAgICAgICAgICBNYWluQnJlYWtwb2ludFN0YXR1c2VzLndpZHRoXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzZXJ2aWNlLCAnd2lkdGgnLCB7XHJcbiAgICAgICAgICAgIGdldDogKCkgPT4geyBcclxuICAgICAgICAgICAgICAgIHJldHVybiBNYWluQnJlYWtwb2ludFN0YXR1c2VzLndpZHRoOyBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gc2VydmljZTsgXHJcbiAgICB9XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ3BpcE1lZGlhJylcclxuICAgIC5wcm92aWRlcigncGlwTWVkaWEnLCBNZWRpYVByb3ZpZGVyKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubGV0IGF0dGFjaEV2ZW50ID0gKDxhbnk+ZG9jdW1lbnQpLmF0dGFjaEV2ZW50O1xyXG5sZXQgaXNJRSA9IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1RyaWRlbnQvKTtcclxuXHJcbmZ1bmN0aW9uIHJlcXVlc3RGcmFtZShjYWxsYmFjayk6IGFueSB7XHJcbiAgICBsZXQgZnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIFxyXG4gICAgICAgIHx8ICg8YW55PndpbmRvdykubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIFxyXG4gICAgICAgIHx8ICg8YW55PndpbmRvdykud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIFxyXG4gICAgICAgIHx8IGZ1bmN0aW9uKGNhbGxiYWNrKSB7IFxyXG4gICAgICAgICAgICByZXR1cm4gd2luZG93LnNldFRpbWVvdXQoY2FsbGJhY2ssIDIwKTsgICAgIFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGZyYW1lKGNhbGxiYWNrKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2FuY2VsRnJhbWUoKTogYW55IHtcclxuICAgIGxldCBjYW5jZWwgPSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgXHJcbiAgICAgICAgfHwgKDxhbnk+d2luZG93KS5tb3pDYW5jZWxBbmltYXRpb25GcmFtZSBcclxuICAgICAgICB8fCAoPGFueT53aW5kb3cpLndlYmtpdENhbmNlbEFuaW1hdGlvbkZyYW1lIFxyXG4gICAgICAgIHx8IHdpbmRvdy5jbGVhclRpbWVvdXQ7XHJcblxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGlkKSB7IFxyXG4gICAgICAgIHJldHVybiBjYW5jZWwoaWQpOyBcclxuICAgIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlc2l6ZUxpc3RlbmVyKGV2ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgIGNvbnN0IHdpbiA9IGV2ZW50LnRhcmdldCB8fCBldmVudC5zcmNFbGVtZW50O1xyXG4gICAgaWYgKHdpbi5fX3Jlc2l6ZVJBRl9fKSBjYW5jZWxGcmFtZSgvKndpbi5fX3Jlc2l6ZVJBRl9fKi8pO1xyXG4gICAgd2luLl9fcmVzaXplUkFGX18gPSByZXF1ZXN0RnJhbWUoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgdHJpZ2dlciA9IHdpbi5fX3Jlc2l6ZVRyaWdnZXJfXztcclxuICAgICAgICB0cmlnZ2VyLl9fcmVzaXplTGlzdGVuZXJzX18uZm9yRWFjaChmdW5jdGlvbihmbil7XHJcbiAgICAgICAgICAgIGZuLmNhbGwodHJpZ2dlciwgZXZlbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRMaXN0ZW5lcihldmVudDogYW55KTogdm9pZCB7XHJcbiAgICB0aGlzLmNvbnRlbnREb2N1bWVudC5kZWZhdWx0Vmlldy5fX3Jlc2l6ZVRyaWdnZXJfXyA9IHRoaXMuX19yZXNpemVFbGVtZW50X187XHJcbiAgICB0aGlzLmNvbnRlbnREb2N1bWVudC5kZWZhdWx0Vmlldy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemVMaXN0ZW5lcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhZGRSZXNpemVMaXN0ZW5lcihlbGVtZW50LCBsaXN0ZW5lcik6IHZvaWQge1xyXG4gICAgaWYgKCFlbGVtZW50Ll9fcmVzaXplTGlzdGVuZXJzX18pIHtcclxuICAgICAgICBlbGVtZW50Ll9fcmVzaXplTGlzdGVuZXJzX18gPSBbXTtcclxuICAgICAgICBpZiAoYXR0YWNoRXZlbnQpIHtcclxuICAgICAgICAgICAgZWxlbWVudC5fX3Jlc2l6ZVRyaWdnZXJfXyA9IGVsZW1lbnQ7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuYXR0YWNoRXZlbnQoJ29ucmVzaXplJywgcmVzaXplTGlzdGVuZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkucG9zaXRpb24gPT0gJ3N0YXRpYycpIGVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xyXG4gICAgICAgICAgICBjb25zdCBvYmo6IGFueSA9IGVsZW1lbnQuX19yZXNpemVUcmlnZ2VyX18gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvYmplY3QnKTtcclxuICAgICAgICAgICAgb2JqLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnZGlzcGxheTogYmxvY2s7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgdG9wOiAwOyBsZWZ0OiAwOyBoZWlnaHQ6IDEwMCU7IHdpZHRoOiAxMDAlOyBvdmVyZmxvdzogaGlkZGVuOyBwb2ludGVyLWV2ZW50czogbm9uZTsgei1pbmRleDogLTE7Jyk7XHJcbiAgICAgICAgICAgIG9iai5fX3Jlc2l6ZUVsZW1lbnRfXyA9IGVsZW1lbnQ7XHJcbiAgICAgICAgICAgIG9iai5vbmxvYWQgPSBsb2FkTGlzdGVuZXI7XHJcbiAgICAgICAgICAgIG9iai50eXBlID0gJ3RleHQvaHRtbCc7XHJcbiAgICAgICAgICAgIGlmIChpc0lFKSBlbGVtZW50LmFwcGVuZENoaWxkKG9iaik7XHJcbiAgICAgICAgICAgIG9iai5kYXRhID0gJ2Fib3V0OmJsYW5rJztcclxuICAgICAgICAgICAgaWYgKCFpc0lFKSBlbGVtZW50LmFwcGVuZENoaWxkKG9iaik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGVsZW1lbnQuX19yZXNpemVMaXN0ZW5lcnNfXy5wdXNoKGxpc3RlbmVyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVJlc2l6ZUxpc3RlbmVyKGVsZW1lbnQsIGxpc3RlbmVyKTogdm9pZCB7XHJcbiAgICBpZiAobGlzdGVuZXIpIGVsZW1lbnQuX19yZXNpemVMaXN0ZW5lcnNfXy5zcGxpY2UoZWxlbWVudC5fX3Jlc2l6ZUxpc3RlbmVyc19fLmluZGV4T2YobGlzdGVuZXIpLCAxKTtcclxuICAgIGlmICghZWxlbWVudC5fX3Jlc2l6ZUxpc3RlbmVyc19fLmxlbmd0aCkge1xyXG4gICAgICAgIGlmIChhdHRhY2hFdmVudCkgZWxlbWVudC5kZXRhY2hFdmVudCgnb25yZXNpemUnLCByZXNpemVMaXN0ZW5lcik7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuX19yZXNpemVUcmlnZ2VyX18uY29udGVudERvY3VtZW50LmRlZmF1bHRWaWV3LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZUxpc3RlbmVyKTtcclxuICAgICAgICAgICAgZWxlbWVudC5fX3Jlc2l6ZVRyaWdnZXJfXyA9ICFlbGVtZW50LnJlbW92ZUNoaWxkKGVsZW1lbnQuX19yZXNpemVUcmlnZ2VyX18pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncGlwTWVkaWEnLCBbXSk7XHJcblxyXG5pbXBvcnQgJy4vTWVkaWFTZXJ2aWNlJztcclxuaW1wb3J0ICcuL1Jlc2l6ZUZ1bmN0aW9ucyc7XHJcblxyXG5leHBvcnQgKiBmcm9tICcuL01lZGlhU2VydmljZSc7XHJcbmV4cG9ydCAqIGZyb20gJy4vUmVzaXplRnVuY3Rpb25zJzsiXX0=