(function () {
    'use strict';
    angular.module('pipLayout', [
        'pipLayout.Main', 'pipLayout.Simple', 'pipLayout.Card', 'pipLayout.Document',
        'pipLayout.Tiles', 'pipLayout.Dialog', 'pipLayout.Media'
    ]);
})();

(function () {
    'use strict';
    var thisModule = angular.module('pipLayout.Card', []);
    thisModule.directive('pipCard', function () {
        return {
            restrict: 'EA',
            link: function ($scope, $element, $attrs) {
                var $window = $(window);
                $element.addClass('pip-card');
                $scope.$on('pipWindowResized', resize);
                resize();
                setTimeout(resize, 100);
                return;
                function resize() {
                    var $mainBody = $('.pip-main-body'), cardContainer = $('.pip-card-container'), windowWidth = $window.width(), maxWidth = $mainBody.width(), maxHeight = $mainBody.height(), minWidth = $attrs.minWidth ? Math.floor($attrs.minWidth) : null, minHeight = $attrs.minHeight ? Math.floor($attrs.minHeight) : null, width = $attrs.width ? Math.floor($attrs.width) : null, height = $attrs.height ? Math.floor($attrs.height) : null, left, top;
                    if (windowWidth <= 768) {
                        minWidth = null;
                        minHeight = null;
                        width = null;
                        height = null;
                        maxWidth = null;
                        maxHeight = null;
                    }
                    else {
                        var space = windowWidth > 1200 ? 24 : 16;
                        maxWidth -= space * 2;
                        maxHeight -= space * 2;
                        minWidth = minWidth ? Math.min(minWidth, maxWidth) : null;
                        minHeight = minHeight ? Math.min(minHeight, maxHeight) : null;
                        width = width ? Math.min(width, maxWidth) : null;
                        height = height ? Math.min(height, maxHeight) : null;
                    }
                    $element.css('max-width', maxWidth ? maxWidth + 'px' : '');
                    $element.css('min-width', minWidth ? minWidth + 'px' : '');
                    $element.css('width', width ? width + 'px' : '');
                    $element.css('height', height ? height + 'px' : '');
                    if (!cardContainer.hasClass('pip-outer-scroll')) {
                        $element.css('max-height', maxHeight ? maxHeight + 'px' : '');
                        $element.css('min-height', minHeight ? minHeight + 'px' : '');
                        var $header = $element.find('.pip-header:visible'), $footer = $element.find('.pip-footer:visible'), $body = $element.find('.pip-body'), maxBodyHeight = maxHeight || $mainBody.height();
                        if ($header.length > 0)
                            maxBodyHeight -= $header.outerHeight(true);
                        if ($footer.length > 0)
                            maxBodyHeight -= $footer.outerHeight(true);
                        $body.css('max-height', maxBodyHeight + 'px');
                    }
                    else {
                        cardContainer.addClass('pip-scroll');
                        if (windowWidth <= 768) {
                            left = 0;
                            top = 0;
                        }
                        else {
                            left = cardContainer.width() / 2 - $element.width() / 2 - 16;
                            top = Math.max(cardContainer.height() / 2 - $element.height() / 2 - 16, 0);
                        }
                        $element.css('left', left);
                        $element.css('top', top);
                        setTimeout(function () {
                            $element.css('display', 'flex');
                        }, 100);
                    }
                    $scope.$broadcast('pipLayoutResized');
                }
                ;
            }
        };
    });
})();

