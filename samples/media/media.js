/**
 * @file Sample media service
 * @copyright Digital Living Software Corp. 2014-2015
 */

((angular) => {
    'use strict';

    var thisModule = angular.module('appMedia', ['ngMaterial', 'pipLayout']);

    thisModule.controller('MediaController', function ($scope, $rootScope, pipMedia, $mdSidenav, pipAuxPanel) {
        $scope.pipMedia = pipMedia;

        pipAuxPanel.close();
        $scope.trigRightPanel = function () {
            $rootScope.rightPanel = !$rootScope.rightPanel;
        }

        $rootScope.layoutTitle = "Media service";
        $scope.onToggleMenu = function () {
            $mdSidenav('left').toggle();
        };

        $scope.showAuxPanel = function () {
            $scope.panel = true;
            pipAuxPanel.open();
        }

        $scope.hideAuxPanel = function () {
            $scope.panel = false;
            pipAuxPanel.close();
        }

    });
})(window.angular);
