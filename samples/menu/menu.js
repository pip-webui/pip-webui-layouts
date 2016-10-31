/**
 * @file Sample menu layout
 * @copyright Digital Living Software Corp. 2014-2015
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('appMenu', ['ngMaterial', 'pipLayout']);

    thisModule.controller('MenuController', function ($scope, $rootScope, pipMedia) {
        $scope.items = [
            {id: '7a26e18f78s87ftf8', po: '23432', start: '30 m 7 s ago', last: '12 m 34 s ago', activities: [
                {type: 'POST', time: '30 m 7 sec ago', check: true},
                {type: 'POST', time: '45 m 7 sec ago'},
                {type: 'POST', time: '1 hour 5 m 7 s ago', check: true}
            ]},
            {id: '9f16u18f58s87ftg8', po: '804422', start: '55 m 7 s ago', last: '43 m 34 s ago', activities: [
                {type: 'POST', time: '43 m 6 sec ago', check: true},
                {type: 'POST', time: '55 m 7 sec ago'}
            ]},
            {id: '0k36e18f78s87fsj7', po: '23498', start: '15 m 7 s ago', last: '10 m 34 s ago', activities: [
                {type: 'GET', time: '10 m 45 sec ago', check: true},
                {type: 'POST', time: '14 m 7 sec ago', check: true}
            ]},
            {id: '6k70p58f78t87ftf4', po: '98763', start: '7 m 7 s ago', last: '1 m 34 s ago', activities: [
                {type: 'GET', time: '1 m 6 sec ago', check: true},
                {type: 'POST', time: '2 m 18 sec ago', check: true},
                {type: 'GET', time: '6 m 9 sec ago'}
            ]}
        ];

        $scope.item = $scope.items[0];

        $scope.itemClicked = function (item) {
            $scope.item = item;

            //if (pipMedia('xs')) {
            //    $location.replace().search({id: item.id});
            //}
        };

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