(function () {
    'use strict';
    var thisModule = angular.module('pipLayout.Dialog', []);
    thisModule.directive('pipDialog', function () {
        return {
            restrict: 'EA',
            controller: 'pipDialogController'
        };
    });
    thisModule.controller('pipDialogController', ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
        var $window = $(window);
        $element.addClass('pip-dialog');
        $scope.$on('pipWindowResized', resize);
        $scope.$on('pipResizeLayout', resize);
        resize();
        $window.trigger('resize');
        return;
        function resize() {
            var maxWidth = $window.width(), maxHeight = $window.height(), minWidth = $attrs.minWidth ? Math.floor($attrs.minWidth) : null, minHeight = $attrs.minHeight ? Math.floor($attrs.minHeight) : null, width = $attrs.width ? Math.floor($attrs.width) : null, height = $attrs.height ? Math.floor($attrs.height) : null;
            var space = maxWidth > 1200 ? 24 : 16;
            maxWidth -= space * 2;
            maxHeight -= space * 2;
            minWidth = minWidth && minWidth < maxWidth ? minWidth : null;
            minHeight = minHeight && minHeight < maxHeight ? minHeight : null;
            width = width ? Math.min(width, maxWidth) : null;
            height = height ? Math.min(height, maxHeight) : null;
            $element.css('max-width', maxWidth ? maxWidth + 'px' : '');
            $element.css('max-height', maxHeight ? maxHeight + 'px' : '');
            $element.css('min-width', minWidth ? minWidth + 'px' : '');
            $element.css('min-height', minHeight ? minHeight + 'px' : '');
            $element.css('width', width ? width + 'px' : '');
            $element.css('height', height ? height + 'px' : '');
            $scope.$broadcast('pipLayoutResized');
        }
        ;
    }]);
})();

(function () {
    'use strict';
    var thisModule = angular.module('pipLayout.Document', []);
    thisModule.directive('pipDocument', function () {
        return {
            restrict: 'EA',
            controller: 'pipDocumentController'
        };
    });
    thisModule.controller('pipDocumentController', ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
        $element.addClass('pip-document');
    }]);
})();

(function () {
    'use strict';
    var thisModule = angular.module('pipLayout.Main', []);
    thisModule.directive('pipMain', function () {
        return {
            restrict: 'EA',
            controller: 'pipMainController'
        };
    });
    thisModule.directive('pipMainBody', function () {
        return {
            restrict: 'EA',
            link: function ($scope, $element) {
                $element.addClass('pip-main-body');
            }
        };
    });
    thisModule.controller('pipMainController', ['$scope', '$element', '$rootScope', 'pipMedia', function ($scope, $element, $rootScope, pipMedia) {
        var $window = $(window);
        $element.addClass('pip-main');
        pipMedia().addResizeListener($element[0], resize);
        $scope.$on('$destroy', function () {
            pipMedia().removeResizeListener($element[0]);
        });
        return;
        function resize() {
            $rootScope.$broadcast('pipWindowResized');
        }
    }]);
})();

