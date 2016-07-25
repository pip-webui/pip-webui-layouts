/**
 * @file Sample simple layout
 * @copyright Digital Living Software Corp. 2014-2015
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('app', ['ngMaterial', 'pipLayout']);

    thisModule.controller('AppController', function ($scope, $rootScope) {

        // $rootScope.$on('pipWindowResized', function (event, size) {
        //    console.log('Window width: ' + size.window.width + ' height: ' + size.window.height);
        // });

    });
})(window.angular);
