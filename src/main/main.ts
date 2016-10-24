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
        function($scope, $element, $rootScope, pipMedia) {
            var $window: any = $(window);

            // Add CSS class
            $element.addClass('pip-main');

            pipMedia().addResizeListener($element[0], resize);

            // Handle window resize events
            //$window.bind('resize', resize);

            // Unbind when scope is removed
            $scope.$on('$destroy', function() {
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
        }
    );

})();
