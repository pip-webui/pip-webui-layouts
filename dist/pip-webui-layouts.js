(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).layouts = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MediaService_1 = require("../media/MediaService");
{
    var AuxPanelDirectiveController = (function () {
        AuxPanelDirectiveController.$inject = ['pipAuxPanel'];
        function AuxPanelDirectiveController(pipAuxPanel) {
            "ngInject";
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
Object.defineProperty(exports, "__esModule", { value: true });
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
    "ngInject";
    $rootScope.$on(IAuxPanelService_1.OpenAuxPanelEvent, function () { pipAuxPanel.open(); });
    $rootScope.$on(IAuxPanelService_1.CloseAuxPanelEvent, function () { pipAuxPanel.close(); });
}
angular
    .module('pipAuxPanel')
    .provider('pipAuxPanel', AuxPanelProvider)
    .run(hookAuxPanelEvents);
},{"./IAuxPanelService":4}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
Object.defineProperty(exports, "__esModule", { value: true });
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
Object.defineProperty(exports, "__esModule", { value: true });
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
Object.defineProperty(exports, "__esModule", { value: true });
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
Object.defineProperty(exports, "__esModule", { value: true });
var ResizeFunctions_1 = require("../media/ResizeFunctions");
var IMediaService_1 = require("../media/IMediaService");
var MediaService_1 = require("../media/MediaService");
(function () {
    var MainDirectiveController = (function () {
        MainDirectiveController.$inject = ['$scope', '$element', '$rootScope', '$timeout', '$attrs'];
        function MainDirectiveController($scope, $element, $rootScope, $timeout, $attrs) {
            "ngInject";
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
        MainBodyDirectiveLink.$inject = ['$scope', '$element'];
        function MainBodyDirectiveLink($scope, $element) {
            "ngInject";
            $element.addClass('pip-main-body');
        }
        return MainBodyDirectiveLink;
    }());
    function mainDirective() {
        "ngInject";
        return {
            restrict: 'EA',
            controller: MainDirectiveController,
            controllerAs: 'vm'
        };
    }
    function mainBodyDirective() {
        "ngInject";
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
        "ngInject";
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
Object.defineProperty(exports, "__esModule", { value: true });
var ResizeFunctions_1 = require("../media/ResizeFunctions");
var IMediaService_1 = require("../media/IMediaService");
var MediaService_1 = require("../media/MediaService");
var TilesOptions = (function () {
    function TilesOptions() {
    }
    return TilesOptions;
}());
var TilesDirectiveLink = (function () {
    TilesDirectiveLink.$inject = ['$scope', '$element', '$attrs', '$rootScope'];
    function TilesDirectiveLink($scope, $element, $attrs, $rootScope) {
        "ngInject";
        var _this = this;
        this.$element = $element;
        this.$attrs = $attrs;
        this.$rootScope = $rootScope;
        this._columnWidth = $attrs.columnWidth ? Math.floor(Number($attrs.columnWidth)) : 440;
        this._container = $element.children('.pip-tiles-container');
        this._prevContainerWidth = null;
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
Object.defineProperty(exports, "__esModule", { value: true });
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
Object.defineProperty(exports, "__esModule", { value: true });
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
requestFrame.$inject = ['callback'];
addResizeListener.$inject = ['element', 'listener'];
removeResizeListener.$inject = ['element', 'listener'];
Object.defineProperty(exports, "__esModule", { value: true });
var attachEvent = document.attachEvent;
var isIE = navigator.userAgent.match(/Trident/);
function requestFrame(callback) {
    "ngInject";
    var frame = window.requestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.webkitRequestAnimationFrame
        || function (callback) {
            return window.setTimeout(callback, 20);
        };
    return frame(callback);
}
function cancelFrame() {
    "ngInject";
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
    "ngInject";
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
    "ngInject";
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
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipMedia', []);
require("./MediaService");
require("./ResizeFunctions");
__export(require("./IMediaService"));
__export(require("./MediaService"));
__export(require("./ResizeFunctions"));
},{"./IMediaService":13,"./MediaService":14,"./ResizeFunctions":15}]},{},[6])(6)
});

//# sourceMappingURL=pip-webui-layouts.js.map
