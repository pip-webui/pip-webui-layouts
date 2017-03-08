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
tilesDirective.$inject = ['$rootScope'];
var ResizeFunctions_1 = require("../media/ResizeFunctions");
var MediaService_1 = require("../media/MediaService");
var TilesOptions = (function () {
    function TilesOptions() {
    }
    return TilesOptions;
}());
var TilesDirectiveLink = (function () {
    function TilesDirectiveLink($scope, $element, $attrs, $rootScope) {
        var _this = this;
        this.$element = $element;
        this.$attrs = $attrs;
        this.$rootScope = $rootScope;
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
            new TilesDirectiveLink($scope, $element, $attrs, $rootScope);
        }
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXV4cGFuZWwvQXV4UGFuZWxEaXJlY3RpdmUudHMiLCJzcmMvYXV4cGFuZWwvQXV4UGFuZWxQYXJ0RGlyZWN0aXZlLnRzIiwic3JjL2F1eHBhbmVsL0F1eFBhbmVsU2VydmljZS50cyIsInNyYy9hdXhwYW5lbC9pbmRleC50cyIsInNyYy9pbmRleC50cyIsInNyYy9sYXlvdXRzL0NhcmREaXJlY3RpdmUudHMiLCJzcmMvbGF5b3V0cy9EaWFsb2dEaXJlY3RpdmUudHMiLCJzcmMvbGF5b3V0cy9Eb2N1bWVudERpcmVjdGl2ZS50cyIsInNyYy9sYXlvdXRzL01haW5EaXJlY3RpdmUudHMiLCJzcmMvbGF5b3V0cy9TaW1wbGVEaXJlY3RpdmUudHMiLCJzcmMvbGF5b3V0cy9UaWxlc0RpcmVjdGl2ZS50cyIsInNyYy9tZWRpYS9NZWRpYVNlcnZpY2UudHMiLCJzcmMvbWVkaWEvUmVzaXplRnVuY3Rpb25zLnRzIiwic3JjL21lZGlhL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsWUFBWSxDQUFDO0FBRWIsc0RBQXdEO0FBR3hELENBQUM7SUFFRDtRQUtJLHFDQUFtQixXQUE2QjtZQUh4QyxlQUFVLEdBQVcsR0FBRyxDQUFDO1lBQ3pCLGNBQVMsR0FBVyxHQUFHLENBQUM7WUFHNUIsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7UUFDcEMsQ0FBQztRQUVNLDRDQUFNLEdBQWI7WUFDSSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLDhCQUFlLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDeEYsQ0FBQztRQUVNLDRDQUFNLEdBQWI7WUFDSSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxL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UUFDakUsSUFBSSxDQUFDLENBQUM7WUFDRixPQUFPLENBQUMsaUJBQWlCLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFDcEcsT0FBTyxDQUFDLGlCQUFpQixHQUFHLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUNoRixDQUFDO0lBQ0wsQ0FBQztBQUNMLENBQUM7QUFURCxvREFTQzs7QUMzRUQsWUFBWSxDQUFDOzs7O0FBRWIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFFL0IsMEJBQXdCO0FBQ3hCLDZCQUEyQjtBQUUzQixvQ0FBK0I7QUFDL0IsdUNBQWtDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCB7IE1haW5CcmVha3BvaW50cyB9IGZyb20gJy4uL21lZGlhL01lZGlhU2VydmljZSc7XHJcbmltcG9ydCB7IElBdXhQYW5lbFNlcnZpY2UgfSBmcm9tICcuL0F1eFBhbmVsU2VydmljZSc7XHJcblxyXG4oKCkgPT4ge1xyXG5cclxuY2xhc3MgQXV4UGFuZWxEaXJlY3RpdmVDb250cm9sbGVyIHtcclxuICAgIHByaXZhdGUgX3BpcEF1eFBhbmVsOiBJQXV4UGFuZWxTZXJ2aWNlO1xyXG4gICAgcHJpdmF0ZSBub3JtYWxTaXplOiBudW1iZXIgPSAzMjA7XHJcbiAgICBwcml2YXRlIGxhcmdlU2l6ZTogbnVtYmVyID0gNDgwO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihwaXBBdXhQYW5lbDogSUF1eFBhbmVsU2VydmljZSkge1xyXG4gICAgICAgIHRoaXMuX3BpcEF1eFBhbmVsID0gcGlwQXV4UGFuZWw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlzR3R4cygpOmJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBOdW1iZXIoJCgnYm9keScpLndpZHRoKCkpID4gTWFpbkJyZWFrcG9pbnRzLnhzICYmIHRoaXMuX3BpcEF1eFBhbmVsLmlzT3BlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpc0d0bGcoKTpib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gTnVtYmVyKCQoJ2JvZHknKS53aWR0aCgpKSA+IChNYWluQnJlYWtwb2ludHMubGcgKyB0aGlzLmxhcmdlU2l6ZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEF1eFBhbmVsRGlyZWN0aXZlKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICAgICAgY29udHJvbGxlcjogQXV4UGFuZWxEaXJlY3RpdmVDb250cm9sbGVyLFxyXG4gICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIHRlbXBsYXRlOiAnPG1kLXNpZGVuYXYgY2xhc3M9XCJtZC1zaWRlbmF2LXJpZ2h0IG1kLXdoaXRlZnJhbWUtejIgcGlwLWF1eHBhbmVsIGNvbG9yLWNvbnRlbnQtYmdcIiBuZy1jbGFzcz1cIntcXCdwaXAtbGFyZ2VcXCc6IHZtLmlzR3RsZygpfVwiJyArIFxyXG4gICAgICAgICAgICAgICAgICAgICdtZC1jb21wb25lbnQtaWQ9XCJwaXAtYXV4cGFuZWxcIiBtZC1pcy1sb2NrZWQtb3Blbj1cInZtLmlzR3R4cygpXCIgcGlwLWZvY3VzZWQgbmctdHJhbnNjbHVkZT4nICsgXHJcbiAgICAgICAgICAgICAgICAgICAgJzwvbWQtc2lkZW5hdj4nXHJcbiAgICB9XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ3BpcEF1eFBhbmVsJylcclxuICAgIC5kaXJlY3RpdmUoJ3BpcEF1eFBhbmVsJywgQXV4UGFuZWxEaXJlY3RpdmUpO1xyXG5cclxufSkoKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG4vLyBQcmV2ZW50IGp1bmsgZnJvbSBnb2luZyBpbnRvIHR5cGVzY3JpcHQgZGVmaW5pdGlvbnNcclxuKCgpID0+IHtcclxuXHJcbmZ1bmN0aW9uIEF1eFBhbmVsUGFydERpcmVjdGl2ZUNvbnRyb2xsZXIoJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkcm9vdFNjb3BlLCBwaXBBdXhQYW5lbCkge1xyXG4gICAgXCJuZ0luamVjdFwiO1xyXG5cclxuICAgIHZhciBwYXJ0TmFtZSA9ICcnICsgJGF0dHJzLnBpcEF1eFBhbmVsUGFydDtcclxuICAgIHZhciBwYXJ0VmFsdWUgPSBudWxsO1xyXG5cclxuICAgIC8vIEJyZWFrIHBhcnQgYXBhcnRcclxuICAgIHZhciBwb3MgPSBwYXJ0TmFtZS5pbmRleE9mKCc6Jyk7XHJcbiAgICBpZiAocG9zID4gMCkge1xyXG4gICAgICAgIHBhcnRWYWx1ZSA9IHBhcnROYW1lLnN1YnN0cihwb3MgKyAxKTtcclxuICAgICAgICBwYXJ0TmFtZSA9IHBhcnROYW1lLnN1YnN0cigwLCBwb3MpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQXV4UGFuZWxDaGFuZ2VkKG51bGwsIHBpcEF1eFBhbmVsLmNvbmZpZylcclxuICAgICRyb290U2NvcGUuJG9uKCdwaXBBdXhQYW5lbENoYW5nZWQnLCBvbkF1eFBhbmVsQ2hhbmdlZCk7XHJcblxyXG4gICAgZnVuY3Rpb24gb25BdXhQYW5lbENoYW5nZWQoZXZlbnQsIGNvbmZpZykge1xyXG4gICAgICAgIHZhciBwYXJ0cyA9IGNvbmZpZy5wYXJ0cyB8fCB7fTtcclxuICAgICAgICB2YXIgY3VycmVudFBhcnRWYWx1ZSA9IGNvbmZpZ1twYXJ0TmFtZV07XHJcbiAgICAgICAgLy8gU2V0IHZpc2libGUgdmFyaWFibGUgdG8gc3dpdGNoIG5nSWZcclxuXHJcbiAgICAgICAgJHNjb3BlLnZpc2libGUgPSBwYXJ0VmFsdWUgPyBjdXJyZW50UGFydFZhbHVlID09IHBhcnRWYWx1ZSA6IGN1cnJlbnRQYXJ0VmFsdWU7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBBdXhQYW5lbFBhcnREaXJlY3RpdmUobmdJZkRpcmVjdGl2ZSkge1xyXG4gICAgXCJuZ0luamVjdFwiO1xyXG5cclxuICAgIHZhciBuZ0lmID0gbmdJZkRpcmVjdGl2ZVswXTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHRyYW5zY2x1ZGU6IG5nSWYudHJhbnNjbHVkZSxcclxuICAgICAgICBwcmlvcml0eTogbmdJZi5wcmlvcml0eSxcclxuICAgICAgICB0ZXJtaW5hbDogbmdJZi50ZXJtaW5hbCxcclxuICAgICAgICByZXN0cmljdDogbmdJZi5yZXN0cmljdCxcclxuICAgICAgICBzY29wZTogdHJ1ZSxcclxuICAgICAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGU6IGFueSwgJGVsZW1lbnQsICRhdHRycykge1xyXG4gICAgICAgICAgICAvLyBWaXN1YWxpemUgYmFzZWQgb24gdmlzaWJsZSB2YXJpYWJsZSBpbiBzY29wZVxyXG4gICAgICAgICAgICAkYXR0cnMubmdJZiA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gJHNjb3BlLnZpc2libGUgfTtcclxuICAgICAgICAgICAgbmdJZi5saW5rLmFwcGx5KG5nSWYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY29udHJvbGxlcjogQXV4UGFuZWxQYXJ0RGlyZWN0aXZlQ29udHJvbGxlclxyXG4gICAgfTtcclxufVxyXG5cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgncGlwQXV4UGFuZWwnKVxyXG4gICAgLmRpcmVjdGl2ZSgncGlwQXV4UGFuZWxQYXJ0JywgQXV4UGFuZWxQYXJ0RGlyZWN0aXZlKTtcclxuXHJcbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuZXhwb3J0IGxldCBBdXhQYW5lbENoYW5nZWRFdmVudCA9ICdwaXBBdXhQYW5lbENoYW5nZWQnO1xyXG5leHBvcnQgbGV0IEF1eFBhbmVsU3RhdGVDaGFuZ2VkRXZlbnQgPSAncGlwQXV4UGFuZWxTdGF0ZUNoYW5nZWQnO1xyXG5leHBvcnQgbGV0IE9wZW5BdXhQYW5lbEV2ZW50ID0gJ3BpcE9wZW5BdXhQYW5lbCc7XHJcbmV4cG9ydCBsZXQgQ2xvc2VBdXhQYW5lbEV2ZW50ID0gJ3BpcENsb3NlQXV4UGFuZWwnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEF1eFBhbmVsQ29uZmlnIHtcclxuICAgIHBhcnRzOiBhbnk7XHJcbiAgICBjbGFzc2VzOiBzdHJpbmdbXTtcclxuICAgIHN0YXRlOiBhbnk7XHJcbiAgICB0eXBlOiBzdHJpbmc7XHJcbn0gXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElBdXhQYW5lbFNlcnZpY2Uge1xyXG4gICAgcmVhZG9ubHkgY29uZmlnOiBBdXhQYW5lbENvbmZpZztcclxuICAgIHJlYWRvbmx5IGNsYXNzZXM6IHN0cmluZ1tdO1xyXG4gICAgcGFydHM6IGFueTtcclxuICAgIHN0YXRlOiBhbnk7ICAgIFxyXG5cclxuICAgIGlzT3BlbigpOiBib29sZWFuO1xyXG4gICAgb3BlbigpOiB2b2lkO1xyXG4gICAgY2xvc2UoKTogdm9pZDtcclxuICAgIHRvZ2dsZSgpOiB2b2lkO1xyXG4gIFxyXG4gICAgYWRkQ2xhc3MoLi4uY2xhc3Nlczogc3RyaW5nW10pOiB2b2lkO1xyXG4gICAgcmVtb3ZlQ2xhc3MoLi4uY2xhc3Nlczogc3RyaW5nW10pOiB2b2lkO1xyXG4gXHJcbiAgICBwYXJ0KHBhcnQ6IHN0cmluZywgdmFsdWU6IGFueSk6IHZvaWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUF1eFBhbmVsUHJvdmlkZXIgZXh0ZW5kcyBuZy5JU2VydmljZVByb3ZpZGVyIHtcclxuICAgIGNvbmZpZzogQXV4UGFuZWxDb25maWc7XHJcbiAgICBwYXJ0czogYW55O1xyXG4gICAgdHlwZTogc3RyaW5nO1xyXG4gICAgY2xhc3Nlczogc3RyaW5nW107XHJcblxyXG4gICAgb3BlbigpOiB2b2lkO1xyXG4gICAgY2xvc2UoKTogdm9pZDtcclxuICAgIHRvZ2dsZSgpOiB2b2lkO1xyXG5cclxuICAgIGFkZENsYXNzKC4uLmNsYXNzZXM6IHN0cmluZ1tdKTogdm9pZDtcclxuICAgIHJlbW92ZUNsYXNzKC4uLmNsYXNzZXM6IHN0cmluZ1tdKTogdm9pZDtcclxuXHJcbiAgICBwYXJ0KHBhcnQ6IHN0cmluZywgdmFsdWU6IGFueSk6IHZvaWQ7XHJcbn1cclxuXHJcbmNsYXNzIEF1eFBhbmVsU2VydmljZSBpbXBsZW1lbnRzIElBdXhQYW5lbFNlcnZpY2Uge1xyXG4gICAgcHJpdmF0ZSBfY29uZmlnOiBBdXhQYW5lbENvbmZpZztcclxuICAgIHByaXZhdGUgX3N0YXRlOiBhbnk7XHJcbiAgICBwcml2YXRlIF9yb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlO1xyXG4gICAgcHJpdmF0ZSBfc2lkZW5hdjogbmcubWF0ZXJpYWwuSVNpZGVuYXZTZXJ2aWNlO1xyXG4gICAgcHJpdmF0ZSBpZCA9ICdwaXAtYXV4cGFuZWwnO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihjb25maWc6IEF1eFBhbmVsQ29uZmlnLCAkcm9vdFNjb3BlOiBuZy5JUm9vdFNjb3BlU2VydmljZSwgJG1kU2lkZW5hdjogbmcubWF0ZXJpYWwuSVNpZGVuYXZTZXJ2aWNlKSB7XHJcbiAgICAgICAgdGhpcy5fY29uZmlnID0gY29uZmlnO1xyXG4gICAgICAgIHRoaXMuX3Jvb3RTY29wZSA9ICRyb290U2NvcGU7XHJcbiAgICAgICAgdGhpcy5fc2lkZW5hdiA9ICRtZFNpZGVuYXY7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBjb25maWcoKTogQXV4UGFuZWxDb25maWcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb25maWc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBjbGFzc2VzKCk6IHN0cmluZ1tdIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29uZmlnLmNsYXNzZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBwYXJ0cygpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb25maWcucGFydHM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBwYXJ0cyh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgdGhpcy5fY29uZmlnLnBhcnRzID0gdmFsdWUgfHwge307XHJcbiAgICAgICAgdGhpcy5zZW5kQ29uZmlnRXZlbnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHN0YXRlKCk6IGFueSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgc3RhdGUodmFsdWU6IGFueSkge1xyXG4gICAgICAgIHRoaXMuX3N0YXRlID0gdmFsdWUgfHwge307XHJcbiAgICAgICAgdGhpcy5fcm9vdFNjb3BlLiRicm9hZGNhc3QoQXV4UGFuZWxTdGF0ZUNoYW5nZWRFdmVudCwgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpc09wZW4oKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NpZGVuYXYodGhpcy5pZCkuaXNPcGVuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9wZW4oKSB7XHJcbiAgICAgICAgdGhpcy5fc2lkZW5hdih0aGlzLmlkKS5vcGVuKCk7XHJcbiAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgcHVibGljIGNsb3NlKCkge1xyXG4gICAgICAgIHRoaXMuX3NpZGVuYXYodGhpcy5pZCkuY2xvc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdG9nZ2xlKCkge1xyXG4gICAgICAgIHRoaXMuX3NpZGVuYXYodGhpcy5pZCkudG9nZ2xlKCk7XHJcbiAgICB9XHJcbiAgXHJcbiAgICBwdWJsaWMgYWRkQ2xhc3MoLi4uY2xhc3Nlczogc3RyaW5nW10pOiB2b2lkIHtcclxuICAgICAgICBfLmVhY2goY2xhc3NlcywgKGMpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fY29uZmlnLmNsYXNzZXMucHVzaChjKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnNlbmRDb25maWdFdmVudCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmVDbGFzcyguLi5jbGFzc2VzOiBzdHJpbmdbXSk6IHZvaWQge1xyXG4gICAgICAgIF8uZWFjaChjbGFzc2VzLCAoYykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9jb25maWcuY2xhc3NlcyA9IF8ucmVqZWN0KHRoaXMuX2NvbmZpZy5jbGFzc2VzLCAoY2MpID0+IGNjID09IGMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuc2VuZENvbmZpZ0V2ZW50KCk7XHJcbiAgICB9XHJcbiBcclxuICAgIHB1YmxpYyBwYXJ0KHBhcnQ6IHN0cmluZywgdmFsdWU6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2NvbmZpZy5wYXJ0c1twYXJ0XSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuc2VuZENvbmZpZ0V2ZW50KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZW5kQ29uZmlnRXZlbnQoKSB7XHJcbiAgICAgICAgdGhpcy5fcm9vdFNjb3BlLiRlbWl0KEF1eFBhbmVsQ2hhbmdlZEV2ZW50LCB0aGlzLl9jb25maWcpO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBBdXhQYW5lbFByb3ZpZGVyIGltcGxlbWVudHMgSUF1eFBhbmVsUHJvdmlkZXIge1xyXG4gICAgcHJpdmF0ZSBfY29uZmlnOiBBdXhQYW5lbENvbmZpZyA9IHtcclxuICAgICAgICBwYXJ0czoge30sXHJcbiAgICAgICAgY2xhc3NlczogW10sXHJcbiAgICAgICAgdHlwZTogJ3N0aWNreScsXHJcbiAgICAgICAgc3RhdGU6IG51bGxcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBfc2VydmljZTogQXV4UGFuZWxTZXJ2aWNlO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgY29uZmlnKCk6IEF1eFBhbmVsQ29uZmlnIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29uZmlnO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgY29uZmlnKHZhbHVlOiBBdXhQYW5lbENvbmZpZykge1xyXG4gICAgICAgIHRoaXMuX2NvbmZpZyA9IHZhbHVlIHx8IG5ldyBBdXhQYW5lbENvbmZpZygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgcGFydHMoKTogYW55IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29uZmlnLnBhcnRzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgcGFydHModmFsdWU6IGFueSkge1xyXG4gICAgICAgIHRoaXMuX2NvbmZpZy5wYXJ0cyA9IHZhbHVlIHx8IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgdHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb25maWcudHlwZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHR5cGUodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuX2NvbmZpZy50eXBlID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBjbGFzc2VzKCk6IHN0cmluZ1tdIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29uZmlnLmNsYXNzZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBjbGFzc2VzKHZhbHVlOiBzdHJpbmdbXSkge1xyXG4gICAgICAgIHRoaXMuX2NvbmZpZy5jbGFzc2VzID0gdmFsdWUgfHwgW107XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZENsYXNzKC4uLmNsYXNzZXM6IHN0cmluZ1tdKTogdm9pZCB7XHJcbiAgICAgICAgXy5lYWNoKGNsYXNzZXMsIChjKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZy5jbGFzc2VzLnB1c2goYyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbW92ZUNsYXNzKC4uLmNsYXNzZXM6IHN0cmluZ1tdKTogdm9pZCB7XHJcbiAgICAgICAgXy5lYWNoKGNsYXNzZXMsIChjKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZy5jbGFzc2VzID0gXy5yZWplY3QodGhpcy5fY29uZmlnLmNsYXNzZXMsIChjYykgPT4gY2MgPT0gYyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiBcclxuICAgIHB1YmxpYyBwYXJ0KHBhcnQ6IHN0cmluZywgdmFsdWU6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2NvbmZpZy5wYXJ0c1twYXJ0XSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvcGVuKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3NlcnZpY2Uub3BlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbG9zZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zZXJ2aWNlLmNsb3NlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRvZ2dsZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zZXJ2aWNlLnRvZ2dsZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyAkZ2V0KCRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlLCAkbWRTaWRlbmF2OiBuZy5tYXRlcmlhbC5JU2lkZW5hdlNlcnZpY2UpIHtcclxuICAgICAgICBcIm5nSW5qZWN0XCI7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9zZXJ2aWNlID09IG51bGwpXHJcbiAgICAgICAgICAgIHRoaXMuX3NlcnZpY2UgPSBuZXcgQXV4UGFuZWxTZXJ2aWNlKHRoaXMuX2NvbmZpZywgJHJvb3RTY29wZSwgJG1kU2lkZW5hdik7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9zZXJ2aWNlO1xyXG4gICAgfSAgICAgXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhvb2tBdXhQYW5lbEV2ZW50cygkcm9vdFNjb3BlOiBuZy5JUm9vdFNjb3BlU2VydmljZSwgcGlwQXV4UGFuZWw6IElBdXhQYW5lbFNlcnZpY2UpIHtcclxuICAgICRyb290U2NvcGUuJG9uKE9wZW5BdXhQYW5lbEV2ZW50LCAoKSA9PiB7IHBpcEF1eFBhbmVsLm9wZW4oKTsgfSk7XHJcbiAgICAkcm9vdFNjb3BlLiRvbihDbG9zZUF1eFBhbmVsRXZlbnQsICgpID0+IHsgcGlwQXV4UGFuZWwuY2xvc2UoKTsgfSk7XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ3BpcEF1eFBhbmVsJylcclxuICAgIC5wcm92aWRlcigncGlwQXV4UGFuZWwnLCBBdXhQYW5lbFByb3ZpZGVyKVxyXG4gICAgLnJ1bihob29rQXV4UGFuZWxFdmVudHMpO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncGlwQXV4UGFuZWwnLCBbJ25nTWF0ZXJpYWwnXSk7XHJcblxyXG5pbXBvcnQgJy4vQXV4UGFuZWxTZXJ2aWNlJztcclxuaW1wb3J0ICcuL0F1eFBhbmVsUGFydERpcmVjdGl2ZSc7XHJcbmltcG9ydCAnLi9BdXhQYW5lbERpcmVjdGl2ZSc7XHJcblxyXG5leHBvcnQgKiBmcm9tICcuL0F1eFBhbmVsU2VydmljZSc7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3BpcExheW91dCcsIFsnd3UubWFzb25yeScsICdwaXBNZWRpYScsICdwaXBBdXhQYW5lbCddKTtcclxuXHJcbmltcG9ydCAnLi9tZWRpYS9pbmRleCc7XHJcblxyXG5pbXBvcnQgJy4vbGF5b3V0cy9NYWluRGlyZWN0aXZlJztcclxuaW1wb3J0ICcuL2xheW91dHMvQ2FyZERpcmVjdGl2ZSc7XHJcbmltcG9ydCAnLi9sYXlvdXRzL0RpYWxvZ0RpcmVjdGl2ZSc7XHJcbmltcG9ydCAnLi9sYXlvdXRzL0RvY3VtZW50RGlyZWN0aXZlJztcclxuaW1wb3J0ICcuL2xheW91dHMvU2ltcGxlRGlyZWN0aXZlJztcclxuaW1wb3J0ICcuL2xheW91dHMvVGlsZXNEaXJlY3RpdmUnO1xyXG5pbXBvcnQgJy4vYXV4cGFuZWwvaW5kZXgnO1xyXG5cclxuZXhwb3J0ICogZnJvbSAnLi9tZWRpYS9pbmRleCc7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCB7IE1haW5SZXNpemVkRXZlbnQsIExheW91dFJlc2l6ZWRFdmVudCwgTWFpbkJyZWFrcG9pbnRTdGF0dXNlcyB9IGZyb20gJy4uL21lZGlhL01lZGlhU2VydmljZSc7XHJcblxyXG4vLyBBdm9pZCBkZWZhdWx0IGV4cG9ydFxyXG4oKCkgPT4ge1xyXG5cclxuaW50ZXJmYWNlIElDYXJkRGlyZWN0aXZlQXR0cmlidXRlcyBleHRlbmRzIG5nLklBdHRyaWJ1dGVzIHtcclxuICAgIG1pbldpZHRoOiBzdHJpbmcgfCBudW1iZXI7XHJcbiAgICBtaW5IZWlnaHQ6IHN0cmluZyB8IG51bWJlcjtcclxuICAgIHdpZHRoOiBzdHJpbmcgfCBudW1iZXI7XHJcbiAgICBoZWlnaHQ6IHN0cmluZyB8IG51bWJlcjtcclxufVxyXG5cclxuY2xhc3MgQ2FyZERpcmVjdGl2ZUxpbmsge1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwcml2YXRlICRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlLCBcclxuICAgICAgICBwcml2YXRlICRlbGVtZW50OiBKUXVlcnksIFxyXG4gICAgICAgIHByaXZhdGUgJGF0dHJzOiBJQ2FyZERpcmVjdGl2ZUF0dHJpYnV0ZXNcclxuICAgICkge1xyXG5cclxuICAgICAgICAvLyBBZGQgY2xhc3MgdG8gdGhlIGVsZW1lbnRcclxuICAgICAgICAkZWxlbWVudC5hZGRDbGFzcygncGlwLWNhcmQnKTtcclxuXHJcbiAgICAgICAgbGV0IGxpc3RlbmVyID0gKCkgPT4geyB0aGlzLnJlc2l6ZSgpOyB9XHJcblxyXG4gICAgICAgIC8vIFJlc2l6ZSBldmVyeSB0aW1lIHdpbmRvdyBpcyByZXNpemVkXHJcbiAgICAgICAgJHJvb3RTY29wZS4kb24oTWFpblJlc2l6ZWRFdmVudCwgbGlzdGVuZXIpO1xyXG5cclxuICAgICAgICAvLyBSZXNpemUgcmlnaHQgYXdheSB0byBhdm9pZCBmbGlja2luZ1xyXG4gICAgICAgIHRoaXMucmVzaXplKCk7XHJcblxyXG4gICAgICAgIC8vIFJlc2l6ZSB0aGUgZWxlbWVudCByaWdodCBhd2F5XHJcbiAgICAgICAgc2V0VGltZW91dChsaXN0ZW5lciwgMTAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlc2l6ZSgpIHtcclxuICAgICAgICBjb25zdFxyXG4gICAgICAgICAgICAkbWFpbkJvZHkgPSAkKCcucGlwLW1haW4tYm9keScpLFxyXG4gICAgICAgICAgICBjYXJkQ29udGFpbmVyID0gJCgnLnBpcC1jYXJkLWNvbnRhaW5lcicpLFxyXG4gICAgICAgICAgICB3aW5kb3dXaWR0aCA9ICQoJ3BpcC1tYWluJykud2lkdGgoKTtcclxuICAgICAgICBsZXRcclxuICAgICAgICAgICAgbWF4V2lkdGggPSAkbWFpbkJvZHkud2lkdGgoKSxcclxuICAgICAgICAgICAgbWF4SGVpZ2h0ID0gJG1haW5Cb2R5LmhlaWdodCgpLFxyXG4gICAgICAgICAgICBtaW5XaWR0aCA9IHRoaXMuJGF0dHJzLm1pbldpZHRoID8gTWF0aC5mbG9vcihOdW1iZXIodGhpcy4kYXR0cnMubWluV2lkdGgpKSA6IG51bGwsXHJcbiAgICAgICAgICAgIG1pbkhlaWdodCA9IHRoaXMuJGF0dHJzLm1pbkhlaWdodCA/IE1hdGguZmxvb3IoTnVtYmVyKHRoaXMuJGF0dHJzLm1pbkhlaWdodCkpIDogbnVsbCxcclxuICAgICAgICAgICAgd2lkdGggPSB0aGlzLiRhdHRycy53aWR0aCA/IE1hdGguZmxvb3IoTnVtYmVyKHRoaXMuJGF0dHJzLndpZHRoKSkgOiBudWxsLFxyXG4gICAgICAgICAgICBoZWlnaHQgPSB0aGlzLiRhdHRycy5oZWlnaHQgPyBNYXRoLmZsb29yKE51bWJlcih0aGlzLiRhdHRycy5oZWlnaHQpKSA6IG51bGwsXHJcbiAgICAgICAgICAgIGxlZnQsIHRvcDtcclxuXHJcbiAgICAgICAgLy8gRnVsbC1zY3JlZW4gb24gcGhvbmVcclxuICAgICAgICBpZiAoTWFpbkJyZWFrcG9pbnRTdGF0dXNlcy54cykge1xyXG4gICAgICAgICAgICBtaW5XaWR0aCA9IG51bGw7XHJcbiAgICAgICAgICAgIG1pbkhlaWdodCA9IG51bGw7XHJcbiAgICAgICAgICAgIHdpZHRoID0gbnVsbDtcclxuICAgICAgICAgICAgaGVpZ2h0ID0gbnVsbDtcclxuICAgICAgICAgICAgbWF4V2lkdGggPSBudWxsO1xyXG4gICAgICAgICAgICBtYXhIZWlnaHQgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBDYXJkIHZpZXcgd2l0aCBhZGp1c3RhYmxlIG1hcmdpbnMgb24gdGFibGV0IGFuZCBkZXNrdG9wXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIFNldCBtYXJnaW4gYW5kIG1heGltdW0gZGltZW5zaW9uc1xyXG4gICAgICAgICAgICBjb25zdCBzcGFjZSA9IE1haW5CcmVha3BvaW50U3RhdHVzZXNbJ2d0LW1kJ10gPyAyNCA6IDE2O1xyXG4gICAgICAgICAgICBtYXhXaWR0aCAtPSBzcGFjZSAqIDI7XHJcbiAgICAgICAgICAgIG1heEhlaWdodCAtPSBzcGFjZSAqIDI7XHJcblxyXG4gICAgICAgICAgICAvLyBTZXQgbWluaW11bSBkaW1lbnNpb25zXHJcbiAgICAgICAgICAgIG1pbldpZHRoID0gbWluV2lkdGggPyBNYXRoLm1pbihtaW5XaWR0aCwgbWF4V2lkdGgpIDogbnVsbDtcclxuICAgICAgICAgICAgbWluSGVpZ2h0ID0gbWluSGVpZ2h0ID8gTWF0aC5taW4obWluSGVpZ2h0LCBtYXhIZWlnaHQpIDogbnVsbDtcclxuXHJcbiAgICAgICAgICAgIC8vIFNldCByZWd1bGFyIGRpbWVuc2lvbnNcclxuICAgICAgICAgICAgd2lkdGggPSB3aWR0aCA/IE1hdGgubWluKHdpZHRoLCBtYXhXaWR0aCkgOiBudWxsO1xyXG4gICAgICAgICAgICBoZWlnaHQgPSBoZWlnaHQgPyBNYXRoLm1pbihoZWlnaHQsIG1heEhlaWdodCkgOiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU2V0IGRpbWVuc2lvbnNcclxuICAgICAgICB0aGlzLiRlbGVtZW50LmNzcygnbWF4LXdpZHRoJywgbWF4V2lkdGggPyBtYXhXaWR0aCArICdweCcgOiAnJyk7XHJcbiAgICAgICAgdGhpcy4kZWxlbWVudC5jc3MoJ21pbi13aWR0aCcsIG1pbldpZHRoID8gbWluV2lkdGggKyAncHgnIDogJycpO1xyXG4gICAgICAgIHRoaXMuJGVsZW1lbnQuY3NzKCd3aWR0aCcsIHdpZHRoID8gd2lkdGggKyAncHgnIDogJycpO1xyXG4gICAgICAgIHRoaXMuJGVsZW1lbnQuY3NzKCdoZWlnaHQnLCBoZWlnaHQgPyBoZWlnaHQgKyAncHgnIDogJycpO1xyXG5cclxuICAgICAgICBpZiAoIWNhcmRDb250YWluZXIuaGFzQ2xhc3MoJ3BpcC1vdXRlci1zY3JvbGwnKSkge1xyXG4gICAgICAgICAgICB0aGlzLiRlbGVtZW50LmNzcygnbWF4LWhlaWdodCcsIG1heEhlaWdodCA/IG1heEhlaWdodCArICdweCcgOiAnJyk7XHJcbiAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQuY3NzKCdtaW4taGVpZ2h0JywgbWluSGVpZ2h0ID8gbWluSGVpZ2h0ICsgJ3B4JyA6ICcnKTtcclxuICAgICAgICAgICAgY29uc3RcclxuICAgICAgICAgICAgICAgICRoZWFkZXIgPSB0aGlzLiRlbGVtZW50LmZpbmQoJy5waXAtaGVhZGVyOnZpc2libGUnKSxcclxuICAgICAgICAgICAgICAgICRmb290ZXIgPSB0aGlzLiRlbGVtZW50LmZpbmQoJy5waXAtZm9vdGVyOnZpc2libGUnKSxcclxuICAgICAgICAgICAgICAgICRib2R5ID0gdGhpcy4kZWxlbWVudC5maW5kKCcucGlwLWJvZHknKTtcclxuICAgICAgICAgICAgbGV0IG1heEJvZHlIZWlnaHQgPSBtYXhIZWlnaHQgfHwgJG1haW5Cb2R5LmhlaWdodCgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCRoZWFkZXIubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgICAgIG1heEJvZHlIZWlnaHQgLT0gJGhlYWRlci5vdXRlckhlaWdodCh0cnVlKTtcclxuICAgICAgICAgICAgaWYgKCRmb290ZXIubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgICAgIG1heEJvZHlIZWlnaHQgLT0gJGZvb3Rlci5vdXRlckhlaWdodCh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICRib2R5LmNzcygnbWF4LWhlaWdodCcsIG1heEJvZHlIZWlnaHQgKyAncHgnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjYXJkQ29udGFpbmVyLmFkZENsYXNzKCdwaXAtc2Nyb2xsJyk7XHJcbiAgICAgICAgICAgIGlmIChNYWluQnJlYWtwb2ludFN0YXR1c2VzLnhzKSB7XHJcbiAgICAgICAgICAgICAgICBsZWZ0ID0gMDtcclxuICAgICAgICAgICAgICAgIHRvcCA9IDA7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZWZ0ID0gY2FyZENvbnRhaW5lci53aWR0aCgpIC8gMiAtIHRoaXMuJGVsZW1lbnQud2lkdGgoKSAvIDIgLSAxNjtcclxuICAgICAgICAgICAgICAgIHRvcCA9IE1hdGgubWF4KGNhcmRDb250YWluZXIuaGVpZ2h0KCkgLyAyIC0gdGhpcy4kZWxlbWVudC5oZWlnaHQoKSAvIDIgLSAxNiwgMCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQuY3NzKCdsZWZ0JywgbGVmdCk7XHJcbiAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQuY3NzKCd0b3AnLCB0b3ApO1xyXG5cclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHRoaXMuJGVsZW1lbnQuY3NzKCdkaXNwbGF5JywgJ2ZsZXgnKTsgfSwgMTAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIE5vdGlmeSBjaGlsZCBjb250cm9scyB0aGF0IGxheW91dCB3YXMgcmVzaXplZFxyXG4gICAgICAgIHRoaXMuJHJvb3RTY29wZS4kZW1pdCgncGlwTGF5b3V0UmVzaXplZCcpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjYXJkRGlyZWN0aXZlKCRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlKSB7XHJcbiAgICBcIm5nSW5qZWN0XCI7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICBsaW5rOiAoJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzKSA9PiB7XHJcbiAgICAgICAgICAgIG5ldyBDYXJkRGlyZWN0aXZlTGluaygkcm9vdFNjb3BlLCAkZWxlbWVudCwgJGF0dHJzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdwaXBMYXlvdXQnKVxyXG4gICAgLmRpcmVjdGl2ZSgncGlwQ2FyZCcsIGNhcmREaXJlY3RpdmUpO1xyXG5cclxufSkoKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG4vLyBBdm9pZCBkZWZhdWx0IGV4cG9ydFxyXG4oKCkgPT4ge1xyXG5cclxuZnVuY3Rpb24gZGlhbG9nRGlyZWN0aXZlKCk6IG5nLklEaXJlY3RpdmUge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICBsaW5rOiAoJHNjb3BlOiBuZy5JU2NvcGUsICRlbGVtZW50OiBKUXVlcnksICRhdHRyczogbmcuSUF0dHJpYnV0ZXMpID0+IHtcclxuICAgICAgICAgICAgJGVsZW1lbnQuYWRkQ2xhc3MoJ3BpcC1kaWFsb2cnKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdwaXBMYXlvdXQnKVxyXG4gICAgLmRpcmVjdGl2ZSgncGlwRGlhbG9nJywgZGlhbG9nRGlyZWN0aXZlKTtcclxuXHJcbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy8gQXZvaWQgZGVmYXVsdCBleHBvcnRcclxuKCgpID0+IHtcclxuXHJcbmZ1bmN0aW9uIGRvY3VtZW50RGlyZWN0aXZlKCk6IG5nLklEaXJlY3RpdmUge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICBsaW5rOiAoJHNjb3BlOiBuZy5JU2NvcGUsICRlbGVtZW50OiBKUXVlcnksICRhdHRyczogbmcuSUF0dHJpYnV0ZXMpID0+IHtcclxuICAgICAgICAgICAgJGVsZW1lbnQuYWRkQ2xhc3MoJ3BpcC1kb2N1bWVudCcpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ3BpcExheW91dCcpXHJcbiAgICAuZGlyZWN0aXZlKCdwaXBEb2N1bWVudCcsIGRvY3VtZW50RGlyZWN0aXZlKTtcclxuXHJcbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0IHsgYWRkUmVzaXplTGlzdGVuZXIsIHJlbW92ZVJlc2l6ZUxpc3RlbmVyIH0gZnJvbSAnLi4vbWVkaWEvUmVzaXplRnVuY3Rpb25zJztcclxuaW1wb3J0IHsgTWFpbkJyZWFrcG9pbnRzLCBNYWluQnJlYWtwb2ludFN0YXR1c2VzLCBNYWluUmVzaXplZEV2ZW50IH0gZnJvbSAnLi4vbWVkaWEvTWVkaWFTZXJ2aWNlJzsgXHJcblxyXG4vLyBBdm9pZCBkZWZhdWx0IGV4cG9ydFxyXG4oKCkgPT4ge1xyXG5cclxuaW50ZXJmYWNlIElNYWluRGlyZWN0aXZlQXR0cmlidXRlcyBleHRlbmRzIG5nLklBdHRyaWJ1dGVzIHtcclxuICAgIHBpcENvbnRhaW5lcjogc3RyaW5nO1xyXG59XHJcblxyXG5jbGFzcyBNYWluRGlyZWN0aXZlQ29udHJvbGxlciBpbXBsZW1lbnRzIG5nLklDb250cm9sbGVyIHtcclxuICAgIHByaXZhdGUgX2NvbnRhaW5lcjogYW55O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwcml2YXRlICRzY29wZTogbmcuSVNjb3BlLCBcclxuICAgICAgICBwcml2YXRlICRlbGVtZW50OiBhbmd1bGFyLklSb290RWxlbWVudFNlcnZpY2UsIFxyXG4gICAgICAgIHByaXZhdGUgJHJvb3RTY29wZTogbmcuSVJvb3RTY29wZVNlcnZpY2UsXHJcbiAgICAgICAgcHJpdmF0ZSAkdGltZW91dDogbmcuSVRpbWVvdXRTZXJ2aWNlLFxyXG4gICAgICAgIHByaXZhdGUgJGF0dHJzOiBJTWFpbkRpcmVjdGl2ZUF0dHJpYnV0ZXNcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMuX2NvbnRhaW5lciA9ICRhdHRycy5waXBDb250YWluZXIgPyAkKCRhdHRycy5waXBDb250YWluZXIpIDogJGVsZW1lbnQ7XHJcblxyXG4gICAgICAgIC8vIEFkZCBDU1MgY2xhc3NcclxuICAgICAgICAkZWxlbWVudC5hZGRDbGFzcygncGlwLW1haW4nKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIHJlc2l6ZSBsaXN0ZW5lclxyXG4gICAgICAgIGNvbnN0IGxpc3RlbmVyID0gKCkgPT4geyB0aGlzLnJlc2l6ZSgpOyB9O1xyXG4gICAgICAgIGFkZFJlc2l6ZUxpc3RlbmVyKHRoaXMuX2NvbnRhaW5lclswXSwgbGlzdGVuZXIpO1xyXG5cclxuICAgICAgICAvLyBVbmJpbmQgd2hlbiBzY29wZSBpcyByZW1vdmVkXHJcbiAgICAgICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHJlbW92ZVJlc2l6ZUxpc3RlbmVyKHRoaXMuX2NvbnRhaW5lclswXSwgbGlzdGVuZXIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBQZXJmb3JtIGluaXRpYWwgY2FsY3VsYXRpb25zXHJcbiAgICAgICAgdGhpcy51cGRhdGVCcmVha3BvaW50U3RhdHVzZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZUJyZWFrcG9pbnRTdGF0dXNlcygpIHtcclxuICAgICAgICBjb25zdCB3aWR0aCA9IHRoaXMuX2NvbnRhaW5lci5pbm5lcldpZHRoKCk7XHJcbiAgICAgICAgY29uc3QgYm9keSA9ICQoJ2JvZHknKTtcclxuXHJcbiAgICAgICAgTWFpbkJyZWFrcG9pbnRTdGF0dXNlcy51cGRhdGUoTWFpbkJyZWFrcG9pbnRzLCB3aWR0aCk7XHJcblxyXG4gICAgICAgICQuZWFjaChNYWluQnJlYWtwb2ludFN0YXR1c2VzLCAoYnJlYWtwb2ludCwgc3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChfLmlzQm9vbGVhbihzdGF0dXMpKSB7XHJcbiAgICAgICAgICAgICAgICBib2R5W3N0YXR1cyA/ICdhZGRDbGFzcyc6ICdyZW1vdmVDbGFzcyddKCdwaXAtJyArIGJyZWFrcG9pbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuJHRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLiRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgcmVzaXplKCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlQnJlYWtwb2ludFN0YXR1c2VzKCk7XHJcbiAgICAgICAgdGhpcy4kcm9vdFNjb3BlLiRlbWl0KE1haW5SZXNpemVkRXZlbnQsIE1haW5CcmVha3BvaW50U3RhdHVzZXMpO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBNYWluQm9keURpcmVjdGl2ZUxpbmsge1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICRzY29wZTogbmcuSVNjb3BlLCBcclxuICAgICAgICAkZWxlbWVudDogYW5ndWxhci5JUm9vdEVsZW1lbnRTZXJ2aWNlXHJcbiAgICApIHtcclxuICAgICAgICAvLyBBZGQgQ1NTIGNsYXNzXHJcbiAgICAgICAgJGVsZW1lbnQuYWRkQ2xhc3MoJ3BpcC1tYWluLWJvZHknKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbWFpbkRpcmVjdGl2ZSgpOiBuZy5JRGlyZWN0aXZlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgY29udHJvbGxlcjogTWFpbkRpcmVjdGl2ZUNvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nIFxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBtYWluQm9keURpcmVjdGl2ZSgpOiBuZy5JRGlyZWN0aXZlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgbGluazogTWFpbkJvZHlEaXJlY3RpdmVMaW5rXHJcbiAgICB9XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ3BpcExheW91dCcpXHJcbiAgICAuZGlyZWN0aXZlKCdwaXBNYWluJywgbWFpbkRpcmVjdGl2ZSlcclxuICAgIC5kaXJlY3RpdmUoJ3BpcE1haW5Cb2R5JywgbWFpbkJvZHlEaXJlY3RpdmUpO1xyXG5cclxufSkoKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG4vLyBBdm9pZCBkZWZhdWx0IGV4cG9ydFxyXG4oKCkgPT4ge1xyXG5cclxuZnVuY3Rpb24gc2ltcGxlRGlyZWN0aXZlKCk6IG5nLklEaXJlY3RpdmUge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICBsaW5rOiAoJHNjb3BlOiBuZy5JU2NvcGUsICRlbGVtZW50OiBKUXVlcnksICRhdHRyczogbmcuSUF0dHJpYnV0ZXMpID0+IHtcclxuICAgICAgICAgICAgJGVsZW1lbnQuYWRkQ2xhc3MoJ3BpcC1zaW1wbGUnKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdwaXBMYXlvdXQnKVxyXG4gICAgLmRpcmVjdGl2ZSgncGlwU2ltcGxlJywgc2ltcGxlRGlyZWN0aXZlKTtcclxuXHJcbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0IHsgYWRkUmVzaXplTGlzdGVuZXIsIHJlbW92ZVJlc2l6ZUxpc3RlbmVyIH0gZnJvbSAnLi4vbWVkaWEvUmVzaXplRnVuY3Rpb25zJztcclxuaW1wb3J0IHsgTWFpblJlc2l6ZWRFdmVudCwgTGF5b3V0UmVzaXplZEV2ZW50LCBNYWluQnJlYWtwb2ludHMsIE1haW5CcmVha3BvaW50U3RhdHVzZXMgfSBmcm9tICcuLi9tZWRpYS9NZWRpYVNlcnZpY2UnO1xyXG5cclxuZGVjbGFyZSB2YXIgTWFzb25yeTogYW55O1xyXG5cclxuaW50ZXJmYWNlIElUaWxlc0RpcmVjdGl2ZUF0dHJpYnV0ZXMgZXh0ZW5kcyBuZy5JQXR0cmlidXRlcyB7XHJcbiAgICBjb2x1bW5XaWR0aDogc3RyaW5nIHwgbnVtYmVyO1xyXG4gICAgcGlwSW5maW5pdGU6IHN0cmluZyB8IGJvb2xlYW4gfCBudW1iZXI7XHJcbn1cclxuXHJcbmNsYXNzIFRpbGVzT3B0aW9ucyB7XHJcbiAgICBndXR0ZXI6IG51bWJlcjtcclxuICAgIGlzRml0V2lkdGg6IGJvb2xlYW47XHJcbiAgICBpc1Jlc2l6ZUJvdW5kOiBib29sZWFuO1xyXG4gICAgdHJhbnNpdGlvbkR1cmF0aW9uOiBudW1iZXI7XHJcbn1cclxuXHJcbmludGVyZmFjZSBJVGlsZXNDb250cm9sbGVyU2NvcGUgZXh0ZW5kcyBuZy5JU2NvcGUge1xyXG4gICAgdGlsZXNPcHRpb25zOiBUaWxlc09wdGlvbnM7XHJcbn1cclxuXHJcbmNsYXNzIFRpbGVzRGlyZWN0aXZlTGluayB7XHJcbiAgICBwcml2YXRlIF9jb2x1bW5XaWR0aDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfY29udGFpbmVyOiBhbnk7XHJcbiAgICBwcml2YXRlIF9wcmV2Q29udGFpbmVyV2lkdGg6IG51bWJlcjtcclxuICAgIHByaXZhdGUgX21hc29ucnk6IGFueTtcclxuICAgIHByaXZhdGUgX3NpemVyOiBhbnk7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICRzY29wZTogbmcuSVNjb3BlLCBcclxuICAgICAgICBwcml2YXRlICRlbGVtZW50OiBKUXVlcnksIFxyXG4gICAgICAgIHByaXZhdGUgJGF0dHJzOiBJVGlsZXNEaXJlY3RpdmVBdHRyaWJ1dGVzLFxyXG4gICAgICAgIHByaXZhdGUgJHJvb3RTY29wZTogbmcuSVJvb3RTY29wZVNlcnZpY2VcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMuX2NvbHVtbldpZHRoID0gJGF0dHJzLmNvbHVtbldpZHRoID8gTWF0aC5mbG9vcihOdW1iZXIoJGF0dHJzLmNvbHVtbldpZHRoKSkgOiA0NDAsXHJcbiAgICAgICAgdGhpcy5fY29udGFpbmVyID0gJGVsZW1lbnQuY2hpbGRyZW4oJy5waXAtdGlsZXMtY29udGFpbmVyJyksXHJcbiAgICAgICAgdGhpcy5fcHJldkNvbnRhaW5lcldpZHRoID0gbnVsbCxcclxuICAgICAgICB0aGlzLl9tYXNvbnJ5ID0gTWFzb25yeS5kYXRhKHRoaXMuX2NvbnRhaW5lclswXSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gQWRkIGNsYXNzIHRvIHRoZSBlbGVtZW50XHJcbiAgICAgICAgJGVsZW1lbnQuYWRkQ2xhc3MoJ3BpcC10aWxlcycpO1xyXG5cclxuICAgICAgICAvLyBBZGQgcmVzaXplIGxpc3RlbmVyXHJcbiAgICAgICAgY29uc3QgbGlzdGVuZXIgPSAoKSA9PiB7IHRoaXMucmVzaXplKGZhbHNlKTsgfTtcclxuICAgICAgICBhZGRSZXNpemVMaXN0ZW5lcigkZWxlbWVudFswXSwgbGlzdGVuZXIpO1xyXG5cclxuICAgICAgICAvLyBVbmJpbmQgd2hlbiBzY29wZSBpcyByZW1vdmVkXHJcbiAgICAgICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHJlbW92ZVJlc2l6ZUxpc3RlbmVyKCRlbGVtZW50WzBdLCBsaXN0ZW5lcik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIEluc2VydCBzaXplclxyXG4gICAgICAgIHRoaXMuX3NpemVyID0gJCgnPGRpdiBjbGFzcz1cInBpcC10aWxlLXNpemVyXCI+PC9kaXY+Jyk7XHJcbiAgICAgICAgdGhpcy5fc2l6ZXIuYXBwZW5kVG8odGhpcy5fY29udGFpbmVyKTtcclxuXHJcbiAgICAgICAgLy8gUmVzaXplIGV2ZXJ5IHRpbWUgd2luZG93IGlzIHJlc2l6ZWRcclxuICAgICAgICAkcm9vdFNjb3BlLiRvbihNYWluUmVzaXplZEV2ZW50LCAoKSA9PiB7IHRoaXMucmVzaXplKGZhbHNlKTsgfSk7XHJcblxyXG4gICAgICAgIC8vIFJlc2l6ZSB0aGUgZWxlbWVudCByaWdodCBhd2F5XHJcbiAgICAgICAgdGhpcy5yZXNpemUodHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZXNpemUoZm9yY2U6IGJvb2xlYW4pIHtcclxuICAgICAgICBsZXQgd2lkdGggPSB0aGlzLiRlbGVtZW50LnBhcmVudCgpLndpZHRoKCksXHJcbiAgICAgICAgICAgIGNvbnRhaW5lcldpZHRoO1xyXG5cclxuICAgICAgICBpZiAoTWFpbkJyZWFrcG9pbnRTdGF0dXNlc1snZ3QteHMnXSAmJiAod2lkdGggLSAzNikgPiB0aGlzLl9jb2x1bW5XaWR0aCkge1xyXG4gICAgICAgICAgICB3aWR0aCA9IHdpZHRoIC0gMjQgKiAyO1xyXG5cclxuICAgICAgICAgICAgbGV0IGNvbHVtbnMgPSBNYXRoLmZsb29yKHdpZHRoIC8gdGhpcy5fY29sdW1uV2lkdGgpO1xyXG4gICAgICAgICAgICBjb250YWluZXJXaWR0aCA9ICh0aGlzLl9jb2x1bW5XaWR0aCArIDE2KSAqIGNvbHVtbnMgLSAxNjtcclxuXHJcbiAgICAgICAgICAgIGlmIChjb250YWluZXJXaWR0aCA+IHdpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICBjb2x1bW5zLS07XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXJXaWR0aCA9ICh0aGlzLl9jb2x1bW5XaWR0aCArIDE2KSAqIGNvbHVtbnMgLSAxNjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGNvbHVtbnMgPCAxKSB7XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXJXaWR0aCA9IHdpZHRoO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2l6ZXIuY3NzKCd3aWR0aCcsIGNvbnRhaW5lcldpZHRoICsgJ3B4Jyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zaXplci5jc3MoJ3dpZHRoJywgdGhpcy5fY29sdW1uV2lkdGggKyAncHgnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gKzEwIHRvIGF2b2lkIHByZWNpc2lvbiByZWxhdGVkIGVycm9yXHJcbiAgICAgICAgICAgIHRoaXMuX2NvbnRhaW5lci5jc3MoJ3dpZHRoJywgKGNvbnRhaW5lcldpZHRoICsgMTApICsgJ3B4Jyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbnRhaW5lci5yZW1vdmVDbGFzcygncGlwLW1vYmlsZScpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHdpZHRoID0gd2lkdGggLSAxNiAqIDI7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lcldpZHRoID0gd2lkdGg7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9zaXplci5jc3MoJ3dpZHRoJywgY29udGFpbmVyV2lkdGggKyAncHgnKTtcclxuICAgICAgICAgICAgLy8gKzEwIHRvIGF2b2lkIHByZWNpc2lvbiByZWxhdGVkIGVycm9yXHJcbiAgICAgICAgICAgIHRoaXMuX2NvbnRhaW5lci5jc3MoJ3dpZHRoJywgKGNvbnRhaW5lcldpZHRoICsgMTApICsgJ3B4Jyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbnRhaW5lci5hZGRDbGFzcygncGlwLW1vYmlsZScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gTWFudWFsbHkgY2FsbCBsYXlvdXQgb24gdGlsZSBjb250YWluZXJcclxuICAgICAgICBpZiAodGhpcy5fcHJldkNvbnRhaW5lcldpZHRoICE9IGNvbnRhaW5lcldpZHRoIHx8IGZvcmNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3ByZXZDb250YWluZXJXaWR0aCA9IGNvbnRhaW5lcldpZHRoO1xyXG4gICAgICAgICAgICB0aGlzLl9tYXNvbnJ5LmxheW91dCgpO1xyXG5cclxuICAgICAgICAgICAgLy8gTm90aWZ5IGNoaWxkIGNvbnRyb2xzIHRoYXQgbGF5b3V0IHdhcyByZXNpemVkXHJcbiAgICAgICAgICAgIHRoaXMuJHJvb3RTY29wZS4kZW1pdChMYXlvdXRSZXNpemVkRXZlbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gdGlsZXNEaXJlY3RpdmUoJHJvb3RTY29wZTogbmcuSVJvb3RTY29wZVNlcnZpY2UpOiBuZy5JRGlyZWN0aXZlIHtcclxuICAgIFwibmdJbmplY3RcIjtcclxuXHJcbiAgICAvLyBDb252ZXJ0cyB2YWx1ZSBpbnRvIGJvb2xlYW5cclxuICAgIGZ1bmN0aW9uIGNvbnZlcnRUb0Jvb2xlYW4odmFsdWUpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGlmICghdmFsdWUpIHJldHVybiBmYWxzZTtcclxuICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICByZXR1cm4gdmFsdWUgPT0gJzEnIHx8IHZhbHVlID09ICd0cnVlJztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIHNjb3BlOiBmYWxzZSxcclxuICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxyXG4gICAgICAgIHRlbXBsYXRlOlxyXG4gICAgICAgICAgICAoJGVsZW1lbnQ6IEpRdWVyeSwgJGF0dHJzOiBJVGlsZXNEaXJlY3RpdmVBdHRyaWJ1dGVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY29udmVydFRvQm9vbGVhbigkYXR0cnMucGlwSW5maW5pdGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFN0cmluZygpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsgJzxkaXYgbWFzb25yeSBjbGFzcz1cInBpcC10aWxlcy1jb250YWluZXJcIiBsb2FkLWltYWdlcz1cImZhbHNlXCIgcHJlc2VydmUtb3JkZXIgICdcclxuICAgICAgICAgICAgICAgICAgICAgICAgKyAnIG5nLXRyYW5zY2x1ZGUgY29sdW1uLXdpZHRoPVwiLnBpcC10aWxlLXNpemVyXCIgaXRlbS1zZWxlY3Rvcj1cIi5waXAtdGlsZVwiJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICArICcgbWFzb25yeS1vcHRpb25zPVwidGlsZXNPcHRpb25zXCIgIHBpcC1zY3JvbGwtY29udGFpbmVyPVwiXFwnLnBpcC10aWxlc1xcJ1wiJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICArICcgcGlwLWluZmluaXRlLXNjcm9sbD1cInJlYWRTY3JvbGwoKVwiID4nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsgJzwvZGl2Pic7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTdHJpbmcoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICArICc8ZGl2IG1hc29ucnkgY2xhc3M9XCJwaXAtdGlsZXMtY29udGFpbmVyXCIgbG9hZC1pbWFnZXM9XCJmYWxzZVwiIHByZXNlcnZlLW9yZGVyICAnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsgJyBuZy10cmFuc2NsdWRlIGNvbHVtbi13aWR0aD1cIi5waXAtdGlsZS1zaXplclwiIGl0ZW0tc2VsZWN0b3I9XCIucGlwLXRpbGVcIidcclxuICAgICAgICAgICAgICAgICAgICAgICAgKyAnIG1hc29ucnktb3B0aW9ucz1cInRpbGVzT3B0aW9uc1wiPidcclxuICAgICAgICAgICAgICAgICAgICAgICAgKyAnPC9kaXY+JztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICBjb250cm9sbGVyOiAoJHNjb3BlOiBJVGlsZXNDb250cm9sbGVyU2NvcGUpID0+IHtcclxuICAgICAgICAgICAgJHNjb3BlLnRpbGVzT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIGd1dHRlcjogOCwvLzE2XHJcbiAgICAgICAgICAgICAgICBpc0ZpdFdpZHRoOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGlzUmVzaXplQm91bmQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbkR1cmF0aW9uOiAwIC8vICcwLjJzJ1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbGluazogKCRzY29wZTogbmcuSVNjb3BlLCAkZWxlbWVudDogSlF1ZXJ5LCAkYXR0cnM6IElUaWxlc0RpcmVjdGl2ZUF0dHJpYnV0ZXMpID0+IHtcclxuICAgICAgICAgICAgbmV3IFRpbGVzRGlyZWN0aXZlTGluaygkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICRyb290U2NvcGUpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ3BpcExheW91dCcpXHJcbiAgICAuZGlyZWN0aXZlKCdwaXBUaWxlcycsIHRpbGVzRGlyZWN0aXZlKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1lZGlhQnJlYWtwb2ludHMge1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHhzOiBudW1iZXIsIHNtOiBudW1iZXIsIG1kOiBudW1iZXIsIGxnOiBudW1iZXJcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMueHMgPSB4cztcclxuICAgICAgICB0aGlzLnNtID0gc207XHJcbiAgICAgICAgdGhpcy5tZCA9IG1kO1xyXG4gICAgICAgIHRoaXMubGcgPSBsZztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgeHM6IG51bWJlcjtcclxuICAgIHB1YmxpYyBzbTogbnVtYmVyO1xyXG4gICAgcHVibGljIG1kOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgbGc6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE1lZGlhQnJlYWtwb2ludFN0YXR1c2VzIHtcclxuICAgIHB1YmxpYyB3aWR0aDogbnVtYmVyO1xyXG4gICAgcHVibGljICd4cyc6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgJ2d0LXhzJzogYm9vbGVhbjtcclxuICAgIHB1YmxpYyAnc20nOiBib29sZWFuO1xyXG4gICAgcHVibGljICdndC1zbSc6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgJ21kJzogYm9vbGVhbjtcclxuICAgIHB1YmxpYyAnZ3QtbWQnOiBib29sZWFuO1xyXG4gICAgcHVibGljICdsZyc6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgJ2d0LWxnJzogYm9vbGVhbjtcclxuICAgIHB1YmxpYyAneGwnOiBib29sZWFuO1xyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoYnJlYWtwb2ludHM6IE1lZGlhQnJlYWtwb2ludHMsIHdpZHRoOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoYnJlYWtwb2ludHMgPT0gbnVsbCkgcmV0dXJuO1xyXG5cclxuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpc1sneHMnXSA9IHdpZHRoIDw9IGJyZWFrcG9pbnRzLnhzO1xyXG4gICAgICAgIHRoaXNbJ2d0LXhzJ10gPSB3aWR0aCA+IGJyZWFrcG9pbnRzLnhzO1xyXG4gICAgICAgIHRoaXNbJ3NtJ10gPSB3aWR0aCA+IGJyZWFrcG9pbnRzLnhzICYmIHdpZHRoIDw9IGJyZWFrcG9pbnRzLnNtO1xyXG4gICAgICAgIHRoaXNbJ2d0LXNtJ10gPSB3aWR0aCA+IGJyZWFrcG9pbnRzLnNtO1xyXG4gICAgICAgIHRoaXNbJ21kJ10gPSB3aWR0aCA+IGJyZWFrcG9pbnRzLnNtICYmIHdpZHRoIDw9IGJyZWFrcG9pbnRzLm1kO1xyXG4gICAgICAgIHRoaXNbJ2d0LW1kJ10gPSB3aWR0aCA+IGJyZWFrcG9pbnRzLm1kO1xyXG4gICAgICAgIHRoaXNbJ2xnJ10gPSB3aWR0aCA+IGJyZWFrcG9pbnRzLm1kICYmIHdpZHRoIDw9IGJyZWFrcG9pbnRzLmxnO1xyXG4gICAgICAgIHRoaXNbJ2d0LWxnJ10gPSB3aWR0aCA+IGJyZWFrcG9pbnRzLmxnO1xyXG4gICAgICAgIHRoaXNbJ3hsJ10gPSB0aGlzWydndC1sZyddO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgbGV0IE1haW5SZXNpemVkRXZlbnQ6IHN0cmluZyA9ICdwaXBNYWluUmVzaXplZCc7XHJcbmV4cG9ydCBsZXQgTGF5b3V0UmVzaXplZEV2ZW50OiBzdHJpbmcgPSAncGlwTGF5b3V0UmVzaXplZCc7XHJcblxyXG5leHBvcnQgbGV0IE1haW5CcmVha3BvaW50czogTWVkaWFCcmVha3BvaW50cyA9IG5ldyBNZWRpYUJyZWFrcG9pbnRzKDYzOSwgNzE2LCAxMDI0LCAxNDM5KTtcclxuZXhwb3J0IGxldCBNYWluQnJlYWtwb2ludFN0YXR1c2VzOiBNZWRpYUJyZWFrcG9pbnRTdGF0dXNlcyA9IG5ldyBNZWRpYUJyZWFrcG9pbnRTdGF0dXNlcygpO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJTWVkaWFTZXJ2aWNlIHtcclxuICAgIChicmVha3BvaW50OiBzdHJpbmcpOiBib29sZWFuO1xyXG4gICAgYnJlYWtwb2ludHM6IE1lZGlhQnJlYWtwb2ludHM7XHJcbiAgICB3aWR0aDogbnVtYmVyO1xyXG59IFxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJTWVkaWFQcm92aWRlciBleHRlbmRzIG5nLklTZXJ2aWNlUHJvdmlkZXIge1xyXG4gICAgYnJlYWtwb2ludHM6IE1lZGlhQnJlYWtwb2ludHM7XHJcbn1cclxuXHJcbmNsYXNzIE1lZGlhUHJvdmlkZXIgaW1wbGVtZW50cyBJTWVkaWFQcm92aWRlciB7XHJcbiAgICBwdWJsaWMgZ2V0IGJyZWFrcG9pbnRzKCk6IE1lZGlhQnJlYWtwb2ludHMge1xyXG4gICAgICAgIHJldHVybiBNYWluQnJlYWtwb2ludHM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBicmVha3BvaW50cyh2YWx1ZTogTWVkaWFCcmVha3BvaW50cykge1xyXG4gICAgICAgIE1haW5CcmVha3BvaW50cyA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyAkZ2V0KCkge1xyXG4gICAgICAgIGNvbnN0IHNlcnZpY2UgPSBmdW5jdGlvbihzaXplKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYWluQnJlYWtwb2ludFN0YXR1c2VzW3NpemVdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHNlcnZpY2UsICdicmVha3BvaW50cycsIHtcclxuICAgICAgICAgICAgZ2V0OiAoKSA9PiB7IHJldHVybiBNYWluQnJlYWtwb2ludHM7IH0sXHJcbiAgICAgICAgICAgIHNldDogKHZhbHVlKSA9PiB7IFxyXG4gICAgICAgICAgICAgICAgTWFpbkJyZWFrcG9pbnRzID0gdmFsdWUgfHwgbmV3IE1lZGlhQnJlYWtwb2ludHMoNjM5LCA3MTYsIDEwMjQsIDE0MzkpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBNYWluQnJlYWtwb2ludFN0YXR1c2VzLnVwZGF0ZShcclxuICAgICAgICAgICAgICAgICAgICBNYWluQnJlYWtwb2ludHMsIFxyXG4gICAgICAgICAgICAgICAgICAgIE1haW5CcmVha3BvaW50U3RhdHVzZXMud2lkdGhcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHNlcnZpY2UsICd3aWR0aCcsIHtcclxuICAgICAgICAgICAgZ2V0OiAoKSA9PiB7IFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1haW5CcmVha3BvaW50U3RhdHVzZXMud2lkdGg7IFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBzZXJ2aWNlOyBcclxuICAgIH1cclxufVxyXG5cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgncGlwTWVkaWEnKVxyXG4gICAgLnByb3ZpZGVyKCdwaXBNZWRpYScsIE1lZGlhUHJvdmlkZXIpO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5sZXQgYXR0YWNoRXZlbnQgPSAoPGFueT5kb2N1bWVudCkuYXR0YWNoRXZlbnQ7XHJcbmxldCBpc0lFID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvVHJpZGVudC8pO1xyXG5cclxuZnVuY3Rpb24gcmVxdWVzdEZyYW1lKGNhbGxiYWNrKTogYW55IHtcclxuICAgIGxldCBmcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgXHJcbiAgICAgICAgfHwgKDxhbnk+d2luZG93KS5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgXHJcbiAgICAgICAgfHwgKDxhbnk+d2luZG93KS53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgXHJcbiAgICAgICAgfHwgZnVuY3Rpb24oY2FsbGJhY2spIHsgXHJcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgMjApOyAgICAgXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICByZXR1cm4gZnJhbWUoY2FsbGJhY2spO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjYW5jZWxGcmFtZSgpOiBhbnkge1xyXG4gICAgbGV0IGNhbmNlbCA9IHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSBcclxuICAgICAgICB8fCAoPGFueT53aW5kb3cpLm1vekNhbmNlbEFuaW1hdGlvbkZyYW1lIFxyXG4gICAgICAgIHx8ICg8YW55PndpbmRvdykud2Via2l0Q2FuY2VsQW5pbWF0aW9uRnJhbWUgXHJcbiAgICAgICAgfHwgd2luZG93LmNsZWFyVGltZW91dDtcclxuXHJcbiAgICByZXR1cm4gZnVuY3Rpb24oaWQpIHsgXHJcbiAgICAgICAgcmV0dXJuIGNhbmNlbChpZCk7IFxyXG4gICAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVzaXplTGlzdGVuZXIoZXZlbnQ6IGFueSk6IHZvaWQge1xyXG4gICAgY29uc3Qgd2luID0gZXZlbnQudGFyZ2V0IHx8IGV2ZW50LnNyY0VsZW1lbnQ7XHJcbiAgICBpZiAod2luLl9fcmVzaXplUkFGX18pIGNhbmNlbEZyYW1lKC8qd2luLl9fcmVzaXplUkFGX18qLyk7XHJcbiAgICB3aW4uX19yZXNpemVSQUZfXyA9IHJlcXVlc3RGcmFtZShmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCB0cmlnZ2VyID0gd2luLl9fcmVzaXplVHJpZ2dlcl9fO1xyXG4gICAgICAgIHRyaWdnZXIuX19yZXNpemVMaXN0ZW5lcnNfXy5mb3JFYWNoKGZ1bmN0aW9uKGZuKXtcclxuICAgICAgICAgICAgZm4uY2FsbCh0cmlnZ2VyLCBldmVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gbG9hZExpc3RlbmVyKGV2ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgIHRoaXMuY29udGVudERvY3VtZW50LmRlZmF1bHRWaWV3Ll9fcmVzaXplVHJpZ2dlcl9fID0gdGhpcy5fX3Jlc2l6ZUVsZW1lbnRfXztcclxuICAgIHRoaXMuY29udGVudERvY3VtZW50LmRlZmF1bHRWaWV3LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZUxpc3RlbmVyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZFJlc2l6ZUxpc3RlbmVyKGVsZW1lbnQsIGxpc3RlbmVyKTogdm9pZCB7XHJcbiAgICBpZiAoIWVsZW1lbnQuX19yZXNpemVMaXN0ZW5lcnNfXykge1xyXG4gICAgICAgIGVsZW1lbnQuX19yZXNpemVMaXN0ZW5lcnNfXyA9IFtdO1xyXG4gICAgICAgIGlmIChhdHRhY2hFdmVudCkge1xyXG4gICAgICAgICAgICBlbGVtZW50Ll9fcmVzaXplVHJpZ2dlcl9fID0gZWxlbWVudDtcclxuICAgICAgICAgICAgZWxlbWVudC5hdHRhY2hFdmVudCgnb25yZXNpemUnLCByZXNpemVMaXN0ZW5lcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5wb3NpdGlvbiA9PSAnc3RhdGljJykgZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XHJcbiAgICAgICAgICAgIGNvbnN0IG9iajogYW55ID0gZWxlbWVudC5fX3Jlc2l6ZVRyaWdnZXJfXyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29iamVjdCcpO1xyXG4gICAgICAgICAgICBvYmouc2V0QXR0cmlidXRlKCdzdHlsZScsICdkaXNwbGF5OiBibG9jazsgcG9zaXRpb246IGFic29sdXRlOyB0b3A6IDA7IGxlZnQ6IDA7IGhlaWdodDogMTAwJTsgd2lkdGg6IDEwMCU7IG92ZXJmbG93OiBoaWRkZW47IHBvaW50ZXItZXZlbnRzOiBub25lOyB6LWluZGV4OiAtMTsnKTtcclxuICAgICAgICAgICAgb2JqLl9fcmVzaXplRWxlbWVudF9fID0gZWxlbWVudDtcclxuICAgICAgICAgICAgb2JqLm9ubG9hZCA9IGxvYWRMaXN0ZW5lcjtcclxuICAgICAgICAgICAgb2JqLnR5cGUgPSAndGV4dC9odG1sJztcclxuICAgICAgICAgICAgaWYgKGlzSUUpIGVsZW1lbnQuYXBwZW5kQ2hpbGQob2JqKTtcclxuICAgICAgICAgICAgb2JqLmRhdGEgPSAnYWJvdXQ6YmxhbmsnO1xyXG4gICAgICAgICAgICBpZiAoIWlzSUUpIGVsZW1lbnQuYXBwZW5kQ2hpbGQob2JqKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZWxlbWVudC5fX3Jlc2l6ZUxpc3RlbmVyc19fLnB1c2gobGlzdGVuZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlUmVzaXplTGlzdGVuZXIoZWxlbWVudCwgbGlzdGVuZXIpOiB2b2lkIHtcclxuICAgIGlmIChsaXN0ZW5lcikgZWxlbWVudC5fX3Jlc2l6ZUxpc3RlbmVyc19fLnNwbGljZShlbGVtZW50Ll9fcmVzaXplTGlzdGVuZXJzX18uaW5kZXhPZihsaXN0ZW5lciksIDEpO1xyXG4gICAgaWYgKCFlbGVtZW50Ll9fcmVzaXplTGlzdGVuZXJzX18ubGVuZ3RoKSB7XHJcbiAgICAgICAgaWYgKGF0dGFjaEV2ZW50KSBlbGVtZW50LmRldGFjaEV2ZW50KCdvbnJlc2l6ZScsIHJlc2l6ZUxpc3RlbmVyKTtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZWxlbWVudC5fX3Jlc2l6ZVRyaWdnZXJfXy5jb250ZW50RG9jdW1lbnQuZGVmYXVsdFZpZXcucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzaXplTGlzdGVuZXIpO1xyXG4gICAgICAgICAgICBlbGVtZW50Ll9fcmVzaXplVHJpZ2dlcl9fID0gIWVsZW1lbnQucmVtb3ZlQ2hpbGQoZWxlbWVudC5fX3Jlc2l6ZVRyaWdnZXJfXyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdwaXBNZWRpYScsIFtdKTtcclxuXHJcbmltcG9ydCAnLi9NZWRpYVNlcnZpY2UnO1xyXG5pbXBvcnQgJy4vUmVzaXplRnVuY3Rpb25zJztcclxuXHJcbmV4cG9ydCAqIGZyb20gJy4vTWVkaWFTZXJ2aWNlJztcclxuZXhwb3J0ICogZnJvbSAnLi9SZXNpemVGdW5jdGlvbnMnOyJdfQ==