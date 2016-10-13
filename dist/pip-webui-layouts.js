/**
 * @file Registration of all application layouts
 * @copyright Digital Living Software Corp. 2014-2015
 */

/* global angular */

(function () {
    'use strict';

    angular.module('pipLayout', [
        'pipLayout.Main', 'pipLayout.Simple', 'pipLayout.Card', 'pipLayout.Document',
        'pipLayout.Tiles', 'pipLayout.Dialog'
    ]);

})();

/**
 * @file Dialog layout
 * @copyright Digital Living Software Corp. 2014-2015
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipLayout.Dialog', []);

    thisModule.directive('pipDialog', function() {
        return {
           restrict: 'EA',
           controller: 'pipDialogController'
        };
    });

    thisModule.controller('pipDialogController', 
        ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
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
                var
                    maxWidth = $window.width(),
                    maxHeight = $window.height(),
                    minWidth = $attrs.minWidth ? Math.floor($attrs.minWidth) : null,
                    minHeight = $attrs.minHeight ? Math.floor($attrs.minHeight) : null,
                    width = $attrs.width ? Math.floor($attrs.width) : null,
                    height = $attrs.height ? Math.floor($attrs.height) : null;

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
            };
        }]
    );

})();

/**
 * @file Card layout
 * @copyright Digital Living Software Corp. 2014-2015
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipLayout.Card', []);

    thisModule.directive('pipCard', function() {
        return {
           restrict: 'EA',
           //controller: 'pipCardController'
            link: function($scope, $element, $attrs) {
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
                    var
                        $mainBody = $('.pip-main-body'),
                        cardContainer = $('.pip-card-container'),
                        windowWidth = $window.width(),
                        maxWidth = $mainBody.width(),
                        maxHeight = $mainBody.height(),
                        minWidth = $attrs.minWidth ? Math.floor($attrs.minWidth) : null,
                        minHeight = $attrs.minHeight ? Math.floor($attrs.minHeight) : null,
                        width = $attrs.width ? Math.floor($attrs.width) : null,
                        height = $attrs.height ? Math.floor($attrs.height) : null,
                        left, top;

                    // Full-screen on phone
                    if (windowWidth <= 768) {
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

                    if (!cardContainer.hasClass('pip-outer-scroll'))
                    {
                        $element.css('max-height', maxHeight ? maxHeight + 'px' : '');
                        $element.css('min-height', minHeight ? minHeight + 'px' : '');
                        var
                            $header = $element.find('.pip-header:visible'),
                            $footer = $element.find('.pip-footer:visible'),
                            $body = $element.find('.pip-body'),
                            maxBodyHeight = maxHeight || $mainBody.height();

                        if ($header.length > 0)
                            maxBodyHeight -= $header.outerHeight(true);
                        if ($footer.length > 0)
                            maxBodyHeight -= $footer.outerHeight(true);

                        $body.css('max-height', maxBodyHeight + 'px');
                    } else {
                        cardContainer.addClass('pip-scroll');
                        if (windowWidth <= 768) {
                            left = 0;
                            top = 0;
                        } else {
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
                };
            }
        }
    });

})();

/**
 * @file Document layout
 * @copyright Digital Living Software Corp. 2014-2015
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipLayout.Document', []);

    thisModule.directive('pipDocument', function() {
        return {
           restrict: 'EA',
           controller: 'pipDocumentController'
        };
    });

    thisModule.controller('pipDocumentController', 
        ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
            // Add class to the element
            $element.addClass('pip-document');
        }]
    );    

})();

/**
 * @file Simple layout
 * @copyright Digital Living Software Corp. 2014-2015
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipLayout.Simple', []);

    thisModule.directive('pipSimple', function() {
       return {
           restrict: 'EA',
           link: function($scope, $element, $attrs) {
                $element.addClass('pip-simple');
           }
       };
    });

})();

/**
 * @file Top-level application container
 * @copyright Digital Living Software Corp. 2014-2015
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipLayout.Main', []);

    thisModule.directive('pipMain', function() {
        return {
           restrict: 'EA',
           controller: 'pipMainController' 
        }
    });

    thisModule.directive('pipMainBody', function() {
       return {
           restrict: 'EA',
           link: function($scope, $element) {
                $element.addClass('pip-main-body');
           }
       };
    });

    thisModule.controller('pipMainController',
        ['$scope', '$element', '$rootScope', function($scope, $element, $rootScope) {
            var $window = $(window);

            // Add CSS class
            $element.addClass('pip-main');

            // Handle window resize events
            $window.bind('resize', resize);

            // Unbind when scope is removed
            $scope.$on('$destroy', function() {
                $rootScope.$size = undefined;
                $window.unbind('resize', resize);
            });

            // Resize window from request
            $rootScope.$on('pipResizeWindow', function(event) {
                // Trigger a bit latter t allow full initialization
                // Do not remove! Otherwise, sizes in layouts calculated incorrectly
                setTimeout(resize, 0);
            });

            // Allow to finish initialization of all controllers
            setTimeout(resize, 0);

            return;
            
            //---------------

            function resize() {
                $rootScope.$broadcast('pipWindowResized');
            }
        }]
    );

})();

/**
 * @file Tiles layout
 * @copyright Digital Living Software Corp. 2014-2015
 */

