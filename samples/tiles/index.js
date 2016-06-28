/**
 * @file Sample tiles layout
 * @copyright Digital Living Software Corp. 2014-2015
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('app', ['ngMaterial', 'pipLayout']);

    thisModule.controller('AppController', function ($scope) {
        $scope.tiles = [
            {name: 'Tile #1', size: 'tile-lg', color: 'bg-red'},
            {name: 'Tile #2', size: 'tile-md', color: 'bg-green'},
            {name: 'Tile #3', size: 'tile-sm', color: 'bg-blue'},
            {name: 'Tile #4', size: 'tile-sm', color: 'bg-yellow'},
            {name: 'Tile #5', size: 'tile-lg', color: 'bg-green'},
            {name: 'Tile #6', size: 'tile-sm', color: 'bg-blue'},
            {name: 'Tile #7', size: 'tile-md', color: 'bg-red'},
            {name: 'Tile #8', size: 'tile-lg', color: 'bg-yellow'},
            {name: 'Tile #9', size: 'tile-lg', color: 'bg-red'},
            {name: 'Tile #10', size: 'tile-md', color: 'bg-green'},
            {name: 'Tile #11', size: 'tile-sm', color: 'bg-blue'},
            {name: 'Tile #12', size: 'tile-sm', color: 'bg-yellow'},
            {name: 'Tile #13', size: 'tile-lg', color: 'bg-green'},
            {name: 'Tile #14', size: 'tile-sm', color: 'bg-blue'},
            {name: 'Tile #15', size: 'tile-md', color: 'bg-red'},
            {name: 'Tile #16', size: 'tile-lg', color: 'bg-yellow'}
        ];
    });
})(window.angular);