(function () {
    'use strict';
    var thisModule = angular.module('pipLayout.Media', []);
    thisModule.service('pipMedia', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
        var elementWidth = null, sizes = {
            'xs': false,
            'gt-xs': false,
            'sm': false,
            'gt-sm': false,
            'md': false,
            'gt-md': false,
            'lg': false,
            'gt-lg': false,
            'xl': false
        }, attachEvent = document.attachEvent, isIE = navigator.userAgent.match(/Trident/);
        return function (size) {
            if (size) {
                return sizes[size];
            }
            else {
                return {
                    addResizeListener: addResizeListener,
                    removeResizeListener: removeResizeListener
                };
            }
        };
        function requestFrame(fn) {
            var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
                function (fn) { return window.setTimeout(fn, 20); };
            return raf(fn);
        }
        function cancelFrame() {
            var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame ||
                window.clearTimeout;
            return function (id) { return cancel(id); };
        }
        function resizeListener(e) {
            var win = e.target || e.srcElement;
            if (win.__resizeRAF__)
                cancelFrame();
            win.__resizeRAF__ = requestFrame(function () {
                var trigger = win.__resizeTrigger__;
                trigger.__resizeListeners__.forEach(function (fn) {
                    fn.call(trigger, e);
                });
            });
        }
        function objectLoad(e) {
            this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__;
            this.contentDocument.defaultView.addEventListener('resize', resizeListener);
        }
        function addResizeListener(element, fn) {
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
                    obj.onload = objectLoad;
                    obj.type = 'text/html';
                    if (isIE)
                        element.appendChild(obj);
                    obj.data = 'about:blank';
                    if (!isIE)
                        element.appendChild(obj);
                }
            }
            setSizes();
            if (fn)
                element.__resizeListeners__.push(fn);
            element.__resizeListeners__.push(setSizes);
        }
        function removeResizeListener(element, fn) {
            if (fn)
                element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
            if (!element.__resizeListeners__.length) {
                if (attachEvent)
                    element.detachEvent('onresize', resizeListener);
                else {
                    element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', resizeListener);
                    element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__);
                }
            }
        }
        function updateClasses() {
            $.each(sizes, function (name, size) {
                $('body')[size ? 'addClass' : 'removeClass']('pip-' + name);
            });
        }
        function setSizes() {
            elementWidth = $('.pip-main').innerWidth();
            sizes['xs'] = elementWidth <= 599;
            sizes['gt-xs'] = elementWidth >= 600;
            sizes['sm'] = elementWidth >= 600 && elementWidth <= 959;
            sizes['gt-sm'] = elementWidth >= 960;
            sizes['md'] = elementWidth >= 960 && elementWidth <= 1279;
            sizes['gt-md'] = elementWidth >= 1280;
            sizes['lg'] = elementWidth >= 1280 && elementWidth <= 1919;
            sizes['gt-lg'] = elementWidth >= 1920;
            sizes['xl'] = sizes['gt-lg'];
            updateClasses();
            $timeout(function () {
                $rootScope.$apply();
            });
        }
    }]);
})();

(function () {
    'use strict';
    var thisModule = angular.module('pipLayout.Simple', []);
    thisModule.directive('pipSimple', function () {
        return {
            restrict: 'EA',
            link: function ($scope, $element, $attrs) {
                $element.addClass('pip-simple');
            }
        };
    });
})();

(function () {
    'use strict';
    var thisModule = angular.module('pipLayout.Tiles', ['wu.masonry']);
    thisModule.directive('pipTiles', function () {
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
            link: pipTilesController
        };
    });
    function pipTilesController($scope, $element, $attrs) {
        var $window = $(window), columnWidth = $attrs.columnWidth ? Math.floor($attrs.columnWidth) : 440, container = $element.children('.pip-tiles-container'), prevContainerWidth = null, masonry = Masonry.data(container[0]);
        $element.addClass('pip-tiles');
        var sizer = $('<div class="pip-tile-sizer"></div>');
        sizer.appendTo(container);
        $scope.$on('pipWindowResized', function () {
            console.log('resize tiles');
            resize(false);
        });
        resize(true);
        return;
        function resize(force) {
            var width = $window.width(), containerWidth;
            if (width > 767) {
                width = width - 24 * 2;
                var columns = Math.floor(width / columnWidth);
                containerWidth = (columnWidth + 16) * columns - 16;
                if (containerWidth > width) {
                    columns--;
                    containerWidth = (columnWidth + 16) * columns - 16;
                }
                if (columns < 1) {
                    containerWidth = width;
                    sizer.css('width', containerWidth + 'px');
                }
                else {
                    sizer.css('width', columnWidth + 'px');
                }
                container.css('width', (containerWidth + 1) + 'px');
            }
            else {
                width = width - 16 * 2;
                containerWidth = width;
                sizer.css('width', containerWidth + 'px');
                container.css('width', (containerWidth + 1) + 'px');
            }
            if (prevContainerWidth != containerWidth || force) {
                prevContainerWidth = containerWidth;
                masonry.layout();
                $scope.$broadcast('pipLayoutResized');
            }
        }
    }
    function convertToBoolean(value) {
        if (value == null)
            return false;
        if (!value)
            return false;
        value = value.toString().toLowerCase();
        return value == '1' || value == 'true';
    }
    ;
})();



//# sourceMappingURL=pip-webui-layouts.js.map
