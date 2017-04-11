(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).layouts = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var MediaService_1 = require("../media/MediaService");
{
    var AuxPanelDirectiveController = (function () {
        function AuxPanelDirectiveController(pipAuxPanel) {
            this.pipAuxPanel = pipAuxPanel;
            this.normalSize = 320;
            this.largeSize = 480;
        }
        AuxPanelDirectiveController.prototype.isGtxs = function () {
            return Number($('body').width()) > MediaService_1.MainBreakpoints.xs && this.pipAuxPanel.isOpen();
        };
        AuxPanelDirectiveController.prototype.isGtlg = function () {
            return Number($('body').width()) > (MediaService_1.MainBreakpoints.lg + this.largeSize);
        };
        return AuxPanelDirectiveController;
    }());
    var AuxPanel = {
        controller: AuxPanelDirectiveController,
        transclude: true,
        template: '<md-sidenav class="md-sidenav-right md-whiteframe-z2 pip-auxpanel color-content-bg" ng-class="{\'pip-large\': $ctrl.isGtlg()}"' +
            'md-component-id="pip-auxpanel" md-is-locked-open="$ctrl.isGtxs()" pip-focused ng-transclude>' +
            '</md-sidenav>'
    };
    angular
        .module('pipAuxPanel')
        .component('pipAuxPanel', AuxPanel);
}
},{"../media/MediaService":14}],2:[function(require,module,exports){
{
    AuxPanelPartDirective.$inject = ['ngIfDirective'];
    var AuxPanelPartController_1 = (function () {
        AuxPanelPartController_1.$inject = ['$scope', '$element', '$attrs', '$rootScope', 'pipAuxPanel'];
        function AuxPanelPartController_1($scope, $element, $attrs, $rootScope, pipAuxPanel) {
            "ngInject";
            var _this = this;
            this.$scope = $scope;
            this.partName = '' + $attrs.pipAuxPanelPart;
            this.pos = this.partName.indexOf(':');
            if (this.pos > 0) {
                this.partValue = this.partName.substr(this.pos + 1);
                this.partName = this.partName.substr(0, this.pos);
            }
            this.onAuxPanelChanged(null, pipAuxPanel.config);
            $rootScope.$on('pipAuxPanelChanged', function (event, config) {
                _this.onAuxPanelChanged(event, config);
            });
        }
        AuxPanelPartController_1.prototype.onAuxPanelChanged = function (event, config) {
            var parts = config.parts || {};
            var currentPartValue = config[this.partName];
            this.$scope['visible'] = this.partValue ? currentPartValue == this.partValue : currentPartValue;
        };
        return AuxPanelPartController_1;
    }());
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
                $attrs.ngIf = function () { return $scope['visible']; };
                ngIf.link.apply(ngIf);
            },
            controller: AuxPanelPartController_1
        };
    }
    angular
        .module('pipAuxPanel')
        .directive('pipAuxPanelPart', AuxPanelPartDirective);
}
},{}],3:[function(require,module,exports){
"use strict";
hookAuxPanelEvents.$inject = ['$rootScope', 'pipAuxPanel'];
var IAuxPanelService_1 = require("./IAuxPanelService");
var IAuxPanelService_2 = require("./IAuxPanelService");
var AuxPanelService = (function () {
    AuxPanelService.$inject = ['config', '$rootScope', '$mdSidenav'];
    function AuxPanelService(config, $rootScope, $mdSidenav) {
        "ngInject";
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
            this._rootScope.$broadcast(IAuxPanelService_1.AuxPanelStateChangedEvent, value);
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
        this._rootScope.$emit(IAuxPanelService_1.AuxPanelChangedEvent, this._config);
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
            this._config = value || new IAuxPanelService_2.AuxPanelConfig();
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
    $rootScope.$on(IAuxPanelService_1.OpenAuxPanelEvent, function () { pipAuxPanel.open(); });
    $rootScope.$on(IAuxPanelService_1.CloseAuxPanelEvent, function () { pipAuxPanel.close(); });
}
angular
    .module('pipAuxPanel')
    .provider('pipAuxPanel', AuxPanelProvider)
    .run(hookAuxPanelEvents);
},{"./IAuxPanelService":4}],4:[function(require,module,exports){
"use strict";
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
},{}],5:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
angular.module('pipAuxPanel', ['ngMaterial']);
require("./AuxPanelService");
require("./AuxPanelPart");
require("./AuxPanel");
__export(require("./IAuxPanelService"));
},{"./AuxPanel":1,"./AuxPanelPart":2,"./AuxPanelService":3,"./IAuxPanelService":4}],6:[function(require,module,exports){
"use strict";
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
},{"./auxpanel/index":5,"./layouts/CardDirective":7,"./layouts/DialogDirective":8,"./layouts/DocumentDirective":9,"./layouts/MainDirective":10,"./layouts/SimpleDirective":11,"./layouts/TilesDirective":12,"./media/index":16}],7:[function(require,module,exports){
"use strict";
var IMediaService_1 = require("../media/IMediaService");
var MediaService_1 = require("../media/MediaService");
(function () {
    cardDirective.$inject = ['$rootScope'];
    var CardDirectiveLink = (function () {
        CardDirectiveLink.$inject = ['$rootScope', '$element', '$attrs'];
        function CardDirectiveLink($rootScope, $element, $attrs) {
            "ngInject";
            var _this = this;
            this.$rootScope = $rootScope;
            this.$element = $element;
            this.$attrs = $attrs;
            $element.addClass('pip-card');
            var listener = function () { _this.resize(); };
            $rootScope.$on(IMediaService_1.MainResizedEvent, listener);
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
},{"../media/IMediaService":13,"../media/MediaService":14}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
"use strict";
var ResizeFunctions_1 = require("../media/ResizeFunctions");
var IMediaService_1 = require("../media/IMediaService");
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
            this.$rootScope.$emit(IMediaService_1.MainResizedEvent, MediaService_1.MainBreakpointStatuses);
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
},{"../media/IMediaService":13,"../media/MediaService":14,"../media/ResizeFunctions":15}],11:[function(require,module,exports){
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
},{}],12:[function(require,module,exports){
"use strict";
tilesDirective.$inject = ['$rootScope'];
var ResizeFunctions_1 = require("../media/ResizeFunctions");
var IMediaService_1 = require("../media/IMediaService");
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
        $rootScope.$on(IMediaService_1.MainResizedEvent, function () { _this.resize(false); });
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
            this.$rootScope.$emit(IMediaService_1.LayoutResizedEvent);
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
},{"../media/IMediaService":13,"../media/MediaService":14,"../media/ResizeFunctions":15}],13:[function(require,module,exports){
"use strict";
exports.MainResizedEvent = 'pipMainResized';
exports.LayoutResizedEvent = 'pipLayoutResized';
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
        if (breakpoints == null || width == null)
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
},{}],14:[function(require,module,exports){
"use strict";
var IMediaService_1 = require("./IMediaService");
exports.MainBreakpoints = new IMediaService_1.MediaBreakpoints(639, 716, 1024, 1439);
exports.MainBreakpointStatuses = new IMediaService_1.MediaBreakpointStatuses();
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
                exports.MainBreakpoints = value || new IMediaService_1.MediaBreakpoints(639, 716, 1024, 1439);
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
},{"./IMediaService":13}],15:[function(require,module,exports){
"use strict";
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
    if (this.contentDocument) {
        this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__;
        this.contentDocument.defaultView.addEventListener('resize', resizeListener);
    }
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
            if (element.__resizeTrigger__.contentDocument) {
                element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', resizeListener);
                element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__);
            }
        }
    }
}
exports.removeResizeListener = removeResizeListener;
},{}],16:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
angular.module('pipMedia', []);
require("./MediaService");
require("./ResizeFunctions");
__export(require("./IMediaService"));
__export(require("./MediaService"));
__export(require("./ResizeFunctions"));
},{"./IMediaService":13,"./MediaService":14,"./ResizeFunctions":15}]},{},[6])(6)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXV4cGFuZWwvQXV4UGFuZWwudHMiLCJzcmMvYXV4cGFuZWwvQXV4UGFuZWxQYXJ0LnRzIiwic3JjL2F1eHBhbmVsL0F1eFBhbmVsU2VydmljZS50cyIsInNyYy9hdXhwYW5lbC9JQXV4UGFuZWxTZXJ2aWNlLnRzIiwic3JjL2F1eHBhbmVsL2luZGV4LnRzIiwic3JjL2luZGV4LnRzIiwic3JjL2xheW91dHMvQ2FyZERpcmVjdGl2ZS50cyIsInNyYy9sYXlvdXRzL0RpYWxvZ0RpcmVjdGl2ZS50cyIsInNyYy9sYXlvdXRzL0RvY3VtZW50RGlyZWN0aXZlLnRzIiwic3JjL2xheW91dHMvTWFpbkRpcmVjdGl2ZS50cyIsInNyYy9sYXlvdXRzL1NpbXBsZURpcmVjdGl2ZS50cyIsInNyYy9sYXlvdXRzL1RpbGVzRGlyZWN0aXZlLnRzIiwic3JjL21lZGlhL0lNZWRpYVNlcnZpY2UudHMiLCJzcmMvbWVkaWEvTWVkaWFTZXJ2aWNlLnRzIiwic3JjL21lZGlhL1Jlc2l6ZUZ1bmN0aW9ucy50cyIsInNyYy9tZWRpYS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQSxzREFBd0Q7QUFHeEQsQ0FBQztJQUNHO1FBSUkscUNBQTJCLFdBQTZCO1lBQTdCLGdCQUFXLEdBQVgsV0FBVyxDQUFrQjtZQUhoRCxlQUFVLEdBQVcsR0FBRyxDQUFDO1lBQ3pCLGNBQVMsR0FBVyxHQUFHLENBQUM7UUFFNEIsQ0FBQztRQUV0RCw0Q0FBTSxHQUFiO1lBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyw4QkFBZSxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3ZGLENBQUM7UUFFTSw0Q0FBTSxHQUFiO1lBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FBQyxD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QUFtQixDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ25HLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDdEMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDO1lBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDakUsSUFBSSxDQUFDLENBQUM7WUFDRixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztnQkFDNUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsbUJBQW1CLENBQUMsUUFBUSxFQUFFLGNBQWMsQ0FBQyxDQUFDO2dCQUNwRyxPQUFPLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ2hGLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztBQUNMLENBQUM7QUFYRCxvREFXQzs7Ozs7O0FDN0VELE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBRS9CLDBCQUF3QjtBQUN4Qiw2QkFBMkI7QUFFM0IscUNBQWdDO0FBQ2hDLG9DQUErQjtBQUMvQix1Q0FBa0MiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHsgTWFpbkJyZWFrcG9pbnRzIH0gZnJvbSAnLi4vbWVkaWEvTWVkaWFTZXJ2aWNlJztcclxuaW1wb3J0IHsgSUF1eFBhbmVsU2VydmljZSB9IGZyb20gJy4vSUF1eFBhbmVsU2VydmljZSc7XHJcblxyXG57XHJcbiAgICBjbGFzcyBBdXhQYW5lbERpcmVjdGl2ZUNvbnRyb2xsZXIge1xyXG4gICAgICAgIHByaXZhdGUgbm9ybWFsU2l6ZTogbnVtYmVyID0gMzIwO1xyXG4gICAgICAgIHByaXZhdGUgbGFyZ2VTaXplOiBudW1iZXIgPSA0ODA7XHJcblxyXG4gICAgICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihwcml2YXRlIHBpcEF1eFBhbmVsOiBJQXV4UGFuZWxTZXJ2aWNlKSB7IH1cclxuXHJcbiAgICAgICAgcHVibGljIGlzR3R4cygpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIE51bWJlcigkKCdib2R5Jykud2lkdGgoKSkgPiBNYWluQnJlYWtwb2ludHMueHMgJiYgdGhpcy5waXBBdXhQYW5lbC5pc09wZW4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBpc0d0bGcoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBOdW1iZXIoJCgnYm9keScpLndpZHRoKCkpID4gKE1haW5CcmVha3BvaW50cy5sZyArIHRoaXMubGFyZ2VTaXplKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgQXV4UGFuZWw6IG5nLklDb21wb25lbnRPcHRpb25zID0ge1xyXG5cclxuICAgICAgICBjb250cm9sbGVyOiBBdXhQYW5lbERpcmVjdGl2ZUNvbnRyb2xsZXIsXHJcbiAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcclxuICAgICAgICB0ZW1wbGF0ZTogJzxtZC1zaWRlbmF2IGNsYXNzPVwibWQtc2lkZW5hdi1yaWdodCBtZC13aGl0ZWZyYW1lLXoyIHBpcC1hdXhwYW5lbCBjb2xvci1jb250ZW50LWJnXCIgbmctY2xhc3M9XCJ7XFwncGlwLWxhcmdlXFwnOiAkY3RybC5pc0d0bGcoKX1cIicgK1xyXG4gICAgICAgICdtZC1jb21wb25lbnQtaWQ9XCJwaXAtYXV4cGFuZWxcIiBtZC1pcy1sb2NrZWQtb3Blbj1cIiRjdHJsLmlzR3R4cygpXCIgcGlwLWZvY3VzZWQgbmctdHJhbnNjbHVkZT4nICtcclxuICAgICAgICAnPC9tZC1zaWRlbmF2PidcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncGlwQXV4UGFuZWwnKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ3BpcEF1eFBhbmVsJywgQXV4UGFuZWwpO1xyXG5cclxufSIsIntcclxuXHJcbiAgICBjbGFzcyBBdXhQYW5lbFBhcnRDb250cm9sbGVyIHtcclxuICAgICAgICBwcml2YXRlIHBhcnROYW1lOiBzdHJpbmc7XHJcbiAgICAgICAgcHJpdmF0ZSBwYXJ0VmFsdWU6IHN0cmluZztcclxuICAgICAgICBwcml2YXRlIHBvczogbnVtYmVyO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAgICAgcHJpdmF0ZSAkc2NvcGU6IG5nLklTY29wZSxcclxuICAgICAgICAgICAgJGVsZW1lbnQ6IG5nLklSb290RWxlbWVudFNlcnZpY2UsXHJcbiAgICAgICAgICAgICRhdHRycyxcclxuICAgICAgICAgICAgJHJvb3RTY29wZTogbmcuSVJvb3RTY29wZVNlcnZpY2UsXHJcbiAgICAgICAgICAgIHBpcEF1eFBhbmVsKSB7XHJcbiAgICAgICAgICAgIFwibmdJbmplY3RcIjtcclxuICAgICAgICAgICAgdGhpcy5wYXJ0TmFtZSA9ICcnICsgJGF0dHJzLnBpcEF1eFBhbmVsUGFydDtcclxuICAgICAgICAgICAgdGhpcy5wb3MgPSB0aGlzLnBhcnROYW1lLmluZGV4T2YoJzonKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMucG9zID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJ0VmFsdWUgPSB0aGlzLnBhcnROYW1lLnN1YnN0cih0aGlzLnBvcyArIDEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJ0TmFtZSA9IHRoaXMucGFydE5hbWUuc3Vic3RyKDAsIHRoaXMucG9zKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5vbkF1eFBhbmVsQ2hhbmdlZChudWxsLCBwaXBBdXhQYW5lbC5jb25maWcpXHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJG9uKCdwaXBBdXhQYW5lbENoYW5nZWQnLCAoZXZlbnQsIGNvbmZpZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbkF1eFBhbmVsQ2hhbmdlZChldmVudCwgY29uZmlnKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBvbkF1eFBhbmVsQ2hhbmdlZChldmVudCwgY29uZmlnKSB7XHJcbiAgICAgICAgICAgIGxldCBwYXJ0cyA9IGNvbmZpZy5wYXJ0cyB8fCB7fTtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnRQYXJ0VmFsdWUgPSBjb25maWdbdGhpcy5wYXJ0TmFtZV07XHJcbiAgICAgICAgICAgIC8vIFNldCB2aXNpYmxlIHZhcmlhYmxlIHRvIHN3aXRjaCBuZ0lmXHJcblxyXG4gICAgICAgICAgICB0aGlzLiRzY29wZVsndmlzaWJsZSddID0gdGhpcy5wYXJ0VmFsdWUgPyBjdXJyZW50UGFydFZhbHVlID09IHRoaXMucGFydFZhbHVlIDogY3VycmVudFBhcnRWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIEF1eFBhbmVsUGFydERpcmVjdGl2ZShuZ0lmRGlyZWN0aXZlKSB7XHJcbiAgICAgICAgXCJuZ0luamVjdFwiO1xyXG5cclxuICAgICAgICBsZXQgbmdJZiA9IG5nSWZEaXJlY3RpdmVbMF07XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHRyYW5zY2x1ZGU6IG5nSWYudHJhbnNjbHVkZSxcclxuICAgICAgICAgICAgcHJpb3JpdHk6IG5nSWYucHJpb3JpdHksXHJcbiAgICAgICAgICAgIHRlcm1pbmFsOiBuZ0lmLnRlcm1pbmFsLFxyXG4gICAgICAgICAgICByZXN0cmljdDogbmdJZi5yZXN0cmljdCxcclxuICAgICAgICAgICAgc2NvcGU6IHRydWUsXHJcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uICgkc2NvcGU6IG5nLklTY29wZSwgJGVsZW1lbnQsICRhdHRycykge1xyXG4gICAgICAgICAgICAgICAgLy8gVmlzdWFsaXplIGJhc2VkIG9uIHZpc2libGUgdmFyaWFibGUgaW4gc2NvcGVcclxuICAgICAgICAgICAgICAgICRhdHRycy5uZ0lmID0gKCkgPT4geyByZXR1cm4gJHNjb3BlWyd2aXNpYmxlJ10gfTtcclxuICAgICAgICAgICAgICAgIG5nSWYubGluay5hcHBseShuZ0lmKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogQXV4UGFuZWxQYXJ0Q29udHJvbGxlclxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3BpcEF1eFBhbmVsJylcclxuICAgICAgICAuZGlyZWN0aXZlKCdwaXBBdXhQYW5lbFBhcnQnLCBBdXhQYW5lbFBhcnREaXJlY3RpdmUpO1xyXG5cclxufSIsImltcG9ydCB7IEF1eFBhbmVsU3RhdGVDaGFuZ2VkRXZlbnQsIEF1eFBhbmVsQ2hhbmdlZEV2ZW50LCBPcGVuQXV4UGFuZWxFdmVudCwgQ2xvc2VBdXhQYW5lbEV2ZW50IH0gZnJvbSAnLi9JQXV4UGFuZWxTZXJ2aWNlJztcclxuaW1wb3J0IHsgQXV4UGFuZWxDb25maWcsIElBdXhQYW5lbFNlcnZpY2UsIElBdXhQYW5lbFByb3ZpZGVyIH0gZnJvbSAnLi9JQXV4UGFuZWxTZXJ2aWNlJztcclxuXHJcbmNsYXNzIEF1eFBhbmVsU2VydmljZSBpbXBsZW1lbnRzIElBdXhQYW5lbFNlcnZpY2Uge1xyXG4gICAgcHJpdmF0ZSBfY29uZmlnOiBBdXhQYW5lbENvbmZpZztcclxuICAgIHByaXZhdGUgX3N0YXRlOiBhbnk7XHJcbiAgICBwcml2YXRlIF9yb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlO1xyXG4gICAgcHJpdmF0ZSBfc2lkZW5hdjogbmcubWF0ZXJpYWwuSVNpZGVuYXZTZXJ2aWNlO1xyXG4gICAgcHJpdmF0ZSBpZCA9ICdwaXAtYXV4cGFuZWwnO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihjb25maWc6IEF1eFBhbmVsQ29uZmlnLCAkcm9vdFNjb3BlOiBuZy5JUm9vdFNjb3BlU2VydmljZSwgJG1kU2lkZW5hdjogbmcubWF0ZXJpYWwuSVNpZGVuYXZTZXJ2aWNlKSB7XHJcblxyXG4gICAgICAgIFwibmdJbmplY3RcIjtcclxuICAgICAgICB0aGlzLl9jb25maWcgPSBjb25maWc7XHJcbiAgICAgICAgdGhpcy5fcm9vdFNjb3BlID0gJHJvb3RTY29wZTtcclxuICAgICAgICB0aGlzLl9zaWRlbmF2ID0gJG1kU2lkZW5hdjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGNvbmZpZygpOiBBdXhQYW5lbENvbmZpZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbmZpZztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGNsYXNzZXMoKTogc3RyaW5nW10ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb25maWcuY2xhc3NlcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHBhcnRzKCk6IGFueSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbmZpZy5wYXJ0cztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHBhcnRzKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICB0aGlzLl9jb25maWcucGFydHMgPSB2YWx1ZSB8fCB7fTtcclxuICAgICAgICB0aGlzLnNlbmRDb25maWdFdmVudCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc3RhdGUoKTogYW55IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBzdGF0ZSh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgdGhpcy5fc3RhdGUgPSB2YWx1ZSB8fCB7fTtcclxuICAgICAgICB0aGlzLl9yb290U2NvcGUuJGJyb2FkY2FzdChBdXhQYW5lbFN0YXRlQ2hhbmdlZEV2ZW50LCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlzT3BlbigpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2lkZW5hdih0aGlzLmlkKS5pc09wZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb3BlbigpIHtcclxuICAgICAgICB0aGlzLl9zaWRlbmF2KHRoaXMuaWQpLm9wZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xvc2UoKSB7XHJcbiAgICAgICAgdGhpcy5fc2lkZW5hdih0aGlzLmlkKS5jbG9zZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0b2dnbGUoKSB7XHJcbiAgICAgICAgdGhpcy5fc2lkZW5hdih0aGlzLmlkKS50b2dnbGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQ2xhc3MoLi4uY2xhc3Nlczogc3RyaW5nW10pOiB2b2lkIHtcclxuICAgICAgICBfLmVhY2goY2xhc3NlcywgKGMpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fY29uZmlnLmNsYXNzZXMucHVzaChjKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnNlbmRDb25maWdFdmVudCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmVDbGFzcyguLi5jbGFzc2VzOiBzdHJpbmdbXSk6IHZvaWQge1xyXG4gICAgICAgIF8uZWFjaChjbGFzc2VzLCAoYykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9jb25maWcuY2xhc3NlcyA9IF8ucmVqZWN0KHRoaXMuX2NvbmZpZy5jbGFzc2VzLCAoY2MpID0+IGNjID09IGMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuc2VuZENvbmZpZ0V2ZW50KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBhcnQocGFydDogc3RyaW5nLCB2YWx1ZTogYW55KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fY29uZmlnLnBhcnRzW3BhcnRdID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5zZW5kQ29uZmlnRXZlbnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNlbmRDb25maWdFdmVudCgpIHtcclxuICAgICAgICB0aGlzLl9yb290U2NvcGUuJGVtaXQoQXV4UGFuZWxDaGFuZ2VkRXZlbnQsIHRoaXMuX2NvbmZpZyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIEF1eFBhbmVsUHJvdmlkZXIgaW1wbGVtZW50cyBJQXV4UGFuZWxQcm92aWRlciB7XHJcbiAgICBwcml2YXRlIF9jb25maWc6IEF1eFBhbmVsQ29uZmlnID0ge1xyXG4gICAgICAgIHBhcnRzOiB7fSxcclxuICAgICAgICBjbGFzc2VzOiBbXSxcclxuICAgICAgICB0eXBlOiAnc3RpY2t5JyxcclxuICAgICAgICBzdGF0ZTogbnVsbFxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIF9zZXJ2aWNlOiBBdXhQYW5lbFNlcnZpY2U7XHJcblxyXG4gICAgcHVibGljIGdldCBjb25maWcoKTogQXV4UGFuZWxDb25maWcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb25maWc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBjb25maWcodmFsdWU6IEF1eFBhbmVsQ29uZmlnKSB7XHJcbiAgICAgICAgdGhpcy5fY29uZmlnID0gdmFsdWUgfHwgbmV3IEF1eFBhbmVsQ29uZmlnKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBwYXJ0cygpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb25maWcucGFydHM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBwYXJ0cyh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgdGhpcy5fY29uZmlnLnBhcnRzID0gdmFsdWUgfHwge307XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB0eXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbmZpZy50eXBlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgdHlwZSh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5fY29uZmlnLnR5cGUgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGNsYXNzZXMoKTogc3RyaW5nW10ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb25maWcuY2xhc3NlcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IGNsYXNzZXModmFsdWU6IHN0cmluZ1tdKSB7XHJcbiAgICAgICAgdGhpcy5fY29uZmlnLmNsYXNzZXMgPSB2YWx1ZSB8fCBbXTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQ2xhc3MoLi4uY2xhc3Nlczogc3RyaW5nW10pOiB2b2lkIHtcclxuICAgICAgICBfLmVhY2goY2xhc3NlcywgKGMpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fY29uZmlnLmNsYXNzZXMucHVzaChjKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlQ2xhc3MoLi4uY2xhc3Nlczogc3RyaW5nW10pOiB2b2lkIHtcclxuICAgICAgICBfLmVhY2goY2xhc3NlcywgKGMpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fY29uZmlnLmNsYXNzZXMgPSBfLnJlamVjdCh0aGlzLl9jb25maWcuY2xhc3NlcywgKGNjKSA9PiBjYyA9PSBjKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcGFydChwYXJ0OiBzdHJpbmcsIHZhbHVlOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9jb25maWcucGFydHNbcGFydF0gPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb3BlbigpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zZXJ2aWNlLm9wZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xvc2UoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fc2VydmljZS5jbG9zZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0b2dnbGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fc2VydmljZS50b2dnbGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgJGdldCgkcm9vdFNjb3BlOiBuZy5JUm9vdFNjb3BlU2VydmljZSwgJG1kU2lkZW5hdjogbmcubWF0ZXJpYWwuSVNpZGVuYXZTZXJ2aWNlKSB7XHJcbiAgICAgICAgXCJuZ0luamVjdFwiO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fc2VydmljZSA9PSBudWxsKVxyXG4gICAgICAgICAgICB0aGlzLl9zZXJ2aWNlID0gbmV3IEF1eFBhbmVsU2VydmljZSh0aGlzLl9jb25maWcsICRyb290U2NvcGUsICRtZFNpZGVuYXYpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fc2VydmljZTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaG9va0F1eFBhbmVsRXZlbnRzKCRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlLCBwaXBBdXhQYW5lbDogSUF1eFBhbmVsU2VydmljZSkge1xyXG4gICAgJHJvb3RTY29wZS4kb24oT3BlbkF1eFBhbmVsRXZlbnQsICgpID0+IHsgcGlwQXV4UGFuZWwub3BlbigpOyB9KTtcclxuICAgICRyb290U2NvcGUuJG9uKENsb3NlQXV4UGFuZWxFdmVudCwgKCkgPT4geyBwaXBBdXhQYW5lbC5jbG9zZSgpOyB9KTtcclxufVxyXG5cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgncGlwQXV4UGFuZWwnKVxyXG4gICAgLnByb3ZpZGVyKCdwaXBBdXhQYW5lbCcsIEF1eFBhbmVsUHJvdmlkZXIpXHJcbiAgICAucnVuKGhvb2tBdXhQYW5lbEV2ZW50cyk7XHJcbiIsImV4cG9ydCBjb25zdCBBdXhQYW5lbENoYW5nZWRFdmVudCA9ICdwaXBBdXhQYW5lbENoYW5nZWQnO1xyXG5leHBvcnQgY29uc3QgQXV4UGFuZWxTdGF0ZUNoYW5nZWRFdmVudCA9ICdwaXBBdXhQYW5lbFN0YXRlQ2hhbmdlZCc7XHJcbmV4cG9ydCBjb25zdCBPcGVuQXV4UGFuZWxFdmVudCA9ICdwaXBPcGVuQXV4UGFuZWwnO1xyXG5leHBvcnQgY29uc3QgQ2xvc2VBdXhQYW5lbEV2ZW50ID0gJ3BpcENsb3NlQXV4UGFuZWwnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEF1eFBhbmVsQ29uZmlnIHtcclxuICAgIHBhcnRzOiBhbnk7XHJcbiAgICBjbGFzc2VzOiBzdHJpbmdbXTtcclxuICAgIHN0YXRlOiBhbnk7XHJcbiAgICB0eXBlOiBzdHJpbmc7XHJcbn0gXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElBdXhQYW5lbFNlcnZpY2Uge1xyXG4gICAgcmVhZG9ubHkgY29uZmlnOiBBdXhQYW5lbENvbmZpZztcclxuICAgIHJlYWRvbmx5IGNsYXNzZXM6IHN0cmluZ1tdO1xyXG4gICAgcGFydHM6IGFueTtcclxuICAgIHN0YXRlOiBhbnk7ICAgIFxyXG5cclxuICAgIGlzT3BlbigpOiBib29sZWFuO1xyXG4gICAgb3BlbigpOiB2b2lkO1xyXG4gICAgY2xvc2UoKTogdm9pZDtcclxuICAgIHRvZ2dsZSgpOiB2b2lkO1xyXG4gIFxyXG4gICAgYWRkQ2xhc3MoLi4uY2xhc3Nlczogc3RyaW5nW10pOiB2b2lkO1xyXG4gICAgcmVtb3ZlQ2xhc3MoLi4uY2xhc3Nlczogc3RyaW5nW10pOiB2b2lkO1xyXG4gXHJcbiAgICBwYXJ0KHBhcnQ6IHN0cmluZywgdmFsdWU6IGFueSk6IHZvaWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUF1eFBhbmVsUHJvdmlkZXIgZXh0ZW5kcyBuZy5JU2VydmljZVByb3ZpZGVyIHtcclxuICAgIGNvbmZpZzogQXV4UGFuZWxDb25maWc7XHJcbiAgICBwYXJ0czogYW55O1xyXG4gICAgdHlwZTogc3RyaW5nO1xyXG4gICAgY2xhc3Nlczogc3RyaW5nW107XHJcblxyXG4gICAgb3BlbigpOiB2b2lkO1xyXG4gICAgY2xvc2UoKTogdm9pZDtcclxuICAgIHRvZ2dsZSgpOiB2b2lkO1xyXG5cclxuICAgIGFkZENsYXNzKC4uLmNsYXNzZXM6IHN0cmluZ1tdKTogdm9pZDtcclxuICAgIHJlbW92ZUNsYXNzKC4uLmNsYXNzZXM6IHN0cmluZ1tdKTogdm9pZDtcclxuXHJcbiAgICBwYXJ0KHBhcnQ6IHN0cmluZywgdmFsdWU6IGFueSk6IHZvaWQ7XHJcbn0iLCJhbmd1bGFyLm1vZHVsZSgncGlwQXV4UGFuZWwnLCBbJ25nTWF0ZXJpYWwnXSk7XHJcblxyXG5pbXBvcnQgJy4vQXV4UGFuZWxTZXJ2aWNlJztcclxuaW1wb3J0ICcuL0F1eFBhbmVsUGFydCc7XHJcbmltcG9ydCAnLi9BdXhQYW5lbCc7XHJcblxyXG5leHBvcnQgKiBmcm9tICcuL0lBdXhQYW5lbFNlcnZpY2UnOyIsImFuZ3VsYXIubW9kdWxlKCdwaXBMYXlvdXQnLCBbJ3d1Lm1hc29ucnknLCAncGlwTWVkaWEnLCAncGlwQXV4UGFuZWwnXSk7XHJcblxyXG5pbXBvcnQgJy4vbWVkaWEvaW5kZXgnO1xyXG5cclxuaW1wb3J0ICcuL2xheW91dHMvTWFpbkRpcmVjdGl2ZSc7XHJcbmltcG9ydCAnLi9sYXlvdXRzL0NhcmREaXJlY3RpdmUnO1xyXG5pbXBvcnQgJy4vbGF5b3V0cy9EaWFsb2dEaXJlY3RpdmUnO1xyXG5pbXBvcnQgJy4vbGF5b3V0cy9Eb2N1bWVudERpcmVjdGl2ZSc7XHJcbmltcG9ydCAnLi9sYXlvdXRzL1NpbXBsZURpcmVjdGl2ZSc7XHJcbmltcG9ydCAnLi9sYXlvdXRzL1RpbGVzRGlyZWN0aXZlJztcclxuaW1wb3J0ICcuL2F1eHBhbmVsL2luZGV4JztcclxuXHJcbmV4cG9ydCAqIGZyb20gJy4vbWVkaWEvaW5kZXgnO1xyXG4iLCJpbXBvcnQgeyBNYWluUmVzaXplZEV2ZW50LCBMYXlvdXRSZXNpemVkRXZlbnQgfSBmcm9tICcuLi9tZWRpYS9JTWVkaWFTZXJ2aWNlJztcclxuaW1wb3J0IHsgTWFpbkJyZWFrcG9pbnRTdGF0dXNlcyB9IGZyb20gJy4uL21lZGlhL01lZGlhU2VydmljZSc7XHJcblxyXG4vLyBBdm9pZCBkZWZhdWx0IGV4cG9ydFxyXG4oKCkgPT4ge1xyXG5cclxuaW50ZXJmYWNlIElDYXJkRGlyZWN0aXZlQXR0cmlidXRlcyBleHRlbmRzIG5nLklBdHRyaWJ1dGVzIHtcclxuICAgIG1pbldpZHRoOiBzdHJpbmcgfCBudW1iZXI7XHJcbiAgICBtaW5IZWlnaHQ6IHN0cmluZyB8IG51bWJlcjtcclxuICAgIHdpZHRoOiBzdHJpbmcgfCBudW1iZXI7XHJcbiAgICBoZWlnaHQ6IHN0cmluZyB8IG51bWJlcjtcclxufVxyXG5cclxuY2xhc3MgQ2FyZERpcmVjdGl2ZUxpbmsge1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwcml2YXRlICRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlLCBcclxuICAgICAgICBwcml2YXRlICRlbGVtZW50OiBKUXVlcnksIFxyXG4gICAgICAgIHByaXZhdGUgJGF0dHJzOiBJQ2FyZERpcmVjdGl2ZUF0dHJpYnV0ZXNcclxuICAgICkge1xyXG4gICAgICAgXCJuZ0luamVjdFwiO1xyXG4gICAgICAgIC8vIEFkZCBjbGFzcyB0byB0aGUgZWxlbWVudFxyXG4gICAgICAgICRlbGVtZW50LmFkZENsYXNzKCdwaXAtY2FyZCcpO1xyXG5cclxuICAgICAgICBsZXQgbGlzdGVuZXIgPSAoKSA9PiB7IHRoaXMucmVzaXplKCk7IH1cclxuXHJcbiAgICAgICAgLy8gUmVzaXplIGV2ZXJ5IHRpbWUgd2luZG93IGlzIHJlc2l6ZWRcclxuICAgICAgICAkcm9vdFNjb3BlLiRvbihNYWluUmVzaXplZEV2ZW50LCBsaXN0ZW5lcik7XHJcblxyXG4gICAgICAgIC8vIFJlc2l6ZSByaWdodCBhd2F5IHRvIGF2b2lkIGZsaWNraW5nXHJcbiAgICAgICAgdGhpcy5yZXNpemUoKTtcclxuXHJcbiAgICAgICAgLy8gUmVzaXplIHRoZSBlbGVtZW50IHJpZ2h0IGF3YXlcclxuICAgICAgICBzZXRUaW1lb3V0KGxpc3RlbmVyLCAxMDApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVzaXplKCkge1xyXG4gICAgICAgIGNvbnN0XHJcbiAgICAgICAgICAgICRtYWluQm9keSA9ICQoJy5waXAtbWFpbi1ib2R5JyksXHJcbiAgICAgICAgICAgIGNhcmRDb250YWluZXIgPSAkKCcucGlwLWNhcmQtY29udGFpbmVyJyksXHJcbiAgICAgICAgICAgIHdpbmRvd1dpZHRoID0gJCgncGlwLW1haW4nKS53aWR0aCgpO1xyXG4gICAgICAgIGxldFxyXG4gICAgICAgICAgICBtYXhXaWR0aCA9ICRtYWluQm9keS53aWR0aCgpLFxyXG4gICAgICAgICAgICBtYXhIZWlnaHQgPSAkbWFpbkJvZHkuaGVpZ2h0KCksXHJcbiAgICAgICAgICAgIG1pbldpZHRoID0gdGhpcy4kYXR0cnMubWluV2lkdGggPyBNYXRoLmZsb29yKE51bWJlcih0aGlzLiRhdHRycy5taW5XaWR0aCkpIDogbnVsbCxcclxuICAgICAgICAgICAgbWluSGVpZ2h0ID0gdGhpcy4kYXR0cnMubWluSGVpZ2h0ID8gTWF0aC5mbG9vcihOdW1iZXIodGhpcy4kYXR0cnMubWluSGVpZ2h0KSkgOiBudWxsLFxyXG4gICAgICAgICAgICB3aWR0aCA9IHRoaXMuJGF0dHJzLndpZHRoID8gTWF0aC5mbG9vcihOdW1iZXIodGhpcy4kYXR0cnMud2lkdGgpKSA6IG51bGwsXHJcbiAgICAgICAgICAgIGhlaWdodCA9IHRoaXMuJGF0dHJzLmhlaWdodCA/IE1hdGguZmxvb3IoTnVtYmVyKHRoaXMuJGF0dHJzLmhlaWdodCkpIDogbnVsbCxcclxuICAgICAgICAgICAgbGVmdCwgdG9wO1xyXG5cclxuICAgICAgICAvLyBGdWxsLXNjcmVlbiBvbiBwaG9uZVxyXG4gICAgICAgIGlmIChNYWluQnJlYWtwb2ludFN0YXR1c2VzLnhzKSB7XHJcbiAgICAgICAgICAgIG1pbldpZHRoID0gbnVsbDtcclxuICAgICAgICAgICAgbWluSGVpZ2h0ID0gbnVsbDtcclxuICAgICAgICAgICAgd2lkdGggPSBudWxsO1xyXG4gICAgICAgICAgICBoZWlnaHQgPSBudWxsO1xyXG4gICAgICAgICAgICBtYXhXaWR0aCA9IG51bGw7XHJcbiAgICAgICAgICAgIG1heEhlaWdodCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIENhcmQgdmlldyB3aXRoIGFkanVzdGFibGUgbWFyZ2lucyBvbiB0YWJsZXQgYW5kIGRlc2t0b3BcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gU2V0IG1hcmdpbiBhbmQgbWF4aW11bSBkaW1lbnNpb25zXHJcbiAgICAgICAgICAgIGNvbnN0IHNwYWNlID0gTWFpbkJyZWFrcG9pbnRTdGF0dXNlc1snZ3QtbWQnXSA/IDI0IDogMTY7XHJcbiAgICAgICAgICAgIG1heFdpZHRoIC09IHNwYWNlICogMjtcclxuICAgICAgICAgICAgbWF4SGVpZ2h0IC09IHNwYWNlICogMjtcclxuXHJcbiAgICAgICAgICAgIC8vIFNldCBtaW5pbXVtIGRpbWVuc2lvbnNcclxuICAgICAgICAgICAgbWluV2lkdGggPSBtaW5XaWR0aCA/IE1hdGgubWluKG1pbldpZHRoLCBtYXhXaWR0aCkgOiBudWxsO1xyXG4gICAgICAgICAgICBtaW5IZWlnaHQgPSBtaW5IZWlnaHQgPyBNYXRoLm1pbihtaW5IZWlnaHQsIG1heEhlaWdodCkgOiBudWxsO1xyXG5cclxuICAgICAgICAgICAgLy8gU2V0IHJlZ3VsYXIgZGltZW5zaW9uc1xyXG4gICAgICAgICAgICB3aWR0aCA9IHdpZHRoID8gTWF0aC5taW4od2lkdGgsIG1heFdpZHRoKSA6IG51bGw7XHJcbiAgICAgICAgICAgIGhlaWdodCA9IGhlaWdodCA/IE1hdGgubWluKGhlaWdodCwgbWF4SGVpZ2h0KSA6IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBTZXQgZGltZW5zaW9uc1xyXG4gICAgICAgIHRoaXMuJGVsZW1lbnQuY3NzKCdtYXgtd2lkdGgnLCBtYXhXaWR0aCA/IG1heFdpZHRoICsgJ3B4JyA6ICcnKTtcclxuICAgICAgICB0aGlzLiRlbGVtZW50LmNzcygnbWluLXdpZHRoJywgbWluV2lkdGggPyBtaW5XaWR0aCArICdweCcgOiAnJyk7XHJcbiAgICAgICAgdGhpcy4kZWxlbWVudC5jc3MoJ3dpZHRoJywgd2lkdGggPyB3aWR0aCArICdweCcgOiAnJyk7XHJcbiAgICAgICAgdGhpcy4kZWxlbWVudC5jc3MoJ2hlaWdodCcsIGhlaWdodCA/IGhlaWdodCArICdweCcgOiAnJyk7XHJcblxyXG4gICAgICAgIGlmICghY2FyZENvbnRhaW5lci5oYXNDbGFzcygncGlwLW91dGVyLXNjcm9sbCcpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQuY3NzKCdtYXgtaGVpZ2h0JywgbWF4SGVpZ2h0ID8gbWF4SGVpZ2h0ICsgJ3B4JyA6ICcnKTtcclxuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5jc3MoJ21pbi1oZWlnaHQnLCBtaW5IZWlnaHQgPyBtaW5IZWlnaHQgKyAncHgnIDogJycpO1xyXG4gICAgICAgICAgICBjb25zdFxyXG4gICAgICAgICAgICAgICAgJGhlYWRlciA9IHRoaXMuJGVsZW1lbnQuZmluZCgnLnBpcC1oZWFkZXI6dmlzaWJsZScpLFxyXG4gICAgICAgICAgICAgICAgJGZvb3RlciA9IHRoaXMuJGVsZW1lbnQuZmluZCgnLnBpcC1mb290ZXI6dmlzaWJsZScpLFxyXG4gICAgICAgICAgICAgICAgJGJvZHkgPSB0aGlzLiRlbGVtZW50LmZpbmQoJy5waXAtYm9keScpO1xyXG4gICAgICAgICAgICBsZXQgbWF4Qm9keUhlaWdodCA9IG1heEhlaWdodCB8fCAkbWFpbkJvZHkuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoJGhlYWRlci5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAgbWF4Qm9keUhlaWdodCAtPSAkaGVhZGVyLm91dGVySGVpZ2h0KHRydWUpO1xyXG4gICAgICAgICAgICBpZiAoJGZvb3Rlci5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAgbWF4Qm9keUhlaWdodCAtPSAkZm9vdGVyLm91dGVySGVpZ2h0KHRydWUpO1xyXG5cclxuICAgICAgICAgICAgJGJvZHkuY3NzKCdtYXgtaGVpZ2h0JywgbWF4Qm9keUhlaWdodCArICdweCcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNhcmRDb250YWluZXIuYWRkQ2xhc3MoJ3BpcC1zY3JvbGwnKTtcclxuICAgICAgICAgICAgaWYgKE1haW5CcmVha3BvaW50U3RhdHVzZXMueHMpIHtcclxuICAgICAgICAgICAgICAgIGxlZnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgdG9wID0gMDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxlZnQgPSBjYXJkQ29udGFpbmVyLndpZHRoKCkgLyAyIC0gdGhpcy4kZWxlbWVudC53aWR0aCgpIC8gMiAtIDE2O1xyXG4gICAgICAgICAgICAgICAgdG9wID0gTWF0aC5tYXgoY2FyZENvbnRhaW5lci5oZWlnaHQoKSAvIDIgLSB0aGlzLiRlbGVtZW50LmhlaWdodCgpIC8gMiAtIDE2LCAwKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5jc3MoJ2xlZnQnLCBsZWZ0KTtcclxuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5jc3MoJ3RvcCcsIHRvcCk7XHJcblxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgdGhpcy4kZWxlbWVudC5jc3MoJ2Rpc3BsYXknLCAnZmxleCcpOyB9LCAxMDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gTm90aWZ5IGNoaWxkIGNvbnRyb2xzIHRoYXQgbGF5b3V0IHdhcyByZXNpemVkXHJcbiAgICAgICAgdGhpcy4kcm9vdFNjb3BlLiRlbWl0KCdwaXBMYXlvdXRSZXNpemVkJyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNhcmREaXJlY3RpdmUoJHJvb3RTY29wZTogbmcuSVJvb3RTY29wZVNlcnZpY2UpIHtcclxuICAgIFwibmdJbmplY3RcIjtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIGxpbms6ICgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMpID0+IHtcclxuICAgICAgICAgICAgbmV3IENhcmREaXJlY3RpdmVMaW5rKCRyb290U2NvcGUsICRlbGVtZW50LCAkYXR0cnMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ3BpcExheW91dCcpXHJcbiAgICAuZGlyZWN0aXZlKCdwaXBDYXJkJywgY2FyZERpcmVjdGl2ZSk7XHJcblxyXG59KSgpOyIsIi8vIEF2b2lkIGRlZmF1bHQgZXhwb3J0XHJcbigoKSA9PiB7XHJcblxyXG5mdW5jdGlvbiBkaWFsb2dEaXJlY3RpdmUoKTogbmcuSURpcmVjdGl2ZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIGxpbms6ICgkc2NvcGU6IG5nLklTY29wZSwgJGVsZW1lbnQ6IEpRdWVyeSwgJGF0dHJzOiBuZy5JQXR0cmlidXRlcykgPT4ge1xyXG4gICAgICAgICAgICAkZWxlbWVudC5hZGRDbGFzcygncGlwLWRpYWxvZycpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ3BpcExheW91dCcpXHJcbiAgICAuZGlyZWN0aXZlKCdwaXBEaWFsb2cnLCBkaWFsb2dEaXJlY3RpdmUpO1xyXG5cclxufSkoKTsiLCIvLyBBdm9pZCBkZWZhdWx0IGV4cG9ydFxyXG4oKCkgPT4ge1xyXG5cclxuZnVuY3Rpb24gZG9jdW1lbnREaXJlY3RpdmUoKTogbmcuSURpcmVjdGl2ZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIGxpbms6ICgkc2NvcGU6IG5nLklTY29wZSwgJGVsZW1lbnQ6IEpRdWVyeSwgJGF0dHJzOiBuZy5JQXR0cmlidXRlcykgPT4ge1xyXG4gICAgICAgICAgICAkZWxlbWVudC5hZGRDbGFzcygncGlwLWRvY3VtZW50Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgncGlwTGF5b3V0JylcclxuICAgIC5kaXJlY3RpdmUoJ3BpcERvY3VtZW50JywgZG9jdW1lbnREaXJlY3RpdmUpO1xyXG5cclxufSkoKTsiLCJpbXBvcnQgeyBhZGRSZXNpemVMaXN0ZW5lciwgcmVtb3ZlUmVzaXplTGlzdGVuZXIgfSBmcm9tICcuLi9tZWRpYS9SZXNpemVGdW5jdGlvbnMnO1xyXG5pbXBvcnQgeyBNYWluUmVzaXplZEV2ZW50IH0gZnJvbSAnLi4vbWVkaWEvSU1lZGlhU2VydmljZSc7IFxyXG5pbXBvcnQgeyBNYWluQnJlYWtwb2ludHMsIE1haW5CcmVha3BvaW50U3RhdHVzZXMgfSBmcm9tICcuLi9tZWRpYS9NZWRpYVNlcnZpY2UnOyBcclxuXHJcbi8vIEF2b2lkIGRlZmF1bHQgZXhwb3J0XHJcbigoKSA9PiB7XHJcblxyXG5pbnRlcmZhY2UgSU1haW5EaXJlY3RpdmVBdHRyaWJ1dGVzIGV4dGVuZHMgbmcuSUF0dHJpYnV0ZXMge1xyXG4gICAgcGlwQ29udGFpbmVyOiBzdHJpbmc7XHJcbn1cclxuXHJcbmNsYXNzIE1haW5EaXJlY3RpdmVDb250cm9sbGVyIGltcGxlbWVudHMgbmcuSUNvbnRyb2xsZXIge1xyXG4gICAgcHJpdmF0ZSBfY29udGFpbmVyOiBhbnk7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgJHNjb3BlOiBuZy5JU2NvcGUsIFxyXG4gICAgICAgIHByaXZhdGUgJGVsZW1lbnQ6IGFuZ3VsYXIuSVJvb3RFbGVtZW50U2VydmljZSwgXHJcbiAgICAgICAgcHJpdmF0ZSAkcm9vdFNjb3BlOiBuZy5JUm9vdFNjb3BlU2VydmljZSxcclxuICAgICAgICBwcml2YXRlICR0aW1lb3V0OiBuZy5JVGltZW91dFNlcnZpY2UsXHJcbiAgICAgICAgcHJpdmF0ZSAkYXR0cnM6IElNYWluRGlyZWN0aXZlQXR0cmlidXRlc1xyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5fY29udGFpbmVyID0gJGF0dHJzLnBpcENvbnRhaW5lciA/ICQoJGF0dHJzLnBpcENvbnRhaW5lcikgOiAkZWxlbWVudDtcclxuXHJcbiAgICAgICAgLy8gQWRkIENTUyBjbGFzc1xyXG4gICAgICAgICRlbGVtZW50LmFkZENsYXNzKCdwaXAtbWFpbicpO1xyXG5cclxuICAgICAgICAvLyBBZGQgcmVzaXplIGxpc3RlbmVyXHJcbiAgICAgICAgY29uc3QgbGlzdGVuZXIgPSAoKSA9PiB7IHRoaXMucmVzaXplKCk7IH07XHJcbiAgICAgICAgYWRkUmVzaXplTGlzdGVuZXIodGhpcy5fY29udGFpbmVyWzBdLCBsaXN0ZW5lcik7XHJcblxyXG4gICAgICAgIC8vIFVuYmluZCB3aGVuIHNjb3BlIGlzIHJlbW92ZWRcclxuICAgICAgICAkc2NvcGUuJG9uKCckZGVzdHJveScsICgpID0+IHtcclxuICAgICAgICAgICAgcmVtb3ZlUmVzaXplTGlzdGVuZXIodGhpcy5fY29udGFpbmVyWzBdLCBsaXN0ZW5lcik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIFBlcmZvcm0gaW5pdGlhbCBjYWxjdWxhdGlvbnNcclxuICAgICAgICB0aGlzLnVwZGF0ZUJyZWFrcG9pbnRTdGF0dXNlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlQnJlYWtwb2ludFN0YXR1c2VzKCkge1xyXG4gICAgICAgIGNvbnN0IHdpZHRoID0gdGhpcy5fY29udGFpbmVyLmlubmVyV2lkdGgoKTtcclxuICAgICAgICBjb25zdCBib2R5ID0gJCgnYm9keScpO1xyXG5cclxuICAgICAgICBNYWluQnJlYWtwb2ludFN0YXR1c2VzLnVwZGF0ZShNYWluQnJlYWtwb2ludHMsIHdpZHRoKTtcclxuXHJcbiAgICAgICAgJC5lYWNoKE1haW5CcmVha3BvaW50U3RhdHVzZXMsIChicmVha3BvaW50LCBzdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgaWYgKF8uaXNCb29sZWFuKHN0YXR1cykpIHtcclxuICAgICAgICAgICAgICAgIGJvZHlbc3RhdHVzID8gJ2FkZENsYXNzJzogJ3JlbW92ZUNsYXNzJ10oJ3BpcC0nICsgYnJlYWtwb2ludCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy4kdGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuJHJvb3RTY29wZS4kYXBwbHkoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSByZXNpemUoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVCcmVha3BvaW50U3RhdHVzZXMoKTtcclxuICAgICAgICB0aGlzLiRyb290U2NvcGUuJGVtaXQoTWFpblJlc2l6ZWRFdmVudCwgTWFpbkJyZWFrcG9pbnRTdGF0dXNlcyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIE1haW5Cb2R5RGlyZWN0aXZlTGluayB7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoXHJcbiAgICAgICAgJHNjb3BlOiBuZy5JU2NvcGUsIFxyXG4gICAgICAgICRlbGVtZW50OiBhbmd1bGFyLklSb290RWxlbWVudFNlcnZpY2VcclxuICAgICkge1xyXG4gICAgICAgIC8vIEFkZCBDU1MgY2xhc3NcclxuICAgICAgICAkZWxlbWVudC5hZGRDbGFzcygncGlwLW1haW4tYm9keScpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBtYWluRGlyZWN0aXZlKCk6IG5nLklEaXJlY3RpdmUge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICBjb250cm9sbGVyOiBNYWluRGlyZWN0aXZlQ29udHJvbGxlcixcclxuICAgICAgICBjb250cm9sbGVyQXM6ICd2bScgXHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1haW5Cb2R5RGlyZWN0aXZlKCk6IG5nLklEaXJlY3RpdmUge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICBsaW5rOiBNYWluQm9keURpcmVjdGl2ZUxpbmtcclxuICAgIH1cclxufVxyXG5cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgncGlwTGF5b3V0JylcclxuICAgIC5kaXJlY3RpdmUoJ3BpcE1haW4nLCBtYWluRGlyZWN0aXZlKVxyXG4gICAgLmRpcmVjdGl2ZSgncGlwTWFpbkJvZHknLCBtYWluQm9keURpcmVjdGl2ZSk7XHJcblxyXG59KSgpOyIsIigoKSA9PiB7XHJcblxyXG5mdW5jdGlvbiBzaW1wbGVEaXJlY3RpdmUoKTogbmcuSURpcmVjdGl2ZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgIGxpbms6ICgkc2NvcGU6IG5nLklTY29wZSwgJGVsZW1lbnQ6IEpRdWVyeSwgJGF0dHJzOiBuZy5JQXR0cmlidXRlcykgPT4ge1xyXG4gICAgICAgICAgICAkZWxlbWVudC5hZGRDbGFzcygncGlwLXNpbXBsZScpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ3BpcExheW91dCcpXHJcbiAgICAuZGlyZWN0aXZlKCdwaXBTaW1wbGUnLCBzaW1wbGVEaXJlY3RpdmUpO1xyXG5cclxufSkoKTsiLCJpbXBvcnQgeyBhZGRSZXNpemVMaXN0ZW5lciwgcmVtb3ZlUmVzaXplTGlzdGVuZXIgfSBmcm9tICcuLi9tZWRpYS9SZXNpemVGdW5jdGlvbnMnO1xyXG5pbXBvcnQgeyBNYWluUmVzaXplZEV2ZW50LCBMYXlvdXRSZXNpemVkRXZlbnQgfSBmcm9tICcuLi9tZWRpYS9JTWVkaWFTZXJ2aWNlJztcclxuaW1wb3J0IHsgTWFpbkJyZWFrcG9pbnRzLCBNYWluQnJlYWtwb2ludFN0YXR1c2VzIH0gZnJvbSAnLi4vbWVkaWEvTWVkaWFTZXJ2aWNlJztcclxuXHJcbmRlY2xhcmUgdmFyIE1hc29ucnk6IGFueTtcclxuXHJcbmludGVyZmFjZSBJVGlsZXNEaXJlY3RpdmVBdHRyaWJ1dGVzIGV4dGVuZHMgbmcuSUF0dHJpYnV0ZXMge1xyXG4gICAgY29sdW1uV2lkdGg6IHN0cmluZyB8IG51bWJlcjtcclxuICAgIHBpcEluZmluaXRlOiBzdHJpbmcgfCBib29sZWFuIHwgbnVtYmVyO1xyXG59XHJcblxyXG5jbGFzcyBUaWxlc09wdGlvbnMge1xyXG4gICAgZ3V0dGVyOiBudW1iZXI7XHJcbiAgICBpc0ZpdFdpZHRoOiBib29sZWFuO1xyXG4gICAgaXNSZXNpemVCb3VuZDogYm9vbGVhbjtcclxuICAgIHRyYW5zaXRpb25EdXJhdGlvbjogbnVtYmVyO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgSVRpbGVzQ29udHJvbGxlclNjb3BlIGV4dGVuZHMgbmcuSVNjb3BlIHtcclxuICAgIHRpbGVzT3B0aW9uczogVGlsZXNPcHRpb25zO1xyXG59XHJcblxyXG5jbGFzcyBUaWxlc0RpcmVjdGl2ZUxpbmsge1xyXG4gICAgcHJpdmF0ZSBfY29sdW1uV2lkdGg6IG51bWJlcjtcclxuICAgIHByaXZhdGUgX2NvbnRhaW5lcjogYW55O1xyXG4gICAgcHJpdmF0ZSBfcHJldkNvbnRhaW5lcldpZHRoOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9tYXNvbnJ5OiBhbnk7XHJcbiAgICBwcml2YXRlIF9zaXplcjogYW55O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgICAgICAkc2NvcGU6IG5nLklTY29wZSwgXHJcbiAgICAgICAgcHJpdmF0ZSAkZWxlbWVudDogSlF1ZXJ5LCBcclxuICAgICAgICBwcml2YXRlICRhdHRyczogSVRpbGVzRGlyZWN0aXZlQXR0cmlidXRlcyxcclxuICAgICAgICBwcml2YXRlICRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLl9jb2x1bW5XaWR0aCA9ICRhdHRycy5jb2x1bW5XaWR0aCA/IE1hdGguZmxvb3IoTnVtYmVyKCRhdHRycy5jb2x1bW5XaWR0aCkpIDogNDQwLFxyXG4gICAgICAgIHRoaXMuX2NvbnRhaW5lciA9ICRlbGVtZW50LmNoaWxkcmVuKCcucGlwLXRpbGVzLWNvbnRhaW5lcicpLFxyXG4gICAgICAgIHRoaXMuX3ByZXZDb250YWluZXJXaWR0aCA9IG51bGwsXHJcbiAgICAgICAgdGhpcy5fbWFzb25yeSA9IE1hc29ucnkuZGF0YSh0aGlzLl9jb250YWluZXJbMF0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEFkZCBjbGFzcyB0byB0aGUgZWxlbWVudFxyXG4gICAgICAgICRlbGVtZW50LmFkZENsYXNzKCdwaXAtdGlsZXMnKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIHJlc2l6ZSBsaXN0ZW5lclxyXG4gICAgICAgIGNvbnN0IGxpc3RlbmVyID0gKCkgPT4geyB0aGlzLnJlc2l6ZShmYWxzZSk7IH07XHJcbiAgICAgICAgYWRkUmVzaXplTGlzdGVuZXIoJGVsZW1lbnRbMF0sIGxpc3RlbmVyKTtcclxuXHJcbiAgICAgICAgLy8gVW5iaW5kIHdoZW4gc2NvcGUgaXMgcmVtb3ZlZFxyXG4gICAgICAgICRzY29wZS4kb24oJyRkZXN0cm95JywgKCkgPT4ge1xyXG4gICAgICAgICAgICByZW1vdmVSZXNpemVMaXN0ZW5lcigkZWxlbWVudFswXSwgbGlzdGVuZXIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBJbnNlcnQgc2l6ZXJcclxuICAgICAgICB0aGlzLl9zaXplciA9ICQoJzxkaXYgY2xhc3M9XCJwaXAtdGlsZS1zaXplclwiPjwvZGl2PicpO1xyXG4gICAgICAgIHRoaXMuX3NpemVyLmFwcGVuZFRvKHRoaXMuX2NvbnRhaW5lcik7XHJcblxyXG4gICAgICAgIC8vIFJlc2l6ZSBldmVyeSB0aW1lIHdpbmRvdyBpcyByZXNpemVkXHJcbiAgICAgICAgJHJvb3RTY29wZS4kb24oTWFpblJlc2l6ZWRFdmVudCwgKCkgPT4geyB0aGlzLnJlc2l6ZShmYWxzZSk7IH0pO1xyXG5cclxuICAgICAgICAvLyBSZXNpemUgdGhlIGVsZW1lbnQgcmlnaHQgYXdheVxyXG4gICAgICAgIHRoaXMucmVzaXplKHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVzaXplKGZvcmNlOiBib29sZWFuKSB7XHJcbiAgICAgICAgbGV0IHdpZHRoID0gdGhpcy4kZWxlbWVudC5wYXJlbnQoKS53aWR0aCgpLFxyXG4gICAgICAgICAgICBjb250YWluZXJXaWR0aDtcclxuXHJcbiAgICAgICAgaWYgKE1haW5CcmVha3BvaW50U3RhdHVzZXNbJ2d0LXhzJ10gJiYgKHdpZHRoIC0gMzYpID4gdGhpcy5fY29sdW1uV2lkdGgpIHtcclxuICAgICAgICAgICAgd2lkdGggPSB3aWR0aCAtIDI0ICogMjtcclxuXHJcbiAgICAgICAgICAgIGxldCBjb2x1bW5zID0gTWF0aC5mbG9vcih3aWR0aCAvIHRoaXMuX2NvbHVtbldpZHRoKTtcclxuICAgICAgICAgICAgY29udGFpbmVyV2lkdGggPSAodGhpcy5fY29sdW1uV2lkdGggKyAxNikgKiBjb2x1bW5zIC0gMTY7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29udGFpbmVyV2lkdGggPiB3aWR0aCkge1xyXG4gICAgICAgICAgICAgICAgY29sdW1ucy0tO1xyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyV2lkdGggPSAodGhpcy5fY29sdW1uV2lkdGggKyAxNikgKiBjb2x1bW5zIC0gMTY7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChjb2x1bW5zIDwgMSkge1xyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyV2lkdGggPSB3aWR0aDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NpemVyLmNzcygnd2lkdGgnLCBjb250YWluZXJXaWR0aCArICdweCcpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2l6ZXIuY3NzKCd3aWR0aCcsIHRoaXMuX2NvbHVtbldpZHRoICsgJ3B4Jyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vICsxMCB0byBhdm9pZCBwcmVjaXNpb24gcmVsYXRlZCBlcnJvclxyXG4gICAgICAgICAgICB0aGlzLl9jb250YWluZXIuY3NzKCd3aWR0aCcsIChjb250YWluZXJXaWR0aCArIDEwKSArICdweCcpO1xyXG4gICAgICAgICAgICB0aGlzLl9jb250YWluZXIucmVtb3ZlQ2xhc3MoJ3BpcC1tb2JpbGUnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB3aWR0aCA9IHdpZHRoIC0gMTYgKiAyO1xyXG4gICAgICAgICAgICBjb250YWluZXJXaWR0aCA9IHdpZHRoO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fc2l6ZXIuY3NzKCd3aWR0aCcsIGNvbnRhaW5lcldpZHRoICsgJ3B4Jyk7XHJcbiAgICAgICAgICAgIC8vICsxMCB0byBhdm9pZCBwcmVjaXNpb24gcmVsYXRlZCBlcnJvclxyXG4gICAgICAgICAgICB0aGlzLl9jb250YWluZXIuY3NzKCd3aWR0aCcsIChjb250YWluZXJXaWR0aCArIDEwKSArICdweCcpO1xyXG4gICAgICAgICAgICB0aGlzLl9jb250YWluZXIuYWRkQ2xhc3MoJ3BpcC1tb2JpbGUnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIE1hbnVhbGx5IGNhbGwgbGF5b3V0IG9uIHRpbGUgY29udGFpbmVyXHJcbiAgICAgICAgaWYgKHRoaXMuX3ByZXZDb250YWluZXJXaWR0aCAhPSBjb250YWluZXJXaWR0aCB8fCBmb3JjZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9wcmV2Q29udGFpbmVyV2lkdGggPSBjb250YWluZXJXaWR0aDtcclxuICAgICAgICAgICAgdGhpcy5fbWFzb25yeS5sYXlvdXQoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIE5vdGlmeSBjaGlsZCBjb250cm9scyB0aGF0IGxheW91dCB3YXMgcmVzaXplZFxyXG4gICAgICAgICAgICB0aGlzLiRyb290U2NvcGUuJGVtaXQoTGF5b3V0UmVzaXplZEV2ZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRpbGVzRGlyZWN0aXZlKCRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlKTogbmcuSURpcmVjdGl2ZSB7XHJcbiAgICBcIm5nSW5qZWN0XCI7XHJcblxyXG4gICAgLy8gQ29udmVydHMgdmFsdWUgaW50byBib29sZWFuXHJcbiAgICBmdW5jdGlvbiBjb252ZXJ0VG9Cb29sZWFuKHZhbHVlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHZhbHVlID09IG51bGwpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlID09ICcxJyB8fCB2YWx1ZSA9PSAndHJ1ZSc7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICBzY29wZTogZmFsc2UsXHJcbiAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcclxuICAgICAgICB0ZW1wbGF0ZTpcclxuICAgICAgICAgICAgKCRlbGVtZW50OiBKUXVlcnksICRhdHRyczogSVRpbGVzRGlyZWN0aXZlQXR0cmlidXRlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvbnZlcnRUb0Jvb2xlYW4oJGF0dHJzLnBpcEluZmluaXRlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTdHJpbmcoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICArICc8ZGl2IG1hc29ucnkgY2xhc3M9XCJwaXAtdGlsZXMtY29udGFpbmVyXCIgbG9hZC1pbWFnZXM9XCJmYWxzZVwiIHByZXNlcnZlLW9yZGVyICAnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsgJyBuZy10cmFuc2NsdWRlIGNvbHVtbi13aWR0aD1cIi5waXAtdGlsZS1zaXplclwiIGl0ZW0tc2VsZWN0b3I9XCIucGlwLXRpbGVcIidcclxuICAgICAgICAgICAgICAgICAgICAgICAgKyAnIG1hc29ucnktb3B0aW9ucz1cInRpbGVzT3B0aW9uc1wiICBwaXAtc2Nyb2xsLWNvbnRhaW5lcj1cIlxcJy5waXAtdGlsZXNcXCdcIidcclxuICAgICAgICAgICAgICAgICAgICAgICAgKyAnIHBpcC1pbmZpbml0ZS1zY3JvbGw9XCJyZWFkU2Nyb2xsKClcIiA+J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICArICc8L2Rpdj4nO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gU3RyaW5nKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgKyAnPGRpdiBtYXNvbnJ5IGNsYXNzPVwicGlwLXRpbGVzLWNvbnRhaW5lclwiIGxvYWQtaW1hZ2VzPVwiZmFsc2VcIiBwcmVzZXJ2ZS1vcmRlciAgJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICArICcgbmctdHJhbnNjbHVkZSBjb2x1bW4td2lkdGg9XCIucGlwLXRpbGUtc2l6ZXJcIiBpdGVtLXNlbGVjdG9yPVwiLnBpcC10aWxlXCInXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsgJyBtYXNvbnJ5LW9wdGlvbnM9XCJ0aWxlc09wdGlvbnNcIj4nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsgJzwvZGl2Pic7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgY29udHJvbGxlcjogKCRzY29wZTogSVRpbGVzQ29udHJvbGxlclNjb3BlKSA9PiB7XHJcbiAgICAgICAgICAgICRzY29wZS50aWxlc09wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICBndXR0ZXI6IDgsLy8xNlxyXG4gICAgICAgICAgICAgICAgaXNGaXRXaWR0aDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBpc1Jlc2l6ZUJvdW5kOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb25EdXJhdGlvbjogMCAvLyAnMC4ycydcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxpbms6ICgkc2NvcGU6IG5nLklTY29wZSwgJGVsZW1lbnQ6IEpRdWVyeSwgJGF0dHJzOiBJVGlsZXNEaXJlY3RpdmVBdHRyaWJ1dGVzKSA9PiB7XHJcbiAgICAgICAgICAgIG5ldyBUaWxlc0RpcmVjdGl2ZUxpbmsoJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkcm9vdFNjb3BlKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdwaXBMYXlvdXQnKVxyXG4gICAgLmRpcmVjdGl2ZSgncGlwVGlsZXMnLCB0aWxlc0RpcmVjdGl2ZSk7XHJcbiIsImV4cG9ydCBjb25zdCBNYWluUmVzaXplZEV2ZW50ID0gJ3BpcE1haW5SZXNpemVkJztcclxuZXhwb3J0IGNvbnN0IExheW91dFJlc2l6ZWRFdmVudCA9ICdwaXBMYXlvdXRSZXNpemVkJztcclxuXHJcbmV4cG9ydCBjbGFzcyBNZWRpYUJyZWFrcG9pbnRzIHtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgICAgICB4czogbnVtYmVyLCBzbTogbnVtYmVyLCBtZDogbnVtYmVyLCBsZzogbnVtYmVyXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLnhzID0geHM7XHJcbiAgICAgICAgdGhpcy5zbSA9IHNtO1xyXG4gICAgICAgIHRoaXMubWQgPSBtZDtcclxuICAgICAgICB0aGlzLmxnID0gbGc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHhzOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgc206IG51bWJlcjtcclxuICAgIHB1YmxpYyBtZDogbnVtYmVyO1xyXG4gICAgcHVibGljIGxnOiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBNZWRpYUJyZWFrcG9pbnRTdGF0dXNlcyB7XHJcbiAgICBwdWJsaWMgd2lkdGg6IG51bWJlcjtcclxuICAgIHB1YmxpYyAneHMnOiBib29sZWFuO1xyXG4gICAgcHVibGljICdndC14cyc6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgJ3NtJzogYm9vbGVhbjtcclxuICAgIHB1YmxpYyAnZ3Qtc20nOiBib29sZWFuO1xyXG4gICAgcHVibGljICdtZCc6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgJ2d0LW1kJzogYm9vbGVhbjtcclxuICAgIHB1YmxpYyAnbGcnOiBib29sZWFuO1xyXG4gICAgcHVibGljICdndC1sZyc6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgJ3hsJzogYm9vbGVhbjtcclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKGJyZWFrcG9pbnRzOiBNZWRpYUJyZWFrcG9pbnRzLCB3aWR0aDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKGJyZWFrcG9pbnRzID09IG51bGwgfHwgd2lkdGggPT0gbnVsbCkgcmV0dXJuO1xyXG5cclxuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpc1sneHMnXSA9IHdpZHRoIDw9IGJyZWFrcG9pbnRzLnhzO1xyXG4gICAgICAgIHRoaXNbJ2d0LXhzJ10gPSB3aWR0aCA+IGJyZWFrcG9pbnRzLnhzO1xyXG4gICAgICAgIHRoaXNbJ3NtJ10gPSB3aWR0aCA+IGJyZWFrcG9pbnRzLnhzICYmIHdpZHRoIDw9IGJyZWFrcG9pbnRzLnNtO1xyXG4gICAgICAgIHRoaXNbJ2d0LXNtJ10gPSB3aWR0aCA+IGJyZWFrcG9pbnRzLnNtO1xyXG4gICAgICAgIHRoaXNbJ21kJ10gPSB3aWR0aCA+IGJyZWFrcG9pbnRzLnNtICYmIHdpZHRoIDw9IGJyZWFrcG9pbnRzLm1kO1xyXG4gICAgICAgIHRoaXNbJ2d0LW1kJ10gPSB3aWR0aCA+IGJyZWFrcG9pbnRzLm1kO1xyXG4gICAgICAgIHRoaXNbJ2xnJ10gPSB3aWR0aCA+IGJyZWFrcG9pbnRzLm1kICYmIHdpZHRoIDw9IGJyZWFrcG9pbnRzLmxnO1xyXG4gICAgICAgIHRoaXNbJ2d0LWxnJ10gPSB3aWR0aCA+IGJyZWFrcG9pbnRzLmxnO1xyXG4gICAgICAgIHRoaXNbJ3hsJ10gPSB0aGlzWydndC1sZyddO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElNZWRpYVNlcnZpY2Uge1xyXG4gICAgKGJyZWFrcG9pbnQ6IHN0cmluZyk6IGJvb2xlYW47XHJcbiAgICBicmVha3BvaW50czogTWVkaWFCcmVha3BvaW50cztcclxuICAgIHdpZHRoOiBudW1iZXI7XHJcbn0gXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElNZWRpYVByb3ZpZGVyIGV4dGVuZHMgbmcuSVNlcnZpY2VQcm92aWRlciB7XHJcbiAgICBicmVha3BvaW50czogTWVkaWFCcmVha3BvaW50cztcclxufSIsImltcG9ydCB7IE1lZGlhQnJlYWtwb2ludHMsIE1lZGlhQnJlYWtwb2ludFN0YXR1c2VzIH0gZnJvbSAnLi9JTWVkaWFTZXJ2aWNlJztcclxuaW1wb3J0IHsgSU1lZGlhUHJvdmlkZXIgfSBmcm9tICcuL0lNZWRpYVNlcnZpY2UnO1xyXG5cclxuZXhwb3J0IGxldCBNYWluQnJlYWtwb2ludHM6IE1lZGlhQnJlYWtwb2ludHMgPSBuZXcgTWVkaWFCcmVha3BvaW50cyg2MzksIDcxNiwgMTAyNCwgMTQzOSk7XHJcbmV4cG9ydCBsZXQgTWFpbkJyZWFrcG9pbnRTdGF0dXNlczogTWVkaWFCcmVha3BvaW50U3RhdHVzZXMgPSBuZXcgTWVkaWFCcmVha3BvaW50U3RhdHVzZXMoKTtcclxuXHJcbmNsYXNzIE1lZGlhUHJvdmlkZXIgaW1wbGVtZW50cyBJTWVkaWFQcm92aWRlciB7XHJcbiAgICBwdWJsaWMgZ2V0IGJyZWFrcG9pbnRzKCk6IE1lZGlhQnJlYWtwb2ludHMge1xyXG4gICAgICAgIHJldHVybiBNYWluQnJlYWtwb2ludHM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBicmVha3BvaW50cyh2YWx1ZTogTWVkaWFCcmVha3BvaW50cykge1xyXG4gICAgICAgIE1haW5CcmVha3BvaW50cyA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyAkZ2V0KCkge1xyXG4gICAgICAgIGNvbnN0IHNlcnZpY2UgPSAoc2l6ZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gTWFpbkJyZWFrcG9pbnRTdGF0dXNlc1tzaXplXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzZXJ2aWNlLCAnYnJlYWtwb2ludHMnLCB7XHJcbiAgICAgICAgICAgIGdldDogKCkgPT4geyByZXR1cm4gTWFpbkJyZWFrcG9pbnRzOyB9LFxyXG4gICAgICAgICAgICBzZXQ6ICh2YWx1ZSkgPT4geyBcclxuICAgICAgICAgICAgICAgIE1haW5CcmVha3BvaW50cyA9IHZhbHVlIHx8IG5ldyBNZWRpYUJyZWFrcG9pbnRzKDYzOSwgNzE2LCAxMDI0LCAxNDM5KTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgTWFpbkJyZWFrcG9pbnRTdGF0dXNlcy51cGRhdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgTWFpbkJyZWFrcG9pbnRzLCBcclxuICAgICAgICAgICAgICAgICAgICBNYWluQnJlYWtwb2ludFN0YXR1c2VzLndpZHRoXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzZXJ2aWNlLCAnd2lkdGgnLCB7XHJcbiAgICAgICAgICAgIGdldDogKCkgPT4geyBcclxuICAgICAgICAgICAgICAgIHJldHVybiBNYWluQnJlYWtwb2ludFN0YXR1c2VzLndpZHRoOyBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gc2VydmljZTsgXHJcbiAgICB9XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ3BpcE1lZGlhJylcclxuICAgIC5wcm92aWRlcigncGlwTWVkaWEnLCBNZWRpYVByb3ZpZGVyKTtcclxuIiwibGV0IGF0dGFjaEV2ZW50ID0gKDxhbnk+ZG9jdW1lbnQpLmF0dGFjaEV2ZW50O1xyXG5sZXQgaXNJRSA9IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1RyaWRlbnQvKTtcclxuXHJcbmZ1bmN0aW9uIHJlcXVlc3RGcmFtZShjYWxsYmFjayk6IGFueSB7XHJcbiAgICBsZXQgZnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lXHJcbiAgICAgICAgfHwgKDxhbnk+d2luZG93KS5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcclxuICAgICAgICB8fCAoPGFueT53aW5kb3cpLndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZVxyXG4gICAgICAgIHx8IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICByZXR1cm4gd2luZG93LnNldFRpbWVvdXQoY2FsbGJhY2ssIDIwKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIHJldHVybiBmcmFtZShjYWxsYmFjayk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNhbmNlbEZyYW1lKCk6IGFueSB7XHJcbiAgICBsZXQgY2FuY2VsID0gd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lXHJcbiAgICAgICAgfHwgKDxhbnk+d2luZG93KS5tb3pDYW5jZWxBbmltYXRpb25GcmFtZVxyXG4gICAgICAgIHx8ICg8YW55PndpbmRvdykud2Via2l0Q2FuY2VsQW5pbWF0aW9uRnJhbWVcclxuICAgICAgICB8fCB3aW5kb3cuY2xlYXJUaW1lb3V0O1xyXG5cclxuICAgIHJldHVybiBmdW5jdGlvbiAoaWQpIHtcclxuICAgICAgICByZXR1cm4gY2FuY2VsKGlkKTtcclxuICAgIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlc2l6ZUxpc3RlbmVyKGV2ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgIGNvbnN0IHdpbiA9IGV2ZW50LnRhcmdldCB8fCBldmVudC5zcmNFbGVtZW50O1xyXG4gICAgaWYgKHdpbi5fX3Jlc2l6ZVJBRl9fKSBjYW5jZWxGcmFtZSgvKndpbi5fX3Jlc2l6ZVJBRl9fKi8pO1xyXG4gICAgd2luLl9fcmVzaXplUkFGX18gPSByZXF1ZXN0RnJhbWUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNvbnN0IHRyaWdnZXIgPSB3aW4uX19yZXNpemVUcmlnZ2VyX187XHJcbiAgICAgICAgdHJpZ2dlci5fX3Jlc2l6ZUxpc3RlbmVyc19fLmZvckVhY2goZnVuY3Rpb24gKGZuKSB7XHJcbiAgICAgICAgICAgIGZuLmNhbGwodHJpZ2dlciwgZXZlbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRMaXN0ZW5lcihldmVudDogYW55KTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5jb250ZW50RG9jdW1lbnQpIHtcclxuICAgICAgICB0aGlzLmNvbnRlbnREb2N1bWVudC5kZWZhdWx0Vmlldy5fX3Jlc2l6ZVRyaWdnZXJfXyA9IHRoaXMuX19yZXNpemVFbGVtZW50X187XHJcbiAgICAgICAgdGhpcy5jb250ZW50RG9jdW1lbnQuZGVmYXVsdFZpZXcuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzaXplTGlzdGVuZXIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWRkUmVzaXplTGlzdGVuZXIoZWxlbWVudCwgbGlzdGVuZXIpOiB2b2lkIHtcclxuICAgIGlmICghZWxlbWVudC5fX3Jlc2l6ZUxpc3RlbmVyc19fKSB7XHJcbiAgICAgICAgZWxlbWVudC5fX3Jlc2l6ZUxpc3RlbmVyc19fID0gW107XHJcbiAgICAgICAgaWYgKGF0dGFjaEV2ZW50KSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuX19yZXNpemVUcmlnZ2VyX18gPSBlbGVtZW50O1xyXG4gICAgICAgICAgICBlbGVtZW50LmF0dGFjaEV2ZW50KCdvbnJlc2l6ZScsIHJlc2l6ZUxpc3RlbmVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLnBvc2l0aW9uID09ICdzdGF0aWMnKSBlbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcclxuICAgICAgICAgICAgY29uc3Qgb2JqOiBhbnkgPSBlbGVtZW50Ll9fcmVzaXplVHJpZ2dlcl9fID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb2JqZWN0Jyk7XHJcbiAgICAgICAgICAgIG9iai5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2Rpc3BsYXk6IGJsb2NrOyBwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDogMDsgbGVmdDogMDsgaGVpZ2h0OiAxMDAlOyB3aWR0aDogMTAwJTsgb3ZlcmZsb3c6IGhpZGRlbjsgcG9pbnRlci1ldmVudHM6IG5vbmU7IHotaW5kZXg6IC0xOycpO1xyXG4gICAgICAgICAgICBvYmouX19yZXNpemVFbGVtZW50X18gPSBlbGVtZW50O1xyXG4gICAgICAgICAgICBvYmoub25sb2FkID0gbG9hZExpc3RlbmVyO1xyXG4gICAgICAgICAgICBvYmoudHlwZSA9ICd0ZXh0L2h0bWwnO1xyXG4gICAgICAgICAgICBpZiAoaXNJRSkgZWxlbWVudC5hcHBlbmRDaGlsZChvYmopO1xyXG4gICAgICAgICAgICBvYmouZGF0YSA9ICdhYm91dDpibGFuayc7XHJcbiAgICAgICAgICAgIGlmICghaXNJRSkgZWxlbWVudC5hcHBlbmRDaGlsZChvYmopO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBlbGVtZW50Ll9fcmVzaXplTGlzdGVuZXJzX18ucHVzaChsaXN0ZW5lcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVSZXNpemVMaXN0ZW5lcihlbGVtZW50LCBsaXN0ZW5lcik6IHZvaWQge1xyXG4gICAgaWYgKGxpc3RlbmVyKSBlbGVtZW50Ll9fcmVzaXplTGlzdGVuZXJzX18uc3BsaWNlKGVsZW1lbnQuX19yZXNpemVMaXN0ZW5lcnNfXy5pbmRleE9mKGxpc3RlbmVyKSwgMSk7XHJcbiAgICBpZiAoIWVsZW1lbnQuX19yZXNpemVMaXN0ZW5lcnNfXy5sZW5ndGgpIHtcclxuICAgICAgICBpZiAoYXR0YWNoRXZlbnQpIGVsZW1lbnQuZGV0YWNoRXZlbnQoJ29ucmVzaXplJywgcmVzaXplTGlzdGVuZXIpO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5fX3Jlc2l6ZVRyaWdnZXJfXy5jb250ZW50RG9jdW1lbnQpIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuX19yZXNpemVUcmlnZ2VyX18uY29udGVudERvY3VtZW50LmRlZmF1bHRWaWV3LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZUxpc3RlbmVyKTtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuX19yZXNpemVUcmlnZ2VyX18gPSAhZWxlbWVudC5yZW1vdmVDaGlsZChlbGVtZW50Ll9fcmVzaXplVHJpZ2dlcl9fKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJhbmd1bGFyLm1vZHVsZSgncGlwTWVkaWEnLCBbXSk7XHJcblxyXG5pbXBvcnQgJy4vTWVkaWFTZXJ2aWNlJztcclxuaW1wb3J0ICcuL1Jlc2l6ZUZ1bmN0aW9ucyc7XHJcblxyXG5leHBvcnQgKiBmcm9tICcuL0lNZWRpYVNlcnZpY2UnO1xyXG5leHBvcnQgKiBmcm9tICcuL01lZGlhU2VydmljZSc7XHJcbmV4cG9ydCAqIGZyb20gJy4vUmVzaXplRnVuY3Rpb25zJzsiXX0=