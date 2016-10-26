/**
 * @file Tiles layout
 * @copyright Digital Living Software Corp. 2014-2015
 */

/* global $, angular, Masonry */

declare var Masonry: any;

(function () {
    'use strict';

    var thisModule = angular.module('pipLayout.Tiles', ['wu.masonry']);

    thisModule.directive('pipTiles', function() {
       return {
           restrict: 'EA',
           scope: false,
           transclude: true,
           template:
               function($element, $attrs: any) {
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
           controller: function($scope: any) {
                $scope.tilesOptions = {
                    gutter: 8,//16
                    isFitWidth: false,
                    isResizeBound: false,
                    transitionDuration: 0 // '0.2s'
                };
           },
           link: pipTilesController 
        };
    });

    function pipTilesController($scope: any, $element, $attrs: any) {
        var
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

        // Resize the element right away
        resize(true);

        return;

        //---------------------

        function resize(force) {
            var
                width = $('.pip-main').width(),
                containerWidth;
            
            console.log('width', width);

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

                // +10 to avoid precision related error
                container.css('width', (containerWidth + 10) + 'px');
                container.removeClass('pip-mobile');
            } else {
                width = width - 16 * 2;
                containerWidth = width;

                sizer.css('width', containerWidth + 'px');
                // +10 to avoid precision related error
                container.css('width', (containerWidth + 10) + 'px');
                container.addClass('pip-mobile');
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
