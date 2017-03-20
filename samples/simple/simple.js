/**
 * @file Sample simple layout
 * @copyright Digital Living Software Corp. 2014-2015
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('appSimple', ['ngMaterial', 'pipLayout']);

    thisModule.controller('SimpleController', function ($scope, $rootScope, $mdSidenav) {
        $scope.item = {id: '7a26e18f78s87ftf8', po: '23432', start: '30 m 7 s ago', last: '12 m 34 s ago', activities: [
            {type: 'POST', time: '30 m 7 sec ago', check: true},
            {type: 'POST', time: '45 m 7 sec ago'},
            {type: 'POST', time: '1 hour 5 m 7 s ago', check: true}
        ]};

        $rootScope.layoutTitle = "Simple layout";
         $scope.onToggleMenu = function() {
                $mdSidenav('left').toggle();
            };
    });
})(window.angular);
