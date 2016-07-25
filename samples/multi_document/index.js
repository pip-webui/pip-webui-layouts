/**
 * @file Sample multi document layout
 * @copyright Digital Living Software Corp. 2014-2015
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('app', ['ngMaterial', 'pipLayout']);

    thisModule.controller('AppController', function ($scope, $rootScope, $mdMedia) {
        $scope.$mdMedia = $mdMedia;

    });
})(window.angular);