/* global $, angular, Masonry */

(function () {
    'use strict';

    var thisModule = angular.module('pipLayout.Tiles', ['wu.masonry']);

    thisModule.directive('pipTiles', function() {
       return {
           restrict: 'EA',
           scope: false,
           transclude: true,
           template:
               function($element, $attrs) {
                   if (convertToBoolean($attrs.pipInfinite)) {
                       return  String()
                       + '<div masonry class="pip-tiles-container" load-images="false" preserve-order  '
                       + ' ng-transclude column-width=".pip-tile-sizer" item-selector=".pip-tile"'
                       + ' masonry-options="tilesOptions"  pip-scroll-container="\'.pip-tiles\'"'
                       + ' pip-infinite-scroll="readScroll()" >'
                       + '</div>';
                   } else {
                       return String()
                           + '<div masonry class="pip-tiles-container" load-images="false" preserve-order  '
                           + ' ng-transclude column-width=".pip-tile-sizer" item-selector=".pip-tile"'
                           + ' masonry-options="tilesOptions">'
                           + '</div>';
                   }
               },
           controller: ['$scope', function($scope) {
                $scope.tilesOptions = {
                    gutter: 8,//16
                    isFitWidth: false,
                    isResizeBound: false,
                    transitionDuration: 0 // '0.2s'
                };
           }],
           link: pipTilesController 
        };
    });

    function pipTilesController($scope, $element, $attrs) {
        var
            $window = $(window),
            columnWidth = $attrs.columnWidth ? Math.floor($attrs.columnWidth) : 440,
            container = $element.children('.pip-tiles-container'),
            prevContainerWidth = null,
            masonry = Masonry.data(container[0]);
        
        // Add class to the element
        $element.addClass('pip-tiles');

        // Insert sizer
        var sizer = $('<div class="pip-tile-sizer"></div>');
        sizer.appendTo(container);

        // Resize every time window is resized
        $scope.$on('pipWindowResized', function () {
            resize(false);
        });

        // Force layout by request
        $scope.$on('pipResizeLayout', function () {
            resize(true);
        });

        // Resize the element right away
        resize();

        return;

        //--------------------

        function resize(force) {
            var
                width = $window.width(),
                containerWidth;

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
                } else {
                    sizer.css('width', columnWidth + 'px');
                }

                // +1 to avoid precision related error
                container.css('width', (containerWidth + 1) + 'px');
            } else {
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
        if (value == null) return false;
        if (!value) return false;
        value = value.toString().toLowerCase();
        return value == '1' || value == 'true';
    };

})();

//# sourceMappingURL=pip-webui-layouts.js.map
