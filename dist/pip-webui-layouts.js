/**
 * @file Registration of all application layouts
 * @copyright Digital Living Software Corp. 2014-2015
 */
/* global angular */
(function () {
    'use strict';
    angular.module('pipLayout', [
        'pipLayout.Main', 'pipLayout.Simple', 'pipLayout.Card', 'pipLayout.Document',
        'pipLayout.Tiles', 'pipLayout.Dialog', 'pipLayout.Media'
    ]);
})();

/**
 * @file Card layout
 * @copyright Digital Living Software Corp. 2014-2015
 */
/* global angular */
(function () {
    'use strict';
    var thisModule = angular.module('pipLayout.Card', []);
    thisModule.directive('pipCard', function () {
        return {
            restrict: 'EA',
            //controller: 'pipCardController'
            link: function ($scope, $element, $attrs) {
                var $window = $(window);
                // Add class to the element
                $element.addClass('pip-card');
                // Resize every time window is resized
                $scope.$on('pipWindowResized', resize);
                // Resize right away to avoid flicking
                resize();
                // Resize the element right away
                setTimeout(resize, 100);
                return;
                //---------------
                function resize() {
                    var $mainBody = $('.pip-main-body'), cardContainer = $('.pip-card-container'), windowWidth = $window.width(), maxWidth = $mainBody.width(), maxHeight = $mainBody.height(), minWidth = $attrs.minWidth ? Math.floor($attrs.minWidth) : null, minHeight = $attrs.minHeight ? Math.floor($attrs.minHeight) : null, width = $attrs.width ? Math.floor($attrs.width) : null, height = $attrs.height ? Math.floor($attrs.height) : null, left, top;
                    // Full-screen on phone
                    if (windowWidth <= 768) {
                        minWidth = null;
                        minHeight = null;
                        width = null;
                        height = null;
                        maxWidth = null;
                        maxHeight = null;
                    }
                    else {
                        // Set margin and maximum dimensions
                        var space = windowWidth > 1200 ? 24 : 16;
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
                    // Notify child controls that layout was resized
                    $scope.$broadcast('pipLayoutResized');
                }
                ;
            }
        };
    });
})();

/**
 * @file Dialog layout
 * @copyright Digital Living Software Corp. 2014-2015
 */
/* global angular */
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
        // Add class to the element
        $element.addClass('pip-dialog');
        // Resize every time window is resized
        $scope.$on('pipWindowResized', resize);
        $scope.$on('pipResizeLayout', resize);
        // Resize right away to avoid flicking
        resize();
        // Resize the element right away
        //setTimeout(resize, 0);
        $window.trigger('resize');
        return;
        //-----------------------
        function resize() {
            var maxWidth = $window.width(), maxHeight = $window.height(), minWidth = $attrs.minWidth ? Math.floor($attrs.minWidth) : null, minHeight = $attrs.minHeight ? Math.floor($attrs.minHeight) : null, width = $attrs.width ? Math.floor($attrs.width) : null, height = $attrs.height ? Math.floor($attrs.height) : null;
            // Set margin and maximum dimensions
            var space = maxWidth > 1200 ? 24 : 16;
            maxWidth -= space * 2;
            maxHeight -= space * 2;
            // Set minimum dimensions
            minWidth = minWidth && minWidth < maxWidth ? minWidth : null;
            minHeight = minHeight && minHeight < maxHeight ? minHeight : null;
            // Set regular dimensions
            width = width ? Math.min(width, maxWidth) : null;
            height = height ? Math.min(height, maxHeight) : null;
            // Set dimensions
            $element.css('max-width', maxWidth ? maxWidth + 'px' : '');
            $element.css('max-height', maxHeight ? maxHeight + 'px' : '');
            $element.css('min-width', minWidth ? minWidth + 'px' : '');
            $element.css('min-height', minHeight ? minHeight + 'px' : '');
            $element.css('width', width ? width + 'px' : '');
            $element.css('height', height ? height + 'px' : '');
            // Notify child controls that layout was resized
            $scope.$broadcast('pipLayoutResized');
        }
        ;
    }]);
})();

/**
 * @file Top-level application container
 * @copyright Digital Living Software Corp. 2014-2015
 */
/* global angular */
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
        // Add CSS class
        $element.addClass('pip-main');
        pipMedia().addResizeListener($element[0], resize);
        // Handle window resize events
        //$window.bind('resize', resize);
        // Unbind when scope is removed
        $scope.$on('$destroy', function () {
            pipMedia().removeResizeListener($element[0]);
            //$window.unbind('resize', resize);
        });
        // Resize window from request
        //$rootScope.$on('pipResizeWindow', function(event) {
        //    // Trigger a bit latter t allow full initialization
        //    // Do not remove! Otherwise, sizes in layouts calculated incorrectly
        //    setTimeout(resize, 0);
        //});
        // Allow to finish initialization of all controllers
        //setTimeout(resize, 0);
        return;
        //---------------
        function resize() {
            $rootScope.$broadcast('pipWindowResized');
        }
    }]);
})();

/**
 * @file Document layout
 * @copyright Digital Living Software Corp. 2014-2015
 */
/* global angular */
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
        // Add class to the element
        $element.addClass('pip-document');
    }]);
})();

/**
 * @file Media service to detect the width of pip-main container
 * @copyright Digital Living Software Corp. 2014-2016
 */
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

/**
 * @file Simple layout
 * @copyright Digital Living Software Corp. 2014-2015
 */
/* global angular */
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

/**
 * @file Tiles layout
 * @copyright Digital Living Software Corp. 2014-2015
 */
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
                    transitionDuration: 0 // '0.2s'
                };
            }],
            link: pipTilesController
        };
    });
    function pipTilesController($scope, $element, $attrs) {
        var $window = $(window), columnWidth = $attrs.columnWidth ? Math.floor($attrs.columnWidth) : 440, container = $element.children('.pip-tiles-container'), prevContainerWidth = null, masonry = Masonry.data(container[0]);
        // Add class to the element
        $element.addClass('pip-tiles');
        // Insert sizer
        var sizer = $('<div class="pip-tile-sizer"></div>');
        sizer.appendTo(container);
        // Resize every time window is resized
        $scope.$on('pipWindowResized', function () {
            console.log('resize tiles');
            resize(false);
        });
        // Force layout by request
        //$scope.$on('pipResizeLayout', function () {
        //    resize(true);
        //});
        // Resize the element right away
        resize(true);
        return;
        //--------------------
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
                // +1 to avoid precision related error
                container.css('width', (containerWidth + 1) + 'px');
            }
            else {
                width = width - 16 * 2;
                containerWidth = width;
                sizer.css('width', containerWidth + 'px');
                // +1 to avoid precision related error
                container.css('width', (containerWidth + 1) + 'px');
            }
            // Manually call layout on tile container
            if (prevContainerWidth != containerWidth || force) {
                prevContainerWidth = containerWidth;
                masonry.layout();
                // Notify child controls that layout was resized
                $scope.$broadcast('pipLayoutResized');
            }
        }
    }
    // Converts value into boolean
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
