/**
 * @file Sample media service
 * @copyright Digital Living Software Corp. 2014-2015
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('appMedia', ['ngMaterial', 'pipLayout']);

    thisModule.controller('MediaController', function ($scope, $rootScope, pipMedia) {
        $scope.pipMedia = pipMedia;

        $scope.trigRightPanel = function () {
            $rootScope.rightPanel = !$rootScope.rightPanel;
        }

    });
})(window.angular);
