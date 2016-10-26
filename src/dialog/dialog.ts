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
           restrict: 'EAC',
           controller: 'pipDialogController'
        };
    });

    thisModule.controller('pipDialogController', 
        function($element, $attrs) {
            // Add class to the element
            $element.addClass('pip-dialog');
            // Set width
            $element.css('width', $attrs.width);

            return;
        }
    );

})();
