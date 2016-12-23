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
angular.module('pipLayout', ['wu.masonry', 'pipAuxPanel']);
require("./media/MediaService");
require("./media/ResizeFunctions");
require("./layouts/MainDirective");
require("./layouts/CardDirective");
require("./layouts/DialogDirective");
require("./layouts/DocumentDirective");
require("./layouts/SimpleDirective");
require("./layouts/TilesDirective");
require("./auxpanel/index");
__export(require("./media/MediaService"));
__export(require("./media/ResizeFunctions"));
},{"./auxpanel/index":4,"./layouts/CardDirective":6,"./layouts/DialogDirective":7,"./layouts/DocumentDirective":8,"./layouts/MainDirective":9,"./layouts/SimpleDirective":10,"./layouts/TilesDirective":11,"./media/MediaService":12,"./media/ResizeFunctions":13}],6:[function(require,module,exports){
'use strict';
var MediaService_1 = require("../media/MediaService");
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
            this._element = $element;
            this._rootScope = $rootScope;
            this._timeout = $timeout;
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
    .module('pipLayout')
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
},{}]},{},[5])(5)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXV4cGFuZWwvQXV4UGFuZWxEaXJlY3RpdmUudHMiLCJzcmMvYXV4cGFuZWwvQXV4UGFuZWxQYXJ0RGlyZWN0aXZlLnRzIiwic3JjL2F1eHBhbmVsL0F1eFBhbmVsU2VydmljZS50cyIsInNyYy9hdXhwYW5lbC9pbmRleC50cyIsInNyYy9pbmRleC50cyIsInNyYy9sYXlvdXRzL0NhcmREaXJlY3RpdmUudHMiLCJzcmMvbGF5b3V0cy9EaWFsb2dEaXJlY3RpdmUudHMiLCJzcmMvbGF5b3V0cy9Eb2N1bWVudERpcmVjdGl2ZS50cyIsInNyYy9sYXlvdXRzL01haW5EaXJlY3RpdmUudHMiLCJzcmMvbGF5b3V0cy9TaW1wbGVEaXJlY3RpdmUudHMiLCJzcmMvbGF5b3V0cy9UaWxlc0RpcmVjdGl2ZS50cyIsInNyYy9tZWRpYS9NZWRpYVNlcnZpY2UudHMiLCJzcmMvbWVkaWEvUmVzaXplRnVuY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsWUFBWSxDQUFDO0FBRWIsc0RBQXdEO0FBR3hELENBQUM7SUFFRDtRQUtJLHFDQUFtQixXQUE2QjtZQUh4QyxlQUFVLEdBQVcsR0FBRyxDQUFDO1lBQ3pCLGNBQVMsR0FBVyxHQUFHLENBQUM7WUFHNUIsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7UUFDcEMsQ0FBQztRQUVNLDRDQUFNLEdBQWI7WUFDSSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLDhCQUFlLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDeEYsQ0FBQztRQUVNLDRDQUFNLEdBQWI7WUFDSSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLENB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QUcsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ2hGLENBQUM7SUFDTCxDQUFDO0FBQ0wsQ0FBQztBQVRELG9EQVNDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCB7IE1haW5CcmVha3BvaW50cyB9IGZyb20gJy4uL21lZGlhL01lZGlhU2VydmljZSc7XHJcbmltcG9ydCB7IElBdXhQYW5lbFNlcnZpY2UgfSBmcm9tICcuL0F1eFBhbmVsU2VydmljZSc7XHJcblxyXG4oKCkgPT4ge1xyXG5cclxuY2xhc3MgQXV4UGFuZWxEaXJlY3RpdmVDb250cm9sbGVyIHtcclxuICAgIHByaXZhdGUgX3BpcEF1eFBhbmVsOiBJQXV4UGFuZWxTZXJ2aWNlO1xyXG4gICAgcHJpdmF0ZSBub3JtYWxTaXplOiBudW1iZXIgPSAzMjA7XHJcbiAgICBwcml2YXRlIGxhcmdlU2l6ZTogbnVtYmVyID0gNDgwO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihwaXBBdXhQYW5lbDogSUF1eFBhbmVsU2VydmljZSkge1xyXG4gICAgICAgIHRoaXMuX3BpcEF1eFBhbmVsID0gcGlwQXV4UGFuZWw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlzR3R4cygpOmJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBOdW1iZXIoJCgnYm9keScpLndpZHRoKCkpID4gTWFpbkJyZWFrcG9pbnRzLnhzICYmIHRoaXMuX3BpcEF1eFBhbmVsLmlzT3BlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpc0d0bGcoKTpib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gTnVtYmVyKCQoJ2JvZHknKS53aWR0aCgpKSA+IChNYWluQnJlYWtwb2ludHMubGcgKyB0aGlzLmxhcmdlU2l6ZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEF1eFBhbmVsRGlyZWN0aXZlKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICAgICAgY29udHJvbGxlcjogQXV4UGFuZWxEaXJlY3RpdmVDb250cm9sbGVyLFxyXG4gICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgIHRlbXBsYXRlOiAnPG1kLXNpZGVuYXYgY2xhc3M9XCJtZC1zaWRlbmF2LXJpZ2h0IG1kLXdoaXRlZnJhbWUtejIgcGlwLWF1eHBhbmVsIGNvbG9yLWNvbnRlbnQtYmdcIiBuZy1jbGFzcz1cIntcXCdwaXAtbGFyZ2VcXCc6IHZtLmlzR3RsZygpfVwiJyArIFxyXG4gICAgICAgICAgICAgICAgICAgICdtZC1jb21wb25lbnQtaWQ9XCJwaXAtYXV4cGFuZWxcIiBtZC1pcy1sb2NrZWQtb3Blbj1cInZtLmlzR3R4cygpXCIgcGlwLWZvY3VzZWQgbmctdHJhbnNjbHVkZT4nICsgXHJcbiAgICAgICAgICAgICAgICAgICAgJzwvbWQtc2lkZW5hdj4nXHJcbiAgICB9XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ3BpcEF1eFBhbmVsJylcclxuICAgIC5kaXJlY3RpdmUoJ3BpcEF1eFBhbmVsJywgQXV4UGFuZWxEaXJlY3RpdmUpO1xyXG5cclxufSkoKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG4vLyBQcmV2ZW50IGp1bmsgZnJvbSBnb2luZyBpbnRvIHR5cGVzY3JpcHQgZGVmaW5pdGlvbnNcclxuKCgpID0+IHtcclxuXHJcbmZ1bmN0aW9uIEF1eFBhbmVsUGFydERpcmVjdGl2ZUNvbnRyb2xsZXIoJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkcm9vdFNjb3BlLCBwaXBBdXhQYW5lbCkge1xyXG4gICAgXCJuZ0luamVjdFwiO1xyXG5cclxuICAgIHZhciBwYXJ0TmFtZSA9ICcnICsgJGF0dHJzLnBpcEF1eFBhbmVsUGFydDtcclxuICAgIHZhciBwYXJ0VmFsdWUgPSBudWxsO1xyXG5cclxuICAgIC8vIEJyZWFrIHBhcnQgYXBhcnRcclxuICAgIHZhciBwb3MgPSBwYXJ0TmFtZS5pbmRleE9mKCc6Jyk7XHJcbiAgICBpZiAocG9zID4gMCkge1xyXG4gICAgICAgIHBhcnRWYWx1ZSA9IHBhcnROYW1lLnN1YnN0cihwb3MgKyAxKTtcclxuICAgICAgICBwYXJ0TmFtZSA9IHBhcnROYW1lLnN1YnN0cigwLCBwb3MpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQXV4UGFuZWxDaGFuZ2VkKG51bGwsIHBpcEF1eFBhbmVsLmNvbmZpZylcclxuICAgICRyb290U2NvcGUuJG9uKCdwaXBBdXhQYW5lbENoYW5nZWQnLCBvbkF1eFBhbmVsQ2hhbmdlZCk7XHJcblxyXG4gICAgZnVuY3Rpb24gb25BdXhQYW5lbENoYW5nZWQoZXZlbnQsIGNvbmZpZykge1xyXG4gICAgICAgIHZhciBwYXJ0cyA9IGNvbmZpZy5wYXJ0cyB8fCB7fTtcclxuICAgICAgICB2YXIgY3VycmVudFBhcnRWYWx1ZSA9IGNvbmZpZ1twYXJ0TmFtZV07XHJcbiAgICAgICAgLy8gU2V0IHZpc2libGUgdmFyaWFibGUgdG8gc3dpdGNoIG5nSWZcclxuXHJcbiAgICAgICAgJHNjb3BlLnZpc2libGUgPSBwYXJ0VmFsdWUgPyBjdXJyZW50UGFydFZhbHVlID09IHBhcnRWYWx1ZSA6IGN1cnJlbnRQYXJ0VmFsdWU7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBBdXhQYW5lbFBhcnREaXJlY3RpdmUobmdJZkRpcmVjdGl2ZSkge1xyXG4gICAgXCJuZ0luamVjdFwiO1xyXG5cclxuICAgIHZhciBuZ0lmID0gbmdJZkRpcmVjdGl2ZVswXTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHRyYW5zY2x1ZGU6IG5nSWYudHJhbnNjbHVkZSxcclxuICAgICAgICBwcmlvcml0eTogbmdJZi5wcmlvcml0eSxcclxuICAgICAgICB0ZXJtaW5hbDogbmdJZi50ZXJtaW5hbCxcclxuICAgICAgICByZXN0cmljdDogbmdJZi5yZXN0cmljdCxcclxuICAgICAgICBzY29wZTogdHJ1ZSxcclxuICAgICAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGU6IGFueSwgJGVsZW1lbnQsICRhdHRycykge1xyXG4gICAgICAgICAgICAvLyBWaXN1YWxpemUgYmFzZWQgb24gdmlzaWJsZSB2YXJpYWJsZSBpbiBzY29wZVxyXG4gICAgICAgICAgICAkYXR0cnMubmdJZiA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gJHNjb3BlLnZpc2libGUgfTtcclxuICAgICAgICAgICAgbmdJZi5saW5rLmFwcGx5KG5nSWYpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY29udHJvbGxlcjogQXV4UGFuZWxQYXJ0RGlyZWN0aXZlQ29udHJvbGxlclxyXG4gICAgfTtcclxufVxyXG5cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgncGlwQXV4UGFuZWwnKVxyXG4gICAgLmRpcmVjdGl2ZSgncGlwQXV4UGFuZWxQYXJ0JywgQXV4UGFuZWxQYXJ0RGlyZWN0aXZlKTtcclxuXHJcbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuZXhwb3J0IGxldCBBdXhQYW5lbENoYW5nZWRFdmVudCA9ICdwaXBBdXhQYW5lbENoYW5nZWQnO1xyXG5leHBvcnQgbGV0IEF1eFBhbmVsU3RhdGVDaGFuZ2VkRXZlbnQgPSAncGlwQXV4UGFuZWxTdGF0ZUNoYW5nZWQnO1xyXG5leHBvcnQgbGV0IE9wZW5BdXhQYW5lbEV2ZW50ID0gJ3BpcE9wZW5BdXhQYW5lbCc7XHJcbmV4cG9ydCBsZXQgQ2xvc2VBdXhQYW5lbEV2ZW50ID0gJ3BpcENsb3NlQXV4UGFuZWwnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEF1eFBhbmVsQ29uZmlnIHtcclxuICAgIHBhcnRzOiBhbnk7XHJcbiAgICBjbGFzc2VzOiBzdHJpbmdbXTtcclxuICAgIHN0YXRlOiBhbnk7XHJcbiAgICB0eXBlOiBzdHJpbmc7XHJcbn0gXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElBdXhQYW5lbFNlcnZpY2Uge1xyXG4gICAgcmVhZG9ubHkgY29uZmlnOiBBdXhQYW5lbENvbmZpZztcclxuICAgIHJlYWRvbmx5IGNsYXNzZXM6IHN0cmluZ1tdO1xyXG4gICAgcGFydHM6IGFueTtcclxuICAgIHN0YXRlOiBhbnk7ICAgIFxyXG5cclxuICAgIGlzT3BlbigpOiBib29sZWFuO1xyXG4gICAgb3BlbigpOiB2b2lkO1xyXG4gICAgY2xvc2UoKTogdm9pZDtcclxuICAgIHRvZ2dsZSgpOiB2b2lkO1xyXG4gIFxyXG4gICAgYWRkQ2xhc3MoLi4uY2xhc3Nlczogc3RyaW5nW10pOiB2b2lkO1xyXG4gICAgcmVtb3ZlQ2xhc3MoLi4uY2xhc3Nlczogc3RyaW5nW10pOiB2b2lkO1xyXG4gXHJcbiAgICBwYXJ0KHBhcnQ6IHN0cmluZywgdmFsdWU6IGFueSk6IHZvaWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUF1eFBhbmVsUHJvdmlkZXIgZXh0ZW5kcyBuZy5JU2VydmljZVByb3ZpZGVyIHtcclxuICAgIGNvbmZpZzogQXV4UGFuZWxDb25maWc7XHJcbiAgICBwYXJ0czogYW55O1xyXG4gICAgdHlwZTogc3RyaW5nO1xyXG4gICAgY2xhc3Nlczogc3RyaW5nW107XHJcblxyXG4gICAgb3BlbigpOiB2b2lkO1xyXG4gICAgY2xvc2UoKTogdm9pZDtcclxuICAgIHRvZ2dsZSgpOiB2b2lkO1xyXG5cclxuICAgIGFkZENsYXNzKC4uLmNsYXNzZXM6IHN0cmluZ1tdKTogdm9pZDtcclxuICAgIHJlbW92ZUNsYXNzKC4uLmNsYXNzZXM6IHN0cmluZ1tdKTogdm9pZDtcclxuXHJcbiAgICBwYXJ0KHBhcnQ6IHN0cmluZywgdmFsdWU6IGFueSk6IHZvaWQ7XHJcbn1cclxuXHJcbmNsYXNzIEF1eFBhbmVsU2VydmljZSBpbXBsZW1lbnRzIElBdXhQYW5lbFNlcnZpY2Uge1xyXG4gICAgcHJpdmF0ZSBfY29uZmlnOiBBdXhQYW5lbENvbmZpZztcclxuICAgIHByaXZhdGUgX3N0YXRlOiBhbnk7XHJcbiAgICBwcml2YXRlIF9yb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlO1xyXG4gICAgcHJpdmF0ZSBfc2lkZW5hdjogbmcubWF0ZXJpYWwuSVNpZGVuYXZTZXJ2aWNlO1xyXG4gICAgcHJpdmF0ZSBpZCA9ICdwaXAtYXV4cGFuZWwnO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihjb25maWc6IEF1eFBhbmVsQ29uZmlnLCAkcm9vdFNjb3BlOiBuZy5JUm9vdFNjb3BlU2VydmljZSwgJG1kU2lkZW5hdjogbmcubWF0ZXJpYWwuSVNpZGVuYXZTZXJ2aWNlKSB7XHJcbiAgICAgICAgdGhpcy5fY29uZmlnID0gY29uZmlnO1xyXG4gICAgICAgIHRoaXMuX3Jvb3RTY29wZSA9ICRyb290U2NvcGU7XHJcbiAgICAgICAgdGhpcy5fc2lkZW5hdiA9ICRtZFNpZGVuYXY7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBjb25maWcoKTogQXV4UGFuZWxDb25maWcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb25maWc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBjbGFzc2VzKCk6IHN0cmluZ1tdIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29uZmlnLmNsYXNzZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBwYXJ0cygpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb25maWcucGFydHM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBwYXJ0cyh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgdGhpcy5fY29uZmlnLnBhcnRzID0gdmFsdWUgfHwge307XHJcbiAgICAgICAgdGhpcy5zZW5kQ29uZmlnRXZlbnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHN0YXRlKCk6IGFueSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgc3RhdGUodmFsdWU6IGFueSkge1xyXG4gICAgICAgIHRoaXMuX3N0YXRlID0gdmFsdWUgfHwge307XHJcbiAgICAgICAgdGhpcy5fcm9vdFNjb3BlLiRicm9hZGNhc3QoQXV4UGFuZWxTdGF0ZUNoYW5nZWRFdmVudCwgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpc09wZW4oKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NpZGVuYXYodGhpcy5pZCkuaXNPcGVuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9wZW4oKSB7XHJcbiAgICAgICAgdGhpcy5fc2lkZW5hdih0aGlzLmlkKS5vcGVuKCk7XHJcbiAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgcHVibGljIGNsb3NlKCkge1xyXG4gICAgICAgIHRoaXMuX3NpZGVuYXYodGhpcy5pZCkuY2xvc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdG9nZ2xlKCkge1xyXG4gICAgICAgIHRoaXMuX3NpZGVuYXYodGhpcy5pZCkudG9nZ2xlKCk7XHJcbiAgICB9XHJcbiAgXHJcbiAgICBwdWJsaWMgYWRkQ2xhc3MoLi4uY2xhc3Nlczogc3RyaW5nW10pOiB2b2lkIHtcclxuICAgICAgICBfLmVhY2goY2xhc3NlcywgKGMpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fY29uZmlnLmNsYXNzZXMucHVzaChjKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnNlbmRDb25maWdFdmVudCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmVDbGFzcyguLi5jbGFzc2VzOiBzdHJpbmdbXSk6IHZvaWQge1xyXG4gICAgICAgIF8uZWFjaChjbGFzc2VzLCAoYykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9jb25maWcuY2xhc3NlcyA9IF8ucmVqZWN0KHRoaXMuX2NvbmZpZy5jbGFzc2VzLCAoY2MpID0+IGNjID09IGMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuc2VuZENvbmZpZ0V2ZW50KCk7XHJcbiAgICB9XHJcbiBcclxuICAgIHB1YmxpYyBwYXJ0KHBhcnQ6IHN0cmluZywgdmFsdWU6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2NvbmZpZy5wYXJ0c1twYXJ0XSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuc2VuZENvbmZpZ0V2ZW50KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZW5kQ29uZmlnRXZlbnQoKSB7XHJcbiAgICAgICAgdGhpcy5fcm9vdFNjb3BlLiRlbWl0KEF1eFBhbmVsQ2hhbmdlZEV2ZW50LCB0aGlzLl9jb25maWcpO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBBdXhQYW5lbFByb3ZpZGVyIGltcGxlbWVudHMgSUF1eFBhbmVsUHJvdmlkZXIge1xyXG4gICAgcHJpdmF0ZSBfY29uZmlnOiBBdXhQYW5lbENvbmZpZyA9IHtcclxuICAgICAgICBwYXJ0czoge30sXHJcbiAgICAgICAgY2xhc3NlczogW10sXHJcbiAgICAgICAgdHlwZTogJ3N0aWNreScsXHJcbiAgICAgICAgc3RhdGU6IG51bGxcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBfc2VydmljZTogQXV4UGFuZWxTZXJ2aWNlO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgY29uZmlnKCk6IEF1eFBhbmVsQ29uZmlnIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29uZmlnO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgY29uZmlnKHZhbHVlOiBBdXhQYW5lbENvbmZpZykge1xyXG4gICAgICAgIHRoaXMuX2NvbmZpZyA9IHZhbHVlIHx8IG5ldyBBdXhQYW5lbENvbmZpZygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgcGFydHMoKTogYW55IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29uZmlnLnBhcnRzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgcGFydHModmFsdWU6IGFueSkge1xyXG4gICAgICAgIHRoaXMuX2NvbmZpZy5wYXJ0cyA9IHZhbHVlIHx8IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgdHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb25maWcudHlwZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHR5cGUodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuX2NvbmZpZy50eXBlID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBjbGFzc2VzKCk6IHN0cmluZ1tdIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29uZmlnLmNsYXNzZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBjbGFzc2VzKHZhbHVlOiBzdHJpbmdbXSkge1xyXG4gICAgICAgIHRoaXMuX2NvbmZpZy5jbGFzc2VzID0gdmFsdWUgfHwgW107XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZENsYXNzKC4uLmNsYXNzZXM6IHN0cmluZ1tdKTogdm9pZCB7XHJcbiAgICAgICAgXy5lYWNoKGNsYXNzZXMsIChjKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZy5jbGFzc2VzLnB1c2goYyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbW92ZUNsYXNzKC4uLmNsYXNzZXM6IHN0cmluZ1tdKTogdm9pZCB7XHJcbiAgICAgICAgXy5lYWNoKGNsYXNzZXMsIChjKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZy5jbGFzc2VzID0gXy5yZWplY3QodGhpcy5fY29uZmlnLmNsYXNzZXMsIChjYykgPT4gY2MgPT0gYyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiBcclxuICAgIHB1YmxpYyBwYXJ0KHBhcnQ6IHN0cmluZywgdmFsdWU6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2NvbmZpZy5wYXJ0c1twYXJ0XSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvcGVuKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3NlcnZpY2Uub3BlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbG9zZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zZXJ2aWNlLmNsb3NlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRvZ2dsZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zZXJ2aWNlLnRvZ2dsZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyAkZ2V0KCRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlLCAkbWRTaWRlbmF2OiBuZy5tYXRlcmlhbC5JU2lkZW5hdlNlcnZpY2UpIHtcclxuICAgICAgICBcIm5nSW5qZWN0XCI7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9zZXJ2aWNlID09IG51bGwpXHJcbiAgICAgICAgICAgIHRoaXMuX3NlcnZpY2UgPSBuZXcgQXV4UGFuZWxTZXJ2aWNlKHRoaXMuX2NvbmZpZywgJHJvb3RTY29wZSwgJG1kU2lkZW5hdik7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9zZXJ2aWNlO1xyXG4gICAgfSAgICAgXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhvb2tBdXhQYW5lbEV2ZW50cygkcm9vdFNjb3BlOiBuZy5JUm9vdFNjb3BlU2VydmljZSwgcGlwQXV4UGFuZWw6IElBdXhQYW5lbFNlcnZpY2UpIHtcclxuICAgICRyb290U2NvcGUuJG9uKE9wZW5BdXhQYW5lbEV2ZW50LCAoKSA9PiB7IHBpcEF1eFBhbmVsLm9wZW4oKTsgfSk7XHJcbiAgICAkcm9vdFNjb3BlLiRvbihDbG9zZUF1eFBhbmVsRXZlbnQsICgpID0+IHsgcGlwQXV4UGFuZWwuY2xvc2UoKTsgfSk7XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ3BpcEF1eFBhbmVsJylcclxuICAgIC5wcm92aWRlcigncGlwQXV4UGFuZWwnLCBBdXhQYW5lbFByb3ZpZGVyKVxyXG4gICAgLnJ1bihob29rQXV4UGFuZWxFdmVudHMpO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncGlwQXV4UGFuZWwnLCBbJ25nTWF0ZXJpYWwnXSk7XHJcblxyXG5pbXBvcnQgJy4vQXV4UGFuZWxTZXJ2aWNlJztcclxuaW1wb3J0ICcuL0F1eFBhbmVsUGFydERpcmVjdGl2ZSc7XHJcbmltcG9ydCAnLi9BdXhQYW5lbERpcmVjdGl2ZSc7XHJcblxyXG5leHBvcnQgKiBmcm9tICcuL0F1eFBhbmVsU2VydmljZSc7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3BpcExheW91dCcsIFsnd3UubWFzb25yeScsICdwaXBBdXhQYW5lbCddKTtcclxuXHJcbmltcG9ydCAnLi9tZWRpYS9NZWRpYVNlcnZpY2UnO1xyXG5pbXBvcnQgJy4vbWVkaWEvUmVzaXplRnVuY3Rpb25zJztcclxuXHJcbmltcG9ydCAnLi9sYXlvdXRzL01haW5EaXJlY3RpdmUnO1xyXG5pbXBvcnQgJy4vbGF5b3V0cy9DYXJkRGlyZWN0aXZlJztcclxuaW1wb3J0ICcuL2xheW91dHMvRGlhbG9nRGlyZWN0aXZlJztcclxuaW1wb3J0ICcuL2xheW91dHMvRG9jdW1lbnREaXJlY3RpdmUnO1xyXG5pbXBvcnQgJy4vbGF5b3V0cy9TaW1wbGVEaXJlY3RpdmUnO1xyXG5pbXBvcnQgJy4vbGF5b3V0cy9UaWxlc0RpcmVjdGl2ZSc7XHJcbmltcG9ydCAnLi9hdXhwYW5lbC9pbmRleCc7XHJcblxyXG5leHBvcnQgKiBmcm9tICcuL21lZGlhL01lZGlhU2VydmljZSc7XHJcbmV4cG9ydCAqIGZyb20gJy4vbWVkaWEvUmVzaXplRnVuY3Rpb25zJzsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgeyBNYWluUmVzaXplZEV2ZW50LCBMYXlvdXRSZXNpemVkRXZlbnQsIE1haW5CcmVha3BvaW50U3RhdHVzZXMgfSBmcm9tICcuLi9tZWRpYS9NZWRpYVNlcnZpY2UnO1xyXG5cclxuLy8gQXZvaWQgZGVmYXVsdCBleHBvcnRcclxuKCgpID0+IHtcclxuXHJcbmNsYXNzIENhcmREaXJlY3RpdmVMaW5rIHtcclxuICAgIHByaXZhdGUgX2VsZW1lbnQ6IGFueTtcclxuICAgIHByaXZhdGUgX2F0dHJzOiBhbnk7XHJcbiAgICBwcml2YXRlIF9yb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcigkcm9vdFNjb3BlOiBuZy5JUm9vdFNjb3BlU2VydmljZSwgJGVsZW1lbnQ6IGFueSwgJGF0dHJzOiBhbnkpIHtcclxuICAgICAgICB0aGlzLl9lbGVtZW50ID0gJGVsZW1lbnQ7XHJcbiAgICAgICAgdGhpcy5fcm9vdFNjb3BlID0gJHJvb3RTY29wZTtcclxuICAgICAgICB0aGlzLl9hdHRycyA9ICRhdHRycztcclxuXHJcbiAgICAgICAgLy8gQWRkIGNsYXNzIHRvIHRoZSBlbGVtZW50XHJcbiAgICAgICAgJGVsZW1lbnQuYWRkQ2xhc3MoJ3BpcC1jYXJkJyk7XHJcblxyXG4gICAgICAgIGxldCBsaXN0ZW5lciA9ICgpID0+IHsgdGhpcy5yZXNpemUoKTsgfVxyXG5cclxuICAgICAgICAvLyBSZXNpemUgZXZlcnkgdGltZSB3aW5kb3cgaXMgcmVzaXplZFxyXG4gICAgICAgICRyb290U2NvcGUuJG9uKE1haW5SZXNpemVkRXZlbnQsIGxpc3RlbmVyKTtcclxuXHJcbiAgICAgICAgLy8gUmVzaXplIHJpZ2h0IGF3YXkgdG8gYXZvaWQgZmxpY2tpbmdcclxuICAgICAgICB0aGlzLnJlc2l6ZSgpO1xyXG5cclxuICAgICAgICAvLyBSZXNpemUgdGhlIGVsZW1lbnQgcmlnaHQgYXdheVxyXG4gICAgICAgIHNldFRpbWVvdXQobGlzdGVuZXIsIDEwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZXNpemUoKSB7XHJcbiAgICAgICAgdmFyXHJcbiAgICAgICAgICAgICRtYWluQm9keSA9ICQoJy5waXAtbWFpbi1ib2R5JyksXHJcbiAgICAgICAgICAgIGNhcmRDb250YWluZXIgPSAkKCcucGlwLWNhcmQtY29udGFpbmVyJyksXHJcbiAgICAgICAgICAgIHdpbmRvd1dpZHRoID0gJCgncGlwLW1haW4nKS53aWR0aCgpLFxyXG4gICAgICAgICAgICBtYXhXaWR0aCA9ICRtYWluQm9keS53aWR0aCgpLFxyXG4gICAgICAgICAgICBtYXhIZWlnaHQgPSAkbWFpbkJvZHkuaGVpZ2h0KCksXHJcbiAgICAgICAgICAgIG1pbldpZHRoID0gdGhpcy5fYXR0cnMubWluV2lkdGggPyBNYXRoLmZsb29yKHRoaXMuX2F0dHJzLm1pbldpZHRoKSA6IG51bGwsXHJcbiAgICAgICAgICAgIG1pbkhlaWdodCA9IHRoaXMuX2F0dHJzLm1pbkhlaWdodCA/IE1hdGguZmxvb3IodGhpcy5fYXR0cnMubWluSGVpZ2h0KSA6IG51bGwsXHJcbiAgICAgICAgICAgIHdpZHRoID0gdGhpcy5fYXR0cnMud2lkdGggPyBNYXRoLmZsb29yKHRoaXMuX2F0dHJzLndpZHRoKSA6IG51bGwsXHJcbiAgICAgICAgICAgIGhlaWdodCA9IHRoaXMuX2F0dHJzLmhlaWdodCA/IE1hdGguZmxvb3IodGhpcy5fYXR0cnMuaGVpZ2h0KSA6IG51bGwsXHJcbiAgICAgICAgICAgIGxlZnQsIHRvcDtcclxuXHJcbiAgICAgICAgLy8gRnVsbC1zY3JlZW4gb24gcGhvbmVcclxuICAgICAgICBpZiAoTWFpbkJyZWFrcG9pbnRTdGF0dXNlcy54cykge1xyXG4gICAgICAgICAgICBtaW5XaWR0aCA9IG51bGw7XHJcbiAgICAgICAgICAgIG1pbkhlaWdodCA9IG51bGw7XHJcbiAgICAgICAgICAgIHdpZHRoID0gbnVsbDtcclxuICAgICAgICAgICAgaGVpZ2h0ID0gbnVsbDtcclxuICAgICAgICAgICAgbWF4V2lkdGggPSBudWxsO1xyXG4gICAgICAgICAgICBtYXhIZWlnaHQgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBDYXJkIHZpZXcgd2l0aCBhZGp1c3RhYmxlIG1hcmdpbnMgb24gdGFibGV0IGFuZCBkZXNrdG9wXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIFNldCBtYXJnaW4gYW5kIG1heGltdW0gZGltZW5zaW9uc1xyXG4gICAgICAgICAgICB2YXIgc3BhY2UgPSBNYWluQnJlYWtwb2ludFN0YXR1c2VzWydndC1tZCddID8gMjQgOiAxNjtcclxuICAgICAgICAgICAgbWF4V2lkdGggLT0gc3BhY2UgKiAyO1xyXG4gICAgICAgICAgICBtYXhIZWlnaHQgLT0gc3BhY2UgKiAyO1xyXG5cclxuICAgICAgICAgICAgLy8gU2V0IG1pbmltdW0gZGltZW5zaW9uc1xyXG4gICAgICAgICAgICBtaW5XaWR0aCA9IG1pbldpZHRoID8gTWF0aC5taW4obWluV2lkdGgsIG1heFdpZHRoKSA6IG51bGw7XHJcbiAgICAgICAgICAgIG1pbkhlaWdodCA9IG1pbkhlaWdodCA/IE1hdGgubWluKG1pbkhlaWdodCwgbWF4SGVpZ2h0KSA6IG51bGw7XHJcblxyXG4gICAgICAgICAgICAvLyBTZXQgcmVndWxhciBkaW1lbnNpb25zXHJcbiAgICAgICAgICAgIHdpZHRoID0gd2lkdGggPyBNYXRoLm1pbih3aWR0aCwgbWF4V2lkdGgpIDogbnVsbDtcclxuICAgICAgICAgICAgaGVpZ2h0ID0gaGVpZ2h0ID8gTWF0aC5taW4oaGVpZ2h0LCBtYXhIZWlnaHQpIDogbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFNldCBkaW1lbnNpb25zXHJcbiAgICAgICAgdGhpcy5fZWxlbWVudC5jc3MoJ21heC13aWR0aCcsIG1heFdpZHRoID8gbWF4V2lkdGggKyAncHgnIDogJycpO1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQuY3NzKCdtaW4td2lkdGgnLCBtaW5XaWR0aCA/IG1pbldpZHRoICsgJ3B4JyA6ICcnKTtcclxuICAgICAgICB0aGlzLl9lbGVtZW50LmNzcygnd2lkdGgnLCB3aWR0aCA/IHdpZHRoICsgJ3B4JyA6ICcnKTtcclxuICAgICAgICB0aGlzLl9lbGVtZW50LmNzcygnaGVpZ2h0JywgaGVpZ2h0ID8gaGVpZ2h0ICsgJ3B4JyA6ICcnKTtcclxuXHJcbiAgICAgICAgaWYgKCFjYXJkQ29udGFpbmVyLmhhc0NsYXNzKCdwaXAtb3V0ZXItc2Nyb2xsJykpIHtcclxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5jc3MoJ21heC1oZWlnaHQnLCBtYXhIZWlnaHQgPyBtYXhIZWlnaHQgKyAncHgnIDogJycpO1xyXG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LmNzcygnbWluLWhlaWdodCcsIG1pbkhlaWdodCA/IG1pbkhlaWdodCArICdweCcgOiAnJyk7XHJcbiAgICAgICAgICAgIHZhclxyXG4gICAgICAgICAgICAgICAgJGhlYWRlciA9IHRoaXMuX2VsZW1lbnQuZmluZCgnLnBpcC1oZWFkZXI6dmlzaWJsZScpLFxyXG4gICAgICAgICAgICAgICAgJGZvb3RlciA9IHRoaXMuX2VsZW1lbnQuZmluZCgnLnBpcC1mb290ZXI6dmlzaWJsZScpLFxyXG4gICAgICAgICAgICAgICAgJGJvZHkgPSB0aGlzLl9lbGVtZW50LmZpbmQoJy5waXAtYm9keScpLFxyXG4gICAgICAgICAgICAgICAgbWF4Qm9keUhlaWdodCA9IG1heEhlaWdodCB8fCAkbWFpbkJvZHkuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoJGhlYWRlci5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAgbWF4Qm9keUhlaWdodCAtPSAkaGVhZGVyLm91dGVySGVpZ2h0KHRydWUpO1xyXG4gICAgICAgICAgICBpZiAoJGZvb3Rlci5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAgbWF4Qm9keUhlaWdodCAtPSAkZm9vdGVyLm91dGVySGVpZ2h0KHRydWUpO1xyXG5cclxuICAgICAgICAgICAgJGJvZHkuY3NzKCdtYXgtaGVpZ2h0JywgbWF4Qm9keUhlaWdodCArICdweCcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNhcmRDb250YWluZXIuYWRkQ2xhc3MoJ3BpcC1zY3JvbGwnKTtcclxuICAgICAgICAgICAgaWYgKE1haW5CcmVha3BvaW50U3RhdHVzZXMueHMpIHtcclxuICAgICAgICAgICAgICAgIGxlZnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgdG9wID0gMDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxlZnQgPSBjYXJkQ29udGFpbmVyLndpZHRoKCkgLyAyIC0gdGhpcy5fZWxlbWVudC53aWR0aCgpIC8gMiAtIDE2O1xyXG4gICAgICAgICAgICAgICAgdG9wID0gTWF0aC5tYXgoY2FyZENvbnRhaW5lci5oZWlnaHQoKSAvIDIgLSB0aGlzLl9lbGVtZW50LmhlaWdodCgpIC8gMiAtIDE2LCAwKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5jc3MoJ2xlZnQnLCBsZWZ0KTtcclxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5jc3MoJ3RvcCcsIHRvcCk7XHJcblxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgdGhpcy5fZWxlbWVudC5jc3MoJ2Rpc3BsYXknLCAnZmxleCcpOyB9LCAxMDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gTm90aWZ5IGNoaWxkIGNvbnRyb2xzIHRoYXQgbGF5b3V0IHdhcyByZXNpemVkXHJcbiAgICAgICAgdGhpcy5fcm9vdFNjb3BlLiRlbWl0KCdwaXBMYXlvdXRSZXNpemVkJyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNhcmREaXJlY3RpdmUoJHJvb3RTY29wZTogbmcuSVJvb3RTY29wZVNlcnZpY2UpIHtcclxuICAgIFwibmdJbmplY3RcIjtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIGxpbms6ICgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMpID0+IHtcclxuICAgICAgICAgICAgbmV3IENhcmREaXJlY3RpdmVMaW5rKCRyb290U2NvcGUsICRlbGVtZW50LCAkYXR0cnMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ3BpcExheW91dCcpXHJcbiAgICAuZGlyZWN0aXZlKCdwaXBDYXJkJywgY2FyZERpcmVjdGl2ZSk7XHJcblxyXG59KSgpOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8vIEF2b2lkIGRlZmF1bHQgZXhwb3J0XHJcbigoKSA9PiB7XHJcblxyXG5mdW5jdGlvbiBkaWFsb2dEaXJlY3RpdmUoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIGxpbms6ICgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMpID0+IHtcclxuICAgICAgICAgICAgJGVsZW1lbnQuYWRkQ2xhc3MoJ3BpcC1kaWFsb2cnKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdwaXBMYXlvdXQnKVxyXG4gICAgLmRpcmVjdGl2ZSgncGlwRGlhbG9nJywgZGlhbG9nRGlyZWN0aXZlKTtcclxuXHJcbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy8gQXZvaWQgZGVmYXVsdCBleHBvcnRcclxuKCgpID0+IHtcclxuXHJcbmZ1bmN0aW9uIGRvY3VtZW50RGlyZWN0aXZlKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICBsaW5rOiAoJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzKSA9PiB7XHJcbiAgICAgICAgICAgICRlbGVtZW50LmFkZENsYXNzKCdwaXAtZG9jdW1lbnQnKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdwaXBMYXlvdXQnKVxyXG4gICAgLmRpcmVjdGl2ZSgncGlwRG9jdW1lbnQnLCBkb2N1bWVudERpcmVjdGl2ZSk7XHJcblxyXG59KSgpOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCB7IGFkZFJlc2l6ZUxpc3RlbmVyLCByZW1vdmVSZXNpemVMaXN0ZW5lciB9IGZyb20gJy4uL21lZGlhL1Jlc2l6ZUZ1bmN0aW9ucyc7XHJcbmltcG9ydCB7IE1haW5CcmVha3BvaW50cywgTWFpbkJyZWFrcG9pbnRTdGF0dXNlcywgTWFpblJlc2l6ZWRFdmVudCB9IGZyb20gJy4uL21lZGlhL01lZGlhU2VydmljZSc7IFxyXG5cclxuLy8gQXZvaWQgZGVmYXVsdCBleHBvcnRcclxuKCgpID0+IHtcclxuXHJcbmNsYXNzIE1haW5EaXJlY3RpdmVDb250cm9sbGVyIHtcclxuICAgIHByaXZhdGUgX2VsZW1lbnQ6IGFueTtcclxuICAgIHByaXZhdGUgX3Jvb3RTY29wZTogbmcuSVJvb3RTY29wZVNlcnZpY2U7XHJcbiAgICBwcml2YXRlIF90aW1lb3V0OiBuZy5JVGltZW91dFNlcnZpY2U7XHJcbiAgICBwcml2YXRlIF9jb250YWluZXI6IGFueTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoXHJcbiAgICAgICAgJHNjb3BlOiBuZy5JU2NvcGUsIFxyXG4gICAgICAgICRlbGVtZW50OiBhbnksIFxyXG4gICAgICAgICRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlLFxyXG4gICAgICAgICR0aW1lb3V0OiBuZy5JVGltZW91dFNlcnZpY2UsXHJcbiAgICAgICAgJGF0dHJzOiBhbnlcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSAkZWxlbWVudDsgICAgICAgIFxyXG4gICAgICAgIHRoaXMuX3Jvb3RTY29wZSA9ICRyb290U2NvcGU7XHJcbiAgICAgICAgdGhpcy5fdGltZW91dCA9ICR0aW1lb3V0O1xyXG4gICAgICAgIHRoaXMuX2NvbnRhaW5lciA9ICRhdHRycy5waXBDb250YWluZXIgPyAkKCRhdHRycy5waXBDb250YWluZXIpIDogJGVsZW1lbnQ7XHJcblxyXG4gICAgICAgIC8vIEFkZCBDU1MgY2xhc3NcclxuICAgICAgICAkZWxlbWVudC5hZGRDbGFzcygncGlwLW1haW4nKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIHJlc2l6ZSBsaXN0ZW5lclxyXG4gICAgICAgIGxldCBsaXN0ZW5lciA9ICgpID0+IHsgdGhpcy5yZXNpemUoKTsgfTtcclxuICAgICAgICBhZGRSZXNpemVMaXN0ZW5lcih0aGlzLl9jb250YWluZXJbMF0sIGxpc3RlbmVyKTtcclxuXHJcbiAgICAgICAgLy8gVW5iaW5kIHdoZW4gc2NvcGUgaXMgcmVtb3ZlZFxyXG4gICAgICAgICRzY29wZS4kb24oJyRkZXN0cm95JywgKCkgPT4ge1xyXG4gICAgICAgICAgICByZW1vdmVSZXNpemVMaXN0ZW5lcih0aGlzLl9jb250YWluZXJbMF0sIGxpc3RlbmVyKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gUGVyZm9ybSBpbml0aWFsIGNhbGN1bGF0aW9uc1xyXG4gICAgICAgIHRoaXMudXBkYXRlQnJlYWtwb2ludFN0YXR1c2VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVCcmVha3BvaW50U3RhdHVzZXMoKSB7XHJcbiAgICAgICAgbGV0IHdpZHRoID0gdGhpcy5fY29udGFpbmVyLmlubmVyV2lkdGgoKTtcclxuICAgICAgICBsZXQgYm9keSA9ICQoJ2JvZHknKTtcclxuXHJcbiAgICAgICAgTWFpbkJyZWFrcG9pbnRTdGF0dXNlcy51cGRhdGUoTWFpbkJyZWFrcG9pbnRzLCB3aWR0aCk7XHJcblxyXG4gICAgICAgICQuZWFjaChNYWluQnJlYWtwb2ludFN0YXR1c2VzLCAoYnJlYWtwb2ludCwgc3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChfLmlzQm9vbGVhbihzdGF0dXMpKVxyXG4gICAgICAgICAgICAgICAgYm9keVtzdGF0dXMgPyAnYWRkQ2xhc3MnOiAncmVtb3ZlQ2xhc3MnXSgncGlwLScgKyBicmVha3BvaW50KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5fdGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSByZXNpemUoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVCcmVha3BvaW50U3RhdHVzZXMoKTtcclxuICAgICAgICB0aGlzLl9yb290U2NvcGUuJGVtaXQoTWFpblJlc2l6ZWRFdmVudCwgTWFpbkJyZWFrcG9pbnRTdGF0dXNlcyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIE1haW5Cb2R5RGlyZWN0aXZlTGluayB7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoXHJcbiAgICAgICAgJHNjb3BlOiBuZy5JU2NvcGUsIFxyXG4gICAgICAgICRlbGVtZW50OiBhbnlcclxuICAgICkge1xyXG4gICAgICAgIC8vIEFkZCBDU1MgY2xhc3NcclxuICAgICAgICAkZWxlbWVudC5hZGRDbGFzcygncGlwLW1haW4tYm9keScpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBtYWluRGlyZWN0aXZlKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICBjb250cm9sbGVyOiBNYWluRGlyZWN0aXZlQ29udHJvbGxlcixcclxuICAgICAgICBjb250cm9sbGVyQXM6ICd2bScgXHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1haW5Cb2R5RGlyZWN0aXZlKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICBsaW5rOiBNYWluQm9keURpcmVjdGl2ZUxpbmtcclxuICAgIH1cclxufVxyXG5cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgncGlwTGF5b3V0JylcclxuICAgIC5kaXJlY3RpdmUoJ3BpcE1haW4nLCBtYWluRGlyZWN0aXZlKVxyXG4gICAgLmRpcmVjdGl2ZSgncGlwTWFpbkJvZHknLCBtYWluQm9keURpcmVjdGl2ZSk7XHJcblxyXG59KSgpOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8vIEF2b2lkIGRlZmF1bHQgZXhwb3J0XHJcbigoKSA9PiB7XHJcblxyXG5mdW5jdGlvbiBzaW1wbGVEaXJlY3RpdmUoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIGxpbms6ICgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMpID0+IHtcclxuICAgICAgICAgICAgJGVsZW1lbnQuYWRkQ2xhc3MoJ3BpcC1zaW1wbGUnKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdwaXBMYXlvdXQnKVxyXG4gICAgLmRpcmVjdGl2ZSgncGlwU2ltcGxlJywgc2ltcGxlRGlyZWN0aXZlKTtcclxuXHJcbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0IHsgYWRkUmVzaXplTGlzdGVuZXIsIHJlbW92ZVJlc2l6ZUxpc3RlbmVyIH0gZnJvbSAnLi4vbWVkaWEvUmVzaXplRnVuY3Rpb25zJztcclxuaW1wb3J0IHsgTWFpblJlc2l6ZWRFdmVudCwgTGF5b3V0UmVzaXplZEV2ZW50LCBNYWluQnJlYWtwb2ludHMsIE1haW5CcmVha3BvaW50U3RhdHVzZXMgfSBmcm9tICcuLi9tZWRpYS9NZWRpYVNlcnZpY2UnO1xyXG5cclxuZGVjbGFyZSB2YXIgTWFzb25yeTogYW55O1xyXG5cclxuY2xhc3MgVGlsZXNEaXJlY3RpdmVMaW5rIHtcclxuICAgIHByaXZhdGUgX2VsZW1lbnQ6IGFueTtcclxuICAgIHByaXZhdGUgX2F0dHJzOiBhbnk7XHJcbiAgICBwcml2YXRlIF9yb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlO1xyXG4gICAgcHJpdmF0ZSBfY29sdW1uV2lkdGg6IG51bWJlcjtcclxuICAgIHByaXZhdGUgX2NvbnRhaW5lcjogYW55O1xyXG4gICAgcHJpdmF0ZSBfcHJldkNvbnRhaW5lcldpZHRoOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9tYXNvbnJ5OiBhbnk7XHJcbiAgICBwcml2YXRlIF9zaXplcjogYW55O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcigkc2NvcGU6IG5nLklTY29wZSwgJGVsZW1lbnQ6IGFueSwgJHJvb3RTY29wZTogbmcuSVJvb3RTY29wZVNlcnZpY2UsICRhdHRyczogYW55KSB7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudCA9ICRlbGVtZW50O1xyXG4gICAgICAgIHRoaXMuX3Jvb3RTY29wZSA9ICRyb290U2NvcGU7XHJcbiAgICAgICAgdGhpcy5fYXR0cnMgPSAkYXR0cnM7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbHVtbldpZHRoID0gJGF0dHJzLmNvbHVtbldpZHRoID8gTWF0aC5mbG9vcigkYXR0cnMuY29sdW1uV2lkdGgpIDogNDQwLFxyXG4gICAgICAgIHRoaXMuX2NvbnRhaW5lciA9ICRlbGVtZW50LmNoaWxkcmVuKCcucGlwLXRpbGVzLWNvbnRhaW5lcicpLFxyXG4gICAgICAgIHRoaXMuX3ByZXZDb250YWluZXJXaWR0aCA9IG51bGwsXHJcbiAgICAgICAgdGhpcy5fbWFzb25yeSA9IE1hc29ucnkuZGF0YSh0aGlzLl9jb250YWluZXJbMF0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEFkZCBjbGFzcyB0byB0aGUgZWxlbWVudFxyXG4gICAgICAgICRlbGVtZW50LmFkZENsYXNzKCdwaXAtdGlsZXMnKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIHJlc2l6ZSBsaXN0ZW5lclxyXG4gICAgICAgIGxldCBsaXN0ZW5lciA9ICgpID0+IHsgdGhpcy5yZXNpemUoZmFsc2UpOyB9O1xyXG4gICAgICAgIGFkZFJlc2l6ZUxpc3RlbmVyKCRlbGVtZW50WzBdLCBsaXN0ZW5lcik7XHJcblxyXG4gICAgICAgIC8vIFVuYmluZCB3aGVuIHNjb3BlIGlzIHJlbW92ZWRcclxuICAgICAgICAkc2NvcGUuJG9uKCckZGVzdHJveScsICgpID0+IHtcclxuICAgICAgICAgICAgcmVtb3ZlUmVzaXplTGlzdGVuZXIoJGVsZW1lbnRbMF0sIGxpc3RlbmVyKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gSW5zZXJ0IHNpemVyXHJcbiAgICAgICAgdGhpcy5fc2l6ZXIgPSAkKCc8ZGl2IGNsYXNzPVwicGlwLXRpbGUtc2l6ZXJcIj48L2Rpdj4nKTtcclxuICAgICAgICB0aGlzLl9zaXplci5hcHBlbmRUbyh0aGlzLl9jb250YWluZXIpO1xyXG5cclxuICAgICAgICAvLyBSZXNpemUgZXZlcnkgdGltZSB3aW5kb3cgaXMgcmVzaXplZFxyXG4gICAgICAgICRyb290U2NvcGUuJG9uKE1haW5SZXNpemVkRXZlbnQsICgpID0+IHsgdGhpcy5yZXNpemUoZmFsc2UpOyB9KTtcclxuXHJcbiAgICAgICAgLy8gUmVzaXplIHRoZSBlbGVtZW50IHJpZ2h0IGF3YXlcclxuICAgICAgICB0aGlzLnJlc2l6ZSh0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlc2l6ZShmb3JjZTogYm9vbGVhbikge1xyXG4gICAgICAgIGxldCB3aWR0aCA9IHRoaXMuX2VsZW1lbnQucGFyZW50KCkud2lkdGgoKTtcclxuICAgICAgICBsZXQgY29udGFpbmVyV2lkdGg7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc29sZS5sb2coKTtcclxuXHJcbiAgICAgICAgaWYgKE1haW5CcmVha3BvaW50U3RhdHVzZXNbJ2d0LXhzJ10gJiYgKHdpZHRoIC0gMzYpID4gdGhpcy5fY29sdW1uV2lkdGgpIHtcclxuICAgICAgICAgICAgd2lkdGggPSB3aWR0aCAtIDI0ICogMjtcclxuXHJcbiAgICAgICAgICAgIGxldCBjb2x1bW5zID0gTWF0aC5mbG9vcih3aWR0aCAvIHRoaXMuX2NvbHVtbldpZHRoKTtcclxuICAgICAgICAgICAgY29udGFpbmVyV2lkdGggPSAodGhpcy5fY29sdW1uV2lkdGggKyAxNikgKiBjb2x1bW5zIC0gMTY7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29udGFpbmVyV2lkdGggPiB3aWR0aCkge1xyXG4gICAgICAgICAgICAgICAgY29sdW1ucy0tO1xyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyV2lkdGggPSAodGhpcy5fY29sdW1uV2lkdGggKyAxNikgKiBjb2x1bW5zIC0gMTY7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChjb2x1bW5zIDwgMSkge1xyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyV2lkdGggPSB3aWR0aDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NpemVyLmNzcygnd2lkdGgnLCBjb250YWluZXJXaWR0aCArICdweCcpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2l6ZXIuY3NzKCd3aWR0aCcsIHRoaXMuX2NvbHVtbldpZHRoICsgJ3B4Jyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vICsxMCB0byBhdm9pZCBwcmVjaXNpb24gcmVsYXRlZCBlcnJvclxyXG4gICAgICAgICAgICB0aGlzLl9jb250YWluZXIuY3NzKCd3aWR0aCcsIChjb250YWluZXJXaWR0aCArIDEwKSArICdweCcpO1xyXG4gICAgICAgICAgICB0aGlzLl9jb250YWluZXIucmVtb3ZlQ2xhc3MoJ3BpcC1tb2JpbGUnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB3aWR0aCA9IHdpZHRoIC0gMTYgKiAyO1xyXG4gICAgICAgICAgICBjb250YWluZXJXaWR0aCA9IHdpZHRoO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fc2l6ZXIuY3NzKCd3aWR0aCcsIGNvbnRhaW5lcldpZHRoICsgJ3B4Jyk7XHJcbiAgICAgICAgICAgIC8vICsxMCB0byBhdm9pZCBwcmVjaXNpb24gcmVsYXRlZCBlcnJvclxyXG4gICAgICAgICAgICB0aGlzLl9jb250YWluZXIuY3NzKCd3aWR0aCcsIChjb250YWluZXJXaWR0aCArIDEwKSArICdweCcpO1xyXG4gICAgICAgICAgICB0aGlzLl9jb250YWluZXIuYWRkQ2xhc3MoJ3BpcC1tb2JpbGUnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIE1hbnVhbGx5IGNhbGwgbGF5b3V0IG9uIHRpbGUgY29udGFpbmVyXHJcbiAgICAgICAgaWYgKHRoaXMuX3ByZXZDb250YWluZXJXaWR0aCAhPSBjb250YWluZXJXaWR0aCB8fCBmb3JjZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9wcmV2Q29udGFpbmVyV2lkdGggPSBjb250YWluZXJXaWR0aDtcclxuICAgICAgICAgICAgdGhpcy5fbWFzb25yeS5sYXlvdXQoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIE5vdGlmeSBjaGlsZCBjb250cm9scyB0aGF0IGxheW91dCB3YXMgcmVzaXplZFxyXG4gICAgICAgICAgICB0aGlzLl9yb290U2NvcGUuJGVtaXQoTGF5b3V0UmVzaXplZEV2ZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRpbGVzRGlyZWN0aXZlKCRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlKSB7XHJcbiAgICBcIm5nSW5qZWN0XCI7XHJcblxyXG4gICAgLy8gQ29udmVydHMgdmFsdWUgaW50byBib29sZWFuXHJcbiAgICBmdW5jdGlvbiBjb252ZXJ0VG9Cb29sZWFuKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlID09IG51bGwpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlID09ICcxJyB8fCB2YWx1ZSA9PSAndHJ1ZSc7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICBzY29wZTogZmFsc2UsXHJcbiAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcclxuICAgICAgICB0ZW1wbGF0ZTpcclxuICAgICAgICAgICAgKCRlbGVtZW50OiBhbnksICRhdHRyczogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY29udmVydFRvQm9vbGVhbigkYXR0cnMucGlwSW5maW5pdGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFN0cmluZygpXHJcbiAgICAgICAgICAgICAgICAgICAgKyAnPGRpdiBtYXNvbnJ5IGNsYXNzPVwicGlwLXRpbGVzLWNvbnRhaW5lclwiIGxvYWQtaW1hZ2VzPVwiZmFsc2VcIiBwcmVzZXJ2ZS1vcmRlciAgJ1xyXG4gICAgICAgICAgICAgICAgICAgICsgJyBuZy10cmFuc2NsdWRlIGNvbHVtbi13aWR0aD1cIi5waXAtdGlsZS1zaXplclwiIGl0ZW0tc2VsZWN0b3I9XCIucGlwLXRpbGVcIidcclxuICAgICAgICAgICAgICAgICAgICArICcgbWFzb25yeS1vcHRpb25zPVwidGlsZXNPcHRpb25zXCIgIHBpcC1zY3JvbGwtY29udGFpbmVyPVwiXFwnLnBpcC10aWxlc1xcJ1wiJ1xyXG4gICAgICAgICAgICAgICAgICAgICsgJyBwaXAtaW5maW5pdGUtc2Nyb2xsPVwicmVhZFNjcm9sbCgpXCIgPidcclxuICAgICAgICAgICAgICAgICAgICArICc8L2Rpdj4nO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gU3RyaW5nKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgKyAnPGRpdiBtYXNvbnJ5IGNsYXNzPVwicGlwLXRpbGVzLWNvbnRhaW5lclwiIGxvYWQtaW1hZ2VzPVwiZmFsc2VcIiBwcmVzZXJ2ZS1vcmRlciAgJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICArICcgbmctdHJhbnNjbHVkZSBjb2x1bW4td2lkdGg9XCIucGlwLXRpbGUtc2l6ZXJcIiBpdGVtLXNlbGVjdG9yPVwiLnBpcC10aWxlXCInXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsgJyBtYXNvbnJ5LW9wdGlvbnM9XCJ0aWxlc09wdGlvbnNcIj4nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsgJzwvZGl2Pic7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgY29udHJvbGxlcjogKCRzY29wZTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICRzY29wZS50aWxlc09wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICBndXR0ZXI6IDgsLy8xNlxyXG4gICAgICAgICAgICAgICAgaXNGaXRXaWR0aDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBpc1Jlc2l6ZUJvdW5kOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb25EdXJhdGlvbjogMCAvLyAnMC4ycydcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxpbms6ICgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMpID0+IHtcclxuICAgICAgICAgICAgbmV3IFRpbGVzRGlyZWN0aXZlTGluaygkc2NvcGUsICRlbGVtZW50LCAkcm9vdFNjb3BlLCAkYXR0cnMpO1xyXG4gICAgICAgIH0gXHJcbiAgICB9O1xyXG59XHJcblxyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdwaXBMYXlvdXQnKVxyXG4gICAgLmRpcmVjdGl2ZSgncGlwVGlsZXMnLCB0aWxlc0RpcmVjdGl2ZSk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmV4cG9ydCBjbGFzcyBNZWRpYUJyZWFrcG9pbnRzIHtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgICAgICB4czogbnVtYmVyLCBzbTogbnVtYmVyLCBtZDogbnVtYmVyLCBsZzogbnVtYmVyXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLnhzID0geHM7XHJcbiAgICAgICAgdGhpcy5zbSA9IHNtO1xyXG4gICAgICAgIHRoaXMubWQgPSBtZDtcclxuICAgICAgICB0aGlzLmxnID0gbGc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHhzOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgc206IG51bWJlcjtcclxuICAgIHB1YmxpYyBtZDogbnVtYmVyO1xyXG4gICAgcHVibGljIGxnOiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBNZWRpYUJyZWFrcG9pbnRTdGF0dXNlcyB7XHJcbiAgICBwdWJsaWMgd2lkdGg6IG51bWJlcjtcclxuICAgIHB1YmxpYyAneHMnOiBib29sZWFuO1xyXG4gICAgcHVibGljICdndC14cyc6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgJ3NtJzogYm9vbGVhbjtcclxuICAgIHB1YmxpYyAnZ3Qtc20nOiBib29sZWFuO1xyXG4gICAgcHVibGljICdtZCc6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgJ2d0LW1kJzogYm9vbGVhbjtcclxuICAgIHB1YmxpYyAnbGcnOiBib29sZWFuO1xyXG4gICAgcHVibGljICdndC1sZyc6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgJ3hsJzogYm9vbGVhbjtcclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKGJyZWFrcG9pbnRzOiBNZWRpYUJyZWFrcG9pbnRzLCB3aWR0aDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKGJyZWFrcG9pbnRzID09IG51bGwpIHJldHVybjtcclxuXHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHRoaXNbJ3hzJ10gPSB3aWR0aCA8PSBicmVha3BvaW50cy54cztcclxuICAgICAgICB0aGlzWydndC14cyddID0gd2lkdGggPiBicmVha3BvaW50cy54cztcclxuICAgICAgICB0aGlzWydzbSddID0gd2lkdGggPiBicmVha3BvaW50cy54cyAmJiB3aWR0aCA8PSBicmVha3BvaW50cy5zbTtcclxuICAgICAgICB0aGlzWydndC1zbSddID0gd2lkdGggPiBicmVha3BvaW50cy5zbTtcclxuICAgICAgICB0aGlzWydtZCddID0gd2lkdGggPiBicmVha3BvaW50cy5zbSAmJiB3aWR0aCA8PSBicmVha3BvaW50cy5tZDtcclxuICAgICAgICB0aGlzWydndC1tZCddID0gd2lkdGggPiBicmVha3BvaW50cy5tZDtcclxuICAgICAgICB0aGlzWydsZyddID0gd2lkdGggPiBicmVha3BvaW50cy5tZCAmJiB3aWR0aCA8PSBicmVha3BvaW50cy5sZztcclxuICAgICAgICB0aGlzWydndC1sZyddID0gd2lkdGggPiBicmVha3BvaW50cy5sZztcclxuICAgICAgICB0aGlzWyd4bCddID0gdGhpc1snZ3QtbGcnXTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGxldCBNYWluUmVzaXplZEV2ZW50OiBzdHJpbmcgPSAncGlwTWFpblJlc2l6ZWQnO1xyXG5leHBvcnQgbGV0IExheW91dFJlc2l6ZWRFdmVudDogc3RyaW5nID0gJ3BpcExheW91dFJlc2l6ZWQnO1xyXG5cclxuZXhwb3J0IGxldCBNYWluQnJlYWtwb2ludHM6IE1lZGlhQnJlYWtwb2ludHMgPSBuZXcgTWVkaWFCcmVha3BvaW50cyg2MzksIDcxNiwgMTAyNCwgMTQzOSk7XHJcbmV4cG9ydCBsZXQgTWFpbkJyZWFrcG9pbnRTdGF0dXNlczogTWVkaWFCcmVha3BvaW50U3RhdHVzZXMgPSBuZXcgTWVkaWFCcmVha3BvaW50U3RhdHVzZXMoKTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSU1lZGlhU2VydmljZSB7XHJcbiAgICAoYnJlYWtwb2ludDogc3RyaW5nKTogYm9vbGVhbjtcclxuICAgIGJyZWFrcG9pbnRzOiBNZWRpYUJyZWFrcG9pbnRzO1xyXG4gICAgd2lkdGg6IG51bWJlcjtcclxufSBcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSU1lZGlhUHJvdmlkZXIgZXh0ZW5kcyBuZy5JU2VydmljZVByb3ZpZGVyIHtcclxuICAgIGJyZWFrcG9pbnRzOiBNZWRpYUJyZWFrcG9pbnRzO1xyXG59XHJcblxyXG5jbGFzcyBNZWRpYVByb3ZpZGVyIHtcclxuICAgIHB1YmxpYyBnZXQgYnJlYWtwb2ludHMoKTogTWVkaWFCcmVha3BvaW50cyB7XHJcbiAgICAgICAgcmV0dXJuIE1haW5CcmVha3BvaW50cztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IGJyZWFrcG9pbnRzKHZhbHVlOiBNZWRpYUJyZWFrcG9pbnRzKSB7XHJcbiAgICAgICAgTWFpbkJyZWFrcG9pbnRzID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljICRnZXQoKSB7XHJcbiAgICAgICAgbGV0IHNlcnZpY2UgPSBmdW5jdGlvbihzaXplKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYWluQnJlYWtwb2ludFN0YXR1c2VzW3NpemVdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHNlcnZpY2UsICdicmVha3BvaW50cycsIHtcclxuICAgICAgICAgICAgZ2V0OiAoKSA9PiB7IHJldHVybiBNYWluQnJlYWtwb2ludHM7IH0sXHJcbiAgICAgICAgICAgIHNldDogKHZhbHVlKSA9PiB7IFxyXG4gICAgICAgICAgICAgICAgTWFpbkJyZWFrcG9pbnRzID0gdmFsdWUgfHwgbmV3IE1lZGlhQnJlYWtwb2ludHMoNjM5LCA3MTYsIDEwMjQsIDE0MzkpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBNYWluQnJlYWtwb2ludFN0YXR1c2VzLnVwZGF0ZShcclxuICAgICAgICAgICAgICAgICAgICBNYWluQnJlYWtwb2ludHMsIFxyXG4gICAgICAgICAgICAgICAgICAgIE1haW5CcmVha3BvaW50U3RhdHVzZXMud2lkdGhcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHNlcnZpY2UsICd3aWR0aCcsIHtcclxuICAgICAgICAgICAgZ2V0OiAoKSA9PiB7IFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1haW5CcmVha3BvaW50U3RhdHVzZXMud2lkdGg7IFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBzZXJ2aWNlOyBcclxuICAgIH1cclxufVxyXG5cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgncGlwTGF5b3V0JylcclxuICAgIC5wcm92aWRlcigncGlwTWVkaWEnLCBNZWRpYVByb3ZpZGVyKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubGV0IGF0dGFjaEV2ZW50ID0gKDxhbnk+ZG9jdW1lbnQpLmF0dGFjaEV2ZW50O1xyXG5sZXQgaXNJRSA9IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1RyaWRlbnQvKTtcclxuXHJcbmZ1bmN0aW9uIHJlcXVlc3RGcmFtZShjYWxsYmFjayk6IGFueSB7XHJcbiAgICBsZXQgZnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIFxyXG4gICAgICAgIHx8ICg8YW55PndpbmRvdykubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIFxyXG4gICAgICAgIHx8ICg8YW55PndpbmRvdykud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIFxyXG4gICAgICAgIHx8IGZ1bmN0aW9uKGNhbGxiYWNrKSB7IFxyXG4gICAgICAgICAgICByZXR1cm4gd2luZG93LnNldFRpbWVvdXQoY2FsbGJhY2ssIDIwKTsgICAgIFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGZyYW1lKGNhbGxiYWNrKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2FuY2VsRnJhbWUoKTogYW55IHtcclxuICAgIGxldCBjYW5jZWwgPSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgXHJcbiAgICAgICAgfHwgKDxhbnk+d2luZG93KS5tb3pDYW5jZWxBbmltYXRpb25GcmFtZSBcclxuICAgICAgICB8fCAoPGFueT53aW5kb3cpLndlYmtpdENhbmNlbEFuaW1hdGlvbkZyYW1lIFxyXG4gICAgICAgIHx8IHdpbmRvdy5jbGVhclRpbWVvdXQ7XHJcblxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGlkKSB7IFxyXG4gICAgICAgIHJldHVybiBjYW5jZWwoaWQpOyBcclxuICAgIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlc2l6ZUxpc3RlbmVyKGV2ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgIHZhciB3aW4gPSBldmVudC50YXJnZXQgfHwgZXZlbnQuc3JjRWxlbWVudDtcclxuICAgIGlmICh3aW4uX19yZXNpemVSQUZfXykgY2FuY2VsRnJhbWUoLyp3aW4uX19yZXNpemVSQUZfXyovKTtcclxuICAgIHdpbi5fX3Jlc2l6ZVJBRl9fID0gcmVxdWVzdEZyYW1lKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB0cmlnZ2VyID0gd2luLl9fcmVzaXplVHJpZ2dlcl9fO1xyXG4gICAgICAgIHRyaWdnZXIuX19yZXNpemVMaXN0ZW5lcnNfXy5mb3JFYWNoKGZ1bmN0aW9uKGZuKXtcclxuICAgICAgICAgICAgZm4uY2FsbCh0cmlnZ2VyLCBldmVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gbG9hZExpc3RlbmVyKGV2ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgIHRoaXMuY29udGVudERvY3VtZW50LmRlZmF1bHRWaWV3Ll9fcmVzaXplVHJpZ2dlcl9fID0gdGhpcy5fX3Jlc2l6ZUVsZW1lbnRfXztcclxuICAgIHRoaXMuY29udGVudERvY3VtZW50LmRlZmF1bHRWaWV3LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZUxpc3RlbmVyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZFJlc2l6ZUxpc3RlbmVyKGVsZW1lbnQsIGxpc3RlbmVyKTogdm9pZCB7XHJcbiAgICBpZiAoIWVsZW1lbnQuX19yZXNpemVMaXN0ZW5lcnNfXykge1xyXG4gICAgICAgIGVsZW1lbnQuX19yZXNpemVMaXN0ZW5lcnNfXyA9IFtdO1xyXG4gICAgICAgIGlmIChhdHRhY2hFdmVudCkge1xyXG4gICAgICAgICAgICBlbGVtZW50Ll9fcmVzaXplVHJpZ2dlcl9fID0gZWxlbWVudDtcclxuICAgICAgICAgICAgZWxlbWVudC5hdHRhY2hFdmVudCgnb25yZXNpemUnLCByZXNpemVMaXN0ZW5lcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5wb3NpdGlvbiA9PSAnc3RhdGljJykgZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XHJcbiAgICAgICAgICAgIHZhciBvYmo6IGFueSA9IGVsZW1lbnQuX19yZXNpemVUcmlnZ2VyX18gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvYmplY3QnKTtcclxuICAgICAgICAgICAgb2JqLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnZGlzcGxheTogYmxvY2s7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgdG9wOiAwOyBsZWZ0OiAwOyBoZWlnaHQ6IDEwMCU7IHdpZHRoOiAxMDAlOyBvdmVyZmxvdzogaGlkZGVuOyBwb2ludGVyLWV2ZW50czogbm9uZTsgei1pbmRleDogLTE7Jyk7XHJcbiAgICAgICAgICAgIG9iai5fX3Jlc2l6ZUVsZW1lbnRfXyA9IGVsZW1lbnQ7XHJcbiAgICAgICAgICAgIG9iai5vbmxvYWQgPSBsb2FkTGlzdGVuZXI7XHJcbiAgICAgICAgICAgIG9iai50eXBlID0gJ3RleHQvaHRtbCc7XHJcbiAgICAgICAgICAgIGlmIChpc0lFKSBlbGVtZW50LmFwcGVuZENoaWxkKG9iaik7XHJcbiAgICAgICAgICAgIG9iai5kYXRhID0gJ2Fib3V0OmJsYW5rJztcclxuICAgICAgICAgICAgaWYgKCFpc0lFKSBlbGVtZW50LmFwcGVuZENoaWxkKG9iaik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGVsZW1lbnQuX19yZXNpemVMaXN0ZW5lcnNfXy5wdXNoKGxpc3RlbmVyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVJlc2l6ZUxpc3RlbmVyKGVsZW1lbnQsIGxpc3RlbmVyKTogdm9pZCB7XHJcbiAgICBpZiAobGlzdGVuZXIpIGVsZW1lbnQuX19yZXNpemVMaXN0ZW5lcnNfXy5zcGxpY2UoZWxlbWVudC5fX3Jlc2l6ZUxpc3RlbmVyc19fLmluZGV4T2YobGlzdGVuZXIpLCAxKTtcclxuICAgIGlmICghZWxlbWVudC5fX3Jlc2l6ZUxpc3RlbmVyc19fLmxlbmd0aCkge1xyXG4gICAgICAgIGlmIChhdHRhY2hFdmVudCkgZWxlbWVudC5kZXRhY2hFdmVudCgnb25yZXNpemUnLCByZXNpemVMaXN0ZW5lcik7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuX19yZXNpemVUcmlnZ2VyX18uY29udGVudERvY3VtZW50LmRlZmF1bHRWaWV3LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZUxpc3RlbmVyKTtcclxuICAgICAgICAgICAgZWxlbWVudC5fX3Jlc2l6ZVRyaWdnZXJfXyA9ICFlbGVtZW50LnJlbW92ZUNoaWxkKGVsZW1lbnQuX19yZXNpemVUcmlnZ2VyX18pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=