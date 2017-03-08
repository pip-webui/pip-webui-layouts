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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXV4cGFuZWwvQXV4UGFuZWxEaXJlY3RpdmUudHMiLCJzcmMvYXV4cGFuZWwvQXV4UGFuZWxQYXJ0RGlyZWN0aXZlLnRzIiwic3JjL2F1eHBhbmVsL0F1eFBhbmVsU2VydmljZS50cyIsInNyYy9hdXhwYW5lbC9pbmRleC50cyIsInNyYy9pbmRleC50cyIsInNyYy9sYXlvdXRzL0NhcmREaXJlY3RpdmUudHMiLCJzcmMvbGF5b3V0cy9EaWFsb2dEaXJlY3RpdmUudHMiLCJzcmMvbGF5b3V0cy9Eb2N1bWVudERpcmVjdGl2ZS50cyIsInNyYy9sYXlvdXRzL01haW5EaXJlY3RpdmUudHMiLCJzcmMvbGF5b3V0cy9TaW1wbGVEaXJlY3RpdmUudHMiLCJzcmMvbGF5b3V0cy9UaWxlc0RpcmVjdGl2ZS50cyIsInNyYy9tZWRpYS9NZWRpYVNlcnZpY2UudHMiLCJzcmMvbWVkaWEvUmVzaXplRnVuY3Rpb25zLnRzIiwic3JjL21lZGlhL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsWUFBWSxDQUFDO0FBRWIsc0RBQXdEO0FBR3hELENBQUM7SUFFRDtRQUtJLHFDQUFtQixXQUE2QjtZQUh4QyxlQUFVLEdBQVcsR0FBRyxDQUFDO1lBQ3pCLGNBQVMsR0FBVyxHQUFHLENBQUM7WUFHNUIsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7UUFDcEMsQ0FBQztRQUVNLDRDQUFNLEdBQWI7WUFDSSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLDhCQUFlLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDeEYsQ0FBQztRQUVNLDRDQUFNLEdBQWI7WUFDSSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsOEJBQWUsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzdFLENBQUM7UUFDTCxrQ0FBQztJQUFELENBaEJBLEFBZ0JDLElBQUE7SUFFRDtRQUNJLE1BQU0sQ0FBQztZQUNILFFBQVEsRUFBRSxHQUFHO1lBQ2IsT0FBTyxFQUFFLElBQUk7WUFDYixVQUFVLEVBQUUsMkJBQTJCO1lBQ3ZDLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLFlBQVksRUFBRSxJQUFJO1lBQ2xCLFFBQVEsRUFBRSw2SEFBNkg7Z0JBQzNILDJGQUEyRjtnQkFDM0YsZUFBZTtTQUM5QixDQUFBO0lBQ0wsQ0FBQztJQUVELE9BQU87U0FDRixNQUFNLENBQUMsYUFBYSxDQUFDO1NBQ3JCLFNBQVMsQ0FBQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztBQUVqRCxDQUFDLENBQUMsRUFBRSxDQUFDOztBQzFDTCxZQUFZLENBQUM7QUFHYixDQUFDO0lBRUQseUNBQXlDLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxXQUFXO1FBQ3RGLFVBQVUsQ0FBQztRQUVYLElBQUksUUFBUSxHQUFHLEVBQUUsR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDO1FBQzNDLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQztRQUdyQixJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1YsU0FBUyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN2QyxDQUFDO1FBRUQsaUJBQWlCLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUMzQyxVQUFVLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFFeEQsMkJBQTJCLEtBQUssRUFBRSxNQUFNO1lBQ3BDLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO1lBQy9CLElBQUksZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBR3hDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxHQUFHLGdCQUFnQixJQUFJLFNBQVMsR0FBRyxnQkFBZ0IsQ0FBQztRQUNsRixDQUFDO0lBRUwsQ0FBQztJQUVELCtCQUErQixhQUFhO1FBQ3hDLFVBQVUsQ0FBQztRQUVYLElBQUksSUFBSSxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU1QixNQUFNLENBQUM7WUFDSCxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7WUFDM0IsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO1lBQ3ZCLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtZQUN2QixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDdkIsS0FBSyxFQUFFLElBQUk7WUFDWCxJQUFJLEVBQUUsVUFBUyxNQUFXLEVBQUUsUUFBUSxFQUFFLE1BQU07Z0JBRXhDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsY0FBYSxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQSxDQUFDLENBQUMsQ0FBQztnQkFDbkQsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUIsQ0FBQztZQUNELFVBQVUsRUFBRSwrQkFBK0I7U0FDOUMsQ0FBQztJQUNOLENBQUM7SUFFRCxPQUFPO1NBQ0YsTUFBTSxDQUFDLGFBQWEsQ0FBQztTQUNyQixTQUFTLENBQUMsaUJBQWlCLEVBQUUscUJBQXFCLENBQUMsQ0FBQztBQUV6RCxDQUFDLENBQUMsRUFBRSxDQUFDOztBQ3ZETCxZQUFZLENBQUM7QUFFRixRQUFBLG9CQUFvQixHQUFHLG9CQUFvQixDQUFDO0FBQzVDLFFBQUEseUJBQXlCLEdBQUcseUJBQXlCLENBQUM7QUFDdEQsUUFBQSxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQztBQUN0QyxRQUFBLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDO0FBRW5EO0lBQUE7SUFLQSxDQUFDO0lBQUQscUJBQUM7QUFBRCxDQUxBLEFBS0MsSUFBQTtBQUxZLHdDQUFjO0FBd0MzQjtJQU9JLHlCQUFtQixNQUFzQixFQUFFLFVBQWdDLEVBQUUsVUFBdUM7UUFGNUcsT0FBRSxHQUFHLGNBQWMsQ0FBQztRQUd4QixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztJQUMvQixDQUFDO0lBRUQsc0JBQVcsbUNBQU07YUFBakI7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN4QixDQUFDOzs7T0FBQTtJQUVELHNCQUFXLG9DQUFPO2FBQWxCO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1FBQ2hDLENBQUM7OztPQUFBO0lBRUQsc0JBQVcsa0NBQUs7YUFBaEI7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDOUIsQ0FBQzthQUVELFVBQWlCLEtBQVU7WUFDdkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUNqQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDM0IsQ0FBQzs7O09BTEE7SUFPRCxzQkFBVyxrQ0FBSzthQUFoQjtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3ZCLENBQUM7YUFFRCxVQUFpQixLQUFVO1lBQ3ZCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUMxQixJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxpQ0FBeUIsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNqRSxDQUFDOzs7T0FMQTtJQU9NLGdDQUFNLEdBQWI7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDM0MsQ0FBQztJQUVNLDhCQUFJLEdBQVg7UUFDSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0lBRU0sK0JBQUssR0FBWjtRQUNJLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ25DLENBQUM7SUFFTSxnQ0FBTSxHQUFiO1FBQ0ksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDcEMsQ0FBQztJQUVNLGtDQUFRLEdBQWY7UUFBQSxpQkFLQztRQUxlLGlCQUFvQjthQUFwQixVQUFvQixFQUFwQixxQkFBb0IsRUFBcEIsSUFBb0I7WUFBcEIsNEJBQW9COztRQUNoQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFDLENBQUM7WUFDZCxLQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakMsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVNLHFDQUFXLEdBQWxCO1FBQUEsaUJBS0M7UUFMa0IsaUJBQW9CO2FBQXBCLFVBQW9CLEVBQXBCLHFCQUFvQixFQUFwQixJQUFvQjtZQUFwQiw0QkFBb0I7O1FBQ25DLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFVBQUMsQ0FBQztZQUNkLEtBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsVUFBQyxFQUFFLElBQUssT0FBQSxFQUFFLElBQUksQ0FBQyxFQUFQLENBQU8sQ0FBQyxDQUFDO1FBQzNFLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFTSw4QkFBSSxHQUFYLFVBQVksSUFBWSxFQUFFLEtBQVU7UUFDaEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRU8seUNBQWUsR0FBdkI7UUFDSSxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyw0QkFBb0IsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUNMLHNCQUFDO0FBQUQsQ0E3RUEsQUE2RUMsSUFBQTtBQUVEO0lBQUE7UUFDWSxZQUFPLEdBQW1CO1lBQzlCLEtBQUssRUFBRSxFQUFFO1lBQ1QsT0FBTyxFQUFFLEVBQUU7WUFDWCxJQUFJLEVBQUUsUUFBUTtZQUNkLEtBQUssRUFBRSxJQUFJO1NBQ2QsQ0FBQztJQXdFTixDQUFDO0lBcEVHLHNCQUFXLG9DQUFNO2FBQWpCO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDeEIsQ0FBQzthQUVELFVBQWtCLEtBQXFCO1lBQ25DLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxJQUFJLElBQUksY0FBYyxFQUFFLENBQUM7UUFDakQsQ0FBQzs7O09BSkE7SUFNRCxzQkFBVyxtQ0FBSzthQUFoQjtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUM5QixDQUFDO2FBRUQsVUFBaUIsS0FBVTtZQUN2QixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxLQUFLLElBQUksRUFBRSxDQUFDO1FBQ3JDLENBQUM7OztPQUpBO0lBTUQsc0JBQVcsa0NBQUk7YUFBZjtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztRQUM3QixDQUFDO2FBRUQsVUFBZ0IsS0FBYTtZQUN6QixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7UUFDOUIsQ0FBQzs7O09BSkE7SUFNRCxzQkFBVyxxQ0FBTzthQUFsQjtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUNoQyxDQUFDO2FBRUQsVUFBbUIsS0FBZTtZQUM5QixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxLQUFLLElBQUksRUFBRSxDQUFDO1FBQ3ZDLENBQUM7OztPQUpBO0lBTU0sbUNBQVEsR0FBZjtRQUFBLGlCQUlDO1FBSmUsaUJBQW9CO2FBQXBCLFVBQW9CLEVBQXBCLHFCQUFvQixFQUFwQixJQUFvQjtZQUFwQiw0QkFBb0I7O1FBQ2hDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFVBQUMsQ0FBQztZQUNkLEtBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTSxzQ0FBVyxHQUFsQjtRQUFBLGlCQUlDO1FBSmtCLGlCQUFvQjthQUFwQixVQUFvQixFQUFwQixxQkFBb0IsRUFBcEIsSUFBb0I7WUFBcEIsNEJBQW9COztRQUNuQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFDLENBQUM7WUFDZCxLQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLFVBQUMsRUFBRSxJQUFLLE9BQUEsRUFBRSxJQUFJLENBQUMsRUFBUCxDQUFPLENBQUMsQ0FBQztRQUMzRSxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTSwrQkFBSSxHQUFYLFVBQVksSUFBWSxFQUFFLEtBQVU7UUFDaEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDO0lBQ3JDLENBQUM7SUFFTSwrQkFBSSxHQUFYO1FBQ0ksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRU0sZ0NBQUssR0FBWjtRQUNJLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVNLGlDQUFNLEdBQWI7UUFDSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFTSwrQkFBSSxHQUFYLFVBQVksVUFBZ0MsRUFBRSxVQUF1QztRQUNqRixVQUFVLENBQUM7UUFFWCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQztZQUN0QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRTlFLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3pCLENBQUM7SUFDTCx1QkFBQztBQUFELENBOUVBLEFBOEVDLElBQUE7QUFFRCw0QkFBNEIsVUFBZ0MsRUFBRSxXQUE2QjtJQUN2RixVQUFVLENBQUMsR0FBRyxDQUFDLHlCQUFpQixFQUFFLGNBQVEsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakUsVUFBVSxDQUFDLEdBQUcsQ0FBQywwQkFBa0IsRUFBRSxjQUFRLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZFLENBQUM7QUFFRCxPQUFPO0tBQ0YsTUFBTSxDQUFDLGFBQWEsQ0FBQztLQUNyQixRQUFRLENBQUMsYUFBYSxFQUFFLGdCQUFnQixDQUFDO0tBQ3pDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOztBQ3RON0IsWUFBWSxDQUFDOzs7O0FBRWIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0FBRTlDLDZCQUEyQjtBQUMzQixtQ0FBaUM7QUFDakMsK0JBQTZCO0FBRTdCLHVDQUFrQzs7QUNSbEMsWUFBWSxDQUFDOzs7O0FBRWIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxZQUFZLEVBQUUsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUM7QUFFdkUseUJBQXVCO0FBRXZCLG1DQUFpQztBQUNqQyxtQ0FBaUM7QUFDakMscUNBQW1DO0FBQ25DLHVDQUFxQztBQUNyQyxxQ0FBbUM7QUFDbkMsb0NBQWtDO0FBQ2xDLDRCQUEwQjtBQUUxQixtQ0FBOEI7O0FDZDlCLFlBQVksQ0FBQztBQUViLHNEQUFxRztBQUdyRyxDQUFDO0lBU0Q7UUFFSSwyQkFDWSxVQUFnQyxFQUNoQyxRQUFnQixFQUNoQixNQUFnQztZQUg1QyxpQkFtQkM7WUFsQlcsZUFBVSxHQUFWLFVBQVUsQ0FBc0I7WUFDaEMsYUFBUSxHQUFSLFFBQVEsQ0FBUTtZQUNoQixXQUFNLEdBQU4sTUFBTSxDQUEwQjtZQUl4QyxRQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRTlCLElBQUksUUFBUSxHQUFHLGNBQVEsS0FBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBR3ZDLFVBQVUsQ0FBQyxHQUFHLENBQUMsK0JBQWdCLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFHM0MsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBR2QsVUFBVSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM5QixDQUFDO1FBRU8sa0NBQU0sR0FBZDtZQUFBLGlCQThFQztZQTdFRyxJQUNJLFNBQVMsR0FBRyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsRUFDL0IsYUFBYSxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxFQUN4QyxXQUFXLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3hDLElBQ0ksUUFBUSxHQUFHLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFDNUIsU0FBUyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsRUFDOUIsUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQ2pGLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUNwRixLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksRUFDeEUsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQzNFLElBQUksRUFBRSxHQUFHLENBQUM7WUFHZCxFQUFFLENBQUMsQ0FBQyxxQ0FBc0IsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixRQUFRLEdBQUcsSUFBSSxDQUFDO2dCQUNoQixTQUFTLEdBQUcsSUFBSSxDQUFDO2dCQUNqQixLQUFLLEdBQUcsSUFBSSxDQUFDO2dCQUNiLE1BQU0sR0FBRyxJQUFJLENBQUM7Z0JBQ2QsUUFBUSxHQUFHLElBQUksQ0FBQztnQkFDaEIsU0FBUyxHQUFHLElBQUksQ0FBQztZQUNyQixDQUFDO1lBRUQsSUFBSSxDQUFDLENBQUM7Z0JBRUYsSUFBTSxLQUFLLEdBQUcscUNBQXNCLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztnQkFDeEQsUUFBUSxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7Z0JBQ3RCLFNBQVMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUd2QixRQUFRLEdBQUcsUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQztnQkFDMUQsU0FBUyxHQUFHLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUM7Z0JBRzlELEtBQUssR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDO2dCQUNqRCxNQUFNLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUN6RCxDQUFDO1lBR0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFFBQVEsR0FBRyxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ2hFLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxRQUFRLEdBQUcsUUFBUSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQztZQUNoRSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxHQUFHLEtBQUssR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDdEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLE1BQU0sR0FBRyxNQUFNLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBRXpELEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLFNBQVMsR0FBRyxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUNuRSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsU0FBUyxHQUFHLFNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBQ25FLElBQ0ksT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLEVBQ25ELE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxFQUNuRCxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQzVDLElBQUksYUFBYSxHQUFHLFNBQVMsSUFBSSxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBRXBELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO29CQUNuQixhQUFhLElBQUksT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDL0MsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7b0JBQ25CLGFBQWEsSUFBSSxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUUvQyxLQUFLLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxhQUFhLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFDbEQsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLGFBQWEsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQ3JDLEVBQUUsQ0FBQyxDQUFDLHFDQUFzQixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQzVCLElBQUksR0FBRyxDQUFDLENBQUM7b0JBQ1QsR0FBRyxHQUFHLENBQUMsQ0FBQztnQkFDWixDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLElBQUksR0FBRyxhQUFhLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDbEUsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BGLENBQUM7Z0JBRUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNoQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBRTlCLFVBQVUsQ0FBQyxjQUFRLEtBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNyRSxDQUFDO1lBR0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUM5QyxDQUFDO1FBQ0wsd0JBQUM7SUFBRCxDQXRHQSxBQXNHQyxJQUFBO0lBRUQsdUJBQXVCLFVBQWdDO1FBQ25ELFVBQVUsQ0FBQztRQUVYLE1BQU0sQ0FBQztZQUNILFFBQVEsRUFBRSxJQUFJO1lBQ2QsSUFBSSxFQUFFLFVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNO2dCQUMzQixJQUFJLGlCQUFpQixDQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDeEQsQ0FBQztTQUNKLENBQUE7SUFDTCxDQUFDO0lBR0QsT0FBTztTQUNGLE1BQU0sQ0FBQyxXQUFXLENBQUM7U0FDbkIsU0FBUyxDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUMsQ0FBQztBQUV6QyxDQUFDLENBQUMsRUFBRSxDQUFDOztBQ3RJTCxZQUFZLENBQUM7QUFHYixDQUFDO0lBRUQ7UUFDSSxNQUFNLENBQUM7WUFDSCxRQUFRLEVBQUUsSUFBSTtZQUNkLElBQUksRUFBRSxVQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTTtnQkFDM0IsUUFBUSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNwQyxDQUFDO1NBQ0osQ0FBQztJQUNOLENBQUM7SUFFRCxPQUFPO1NBQ0YsTUFBTSxDQUFDLFdBQVcsQ0FBQztTQUNuQixTQUFTLENBQUMsV0FBVyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBRTdDLENBQUMsQ0FBQyxFQUFFLENBQUM7O0FDbEJMLFlBQVksQ0FBQztBQUdiLENBQUM7SUFFRDtRQUNJLE1BQU0sQ0FBQztZQUNILFFBQVEsRUFBRSxJQUFJO1lBQ2QsSUFBSSxFQUFFLFVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNO2dCQUMzQixRQUFRLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ3RDLENBQUM7U0FDSixDQUFDO0lBQ04sQ0FBQztJQUVELE9BQU87U0FDRixNQUFNLENBQUMsV0FBVyxDQUFDO1NBQ25CLFNBQVMsQ0FBQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztBQUVqRCxDQUFDLENBQUMsRUFBRSxDQUFDOztBQ2xCTCxZQUFZLENBQUM7QUFFYiw0REFBbUY7QUFDbkYsc0RBQWtHO0FBR2xHLENBQUM7SUFNRDtRQUdJLGlDQUNZLE1BQWlCLEVBQ2pCLFFBQXFDLEVBQ3JDLFVBQWdDLEVBQ2hDLFFBQTRCLEVBQzVCLE1BQWdDO1lBTDVDLGlCQXVCQztZQXRCVyxXQUFNLEdBQU4sTUFBTSxDQUFXO1lBQ2pCLGFBQVEsR0FBUixRQUFRLENBQTZCO1lBQ3JDLGVBQVUsR0FBVixVQUFVLENBQXNCO1lBQ2hDLGFBQVEsR0FBUixRQUFRLENBQW9CO1lBQzVCLFdBQU0sR0FBTixNQUFNLENBQTBCO1lBRXhDLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLFFBQVEsQ0FBQztZQUcxRSxRQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRzlCLElBQU0sUUFBUSxHQUFHLGNBQVEsS0FBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFDLG1DQUFpQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFHaEQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUU7Z0JBQ25CLHNDQUFvQixDQUFDLEtBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDdkQsQ0FBQyxDQUFDLENBQUM7WUFHSCxJQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztRQUNwQyxDQUFDO1FBRU8sMERBQXdCLEdBQWhDO1lBQUEsaUJBZUM7WUFkRyxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQzNDLElBQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUV2QixxQ0FBc0IsQ0FBQyxNQUFNLENBQUMsOEJBQWUsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUV0RCxDQUFDLENBQUMsSUFBSSxDQUFDLHFDQUFzQixFQUFFLFVBQUMsVUFBVSxFQUFFLE1BQU07Z0JBQzlDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLFVBQVUsR0FBRSxhQUFhLENBQUMsQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLENBQUM7Z0JBQ2xFLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBQ1YsS0FBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUM3QixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7UUFFTyx3Q0FBTSxHQUFkO1lBQ0ksSUFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUM7WUFDaEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsK0JBQWdCLEVBQUUscUNBQXNCLENBQUMsQ0FBQztRQUNwRSxDQUFDO1FBQ0wsOEJBQUM7SUFBRCxDQWpEQSxBQWlEQyxJQUFBO0lBRUQ7UUFDSSwrQkFDSSxNQUFpQixFQUNqQixRQUFxQztZQUdyQyxRQUFRLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3ZDLENBQUM7UUFDTCw0QkFBQztJQUFELENBUkEsQUFRQyxJQUFBO0lBRUQ7UUFDSSxNQUFNLENBQUM7WUFDSCxRQUFRLEVBQUUsSUFBSTtZQUNkLFVBQVUsRUFBRSx1QkFBdUI7WUFDbkMsWUFBWSxFQUFFLElBQUk7U0FDckIsQ0FBQTtJQUNMLENBQUM7SUFFRDtRQUNJLE1BQU0sQ0FBQztZQUNILFFBQVEsRUFBRSxJQUFJO1lBQ2QsSUFBSSxFQUFFLHFCQUFxQjtTQUM5QixDQUFBO0lBQ0wsQ0FBQztJQUVELE9BQU87U0FDRixNQUFNLENBQUMsV0FBVyxDQUFDO1NBQ25CLFNBQVMsQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDO1NBQ25DLFNBQVMsQ0FBQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztBQUVqRCxDQUFDLENBQUMsRUFBRSxDQUFDOztBQzdGTCxZQUFZLENBQUM7QUFHYixDQUFDO0lBRUQ7UUFDSSxNQUFNLENBQUM7WUFDSCxRQUFRLEVBQUUsSUFBSTtZQUNkLElBQUksRUFBRSxVQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTTtnQkFDM0IsUUFBUSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNwQyxDQUFDO1NBQ0osQ0FBQztJQUNOLENBQUM7SUFFRCxPQUFPO1NBQ0YsTUFBTSxDQUFDLFdBQVcsQ0FBQztTQUNuQixTQUFTLENBQUMsV0FBVyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBRTdDLENBQUMsQ0FBQyxFQUFFLENBQUM7O0FDbEJMLFlBQVksQ0FBQztBQUViLDREQUFtRjtBQUNuRixzREFBc0g7QUFJdEg7SUFVSSw0QkFBbUIsTUFBaUIsRUFBRSxRQUFhLEVBQUUsVUFBZ0MsRUFBRSxNQUFXO1FBQWxHLGlCQStCQztRQTlCRyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUVyQixJQUFJLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsR0FBRztZQUM3RSxJQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUM7WUFDM0QsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUk7WUFDL0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUdqRCxRQUFRLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRy9CLElBQUksUUFBUSxHQUFHLGNBQVEsS0FBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QyxtQ0FBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFHekMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUU7WUFDbkIsc0NBQW9CLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2hELENBQUMsQ0FBQyxDQUFDO1FBR0gsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsb0NBQW9DLENBQUMsQ0FBQztRQUN0RCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFHdEMsVUFBVSxDQUFDLEdBQUcsQ0FBQywrQkFBZ0IsRUFBRSxjQUFRLEtBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUdoRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RCLENBQUM7SUFFTyxtQ0FBTSxHQUFkLFVBQWUsS0FBYztRQUN6QixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzNDLElBQUksY0FBYyxDQUFDO1FBRW5CLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUVkLEVBQUUsQ0FBQyxDQUFDLHFDQUFzQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ3RFLEtBQUssR0FBRyxLQUFLLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUV2QixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDcEQsY0FBYyxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUMsR0FBRyxPQUFPLEdBQUcsRUFBRSxDQUFDO1lBRXpELEVBQUUsQ0FBQyxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixPQUFPLEVBQUUsQ0FBQztnQkFDVixjQUFjLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQyxHQUFHLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDN0QsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNkLGNBQWMsR0FBRyxLQUFLLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxjQUFjLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFDcEQsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxDQUFDO1lBQ3ZELENBQUM7WUFHRCxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFDM0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDOUMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osS0FBSyxHQUFHLEtBQUssR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZCLGNBQWMsR0FBRyxLQUFLLENBQUM7WUFFdkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLGNBQWMsR0FBRyxJQUFJLENBQUMsQ0FBQztZQUVoRCxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFDM0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDM0MsQ0FBQztRQUdELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsSUFBSSxjQUFjLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN0RCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsY0FBYyxDQUFDO1lBQzFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7WUFHdkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsaUNBQWtCLENBQUMsQ0FBQztRQUM5QyxDQUFDO0lBQ0wsQ0FBQztJQUNMLHlCQUFDO0FBQUQsQ0F6RkEsQUF5RkMsSUFBQTtBQUVELHdCQUF3QixVQUFnQztJQUNwRCxVQUFVLENBQUM7SUFHWCwwQkFBMEIsS0FBSztRQUMzQixFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDO1lBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNoQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDekIsS0FBSyxHQUFHLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN2QyxNQUFNLENBQUMsS0FBSyxJQUFJLEdBQUcsSUFBSSxLQUFLLElBQUksTUFBTSxDQUFDO0lBQzNDLENBQUM7SUFFRCxNQUFNLENBQUM7UUFDSCxRQUFRLEVBQUUsSUFBSTtRQUNkLEtBQUssRUFBRSxLQUFLO1FBQ1osVUFBVSxFQUFFLElBQUk7UUFDaEIsUUFBUSxFQUNKLFVBQUMsUUFBYSxFQUFFLE1BQVc7WUFDdkIsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkMsTUFBTSxDQUFDLE1BQU0sRUFBRTtzQkFDYiwrRUFBK0U7c0JBQy9FLHlFQUF5RTtzQkFDekUsd0VBQXdFO3NCQUN4RSx1Q0FBdUM7c0JBQ3ZDLFFBQVEsQ0FBQztZQUNmLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUMsTUFBTSxFQUFFO3NCQUNULCtFQUErRTtzQkFDL0UseUVBQXlFO3NCQUN6RSxrQ0FBa0M7c0JBQ2xDLFFBQVEsQ0FBQztZQUNuQixDQUFDO1FBQ0wsQ0FBQztRQUNMLFVBQVUsRUFBRSxVQUFDLE1BQVc7WUFDcEIsTUFBTSxDQUFDLFlBQVksR0FBRztnQkFDbEIsTUFBTSxFQUFFLENBQUM7Z0JBQ1QsVUFBVSxFQUFFLEtBQUs7Z0JBQ2pCLGFBQWEsRUFBRSxLQUFLO2dCQUNwQixrQkFBa0IsRUFBRSxDQUFDO2FBQ3hCLENBQUM7UUFDTixDQUFDO1FBQ0QsSUFBSSxFQUFFLFVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNO1lBQzNCLElBQUksa0JBQWtCLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDakUsQ0FBQztLQUNKLENBQUM7QUFDTixDQUFDO0FBRUQsT0FBTztLQUNGLE1BQU0sQ0FBQyxXQUFXLENBQUM7S0FDbkIsU0FBUyxDQUFDLFVBQVUsRUFBRSxjQUFjLENBQUMsQ0FBQzs7QUNsSjNDLFlBQVksQ0FBQztBQUViO0lBQ0ksMEJBQ0ksRUFBVSxFQUFFLEVBQVUsRUFBRSxFQUFVLEVBQUUsRUFBVTtRQUU5QyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUNqQixDQUFDO0lBTUwsdUJBQUM7QUFBRCxDQWRBLEFBY0MsSUFBQTtBQWRZLDRDQUFnQjtBQWdCN0I7SUFBQTtJQTBCQSxDQUFDO0lBZFUsd0NBQU0sR0FBYixVQUFjLFdBQTZCLEVBQUUsS0FBYTtRQUN0RCxFQUFFLENBQUMsQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDO1lBQUMsTUFBTSxDQUFDO1FBRWhDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLElBQUksV0FBVyxDQUFDLEVBQUUsQ0FBQztRQUNyQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsS0FBSyxHQUFHLFdBQVcsQ0FBQyxFQUFFLENBQUM7UUFDdkMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssR0FBRyxXQUFXLENBQUMsRUFBRSxJQUFJLEtBQUssSUFBSSxXQUFXLENBQUMsRUFBRSxDQUFDO1FBQy9ELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxLQUFLLEdBQUcsV0FBVyxDQUFDLEVBQUUsQ0FBQztRQUN2QyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxHQUFHLFdBQVcsQ0FBQyxFQUFFLElBQUksS0FBSyxJQUFJLFdBQVcsQ0FBQyxFQUFFLENBQUM7UUFDL0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEtBQUssR0FBRyxXQUFXLENBQUMsRUFBRSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLEdBQUcsV0FBVyxDQUFDLEVBQUUsSUFBSSxLQUFLLElBQUksV0FBVyxDQUFDLEVBQUUsQ0FBQztRQUMvRCxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsS0FBSyxHQUFHLFdBQVcsQ0FBQyxFQUFFLENBQUM7UUFDdkMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBQ0wsOEJBQUM7QUFBRCxDQTFCQSxBQTBCQyxJQUFBO0FBMUJZLDBEQUF1QjtBQTRCekIsUUFBQSxnQkFBZ0IsR0FBVyxnQkFBZ0IsQ0FBQztBQUM1QyxRQUFBLGtCQUFrQixHQUFXLGtCQUFrQixDQUFDO0FBRWhELFFBQUEsZUFBZSxHQUFxQixJQUFJLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQy9FLFFBQUEsc0JBQXNCLEdBQTRCLElBQUksdUJBQXVCLEVBQUUsQ0FBQztBQVkzRjtJQUFBO0lBa0NBLENBQUM7SUFqQ0csc0JBQVcsc0NBQVc7YUFBdEI7WUFDSSxNQUFNLENBQUMsdUJBQWUsQ0FBQztRQUMzQixDQUFDO2FBRUQsVUFBdUIsS0FBdUI7WUFDMUMsdUJBQWUsR0FBRyxLQUFLLENBQUM7UUFDNUIsQ0FBQzs7O09BSkE7SUFNTSw0QkFBSSxHQUFYO1FBQ0ksSUFBSSxPQUFPLEdBQUcsVUFBUyxJQUFJO1lBQ3ZCLE1BQU0sQ0FBQyw4QkFBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUE7UUFFRCxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUU7WUFDMUMsR0FBRyxFQUFFLGNBQVEsTUFBTSxDQUFDLHVCQUFlLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLEdBQUcsRUFBRSxVQUFDLEtBQUs7Z0JBQ1AsdUJBQWUsR0FBRyxLQUFLLElBQUksSUFBSSxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFFdEUsOEJBQXNCLENBQUMsTUFBTSxDQUN6Qix1QkFBZSxFQUNmLDhCQUFzQixDQUFDLEtBQUssQ0FDL0IsQ0FBQztZQUNOLENBQUM7U0FDSixDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUU7WUFDcEMsR0FBRyxFQUFFO2dCQUNELE1BQU0sQ0FBQyw4QkFBc0IsQ0FBQyxLQUFLLENBQUM7WUFDeEMsQ0FBQztTQUNKLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUNMLG9CQUFDO0FBQUQsQ0FsQ0EsQUFrQ0MsSUFBQTtBQUVELE9BQU87S0FDRixNQUFNLENBQUMsVUFBVSxDQUFDO0tBQ2xCLFFBQVEsQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDLENBQUM7O0FDcEd6QyxZQUFZLENBQUM7QUFFYixJQUFJLFdBQVcsR0FBUyxRQUFTLENBQUMsV0FBVyxDQUFDO0FBQzlDLElBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBRWhELHNCQUFzQixRQUFRO0lBQzFCLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxxQkFBcUI7V0FDM0IsTUFBTyxDQUFDLHdCQUF3QjtXQUNoQyxNQUFPLENBQUMsMkJBQTJCO1dBQ3pDLFVBQVMsUUFBUTtZQUNoQixNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDM0MsQ0FBQyxDQUFDO0lBRU4sTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMzQixDQUFDO0FBRUQ7SUFDSSxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsb0JBQW9CO1dBQzNCLE1BQU8sQ0FBQyx1QkFBdUI7V0FDL0IsTUFBTyxDQUFDLDBCQUEwQjtXQUN4QyxNQUFNLENBQUMsWUFBWSxDQUFDO0lBRTNCLE1BQU0sQ0FBQyxVQUFTLEVBQUU7UUFDZCxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3RCLENBQUMsQ0FBQztBQUNOLENBQUM7QUFFRCx3QkFBd0IsS0FBVTtJQUM5QixJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUM7SUFDM0MsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQztRQUFDLFdBQVcsRUFBdUIsQ0FBQztJQUMxRCxHQUFHLENBQUMsYUFBYSxHQUFHLFlBQVksQ0FBQztRQUM3QixJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUMsaUJBQWlCLENBQUM7UUFDcEMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxVQUFTLEVBQUU7WUFDM0MsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUM7QUFFRCxzQkFBc0IsS0FBVTtJQUM1QixJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7SUFDNUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBQ2hGLENBQUM7QUFFRCwyQkFBa0MsT0FBTyxFQUFFLFFBQVE7SUFDL0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO1FBQy9CLE9BQU8sQ0FBQyxtQkFBbUIsR0FBRyxFQUFFLENBQUM7UUFDakMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNkLE9BQU8sQ0FBQyxpQkFBaUIsR0FBRyxPQUFPLENBQUM7WUFDcEMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDcEQsQ0FBQztRQUNELElBQUksQ0FBQyxDQUFDO1lBQ0YsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQztnQkFBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7WUFDeEYsSUFBSSxHQUFHLEdBQVEsT0FBTyxDQUFDLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDNUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsc0lBQXNJLENBQUMsQ0FBQztZQUNsSyxHQUFHLENBQUMsaUJBQWlCLEdBQUcsT0FBTyxDQUFDO1lBQ2hDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsWUFBWSxDQUFDO1lBQzFCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDO1lBQ3ZCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ25DLEdBQUcsQ0FBQyxJQUFJLEdBQUcsYUFBYSxDQUFDO1lBQ3pCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDeEMsQ0FBQztJQUNMLENBQUM7SUFFRCxPQUFPLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9DLENBQUM7QUFyQkQsOENBcUJDO0FBRUQsOEJBQXFDLE9BQU8sRUFBRSxRQUFRO0lBQ2xELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQztRQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNuRyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQztZQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ2pFLElBQUksQ0FBQyxDQUFDO1lBQ0YsT0FBTyxDQUFDLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsbUJBQW1CLENBQUMsUUFBUSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBQ3BHLE9BQU8sQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDaEYsQ0FBQztJQUNMLENBQUM7QUFDTCxDQUFDO0FBVEQsb0RBU0M7O0FDM0VELFlBQVksQ0FBQzs7OztBQUViLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBRS9CLDBCQUF3QjtBQUN4Qiw2QkFBMkI7QUFFM0Isb0NBQStCO0FBQy9CLHVDQUFrQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgeyBNYWluQnJlYWtwb2ludHMgfSBmcm9tICcuLi9tZWRpYS9NZWRpYVNlcnZpY2UnO1xyXG5pbXBvcnQgeyBJQXV4UGFuZWxTZXJ2aWNlIH0gZnJvbSAnLi9BdXhQYW5lbFNlcnZpY2UnO1xyXG5cclxuKCgpID0+IHtcclxuXHJcbmNsYXNzIEF1eFBhbmVsRGlyZWN0aXZlQ29udHJvbGxlciB7XHJcbiAgICBwcml2YXRlIF9waXBBdXhQYW5lbDogSUF1eFBhbmVsU2VydmljZTtcclxuICAgIHByaXZhdGUgbm9ybWFsU2l6ZTogbnVtYmVyID0gMzIwO1xyXG4gICAgcHJpdmF0ZSBsYXJnZVNpemU6IG51bWJlciA9IDQ4MDtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IocGlwQXV4UGFuZWw6IElBdXhQYW5lbFNlcnZpY2UpIHtcclxuICAgICAgICB0aGlzLl9waXBBdXhQYW5lbCA9IHBpcEF1eFBhbmVsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpc0d0eHMoKTpib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gTnVtYmVyKCQoJ2JvZHknKS53aWR0aCgpKSA+IE1haW5CcmVha3BvaW50cy54cyAmJiB0aGlzLl9waXBBdXhQYW5lbC5pc09wZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaXNHdGxnKCk6Ym9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIE51bWJlcigkKCdib2R5Jykud2lkdGgoKSkgPiAoTWFpbkJyZWFrcG9pbnRzLmxnICsgdGhpcy5sYXJnZVNpemUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBBdXhQYW5lbERpcmVjdGl2ZSgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICByZXBsYWNlOiB0cnVlLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IEF1eFBhbmVsRGlyZWN0aXZlQ29udHJvbGxlcixcclxuICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICB0ZW1wbGF0ZTogJzxtZC1zaWRlbmF2IGNsYXNzPVwibWQtc2lkZW5hdi1yaWdodCBtZC13aGl0ZWZyYW1lLXoyIHBpcC1hdXhwYW5lbCBjb2xvci1jb250ZW50LWJnXCIgbmctY2xhc3M9XCJ7XFwncGlwLWxhcmdlXFwnOiB2bS5pc0d0bGcoKX1cIicgKyBcclxuICAgICAgICAgICAgICAgICAgICAnbWQtY29tcG9uZW50LWlkPVwicGlwLWF1eHBhbmVsXCIgbWQtaXMtbG9ja2VkLW9wZW49XCJ2bS5pc0d0eHMoKVwiIHBpcC1mb2N1c2VkIG5nLXRyYW5zY2x1ZGU+JyArIFxyXG4gICAgICAgICAgICAgICAgICAgICc8L21kLXNpZGVuYXY+J1xyXG4gICAgfVxyXG59XHJcblxyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdwaXBBdXhQYW5lbCcpXHJcbiAgICAuZGlyZWN0aXZlKCdwaXBBdXhQYW5lbCcsIEF1eFBhbmVsRGlyZWN0aXZlKTtcclxuXHJcbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy8gUHJldmVudCBqdW5rIGZyb20gZ29pbmcgaW50byB0eXBlc2NyaXB0IGRlZmluaXRpb25zXHJcbigoKSA9PiB7XHJcblxyXG5mdW5jdGlvbiBBdXhQYW5lbFBhcnREaXJlY3RpdmVDb250cm9sbGVyKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJHJvb3RTY29wZSwgcGlwQXV4UGFuZWwpIHtcclxuICAgIFwibmdJbmplY3RcIjtcclxuXHJcbiAgICB2YXIgcGFydE5hbWUgPSAnJyArICRhdHRycy5waXBBdXhQYW5lbFBhcnQ7XHJcbiAgICB2YXIgcGFydFZhbHVlID0gbnVsbDtcclxuXHJcbiAgICAvLyBCcmVhayBwYXJ0IGFwYXJ0XHJcbiAgICB2YXIgcG9zID0gcGFydE5hbWUuaW5kZXhPZignOicpO1xyXG4gICAgaWYgKHBvcyA+IDApIHtcclxuICAgICAgICBwYXJ0VmFsdWUgPSBwYXJ0TmFtZS5zdWJzdHIocG9zICsgMSk7XHJcbiAgICAgICAgcGFydE5hbWUgPSBwYXJ0TmFtZS5zdWJzdHIoMCwgcG9zKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkF1eFBhbmVsQ2hhbmdlZChudWxsLCBwaXBBdXhQYW5lbC5jb25maWcpXHJcbiAgICAkcm9vdFNjb3BlLiRvbigncGlwQXV4UGFuZWxDaGFuZ2VkJywgb25BdXhQYW5lbENoYW5nZWQpO1xyXG5cclxuICAgIGZ1bmN0aW9uIG9uQXV4UGFuZWxDaGFuZ2VkKGV2ZW50LCBjb25maWcpIHtcclxuICAgICAgICB2YXIgcGFydHMgPSBjb25maWcucGFydHMgfHwge307XHJcbiAgICAgICAgdmFyIGN1cnJlbnRQYXJ0VmFsdWUgPSBjb25maWdbcGFydE5hbWVdO1xyXG4gICAgICAgIC8vIFNldCB2aXNpYmxlIHZhcmlhYmxlIHRvIHN3aXRjaCBuZ0lmXHJcblxyXG4gICAgICAgICRzY29wZS52aXNpYmxlID0gcGFydFZhbHVlID8gY3VycmVudFBhcnRWYWx1ZSA9PSBwYXJ0VmFsdWUgOiBjdXJyZW50UGFydFZhbHVlO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZnVuY3Rpb24gQXV4UGFuZWxQYXJ0RGlyZWN0aXZlKG5nSWZEaXJlY3RpdmUpIHtcclxuICAgIFwibmdJbmplY3RcIjtcclxuXHJcbiAgICB2YXIgbmdJZiA9IG5nSWZEaXJlY3RpdmVbMF07XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0cmFuc2NsdWRlOiBuZ0lmLnRyYW5zY2x1ZGUsXHJcbiAgICAgICAgcHJpb3JpdHk6IG5nSWYucHJpb3JpdHksXHJcbiAgICAgICAgdGVybWluYWw6IG5nSWYudGVybWluYWwsXHJcbiAgICAgICAgcmVzdHJpY3Q6IG5nSWYucmVzdHJpY3QsXHJcbiAgICAgICAgc2NvcGU6IHRydWUsXHJcbiAgICAgICAgbGluazogZnVuY3Rpb24oJHNjb3BlOiBhbnksICRlbGVtZW50LCAkYXR0cnMpIHtcclxuICAgICAgICAgICAgLy8gVmlzdWFsaXplIGJhc2VkIG9uIHZpc2libGUgdmFyaWFibGUgaW4gc2NvcGVcclxuICAgICAgICAgICAgJGF0dHJzLm5nSWYgPSBmdW5jdGlvbigpIHsgcmV0dXJuICRzY29wZS52aXNpYmxlIH07XHJcbiAgICAgICAgICAgIG5nSWYubGluay5hcHBseShuZ0lmKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IEF1eFBhbmVsUGFydERpcmVjdGl2ZUNvbnRyb2xsZXJcclxuICAgIH07XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ3BpcEF1eFBhbmVsJylcclxuICAgIC5kaXJlY3RpdmUoJ3BpcEF1eFBhbmVsUGFydCcsIEF1eFBhbmVsUGFydERpcmVjdGl2ZSk7XHJcblxyXG59KSgpOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmV4cG9ydCBsZXQgQXV4UGFuZWxDaGFuZ2VkRXZlbnQgPSAncGlwQXV4UGFuZWxDaGFuZ2VkJztcclxuZXhwb3J0IGxldCBBdXhQYW5lbFN0YXRlQ2hhbmdlZEV2ZW50ID0gJ3BpcEF1eFBhbmVsU3RhdGVDaGFuZ2VkJztcclxuZXhwb3J0IGxldCBPcGVuQXV4UGFuZWxFdmVudCA9ICdwaXBPcGVuQXV4UGFuZWwnO1xyXG5leHBvcnQgbGV0IENsb3NlQXV4UGFuZWxFdmVudCA9ICdwaXBDbG9zZUF1eFBhbmVsJztcclxuXHJcbmV4cG9ydCBjbGFzcyBBdXhQYW5lbENvbmZpZyB7XHJcbiAgICBwYXJ0czogYW55O1xyXG4gICAgY2xhc3Nlczogc3RyaW5nW107XHJcbiAgICBzdGF0ZTogYW55O1xyXG4gICAgdHlwZTogc3RyaW5nO1xyXG59IFxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQXV4UGFuZWxTZXJ2aWNlIHtcclxuICAgIHJlYWRvbmx5IGNvbmZpZzogQXV4UGFuZWxDb25maWc7XHJcbiAgICByZWFkb25seSBjbGFzc2VzOiBzdHJpbmdbXTtcclxuICAgIHBhcnRzOiBhbnk7XHJcbiAgICBzdGF0ZTogYW55OyAgICBcclxuXHJcbiAgICBpc09wZW4oKTogYm9vbGVhbjtcclxuICAgIG9wZW4oKTogdm9pZDtcclxuICAgIGNsb3NlKCk6IHZvaWQ7XHJcbiAgICB0b2dnbGUoKTogdm9pZDtcclxuICBcclxuICAgIGFkZENsYXNzKC4uLmNsYXNzZXM6IHN0cmluZ1tdKTogdm9pZDtcclxuICAgIHJlbW92ZUNsYXNzKC4uLmNsYXNzZXM6IHN0cmluZ1tdKTogdm9pZDtcclxuIFxyXG4gICAgcGFydChwYXJ0OiBzdHJpbmcsIHZhbHVlOiBhbnkpOiB2b2lkO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElBdXhQYW5lbFByb3ZpZGVyIGV4dGVuZHMgbmcuSVNlcnZpY2VQcm92aWRlciB7XHJcbiAgICBjb25maWc6IEF1eFBhbmVsQ29uZmlnO1xyXG4gICAgcGFydHM6IGFueTtcclxuICAgIHR5cGU6IHN0cmluZztcclxuICAgIGNsYXNzZXM6IHN0cmluZ1tdO1xyXG5cclxuICAgIG9wZW4oKTogdm9pZDtcclxuICAgIGNsb3NlKCk6IHZvaWQ7XHJcbiAgICB0b2dnbGUoKTogdm9pZDtcclxuXHJcbiAgICBhZGRDbGFzcyguLi5jbGFzc2VzOiBzdHJpbmdbXSk6IHZvaWQ7XHJcbiAgICByZW1vdmVDbGFzcyguLi5jbGFzc2VzOiBzdHJpbmdbXSk6IHZvaWQ7XHJcblxyXG4gICAgcGFydChwYXJ0OiBzdHJpbmcsIHZhbHVlOiBhbnkpOiB2b2lkO1xyXG59XHJcblxyXG5jbGFzcyBBdXhQYW5lbFNlcnZpY2UgaW1wbGVtZW50cyBJQXV4UGFuZWxTZXJ2aWNlIHtcclxuICAgIHByaXZhdGUgX2NvbmZpZzogQXV4UGFuZWxDb25maWc7XHJcbiAgICBwcml2YXRlIF9zdGF0ZTogYW55O1xyXG4gICAgcHJpdmF0ZSBfcm9vdFNjb3BlOiBuZy5JUm9vdFNjb3BlU2VydmljZTtcclxuICAgIHByaXZhdGUgX3NpZGVuYXY6IG5nLm1hdGVyaWFsLklTaWRlbmF2U2VydmljZTtcclxuICAgIHByaXZhdGUgaWQgPSAncGlwLWF1eHBhbmVsJztcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoY29uZmlnOiBBdXhQYW5lbENvbmZpZywgJHJvb3RTY29wZTogbmcuSVJvb3RTY29wZVNlcnZpY2UsICRtZFNpZGVuYXY6IG5nLm1hdGVyaWFsLklTaWRlbmF2U2VydmljZSkge1xyXG4gICAgICAgIHRoaXMuX2NvbmZpZyA9IGNvbmZpZztcclxuICAgICAgICB0aGlzLl9yb290U2NvcGUgPSAkcm9vdFNjb3BlO1xyXG4gICAgICAgIHRoaXMuX3NpZGVuYXYgPSAkbWRTaWRlbmF2O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgY29uZmlnKCk6IEF1eFBhbmVsQ29uZmlnIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29uZmlnO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgY2xhc3NlcygpOiBzdHJpbmdbXSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbmZpZy5jbGFzc2VzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgcGFydHMoKTogYW55IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29uZmlnLnBhcnRzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgcGFydHModmFsdWU6IGFueSkge1xyXG4gICAgICAgIHRoaXMuX2NvbmZpZy5wYXJ0cyA9IHZhbHVlIHx8IHt9O1xyXG4gICAgICAgIHRoaXMuc2VuZENvbmZpZ0V2ZW50KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBzdGF0ZSgpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zdGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHN0YXRlKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICB0aGlzLl9zdGF0ZSA9IHZhbHVlIHx8IHt9O1xyXG4gICAgICAgIHRoaXMuX3Jvb3RTY29wZS4kYnJvYWRjYXN0KEF1eFBhbmVsU3RhdGVDaGFuZ2VkRXZlbnQsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaXNPcGVuKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zaWRlbmF2KHRoaXMuaWQpLmlzT3BlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvcGVuKCkge1xyXG4gICAgICAgIHRoaXMuX3NpZGVuYXYodGhpcy5pZCkub3BlbigpO1xyXG4gICAgfVxyXG4gICAgICAgICAgICBcclxuICAgIHB1YmxpYyBjbG9zZSgpIHtcclxuICAgICAgICB0aGlzLl9zaWRlbmF2KHRoaXMuaWQpLmNsb3NlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRvZ2dsZSgpIHtcclxuICAgICAgICB0aGlzLl9zaWRlbmF2KHRoaXMuaWQpLnRvZ2dsZSgpO1xyXG4gICAgfVxyXG4gIFxyXG4gICAgcHVibGljIGFkZENsYXNzKC4uLmNsYXNzZXM6IHN0cmluZ1tdKTogdm9pZCB7XHJcbiAgICAgICAgXy5lYWNoKGNsYXNzZXMsIChjKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZy5jbGFzc2VzLnB1c2goYyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zZW5kQ29uZmlnRXZlbnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlQ2xhc3MoLi4uY2xhc3Nlczogc3RyaW5nW10pOiB2b2lkIHtcclxuICAgICAgICBfLmVhY2goY2xhc3NlcywgKGMpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fY29uZmlnLmNsYXNzZXMgPSBfLnJlamVjdCh0aGlzLl9jb25maWcuY2xhc3NlcywgKGNjKSA9PiBjYyA9PSBjKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnNlbmRDb25maWdFdmVudCgpO1xyXG4gICAgfVxyXG4gXHJcbiAgICBwdWJsaWMgcGFydChwYXJ0OiBzdHJpbmcsIHZhbHVlOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9jb25maWcucGFydHNbcGFydF0gPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnNlbmRDb25maWdFdmVudCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2VuZENvbmZpZ0V2ZW50KCkge1xyXG4gICAgICAgIHRoaXMuX3Jvb3RTY29wZS4kZW1pdChBdXhQYW5lbENoYW5nZWRFdmVudCwgdGhpcy5fY29uZmlnKTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgQXV4UGFuZWxQcm92aWRlciBpbXBsZW1lbnRzIElBdXhQYW5lbFByb3ZpZGVyIHtcclxuICAgIHByaXZhdGUgX2NvbmZpZzogQXV4UGFuZWxDb25maWcgPSB7XHJcbiAgICAgICAgcGFydHM6IHt9LFxyXG4gICAgICAgIGNsYXNzZXM6IFtdLFxyXG4gICAgICAgIHR5cGU6ICdzdGlja3knLFxyXG4gICAgICAgIHN0YXRlOiBudWxsXHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgX3NlcnZpY2U6IEF1eFBhbmVsU2VydmljZTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGNvbmZpZygpOiBBdXhQYW5lbENvbmZpZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbmZpZztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IGNvbmZpZyh2YWx1ZTogQXV4UGFuZWxDb25maWcpIHtcclxuICAgICAgICB0aGlzLl9jb25maWcgPSB2YWx1ZSB8fCBuZXcgQXV4UGFuZWxDb25maWcoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHBhcnRzKCk6IGFueSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbmZpZy5wYXJ0cztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHBhcnRzKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICB0aGlzLl9jb25maWcucGFydHMgPSB2YWx1ZSB8fCB7fTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29uZmlnLnR5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCB0eXBlKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLl9jb25maWcudHlwZSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgY2xhc3NlcygpOiBzdHJpbmdbXSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbmZpZy5jbGFzc2VzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgY2xhc3Nlcyh2YWx1ZTogc3RyaW5nW10pIHtcclxuICAgICAgICB0aGlzLl9jb25maWcuY2xhc3NlcyA9IHZhbHVlIHx8IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRDbGFzcyguLi5jbGFzc2VzOiBzdHJpbmdbXSk6IHZvaWQge1xyXG4gICAgICAgIF8uZWFjaChjbGFzc2VzLCAoYykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9jb25maWcuY2xhc3Nlcy5wdXNoKGMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmVDbGFzcyguLi5jbGFzc2VzOiBzdHJpbmdbXSk6IHZvaWQge1xyXG4gICAgICAgIF8uZWFjaChjbGFzc2VzLCAoYykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9jb25maWcuY2xhc3NlcyA9IF8ucmVqZWN0KHRoaXMuX2NvbmZpZy5jbGFzc2VzLCAoY2MpID0+IGNjID09IGMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gXHJcbiAgICBwdWJsaWMgcGFydChwYXJ0OiBzdHJpbmcsIHZhbHVlOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9jb25maWcucGFydHNbcGFydF0gPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb3BlbigpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zZXJ2aWNlLm9wZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xvc2UoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fc2VydmljZS5jbG9zZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0b2dnbGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fc2VydmljZS50b2dnbGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgJGdldCgkcm9vdFNjb3BlOiBuZy5JUm9vdFNjb3BlU2VydmljZSwgJG1kU2lkZW5hdjogbmcubWF0ZXJpYWwuSVNpZGVuYXZTZXJ2aWNlKSB7XHJcbiAgICAgICAgXCJuZ0luamVjdFwiO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fc2VydmljZSA9PSBudWxsKVxyXG4gICAgICAgICAgICB0aGlzLl9zZXJ2aWNlID0gbmV3IEF1eFBhbmVsU2VydmljZSh0aGlzLl9jb25maWcsICRyb290U2NvcGUsICRtZFNpZGVuYXYpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fc2VydmljZTtcclxuICAgIH0gICAgIFxyXG59XHJcblxyXG5mdW5jdGlvbiBob29rQXV4UGFuZWxFdmVudHMoJHJvb3RTY29wZTogbmcuSVJvb3RTY29wZVNlcnZpY2UsIHBpcEF1eFBhbmVsOiBJQXV4UGFuZWxTZXJ2aWNlKSB7XHJcbiAgICAkcm9vdFNjb3BlLiRvbihPcGVuQXV4UGFuZWxFdmVudCwgKCkgPT4geyBwaXBBdXhQYW5lbC5vcGVuKCk7IH0pO1xyXG4gICAgJHJvb3RTY29wZS4kb24oQ2xvc2VBdXhQYW5lbEV2ZW50LCAoKSA9PiB7IHBpcEF1eFBhbmVsLmNsb3NlKCk7IH0pO1xyXG59XHJcblxyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdwaXBBdXhQYW5lbCcpXHJcbiAgICAucHJvdmlkZXIoJ3BpcEF1eFBhbmVsJywgQXV4UGFuZWxQcm92aWRlcilcclxuICAgIC5ydW4oaG9va0F1eFBhbmVsRXZlbnRzKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3BpcEF1eFBhbmVsJywgWyduZ01hdGVyaWFsJ10pO1xyXG5cclxuaW1wb3J0ICcuL0F1eFBhbmVsU2VydmljZSc7XHJcbmltcG9ydCAnLi9BdXhQYW5lbFBhcnREaXJlY3RpdmUnO1xyXG5pbXBvcnQgJy4vQXV4UGFuZWxEaXJlY3RpdmUnO1xyXG5cclxuZXhwb3J0ICogZnJvbSAnLi9BdXhQYW5lbFNlcnZpY2UnOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdwaXBMYXlvdXQnLCBbJ3d1Lm1hc29ucnknLCAncGlwTWVkaWEnLCAncGlwQXV4UGFuZWwnXSk7XHJcblxyXG5pbXBvcnQgJy4vbWVkaWEvaW5kZXgnO1xyXG5cclxuaW1wb3J0ICcuL2xheW91dHMvTWFpbkRpcmVjdGl2ZSc7XHJcbmltcG9ydCAnLi9sYXlvdXRzL0NhcmREaXJlY3RpdmUnO1xyXG5pbXBvcnQgJy4vbGF5b3V0cy9EaWFsb2dEaXJlY3RpdmUnO1xyXG5pbXBvcnQgJy4vbGF5b3V0cy9Eb2N1bWVudERpcmVjdGl2ZSc7XHJcbmltcG9ydCAnLi9sYXlvdXRzL1NpbXBsZURpcmVjdGl2ZSc7XHJcbmltcG9ydCAnLi9sYXlvdXRzL1RpbGVzRGlyZWN0aXZlJztcclxuaW1wb3J0ICcuL2F1eHBhbmVsL2luZGV4JztcclxuXHJcbmV4cG9ydCAqIGZyb20gJy4vbWVkaWEvaW5kZXgnO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgeyBNYWluUmVzaXplZEV2ZW50LCBMYXlvdXRSZXNpemVkRXZlbnQsIE1haW5CcmVha3BvaW50U3RhdHVzZXMgfSBmcm9tICcuLi9tZWRpYS9NZWRpYVNlcnZpY2UnO1xyXG5cclxuLy8gQXZvaWQgZGVmYXVsdCBleHBvcnRcclxuKCgpID0+IHtcclxuXHJcbmludGVyZmFjZSBJQ2FyZERpcmVjdGl2ZUF0dHJpYnV0ZXMgZXh0ZW5kcyBuZy5JQXR0cmlidXRlcyB7XHJcbiAgICBtaW5XaWR0aDogc3RyaW5nIHwgbnVtYmVyO1xyXG4gICAgbWluSGVpZ2h0OiBzdHJpbmcgfCBudW1iZXI7XHJcbiAgICB3aWR0aDogc3RyaW5nIHwgbnVtYmVyO1xyXG4gICAgaGVpZ2h0OiBzdHJpbmcgfCBudW1iZXI7XHJcbn1cclxuXHJcbmNsYXNzIENhcmREaXJlY3RpdmVMaW5rIHtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSAkcm9vdFNjb3BlOiBuZy5JUm9vdFNjb3BlU2VydmljZSwgXHJcbiAgICAgICAgcHJpdmF0ZSAkZWxlbWVudDogSlF1ZXJ5LCBcclxuICAgICAgICBwcml2YXRlICRhdHRyczogSUNhcmREaXJlY3RpdmVBdHRyaWJ1dGVzXHJcbiAgICApIHtcclxuXHJcbiAgICAgICAgLy8gQWRkIGNsYXNzIHRvIHRoZSBlbGVtZW50XHJcbiAgICAgICAgJGVsZW1lbnQuYWRkQ2xhc3MoJ3BpcC1jYXJkJyk7XHJcblxyXG4gICAgICAgIGxldCBsaXN0ZW5lciA9ICgpID0+IHsgdGhpcy5yZXNpemUoKTsgfVxyXG5cclxuICAgICAgICAvLyBSZXNpemUgZXZlcnkgdGltZSB3aW5kb3cgaXMgcmVzaXplZFxyXG4gICAgICAgICRyb290U2NvcGUuJG9uKE1haW5SZXNpemVkRXZlbnQsIGxpc3RlbmVyKTtcclxuXHJcbiAgICAgICAgLy8gUmVzaXplIHJpZ2h0IGF3YXkgdG8gYXZvaWQgZmxpY2tpbmdcclxuICAgICAgICB0aGlzLnJlc2l6ZSgpO1xyXG5cclxuICAgICAgICAvLyBSZXNpemUgdGhlIGVsZW1lbnQgcmlnaHQgYXdheVxyXG4gICAgICAgIHNldFRpbWVvdXQobGlzdGVuZXIsIDEwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZXNpemUoKSB7XHJcbiAgICAgICAgY29uc3RcclxuICAgICAgICAgICAgJG1haW5Cb2R5ID0gJCgnLnBpcC1tYWluLWJvZHknKSxcclxuICAgICAgICAgICAgY2FyZENvbnRhaW5lciA9ICQoJy5waXAtY2FyZC1jb250YWluZXInKSxcclxuICAgICAgICAgICAgd2luZG93V2lkdGggPSAkKCdwaXAtbWFpbicpLndpZHRoKCk7XHJcbiAgICAgICAgbGV0XHJcbiAgICAgICAgICAgIG1heFdpZHRoID0gJG1haW5Cb2R5LndpZHRoKCksXHJcbiAgICAgICAgICAgIG1heEhlaWdodCA9ICRtYWluQm9keS5oZWlnaHQoKSxcclxuICAgICAgICAgICAgbWluV2lkdGggPSB0aGlzLiRhdHRycy5taW5XaWR0aCA/IE1hdGguZmxvb3IoTnVtYmVyKHRoaXMuJGF0dHJzLm1pbldpZHRoKSkgOiBudWxsLFxyXG4gICAgICAgICAgICBtaW5IZWlnaHQgPSB0aGlzLiRhdHRycy5taW5IZWlnaHQgPyBNYXRoLmZsb29yKE51bWJlcih0aGlzLiRhdHRycy5taW5IZWlnaHQpKSA6IG51bGwsXHJcbiAgICAgICAgICAgIHdpZHRoID0gdGhpcy4kYXR0cnMud2lkdGggPyBNYXRoLmZsb29yKE51bWJlcih0aGlzLiRhdHRycy53aWR0aCkpIDogbnVsbCxcclxuICAgICAgICAgICAgaGVpZ2h0ID0gdGhpcy4kYXR0cnMuaGVpZ2h0ID8gTWF0aC5mbG9vcihOdW1iZXIodGhpcy4kYXR0cnMuaGVpZ2h0KSkgOiBudWxsLFxyXG4gICAgICAgICAgICBsZWZ0LCB0b3A7XHJcblxyXG4gICAgICAgIC8vIEZ1bGwtc2NyZWVuIG9uIHBob25lXHJcbiAgICAgICAgaWYgKE1haW5CcmVha3BvaW50U3RhdHVzZXMueHMpIHtcclxuICAgICAgICAgICAgbWluV2lkdGggPSBudWxsO1xyXG4gICAgICAgICAgICBtaW5IZWlnaHQgPSBudWxsO1xyXG4gICAgICAgICAgICB3aWR0aCA9IG51bGw7XHJcbiAgICAgICAgICAgIGhlaWdodCA9IG51bGw7XHJcbiAgICAgICAgICAgIG1heFdpZHRoID0gbnVsbDtcclxuICAgICAgICAgICAgbWF4SGVpZ2h0ID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gQ2FyZCB2aWV3IHdpdGggYWRqdXN0YWJsZSBtYXJnaW5zIG9uIHRhYmxldCBhbmQgZGVza3RvcFxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBTZXQgbWFyZ2luIGFuZCBtYXhpbXVtIGRpbWVuc2lvbnNcclxuICAgICAgICAgICAgY29uc3Qgc3BhY2UgPSBNYWluQnJlYWtwb2ludFN0YXR1c2VzWydndC1tZCddID8gMjQgOiAxNjtcclxuICAgICAgICAgICAgbWF4V2lkdGggLT0gc3BhY2UgKiAyO1xyXG4gICAgICAgICAgICBtYXhIZWlnaHQgLT0gc3BhY2UgKiAyO1xyXG5cclxuICAgICAgICAgICAgLy8gU2V0IG1pbmltdW0gZGltZW5zaW9uc1xyXG4gICAgICAgICAgICBtaW5XaWR0aCA9IG1pbldpZHRoID8gTWF0aC5taW4obWluV2lkdGgsIG1heFdpZHRoKSA6IG51bGw7XHJcbiAgICAgICAgICAgIG1pbkhlaWdodCA9IG1pbkhlaWdodCA/IE1hdGgubWluKG1pbkhlaWdodCwgbWF4SGVpZ2h0KSA6IG51bGw7XHJcblxyXG4gICAgICAgICAgICAvLyBTZXQgcmVndWxhciBkaW1lbnNpb25zXHJcbiAgICAgICAgICAgIHdpZHRoID0gd2lkdGggPyBNYXRoLm1pbih3aWR0aCwgbWF4V2lkdGgpIDogbnVsbDtcclxuICAgICAgICAgICAgaGVpZ2h0ID0gaGVpZ2h0ID8gTWF0aC5taW4oaGVpZ2h0LCBtYXhIZWlnaHQpIDogbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFNldCBkaW1lbnNpb25zXHJcbiAgICAgICAgdGhpcy4kZWxlbWVudC5jc3MoJ21heC13aWR0aCcsIG1heFdpZHRoID8gbWF4V2lkdGggKyAncHgnIDogJycpO1xyXG4gICAgICAgIHRoaXMuJGVsZW1lbnQuY3NzKCdtaW4td2lkdGgnLCBtaW5XaWR0aCA/IG1pbldpZHRoICsgJ3B4JyA6ICcnKTtcclxuICAgICAgICB0aGlzLiRlbGVtZW50LmNzcygnd2lkdGgnLCB3aWR0aCA/IHdpZHRoICsgJ3B4JyA6ICcnKTtcclxuICAgICAgICB0aGlzLiRlbGVtZW50LmNzcygnaGVpZ2h0JywgaGVpZ2h0ID8gaGVpZ2h0ICsgJ3B4JyA6ICcnKTtcclxuXHJcbiAgICAgICAgaWYgKCFjYXJkQ29udGFpbmVyLmhhc0NsYXNzKCdwaXAtb3V0ZXItc2Nyb2xsJykpIHtcclxuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5jc3MoJ21heC1oZWlnaHQnLCBtYXhIZWlnaHQgPyBtYXhIZWlnaHQgKyAncHgnIDogJycpO1xyXG4gICAgICAgICAgICB0aGlzLiRlbGVtZW50LmNzcygnbWluLWhlaWdodCcsIG1pbkhlaWdodCA/IG1pbkhlaWdodCArICdweCcgOiAnJyk7XHJcbiAgICAgICAgICAgIGNvbnN0XHJcbiAgICAgICAgICAgICAgICAkaGVhZGVyID0gdGhpcy4kZWxlbWVudC5maW5kKCcucGlwLWhlYWRlcjp2aXNpYmxlJyksXHJcbiAgICAgICAgICAgICAgICAkZm9vdGVyID0gdGhpcy4kZWxlbWVudC5maW5kKCcucGlwLWZvb3Rlcjp2aXNpYmxlJyksXHJcbiAgICAgICAgICAgICAgICAkYm9keSA9IHRoaXMuJGVsZW1lbnQuZmluZCgnLnBpcC1ib2R5Jyk7XHJcbiAgICAgICAgICAgIGxldCBtYXhCb2R5SGVpZ2h0ID0gbWF4SGVpZ2h0IHx8ICRtYWluQm9keS5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICgkaGVhZGVyLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgICAgICBtYXhCb2R5SGVpZ2h0IC09ICRoZWFkZXIub3V0ZXJIZWlnaHQodHJ1ZSk7XHJcbiAgICAgICAgICAgIGlmICgkZm9vdGVyLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgICAgICBtYXhCb2R5SGVpZ2h0IC09ICRmb290ZXIub3V0ZXJIZWlnaHQodHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAkYm9keS5jc3MoJ21heC1oZWlnaHQnLCBtYXhCb2R5SGVpZ2h0ICsgJ3B4Jyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2FyZENvbnRhaW5lci5hZGRDbGFzcygncGlwLXNjcm9sbCcpO1xyXG4gICAgICAgICAgICBpZiAoTWFpbkJyZWFrcG9pbnRTdGF0dXNlcy54cykge1xyXG4gICAgICAgICAgICAgICAgbGVmdCA9IDA7XHJcbiAgICAgICAgICAgICAgICB0b3AgPSAwO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGVmdCA9IGNhcmRDb250YWluZXIud2lkdGgoKSAvIDIgLSB0aGlzLiRlbGVtZW50LndpZHRoKCkgLyAyIC0gMTY7XHJcbiAgICAgICAgICAgICAgICB0b3AgPSBNYXRoLm1heChjYXJkQ29udGFpbmVyLmhlaWdodCgpIC8gMiAtIHRoaXMuJGVsZW1lbnQuaGVpZ2h0KCkgLyAyIC0gMTYsIDApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLiRlbGVtZW50LmNzcygnbGVmdCcsIGxlZnQpO1xyXG4gICAgICAgICAgICB0aGlzLiRlbGVtZW50LmNzcygndG9wJywgdG9wKTtcclxuXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyB0aGlzLiRlbGVtZW50LmNzcygnZGlzcGxheScsICdmbGV4Jyk7IH0sIDEwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBOb3RpZnkgY2hpbGQgY29udHJvbHMgdGhhdCBsYXlvdXQgd2FzIHJlc2l6ZWRcclxuICAgICAgICB0aGlzLiRyb290U2NvcGUuJGVtaXQoJ3BpcExheW91dFJlc2l6ZWQnKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY2FyZERpcmVjdGl2ZSgkcm9vdFNjb3BlOiBuZy5JUm9vdFNjb3BlU2VydmljZSkge1xyXG4gICAgXCJuZ0luamVjdFwiO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgbGluazogKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycykgPT4ge1xyXG4gICAgICAgICAgICBuZXcgQ2FyZERpcmVjdGl2ZUxpbmsoJHJvb3RTY29wZSwgJGVsZW1lbnQsICRhdHRycyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgncGlwTGF5b3V0JylcclxuICAgIC5kaXJlY3RpdmUoJ3BpcENhcmQnLCBjYXJkRGlyZWN0aXZlKTtcclxuXHJcbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy8gQXZvaWQgZGVmYXVsdCBleHBvcnRcclxuKCgpID0+IHtcclxuXHJcbmZ1bmN0aW9uIGRpYWxvZ0RpcmVjdGl2ZSgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgbGluazogKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycykgPT4ge1xyXG4gICAgICAgICAgICAkZWxlbWVudC5hZGRDbGFzcygncGlwLWRpYWxvZycpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ3BpcExheW91dCcpXHJcbiAgICAuZGlyZWN0aXZlKCdwaXBEaWFsb2cnLCBkaWFsb2dEaXJlY3RpdmUpO1xyXG5cclxufSkoKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG4vLyBBdm9pZCBkZWZhdWx0IGV4cG9ydFxyXG4oKCkgPT4ge1xyXG5cclxuZnVuY3Rpb24gZG9jdW1lbnREaXJlY3RpdmUoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIGxpbms6ICgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMpID0+IHtcclxuICAgICAgICAgICAgJGVsZW1lbnQuYWRkQ2xhc3MoJ3BpcC1kb2N1bWVudCcpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ3BpcExheW91dCcpXHJcbiAgICAuZGlyZWN0aXZlKCdwaXBEb2N1bWVudCcsIGRvY3VtZW50RGlyZWN0aXZlKTtcclxuXHJcbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0IHsgYWRkUmVzaXplTGlzdGVuZXIsIHJlbW92ZVJlc2l6ZUxpc3RlbmVyIH0gZnJvbSAnLi4vbWVkaWEvUmVzaXplRnVuY3Rpb25zJztcclxuaW1wb3J0IHsgTWFpbkJyZWFrcG9pbnRzLCBNYWluQnJlYWtwb2ludFN0YXR1c2VzLCBNYWluUmVzaXplZEV2ZW50IH0gZnJvbSAnLi4vbWVkaWEvTWVkaWFTZXJ2aWNlJzsgXHJcblxyXG4vLyBBdm9pZCBkZWZhdWx0IGV4cG9ydFxyXG4oKCkgPT4ge1xyXG5cclxuaW50ZXJmYWNlIElNYWluRGlyZWN0aXZlQXR0cmlidXRlcyBleHRlbmRzIG5nLklBdHRyaWJ1dGVzIHtcclxuICAgIHBpcENvbnRhaW5lcjogc3RyaW5nO1xyXG59XHJcblxyXG5jbGFzcyBNYWluRGlyZWN0aXZlQ29udHJvbGxlciBpbXBsZW1lbnRzIG5nLklDb250cm9sbGVyIHtcclxuICAgIHByaXZhdGUgX2NvbnRhaW5lcjogYW55O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwcml2YXRlICRzY29wZTogbmcuSVNjb3BlLCBcclxuICAgICAgICBwcml2YXRlICRlbGVtZW50OiBhbmd1bGFyLklSb290RWxlbWVudFNlcnZpY2UsIFxyXG4gICAgICAgIHByaXZhdGUgJHJvb3RTY29wZTogbmcuSVJvb3RTY29wZVNlcnZpY2UsXHJcbiAgICAgICAgcHJpdmF0ZSAkdGltZW91dDogbmcuSVRpbWVvdXRTZXJ2aWNlLFxyXG4gICAgICAgIHByaXZhdGUgJGF0dHJzOiBJTWFpbkRpcmVjdGl2ZUF0dHJpYnV0ZXNcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMuX2NvbnRhaW5lciA9ICRhdHRycy5waXBDb250YWluZXIgPyAkKCRhdHRycy5waXBDb250YWluZXIpIDogJGVsZW1lbnQ7XHJcblxyXG4gICAgICAgIC8vIEFkZCBDU1MgY2xhc3NcclxuICAgICAgICAkZWxlbWVudC5hZGRDbGFzcygncGlwLW1haW4nKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIHJlc2l6ZSBsaXN0ZW5lclxyXG4gICAgICAgIGNvbnN0IGxpc3RlbmVyID0gKCkgPT4geyB0aGlzLnJlc2l6ZSgpOyB9O1xyXG4gICAgICAgIGFkZFJlc2l6ZUxpc3RlbmVyKHRoaXMuX2NvbnRhaW5lclswXSwgbGlzdGVuZXIpO1xyXG5cclxuICAgICAgICAvLyBVbmJpbmQgd2hlbiBzY29wZSBpcyByZW1vdmVkXHJcbiAgICAgICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHJlbW92ZVJlc2l6ZUxpc3RlbmVyKHRoaXMuX2NvbnRhaW5lclswXSwgbGlzdGVuZXIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBQZXJmb3JtIGluaXRpYWwgY2FsY3VsYXRpb25zXHJcbiAgICAgICAgdGhpcy51cGRhdGVCcmVha3BvaW50U3RhdHVzZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZUJyZWFrcG9pbnRTdGF0dXNlcygpIHtcclxuICAgICAgICBjb25zdCB3aWR0aCA9IHRoaXMuX2NvbnRhaW5lci5pbm5lcldpZHRoKCk7XHJcbiAgICAgICAgY29uc3QgYm9keSA9ICQoJ2JvZHknKTtcclxuXHJcbiAgICAgICAgTWFpbkJyZWFrcG9pbnRTdGF0dXNlcy51cGRhdGUoTWFpbkJyZWFrcG9pbnRzLCB3aWR0aCk7XHJcblxyXG4gICAgICAgICQuZWFjaChNYWluQnJlYWtwb2ludFN0YXR1c2VzLCAoYnJlYWtwb2ludCwgc3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChfLmlzQm9vbGVhbihzdGF0dXMpKSB7XHJcbiAgICAgICAgICAgICAgICBib2R5W3N0YXR1cyA/ICdhZGRDbGFzcyc6ICdyZW1vdmVDbGFzcyddKCdwaXAtJyArIGJyZWFrcG9pbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuJHRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLiRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgcmVzaXplKCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlQnJlYWtwb2ludFN0YXR1c2VzKCk7XHJcbiAgICAgICAgdGhpcy4kcm9vdFNjb3BlLiRlbWl0KE1haW5SZXNpemVkRXZlbnQsIE1haW5CcmVha3BvaW50U3RhdHVzZXMpO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBNYWluQm9keURpcmVjdGl2ZUxpbmsge1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICRzY29wZTogbmcuSVNjb3BlLCBcclxuICAgICAgICAkZWxlbWVudDogYW5ndWxhci5JUm9vdEVsZW1lbnRTZXJ2aWNlXHJcbiAgICApIHtcclxuICAgICAgICAvLyBBZGQgQ1NTIGNsYXNzXHJcbiAgICAgICAgJGVsZW1lbnQuYWRkQ2xhc3MoJ3BpcC1tYWluLWJvZHknKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbWFpbkRpcmVjdGl2ZSgpOiBuZy5JRGlyZWN0aXZlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgY29udHJvbGxlcjogTWFpbkRpcmVjdGl2ZUNvbnRyb2xsZXIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nIFxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBtYWluQm9keURpcmVjdGl2ZSgpOiBuZy5JRGlyZWN0aXZlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgbGluazogTWFpbkJvZHlEaXJlY3RpdmVMaW5rXHJcbiAgICB9XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ3BpcExheW91dCcpXHJcbiAgICAuZGlyZWN0aXZlKCdwaXBNYWluJywgbWFpbkRpcmVjdGl2ZSlcclxuICAgIC5kaXJlY3RpdmUoJ3BpcE1haW5Cb2R5JywgbWFpbkJvZHlEaXJlY3RpdmUpO1xyXG5cclxufSkoKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG4vLyBBdm9pZCBkZWZhdWx0IGV4cG9ydFxyXG4oKCkgPT4ge1xyXG5cclxuZnVuY3Rpb24gc2ltcGxlRGlyZWN0aXZlKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICBsaW5rOiAoJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzKSA9PiB7XHJcbiAgICAgICAgICAgICRlbGVtZW50LmFkZENsYXNzKCdwaXAtc2ltcGxlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgncGlwTGF5b3V0JylcclxuICAgIC5kaXJlY3RpdmUoJ3BpcFNpbXBsZScsIHNpbXBsZURpcmVjdGl2ZSk7XHJcblxyXG59KSgpOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCB7IGFkZFJlc2l6ZUxpc3RlbmVyLCByZW1vdmVSZXNpemVMaXN0ZW5lciB9IGZyb20gJy4uL21lZGlhL1Jlc2l6ZUZ1bmN0aW9ucyc7XHJcbmltcG9ydCB7IE1haW5SZXNpemVkRXZlbnQsIExheW91dFJlc2l6ZWRFdmVudCwgTWFpbkJyZWFrcG9pbnRzLCBNYWluQnJlYWtwb2ludFN0YXR1c2VzIH0gZnJvbSAnLi4vbWVkaWEvTWVkaWFTZXJ2aWNlJztcclxuXHJcbmRlY2xhcmUgdmFyIE1hc29ucnk6IGFueTtcclxuXHJcbmNsYXNzIFRpbGVzRGlyZWN0aXZlTGluayB7XHJcbiAgICBwcml2YXRlIF9lbGVtZW50OiBhbnk7XHJcbiAgICBwcml2YXRlIF9hdHRyczogYW55O1xyXG4gICAgcHJpdmF0ZSBfcm9vdFNjb3BlOiBuZy5JUm9vdFNjb3BlU2VydmljZTtcclxuICAgIHByaXZhdGUgX2NvbHVtbldpZHRoOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9jb250YWluZXI6IGFueTtcclxuICAgIHByaXZhdGUgX3ByZXZDb250YWluZXJXaWR0aDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfbWFzb25yeTogYW55O1xyXG4gICAgcHJpdmF0ZSBfc2l6ZXI6IGFueTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoJHNjb3BlOiBuZy5JU2NvcGUsICRlbGVtZW50OiBhbnksICRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlLCAkYXR0cnM6IGFueSkge1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSAkZWxlbWVudDtcclxuICAgICAgICB0aGlzLl9yb290U2NvcGUgPSAkcm9vdFNjb3BlO1xyXG4gICAgICAgIHRoaXMuX2F0dHJzID0gJGF0dHJzO1xyXG5cclxuICAgICAgICB0aGlzLl9jb2x1bW5XaWR0aCA9ICRhdHRycy5jb2x1bW5XaWR0aCA/IE1hdGguZmxvb3IoJGF0dHJzLmNvbHVtbldpZHRoKSA6IDQ0MCxcclxuICAgICAgICB0aGlzLl9jb250YWluZXIgPSAkZWxlbWVudC5jaGlsZHJlbignLnBpcC10aWxlcy1jb250YWluZXInKSxcclxuICAgICAgICB0aGlzLl9wcmV2Q29udGFpbmVyV2lkdGggPSBudWxsLFxyXG4gICAgICAgIHRoaXMuX21hc29ucnkgPSBNYXNvbnJ5LmRhdGEodGhpcy5fY29udGFpbmVyWzBdKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBBZGQgY2xhc3MgdG8gdGhlIGVsZW1lbnRcclxuICAgICAgICAkZWxlbWVudC5hZGRDbGFzcygncGlwLXRpbGVzJyk7XHJcblxyXG4gICAgICAgIC8vIEFkZCByZXNpemUgbGlzdGVuZXJcclxuICAgICAgICBsZXQgbGlzdGVuZXIgPSAoKSA9PiB7IHRoaXMucmVzaXplKGZhbHNlKTsgfTtcclxuICAgICAgICBhZGRSZXNpemVMaXN0ZW5lcigkZWxlbWVudFswXSwgbGlzdGVuZXIpO1xyXG5cclxuICAgICAgICAvLyBVbmJpbmQgd2hlbiBzY29wZSBpcyByZW1vdmVkXHJcbiAgICAgICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHJlbW92ZVJlc2l6ZUxpc3RlbmVyKCRlbGVtZW50WzBdLCBsaXN0ZW5lcik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIEluc2VydCBzaXplclxyXG4gICAgICAgIHRoaXMuX3NpemVyID0gJCgnPGRpdiBjbGFzcz1cInBpcC10aWxlLXNpemVyXCI+PC9kaXY+Jyk7XHJcbiAgICAgICAgdGhpcy5fc2l6ZXIuYXBwZW5kVG8odGhpcy5fY29udGFpbmVyKTtcclxuXHJcbiAgICAgICAgLy8gUmVzaXplIGV2ZXJ5IHRpbWUgd2luZG93IGlzIHJlc2l6ZWRcclxuICAgICAgICAkcm9vdFNjb3BlLiRvbihNYWluUmVzaXplZEV2ZW50LCAoKSA9PiB7IHRoaXMucmVzaXplKGZhbHNlKTsgfSk7XHJcblxyXG4gICAgICAgIC8vIFJlc2l6ZSB0aGUgZWxlbWVudCByaWdodCBhd2F5XHJcbiAgICAgICAgdGhpcy5yZXNpemUodHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZXNpemUoZm9yY2U6IGJvb2xlYW4pIHtcclxuICAgICAgICBsZXQgd2lkdGggPSB0aGlzLl9lbGVtZW50LnBhcmVudCgpLndpZHRoKCk7XHJcbiAgICAgICAgbGV0IGNvbnRhaW5lcldpZHRoO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnNvbGUubG9nKCk7XHJcblxyXG4gICAgICAgIGlmIChNYWluQnJlYWtwb2ludFN0YXR1c2VzWydndC14cyddICYmICh3aWR0aCAtIDM2KSA+IHRoaXMuX2NvbHVtbldpZHRoKSB7XHJcbiAgICAgICAgICAgIHdpZHRoID0gd2lkdGggLSAyNCAqIDI7XHJcblxyXG4gICAgICAgICAgICBsZXQgY29sdW1ucyA9IE1hdGguZmxvb3Iod2lkdGggLyB0aGlzLl9jb2x1bW5XaWR0aCk7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lcldpZHRoID0gKHRoaXMuX2NvbHVtbldpZHRoICsgMTYpICogY29sdW1ucyAtIDE2O1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbnRhaW5lcldpZHRoID4gd2lkdGgpIHtcclxuICAgICAgICAgICAgICAgIGNvbHVtbnMtLTtcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lcldpZHRoID0gKHRoaXMuX2NvbHVtbldpZHRoICsgMTYpICogY29sdW1ucyAtIDE2O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY29sdW1ucyA8IDEpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lcldpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zaXplci5jc3MoJ3dpZHRoJywgY29udGFpbmVyV2lkdGggKyAncHgnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NpemVyLmNzcygnd2lkdGgnLCB0aGlzLl9jb2x1bW5XaWR0aCArICdweCcpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyArMTAgdG8gYXZvaWQgcHJlY2lzaW9uIHJlbGF0ZWQgZXJyb3JcclxuICAgICAgICAgICAgdGhpcy5fY29udGFpbmVyLmNzcygnd2lkdGgnLCAoY29udGFpbmVyV2lkdGggKyAxMCkgKyAncHgnKTtcclxuICAgICAgICAgICAgdGhpcy5fY29udGFpbmVyLnJlbW92ZUNsYXNzKCdwaXAtbW9iaWxlJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgd2lkdGggPSB3aWR0aCAtIDE2ICogMjtcclxuICAgICAgICAgICAgY29udGFpbmVyV2lkdGggPSB3aWR0aDtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3NpemVyLmNzcygnd2lkdGgnLCBjb250YWluZXJXaWR0aCArICdweCcpO1xyXG4gICAgICAgICAgICAvLyArMTAgdG8gYXZvaWQgcHJlY2lzaW9uIHJlbGF0ZWQgZXJyb3JcclxuICAgICAgICAgICAgdGhpcy5fY29udGFpbmVyLmNzcygnd2lkdGgnLCAoY29udGFpbmVyV2lkdGggKyAxMCkgKyAncHgnKTtcclxuICAgICAgICAgICAgdGhpcy5fY29udGFpbmVyLmFkZENsYXNzKCdwaXAtbW9iaWxlJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBNYW51YWxseSBjYWxsIGxheW91dCBvbiB0aWxlIGNvbnRhaW5lclxyXG4gICAgICAgIGlmICh0aGlzLl9wcmV2Q29udGFpbmVyV2lkdGggIT0gY29udGFpbmVyV2lkdGggfHwgZm9yY2UpIHtcclxuICAgICAgICAgICAgdGhpcy5fcHJldkNvbnRhaW5lcldpZHRoID0gY29udGFpbmVyV2lkdGg7XHJcbiAgICAgICAgICAgIHRoaXMuX21hc29ucnkubGF5b3V0KCk7XHJcblxyXG4gICAgICAgICAgICAvLyBOb3RpZnkgY2hpbGQgY29udHJvbHMgdGhhdCBsYXlvdXQgd2FzIHJlc2l6ZWRcclxuICAgICAgICAgICAgdGhpcy5fcm9vdFNjb3BlLiRlbWl0KExheW91dFJlc2l6ZWRFdmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB0aWxlc0RpcmVjdGl2ZSgkcm9vdFNjb3BlOiBuZy5JUm9vdFNjb3BlU2VydmljZSkge1xyXG4gICAgXCJuZ0luamVjdFwiO1xyXG5cclxuICAgIC8vIENvbnZlcnRzIHZhbHVlIGludG8gYm9vbGVhblxyXG4gICAgZnVuY3Rpb24gY29udmVydFRvQm9vbGVhbih2YWx1ZSkge1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgaWYgKCF2YWx1ZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHZhbHVlID0gdmFsdWUudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIHJldHVybiB2YWx1ZSA9PSAnMScgfHwgdmFsdWUgPT0gJ3RydWUnO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgc2NvcGU6IGZhbHNlLFxyXG4gICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXHJcbiAgICAgICAgdGVtcGxhdGU6XHJcbiAgICAgICAgICAgICgkZWxlbWVudDogYW55LCAkYXR0cnM6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvbnZlcnRUb0Jvb2xlYW4oJGF0dHJzLnBpcEluZmluaXRlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTdHJpbmcoKVxyXG4gICAgICAgICAgICAgICAgICAgICsgJzxkaXYgbWFzb25yeSBjbGFzcz1cInBpcC10aWxlcy1jb250YWluZXJcIiBsb2FkLWltYWdlcz1cImZhbHNlXCIgcHJlc2VydmUtb3JkZXIgICdcclxuICAgICAgICAgICAgICAgICAgICArICcgbmctdHJhbnNjbHVkZSBjb2x1bW4td2lkdGg9XCIucGlwLXRpbGUtc2l6ZXJcIiBpdGVtLXNlbGVjdG9yPVwiLnBpcC10aWxlXCInXHJcbiAgICAgICAgICAgICAgICAgICAgKyAnIG1hc29ucnktb3B0aW9ucz1cInRpbGVzT3B0aW9uc1wiICBwaXAtc2Nyb2xsLWNvbnRhaW5lcj1cIlxcJy5waXAtdGlsZXNcXCdcIidcclxuICAgICAgICAgICAgICAgICAgICArICcgcGlwLWluZmluaXRlLXNjcm9sbD1cInJlYWRTY3JvbGwoKVwiID4nXHJcbiAgICAgICAgICAgICAgICAgICAgKyAnPC9kaXY+JztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFN0cmluZygpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsgJzxkaXYgbWFzb25yeSBjbGFzcz1cInBpcC10aWxlcy1jb250YWluZXJcIiBsb2FkLWltYWdlcz1cImZhbHNlXCIgcHJlc2VydmUtb3JkZXIgICdcclxuICAgICAgICAgICAgICAgICAgICAgICAgKyAnIG5nLXRyYW5zY2x1ZGUgY29sdW1uLXdpZHRoPVwiLnBpcC10aWxlLXNpemVyXCIgaXRlbS1zZWxlY3Rvcj1cIi5waXAtdGlsZVwiJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICArICcgbWFzb25yeS1vcHRpb25zPVwidGlsZXNPcHRpb25zXCI+J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICArICc8L2Rpdj4nO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICgkc2NvcGU6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAkc2NvcGUudGlsZXNPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgZ3V0dGVyOiA4LC8vMTZcclxuICAgICAgICAgICAgICAgIGlzRml0V2lkdGg6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgaXNSZXNpemVCb3VuZDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uRHVyYXRpb246IDAgLy8gJzAuMnMnXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSxcclxuICAgICAgICBsaW5rOiAoJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzKSA9PiB7XHJcbiAgICAgICAgICAgIG5ldyBUaWxlc0RpcmVjdGl2ZUxpbmsoJHNjb3BlLCAkZWxlbWVudCwgJHJvb3RTY29wZSwgJGF0dHJzKTtcclxuICAgICAgICB9IFxyXG4gICAgfTtcclxufVxyXG5cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgncGlwTGF5b3V0JylcclxuICAgIC5kaXJlY3RpdmUoJ3BpcFRpbGVzJywgdGlsZXNEaXJlY3RpdmUpO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5leHBvcnQgY2xhc3MgTWVkaWFCcmVha3BvaW50cyB7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoXHJcbiAgICAgICAgeHM6IG51bWJlciwgc206IG51bWJlciwgbWQ6IG51bWJlciwgbGc6IG51bWJlclxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy54cyA9IHhzO1xyXG4gICAgICAgIHRoaXMuc20gPSBzbTtcclxuICAgICAgICB0aGlzLm1kID0gbWQ7XHJcbiAgICAgICAgdGhpcy5sZyA9IGxnO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB4czogbnVtYmVyO1xyXG4gICAgcHVibGljIHNtOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgbWQ6IG51bWJlcjtcclxuICAgIHB1YmxpYyBsZzogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTWVkaWFCcmVha3BvaW50U3RhdHVzZXMge1xyXG4gICAgcHVibGljIHdpZHRoOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgJ3hzJzogYm9vbGVhbjtcclxuICAgIHB1YmxpYyAnZ3QteHMnOiBib29sZWFuO1xyXG4gICAgcHVibGljICdzbSc6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgJ2d0LXNtJzogYm9vbGVhbjtcclxuICAgIHB1YmxpYyAnbWQnOiBib29sZWFuO1xyXG4gICAgcHVibGljICdndC1tZCc6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgJ2xnJzogYm9vbGVhbjtcclxuICAgIHB1YmxpYyAnZ3QtbGcnOiBib29sZWFuO1xyXG4gICAgcHVibGljICd4bCc6IGJvb2xlYW47XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZShicmVha3BvaW50czogTWVkaWFCcmVha3BvaW50cywgd2lkdGg6IG51bWJlcikge1xyXG4gICAgICAgIGlmIChicmVha3BvaW50cyA9PSBudWxsKSByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICB0aGlzWyd4cyddID0gd2lkdGggPD0gYnJlYWtwb2ludHMueHM7XHJcbiAgICAgICAgdGhpc1snZ3QteHMnXSA9IHdpZHRoID4gYnJlYWtwb2ludHMueHM7XHJcbiAgICAgICAgdGhpc1snc20nXSA9IHdpZHRoID4gYnJlYWtwb2ludHMueHMgJiYgd2lkdGggPD0gYnJlYWtwb2ludHMuc207XHJcbiAgICAgICAgdGhpc1snZ3Qtc20nXSA9IHdpZHRoID4gYnJlYWtwb2ludHMuc207XHJcbiAgICAgICAgdGhpc1snbWQnXSA9IHdpZHRoID4gYnJlYWtwb2ludHMuc20gJiYgd2lkdGggPD0gYnJlYWtwb2ludHMubWQ7XHJcbiAgICAgICAgdGhpc1snZ3QtbWQnXSA9IHdpZHRoID4gYnJlYWtwb2ludHMubWQ7XHJcbiAgICAgICAgdGhpc1snbGcnXSA9IHdpZHRoID4gYnJlYWtwb2ludHMubWQgJiYgd2lkdGggPD0gYnJlYWtwb2ludHMubGc7XHJcbiAgICAgICAgdGhpc1snZ3QtbGcnXSA9IHdpZHRoID4gYnJlYWtwb2ludHMubGc7XHJcbiAgICAgICAgdGhpc1sneGwnXSA9IHRoaXNbJ2d0LWxnJ107XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBsZXQgTWFpblJlc2l6ZWRFdmVudDogc3RyaW5nID0gJ3BpcE1haW5SZXNpemVkJztcclxuZXhwb3J0IGxldCBMYXlvdXRSZXNpemVkRXZlbnQ6IHN0cmluZyA9ICdwaXBMYXlvdXRSZXNpemVkJztcclxuXHJcbmV4cG9ydCBsZXQgTWFpbkJyZWFrcG9pbnRzOiBNZWRpYUJyZWFrcG9pbnRzID0gbmV3IE1lZGlhQnJlYWtwb2ludHMoNjM5LCA3MTYsIDEwMjQsIDE0MzkpO1xyXG5leHBvcnQgbGV0IE1haW5CcmVha3BvaW50U3RhdHVzZXM6IE1lZGlhQnJlYWtwb2ludFN0YXR1c2VzID0gbmV3IE1lZGlhQnJlYWtwb2ludFN0YXR1c2VzKCk7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElNZWRpYVNlcnZpY2Uge1xyXG4gICAgKGJyZWFrcG9pbnQ6IHN0cmluZyk6IGJvb2xlYW47XHJcbiAgICBicmVha3BvaW50czogTWVkaWFCcmVha3BvaW50cztcclxuICAgIHdpZHRoOiBudW1iZXI7XHJcbn0gXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElNZWRpYVByb3ZpZGVyIGV4dGVuZHMgbmcuSVNlcnZpY2VQcm92aWRlciB7XHJcbiAgICBicmVha3BvaW50czogTWVkaWFCcmVha3BvaW50cztcclxufVxyXG5cclxuY2xhc3MgTWVkaWFQcm92aWRlciB7XHJcbiAgICBwdWJsaWMgZ2V0IGJyZWFrcG9pbnRzKCk6IE1lZGlhQnJlYWtwb2ludHMge1xyXG4gICAgICAgIHJldHVybiBNYWluQnJlYWtwb2ludHM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBicmVha3BvaW50cyh2YWx1ZTogTWVkaWFCcmVha3BvaW50cykge1xyXG4gICAgICAgIE1haW5CcmVha3BvaW50cyA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyAkZ2V0KCkge1xyXG4gICAgICAgIGxldCBzZXJ2aWNlID0gZnVuY3Rpb24oc2l6ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWFpbkJyZWFrcG9pbnRTdGF0dXNlc1tzaXplXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzZXJ2aWNlLCAnYnJlYWtwb2ludHMnLCB7XHJcbiAgICAgICAgICAgIGdldDogKCkgPT4geyByZXR1cm4gTWFpbkJyZWFrcG9pbnRzOyB9LFxyXG4gICAgICAgICAgICBzZXQ6ICh2YWx1ZSkgPT4geyBcclxuICAgICAgICAgICAgICAgIE1haW5CcmVha3BvaW50cyA9IHZhbHVlIHx8IG5ldyBNZWRpYUJyZWFrcG9pbnRzKDYzOSwgNzE2LCAxMDI0LCAxNDM5KTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgTWFpbkJyZWFrcG9pbnRTdGF0dXNlcy51cGRhdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgTWFpbkJyZWFrcG9pbnRzLCBcclxuICAgICAgICAgICAgICAgICAgICBNYWluQnJlYWtwb2ludFN0YXR1c2VzLndpZHRoXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzZXJ2aWNlLCAnd2lkdGgnLCB7XHJcbiAgICAgICAgICAgIGdldDogKCkgPT4geyBcclxuICAgICAgICAgICAgICAgIHJldHVybiBNYWluQnJlYWtwb2ludFN0YXR1c2VzLndpZHRoOyBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gc2VydmljZTsgXHJcbiAgICB9XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ3BpcE1lZGlhJylcclxuICAgIC5wcm92aWRlcigncGlwTWVkaWEnLCBNZWRpYVByb3ZpZGVyKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubGV0IGF0dGFjaEV2ZW50ID0gKDxhbnk+ZG9jdW1lbnQpLmF0dGFjaEV2ZW50O1xyXG5sZXQgaXNJRSA9IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1RyaWRlbnQvKTtcclxuXHJcbmZ1bmN0aW9uIHJlcXVlc3RGcmFtZShjYWxsYmFjayk6IGFueSB7XHJcbiAgICBsZXQgZnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIFxyXG4gICAgICAgIHx8ICg8YW55PndpbmRvdykubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIFxyXG4gICAgICAgIHx8ICg8YW55PndpbmRvdykud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIFxyXG4gICAgICAgIHx8IGZ1bmN0aW9uKGNhbGxiYWNrKSB7IFxyXG4gICAgICAgICAgICByZXR1cm4gd2luZG93LnNldFRpbWVvdXQoY2FsbGJhY2ssIDIwKTsgICAgIFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGZyYW1lKGNhbGxiYWNrKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2FuY2VsRnJhbWUoKTogYW55IHtcclxuICAgIGxldCBjYW5jZWwgPSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgXHJcbiAgICAgICAgfHwgKDxhbnk+d2luZG93KS5tb3pDYW5jZWxBbmltYXRpb25GcmFtZSBcclxuICAgICAgICB8fCAoPGFueT53aW5kb3cpLndlYmtpdENhbmNlbEFuaW1hdGlvbkZyYW1lIFxyXG4gICAgICAgIHx8IHdpbmRvdy5jbGVhclRpbWVvdXQ7XHJcblxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGlkKSB7IFxyXG4gICAgICAgIHJldHVybiBjYW5jZWwoaWQpOyBcclxuICAgIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlc2l6ZUxpc3RlbmVyKGV2ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgIHZhciB3aW4gPSBldmVudC50YXJnZXQgfHwgZXZlbnQuc3JjRWxlbWVudDtcclxuICAgIGlmICh3aW4uX19yZXNpemVSQUZfXykgY2FuY2VsRnJhbWUoLyp3aW4uX19yZXNpemVSQUZfXyovKTtcclxuICAgIHdpbi5fX3Jlc2l6ZVJBRl9fID0gcmVxdWVzdEZyYW1lKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB0cmlnZ2VyID0gd2luLl9fcmVzaXplVHJpZ2dlcl9fO1xyXG4gICAgICAgIHRyaWdnZXIuX19yZXNpemVMaXN0ZW5lcnNfXy5mb3JFYWNoKGZ1bmN0aW9uKGZuKXtcclxuICAgICAgICAgICAgZm4uY2FsbCh0cmlnZ2VyLCBldmVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gbG9hZExpc3RlbmVyKGV2ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgIHRoaXMuY29udGVudERvY3VtZW50LmRlZmF1bHRWaWV3Ll9fcmVzaXplVHJpZ2dlcl9fID0gdGhpcy5fX3Jlc2l6ZUVsZW1lbnRfXztcclxuICAgIHRoaXMuY29udGVudERvY3VtZW50LmRlZmF1bHRWaWV3LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZUxpc3RlbmVyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZFJlc2l6ZUxpc3RlbmVyKGVsZW1lbnQsIGxpc3RlbmVyKTogdm9pZCB7XHJcbiAgICBpZiAoIWVsZW1lbnQuX19yZXNpemVMaXN0ZW5lcnNfXykge1xyXG4gICAgICAgIGVsZW1lbnQuX19yZXNpemVMaXN0ZW5lcnNfXyA9IFtdO1xyXG4gICAgICAgIGlmIChhdHRhY2hFdmVudCkge1xyXG4gICAgICAgICAgICBlbGVtZW50Ll9fcmVzaXplVHJpZ2dlcl9fID0gZWxlbWVudDtcclxuICAgICAgICAgICAgZWxlbWVudC5hdHRhY2hFdmVudCgnb25yZXNpemUnLCByZXNpemVMaXN0ZW5lcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5wb3NpdGlvbiA9PSAnc3RhdGljJykgZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XHJcbiAgICAgICAgICAgIHZhciBvYmo6IGFueSA9IGVsZW1lbnQuX19yZXNpemVUcmlnZ2VyX18gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvYmplY3QnKTtcclxuICAgICAgICAgICAgb2JqLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnZGlzcGxheTogYmxvY2s7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgdG9wOiAwOyBsZWZ0OiAwOyBoZWlnaHQ6IDEwMCU7IHdpZHRoOiAxMDAlOyBvdmVyZmxvdzogaGlkZGVuOyBwb2ludGVyLWV2ZW50czogbm9uZTsgei1pbmRleDogLTE7Jyk7XHJcbiAgICAgICAgICAgIG9iai5fX3Jlc2l6ZUVsZW1lbnRfXyA9IGVsZW1lbnQ7XHJcbiAgICAgICAgICAgIG9iai5vbmxvYWQgPSBsb2FkTGlzdGVuZXI7XHJcbiAgICAgICAgICAgIG9iai50eXBlID0gJ3RleHQvaHRtbCc7XHJcbiAgICAgICAgICAgIGlmIChpc0lFKSBlbGVtZW50LmFwcGVuZENoaWxkKG9iaik7XHJcbiAgICAgICAgICAgIG9iai5kYXRhID0gJ2Fib3V0OmJsYW5rJztcclxuICAgICAgICAgICAgaWYgKCFpc0lFKSBlbGVtZW50LmFwcGVuZENoaWxkKG9iaik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGVsZW1lbnQuX19yZXNpemVMaXN0ZW5lcnNfXy5wdXNoKGxpc3RlbmVyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVJlc2l6ZUxpc3RlbmVyKGVsZW1lbnQsIGxpc3RlbmVyKTogdm9pZCB7XHJcbiAgICBpZiAobGlzdGVuZXIpIGVsZW1lbnQuX19yZXNpemVMaXN0ZW5lcnNfXy5zcGxpY2UoZWxlbWVudC5fX3Jlc2l6ZUxpc3RlbmVyc19fLmluZGV4T2YobGlzdGVuZXIpLCAxKTtcclxuICAgIGlmICghZWxlbWVudC5fX3Jlc2l6ZUxpc3RlbmVyc19fLmxlbmd0aCkge1xyXG4gICAgICAgIGlmIChhdHRhY2hFdmVudCkgZWxlbWVudC5kZXRhY2hFdmVudCgnb25yZXNpemUnLCByZXNpemVMaXN0ZW5lcik7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuX19yZXNpemVUcmlnZ2VyX18uY29udGVudERvY3VtZW50LmRlZmF1bHRWaWV3LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZUxpc3RlbmVyKTtcclxuICAgICAgICAgICAgZWxlbWVudC5fX3Jlc2l6ZVRyaWdnZXJfXyA9ICFlbGVtZW50LnJlbW92ZUNoaWxkKGVsZW1lbnQuX19yZXNpemVUcmlnZ2VyX18pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncGlwTWVkaWEnLCBbXSk7XHJcblxyXG5pbXBvcnQgJy4vTWVkaWFTZXJ2aWNlJztcclxuaW1wb3J0ICcuL1Jlc2l6ZUZ1bmN0aW9ucyc7XHJcblxyXG5leHBvcnQgKiBmcm9tICcuL01lZGlhU2VydmljZSc7XHJcbmV4cG9ydCAqIGZyb20gJy4vUmVzaXplRnVuY3Rpb25zJzsiXX0=