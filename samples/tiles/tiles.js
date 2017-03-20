/**
 * @file Sample tiles layout
 * @copyright Digital Living Software Corp. 2014-2015
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('appTiles', ['ngMaterial', 'pipLayout']);

    thisModule.controller('TilesController', function ($scope, $rootScope, $mdSidenav, pipAuxPanel) {
        $scope.tiles = [
            { name: 'Tile #1', size: 'tile-lg', color: 'bg-red' },
            { name: 'Tile #2', size: 'tile-md', color: 'bg-green' },
            { name: 'Tile #3', size: 'tile-sm', color: 'bg-blue' },
            { name: 'Tile #4', size: 'tile-sm', color: 'bg-yellow' },
            { name: 'Tile #5', size: 'tile-lg', color: 'bg-green' },
            { name: 'Tile #6', size: 'tile-sm', color: 'bg-blue' },
            { name: 'Tile #7', size: 'tile-md', color: 'bg-red' },
            { name: 'Tile #8', size: 'tile-lg', color: 'bg-yellow' },
            { name: 'Tile #9', size: 'tile-lg', color: 'bg-red' },
            { name: 'Tile #10', size: 'tile-md', color: 'bg-green' },
            { name: 'Tile #11', size: 'tile-sm', color: 'bg-blue' },
            { name: 'Tile #12', size: 'tile-sm', color: 'bg-yellow' },
            { name: 'Tile #13', size: 'tile-lg', color: 'bg-green' },
            { name: 'Tile #14', size: 'tile-sm', color: 'bg-blue' },
            { name: 'Tile #15', size: 'tile-md', color: 'bg-red' },
            { name: 'Tile #16', size: 'tile-lg', color: 'bg-yellow' }
        ];

        $scope.item = {
            id: '7a26e18f78s87ftf8', po: '23432', start: '30 m 7 s ago', last: '12 m 34 s ago', activities: [
                { type: 'POST', time: '30 m 7 sec ago', check: true },
                { type: 'POST', time: '45 m 7 sec ago' },
                { type: 'POST', time: '1 hour 5 m 7 s ago', check: true }
            ]
        };

        $rootScope.layoutTitle = "Tiles layout";
        
            pipAuxPanel.close();

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
