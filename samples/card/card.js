/**
 * @file Sample card layout
 * @copyright Digital Living Software Corp. 2014-2015
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('appCard', ['ngMaterial', 'pipLayout']);

    thisModule.controller('CardController', function ($scope, $rootScope, $mdSidenav, pipAuxPanel) {

        pipAuxPanel.close();
        $scope.item = {
            id: '7a26e18f78s87ftf8', po: '23432', start: '30 m 7 s ago', last: '12 m 34 s ago', activities: [
                { type: 'POST', time: '30 m 7 sec ago', check: true },
                { type: 'POST', time: '45 m 7 sec ago' },
                { type: 'POST', time: '1 hour 5 m 7 s ago', check: true }
            ]
        };

        $rootScope.layoutTitle = "Card layout";
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
